// src/app/api/conta/definir-senha/snooze/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Customer from '@/models/Customer';
import { verifySetupToken } from '@/lib/setup-token';

/**
 * POST /api/conta/definir-senha/snooze
 *
 * Adia o banner de criacao de senha por 7 dias.
 * Aceita autenticacao via sessao ou setupToken (mesma logica do definir-senha).
 *
 * Body:
 *   { orderCode: string, setupToken?: string }
 */

const SNOOZE_DAYS = 7;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const orderCode = typeof body.orderCode === 'string' ? body.orderCode : '';
    const setupToken =
      typeof body.setupToken === 'string' ? body.setupToken : '';

    await dbConnect();

    let customerId: string | null = null;
    const session = await getServerSession(authOptions);
    if (
      session?.user?.id &&
      (session.user as { role?: string }).role === 'customer'
    ) {
      customerId = session.user.id;
    }

    if (!customerId && setupToken) {
      const payload = verifySetupToken(setupToken);
      if (payload && payload.orderCode === orderCode) {
        customerId = payload.customerId;
      }
    }

    // Se nao autenticado, retorna sucesso silencioso (banner some do client de qualquer forma)
    if (!customerId) {
      return NextResponse.json({ success: true });
    }

    const snoozedUntil = new Date(
      Date.now() + SNOOZE_DAYS * 24 * 60 * 60 * 1000,
    );

    await Customer.updateOne(
      { _id: customerId },
      { $set: { passwordReminderSnoozedUntil: snoozedUntil } },
    );

    return NextResponse.json({
      success: true,
      snoozedUntil: snoozedUntil.toISOString(),
    });
  } catch (error) {
    console.error('[DefinirSenha/Snooze] Erro:', error);
    return NextResponse.json({ success: true });
  }
}
