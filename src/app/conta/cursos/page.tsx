'use client';

import Link from 'next/link';
import { GraduationCap } from 'lucide-react';

export default function CursosClientePage() {
  return (
    <div className='space-y-6'>
      <div>
        <h1 className='font-[family-name:var(--font-cormorant)] text-2xl text-cream-100'>
          Meus Cursos
        </h1>
        <p className='mt-1 text-sm text-txt-muted'>
          Cursos adquiridos e conteudos disponiveis.
        </p>
      </div>

      <div className='border border-gold-500/10 bg-navy-900/30 py-16 text-center'>
        <GraduationCap
          size={40}
          strokeWidth={1}
          className='mx-auto text-gold-600/30'
        />
        <h3 className='mt-4 font-[family-name:var(--font-cormorant)] text-xl text-cream-100'>
          Em breve
        </h3>
        <p className='mt-2 text-sm text-txt-muted'>
          Os cursos do Dr. Thales Ferri Schoedl estarao disponiveis em breve.
          Quando adquirir um curso, ele aparecera aqui com acesso ao conteudo
          completo.
        </p>
        <Link
          href='/cursos'
          className='mt-6 inline-flex items-center gap-2 border border-gold-500/30 px-6 py-2.5 text-xs font-medium uppercase tracking-[2px] text-gold-500 transition-colors hover:bg-gold-500/5'
        >
          <GraduationCap size={14} />
          Ver cursos disponiveis
        </Link>
      </div>
    </div>
  );
}
