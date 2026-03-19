'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  FileText,
  Scale,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';
import { Reveal, RevealStagger, RevealItem } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';
import { publicacoes, artigos, siteConfig } from '@/lib/data';

const vitorias = [
  {
    titulo: 'Indenização contra a Rede Record',
    instancia: 'STJ — 3ª Turma',
    descricao:
      'Condenação mantida ao pagamento de R$ 200 mil por danos morais decorrentes de exposição sensacionalista.',
  },
  {
    titulo: 'Vitória contra a Editora Abril / Revista Veja',
    instancia: 'Justiça de São Paulo',
    descricao:
      'Indenização por publicações injuriosas que divulgaram informações equivocadas.',
  },
  {
    titulo: 'Condenação do Jornal O Estado de S. Paulo',
    instancia: '35ª Vara Cível de São Paulo',
    descricao:
      'Indenização por danos morais devido a publicações difamatórias.',
  },
];

type ArtigoFilter = 'todos' | 'Carta Forense' | 'Migalhas' | 'Outros';

export default function PublicacoesPage() {
  const [filtro, setFiltro] = useState<ArtigoFilter>('todos');

  const artigosFiltrados =
    filtro === 'todos'
      ? artigos
      : filtro === 'Outros'
        ? artigos.filter(
            a =>
              !a.publisher.includes('Carta Forense') &&
              !a.publisher.includes('Migalhas'),
          )
        : artigos.filter(a => a.publisher.includes(filtro));

  const publicacoesSolo = publicacoes.filter(p => p.type === 'solo');
  const publicacoesCoautoria = publicacoes.filter(p => p.type === 'coautoria');

  return (
    <section className='pb-16 pt-28 sm:pb-24 sm:pt-32 lg:pb-32'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <SectionHeading
          label='Obras e artigos'
          title='Publicações'
          description={`Autor de ${siteConfig.stats.livrosPublicados} livros e mais de ${siteConfig.stats.artigosPublicados} artigos jurídicos — produção acadêmica e editorial que reflete décadas de experiência na prática e no ensino do Direito.`}
        />

        {/* ───── OBRA PRINCIPAL (compacta) ───── */}
        <Reveal>
          <div className='mb-10 border border-gold-500/15 bg-navy-800/30 p-5 sm:mb-12 sm:p-6 lg:p-8'>
            <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6'>
              <div className='shrink-0'>
                <span className='inline-block border border-gold-500/15 bg-navy-800/40 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[2px] text-gold-500'>
                  Obra principal
                </span>
              </div>
              <div className='flex-1'>
                <h2 className='font-[family-name:var(--font-cormorant)] text-xl text-cream-100 sm:text-2xl'>
                  Liberdade de Imprensa e Direitos da Personalidade
                </h2>
                <p className='mt-1 text-sm italic text-gold-600'>
                  Uma abordagem interdisciplinar — Letras Jurídicas, 2019 —
                  Prefácio de Fernando Capez
                </p>
                <p className='mt-3 text-sm leading-relaxed text-txt-muted'>
                  Resultante do Mestrado Interdisciplinar na UFBA, a obra
                  examina a relação entre o Judiciário e a Mídia. Propõe a
                  aplicação da Teoria da Ponderação (Robert Alexy) para resolver
                  conflitos onde a liberdade de informar colide com o direito à
                  honra e à imagem. Destaque na Promoção Natal Migalhas em 2018
                  e 2019.
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* ───── LIVROS — AUTORIA PRÓPRIA (grid 2 colunas) ───── */}
        <Reveal>
          <p className='mb-4 flex items-center gap-3 text-xs font-medium uppercase tracking-[3px] text-gold-500'>
            <span className='h-px w-8 bg-gold-500/40' />
            Livros — Autoria própria ({publicacoesSolo.length})
          </p>
        </Reveal>

        <RevealStagger className='grid gap-3 sm:grid-cols-2'>
          {publicacoesSolo.map((pub, i) => (
            <RevealItem key={`solo-${i}`}>
              <div className='group flex gap-4 border border-gold-500/8 bg-navy-800/20 p-4 transition-all duration-300 hover:border-gold-500/15 sm:p-5'>
                <div className='shrink-0'>
                  <div className='flex h-14 w-14 items-center justify-center border border-gold-500/15 bg-navy-800/40'>
                    <span className='font-[family-name:var(--font-cormorant)] text-xl font-light text-gold-500'>
                      {pub.year}
                    </span>
                  </div>
                </div>
                <div className='min-w-0'>
                  <h3 className='font-[family-name:var(--font-cormorant)] text-base leading-tight text-cream-100 sm:text-lg'>
                    {pub.title}
                  </h3>
                  {pub.subtitle && (
                    <p className='mt-0.5 truncate text-[13px] italic text-gold-600'>
                      {pub.subtitle}
                    </p>
                  )}
                  <p className='mt-2 text-[13px] text-txt-muted'>
                    {pub.publisher}
                    {pub.pages ? ` — ${pub.pages}p.` : ''}
                  </p>
                  {pub.description && (
                    <p className='mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-txt-muted/70'>
                      {pub.description}
                    </p>
                  )}
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealStagger>

        {/* ───── LIVROS — COAUTORIA (grid 2 colunas) ───── */}
        <Reveal className='mt-10 sm:mt-12'>
          <p className='mb-4 flex items-center gap-3 text-xs font-medium uppercase tracking-[3px] text-gold-500'>
            <span className='h-px w-8 bg-gold-500/40' />
            Obras coletivas — Coautoria ({publicacoesCoautoria.length})
          </p>
        </Reveal>

        <RevealStagger className='grid gap-3 sm:grid-cols-2'>
          {publicacoesCoautoria.map((pub, i) => (
            <RevealItem key={`co-${i}`}>
              <div className='group flex gap-4 border border-gold-500/8 bg-navy-800/20 p-4 transition-all duration-300 hover:border-gold-500/15 sm:p-5'>
                <div className='shrink-0'>
                  <div className='flex h-14 w-14 items-center justify-center border border-gold-500/15 bg-navy-800/40'>
                    <span className='font-[family-name:var(--font-cormorant)] text-xl font-light text-gold-500'>
                      {pub.year}
                    </span>
                  </div>
                </div>
                <div className='min-w-0'>
                  <h3 className='font-[family-name:var(--font-cormorant)] text-base leading-tight text-cream-100 sm:text-lg'>
                    {pub.title}
                  </h3>
                  {pub.subtitle && (
                    <p className='mt-0.5 truncate text-[13px] italic text-gold-600'>
                      {pub.subtitle}
                    </p>
                  )}
                  <div className='mt-2 flex flex-wrap items-center gap-2 text-[13px] text-txt-muted'>
                    <span>{pub.publisher}</span>
                    {pub.pages && (
                      <>
                        <span className='text-gold-500/20'>·</span>
                        <span>{pub.pages}p.</span>
                      </>
                    )}
                    <span className='border border-gold-500/12 px-1.5 py-0.5 text-[10px] uppercase tracking-[1px] text-gold-600/50'>
                      Coautoria
                    </span>
                  </div>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealStagger>

        {/* ───── ARTIGOS PUBLICADOS ───── */}
        <Reveal className='mt-12 sm:mt-16'>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
            <div>
              <p className='mb-2 flex items-center gap-3 text-xs font-medium uppercase tracking-[3px] text-gold-500'>
                <span className='h-px w-8 bg-gold-500/40' />
                Artigos publicados ({artigos.length})
              </p>
              <p className='max-w-xl text-sm text-txt-muted'>
                Textos técnicos e doutrinários em portais jurídicos de
                referência.
              </p>
            </div>

            {/* Filtros inline */}
            <div className='flex flex-wrap gap-1.5'>
              {(
                [
                  { key: 'todos', label: 'Todos' },
                  { key: 'Carta Forense', label: 'Carta Forense' },
                  { key: 'Migalhas', label: 'Migalhas' },
                  { key: 'Outros', label: 'Outros' },
                ] as { key: ArtigoFilter; label: string }[]
              ).map(f => (
                <button
                  key={f.key}
                  onClick={() => setFiltro(f.key)}
                  className={`px-3 py-1.5 text-[11px] uppercase tracking-[1.5px] transition-all duration-300 ${
                    filtro === f.key
                      ? 'border border-gold-500 bg-gold-500/10 text-gold-500'
                      : 'border border-gold-500/10 text-txt-muted hover:border-gold-500/30 hover:text-gold-500'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        <RevealStagger className='mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
          {artigosFiltrados.map((artigo, i) => (
            <RevealItem key={`art-${i}`}>
              <div className='flex h-full flex-col border border-gold-500/8 bg-navy-800/20 p-4 transition-all duration-300 hover:border-gold-500/15 sm:p-5'>
                <div className='mb-2 flex items-start justify-between gap-2'>
                  <FileText
                    size={16}
                    strokeWidth={1.2}
                    className='mt-0.5 shrink-0 text-gold-500/60'
                  />
                  <span className='text-[11px] tabular-nums text-gold-600/50'>
                    {artigo.year}
                  </span>
                </div>
                <h3 className='font-[family-name:var(--font-cormorant)] text-base leading-snug text-cream-100'>
                  {artigo.title}
                </h3>
                <p className='mt-1 text-[11px] uppercase tracking-[1px] text-gold-600'>
                  {artigo.publisher}
                </p>
                {artigo.coauthors && artigo.coauthors.length > 0 && (
                  <p className='mt-1.5 text-[11px] text-gold-600/40'>
                    c/ {artigo.coauthors.join(', ')}
                  </p>
                )}
              </div>
            </RevealItem>
          ))}
        </RevealStagger>

        {/* ───── VITÓRIAS JURÍDICAS (compactas) ───── */}
        <Reveal className='mt-12 sm:mt-16'>
          <p className='mb-4 flex items-center gap-3 text-xs font-medium uppercase tracking-[3px] text-gold-500'>
            <span className='h-px w-8 bg-gold-500/40' />
            Vitórias jurídicas e proteção da imagem
          </p>
        </Reveal>

        <RevealStagger className='grid gap-3 sm:grid-cols-3'>
          {vitorias.map((vitoria, i) => (
            <RevealItem key={`vit-${i}`}>
              <div className='border border-gold-500/8 bg-navy-800/20 p-4 transition-all duration-300 hover:border-gold-500/15 sm:p-5'>
                <Scale
                  size={18}
                  strokeWidth={1}
                  className='mb-3 text-gold-500/50'
                />
                <h3 className='font-[family-name:var(--font-cormorant)] text-base text-cream-100'>
                  {vitoria.titulo}
                </h3>
                <p className='mt-1 text-[11px] uppercase tracking-[1.5px] text-gold-600'>
                  {vitoria.instancia}
                </p>
                <p className='mt-2 text-[13px] leading-relaxed text-txt-muted'>
                  {vitoria.descricao}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealStagger>

        {/* ───── ONDE ENCONTRAR (compacto) ───── */}
        <Reveal className='mt-12 sm:mt-16'>
          <div className='border border-gold-500/10 bg-navy-900/40 p-5 sm:p-6'>
            <p className='mb-4 text-xs font-medium uppercase tracking-[3px] text-gold-500'>
              Onde encontrar
            </p>
            <div className='grid gap-4 sm:grid-cols-3'>
              {[
                {
                  name: 'Migalhas',
                  desc: 'Pesquise "Thales Ferri Schoedl" em migalhas.com.br',
                },
                {
                  name: 'Jusbrasil',
                  desc: 'Acórdãos e decisões sobre liberdade de imprensa',
                },
                {
                  name: 'Livrarias',
                  desc: 'Estante Virtual, Amazon, YK Editora, Letras Jurídicas ou direto com o autor',
                },
              ].map(item => (
                <div key={item.name} className='flex items-start gap-3'>
                  <ExternalLink
                    size={14}
                    strokeWidth={1.2}
                    className='mt-0.5 shrink-0 text-gold-600'
                  />
                  <div>
                    <p className='text-sm font-medium text-cream-100'>
                      {item.name}
                    </p>
                    <p className='mt-0.5 text-[13px] text-txt-muted'>
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* CTA */}
        <Reveal className='mt-10 text-center sm:mt-12'>
          <Link
            href='/livros'
            className='group inline-flex items-center gap-2 bg-gold-500 px-6 py-3 text-[13px] font-medium uppercase tracking-[2px] text-navy-950 transition-all duration-300 hover:bg-gold-400 sm:px-8 sm:py-3.5'
          >
            Ver livros à venda
            <ArrowRight
              size={14}
              className='transition-transform group-hover:translate-x-1'
            />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
