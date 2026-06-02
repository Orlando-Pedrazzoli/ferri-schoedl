import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

const COMP_EMAILS = (process.env.COMP_EMAILS || '')
  .split(',')
  .map(e => e.trim().toLowerCase())
  .filter(Boolean);

export function isCompEmail(email?: string | null): boolean {
  return !!email && COMP_EMAILS.includes(email.toLowerCase());
}

interface AccessOpts {
  email?: string | null;
  customerId?: string | null;
}

// Acesso ao curso: conta liberada OU pedido pago contendo o curso
export async function hasCourseAccess(
  opts: AccessOpts & { courseId: string },
): Promise<boolean> {
  if (isCompEmail(opts.email)) return true;
  if (!opts.customerId) return false;
  await dbConnect();
  const order = await Order.findOne({
    customerId: opts.customerId,
    'payment.status': 'paid',
    'items.courseId': opts.courseId,
  })
    .select('_id')
    .lean();
  return !!order;
}

// Acesso ao eBook: conta liberada OU pedido pago contendo o eBook
export async function hasEbookAccess(
  opts: AccessOpts & { bookId: string },
): Promise<boolean> {
  if (isCompEmail(opts.email)) return true;
  if (!opts.customerId) return false;
  await dbConnect();
  const order = await Order.findOne({
    customerId: opts.customerId,
    'payment.status': 'paid',
    items: { $elemMatch: { bookId: opts.bookId, type: 'ebook' } },
  })
    .select('_id')
    .lean();
  return !!order;
}
