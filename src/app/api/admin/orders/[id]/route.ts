import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import { requireAdmin } from '@/lib/auth-helpers';
import { sendOrderStatusUpdate } from '@/lib/resend';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// Status que o admin pode definir (fulfillment). O pagamento vem do Stripe.
const ADMIN_STATUSES = ['preparando', 'enviado', 'entregue', 'cancelado'];

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    await dbConnect();
    const { id } = await params;
    const order = await Order.findById(id).lean();
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Pedido não encontrado' },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true, data: order });
  } catch (err) {
    console.error('Error fetching order:', err);
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar pedido' },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Pedido não encontrado' },
        { status: 404 },
      );
    }

    const newStatus = typeof body.status === 'string' ? body.status : undefined;
    const trackingCode =
      typeof body.trackingCode === 'string'
        ? body.trackingCode.trim()
        : undefined;

    const hasPhysical = order.items.some(i => i.type === 'physical');

    // Atualiza o código de rastreio (se houver envio)
    if (trackingCode !== undefined && order.shipping) {
      order.shipping.trackingCode = trackingCode;
    }

    let statusChanged = false;

    if (newStatus) {
      if (!ADMIN_STATUSES.includes(newStatus)) {
        return NextResponse.json(
          { success: false, error: 'Status inválido.' },
          { status: 400 },
        );
      }
      if (
        !hasPhysical &&
        (newStatus === 'preparando' || newStatus === 'enviado')
      ) {
        return NextResponse.json(
          {
            success: false,
            error: 'Pedido digital não requer preparação/envio.',
          },
          { status: 400 },
        );
      }
      if (newStatus === 'enviado') {
        if (!order.shipping) {
          return NextResponse.json(
            { success: false, error: 'Pedido sem dados de envio.' },
            { status: 400 },
          );
        }
        const tc = trackingCode ?? order.shipping.trackingCode;
        if (!tc) {
          return NextResponse.json(
            {
              success: false,
              error:
                'Código de rastreio é obrigatório para marcar como enviado.',
            },
            { status: 400 },
          );
        }
      }
      statusChanged = order.status !== newStatus;
      order.status = newStatus;
    }

    await order.save();

    // Notifica o cliente por e-mail quando o status muda
    if (statusChanged && newStatus) {
      await sendOrderStatusUpdate(
        order.customerEmail,
        order.customerName,
        order.orderCode,
        newStatus,
        order.shipping?.trackingCode || undefined,
      ).catch(err =>
        console.error('[Admin Orders] Erro ao enviar e-mail ao cliente:', err),
      );
    }

    return NextResponse.json({ success: true, data: order.toObject() });
  } catch (err: unknown) {
    console.error('Error updating order:', err);
    const message =
      err instanceof Error ? err.message : 'Erro ao atualizar pedido';
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 },
    );
  }
}
