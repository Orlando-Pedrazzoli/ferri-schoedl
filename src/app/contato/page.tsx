'use client';

import { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowRight,
  MessageCircle,
  Building2,
} from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';
import { siteConfig } from '@/lib/data';

export default function ContatoPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const whatsappLink = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent('Olá, Dr. Thales! Gostaria de agendar uma consulta.')}`;

  return (
    <section className='pb-16 pt-28 sm:pb-24 sm:pt-32 lg:pb-32'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <SectionHeading
          label='Entre em contato'
          title='Fale conosco'
          description='Agende uma consulta ou envie sua demanda para uma análise preliminar. Atendimento presencial e online.'
        />

        <div className='grid gap-12 sm:gap-16 lg:grid-cols-5'>
          {/* Contact info */}
          <Reveal className='lg:col-span-2'>
            <div className='space-y-8'>
              <div className='flex gap-4'>
                <MapPin
                  size={18}
                  strokeWidth={1.2}
                  className='mt-1 shrink-0 text-gold-500'
                />
                <div>
                  <p className='mb-1 text-xs uppercase tracking-[1.5px] text-gold-600'>
                    Endereço
                  </p>
                  <p className='text-sm text-cream-100'>
                    {siteConfig.address.street}
                  </p>
                  <p className='text-sm text-cream-100'>
                    {siteConfig.address.complement} —{' '}
                    {siteConfig.address.neighborhood}
                  </p>
                  <p className='text-sm text-txt-muted'>
                    {siteConfig.address.city} — {siteConfig.address.state}
                  </p>
                  {siteConfig.address.building && (
                    <p className='mt-1 flex items-center gap-1.5 text-xs text-txt-muted'>
                      <Building2 size={12} className='text-gold-600/50' />
                      {siteConfig.address.building}
                    </p>
                  )}
                </div>
              </div>

              <div className='flex gap-4'>
                <MessageCircle
                  size={18}
                  strokeWidth={1.2}
                  className='mt-1 shrink-0 text-gold-500'
                />
                <div>
                  <p className='mb-1 text-xs uppercase tracking-[1.5px] text-gold-600'>
                    WhatsApp / Celular
                  </p>
                  <a
                    href={whatsappLink}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-sm text-cream-100 transition-colors hover:text-gold-400'
                  >
                    {siteConfig.phone}
                  </a>
                </div>
              </div>

              <div className='flex gap-4'>
                <Phone
                  size={18}
                  strokeWidth={1.2}
                  className='mt-1 shrink-0 text-gold-500'
                />
                <div>
                  <p className='mb-1 text-xs uppercase tracking-[1.5px] text-gold-600'>
                    Telefone fixo
                  </p>
                  <p className='text-sm text-cream-100'>
                    {siteConfig.phoneLandline}
                  </p>
                </div>
              </div>

              <div className='flex gap-4'>
                <Mail
                  size={18}
                  strokeWidth={1.2}
                  className='mt-1 shrink-0 text-gold-500'
                />
                <div>
                  <p className='mb-1 text-xs uppercase tracking-[1.5px] text-gold-600'>
                    E-mail
                  </p>
                  <p className='text-sm text-cream-100'>{siteConfig.email}</p>
                </div>
              </div>

              <div className='flex gap-4'>
                <Clock
                  size={18}
                  strokeWidth={1.2}
                  className='mt-1 shrink-0 text-gold-500'
                />
                <div>
                  <p className='mb-1 text-xs uppercase tracking-[1.5px] text-gold-600'>
                    Horário de atendimento
                  </p>
                  <p className='text-sm text-cream-100'>{siteConfig.hours}</p>
                </div>
              </div>

              {/* WhatsApp CTA */}
              <a
                href={whatsappLink}
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center justify-center gap-2 bg-gold-500 px-6 py-3 text-[13px] font-medium uppercase tracking-[2px] text-navy-950 transition-all duration-300 hover:bg-gold-400 sm:py-3.5'
              >
                <MessageCircle size={16} />
                Falar pelo WhatsApp
              </a>

              {/* OAB note */}
              <div className='border border-gold-500/10 bg-navy-800/30 p-5 sm:p-6'>
                <p className='text-xs uppercase tracking-[1.5px] text-gold-600'>
                  Registro profissional
                </p>
                <p className='mt-2 text-sm text-cream-100'>{siteConfig.oab}</p>
                <p className='mt-1 text-[13px] text-txt-muted'>
                  Inscrição ativa — Ordem dos Advogados do Brasil, Seccional São
                  Paulo
                </p>
              </div>
            </div>
          </Reveal>

          {/* Form */}
          <Reveal delay={0.15} className='lg:col-span-3'>
            {submitted ? (
              <div className='border border-gold-500/20 bg-gold-500/5 p-8 text-center sm:p-10'>
                <h3 className='font-[family-name:var(--font-cormorant)] text-2xl text-cream-100'>
                  Mensagem enviada
                </h3>
                <p className='mt-3 text-sm text-txt-muted'>
                  Recebemos sua mensagem e retornaremos o contato em até 24
                  horas úteis. Obrigado.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className='space-y-5'>
                <div className='grid gap-5 sm:grid-cols-2'>
                  <div>
                    <label className='mb-2 block text-xs uppercase tracking-[1.5px] text-gold-600'>
                      Nome completo
                    </label>
                    <input
                      type='text'
                      required
                      className='w-full border border-gold-500/12 bg-navy-800/30 px-4 py-3 text-sm text-cream-100 outline-none transition-colors placeholder:text-txt-muted/40 focus:border-gold-500/30'
                      placeholder='Seu nome'
                    />
                  </div>
                  <div>
                    <label className='mb-2 block text-xs uppercase tracking-[1.5px] text-gold-600'>
                      E-mail
                    </label>
                    <input
                      type='email'
                      required
                      className='w-full border border-gold-500/12 bg-navy-800/30 px-4 py-3 text-sm text-cream-100 outline-none transition-colors placeholder:text-txt-muted/40 focus:border-gold-500/30'
                      placeholder='seu@email.com'
                    />
                  </div>
                </div>

                <div className='grid gap-5 sm:grid-cols-2'>
                  <div>
                    <label className='mb-2 block text-xs uppercase tracking-[1.5px] text-gold-600'>
                      Telefone
                    </label>
                    <input
                      type='tel'
                      className='w-full border border-gold-500/12 bg-navy-800/30 px-4 py-3 text-sm text-cream-100 outline-none transition-colors placeholder:text-txt-muted/40 focus:border-gold-500/30'
                      placeholder='(11) 99999-9999'
                    />
                  </div>
                  <div>
                    <label className='mb-2 block text-xs uppercase tracking-[1.5px] text-gold-600'>
                      Área de interesse
                    </label>
                    <select className='w-full border border-gold-500/12 bg-navy-800/30 px-4 py-3 text-sm text-cream-100 outline-none transition-colors focus:border-gold-500/30'>
                      <option value=''>Selecione</option>
                      <option value='criminal'>Criminal</option>
                      <option value='tribunal-do-juri'>Tribunal do Júri</option>
                      <option value='improbidade'>
                        Improbidade Administrativa
                      </option>
                      <option value='imobiliario'>Imobiliário</option>
                      <option value='civel'>Cível</option>
                      <option value='disciplinar'>Disciplinar</option>
                      <option value='outro'>Outro</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className='mb-2 block text-xs uppercase tracking-[1.5px] text-gold-600'>
                    Descreva brevemente sua demanda
                  </label>
                  <textarea
                    rows={5}
                    required
                    className='w-full resize-none border border-gold-500/12 bg-navy-800/30 px-4 py-3 text-sm text-cream-100 outline-none transition-colors placeholder:text-txt-muted/40 focus:border-gold-500/30'
                    placeholder='Conte-nos um pouco sobre sua situação...'
                  />
                </div>

                <p className='text-xs text-txt-muted'>
                  As informações enviadas são tratadas com sigilo profissional,
                  nos termos do Código de Ética da OAB e da LGPD.
                </p>

                <button
                  type='submit'
                  className='group inline-flex items-center gap-2 bg-gold-500 px-6 py-3 text-[13px] font-medium uppercase tracking-[2px] text-navy-950 transition-all duration-300 hover:bg-gold-400 sm:px-8 sm:py-3.5'
                >
                  Enviar mensagem
                  <ArrowRight
                    size={14}
                    className='transition-transform group-hover:translate-x-1'
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
