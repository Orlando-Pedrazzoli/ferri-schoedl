// src/app/pedido/[orderCode]/page.tsx
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Customer from '@/models/Customer';
import { verifySetupToken } from '@/lib/setup-token';
import { OrderStatusClient } from './OrderStatusClient';

interface Props {
  params: Promise<{ orderCode: string }>;
  searchParams: Promise<{ setup?: string }>;
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
  const { setup: setupTokenRaw } = await searchParams;
  const setupToken = typeof setupTokenRaw === 'string' ? setupTokenRaw : '';

  await connectDB();

  const order = await Order.findOne({ orderCode }).lean<{
    orderCode: string;
    status: string;
    customerId: { toString(): string };
    items: Array<{
      title: string;
      quantity: number;
      price: number;
      slug: string;
    }>;
    subtotal: number;
    shipping: {
      method: string;
      price: number;
      estimatedDays: string;
      trackingCode?: string;
      address: {
        street: string;
        number: string;
        complement?: string;
        neighborhood: string;
        city: string;
        state: string;
        cep: string;
      };
    };
    total: number;
    payment: {
      method: string;
      status: string;
      installments?: number;
      cardLastDigits?: string;
      cardBrand?: string;
      boletoUrl?: string;
      pixQrCode?: string;
      pixQrCodeUrl?: string;
      paidAt?: Date;
    };
    createdAt: Date;
  }>();

  if (!order) {
    notFound();
  }

  // --- Decidir se mostra banner de criacao de senha ---
  let showPasswordSetup = false;
  let resolvedCustomerId: string | null = null;

  // 1) Tentar via sessao ativa
  const session = await getServerSession(authOptions);
  if (
    session?.user?.id &&
    (session.user as { role?: string }).role === 'customer'
  ) {
    resolvedCustomerId = session.user.id;
  }

  // 2) Fallback via setupToken no URL
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

  // Serializar para passar como prop (sem Mongoose types)
  const serialized = {
    orderCode: order.orderCode,
    status: order.status,
    items: order.items.map(i => ({
      title: i.title,
      quantity: i.quantity,
      price: i.price,
      slug: i.slug,
    })),
    subtotal: order.subtotal,
    shipping: {
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
    },
    total: order.total,
    payment: {
      method: order.payment.method,
      status: order.payment.status,
      installments: order.payment.installments || 1,
      cardLastDigits: order.payment.cardLastDigits || '',
      cardBrand: order.payment.cardBrand || '',
      boletoUrl: order.payment.boletoUrl || '',
      pixQrCode: order.payment.pixQrCode || '',
      pixQrCodeUrl: order.payment.pixQrCodeUrl || '',
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
