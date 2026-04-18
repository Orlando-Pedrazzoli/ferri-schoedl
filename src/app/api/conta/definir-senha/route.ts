// src/app/api/conta/definir-senha/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Customer from '@/models/Customer';
import { verifySetupToken } from '@/lib/setup-token';
import { rateLimit } from '@/lib/rate-limit';

/**
 * POST /api/conta/definir-senha
 *
 * Define senha para customer que foi criado via OTP (sem senha propria).
 *
 * Aceita 2 formas de autenticacao:
 * 1) Sessao NextAuth ativa (customer logado)
 * 2) setupToken valido (fallback caso sessao tenha expirado)
 *
 * Body:
 *   { password: string, orderCode: string, setupToken?: string }
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limit: 5 tentativas por IP/hora
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded?.split(',')[0]?.trim() || 'unknown';
    const { limited } = rateLimit(`definir-senha:${ip}`, 5, 60 * 60 * 1000);
    if (limited) {
      return NextResponse.json(
        { error: 'Muitas tentativas. Tente novamente em alguns minutos.' },
        { status: 429 },
      );
    }

    const body = await request.json();
    const password = typeof body.password === 'string' ? body.password : '';
    const orderCode = typeof body.orderCode === 'string' ? body.orderCode : '';
    const setupToken =
      typeof body.setupToken === 'string' ? body.setupToken : '';

    // Validacoes de senha
    if (!password || password.length < 8) {
      return NextResponse.json(
        { error: 'A senha deve ter pelo menos 8 caracteres.' },
        { status: 400 },
      );
    }
    if (password.length > 128) {
      return NextResponse.json(
        { error: 'Senha muito longa.' },
        { status: 400 },
      );
    }

    await dbConnect();

    // Tentar autenticacao via sessao
    let customerId: string | null = null;
    const session = await getServerSession(authOptions);
    if (
      session?.user?.id &&
      (session.user as { role?: string }).role === 'customer'
    ) {
      customerId = session.user.id;
    }

    // Fallback: validar setupToken
    if (!customerId && setupToken) {
      const payload = verifySetupToken(setupToken);
      if (payload && payload.orderCode === orderCode) {
        customerId = payload.customerId;
      }
    }

    if (!customerId) {
      return NextResponse.json(
        { error: 'Sessao expirada. Faca login ou volte apos uma nova compra.' },
        { status: 401 },
      );
    }

    // Buscar customer
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return NextResponse.json(
        { error: 'Cliente nao encontrado.' },
        { status: 404 },
      );
    }

    // Se ja tem senha definida, nao sobrescreve por aqui (evita sequestro)
    if (customer.hasPassword) {
      return NextResponse.json(
        {
          error:
            'Voce ja definiu sua senha. Use "Esqueci minha senha" caso precise alterar.',
        },
        { status: 409 },
      );
    }

    // Atualizar senha (pre-save hook faz o hash)
    customer.password = password;
    customer.hasPassword = true;
    customer.passwordReminderSnoozedUntil = undefined;
    await customer.save();

    return NextResponse.json({
      success: true,
      message: 'Senha definida com sucesso.',
    });
  } catch (error) {
    console.error('[DefinirSenha] Erro:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor.' },
      { status: 500 },
    );
  }
}
