'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Reveal, RevealStagger, RevealItem } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';
import { areasDeAtuacao } from '@/lib/data';

export default function AreasDeAtuacaoPage() {
  return (
    <section className='pb-16 pt-28 sm:pb-24 sm:pt-32 lg:pb-32'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <SectionHeading
          label='Especialidades'
          title='Áreas de atuação'
          description='Com sede em São Paulo e atuação em todo o Brasil, o escritório é reconhecido por seu atendimento técnico, responsável e humanizado.'
        />

        <div className='space-y-6'>
          {areasDeAtuacao.map((area, i) => (
            <Reveal key={area.slug} delay={i * 0.05}>
              <div
                id={area.slug}
                className='scroll-mt-24 border border-gold-500/8 bg-navy-800/20 p-6 transition-all duration-300 hover:border-gold-500/15 sm:p-8 lg:p-10'
              >
                <div className='flex flex-col gap-6 sm:gap-8 lg:flex-row lg:gap-12'>
                  <div className='lg:w-1/3'>
                    <div className='flex items-start gap-4'>
                      <area.icon
                        size={28}
                        strokeWidth={1}
                        className='shrink-0 text-gold-500/70 sm:h-8 sm:w-8'
                      />
                      <div>
                        <h3 className='font-[family-name:var(--font-cormorant)] text-xl text-cream-100 sm:text-2xl'>
                          {area.title}
                        </h3>
                        <p className='mt-1 text-sm italic text-gold-600'>
                          {area.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className='lg:w-2/3'>
                    <p className='text-base leading-relaxed text-txt-muted'>
                      {area.description}
                    </p>

                    <div className='mt-6 border-t border-gold-500/8 pt-6'>
                      <p className='mb-3 text-xs uppercase tracking-[1.5px] text-gold-600'>
                        Atuação inclui
                      </p>
                      <div className='grid gap-2 sm:grid-cols-2'>
                        {area.details.map((detail, j) => (
                          <div
                            key={j}
                            className='flex items-start gap-2 text-sm text-txt-muted'
                          >
                            <span className='mt-2 h-1 w-1 shrink-0 rounded-full bg-gold-600/50' />
                            {detail}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* CTA */}
        <Reveal className='mt-12 text-center sm:mt-16'>
          <p className='mb-6 text-base text-txt-muted'>
            Cada situação exige análise técnica individual.
          </p>
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
        </Reveal>
      </div>
    </section>
  );
}
