'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, ExternalLink } from 'lucide-react';
import { RevealStagger, RevealItem } from '@/components/Reveal';
import { useCart } from '@/components/CartProvider';
import type { Livro } from '@/lib/data';

interface LivrosGridProps {
  livros: Livro[];
}

export function LivrosGrid({ livros }: LivrosGridProps) {
  const { addItem } = useCart();

  return (
    <RevealStagger className='grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3'>
      {livros.map(livro => (
        <RevealItem key={livro.slug}>
          <div className='group flex h-full flex-col border border-gold-500/8 bg-navy-800/20 transition-all duration-300 hover:border-gold-500/20'>
            <Link
              href={`/livros/${livro.slug}`}
              className='relative flex h-72 items-center justify-center overflow-hidden bg-navy-800/40 p-4 sm:h-80'
            >
              <Image
                src={livro.image}
                alt={livro.title}
                width={300}
                height={432}
                className='h-full w-auto object-contain drop-shadow-lg transition-transform duration-500 group-hover:scale-105'
              />
              {livro.featured && (
                <span className='absolute left-0 top-4 bg-gold-500 px-3 py-1 text-[10px] font-medium uppercase tracking-[1.5px] text-navy-950'>
                  Destaque
                </span>
              )}
              {livro.originalPrice && (
                <span className='absolute right-0 top-4 bg-navy-950/80 px-3 py-1 text-[10px] font-medium uppercase tracking-[1px] text-gold-400'>
                  Oferta
                </span>
              )}
            </Link>

            <div className='flex flex-1 flex-col p-5 sm:p-6'>
              <div className='mb-2 flex flex-wrap items-center gap-2'>
                <p className='text-xs text-txt-muted'>
                  {livro.publisher}, {livro.year}
                </p>
                {livro.coauthor && (
                  <span className='border border-gold-500/15 px-2 py-0.5 text-[10px] uppercase tracking-[1px] text-gold-600/60'>
                    Coautoria
                  </span>
                )}
              </div>

              <Link href={`/livros/${livro.slug}`}>
                <h3 className='font-[family-name:var(--font-cormorant)] text-lg leading-tight text-cream-100 transition-colors group-hover:text-gold-400'>
                  {livro.title}
                </h3>
              </Link>
              {livro.subtitle && (
                <p className='mt-1 text-[13px] italic text-gold-600'>
                  {livro.subtitle}
                </p>
              )}
              <p className='mt-3 flex-1 text-[13px] leading-relaxed text-txt-muted'>
                {livro.description}
              </p>

              <p className='mt-3 text-[11px] uppercase tracking-[1px] text-txt-muted'>
                {livro.saleNote}
              </p>

              <div className='mt-4 flex items-end justify-between border-t border-gold-500/8 pt-4'>
                <div>
                  {livro.originalPrice && (
                    <p className='text-[13px] text-txt-muted line-through'>
                      R$ {livro.originalPrice.toFixed(2).replace('.', ',')}
                    </p>
                  )}
                  <p className='font-[family-name:var(--font-cormorant)] text-2xl text-gold-500'>
                    R$ {livro.price.toFixed(2).replace('.', ',')}
                  </p>
                </div>

                {livro.saleType === 'direto' ? (
                  <button
                    onClick={() => addItem(livro)}
                    className='flex items-center gap-2 bg-gold-500 px-3 py-2 text-xs font-medium uppercase tracking-[1.5px] text-navy-950 transition-colors hover:bg-gold-400 sm:px-4 sm:py-2.5'
                  >
                    <ShoppingCart size={14} />
                    Comprar
                  </button>
                ) : (
                  <Link
                    href={`/livros/${livro.slug}`}
                    className='flex items-center gap-2 border border-gold-500/30 px-3 py-2 text-xs font-medium uppercase tracking-[1.5px] text-gold-500 transition-colors hover:border-gold-500 hover:bg-gold-500/5 sm:px-4 sm:py-2.5'
                  >
                    <ExternalLink size={14} />
                    Ver mais
                  </Link>
                )}
              </div>
            </div>
          </div>
        </RevealItem>
      ))}
    </RevealStagger>
  );
}
