'use client';

import { useState } from 'react';
import {
  BookOpen,
  GraduationCap,
  Scale,
  FileText,
  Users,
  Award,
} from 'lucide-react';
import { Reveal, RevealStagger, RevealItem } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';
import { siteConfig } from '@/lib/data';

const cursos = [
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

export default function CursosPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <section className='pb-16 pt-28 sm:pb-24 sm:pt-32 lg:pb-32'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <SectionHeading
          label='Formação jurídica'
          title='Cursos e preparatórios'
          description='Coaching jurídico e preparatórios com a experiência de quem atuou na Promotoria de Justiça, no ensino e na advocacia criminal de alta complexidade.'
        />

        {/* Course grid */}
        <RevealStagger className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {cursos.map(curso => (
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
                  Educação e UNIESP. Coordenador de bancas de exame oral
                  simulado para concursos de cartórios.
                </p>
              </div>
              <div>
                <p className='text-xs uppercase tracking-[2px] text-gold-500'>
                  Material didático
                </p>
                <p className='mt-3 text-sm text-txt-muted'>
                  Autor de {siteConfig.stats.livrosPublicados} livros, incluindo
                  &quot;2243 Questões para Concursos Públicos&quot; (938p.) e
                  coautor de &quot;Questões Comentadas do Exame Oral&quot; —
                  obras de referência na preparação para concursos.
                </p>
              </div>
              <div>
                <p className='text-xs uppercase tracking-[2px] text-gold-500'>
                  Metodologia
                </p>
                <p className='mt-3 text-sm text-txt-muted'>
                  Abordagem prática que conecta teoria, jurisprudência e
                  questões de prova, resultado de mais de{' '}
                  {siteConfig.stats.anosExperiencia} anos de experiência na área
                  jurídica.
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Lead capture */}
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
      </div>
    </section>
  );
}
