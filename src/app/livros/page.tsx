'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';
import { Reveal, RevealStagger, RevealItem } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';
import { useCart } from '@/components/CartProvider';
import { livros } from '@/lib/data';

export default function LivrosPage() {
  const { addItem } = useCart();

  return (
    <section className='pb-24 pt-32 lg:pb-32'>
      <div className='mx-auto max-w-7xl px-6 lg:px-8'>
        <SectionHeading
          label=''
          title='Livros'
          description='Obras autorais sobre Direito Penal, Constitucional, Improbidade Administrativa e preparacao para concursos publicos.'
        />

        <RevealStagger className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {livros.map(livro => (
            <RevealItem key={livro.slug}>
              <div className='group flex h-full flex-col border border-gold-500/8 bg-navy-800/20 transition-all duration-300 hover:border-gold-500/20'>
                {/* Cover placeholder */}
                <Link
                  href={`/livros/${livro.slug}`}
                  className='relative flex h-80 items-center justify-center bg-navy-800/40 overflow-hidden p-4'
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

                {/* Info */}
                <div className='flex flex-1 flex-col p-6'>
                  <p className='mb-1 text-[11px] text-txt-muted'>
                    {livro.publisher}, {livro.year}
                  </p>
                  <Link href={`/livros/${livro.slug}`}>
                    <h3 className='font-[family-name:var(--font-cormorant)] text-lg leading-tight text-cream-100 transition-colors group-hover:text-gold-400'>
                      {livro.title}
                    </h3>
                  </Link>
                  {livro.subtitle && (
                    <p className='mt-1 text-[12px] italic text-gold-600'>
                      {livro.subtitle}
                    </p>
                  )}
                  <p className='mt-3 flex-1 text-[12px] leading-relaxed text-txt-muted'>
                    {livro.description}
                  </p>

                  {/* Price + CTA */}
                  <div className='mt-5 flex items-end justify-between border-t border-gold-500/8 pt-4'>
                    <div>
                      {livro.originalPrice && (
                        <p className='text-[12px] text-txt-muted line-through'>
                          R$ {livro.originalPrice.toFixed(2).replace('.', ',')}
                        </p>
                      )}
                      <p className='font-[family-name:var(--font-cormorant)] text-2xl text-gold-500'>
                        R$ {livro.price.toFixed(2).replace('.', ',')}
                      </p>
                    </div>
                    <button
                      onClick={() => addItem(livro)}
                      className='flex items-center gap-2 bg-gold-500 px-4 py-2.5 text-[11px] font-medium uppercase tracking-[1.5px] text-navy-950 transition-colors hover:bg-gold-400'
                    >
                      <ShoppingCart size={14} />
                      Comprar
                    </button>
                  </div>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}
