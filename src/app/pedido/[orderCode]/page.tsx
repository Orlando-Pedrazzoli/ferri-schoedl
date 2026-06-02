// src/app/pedido/[orderCode]/page.tsx
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Customer from '@/models/Customer';
import { verifySetupToken } from '@/lib/setup-token';
import { stripe } from '@/lib/stripe';
import { OrderStatusClient } from './OrderStatusClient';

interface Props {
  params: Promise<{ orderCode: string }>;
  searchParams: Promise<{ setup?: string; session_id?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { orderCode } = await params;
  return {
    title: `Pedido ${orderCode} — Ferri Schoedl Advocacia`,
    robots: { index: false, follow: false },
  };
}

export default async function PedidoPage({ params, searchParams }: Props) {
  const { orderCode } = await params;
  const { setup: setupTokenRaw, session_id } = await searchParams;
  const setupToken = typeof setupTokenRaw === 'string' ? setupTokenRaw : '';

  await connectDB();

  const order = await Order.findOne({ orderCode });
  if (!order) {
    notFound();
  }

  // Reconciliação: voltou do Stripe com session_id e ainda não está pago?
  // Consulta a sessão e confirma (fallback caso o webhook ainda não tenha chegado).
  if (order.payment.status !== 'paid' && session_id) {
    try {
      const s = await stripe.checkout.sessions.retrieve(session_id);
      if (s.payment_status === 'paid') {
        order.payment.status = 'paid';
        order.payment.paidAt = new Date();
        order.payment.stripePaymentIntentId =
          typeof s.payment_intent === 'string'
            ? s.payment_intent
            : s.payment_intent?.id || '';
        order.status = 'pago';
        await order.save();
      }
    } catch (err) {
      console.error('[Pedido] Falha ao reconciliar sessão Stripe:', err);
    }
  }

  // --- Banner de criação de senha ---
  let showPasswordSetup = false;
  let resolvedCustomerId: string | null = null;

  const session = await getServerSession(authOptions);
  if (
    session?.user?.id &&
    (session.user as { role?: string }).role === 'customer'
  ) {
    resolvedCustomerId = session.user.id;
  }

  if (!resolvedCustomerId && setupToken) {
    const payload = verifySetupToken(setupToken);
    if (payload && payload.orderCode === orderCode) {
      resolvedCustomerId = payload.customerId;
    }
  }

  if (resolvedCustomerId) {
    const orderCustomerId = order.customerId?.toString();
    if (orderCustomerId === resolvedCustomerId) {
      const customer = await Customer.findById(resolvedCustomerId).select(
        'hasPassword passwordReminderSnoozedUntil',
      );
      if (customer && !customer.hasPassword) {
        const snoozed = customer.passwordReminderSnoozedUntil;
        if (!snoozed || new Date(snoozed).getTime() < Date.now()) {
          showPasswordSetup = true;
        }
      }
    }
  }

  const serialized = {
    orderCode: order.orderCode,
    status: order.status,
    items: order.items.map(i => ({
      type: i.type || 'physical',
      title: i.title,
      quantity: i.quantity,
      price: i.price,
      slug: i.slug,
    })),
    subtotal: order.subtotal,
    shipping: order.shipping
      ? {
          method: order.shipping.method,
          price: order.shipping.price,
          estimatedDays: order.shipping.estimatedDays,
          trackingCode: order.shipping.trackingCode || '',
          address: {
            street: order.shipping.address.street,
            number: order.shipping.address.number,
            complement: order.shipping.address.complement || '',
            neighborhood: order.shipping.address.neighborhood,
            city: order.shipping.address.city,
            state: order.shipping.address.state,
            cep: order.shipping.address.cep,
          },
        }
      : null,
    total: order.total,
    payment: {
      method: order.payment.method || 'card',
      status: order.payment.status,
      cardBrand: order.payment.cardBrand || '',
      cardLastDigits: order.payment.cardLastDigits || '',
      paidAt: order.payment.paidAt
        ? new Date(order.payment.paidAt).toISOString()
        : '',
    },
    createdAt: new Date(order.createdAt).toISOString(),
  };

  return (
    <OrderStatusClient
      order={serialized}
      showPasswordSetup={showPasswordSetup}
      setupToken={setupToken || undefined}
    />
  );
}
