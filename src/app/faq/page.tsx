"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal, RevealStagger, RevealItem } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { faqItems } from "@/lib/data";

function FaqItem({
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
    <div className="border border-gold-500/8 bg-navy-800/20 transition-colors hover:border-gold-500/15">
      <button
        onClick={onClick}
        className="flex w-full items-center justify-between gap-4 p-6 text-left"
      >
        <h3 className="font-[family-name:var(--font-cormorant)] text-lg text-cream-100">
          {question}
        </h3>
        <ChevronDown
          size={18}
          className={`shrink-0 text-gold-500 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-gold-500/8 px-6 pb-6 pt-4">
              <p className="text-[14px] leading-relaxed text-txt-muted">
                {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="pb-24 pt-32 lg:pb-32">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <SectionHeading
          label="Duvidas frequentes"
          title="Perguntas frequentes"
          description="Respostas para as principais duvidas sobre nossos servicos e formas de atuacao."
        />

        <RevealStagger className="space-y-3">
          {faqItems.map((item, i) => (
            <RevealItem key={i}>
              <FaqItem
                question={item.question}
                answer={item.answer}
                isOpen={openIndex === i}
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              />
            </RevealItem>
          ))}
        </RevealStagger>

        <Reveal className="mt-14 text-center">
          <p className="mb-4 text-[15px] text-txt-muted">
            Nao encontrou o que procurava?
          </p>
          <Link
            href="/contato"
            className="group inline-flex items-center gap-2 bg-gold-500 px-8 py-3.5 text-[12px] font-medium uppercase tracking-[2px] text-navy-950 transition-all duration-300 hover:bg-gold-400"
          >
            Entre em contato
            <ArrowRight
              size={14}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
