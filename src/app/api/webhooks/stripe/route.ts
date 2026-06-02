import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import type Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Customer from '@/models/Customer';
import { sendOrderConfirmation } from '@/lib/resend';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = (await headers()).get('stripe-signature');
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !secret) {
    return NextResponse.json(
      { error: 'Webhook não configurado.' },
      { status: 400 },
    );
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'assinatura inválida';
    console.error('[Webhook Stripe] Assinatura inválida:', msg);
    return NextResponse.json(
      { error: `Webhook Error: ${msg}` },
      { status: 400 },
    );
  }

  try {
    await dbConnect();

    switch (event.type) {
      case 'checkout.session.completed':
      case 'checkout.session.async_payment_succeeded': {
        const s = event.data.object as Stripe.Checkout.Session;
        if (s.payment_status === 'paid') {
          await markPaid(s);
        }
        break;
      }
      case 'checkout.session.expired': {
        const s = event.data.object as Stripe.Checkout.Session;
        await markExpired(s);
        break;
      }
      default:
        break;
    }
  } catch (err) {
    console.error('[Webhook Stripe] Erro ao processar:', err);
    // 200 para o Stripe não reenviar infinitamente; erro fica logado
  }

  return NextResponse.json({ received: true }, { status: 200 });
}

async function findOrder(s: Stripe.Checkout.Session) {
  const orderId = s.metadata?.orderId;
  if (orderId) {
    const o = await Order.findById(orderId);
    if (o) return o;
  }
  const code = s.client_reference_id || s.metadata?.orderCode;
  if (code) {
    const o = await Order.findOne({ orderCode: code });
    if (o) return o;
  }
  if (s.id) {
    return Order.findOne({ 'payment.stripeSessionId': s.id });
  }
  return null;
}

async function markPaid(s: Stripe.Checkout.Session) {
  const order = await findOrder(s);
  if (!order) {
    console.error('[Webhook Stripe] Pedido não encontrado:', s.id);
    return;
  }
  if (order.payment.status === 'paid') return;

  order.payment.status = 'paid';
  order.payment.paidAt = new Date();
  order.payment.stripePaymentIntentId =
    typeof s.payment_intent === 'string'
      ? s.payment_intent
      : s.payment_intent?.id || '';
  order.status = 'pago';
  await order.save();

  await Customer.findByIdAndUpdate(order.customerId, {
    $addToSet: { orders: order._id },
  });

  const emailItems = order.items.map(i => ({
    title: i.title,
    quantity: i.quantity,
    price: i.price,
  }));

  await sendOrderConfirmation(
    order.customerEmail,
    order.customerName,
    order.orderCode,
    emailItems,
    order.total,
  ).catch(err => console.error('[Webhook Stripe] Erro ao enviar email:', err));

  console.log(`[Webhook Stripe] Pedido ${order.orderCode} marcado como pago.`);
}

async function markExpired(s: Stripe.Checkout.Session) {
  const order = await findOrder(s);
  if (!order || order.payment.status === 'paid') return;
  order.payment.status = 'canceled';
  order.status = 'cancelado';
  await order.save();
}
