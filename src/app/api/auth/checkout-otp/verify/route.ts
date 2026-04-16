// src/app/api/auth/checkout-otp/verify/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/mongodb';
import Customer from '@/models/Customer';
import PendingOtp from '@/models/PendingOtp';
import { isValidCPF, sanitizeCPF } from '@/lib/cpf';
import { rateLimit } from '@/lib/rate-limit';
import { hashOtpCode, MAX_OTP_ATTEMPTS } from '@/lib/otp';
import { generateOtpSignature } from '@/lib/auth';

/**
 * POST /api/auth/checkout-otp/verify
 *
 * Recebe { email, code, name, cpf, phone } e:
 * - Valida o OTP (para customer existente ou pending)
 * - Se customer não existia, cria com emailVerified=true (OTP serve como verificação)
 * - Se existia sem password, atualiza dados + emailVerified=true
 * - Gera password aleatória interna (cliente nunca precisará usar — login é via OTP ou reset)
 * - Retorna otpSignature (HMAC) que o frontend usa em signIn('otp', {...})
 *
 * Resposta:
 *   {
 *     success: true,
 *     customerId: string,
 *     email: string,
 *     otpSignature: string,
 *     action: 'existing' | 'created'
 *   }
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 10 tentativas por IP/hora
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded?.split(',')[0]?.trim() || 'unknown';
    const { limited } = rateLimit(`otp-verify:${ip}`, 10, 60 * 60 * 1000);
    if (limited) {
      return NextResponse.json(
        { error: 'Muitas tentativas. Tente novamente em alguns minutos.' },
        { status: 429 },
      );
    }

    const body = await request.json();
    const email =
      typeof body.email === 'string' ? body.email.toLowerCase().trim() : '';
    const code = typeof body.code === 'string' ? body.code.trim() : '';
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const cpf = typeof body.cpf === 'string' ? body.cpf : '';
    const phone = typeof body.phone === 'string' ? body.phone : '';

    // Validações básicas
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: 'Email inválido.' }, { status: 400 });
    }
    if (!code || !/^\d{6}$/.test(code)) {
      return NextResponse.json({ error: 'Código inválido.' }, { status: 400 });
    }

    await dbConnect();

    const codeHash = hashOtpCode(code);

    // ====================================================================
    // CASO 1: Customer já existe
    // ====================================================================
    const existingCustomer = await Customer.findOne({ email }).select(
      '+otpCode +otpExpires +otpAttempts',
    );

    if (existingCustomer) {
      // Verificar limite de tentativas
      if ((existingCustomer.otpAttempts ?? 0) >= MAX_OTP_ATTEMPTS) {
        return NextResponse.json(
          { error: 'Muitas tentativas inválidas. Solicite um novo código.' },
          { status: 429 },
        );
      }

      // Verificar expiração
      if (
        !existingCustomer.otpExpires ||
        existingCustomer.otpExpires.getTime() < Date.now()
      ) {
        return NextResponse.json(
          { error: 'Código expirado. Solicite um novo.' },
          { status: 400 },
        );
      }

      // Comparar hash do código
      if (existingCustomer.otpCode !== codeHash) {
        await Customer.updateOne(
          { _id: existingCustomer._id },
          { $inc: { otpAttempts: 1 } },
        );
        return NextResponse.json(
          { error: 'Código incorreto.' },
          { status: 400 },
        );
      }

      // OTP válido → marcar email verificado e limpar OTP
      await Customer.updateOne(
        { _id: existingCustomer._id },
        {
          $set: {
            emailVerified: true,
            otpCode: null,
            otpExpires: null,
            otpAttempts: 0,
          },
        },
      );

      return NextResponse.json({
        success: true,
        customerId: existingCustomer._id.toString(),
        email: existingCustomer.email,
        otpSignature: generateOtpSignature(
          existingCustomer._id.toString(),
          existingCustomer.email,
        ),
        action: 'existing',
      });
    }

    // ====================================================================
    // CASO 2: Customer não existe → criar nova conta
    // ====================================================================

    // Validar campos adicionais obrigatórios para criação
    if (!name || name.length < 2) {
      return NextResponse.json(
        { error: 'Nome é obrigatório.' },
        { status: 400 },
      );
    }
    if (!cpf || !isValidCPF(cpf)) {
      return NextResponse.json({ error: 'CPF inválido.' }, { status: 400 });
    }
    if (!phone || phone.replace(/\D/g, '').length < 10) {
      return NextResponse.json(
        { error: 'Telefone inválido.' },
        { status: 400 },
      );
    }

    // Verificar CPF duplicado (pode ter conta com outro email)
    const sanitizedCPF = sanitizeCPF(cpf);
    const cpfExists = await Customer.findOne({ cpf: sanitizedCPF });
    if (cpfExists) {
      return NextResponse.json(
        { error: 'Este CPF já está registado em outra conta.' },
        { status: 409 },
      );
    }

    // Buscar PendingOtp
    const pending = await PendingOtp.findOne({ email });
    if (!pending) {
      return NextResponse.json(
        { error: 'Solicite um novo código.' },
        { status: 400 },
      );
    }

    // Verificar limite de tentativas
    if (pending.otpAttempts >= MAX_OTP_ATTEMPTS) {
      await PendingOtp.deleteOne({ _id: pending._id });
      return NextResponse.json(
        { error: 'Muitas tentativas inválidas. Solicite um novo código.' },
        { status: 429 },
      );
    }

    // Verificar expiração
    if (pending.otpExpires.getTime() < Date.now()) {
      await PendingOtp.deleteOne({ _id: pending._id });
      return NextResponse.json(
        { error: 'Código expirado. Solicite um novo.' },
        { status: 400 },
      );
    }

    // Comparar hash do código
    if (pending.otpCode !== codeHash) {
      await PendingOtp.updateOne(
        { _id: pending._id },
        { $inc: { otpAttempts: 1 } },
      );
      return NextResponse.json({ error: 'Código incorreto.' }, { status: 400 });
    }

    // OTP válido → criar Customer com password aleatória interna
    // (hash pelo pre-save hook; cliente nunca precisará usar esta senha)
    const randomPassword = crypto.randomBytes(32).toString('hex');

    const newCustomer = await Customer.create({
      name,
      email,
      password: randomPassword,
      cpf: sanitizedCPF,
      phone: phone.replace(/\D/g, ''),
      emailVerified: true, // OTP já verificou o email
      role: 'customer',
    });

    // Limpar PendingOtp
    await PendingOtp.deleteOne({ _id: pending._id });

    return NextResponse.json({
      success: true,
      customerId: newCustomer._id.toString(),
      email: newCustomer.email,
      otpSignature: generateOtpSignature(
        newCustomer._id.toString(),
        newCustomer.email,
      ),
      action: 'created',
    });
  } catch (error) {
    console.error('[CheckoutOtp/Verify] Erro:', error);

    // Erro de duplicate key (email ou CPF já existe)
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      (error as { code: number }).code === 11000
    ) {
      return NextResponse.json(
        { error: 'Email ou CPF já registado.' },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor.' },
      { status: 500 },
    );
  }
}
