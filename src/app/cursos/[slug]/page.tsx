import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import dbConnect from '@/lib/mongodb';
import Course from '@/models/Course';
import { Reveal, RevealStagger, RevealItem } from '@/components/Reveal';
import {
  ArrowLeft,
  Clock,
  BarChart3,
  BookOpen,
  CheckCircle2,
  MessageCircle,
} from 'lucide-react';
import { siteConfig } from '@/lib/data';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getCourse(slug: string) {
  try {
    await dbConnect();
    const course = await Course.findOne({
      slug,
      isActive: true,
      status: 'publicado',
    }).lean();
    return course;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourse(slug);
  if (!course) return { title: 'Curso nao encontrado' };
  return {
    title: course.title,
    description: course.description,
    openGraph: {
      title: `${course.title} | Ferri Schoedl Advocacia`,
      description: course.description,
      images: course.image ? [{ url: course.image }] : [],
    },
  };
}

export default async function CursoSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const course = await getCourse(slug);

  if (!course) {
    notFound();
  }

  const whatsappLink = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
    `Olá, gostaria de saber mais sobre o curso "${course.title}".`,
  )}`;

  const levelLabels: Record<string, string> = {
    iniciante: 'Iniciante',
    intermediario: 'Intermediário',
    avancado: 'Avançado',
  };

  return (
    <section className='pb-16 pt-28 sm:pb-24 sm:pt-32 lg:pb-32'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <Reveal>
          <Link
            href='/cursos'
            className='mb-8 inline-flex items-center gap-2 text-sm text-txt-muted transition-colors hover:text-gold-500'
          >
            <ArrowLeft size={14} />
            Voltar aos cursos
          </Link>
        </Reveal>

        <div className='grid gap-10 lg:grid-cols-3 lg:gap-12'>
          <div className='lg:col-span-2'>
            <Reveal>
              <div className='mb-8'>
                <p className='mb-3 text-xs uppercase tracking-[3px] text-gold-500'>
                  {course.category}
                </p>
                <h1 className='font-[family-name:var(--font-cormorant)] text-3xl leading-tight text-cream-100 sm:text-4xl'>
                  {course.title}
                </h1>
                {course.subtitle && (
                  <p className='mt-2 font-[family-name:var(--font-cormorant)] text-lg text-txt-muted'>
                    {course.subtitle}
                  </p>
                )}
                <p className='mt-1 text-sm text-txt-muted'>
                  Por {course.instructor}
                </p>
              </div>
            </Reveal>

            {course.image && (
              <Reveal className='mb-8'>
                <div className='relative aspect-video w-full overflow-hidden border border-gold-500/10'>
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className='object-cover'
                    priority
                  />
                </div>
              </Reveal>
            )}

            <Reveal className='mb-10'>
              <div className='border-l-2 border-gold-500/20 pl-5'>
                <p className='text-sm leading-relaxed text-txt-muted'>
                  {course.description}
                </p>
              </div>
            </Reveal>

            <Reveal className='mb-10'>
              <h2 className='mb-4 text-xs font-medium uppercase tracking-[2px] text-gold-500'>
                Sobre o curso
              </h2>
              <div className='text-sm leading-relaxed text-txt-muted whitespace-pre-line'>
                {course.longDescription}
              </div>
            </Reveal>

            {course.topics && course.topics.length > 0 && (
              <Reveal className='mb-10'>
                <h2 className='mb-4 text-xs font-medium uppercase tracking-[2px] text-gold-500'>
                  Temas abordados
                </h2>
                <div className='flex flex-wrap gap-2'>
                  {course.topics.map((topic: string, i: number) => (
                    <span
                      key={i}
                      className='border border-gold-500/10 bg-navy-800/30 px-3 py-1.5 text-xs text-txt-muted'
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </Reveal>
            )}

            {course.modules && course.modules.length > 0 && (
              <Reveal className='mb-10'>
                <h2 className='mb-6 text-xs font-medium uppercase tracking-[2px] text-gold-500'>
                  Programa do curso
                </h2>
                <RevealStagger className='space-y-4'>
                  {course.modules.map(
                    (
                      mod: {
                        title: string;
                        description: string;
                        lessons: string[];
                        duration: string;
                      },
                      i: number,
                    ) => (
                      <RevealItem key={i}>
                        <div className='border border-gold-500/8 bg-navy-800/20 p-5 transition-all duration-300 hover:border-gold-500/15'>
                          <div className='flex items-start justify-between gap-4'>
                            <div>
                              <p className='text-xs text-gold-600'>
                                Módulo {i + 1}
                              </p>
                              <h3 className='mt-1 font-[family-name:var(--font-cormorant)] text-lg text-cream-100'>
                                {mod.title}
                              </h3>
                              {mod.description && (
                                <p className='mt-1 text-sm text-txt-muted'>
                                  {mod.description}
                                </p>
                              )}
                            </div>
                            {mod.duration && (
                              <span className='shrink-0 text-xs text-txt-muted'>
                                {mod.duration}
                              </span>
                            )}
                          </div>

                          {mod.lessons && mod.lessons.length > 0 && (
                            <ul className='mt-3 space-y-1.5 border-t border-gold-500/5 pt-3'>
                              {mod.lessons
                                .filter((l: string) => l.trim())
                                .map((lesson: string, j: number) => (
                                  <li
                                    key={j}
                                    className='flex items-center gap-2 text-sm text-txt-muted'
                                  >
                                    <CheckCircle2
                                      size={12}
                                      className='shrink-0 text-gold-500/40'
                                    />
                                    {lesson}
                                  </li>
                                ))}
                            </ul>
                          )}
                        </div>
                      </RevealItem>
                    ),
                  )}
                </RevealStagger>
              </Reveal>
            )}
          </div>

          <div>
            <Reveal>
              <div className='sticky top-28 space-y-6'>
                <div className='border border-gold-500/10 bg-navy-900/40 p-6'>
                  <div className='mb-5'>
                    {course.originalPrice &&
                      course.originalPrice > 0 &&
                      course.originalPrice > course.price && (
                        <p className='text-sm text-txt-muted line-through'>
                          R$ {course.originalPrice.toFixed(2)}
                        </p>
                      )}
                    <p className='font-[family-name:var(--font-cormorant)] text-3xl text-cream-100'>
                      R$ {course.price.toFixed(2)}
                    </p>
                  </div>

                  <div className='mb-6 space-y-3'>
                    <div className='flex items-center gap-3 text-sm text-txt-muted'>
                      <Clock size={14} className='shrink-0 text-gold-600' />
                      <span>Duração: {course.duration}</span>
                    </div>
                    <div className='flex items-center gap-3 text-sm text-txt-muted'>
                      <BarChart3 size={14} className='shrink-0 text-gold-600' />
                      <span>
                        Nível: {levelLabels[course.level] || course.level}
                      </span>
                    </div>
                    <div className='flex items-center gap-3 text-sm text-txt-muted'>
                      <BookOpen size={14} className='shrink-0 text-gold-600' />
                      <span>
                        {course.modules?.length || 0} módulo
                        {(course.modules?.length || 0) !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  <a
                    href={whatsappLink}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex w-full items-center justify-center gap-2 bg-gold-500 px-6 py-3 text-[13px] font-medium uppercase tracking-[2px] text-navy-950 transition-colors hover:bg-gold-400'
                  >
                    <MessageCircle size={14} />
                    Inscrever-se
                  </a>

                  <p className='mt-3 text-center text-xs text-txt-muted'>
                    Inscrição via WhatsApp
                  </p>
                </div>

                <div className='border border-gold-500/8 bg-navy-800/20 p-5'>
                  <p className='mb-2 text-xs uppercase tracking-[2px] text-gold-500'>
                    Instrutor
                  </p>
                  <p className='font-[family-name:var(--font-cormorant)] text-lg text-cream-100'>
                    {course.instructor}
                  </p>
                  <p className='mt-2 text-xs leading-relaxed text-txt-muted'>
                    Ex-Promotor de Justiça do Estado de São Paulo, autor de{' '}
                    {siteConfig.stats.livrosPublicados} livros e mais de{' '}
                    {siteConfig.stats.artigosPublicados} artigos jurídicos
                    publicados.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
