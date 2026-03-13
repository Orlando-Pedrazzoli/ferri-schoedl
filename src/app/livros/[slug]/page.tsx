'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  ShoppingCart,
  Package,
  Ruler,
  Weight,
  Truck,
  Check,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Reveal } from '@/components/Reveal';
import { useCart } from '@/components/CartProvider';
import { livros } from '@/lib/data';

export default function LivroDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const livro = livros.find(l => l.slug === slug);
  const { addItem } = useCart();

  if (!livro) {
    return (
      <section className='flex min-h-screen items-center justify-center pb-24 pt-32'>
        <div className='text-center'>
          <h1 className='font-[family-name:var(--font-cormorant)] text-3xl text-cream-100'>
            Livro nao encontrado
          </h1>
          <Link
            href='/livros'
            className='mt-6 inline-flex items-center gap-2 text-[13px] text-gold-500'
          >
            <ArrowLeft size={14} />
            Voltar para livros
          </Link>
        </div>
      </section>
    );
  }

  const outrosLivros = livros.filter(l => l.slug !== slug).slice(0, 3);

  return (
    <section className='pb-24 pt-28 lg:pb-32'>
      <div className='mx-auto max-w-7xl px-6 lg:px-8'>
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className='mb-10'
        >
          <Link
            href='/livros'
            className='group inline-flex items-center gap-2 text-[12px] uppercase tracking-[1.5px] text-gold-600 transition-colors hover:text-gold-500'
          >
            <ArrowLeft
              size={14}
              className='transition-transform group-hover:-translate-x-1'
            />
            Voltar para livros
          </Link>
        </motion.div>

        <div className='grid gap-12 lg:grid-cols-5 lg:gap-16'>
          {/* Cover */}
          <Reveal className='lg:col-span-2'>
            <div className='relative'>
              <div className='flex aspect-[3/4] items-center justify-center border border-gold-500/12 bg-navy-800/30 overflow-hidden'>
                <Image
                  src={livro.image}
                  alt={livro.title}
                  width={400}
                  height={600}
                  className='h-full w-full object-cover'
                />
              </div>
              {livro.featured && (
                <span className='absolute left-0 top-4 bg-gold-500 px-4 py-1.5 text-[10px] font-medium uppercase tracking-[1.5px] text-navy-950'>
                  Destaque
                </span>
              )}
              <div className='absolute -bottom-3 -right-3 h-16 w-16 border-b border-r border-gold-500/15' />
            </div>
          </Reveal>

          {/* Info */}
          <div className='lg:col-span-3'>
            <Reveal>
              <p className='mb-2 text-[11px] uppercase tracking-[2px] text-gold-600'>
                {livro.publisher} — {livro.year}
              </p>
              <h1 className='font-[family-name:var(--font-cormorant)] text-3xl font-normal text-cream-100 lg:text-4xl'>
                {livro.title}
              </h1>
              {livro.subtitle && (
                <p className='mt-2 text-[16px] italic text-gold-600'>
                  {livro.subtitle}
                </p>
              )}
              <p className='mt-2 text-[14px] text-txt-muted'>
                por {livro.author}
              </p>
              <div className='mt-3 h-px w-12 bg-gold-500/40' />
            </Reveal>

            {/* Price block */}
            <Reveal delay={0.1}>
              <div className='mt-6 flex items-end gap-4'>
                {livro.originalPrice && (
                  <span className='text-[16px] text-txt-muted line-through'>
                    R$ {livro.originalPrice.toFixed(2).replace('.', ',')}
                  </span>
                )}
                <span className='font-[family-name:var(--font-cormorant)] text-4xl text-gold-500'>
                  R$ {livro.price.toFixed(2).replace('.', ',')}
                </span>
              </div>

              <div className='mt-2 flex items-center gap-2 text-[12px]'>
                {livro.inStock ? (
                  <>
                    <Check size={14} className='text-green-500' />
                    <span className='text-green-400'>Em estoque</span>
                  </>
                ) : (
                  <span className='text-red-400'>Indisponivel</span>
                )}
              </div>

              <button
                onClick={() => addItem(livro)}
                disabled={!livro.inStock}
                className='mt-6 inline-flex items-center gap-3 bg-gold-500 px-10 py-4 text-[12px] font-medium uppercase tracking-[2px] text-navy-950 transition-colors hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-50'
              >
                <ShoppingCart size={16} />
                Adicionar ao carrinho
              </button>
            </Reveal>

            {/* Description */}
            <Reveal delay={0.15}>
              <div className='mt-10'>
                <h2 className='mb-3 text-[11px] uppercase tracking-[2px] text-gold-500'>
                  Sobre a obra
                </h2>
                <p className='text-[15px] leading-relaxed text-txt-muted'>
                  {livro.longDescription}
                </p>
              </div>
            </Reveal>

            {/* Topics */}
            <Reveal delay={0.2}>
              <div className='mt-8'>
                <h2 className='mb-3 text-[11px] uppercase tracking-[2px] text-gold-500'>
                  Temas abordados
                </h2>
                <div className='flex flex-wrap gap-2'>
                  {livro.topics.map(topic => (
                    <span
                      key={topic}
                      className='border border-gold-500/15 bg-navy-800/30 px-3 py-1.5 text-[12px] text-txt-muted'
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Specs grid */}
            <Reveal delay={0.25}>
              <div className='mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4'>
                <div className='border border-gold-500/8 bg-navy-800/20 p-4'>
                  <Package
                    size={16}
                    strokeWidth={1.2}
                    className='mb-2 text-gold-600'
                  />
                  <p className='text-[11px] uppercase tracking-[1px] text-gold-600'>
                    Paginas
                  </p>
                  <p className='mt-1 text-[16px] text-cream-100'>
                    {livro.pages}
                  </p>
                </div>
                <div className='border border-gold-500/8 bg-navy-800/20 p-4'>
                  <Ruler
                    size={16}
                    strokeWidth={1.2}
                    className='mb-2 text-gold-600'
                  />
                  <p className='text-[11px] uppercase tracking-[1px] text-gold-600'>
                    Dimensoes
                  </p>
                  <p className='mt-1 text-[14px] text-cream-100'>
                    {livro.dimensions.width} x {livro.dimensions.height} x{' '}
                    {livro.dimensions.depth} {livro.dimensions.unit}
                  </p>
                </div>
                <div className='border border-gold-500/8 bg-navy-800/20 p-4'>
                  <Weight
                    size={16}
                    strokeWidth={1.2}
                    className='mb-2 text-gold-600'
                  />
                  <p className='text-[11px] uppercase tracking-[1px] text-gold-600'>
                    Peso
                  </p>
                  <p className='mt-1 text-[16px] text-cream-100'>
                    {livro.weight >= 1000
                      ? `${(livro.weight / 1000).toFixed(1).replace('.', ',')}kg`
                      : `${livro.weight}g`}
                  </p>
                </div>
                <div className='border border-gold-500/8 bg-navy-800/20 p-4'>
                  <Truck
                    size={16}
                    strokeWidth={1.2}
                    className='mb-2 text-gold-600'
                  />
                  <p className='text-[11px] uppercase tracking-[1px] text-gold-600'>
                    Envio
                  </p>
                  <p className='mt-1 text-[14px] text-cream-100'>Todo Brasil</p>
                </div>
              </div>
            </Reveal>

            {/* Edition details */}
            <Reveal delay={0.3}>
              <div className='mt-6 border-l border-gold-500/20 pl-5'>
                <div className='space-y-2 text-[13px]'>
                  <p>
                    <span className='text-txt-muted'>Edicao:</span>{' '}
                    <span className='text-cream-100'>{livro.edition}</span>
                  </p>
                  {livro.isbn && (
                    <p>
                      <span className='text-txt-muted'>ISBN:</span>{' '}
                      <span className='text-cream-100'>{livro.isbn}</span>
                    </p>
                  )}
                  <p>
                    <span className='text-txt-muted'>Autor:</span>{' '}
                    <span className='text-cream-100'>{livro.author}</span>
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Related books */}
        {outrosLivros.length > 0 && (
          <Reveal className='mt-24'>
            <h2 className='mb-8 text-center font-[family-name:var(--font-cormorant)] text-2xl text-cream-100'>
              Outros livros do autor
            </h2>
            <div className='grid gap-4 sm:grid-cols-3'>
              {outrosLivros.map(outro => (
                <Link
                  key={outro.slug}
                  href={`/livros/${outro.slug}`}
                  className='group flex gap-4 border border-gold-500/8 bg-navy-800/20 p-5 transition-all duration-300 hover:border-gold-500/20'
                >
                  <div className='h-16 w-12 shrink-0 overflow-hidden bg-navy-800/40 border border-gold-500/10'>
                    <Image
                      src={outro.image}
                      alt={outro.title}
                      width={48}
                      height={64}
                      className='h-full w-full object-cover'
                    />
                  </div>
                  <div className='min-w-0'>
                    <h3 className='truncate font-[family-name:var(--font-cormorant)] text-[15px] text-cream-100 transition-colors group-hover:text-gold-400'>
                      {outro.title}
                    </h3>
                    <p className='mt-1 text-[12px] text-txt-muted'>
                      {outro.year} — R${' '}
                      {outro.price.toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
