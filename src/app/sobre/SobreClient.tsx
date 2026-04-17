'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Reveal, RevealStagger, RevealItem } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';
import type { TimelineItem } from '@/lib/data';

interface SobreClientProps {
  bio: string;
  shortBio: string;
  title: string;
  coaching: string;
  differentials: string[];
  timeline: TimelineItem[];
  siteConfig: {
    oab: string;
    stats: {
      livrosPublicados: number;
      artigosPublicados: number;
    };
  };
}

export function SobreClient({
  bio,
  shortBio,
  title,
  differentials,
  timeline,
  siteConfig,
}: SobreClientProps) {
  // Split bio into paragraphs by double newline
  const bioParagraphs = bio
    .split(/\n\n+/)
    .map(p => p.trim())
    .filter(Boolean);

  return (
    <section className='pb-24 pt-32 lg:pb-32'>
      <div className='mx-auto max-w-7xl px-6 lg:px-8'>
        <SectionHeading
          label='Quem somos'
          title='Thales Ferri Schoedl'
          description={shortBio}
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
              <div className='absolute -bottom-4 -right-4 hidden h-24 w-24 border-b border-r border-gold-500/20 sm:block' />
              <div className='mt-6 border border-gold-500/10 bg-navy-800/30 p-5'>
                <p className='text-xs font-medium uppercase tracking-[2px] text-gold-500'>
                  {siteConfig.oab}
                </p>
                <p className='mt-2 text-[13px] leading-relaxed text-txt-muted'>
                  {title}
                </p>
              </div>
            </div>
          </Reveal>

          {/* Content */}
          <div className='lg:col-span-3'>
            <Reveal>
              <div className='space-y-4 text-[15px] leading-relaxed text-txt-muted'>
                {bioParagraphs.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <h3 className='mt-14 font-[family-name:var(--font-cormorant)] text-xl text-cream-100'>
                Diferenciais
              </h3>
              <div className='mt-2 h-px w-12 bg-gold-500/40' />
              <div className='mt-6 grid gap-3 sm:grid-cols-2'>
                {differentials.map((diff, i) => (
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
