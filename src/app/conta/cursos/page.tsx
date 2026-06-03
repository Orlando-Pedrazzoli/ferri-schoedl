import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Course from '@/models/Course';
import { isCompEmail } from '@/lib/access';
import { GraduationCap, PlayCircle, Clock } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface CourseLite {
  _id: unknown;
  slug: string;
  title: string;
  image?: string;
  category?: string;
  duration?: string;
  modules?: unknown[];
}

interface OrderLite {
  items: Array<{ type?: string; courseId?: unknown }>;
}

export default async function CursosClientePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== 'customer') {
    redirect('/conta/login?callbackUrl=/conta/cursos');
  }

  await dbConnect();
  const comp = isCompEmail(session.user.email);

  let courses: CourseLite[] = [];

  if (comp) {
    // Conta liberada: vê todos os cursos ativos/publicados
    courses = await Course.find({ isActive: true, status: 'publicado' })
      .select('slug title image category duration modules')
      .sort({ order: 1 })
      .lean<CourseLite[]>();
  } else {
    // Cliente normal: apenas cursos de pedidos pagos
    const orders = await Order.find({
      customerId: session.user.id,
      'payment.status': 'paid',
      'items.type': 'course',
    })
      .select('items')
      .lean<OrderLite[]>();

    const courseIds = new Set<string>();
    for (const o of orders) {
      for (const it of o.items || []) {
        if (it.type === 'course' && it.courseId) {
          courseIds.add(String(it.courseId));
        }
      }
    }

    if (courseIds.size > 0) {
      courses = await Course.find({
        _id: { $in: Array.from(courseIds) },
        isActive: true,
        status: 'publicado',
      })
        .select('slug title image category duration modules')
        .lean<CourseLite[]>();
    }
  }

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='font-[family-name:var(--font-cormorant)] text-2xl text-cream-100'>
          Meus Cursos
        </h1>
        <p className='mt-1 text-sm text-txt-muted'>
          Assista aos cursos que você adquiriu.
        </p>
      </div>

      {courses.length === 0 ? (
        <div className='border border-gold-500/10 bg-navy-900/30 py-16 text-center'>
          <GraduationCap
            size={40}
            strokeWidth={1}
            className='mx-auto text-gold-600/30'
          />
          <h3 className='mt-4 font-[family-name:var(--font-cormorant)] text-xl text-cream-100'>
            Nenhum curso ainda
          </h3>
          <p className='mt-2 text-sm text-txt-muted'>
            Quando adquirir um curso, ele aparecerá aqui para assistir.
          </p>
          <Link
            href='/cursos'
            className='mt-6 inline-flex items-center gap-2 border border-gold-500/30 px-6 py-2.5 text-xs font-medium uppercase tracking-[2px] text-gold-500 transition-colors hover:bg-gold-500/5'
          >
            <GraduationCap size={14} />
            Ver cursos
          </Link>
        </div>
      ) : (
        <div className='grid gap-4 sm:grid-cols-2'>
          {courses.map(c => (
            <Link
              key={c.slug}
              href={`/conta/cursos/${c.slug}`}
              className='group flex flex-col overflow-hidden border border-gold-500/10 bg-navy-900/30 transition-colors hover:border-gold-500/30'
            >
              <div className='relative aspect-video w-full overflow-hidden bg-navy-950'>
                {c.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={c.image}
                    alt={c.title}
                    className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
                  />
                ) : (
                  <div className='flex h-full w-full items-center justify-center'>
                    <GraduationCap
                      size={40}
                      strokeWidth={1}
                      className='text-gold-600/30'
                    />
                  </div>
                )}
                <div className='absolute inset-0 flex items-center justify-center bg-navy-950/40 opacity-0 transition-opacity group-hover:opacity-100'>
                  <PlayCircle
                    size={48}
                    strokeWidth={1}
                    className='text-cream-100'
                  />
                </div>
              </div>

              <div className='flex flex-1 flex-col p-4'>
                {c.category && (
                  <p className='mb-1 text-[11px] uppercase tracking-[2px] text-gold-500'>
                    {c.category}
                  </p>
                )}
                <h3 className='font-[family-name:var(--font-cormorant)] text-lg leading-tight text-cream-100'>
                  {c.title}
                </h3>

                <div className='mt-3 flex items-center gap-4 text-xs text-txt-muted'>
                  {c.duration && (
                    <span className='inline-flex items-center gap-1.5'>
                      <Clock size={12} className='text-gold-600' />
                      {c.duration}
                    </span>
                  )}
                  {c.modules && c.modules.length > 0 && (
                    <span>
                      {c.modules.length} módulo
                      {c.modules.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>

                <span className='mt-4 inline-flex items-center justify-center gap-2 bg-gold-500 px-4 py-2 text-xs font-medium uppercase tracking-[1.5px] text-navy-950 transition-colors group-hover:bg-gold-400'>
                  <PlayCircle size={14} />
                  Assistir
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
