'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, MapPin, ChevronRight } from 'lucide-react';
import { Reveal, RevealStagger, RevealItem } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';
import { areasDeAtuacao, publicacoes } from '@/lib/data';

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className='relative flex min-h-screen items-center overflow-hidden'>
        {/* Background texture — dark mode only */}
        <div className='absolute inset-0 hidden bg-[radial-gradient(ellipse_at_top_right,_rgba(184,150,90,0.04)_0%,_transparent_60%)] dark:block' />
        <div className='absolute inset-0 hidden bg-[radial-gradient(ellipse_at_bottom_left,_rgba(17,40,64,0.5)_0%,_transparent_60%)] dark:block' />

        {/* Decorative vertical line */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className='absolute left-4 top-0 h-full w-px origin-top bg-gradient-to-b from-transparent via-gold-500/20 to-transparent sm:left-8 lg:left-16'
        />

        <div className='relative mx-auto w-full max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8 lg:pb-20 lg:pt-32'>
          <div className='grid items-end gap-10 lg:grid-cols-2 lg:gap-16'>
            {/* Text side */}
            <div>
              {/* Firm name — mobile only (hidden on lg where the navbar shows it) */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className='mb-10 sm:mb-12 lg:hidden'
              >
                <span className='font-[family-name:var(--font-cormorant)] text-2xl tracking-wide text-cream-100'>
                  Ferri Schoedl
                </span>
                <span className='ml-2 font-[family-name:var(--font-cormorant)] text-2xl tracking-wide text-gold-500'>
                  Advocacia
                </span>
              </motion.p>

              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className='mb-5 flex items-center gap-3 text-xs font-medium uppercase tracking-[3px] text-gold-500 sm:mb-6'
              >
                <span className='h-px w-8 bg-gold-500' />
                Advocacia especializada
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.3,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className='font-[family-name:var(--font-cormorant)] text-4xl font-light leading-[1.1] text-cream-100 sm:text-5xl md:text-6xl lg:text-7xl'
              >
                Defesa técnica
                <br />
                com{' '}
                <em className='font-normal italic text-gold-400'>
                  rigor e experiência
                </em>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                className='mt-6 max-w-xl text-base leading-relaxed text-txt-muted sm:mt-8'
              >
                Atuação estratégica nas áreas criminal, tribunal do júri,
                improbidade administrativa, imobiliário e cíveis. Escritório com
                sede em São Paulo e atuação em todo o território nacional.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.7 }}
                className='mt-8 flex flex-wrap gap-3 sm:mt-10 sm:gap-4'
              >
                <Link
                  href='/areas-de-atuacao'
                  className='group inline-flex items-center gap-2 bg-gold-500 px-6 py-3 text-[13px] font-medium uppercase tracking-[2px] text-navy-950 transition-all duration-300 hover:bg-gold-400 sm:px-8 sm:py-3.5'
                >
                  Áreas de atuação
                  <ArrowRight
                    size={14}
                    className='transition-transform group-hover:translate-x-1'
                  />
                </Link>
                <Link
                  href='/contato'
                  className='inline-flex items-center gap-2 border border-gold-500/40 px-6 py-3 text-[13px] font-medium uppercase tracking-[2px] text-gold-500 transition-all duration-300 hover:border-gold-500 hover:bg-gold-500/5 sm:px-8 sm:py-3.5'
                >
                  Agendar consulta
                </Link>
              </motion.div>
            </div>

            {/* Photo side */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className='relative mx-auto hidden w-full max-w-xs lg:block'
            >
              {/* Gold corner accents */}
              <div className='absolute -left-3 -top-3 h-16 w-16 border-l border-t border-gold-500/30' />
              <div className='absolute -bottom-3 -right-3 h-16 w-16 border-b border-r border-gold-500/30' />

              {/* Photo container */}
              <div
                className='relative overflow-hidden'
                style={{ maxHeight: '420px' }}
              >
                <Image
                  src='/images/thales-perfil.png'
                  alt='Dr. Thales Ferri Schoedl — Advogado'
                  width={320}
                  height={420}
                  className='h-auto w-full object-cover object-top grayscale-[20%] transition-all duration-700 hover:grayscale-0'
                  priority
                />
                {/* Subtle overlay on bottom — dark mode only */}
                <div className='absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-navy-950/80 to-transparent dark:block' />
              </div>

              {/* Name tag */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
                className='absolute -bottom-2 left-6 right-6 border border-gold-500/15 bg-navy-950/90 px-6 py-4 backdrop-blur-sm'
              >
                <p className='font-[family-name:var(--font-cormorant)] text-lg text-cream-100'>
                  Thales Ferri Schoedl
                </p>
                <p className='text-xs uppercase tracking-[2px] text-gold-600'>
                  OAB/SP 196.377
                </p>
              </motion.div>
            </motion.div>
          </div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className='mt-16 flex justify-center gap-8 pt-8 sm:mt-20 sm:gap-12 sm:pt-10 md:gap-20'
          >
            {[
              { n: '20+', label: 'Anos de experiência' },
              { n: '4', label: 'Livros publicados' },
              { n: '6', label: 'Áreas de atuação' },
            ].map(stat => (
              <div key={stat.label} className='text-center'>
                <p className='font-[family-name:var(--font-cormorant)] text-3xl font-light text-gold-500 sm:text-4xl'>
                  {stat.n}
                </p>
                <p className='mt-1 text-xs uppercase tracking-[1.5px] text-txt-muted'>
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ÁREAS DE ATUAÇÃO */}
      <section className='py-16 sm:py-24 lg:py-32'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <SectionHeading
            label='Especializações'
            title='Áreas de atuação'
            description='Atuação abrangente em áreas estratégicas do Direito, com ênfase na defesa técnica em causas de alta complexidade.'
          />

          <RevealStagger className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {areasDeAtuacao.map(area => (
              <RevealItem key={area.slug}>
                <Link
                  href={`/areas-de-atuacao#${area.slug}`}
                  className='group block border border-gold-500/8 bg-navy-800/30 p-6 transition-all duration-400 hover:border-gold-500/20 hover:bg-navy-800/60 sm:p-8'
                >
                  <area.icon
                    size={28}
                    strokeWidth={1.2}
                    className='mb-4 text-gold-500/70 transition-colors group-hover:text-gold-500 sm:mb-5'
                  />
                  <h3 className='font-[family-name:var(--font-cormorant)] text-xl text-cream-100'>
                    {area.title}
                  </h3>
                  <p className='mt-2 text-sm leading-relaxed text-txt-muted'>
                    {area.description.slice(0, 120)}...
                  </p>
                  <span className='mt-4 inline-flex items-center gap-1 text-xs uppercase tracking-[1.5px] text-gold-600 transition-colors group-hover:text-gold-500'>
                    Saiba mais
                    <ChevronRight
                      size={12}
                      className='transition-transform group-hover:translate-x-1'
                    />
                  </span>
                </Link>
              </RevealItem>
            ))}
          </RevealStagger>
        </div>
      </section>

      {/* ABOUT PREVIEW */}
      <section className='border-t border-gold-500/8 bg-navy-900/30 py-16 sm:py-24 lg:py-32'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='grid items-center gap-10 sm:gap-16 lg:grid-cols-2'>
            <Reveal>
              <div className='relative'>
                <div className='aspect-[4/5] w-full max-w-sm overflow-hidden border border-gold-500/12 sm:max-w-md'>
                  <Image
                    src='/images/professor.jpg'
                    alt='Dr. Thales Ferri Schoedl — Professor e Advogado'
                    width={400}
                    height={500}
                    className='h-full w-full object-cover object-top'
                  />
                </div>
                {/* Decorative corner */}
                <div className='absolute -bottom-4 -right-4 hidden h-24 w-24 border-b border-r border-gold-500/20 sm:block' />
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <p className='mb-3 text-xs font-medium uppercase tracking-[3px] text-gold-500'>
                Thales Ferri Schoedl
              </p>
              <h2 className='font-[family-name:var(--font-cormorant)] text-2xl font-normal text-cream-100 sm:text-3xl md:text-4xl'>
                Advogado, jurista e professor
              </h2>
              <div className='mt-4 h-px w-12 bg-gold-500/40' />
              <p className='mt-6 text-base leading-relaxed text-txt-muted'>
                Ex-promotor de justiça do Estado de São Paulo (2003-2016), com
                formação pela Universidade Presbiteriana Mackenzie e Mestrado
                pela UFBA. Autor de 4 livros e diversos artigos jurídicos.
                Professor na Academia Del Guercio SPCM.
              </p>
              <p className='mt-4 text-base leading-relaxed text-txt-muted'>
                Sua trajetória une a experiência da magistratura com a advocacia
                estratégica, resultando em uma atuação técnica diferenciada na
                defesa de servidores públicos e em causas de alta complexidade.
              </p>
              <Link
                href='/sobre'
                className='group mt-8 inline-flex items-center gap-2 text-[13px] uppercase tracking-[2px] text-gold-500 transition-colors hover:text-gold-400'
              >
                Conheça a trajetória completa
                <ArrowRight
                  size={14}
                  className='transition-transform group-hover:translate-x-1'
                />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* PUBLICAÇÕES PREVIEW */}
      <section className='border-t border-gold-500/8 py-16 sm:py-24 lg:py-32'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <SectionHeading
            label='Obras publicadas'
            title='Publicações'
            description='Produção acadêmica e editorial que reflete décadas de experiência na prática e no ensino do Direito.'
          />

          <RevealStagger className='grid gap-4 md:grid-cols-2'>
            {publicacoes.slice(0, 4).map(pub => (
              <RevealItem key={pub.title}>
                <div className='group flex gap-4 border border-gold-500/8 bg-navy-800/20 p-5 transition-all duration-300 hover:border-gold-500/15 sm:gap-6 sm:p-6'>
                  <div className='shrink-0'>
                    <span className='font-[family-name:var(--font-cormorant)] text-3xl font-light text-gold-500/30 sm:text-4xl'>
                      {String(pub.year).slice(-2)}
                    </span>
                  </div>
                  <div>
                    <h3 className='font-[family-name:var(--font-cormorant)] text-lg text-cream-100'>
                      {pub.title}
                    </h3>
                    {pub.subtitle && (
                      <p className='mt-1 text-sm italic text-txt-muted'>
                        {pub.subtitle}
                      </p>
                    )}
                    <p className='mt-2 text-[13px] text-txt-muted'>
                      {pub.publisher}, {pub.year}
                      {pub.pages ? ` — ${pub.pages}p.` : ''}
                    </p>
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealStagger>

          <Reveal className='mt-10 text-center'>
            <Link
              href='/publicacoes'
              className='group inline-flex items-center gap-2 text-[13px] uppercase tracking-[2px] text-gold-500 transition-colors hover:text-gold-400'
            >
              Ver todas as publicações
              <ArrowRight
                size={14}
                className='transition-transform group-hover:translate-x-1'
              />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* CURSOS BANNER */}
      <section className='border-t border-gold-500/8 bg-navy-900/40 py-16 sm:py-24 lg:py-32'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <Reveal className='mx-auto max-w-3xl text-center'>
            <p className='mb-3 text-xs font-medium uppercase tracking-[3px] text-gold-500'>
              Em breve
            </p>
            <h2 className='font-[family-name:var(--font-cormorant)] text-2xl font-normal text-cream-100 sm:text-3xl md:text-4xl'>
              Cursos e preparatórios
            </h2>
            <div className='mx-auto mt-4 h-px w-12 bg-gold-500/40' />
            <p className='mt-6 text-base leading-relaxed text-txt-muted'>
              Coaching jurídico, preparatório para concursos de magistratura,
              ministério público, procuradorias, defensorias e Exame de Ordem.
              Com a experiência de quem viveu a magistratura e a advocacia.
            </p>
          </Reveal>

          <RevealStagger className='mx-auto mt-10 grid max-w-2xl gap-3 sm:mt-12 sm:grid-cols-3'>
            {[
              { title: 'Direito Penal', desc: 'Parte geral e especial' },
              { title: 'Concursos', desc: 'Magistratura e MP' },
              { title: 'Exame OAB', desc: 'Preparatório completo' },
            ].map(curso => (
              <RevealItem key={curso.title}>
                <div className='border border-gold-500/10 bg-navy-800/30 p-5 text-center'>
                  <BookOpen
                    size={20}
                    strokeWidth={1.2}
                    className='mx-auto mb-3 text-gold-600'
                  />
                  <h3 className='font-[family-name:var(--font-cormorant)] text-base text-cream-100'>
                    {curso.title}
                  </h3>
                  <p className='mt-1 text-[13px] text-txt-muted'>
                    {curso.desc}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealStagger>

          <Reveal className='mt-10 text-center' delay={0.3}>
            <Link
              href='/cursos'
              className='inline-flex items-center gap-2 bg-gold-500 px-6 py-3 text-[13px] font-medium uppercase tracking-[2px] text-navy-950 transition-all duration-300 hover:bg-gold-400 sm:px-8 sm:py-3.5'
            >
              Quero ser avisado
            </Link>
          </Reveal>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className='border-t border-gold-500/8 py-16 sm:py-24 lg:py-32'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <Reveal className='mx-auto max-w-2xl text-center'>
            <h2 className='font-[family-name:var(--font-cormorant)] text-2xl font-normal text-cream-100 sm:text-3xl md:text-4xl'>
              Cada caso exige uma estratégia única
            </h2>
            <p className='mt-6 text-base leading-relaxed text-txt-muted'>
              Entre em contato para uma análise preliminar do seu caso. Atuamos
              em todo o Brasil com atendimento presencial e online.
            </p>
            <div className='mt-8 flex flex-wrap justify-center gap-4 sm:mt-10'>
              <Link
                href='/contato'
                className='group inline-flex items-center gap-2 bg-gold-500 px-6 py-3 text-[13px] font-medium uppercase tracking-[2px] text-navy-950 transition-all duration-300 hover:bg-gold-400 sm:px-8 sm:py-3.5'
              >
                Agendar consulta
                <ArrowRight
                  size={14}
                  className='transition-transform group-hover:translate-x-1'
                />
              </Link>
            </div>
            <div className='mt-6 flex items-center justify-center gap-2 text-sm text-txt-muted sm:mt-8'>
              <MapPin size={14} className='text-gold-600' />
              São Paulo — Atuação em todo o Brasil
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
