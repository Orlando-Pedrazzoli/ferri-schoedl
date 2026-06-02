'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, PlayCircle, CheckCircle2 } from 'lucide-react';

interface Lesson {
  title: string;
  duration: string;
  videoId: string;
}

interface Module {
  title: string;
  lessons: Lesson[];
}

interface Props {
  title: string;
  subtitle?: string;
  modules: Module[];
}

export function CoursePlayer({ title, subtitle, modules }: Props) {
  const flat = modules.flatMap(m => m.lessons);
  const [current, setCurrent] = useState<Lesson | null>(flat[0] || null);

  return (
    <section className='pb-16 pt-24 sm:pb-24 sm:pt-28'>
      <div className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8'>
        <Link
          href='/conta/cursos'
          className='group inline-flex items-center gap-2 text-[13px] uppercase tracking-[1.5px] text-gold-600 transition-colors hover:text-gold-500'
        >
          <ArrowLeft
            size={14}
            className='transition-transform group-hover:-translate-x-1'
          />
          Meus cursos
        </Link>

        <h1 className='mt-4 font-[family-name:var(--font-cormorant)] text-2xl text-cream-100 sm:text-3xl'>
          {title}
        </h1>
        {subtitle ? (
          <p className='mt-1 text-sm text-txt-muted'>{subtitle}</p>
        ) : null}

        <div className='mt-8 grid gap-8 lg:grid-cols-3'>
          {/* Player */}
          <div className='lg:col-span-2'>
            {current ? (
              <>
                <div className='aspect-video w-full overflow-hidden border border-gold-500/10 bg-black'>
                  <iframe
                    key={current.videoId}
                    src={`https://www.youtube.com/embed/${current.videoId}?rel=0&modestbranding=1`}
                    title={current.title}
                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                    allowFullScreen
                    className='h-full w-full'
                  />
                </div>
                <h2 className='mt-4 text-lg text-cream-100'>{current.title}</h2>
                {current.duration ? (
                  <p className='text-xs text-txt-muted'>{current.duration}</p>
                ) : null}
              </>
            ) : (
              <p className='text-sm text-txt-muted'>
                Nenhuma aula disponível neste curso ainda.
              </p>
            )}
          </div>

          {/* Lista de aulas */}
          <div className='lg:col-span-1'>
            <div className='border border-gold-500/10 bg-navy-900/30 p-4'>
              <h3 className='mb-3 text-xs uppercase tracking-[2px] text-gold-500'>
                Conteúdo do curso
              </h3>
              <div className='space-y-4'>
                {modules.map((mod, mi) => (
                  <div key={mi}>
                    {mod.title ? (
                      <p className='mb-2 text-[11px] uppercase tracking-[1px] text-txt-muted'>
                        {mod.title}
                      </p>
                    ) : null}
                    <div className='space-y-1'>
                      {mod.lessons.map((lesson, li) => {
                        const active = current?.videoId === lesson.videoId;
                        return (
                          <button
                            key={li}
                            onClick={() => setCurrent(lesson)}
                            className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors ${
                              active
                                ? 'bg-gold-500/10 text-cream-100'
                                : 'text-txt-muted hover:bg-navy-800/40 hover:text-cream-100'
                            }`}
                          >
                            {active ? (
                              <CheckCircle2
                                size={16}
                                className='shrink-0 text-gold-500'
                              />
                            ) : (
                              <PlayCircle size={16} className='shrink-0' />
                            )}
                            <span className='flex-1'>{lesson.title}</span>
                            {lesson.duration ? (
                              <span className='shrink-0 text-[11px] text-txt-muted'>
                                {lesson.duration}
                              </span>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
