'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Reveal, RevealStagger, RevealItem } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';

interface FaqItem {
  question: string;
  answer: string;
}

function FaqItemComponent({
  question,
  answer,
  isOpen,
  onClick,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <div className='border border-gold-500/8 bg-navy-800/20 transition-colors hover:border-gold-500/15'>
      <button
        onClick={onClick}
        className='flex w-full items-center justify-between gap-4 p-5 text-left sm:p-6'
      >
        <h3 className='font-[family-name:var(--font-cormorant)] text-lg text-cream-100'>
          {question}
        </h3>
        <ChevronDown
          size={18}
          className={`shrink-0 text-gold-500 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className='overflow-hidden'
          >
            <div className='border-t border-gold-500/8 px-5 pb-5 pt-4 sm:px-6 sm:pb-6'>
              <p className='text-sm leading-relaxed text-txt-muted'>{answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface FaqClientProps {
  faqItems: FaqItem[];
}

export function FaqClient({ faqItems }: FaqClientProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className='pb-16 pt-28 sm:pb-24 sm:pt-32 lg:pb-32'>
      <div className='mx-auto max-w-3xl px-4 sm:px-6 lg:px-8'>
        <SectionHeading
          label='Dúvidas frequentes'
          title='Perguntas frequentes'
          description='Respostas para as principais dúvidas sobre nossos serviços e formas de atuação.'
        />

        <RevealStagger className='space-y-3'>
          {faqItems.map((item, i) => (
            <RevealItem key={i}>
              <FaqItemComponent
                question={item.question}
                answer={item.answer}
                isOpen={openIndex === i}
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              />
            </RevealItem>
          ))}
        </RevealStagger>

        <Reveal className='mt-12 text-center sm:mt-14'>
          <p className='mb-4 text-base text-txt-muted'>
            Não encontrou o que procurava?
          </p>
          <Link
            href='/contato'
            className='group inline-flex items-center gap-2 bg-gold-500 px-6 py-3 text-[13px] font-medium uppercase tracking-[2px] text-navy-950 transition-all duration-300 hover:bg-gold-400 sm:px-8 sm:py-3.5'
          >
            Entre em contato
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
