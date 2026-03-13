'use client';

import Image from 'next/image';
import { Reveal, RevealStagger, RevealItem } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';
import { timeline } from '@/lib/data';

export default function SobrePage() {
  return (
    <section className='pb-24 pt-32 lg:pb-32'>
      <div className='mx-auto max-w-7xl px-6 lg:px-8'>
        <SectionHeading
          label='Quem somos'
          title='Thales Ferri Schoedl'
          description='Advogado, jurista, professor, palestrante e ex-promotor de justiça do Estado de São Paulo.'
        />

        <div className='grid items-start gap-16 lg:grid-cols-5'>
          {/* Photo placeholder */}
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
              <div className='absolute -bottom-3 -right-3 h-20 w-20 border-b border-r border-gold-500/15' />
            </div>
            <div className='mt-6 border-l border-gold-500/20 pl-5'>
              <p className='text-[11px] uppercase tracking-[2px] text-gold-600'>
                Formação
              </p>
              <p className='mt-2 text-[13px] text-cream-100'>
                Universidade Presbiteriana Mackenzie
              </p>
              <p className='text-[12px] text-txt-muted'>
                Graduação em Direito (2001)
              </p>
              <p className='mt-3 text-[13px] text-cream-100'>
                Especialização em Direito Penal e Processual Penal
              </p>
              <p className='text-[12px] text-txt-muted'>Mackenzie (2007)</p>
              <p className='mt-3 text-[13px] text-cream-100'>
                Mestrado em Desenvolvimento e Gestão Social
              </p>
              <p className='text-[12px] text-txt-muted'>UFBA (2017)</p>
            </div>
          </Reveal>

          {/* Bio */}
          <div className='lg:col-span-3'>
            <Reveal>
              <h3 className='font-[family-name:var(--font-cormorant)] text-2xl text-cream-100'>
                Advogado, jurista e professor
              </h3>
              <div className='mt-3 h-px w-12 bg-gold-500/40' />
            </Reveal>

            <Reveal delay={0.1}>
              <div className='mt-8 space-y-5 text-[15px] leading-relaxed text-txt-muted'>
                <p>
                  Thales Ferri Schoedl é advogado, jurista, professor,
                  palestrante e ex-promotor de justiça do Estado de São Paulo,
                  autor de diversas obras e artigos jurídicos, com trajetória
                  dedicada à defesa de servidores públicos e causas de alta
                  complexidade.
                </p>
                <p>
                  Graduado em Direito pela Universidade Presbiteriana Mackenzie
                  (2001), Especialista em Direito Penal e Processual Penal pela
                  Mackenzie (2007) e Mestre em Desenvolvimento e Gestão Social
                  pela Escola de Administração da Universidade Federal da Bahia
                  — UFBA (2017).
                </p>
                <p>
                  Atualmente é Professor de Direito Penal, Processual Penal,
                  Constitucional e Administrativo da Academia Del Guercio SPCM,
                  e coordenador das bancas de exame oral simulado na mesma
                  instituição. Palestrante e Coach nas áreas de Direito
                  Constitucional, Administrativo, Penal e Processual Penal, com
                  enfoque nos concursos públicos e exame de Ordem.
                </p>
                <p>
                  Foi professor voluntário da Associação Cruz Verde, destinada a
                  pessoas com paralisia cerebral grave, entre 2007 e 2014 — uma
                  atuação que reflete seu compromisso com a responsabilidade
                  social e a dignidade humana.
                </p>
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
          </div>
        </div>
      </div>
    </section>
  );
}
