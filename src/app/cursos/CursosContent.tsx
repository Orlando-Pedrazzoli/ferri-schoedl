'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  BookOpen,
  GraduationCap,
  Scale,
  FileText,
  Users,
  Award,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { Reveal, RevealStagger, RevealItem } from '@/components/Reveal';

const staticCursos = [
  {
    icon: Scale,
    title: 'Direito Penal',
    desc: 'Parte geral e especial com enfoque prático e jurisprudencial.',
  },
  {
    icon: FileText,
    title: 'Processual Penal',
    desc: 'Teoria e prática processual com análise de casos reais.',
  },
  {
    icon: BookOpen,
    title: 'Direito Constitucional',
    desc: 'Controle de constitucionalidade e garantias fundamentais.',
  },
  {
    icon: Users,
    title: 'Direito Administrativo',
    desc: 'Foco em servidores públicos, regime disciplinar e improbidade.',
  },
  {
    icon: GraduationCap,
    title: 'Preparatório Concursos',
    desc: 'Magistratura, Ministério Público, Procuradorias e Defensorias.',
  },
  {
    icon: Award,
    title: 'Exame OAB',
    desc: 'Preparatório completo com questões comentadas e simulados.',
  },
];

interface CourseData {
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  image: string;
  price: number;
  originalPrice?: number;
  duration: string;
  level: string;
  category: string;
}

interface CursosContentProps {
  dbCourses: CourseData[] | null;
  stats: {
    livrosPublicados: number;
    artigosPublicados: number;
    anosExperiencia: number;
  };
}

const levelLabels: Record<string, string> = {
  iniciante: 'Iniciante',
  intermediario: 'Intermediário',
  avancado: 'Avançado',
};

export function CursosContent({ dbCourses, stats }: CursosContentProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  const hasDbCourses = dbCourses && dbCourses.length > 0;

  return (
    <>
      {hasDbCourses ? (
        <RevealStagger className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {dbCourses.map(curso => (
            <RevealItem key={curso.slug}>
              <Link
                href={`/cursos/${curso.slug}`}
                className='group flex h-full flex-col border border-gold-500/8 bg-navy-800/20 transition-all duration-300 hover:border-gold-500/20'
              >
                {curso.image && (
                  <div className='relative h-44 overflow-hidden bg-navy-800/40'>
                    <Image
                      src={curso.image}
                      alt={curso.title}
                      fill
                      className='object-cover transition-transform duration-500 group-hover:scale-105'
                    />
                    <span className='absolute left-0 top-3 bg-gold-500 px-3 py-1 text-[10px] font-medium uppercase tracking-[1.5px] text-navy-950'>
                      {curso.category}
                    </span>
                  </div>
                )}

                <div className='flex flex-1 flex-col p-5 sm:p-6'>
                  <h3 className='font-[family-name:var(--font-cormorant)] text-lg text-cream-100 transition-colors group-hover:text-gold-400'>
                    {curso.title}
                  </h3>
                  {curso.subtitle && (
                    <p className='mt-1 text-[13px] italic text-gold-600'>
                      {curso.subtitle}
                    </p>
                  )}
                  <p className='mt-2 flex-1 text-[13px] leading-relaxed text-txt-muted line-clamp-3'>
                    {curso.description}
                  </p>

                  <div className='mt-4 flex items-center gap-3 text-[11px] text-txt-muted'>
                    <span className='flex items-center gap-1'>
                      <Clock size={12} className='text-gold-600' />
                      {curso.duration}
                    </span>
                    <span className='text-gold-500/20'>·</span>
                    <span>{levelLabels[curso.level] || curso.level}</span>
                  </div>

                  <div className='mt-4 flex items-end justify-between border-t border-gold-500/8 pt-4'>
                    <div>
                      {curso.originalPrice &&
                        curso.originalPrice > curso.price && (
                          <p className='text-[13px] text-txt-muted line-through'>
                            R${' '}
                            {curso.originalPrice.toFixed(2).replace('.', ',')}
                          </p>
                        )}
                      <p className='font-[family-name:var(--font-cormorant)] text-2xl text-gold-500'>
                        R$ {curso.price.toFixed(2).replace('.', ',')}
                      </p>
                    </div>
                    <span className='flex items-center gap-1 text-xs font-medium uppercase tracking-[1.5px] text-gold-500'>
                      Ver detalhes
                      <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </Link>
            </RevealItem>
          ))}
        </RevealStagger>
      ) : (
        <RevealStagger className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {staticCursos.map(curso => (
            <RevealItem key={curso.title}>
              <div className='border border-gold-500/8 bg-navy-800/20 p-6 transition-all duration-300 hover:border-gold-500/15 sm:p-7'>
                <curso.icon
                  size={24}
                  strokeWidth={1.2}
                  className='mb-4 text-gold-500/70'
                />
                <h3 className='font-[family-name:var(--font-cormorant)] text-lg text-cream-100'>
                  {curso.title}
                </h3>
                <p className='mt-2 text-sm leading-relaxed text-txt-muted'>
                  {curso.desc}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealStagger>
      )}

      {/* Qualifications */}
      <Reveal className='mt-12 sm:mt-16'>
        <div className='border border-gold-500/10 bg-navy-900/40 p-6 sm:p-8 lg:p-10'>
          <div className='grid gap-8 lg:grid-cols-3'>
            <div>
              <p className='text-xs uppercase tracking-[2px] text-gold-500'>
                Experiência docente
              </p>
              <p className='mt-3 text-sm text-txt-muted'>
                Professor na Academia Del Guercio SPCM, ex-professor no VFK
                Educação e UNIESP. Coordenador de bancas de exame oral simulado
                para concursos de cartórios.
              </p>
            </div>
            <div>
              <p className='text-xs uppercase tracking-[2px] text-gold-500'>
                Material didático
              </p>
              <p className='mt-3 text-sm text-txt-muted'>
                Autor de {stats.livrosPublicados} livros, incluindo &quot;2243
                Questões para Concursos Públicos&quot; (938p.) e coautor de
                &quot;Questões Comentadas do Exame Oral&quot; — obras de
                referência na preparação para concursos.
              </p>
            </div>
            <div>
              <p className='text-xs uppercase tracking-[2px] text-gold-500'>
                Metodologia
              </p>
              <p className='mt-3 text-sm text-txt-muted'>
                Abordagem prática que conecta teoria, jurisprudência e questões
                de prova, resultado de mais de {stats.anosExperiencia} anos de
                experiência na área jurídica.
              </p>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Lead capture — only when no real courses */}
      {!hasDbCourses && (
        <Reveal className='mt-12 sm:mt-16'>
          <div className='mx-auto max-w-xl text-center'>
            <p className='mb-2 text-xs uppercase tracking-[3px] text-gold-500'>
              Em breve
            </p>
            <h3 className='font-[family-name:var(--font-cormorant)] text-2xl text-cream-100'>
              Seja avisado do lançamento
            </h3>
            <p className='mt-3 text-sm text-txt-muted'>
              Cadastre seu e-mail para receber informações sobre os cursos,
              datas e condições especiais de lançamento.
            </p>

            {submitted ? (
              <div className='mt-8 border border-gold-500/20 bg-gold-500/5 p-6'>
                <p className='text-sm text-gold-400'>
                  E-mail cadastrado com sucesso. Você será avisado sobre o
                  lançamento dos cursos.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className='mt-8 flex flex-col gap-3 sm:flex-row'
              >
                <input
                  type='email'
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder='Seu melhor e-mail'
                  className='flex-1 border border-gold-500/15 bg-navy-800/40 px-5 py-3 text-sm text-cream-100 outline-none transition-colors placeholder:text-txt-muted/50 focus:border-gold-500/40'
                />
                <button
                  type='submit'
                  className='bg-gold-500 px-6 py-3 text-[13px] font-medium uppercase tracking-[2px] text-navy-950 transition-colors hover:bg-gold-400 sm:px-8'
                >
                  Cadastrar
                </button>
              </form>
            )}
          </div>
        </Reveal>
      )}
    </>
  );
}
