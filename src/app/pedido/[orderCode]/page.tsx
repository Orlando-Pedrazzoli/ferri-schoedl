import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import { OrderStatusClient } from './OrderStatusClient';

interface Props {
  params: Promise<{ orderCode: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { orderCode } = await params;
  return {
    title: `Pedido ${orderCode} — Ferri Schoedl Advocacia`,
    robots: { index: false, follow: false },
  };
}

export default async function PedidoPage({ params }: Props) {
  const { orderCode } = await params;

  await connectDB();

  const order = await Order.findOne({ orderCode }).lean();

  if (!order) {
    notFound();
  }

  // Serializar para passar como prop
  const serialized = {
    orderCode: order.orderCode,
    status: order.status,
    items: order.items.map(
      (i: {
        title: string;
        quantity: number;
        price: number;
        slug: string;
      }) => ({
        title: i.title,
        quantity: i.quantity,
        price: i.price,
        slug: i.slug,
      }),
    ),
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

  return <OrderStatusClient order={serialized} />;
}
