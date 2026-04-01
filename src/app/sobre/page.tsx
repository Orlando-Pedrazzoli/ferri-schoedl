'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Reveal, RevealStagger, RevealItem } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';
import { timeline, aboutData, siteConfig } from '@/lib/data';

export default function SobrePage() {
  return (
    <section className='pb-24 pt-32 lg:pb-32'>
      <div className='mx-auto max-w-7xl px-6 lg:px-8'>
        <SectionHeading
          label='Quem somos'
          title='Thales Ferri Schoedl'
          description={aboutData.shortBio}
        />

        <div className='grid items-start gap-16 lg:grid-cols-5'>
          {/* Photo */}
          <Reveal className='lg:col-span-2'>
            <div className='relative'>
              <div className='aspect-[3/4] w-full overflow-hidden border border-gold-500/12'>
                <Image
                  src='/images/professor.jpg'
                  alt='Dr. Thales Ferri Schoedl — Professor e Advogado'
                  width={400}
                  height={533}
                  className='h-full w-full object-cover object-top'
                  priority
                />
              </div>
              {/* Decorative corner */}
              <div className='absolute -bottom-4 -right-4 hidden h-24 w-24 border-b border-r border-gold-500/20 sm:block' />

              {/* Credentials tag */}
              <div className='mt-6 border border-gold-500/10 bg-navy-800/30 p-5'>
                <p className='text-xs font-medium uppercase tracking-[2px] text-gold-500'>
                  {siteConfig.oab}
                </p>
                <p className='mt-2 text-[13px] leading-relaxed text-txt-muted'>
                  {aboutData.title}
                </p>
              </div>
            </div>
          </Reveal>

          {/* Content */}
          <div className='lg:col-span-3'>
            {/* Bio */}
            <Reveal>
              <div className='space-y-4 text-[15px] leading-relaxed text-txt-muted'>
                <p>{aboutData.bio}</p>
                <p>
                  Graduado em Direito pela Universidade Presbiteriana Mackenzie
                  (2001), Especialista em Direito Penal e Processual Penal pela
                  Mackenzie (2007) e Mestre em Desenvolvimento e Gestão Social
                  pela Escola de Administração da Universidade Federal da Bahia
                  — UFBA (2017). Participou de seminários doutorais na Faculdade
                  de Direito da Universidad de Buenos Aires (UBA), Argentina.
                </p>
                <p>
                  Atualmente é Professor de Direito Penal, Processual Penal,
                  Constitucional e Administrativo da Academia Del Guercio SPCM,
                  e coordenador das bancas de exame oral simulado na mesma
                  instituição. Palestrante e Coach nas áreas de Direito
                  Constitucional, Administrativo, Penal e Processual Penal, com
                  enfoque nos concursos públicos e Exame de Ordem.
                </p>
                <p>
                  Foi professor voluntário da Associação Cruz Verde, destinada a
                  pessoas com paralisia cerebral grave, entre 2007 e 2014 — uma
                  atuação que reflete seu compromisso com a responsabilidade
                  social e a dignidade humana.
                </p>
                <p>
                  Autor de mais de {siteConfig.stats.livrosPublicados} livros e
                  mais de {siteConfig.stats.artigosPublicados} artigos jurídicos
                  publicados em veículos como Carta Forense, Migalhas,
                  Jus.com.br e Despertar Jurídico, com temas que vão do controle
                  de constitucionalidade dos tipos penais à liberdade de
                  imprensa e direitos da personalidade.
                </p>
              </div>
            </Reveal>

            {/* Diferenciais */}
            <Reveal delay={0.15}>
              <h3 className='mt-14 font-[family-name:var(--font-cormorant)] text-xl text-cream-100'>
                Diferenciais
              </h3>
              <div className='mt-2 h-px w-12 bg-gold-500/40' />
              <div className='mt-6 grid gap-3 sm:grid-cols-2'>
                {aboutData.differentials.map((diff, i) => (
                  <div
                    key={i}
                    className='border border-gold-500/8 bg-navy-800/20 p-4'
                  >
                    <p className='text-[13px] leading-relaxed text-txt-muted'>
                      {diff}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Timeline */}
            <Reveal delay={0.2}>
              <h3 className='mt-14 font-[family-name:var(--font-cormorant)] text-xl text-cream-100'>
                Trajetória
              </h3>
              <div className='mt-2 h-px w-12 bg-gold-500/40' />
            </Reveal>

            <div className='mt-8'>
              <RevealStagger className='relative border-l border-gold-500/15 pl-8'>
                {timeline.map((item, i) => (
                  <RevealItem key={i} className='relative pb-8 last:pb-0'>
                    <div className='absolute -left-[33px] top-1 h-2 w-2 rounded-full bg-gold-600' />
                    <p className='text-[11px] uppercase tracking-[1.5px] text-gold-500'>
                      {item.period}
                    </p>
                    <p className='mt-1 text-[14px] font-medium text-cream-100'>
                      {item.title}
                    </p>
                    <p className='mt-1 text-[13px] text-txt-muted'>
                      {item.description}
                    </p>
                  </RevealItem>
                ))}
              </RevealStagger>
            </div>

            {/* CTA */}
            <Reveal delay={0.3}>
              <div className='mt-14 flex flex-wrap gap-4'>
                <Link
                  href='/publicacoes'
                  className='group inline-flex items-center gap-2 text-[13px] uppercase tracking-[2px] text-gold-500 transition-colors hover:text-gold-400'
                >
                  Ver publicações
                  <ArrowRight
                    size={14}
                    className='transition-transform group-hover:translate-x-1'
                  />
                </Link>
                <Link
                  href='/contato'
                  className='group inline-flex items-center gap-2 text-[13px] uppercase tracking-[2px] text-gold-500 transition-colors hover:text-gold-400'
                >
                  Entrar em contato
                  <ArrowRight
                    size={14}
                    className='transition-transform group-hover:translate-x-1'
                  />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
