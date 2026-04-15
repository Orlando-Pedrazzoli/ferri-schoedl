import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== 'customer') {
      return NextResponse.json({ error: 'Nao autorizado.' }, { status: 401 });
    }

    await dbConnect();

    const orders = await Order.find({ customerId: session.user.id })
      .sort({ createdAt: -1 })
      .lean();

    const serialized = orders.map(order => ({
      orderCode: order.orderCode,
      status: order.status,
      total: order.total,
      subtotal: order.subtotal,
      createdAt: new Date(order.createdAt).toISOString(),
      itemCount: order.items.length,
      items: order.items.map(
        (i: { title: string; quantity: number; price: number }) => ({
          title: i.title,
          quantity: i.quantity,
          price: i.price,
        }),
      ),
      shipping: {
        method: order.shipping.method,
        price: order.shipping.price,
      },
      payment: {
        method: order.payment.method,
        status: order.payment.status,
      },
    }));

    return NextResponse.json({ orders: serialized });
  } catch (error) {
    console.error('[Conta/Pedidos] Erro:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor.' },
      { status: 500 },
    );
  }
}
