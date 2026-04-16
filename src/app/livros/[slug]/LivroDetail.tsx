// src/app/livros/[slug]/LivroDetail.tsx
'use client';

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
  ExternalLink,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Reveal } from '@/components/Reveal';
import { useCart } from '@/components/CartProvider';
import type { Livro } from '@/lib/data';

// Links de compra nas editoras por slug
const EDITORA_LINKS: Record<string, string> = {
  'responsabilidade-penal-notarios-registradores':
    'https://www.amazon.com.br/Responsabilidade-Penal-dos-Not%C3%A1rios-Registradores/dp/8568215173',
  'questoes-exame-oral-cartorios':
    'https://www.amazon.com.br/Quest%C3%B5es-Comentadas-Exame-Concurso-Cart%C3%B3rios/dp/8568215203',
  'direito-notarial-registral-artigos-vol-1':
    'https://loja.ykeditora.com/direito-notarial-e-registral/o-direito-notarial-e-registral-em-artigos',
  'direito-notarial-registral-artigos-vol-2':
    'https://loja.ykeditora.com/direito-notarial-e-registral/o-direito-notarial-e-registral-em-artigos-vol-2',
  'direitos-fundamentais-relacoes-juridicas':
    'https://www.editoragz.com.br/direitos-fundamentais-e-relacoes-juridicas-7442249',
  'reflexiones-derecho-latinoamericano-vol-11':
    'https://www.pensamientopenal.com.ar/system/files/2015/11/doctrina42329.pdf',
  'reflexiones-derecho-latinoamericano-vol-15':
    'https://www.pensamientopenal.com.ar/system/files/2015/11/doctrina42329.pdf',
};

interface RelatedBook {
  slug: string;
  title: string;
  image: string;
  year: number;
  price: number;
  saleNote: string;
}

interface LivroDetailProps {
  livro: Livro;
  outrosLivros: RelatedBook[];
}

export function LivroDetail({ livro, outrosLivros }: LivroDetailProps) {
  const { addItem } = useCart();

  const editoraLink = EDITORA_LINKS[livro.slug] || '';

  return (
    <section className='pb-16 pt-24 sm:pb-24 sm:pt-28 lg:pb-32'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className='mb-8 sm:mb-10'
        >
          <Link
            href='/livros'
            className='group inline-flex items-center gap-2 text-[13px] uppercase tracking-[1.5px] text-gold-600 transition-colors hover:text-gold-500'
          >
            <ArrowLeft
              size={14}
              className='transition-transform group-hover:-translate-x-1'
            />
            Voltar para livros
          </Link>
        </motion.div>

        <div className='grid gap-10 sm:gap-12 lg:grid-cols-5 lg:gap-16'>
          {/* Cover */}
          <Reveal className='lg:col-span-2'>
            <div className='relative'>
              <div className='flex aspect-[3/4] items-center justify-center overflow-hidden border border-gold-500/12 bg-navy-800/30'>
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
              {!livro.inStock && (
                <div className='absolute inset-0 flex items-center justify-center bg-navy-950/60 backdrop-blur-[2px]'>
                  <span className='border border-red-500/40 bg-red-500/10 px-4 py-2 text-[11px] font-medium uppercase tracking-[2px] text-red-300'>
                    Indisponivel
                  </span>
                </div>
              )}
              <div className='absolute -bottom-3 -right-3 hidden h-16 w-16 border-b border-r border-gold-500/15 sm:block' />
            </div>
          </Reveal>

          {/* Info */}
          <div className='lg:col-span-3'>
            <Reveal>
              <div className='mb-2 flex flex-wrap items-center gap-2'>
                <p className='text-xs uppercase tracking-[2px] text-gold-600'>
                  {livro.publisher} — {livro.year}
                </p>
                {livro.coauthor && (
                  <span className='border border-gold-500/15 px-2 py-0.5 text-[10px] uppercase tracking-[1px] text-gold-600/60'>
                    Coautoria
                  </span>
                )}
              </div>
              <h1 className='font-[family-name:var(--font-cormorant)] text-2xl font-normal text-cream-100 sm:text-3xl lg:text-4xl'>
                {livro.title}
              </h1>
              {livro.subtitle && (
                <p className='mt-2 text-base italic text-gold-600'>
                  {livro.subtitle}
                </p>
              )}
              <p className='mt-2 text-sm text-txt-muted'>por {livro.author}</p>
              <div className='mt-3 h-px w-12 bg-gold-500/40' />
            </Reveal>

            {/* Price block */}
            <Reveal delay={0.1}>
              <div className='mt-6 flex items-end gap-4'>
                {livro.originalPrice && (
                  <span className='text-base text-txt-muted line-through'>
                    R$ {livro.originalPrice.toFixed(2).replace('.', ',')}
                  </span>
                )}
                <span className='font-[family-name:var(--font-cormorant)] text-3xl text-gold-500 sm:text-4xl'>
                  R$ {livro.price.toFixed(2).replace('.', ',')}
                </span>
              </div>

              <div className='mt-2 flex flex-wrap items-center gap-3 text-[13px]'>
                {livro.inStock ? (
                  <span className='flex items-center gap-1.5'>
                    <Check size={14} className='text-green-500' />
                    <span className='text-green-400'>Em estoque</span>
                  </span>
                ) : (
                  <span className='font-medium text-red-400'>Indisponivel</span>
                )}
                <span className='text-txt-muted'>·</span>
                <span className='text-txt-muted'>{livro.saleNote}</span>
              </div>

              {/* CTA */}
              <div className='mt-6'>
                {livro.saleType === 'direto' ? (
                  <button
                    onClick={() => addItem(livro)}
                    disabled={!livro.inStock}
                    className='inline-flex items-center gap-3 bg-gold-500 px-8 py-3.5 text-[13px] font-medium uppercase tracking-[2px] text-navy-950 transition-colors hover:bg-gold-400 disabled:cursor-not-allowed disabled:bg-navy-700 disabled:text-txt-muted disabled:hover:bg-navy-700 sm:px-10 sm:py-4'
                    aria-label={
                      livro.inStock
                        ? 'Adicionar ao carrinho'
                        : 'Produto indisponivel'
                    }
                  >
                    <ShoppingCart size={16} />
                    {livro.inStock ? 'Adicionar ao carrinho' : 'Indisponivel'}
                  </button>
                ) : livro.inStock && editoraLink ? (
                  <a
                    href={editoraLink}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='inline-flex items-center gap-3 bg-gold-500 px-8 py-3.5 text-[13px] font-medium uppercase tracking-[2px] text-navy-950 transition-colors hover:bg-gold-400 sm:px-10 sm:py-4'
                  >
                    <ExternalLink size={16} />
                    Comprar na editora
                  </a>
                ) : (
                  <button
                    type='button'
                    disabled
                    className='inline-flex cursor-not-allowed items-center gap-3 bg-navy-700 px-8 py-3.5 text-[13px] font-medium uppercase tracking-[2px] text-txt-muted sm:px-10 sm:py-4'
                    aria-label='Produto indisponivel'
                  >
                    <ExternalLink size={16} />
                    Indisponivel
                  </button>
                )}

                {!livro.inStock && (
                  <p className='mt-3 text-xs text-txt-muted'>
                    Este titulo esta temporariamente indisponivel. Volte em
                    breve.
                  </p>
                )}
              </div>
            </Reveal>

            {/* Description */}
            <Reveal delay={0.15}>
              <div className='mt-10'>
                <h2 className='mb-3 text-xs uppercase tracking-[2px] text-gold-500'>
                  Sobre a obra
                </h2>
                <p className='text-base leading-relaxed text-txt-muted'>
                  {livro.longDescription}
                </p>
              </div>
            </Reveal>

            {/* Topics */}
            <Reveal delay={0.2}>
              <div className='mt-8'>
                <h2 className='mb-3 text-xs uppercase tracking-[2px] text-gold-500'>
                  Temas abordados
                </h2>
                <div className='flex flex-wrap gap-2'>
                  {livro.topics.map(topic => (
                    <span
                      key={topic}
                      className='border border-gold-500/15 bg-navy-800/30 px-3 py-1.5 text-[13px] text-txt-muted'
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Specs grid */}
            <Reveal delay={0.25}>
              <div className='mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4'>
                <div className='border border-gold-500/8 bg-navy-800/20 p-3 sm:p-4'>
                  <Package
                    size={16}
                    strokeWidth={1.2}
                    className='mb-2 text-gold-600'
                  />
                  <p className='text-xs uppercase tracking-[1px] text-gold-600'>
                    Paginas
                  </p>
                  <p className='mt-1 text-base text-cream-100'>{livro.pages}</p>
                </div>
                <div className='border border-gold-500/8 bg-navy-800/20 p-3 sm:p-4'>
                  <Ruler
                    size={16}
                    strokeWidth={1.2}
                    className='mb-2 text-gold-600'
                  />
                  <p className='text-xs uppercase tracking-[1px] text-gold-600'>
                    Dimensoes
                  </p>
                  <p className='mt-1 text-sm text-cream-100'>
                    {livro.dimensions.width} x {livro.dimensions.height} x{' '}
                    {livro.dimensions.depth} {livro.dimensions.unit}
                  </p>
                </div>
                <div className='border border-gold-500/8 bg-navy-800/20 p-3 sm:p-4'>
                  <Weight
                    size={16}
                    strokeWidth={1.2}
                    className='mb-2 text-gold-600'
                  />
                  <p className='text-xs uppercase tracking-[1px] text-gold-600'>
                    Peso
                  </p>
                  <p className='mt-1 text-base text-cream-100'>
                    {livro.weight >= 1000
                      ? `${(livro.weight / 1000).toFixed(1).replace('.', ',')}kg`
                      : `${livro.weight}g`}
                  </p>
                </div>
                <div className='border border-gold-500/8 bg-navy-800/20 p-3 sm:p-4'>
                  <Truck
                    size={16}
                    strokeWidth={1.2}
                    className='mb-2 text-gold-600'
                  />
                  <p className='text-xs uppercase tracking-[1px] text-gold-600'>
                    Envio
                  </p>
                  <p className='mt-1 text-sm text-cream-100'>Todo Brasil</p>
                </div>
              </div>
            </Reveal>

            {/* Edition details */}
            <Reveal delay={0.3}>
              <div className='mt-6 border-l border-gold-500/20 pl-5'>
                <div className='space-y-2 text-sm'>
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
          <Reveal className='mt-16 sm:mt-24'>
            <h2 className='mb-8 text-center font-[family-name:var(--font-cormorant)] text-2xl text-cream-100'>
              Outros livros do autor
            </h2>
            <div className='grid gap-4 sm:grid-cols-3'>
              {outrosLivros.map(outro => (
                <Link
                  key={outro.slug}
                  href={`/livros/${outro.slug}`}
                  className='group flex gap-4 border border-gold-500/8 bg-navy-800/20 p-4 transition-all duration-300 hover:border-gold-500/20 sm:p-5'
                >
                  <div className='h-16 w-12 shrink-0 overflow-hidden border border-gold-500/10 bg-navy-800/40'>
                    <Image
                      src={outro.image}
                      alt={outro.title}
                      width={48}
                      height={64}
                      className='h-full w-full object-cover'
                    />
                  </div>
                  <div className='min-w-0'>
                    <h3 className='truncate font-[family-name:var(--font-cormorant)] text-base text-cream-100 transition-colors group-hover:text-gold-400'>
                      {outro.title}
                    </h3>
                    <p className='mt-1 text-[13px] text-txt-muted'>
                      {outro.year} — R${' '}
                      {outro.price.toFixed(2).replace('.', ',')}
                    </p>
                    <p className='mt-0.5 text-[11px] text-txt-muted'>
                      {outro.saleNote}
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
