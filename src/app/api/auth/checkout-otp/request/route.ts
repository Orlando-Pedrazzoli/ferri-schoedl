// src/app/api/auth/checkout-otp/request/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Customer from '@/models/Customer';
import { isDisposableEmail } from '@/lib/disposable-emails';
import { sendOTP } from '@/lib/resend';
import { rateLimit } from '@/lib/rate-limit';
import { generateOtpCode, hashOtpCode, getOtpExpiry } from '@/lib/otp';

/**
 * POST /api/auth/checkout-otp/request
 *
 * Recebe { email, name? } e decide o fluxo:
 * - Se email existe como customer COM password → { mode: 'login' } (pede senha)
 * - Se email existe como customer SEM password (conta criada via OTP antes) → envia OTP
 * - Se email não existe → envia OTP (será criado no verify)
 *
 * Resposta:
 *   { mode: 'otp' | 'login', emailExists: boolean }
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 5 solicitações por IP/hora
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded?.split(',')[0]?.trim() || 'unknown';
    const { limited } = rateLimit(`otp-request:${ip}`, 5, 60 * 60 * 1000);
    if (limited) {
      return NextResponse.json(
        { error: 'Muitas tentativas. Tente novamente em alguns minutos.' },
        { status: 429 },
      );
    }

    const body = await request.json();
    const email =
      typeof body.email === 'string' ? body.email.toLowerCase().trim() : '';
    const name = typeof body.name === 'string' ? body.name.trim() : '';

    // Validações
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: 'Email inválido.' }, { status: 400 });
    }

    if (isDisposableEmail(email)) {
      return NextResponse.json(
        { error: 'Este tipo de email não é aceite. Use um email permanente.' },
        { status: 400 },
      );
    }

    await dbConnect();

    // Procurar customer existente (com select de password para saber se tem)
    const customer = await Customer.findOne({ email }).select('+password');

    // Caso 1: customer existe E tem password definida → fluxo de login tradicional
    if (customer && customer.password) {
      return NextResponse.json({
        mode: 'login',
        emailExists: true,
      });
    }

    // Caso 2: customer existe sem password OU não existe → enviar OTP
    const code = generateOtpCode();
    const codeHash = hashOtpCode(code);
    const expires = getOtpExpiry();

    if (customer) {
      // Customer existente sem password → atualizar OTP
      await Customer.updateOne(
        { _id: customer._id },
        {
          otpCode: codeHash,
          otpExpires: expires,
          otpAttempts: 0,
        },
      );

      const emailResult = await sendOTP(customer.email, customer.name, code);
      if (!emailResult.success) {
        return NextResponse.json(
          { error: 'Não foi possível enviar o código. Tente novamente.' },
          { status: 500 },
        );
      }

      return NextResponse.json({
        mode: 'otp',
        emailExists: true,
      });
    }

    // Customer não existe → guardar OTP em coleção temporária
    // Estratégia: criamos registro parcial de customer com flag isPending.
    // Mas como o schema exige cpf/phone/password, usamos upsert por email
    // num doc com dados mínimos, finalizando no verify.
    //
    // Solução escolhida: NÃO criar customer ainda. Guardamos o OTP em memória
    // do próprio processo via rateLimit não resolve (distribuído falha),
    // então persistimos num doc "stub" com campos mínimos placeholder
    // e marcamos pela ausência de password.
    //
    // Como o schema atual exige password/cpf/phone como required, a forma
    // mais limpa é: guardar OTP num documento separado. Porém, para não
    // criar nova collection, usamos um Customer "pendente" com valores
    // temporários que serão sobrescritos no verify. Isso exige ajuste:
    // melhor abordagem → criar model PendingSignup.
    //
    // Para manter simples e evitar nova collection, vamos usar um campo
    // escape: guardar OTP num Map em memória do servidor via uma rota
    // stateless NÃO funciona em serverless. Então a solução correta é:
    //
    //   Guardar o OTP no próprio documento Customer com valores placeholder
    //   e completar no verify.
    //
    // MAS o schema tem CPF unique — não podemos usar placeholder repetível.
    //
    // Solução final: armazenar OTP e dados no mongoose Collection genérica
    // via um model PendingOtp (ver arquivo abaixo).

    // Import dinâmico do PendingOtp para evitar circular imports
    const { default: PendingOtp } = await import('@/models/PendingOtp');

    await PendingOtp.findOneAndUpdate(
      { email },
      {
        email,
        name: name || email.split('@')[0],
        otpCode: codeHash,
        otpExpires: expires,
        otpAttempts: 0,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    const emailResult = await sendOTP(email, name || email.split('@')[0], code);
    if (!emailResult.success) {
      return NextResponse.json(
        { error: 'Não foi possível enviar o código. Tente novamente.' },
        { status: 500 },
      );
    }

    return NextResponse.json({
      mode: 'otp',
      emailExists: false,
    });
  } catch (error) {
    console.error('[CheckoutOtp/Request] Erro:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor.' },
      { status: 500 },
    );
  }
}
