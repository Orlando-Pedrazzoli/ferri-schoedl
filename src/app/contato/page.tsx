"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Clock, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { siteConfig } from "@/lib/data";

export default function ContatoPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="pb-24 pt-32 lg:pb-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          label="Entre em contato"
          title="Fale conosco"
          description="Agende uma consulta ou envie sua demanda para uma analise preliminar. Atendimento presencial e online."
        />

        <div className="grid gap-16 lg:grid-cols-5">
          {/* Contact info */}
          <Reveal className="lg:col-span-2">
            <div className="space-y-8">
              <div className="flex gap-4">
                <MapPin
                  size={18}
                  strokeWidth={1.2}
                  className="mt-1 shrink-0 text-gold-500"
                />
                <div>
                  <p className="mb-1 text-[11px] uppercase tracking-[1.5px] text-gold-600">
                    Endereco
                  </p>
                  <p className="text-[14px] text-cream-100">
                    {siteConfig.address.street}
                  </p>
                  <p className="text-[14px] text-cream-100">
                    {siteConfig.address.complement} —{" "}
                    {siteConfig.address.neighborhood}
                  </p>
                  <p className="text-[14px] text-txt-muted">
                    {siteConfig.address.city} — {siteConfig.address.state}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Phone
                  size={18}
                  strokeWidth={1.2}
                  className="mt-1 shrink-0 text-gold-500"
                />
                <div>
                  <p className="mb-1 text-[11px] uppercase tracking-[1.5px] text-gold-600">
                    Telefone
                  </p>
                  <p className="text-[14px] text-cream-100">
                    {siteConfig.phone}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Mail
                  size={18}
                  strokeWidth={1.2}
                  className="mt-1 shrink-0 text-gold-500"
                />
                <div>
                  <p className="mb-1 text-[11px] uppercase tracking-[1.5px] text-gold-600">
                    E-mail
                  </p>
                  <p className="text-[14px] text-cream-100">
                    {siteConfig.email}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Clock
                  size={18}
                  strokeWidth={1.2}
                  className="mt-1 shrink-0 text-gold-500"
                />
                <div>
                  <p className="mb-1 text-[11px] uppercase tracking-[1.5px] text-gold-600">
                    Horario de atendimento
                  </p>
                  <p className="text-[14px] text-cream-100">
                    {siteConfig.hours}
                  </p>
                </div>
              </div>

              {/* OAB note */}
              <div className="mt-8 border border-gold-500/10 bg-navy-800/30 p-6">
                <p className="text-[11px] uppercase tracking-[1.5px] text-gold-600">
                  Registro profissional
                </p>
                <p className="mt-2 text-[14px] text-cream-100">
                  {siteConfig.oab}
                </p>
                <p className="mt-1 text-[12px] text-txt-muted">
                  Inscricao ativa — Ordem dos Advogados do Brasil, Seccional
                  Sao Paulo
                </p>
              </div>
            </div>
          </Reveal>

          {/* Form */}
          <Reveal delay={0.15} className="lg:col-span-3">
            {submitted ? (
              <div className="border border-gold-500/20 bg-gold-500/5 p-10 text-center">
                <h3 className="font-[family-name:var(--font-cormorant)] text-2xl text-cream-100">
                  Mensagem enviada
                </h3>
                <p className="mt-3 text-[14px] text-txt-muted">
                  Recebemos sua mensagem e retornaremos o contato em ate 24
                  horas uteis. Obrigado.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-[11px] uppercase tracking-[1.5px] text-gold-600">
                      Nome completo
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full border border-gold-500/12 bg-navy-800/30 px-4 py-3 text-[14px] text-cream-100 outline-none transition-colors placeholder:text-txt-muted/40 focus:border-gold-500/30"
                      placeholder="Seu nome"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-[11px] uppercase tracking-[1.5px] text-gold-600">
                      E-mail
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full border border-gold-500/12 bg-navy-800/30 px-4 py-3 text-[14px] text-cream-100 outline-none transition-colors placeholder:text-txt-muted/40 focus:border-gold-500/30"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-[11px] uppercase tracking-[1.5px] text-gold-600">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      className="w-full border border-gold-500/12 bg-navy-800/30 px-4 py-3 text-[14px] text-cream-100 outline-none transition-colors placeholder:text-txt-muted/40 focus:border-gold-500/30"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-[11px] uppercase tracking-[1.5px] text-gold-600">
                      Area de interesse
                    </label>
                    <select className="w-full border border-gold-500/12 bg-navy-800/30 px-4 py-3 text-[14px] text-cream-100 outline-none transition-colors focus:border-gold-500/30">
                      <option value="">Selecione</option>
                      <option value="criminal">Criminal</option>
                      <option value="tribunal-do-juri">Tribunal do Juri</option>
                      <option value="improbidade">
                        Improbidade Administrativa
                      </option>
                      <option value="imobiliario">Imobiliario</option>
                      <option value="civel">Civel</option>
                      <option value="disciplinar">Disciplinar</option>
                      <option value="outro">Outro</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-[11px] uppercase tracking-[1.5px] text-gold-600">
                    Descreva brevemente sua demanda
                  </label>
                  <textarea
                    rows={5}
                    required
                    className="w-full resize-none border border-gold-500/12 bg-navy-800/30 px-4 py-3 text-[14px] text-cream-100 outline-none transition-colors placeholder:text-txt-muted/40 focus:border-gold-500/30"
                    placeholder="Conte-nos um pouco sobre sua situacao..."
                  />
                </div>

                <p className="text-[11px] text-txt-muted">
                  As informacoes enviadas sao tratadas com sigilo profissional,
                  nos termos do Codigo de Etica da OAB e da LGPD.
                </p>

                <button
                  type="submit"
                  className="group inline-flex items-center gap-2 bg-gold-500 px-8 py-3.5 text-[12px] font-medium uppercase tracking-[2px] text-navy-950 transition-all duration-300 hover:bg-gold-400"
                >
                  Enviar mensagem
                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
