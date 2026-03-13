"use client";

import { BookOpen } from "lucide-react";
import { Reveal, RevealStagger, RevealItem } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { publicacoes } from "@/lib/data";

export default function PublicacoesPage() {
  return (
    <section className="pb-24 pt-32 lg:pb-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          label="Obras e artigos"
          title="Publicacoes"
          description="Producao academica e editorial que reflete decadas de experiencia na pratica e no ensino do Direito."
        />

        <RevealStagger className="space-y-6">
          {publicacoes.map((pub, i) => (
            <RevealItem key={i}>
              <div className="group border border-gold-500/8 bg-navy-800/20 p-8 transition-all duration-300 hover:border-gold-500/15 lg:p-10">
                <div className="flex flex-col gap-6 lg:flex-row lg:gap-10">
                  {/* Year badge */}
                  <div className="shrink-0">
                    <div className="flex h-20 w-20 flex-col items-center justify-center border border-gold-500/15 bg-navy-800/40">
                      <span className="font-[family-name:var(--font-cormorant)] text-3xl font-light text-gold-500">
                        {pub.year}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <BookOpen
                        size={18}
                        strokeWidth={1.2}
                        className="mt-1 shrink-0 text-gold-600/50"
                      />
                      <div>
                        <h3 className="font-[family-name:var(--font-cormorant)] text-xl text-cream-100 lg:text-2xl">
                          {pub.title}
                        </h3>
                        {pub.subtitle && (
                          <p className="mt-1 text-[14px] italic text-gold-600">
                            {pub.subtitle}
                          </p>
                        )}
                      </div>
                    </div>

                    <p className="mt-4 text-[14px] leading-relaxed text-txt-muted">
                      {pub.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-4 text-[12px] text-txt-muted">
                      <span className="border-l border-gold-500/20 pl-3">
                        {pub.publisher}
                      </span>
                      {pub.pages && (
                        <span className="border-l border-gold-500/20 pl-3">
                          {pub.pages} paginas
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealStagger>

        {/* Additional publications note */}
        <Reveal className="mt-12">
          <div className="border-l border-gold-500/20 pl-6">
            <p className="text-[11px] uppercase tracking-[1.5px] text-gold-600">
              Artigos e colunas
            </p>
            <p className="mt-2 text-[14px] text-txt-muted">
              Alem dos livros, o Dr. Thales e autor de diversos artigos
              publicados no portal Migalhas e no Jus.com.br, abordando temas
              como controle de constitucionalidade, autoria mediata, direito
              registral e liberdade de imprensa.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
