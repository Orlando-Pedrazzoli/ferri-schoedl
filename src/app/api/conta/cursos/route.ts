import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Course from '@/models/Course';
import { isCompEmail } from '@/lib/access';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== 'customer') {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  await dbConnect();

  // Conta liberada: todos os cursos ativos/publicados
  if (isCompEmail(session.user.email)) {
    const count = await Course.countDocuments({
      isActive: true,
      status: 'publicado',
    });
    return NextResponse.json({ count });
  }

  // Cliente normal: cursos de pedidos pagos
  const orders = await Order.find({
    customerId: session.user.id,
    'payment.status': 'paid',
    'items.type': 'course',
  })
    .select('items')
    .lean<{ items: Array<{ type?: string; courseId?: unknown }> }[]>();

  const ids = new Set<string>();
  for (const o of orders) {
    for (const it of o.items || []) {
      if (it.type === 'course' && it.courseId) ids.add(String(it.courseId));
    }
  }

  return NextResponse.json({ count: ids.size });
}
