import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Book from '@/models/Book';
import { isCompEmail } from '@/lib/access';
import { BookOpen, Download } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface BookLite {
  _id: unknown;
  slug: string;
  title: string;
  image?: string;
}

interface OrderLite {
  items: Array<{ type?: string; bookId?: unknown }>;
}

export default async function EbooksClientePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== 'customer') {
    redirect('/conta/login?callbackUrl=/conta/ebooks');
  }

  await dbConnect();
  const comp = isCompEmail(session.user.email);

  let books: BookLite[] = [];

  if (comp) {
    books = await Book.find({ isActive: true, hasEbook: true })
      .select('slug title image')
      .sort({ order: 1 })
      .lean<BookLite[]>();
  } else {
    const orders = await Order.find({
      customerId: session.user.id,
      'payment.status': 'paid',
      'items.type': 'ebook',
    })
      .select('items')
      .lean<OrderLite[]>();

    const bookIds = new Set<string>();
    for (const o of orders) {
      for (const it of o.items || []) {
        if (it.type === 'ebook' && it.bookId) {
          bookIds.add(String(it.bookId));
        }
      }
    }

    if (bookIds.size > 0) {
      books = await Book.find({
        _id: { $in: Array.from(bookIds) },
        hasEbook: true,
      })
        .select('slug title image')
        .lean<BookLite[]>();
    }
  }

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='font-[family-name:var(--font-cormorant)] text-2xl text-cream-100'>
          Meus eBooks
        </h1>
        <p className='mt-1 text-sm text-txt-muted'>
          Faça o download dos eBooks que você adquiriu.
        </p>
      </div>

      {books.length === 0 ? (
        <div className='border border-gold-500/10 bg-navy-900/30 py-16 text-center'>
          <BookOpen
            size={40}
            strokeWidth={1}
            className='mx-auto text-gold-600/30'
          />
          <h3 className='mt-4 font-[family-name:var(--font-cormorant)] text-xl text-cream-100'>
            Nenhum eBook ainda
          </h3>
          <p className='mt-2 text-sm text-txt-muted'>
            Quando comprar um eBook, ele aparecerá aqui para download.
          </p>
          <Link
            href='/livros'
            className='mt-6 inline-flex items-center gap-2 border border-gold-500/30 px-6 py-2.5 text-xs font-medium uppercase tracking-[2px] text-gold-500 transition-colors hover:bg-gold-500/5'
          >
            <BookOpen size={14} />
            Ver livros
          </Link>
        </div>
      ) : (
        <div className='space-y-3'>
          {books.map(b => (
            <div
              key={b.slug}
              className='flex items-center justify-between gap-4 border border-gold-500/10 bg-navy-900/30 p-4'
            >
              <div className='flex min-w-0 items-center gap-3'>
                {b.image ? (
                  <div className='h-16 w-12 shrink-0 overflow-hidden bg-navy-950'>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={b.image}
                      alt={b.title}
                      className='h-full w-full object-cover'
                    />
                  </div>
                ) : null}
                <p className='truncate text-sm text-cream-100'>{b.title}</p>
              </div>
              <a
                href={`/api/conta/ebooks/${String(b._id)}/download`}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex shrink-0 items-center gap-2 bg-gold-500 px-4 py-2 text-xs font-medium uppercase tracking-[1.5px] text-navy-950 transition-colors hover:bg-gold-400'
              >
                <Download size={14} />
                Baixar
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
