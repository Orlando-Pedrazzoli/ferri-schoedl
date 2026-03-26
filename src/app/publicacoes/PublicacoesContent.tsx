'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FileText, Scale, ExternalLink, ArrowRight } from 'lucide-react';
import { Reveal, RevealStagger, RevealItem } from '@/components/Reveal';
import type { Publicacao, Artigo } from '@/lib/data';

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

interface PublicacoesContentProps {
  publicacoes: Publicacao[];
  artigos: Artigo[];
  totalArtigos: number;
}

export function PublicacoesContent({
  publicacoes,
  artigos,
  totalArtigos,
}: PublicacoesContentProps) {
  const [filtro, setFiltro] = useState<ArtigoFilter>('todos');
  const [mostrarTodos, setMostrarTodos] = useState(false);

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

  const ARTIGOS_LIMIT = 6;
  const artigosVisiveis = mostrarTodos
    ? artigosFiltrados
    : artigosFiltrados.slice(0, ARTIGOS_LIMIT);
  const temMais = artigosFiltrados.length > ARTIGOS_LIMIT;

  const publicacoesSolo = publicacoes.filter(p => p.type === 'solo');
  const publicacoesCoautoria = publicacoes.filter(p => p.type === 'coautoria');

  return (
    <>
      {/* OBRA PRINCIPAL */}
      <Reveal>
        <div className='mb-10 border border-gold-500/15 bg-navy-800/30 p-5 sm:mb-12 sm:p-6 lg:p-8'>
          <span className='mb-4 inline-block border border-gold-500/15 bg-navy-800/40 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[2px] text-gold-500'>
            Obra principal
          </span>
          <h2 className='font-[family-name:var(--font-cormorant)] text-xl text-cream-100 sm:text-2xl'>
            Liberdade de Imprensa e Direitos da Personalidade
          </h2>
          <p className='mt-1 text-[13px] italic text-gold-600 sm:text-sm'>
            Uma abordagem interdisciplinar — Letras Jurídicas, 2019 — Prefácio
            de Fernando Capez
          </p>
          <p className='mt-3 text-[13px] leading-relaxed text-txt-muted sm:text-sm'>
            Resultante do Mestrado Interdisciplinar na UFBA, a obra examina a
            relação entre o Judiciário e a Mídia. Propõe a aplicação da Teoria
            da Ponderação (Robert Alexy) para resolver conflitos onde a
            liberdade de informar colide com o direito à honra e à imagem.
            Destaque na Promoção Natal Migalhas em 2018 e 2019.
          </p>
        </div>
      </Reveal>

      {/* LIVROS — AUTORIA PRÓPRIA */}
      <Reveal>
        <p className='mb-4 flex items-center gap-3 text-xs font-medium uppercase tracking-[3px] text-gold-500'>
          <span className='h-px w-8 bg-gold-500/40' />
          Livros — Autoria própria ({publicacoesSolo.length})
        </p>
      </Reveal>

      <RevealStagger className='grid gap-3 md:grid-cols-2'>
        {publicacoesSolo.map((pub, i) => (
          <RevealItem key={`solo-${i}`}>
            <div className='group flex gap-3 border border-gold-500/8 bg-navy-800/20 p-4 transition-all duration-300 hover:border-gold-500/15 sm:gap-4 sm:p-5'>
              <div className='shrink-0'>
                <div className='flex h-11 w-11 items-center justify-center border border-gold-500/15 bg-navy-800/40 sm:h-14 sm:w-14'>
                  <span className='font-[family-name:var(--font-cormorant)] text-base font-light text-gold-500 sm:text-xl'>
                    {pub.year}
                  </span>
                </div>
              </div>
              <div className='min-w-0 flex-1'>
                <h3 className='font-[family-name:var(--font-cormorant)] text-base leading-tight text-cream-100 sm:text-lg'>
                  {pub.title}
                </h3>
                {pub.subtitle && (
                  <p className='mt-0.5 text-[12px] italic leading-snug text-gold-600 sm:text-[13px]'>
                    {pub.subtitle}
                  </p>
                )}
                <p className='mt-1.5 text-[12px] text-txt-muted sm:text-[13px]'>
                  {pub.publisher}
                  {pub.pages ? ` — ${pub.pages}p.` : ''}
                </p>
                {pub.description && (
                  <p className='mt-1.5 hidden text-[13px] leading-relaxed text-txt-muted/70 sm:line-clamp-2 sm:block'>
                    {pub.description}
                  </p>
                )}
              </div>
            </div>
          </RevealItem>
        ))}
      </RevealStagger>

      {/* LIVROS — COAUTORIA */}
      <Reveal className='mt-10 sm:mt-12'>
        <p className='mb-4 flex items-center gap-3 text-xs font-medium uppercase tracking-[3px] text-gold-500'>
          <span className='h-px w-8 bg-gold-500/40' />
          Obras coletivas — Coautoria ({publicacoesCoautoria.length})
        </p>
      </Reveal>

      <RevealStagger className='grid gap-3 md:grid-cols-2'>
        {publicacoesCoautoria.map((pub, i) => (
          <RevealItem key={`co-${i}`}>
            <div className='group flex gap-3 border border-gold-500/8 bg-navy-800/20 p-4 transition-all duration-300 hover:border-gold-500/15 sm:gap-4 sm:p-5'>
              <div className='shrink-0'>
                <div className='flex h-11 w-11 items-center justify-center border border-gold-500/15 bg-navy-800/40 sm:h-14 sm:w-14'>
                  <span className='font-[family-name:var(--font-cormorant)] text-base font-light text-gold-500 sm:text-xl'>
                    {pub.year}
                  </span>
                </div>
              </div>
              <div className='min-w-0 flex-1'>
                <h3 className='font-[family-name:var(--font-cormorant)] text-base leading-tight text-cream-100 sm:text-lg'>
                  {pub.title}
                </h3>
                {pub.subtitle && (
                  <p className='mt-0.5 text-[12px] italic leading-snug text-gold-600 sm:text-[13px]'>
                    {pub.subtitle}
                  </p>
                )}
                <div className='mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-txt-muted sm:text-[13px]'>
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

      {/* ARTIGOS PUBLICADOS */}
      <Reveal className='mt-12 sm:mt-16'>
        <div>
          <p className='mb-2 flex items-center gap-3 text-xs font-medium uppercase tracking-[3px] text-gold-500'>
            <span className='h-px w-8 bg-gold-500/40' />
            Artigos publicados ({totalArtigos})
          </p>
          <p className='mb-6 max-w-xl text-[13px] text-txt-muted sm:text-sm'>
            Textos técnicos e doutrinários em portais jurídicos de referência.
          </p>

          {/* Filtros */}
          <div className='-mx-4 mb-6 flex gap-1.5 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0'>
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
                onClick={() => {
                  setFiltro(f.key);
                  setMostrarTodos(false);
                }}
                className={`shrink-0 px-3 py-1.5 text-[11px] uppercase tracking-[1.5px] transition-all duration-300 ${
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

      <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
        {artigosVisiveis.map((artigo, i) => (
          <motion.div
            key={`art-${artigo.title}-${artigo.year}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: i < ARTIGOS_LIMIT ? i * 0.05 : 0,
            }}
            className='flex h-full flex-col border border-gold-500/8 bg-navy-800/20 p-4 transition-all duration-300 hover:border-gold-500/15'
          >
            <div className='mb-2 flex items-start justify-between gap-2'>
              <FileText
                size={16}
                strokeWidth={1.2}
                className='mt-0.5 shrink-0 text-gold-500/60'
              />
              <span className='shrink-0 text-[11px] tabular-nums text-gold-600/50'>
                {artigo.year}
              </span>
            </div>
            <h3 className='font-[family-name:var(--font-cormorant)] text-[15px] leading-snug text-cream-100 sm:text-base'>
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
          </motion.div>
        ))}
      </div>

      {/* Botão ver mais / ver menos */}
      {temMais && (
        <div className='mt-6 text-center'>
          <button
            onClick={() => setMostrarTodos(!mostrarTodos)}
            className='inline-flex items-center gap-2 border border-gold-500/20 px-5 py-2 text-[12px] uppercase tracking-[1.5px] text-gold-500 transition-all duration-300 hover:border-gold-500/40 hover:bg-gold-500/5'
          >
            {mostrarTodos
              ? 'Ver menos'
              : `Ver todos os ${artigosFiltrados.length} artigos`}
          </button>
        </div>
      )}

      {/* VITÓRIAS JURÍDICAS */}
      <Reveal className='mt-12 sm:mt-16'>
        <p className='mb-4 flex items-center gap-3 text-xs font-medium uppercase tracking-[3px] text-gold-500'>
          <span className='h-px w-8 bg-gold-500/40' />
          Vitórias jurídicas e proteção da imagem
        </p>
      </Reveal>

      <RevealStagger className='grid gap-3 md:grid-cols-3'>
        {vitorias.map((vitoria, i) => (
          <RevealItem key={`vit-${i}`}>
            <div className='border border-gold-500/8 bg-navy-800/20 p-4 transition-all duration-300 hover:border-gold-500/15 sm:p-5'>
              <Scale
                size={18}
                strokeWidth={1}
                className='mb-3 text-gold-500/50'
              />
              <h3 className='font-[family-name:var(--font-cormorant)] text-[15px] text-cream-100 sm:text-base'>
                {vitoria.titulo}
              </h3>
              <p className='mt-1 text-[11px] uppercase tracking-[1.5px] text-gold-600'>
                {vitoria.instancia}
              </p>
              <p className='mt-2 text-[12px] leading-relaxed text-txt-muted sm:text-[13px]'>
                {vitoria.descricao}
              </p>
            </div>
          </RevealItem>
        ))}
      </RevealStagger>

      {/* ONDE ENCONTRAR */}
      <Reveal className='mt-12 sm:mt-16'>
        <div className='border border-gold-500/10 bg-navy-900/40 p-5 sm:p-6'>
          <p className='mb-4 text-xs font-medium uppercase tracking-[3px] text-gold-500'>
            Onde encontrar
          </p>
          <div className='grid gap-4 md:grid-cols-3'>
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
                  <p className='mt-0.5 text-[12px] text-txt-muted sm:text-[13px]'>
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
    </>
  );
}
