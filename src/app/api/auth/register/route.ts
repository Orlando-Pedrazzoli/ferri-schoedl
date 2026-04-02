import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/mongodb';
import Customer from '@/models/Customer';
import { isValidCPF, sanitizeCPF } from '@/lib/cpf';
import { isDisposableEmail } from '@/lib/disposable-emails';
import { sendVerificationEmail } from '@/lib/resend';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // --- Rate limiting: 5 registos por IP/hora ---
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded?.split(',')[0]?.trim() || 'unknown';
    const { limited } = rateLimit(`register:${ip}`, 5, 60 * 60 * 1000);

    if (limited) {
      return NextResponse.json(
        { error: 'Muitas tentativas. Tente novamente mais tarde.' },
        { status: 429 },
      );
    }

    const body = await request.json();
    const { name, email, password, cpf, phone, website } = body;

    // --- Honeypot: se campo "website" preenchido, é bot ---
    if (website) {
      // Retorna sucesso falso para não alertar o bot
      return NextResponse.json(
        { message: 'Registo realizado com sucesso. Verifique seu email.' },
        { status: 201 },
      );
    }

    // --- Validações ---
    const errors: Record<string, string> = {};

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      errors.name = 'Nome deve ter pelo menos 2 caracteres';
    }

    if (!email || typeof email !== 'string') {
      errors.email = 'Email é obrigatório';
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      errors.email = 'Email inválido';
    } else if (isDisposableEmail(email)) {
      errors.email =
        'Este tipo de email não é aceite. Use um email permanente.';
    }

    if (!password || typeof password !== 'string' || password.length < 8) {
      errors.password = 'Password deve ter pelo menos 8 caracteres';
    }

    if (!cpf || typeof cpf !== 'string') {
      errors.cpf = 'CPF é obrigatório';
    } else if (!isValidCPF(cpf)) {
      errors.cpf = 'CPF inválido';
    }

    if (
      !phone ||
      typeof phone !== 'string' ||
      phone.replace(/\D/g, '').length < 10
    ) {
      errors.phone = 'Telefone inválido';
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    // --- Conectar ao DB ---
    await dbConnect();

    // --- Verificar duplicados ---
    const sanitizedCPF = sanitizeCPF(cpf);

    const existingEmail = await Customer.findOne({
      email: email.toLowerCase().trim(),
    });
    if (existingEmail) {
      return NextResponse.json(
        { errors: { email: 'Este email já está registado' } },
        { status: 409 },
      );
    }

    const existingCPF = await Customer.findOne({ cpf: sanitizedCPF });
    if (existingCPF) {
      return NextResponse.json(
        { errors: { cpf: 'Este CPF já está registado' } },
        { status: 409 },
      );
    }

    // --- Gerar token de verificação ---
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    // --- Criar Customer ---
    const customer = await Customer.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password, // Hash é feito no pre-save hook
      cpf: sanitizedCPF,
      phone: phone.replace(/\D/g, ''),
      emailVerified: false,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires,
    });

    // --- Enviar email de verificação ---
    const emailResult = await sendVerificationEmail(
      customer.email,
      customer.name,
      verificationToken,
    );

    if (!emailResult.success) {
      console.error(
        '[Register] Falha ao enviar email de verificação:',
        emailResult.error,
      );
      // Não bloquear o registo, mas informar
    }

    return NextResponse.json(
      {
        message:
          'Registo realizado com sucesso. Verifique seu email para activar a conta.',
        email: customer.email,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('[Register] Erro:', error);

    // Erro de duplicado do MongoDB (race condition)
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      (error as { code: number }).code === 11000
    ) {
      return NextResponse.json(
        { error: 'Este email ou CPF já está registado' },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 },
    );
  }
}
