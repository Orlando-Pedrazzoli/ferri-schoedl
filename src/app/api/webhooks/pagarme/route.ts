import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Customer from '@/models/Customer';
import { sendOrderConfirmation, sendOrderStatusUpdate } from '@/lib/resend';

/**
 * POST /api/webhooks/pagarme
 *
 * Recebe webhooks do Pagar.me V5.
 * Eventos tratados:
 *   - order.paid          -> marca pedido como pago, envia email de confirmacao
 *   - order.payment_failed -> marca pedido como falhou
 *   - order.canceled       -> marca pedido como cancelado
 *   - charge.chargedback   -> marca payment como chargedback
 *
 * IMPORTANTE: Configurar este URL no painel Pagar.me:
 *   https://ferrischoedl.adv.br/api/webhooks/pagarme
 *   Eventos: order.paid, order.payment_failed, order.canceled, charge.chargedback
 *   Maximo de tentativas: 3
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Log para debug (remover em producao se necessario)
    console.log(
      '[Webhook Pagar.me] Evento recebido:',
      body.type,
      'ID:',
      body.id,
    );

    const eventType: string = body.type;
    const eventData = body.data;

    if (!eventType || !eventData) {
      return NextResponse.json({ error: 'Payload invalido' }, { status: 400 });
    }

    await dbConnect();

    // --- Extrair o order code ou pagarme order id ---
    // Para eventos de order: eventData.id e o pagarme order id, eventData.code e o nosso orderCode
    // Para eventos de charge: precisamos buscar pelo charge id

    switch (eventType) {
      case 'order.paid': {
        await handleOrderPaid(eventData);
        break;
      }

      case 'order.payment_failed': {
        await handleOrderFailed(eventData);
        break;
      }

      case 'order.canceled': {
        await handleOrderCanceled(eventData);
        break;
      }

      case 'charge.chargedback':
      case 'chargeback.received': {
        await handleChargeChargedback(eventData);
        break;
      }

      default: {
        console.log(`[Webhook Pagar.me] Evento nao tratado: ${eventType}`);
      }
    }

    // Pagar.me espera 200 para confirmar recebimento
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('[Webhook Pagar.me] Erro:', error);
    // Retornar 200 mesmo com erro para evitar reenvios infinitos
    // O erro fica logado para investigacao
    return NextResponse.json({ received: true }, { status: 200 });
  }
}

// --- Handlers ---

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handleOrderPaid(data: any) {
  const order = await findOrderByPagarme(data);
  if (!order) {
    console.error(
      '[Webhook] order.paid: Pedido nao encontrado para',
      data.id || data.code,
    );
    return;
  }

  // Evitar processar duplicado
  if (order.payment.status === 'paid') {
    console.log(
      `[Webhook] order.paid: Pedido ${order.orderCode} ja estava pago`,
    );
    return;
  }

  // Atualizar status
  order.payment.status = 'paid';
  order.payment.paidAt = new Date();
  order.status = 'pago';

  // Extrair dados da charge se disponiveis
  const charge = data.charges?.[0];
  if (charge) {
    order.payment.pagarmeChargeId = charge.id;

    const lastTx = charge.last_transaction;
    if (lastTx) {
      if (order.payment.method === 'credit_card') {
        order.payment.cardLastDigits =
          lastTx.card?.last_four_digits || order.payment.cardLastDigits;
        order.payment.cardBrand = lastTx.card?.brand || order.payment.cardBrand;
      }
    }
  }

  await order.save();

  // Adicionar order ao customer (se ainda nao foi)
  await Customer.findByIdAndUpdate(order.customerId, {
    $addToSet: { orders: order._id },
  });

  // Enviar email de confirmacao
  const emailItems = order.items.map(
    (i: { title: string; quantity: number; price: number }) => ({
      title: i.title,
      quantity: i.quantity,
      price: i.price,
    }),
  );

  await sendOrderConfirmation(
    order.customerEmail,
    order.customerName,
    order.orderCode,
    emailItems,
    order.total,
  ).catch(err =>
    console.error('[Webhook] Erro ao enviar email de confirmacao:', err),
  );

  console.log(
    `[Webhook] order.paid: Pedido ${order.orderCode} marcado como pago`,
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handleOrderFailed(data: any) {
  const order = await findOrderByPagarme(data);
  if (!order) {
    console.error('[Webhook] order.payment_failed: Pedido nao encontrado');
    return;
  }

  order.payment.status = 'failed';
  order.status = 'falhou';
  await order.save();

  // Notificar cliente
  await sendOrderStatusUpdate(
    order.customerEmail,
    order.customerName,
    order.orderCode,
    'cancelado',
  ).catch(err =>
    console.error('[Webhook] Erro ao enviar email de falha:', err),
  );

  console.log(
    `[Webhook] order.payment_failed: Pedido ${order.orderCode} marcado como falhou`,
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handleOrderCanceled(data: any) {
  const order = await findOrderByPagarme(data);
  if (!order) {
    console.error('[Webhook] order.canceled: Pedido nao encontrado');
    return;
  }

  order.payment.status = 'canceled';
  order.status = 'cancelado';
  await order.save();

  await sendOrderStatusUpdate(
    order.customerEmail,
    order.customerName,
    order.orderCode,
    'cancelado',
  ).catch(err =>
    console.error('[Webhook] Erro ao enviar email de cancelamento:', err),
  );

  console.log(`[Webhook] order.canceled: Pedido ${order.orderCode} cancelado`);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handleChargeChargedback(data: any) {
  // Para chargebacks, o data e o objeto charge, nao order
  // Precisamos buscar pelo chargeId
  const chargeId = data.id;
  if (!chargeId) {
    console.error('[Webhook] charge.chargedback: Sem charge id');
    return;
  }

  const order = await Order.findOne({
    'payment.pagarmeChargeId': chargeId,
  });

  if (!order) {
    console.error(
      `[Webhook] charge.chargedback: Pedido nao encontrado para charge ${chargeId}`,
    );
    return;
  }

  order.payment.status = 'chargedback';
  // Nao alterar order.status — chargeback nao muda status do pedido no Pagar.me,
  // mas vamos marcar internamente
  order.notes = `${order.notes ? order.notes + ' | ' : ''}Chargeback recebido em ${new Date().toISOString()}`;
  await order.save();

  console.log(
    `[Webhook] charge.chargedback: Pedido ${order.orderCode} sofreu chargeback`,
  );
}

// --- Util: encontrar order pelo payload do webhook ---

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function findOrderByPagarme(data: any) {
  // Tentar por code (nosso orderCode) primeiro
  if (data.code) {
    const order = await Order.findOne({ orderCode: data.code });
    if (order) return order;
  }

  // Tentar por pagarme order id
  if (data.id) {
    const order = await Order.findOne({
      'payment.pagarmeOrderId': data.id,
    });
    if (order) return order;
  }

  return null;
}
