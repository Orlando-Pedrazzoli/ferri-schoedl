import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/mongodb';
import Customer from '@/models/Customer';
import { sendVerificationEmail } from '@/lib/resend';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 3 reenvios por IP/hora
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded?.split(',')[0]?.trim() || 'unknown';
    const { limited } = rateLimit(`resend-verify:${ip}`, 3, 60 * 60 * 1000);

    if (limited) {
      return NextResponse.json(
        { error: 'Muitas tentativas. Tente novamente mais tarde.' },
        { status: 429 },
      );
    }

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email é obrigatório' },
        { status: 400 },
      );
    }

    await dbConnect();

    const customer = await Customer.findOne({
      email: email.toLowerCase().trim(),
    });

    // Não revelar se o email existe ou não
    if (!customer || customer.emailVerified) {
      return NextResponse.json({
        message:
          'Se o email existir e não estiver verificado, enviaremos um novo link.',
      });
    }

    // Gerar novo token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Usar updateOne para poder escrever nos campos select: false
    await Customer.updateOne(
      { _id: customer._id },
      {
        emailVerificationToken: verificationToken,
        emailVerificationExpires: verificationExpires,
      },
    );

    // Enviar email
    await sendVerificationEmail(
      customer.email,
      customer.name,
      verificationToken,
    );

    return NextResponse.json({
      message:
        'Se o email existir e não estiver verificado, enviaremos um novo link.',
    });
  } catch (error) {
    console.error('[ResendVerification] Erro:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
