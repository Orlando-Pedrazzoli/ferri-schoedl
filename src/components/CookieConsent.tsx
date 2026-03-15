'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CONSENT_KEY = 'fs-cookie-consent';

type ConsentState = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
};

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [consent, setConsent] = useState<ConsentState>({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONSENT_KEY);
      if (!stored) {
        const timer = setTimeout(() => setVisible(true), 1500);
        return () => clearTimeout(timer);
      }
    } catch {
      // SSR or storage unavailable
    }
  }, []);

  const saveConsent = (state: ConsentState) => {
    try {
      localStorage.setItem(
        CONSENT_KEY,
        JSON.stringify({ ...state, timestamp: new Date().toISOString() }),
      );
    } catch {
      // Storage unavailable
    }
    setVisible(false);
    setShowPreferences(false);
  };

  const acceptAll = () => {
    saveConsent({ necessary: true, analytics: true, marketing: true });
  };

  const acceptSelected = () => {
    saveConsent(consent);
  };

  const rejectOptional = () => {
    saveConsent({ necessary: true, analytics: false, marketing: false });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className='fixed bottom-0 left-0 right-0 z-50 border-t border-gold-500/10 bg-navy-950/98 backdrop-blur-md'
        >
          <div className='mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8'>
            {!showPreferences ? (
              /* ── Banner principal ── */
              <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6'>
                <div className='flex items-start gap-3 sm:items-center'>
                  <Shield
                    size={18}
                    strokeWidth={1.2}
                    className='mt-0.5 shrink-0 text-gold-500 sm:mt-0'
                  />
                  <p className='text-sm leading-relaxed text-txt-muted'>
                    Este site utiliza cookies para melhorar sua experiência de
                    navegação. Ao continuar, você concorda com nossa{' '}
                    <Link
                      href='/politica-de-privacidade'
                      className='text-gold-500 underline underline-offset-2 transition-colors hover:text-gold-400'
                    >
                      Política de Privacidade
                    </Link>{' '}
                    e{' '}
                    <Link
                      href='/termos-de-uso'
                      className='text-gold-500 underline underline-offset-2 transition-colors hover:text-gold-400'
                    >
                      Termos de Uso
                    </Link>
                    , em conformidade com a LGPD (Lei 13.709/18).
                  </p>
                </div>
                <div className='flex shrink-0 flex-wrap items-center gap-2 sm:gap-3'>
                  <button
                    onClick={() => setShowPreferences(true)}
                    className='border border-gold-500/20 px-4 py-2 text-xs uppercase tracking-[1.5px] text-txt-muted transition-all duration-300 hover:border-gold-500/40 hover:text-cream-100'
                  >
                    Preferências
                  </button>
                  <button
                    onClick={rejectOptional}
                    className='border border-gold-500/20 px-4 py-2 text-xs uppercase tracking-[1.5px] text-txt-muted transition-all duration-300 hover:border-gold-500/40 hover:text-cream-100'
                  >
                    Rejeitar opcionais
                  </button>
                  <button
                    onClick={acceptAll}
                    className='bg-gold-500 px-5 py-2 text-xs font-medium uppercase tracking-[1.5px] text-navy-950 transition-colors hover:bg-gold-400'
                  >
                    Aceitar todos
                  </button>
                </div>
              </div>
            ) : (
              /* ── Painel de preferências ── */
              <div>
                <div className='mb-4 flex items-center justify-between'>
                  <h3 className='font-[family-name:var(--font-cormorant)] text-lg text-cream-100'>
                    Preferências de cookies
                  </h3>
                  <button
                    onClick={() => setShowPreferences(false)}
                    className='text-txt-muted transition-colors hover:text-cream-100'
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className='space-y-4'>
                  {/* Necessários */}
                  <div className='flex items-start justify-between gap-4 border border-gold-500/8 bg-navy-800/20 p-4'>
                    <div>
                      <p className='text-sm font-medium text-cream-100'>
                        Cookies necessários
                      </p>
                      <p className='mt-1 text-[13px] text-txt-muted'>
                        Essenciais para o funcionamento do site. Incluem
                        preferências de tema, sessão e segurança. Não podem ser
                        desativados.
                      </p>
                    </div>
                    <div className='mt-1 shrink-0'>
                      <div className='flex h-5 w-9 items-center rounded-full bg-gold-500/30 px-0.5'>
                        <div className='h-4 w-4 translate-x-4 rounded-full bg-gold-500' />
                      </div>
                    </div>
                  </div>

                  {/* Análise */}
                  <div className='flex items-start justify-between gap-4 border border-gold-500/8 bg-navy-800/20 p-4'>
                    <div>
                      <p className='text-sm font-medium text-cream-100'>
                        Cookies de análise
                      </p>
                      <p className='mt-1 text-[13px] text-txt-muted'>
                        Ajudam a entender como os visitantes interagem com o
                        site, permitindo melhorias na experiência de navegação.
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setConsent(prev => ({
                          ...prev,
                          analytics: !prev.analytics,
                        }))
                      }
                      className='mt-1 shrink-0'
                    >
                      <div
                        className={`flex h-5 w-9 items-center rounded-full px-0.5 transition-colors ${consent.analytics ? 'bg-gold-500/30' : 'bg-navy-700'}`}
                      >
                        <div
                          className={`h-4 w-4 rounded-full transition-all ${consent.analytics ? 'translate-x-4 bg-gold-500' : 'translate-x-0 bg-txt-muted'}`}
                        />
                      </div>
                    </button>
                  </div>

                  {/* Marketing */}
                  <div className='flex items-start justify-between gap-4 border border-gold-500/8 bg-navy-800/20 p-4'>
                    <div>
                      <p className='text-sm font-medium text-cream-100'>
                        Cookies de marketing
                      </p>
                      <p className='mt-1 text-[13px] text-txt-muted'>
                        Utilizados para exibir conteúdo relevante. Podem ser
                        compartilhados com terceiros para fins de publicidade.
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setConsent(prev => ({
                          ...prev,
                          marketing: !prev.marketing,
                        }))
                      }
                      className='mt-1 shrink-0'
                    >
                      <div
                        className={`flex h-5 w-9 items-center rounded-full px-0.5 transition-colors ${consent.marketing ? 'bg-gold-500/30' : 'bg-navy-700'}`}
                      >
                        <div
                          className={`h-4 w-4 rounded-full transition-all ${consent.marketing ? 'translate-x-4 bg-gold-500' : 'translate-x-0 bg-txt-muted'}`}
                        />
                      </div>
                    </button>
                  </div>
                </div>

                <div className='mt-5 flex flex-wrap gap-3'>
                  <button
                    onClick={acceptSelected}
                    className='bg-gold-500 px-5 py-2 text-xs font-medium uppercase tracking-[1.5px] text-navy-950 transition-colors hover:bg-gold-400'
                  >
                    Salvar preferências
                  </button>
                  <button
                    onClick={acceptAll}
                    className='border border-gold-500/30 px-5 py-2 text-xs uppercase tracking-[1.5px] text-gold-500 transition-all duration-300 hover:bg-gold-500/5'
                  >
                    Aceitar todos
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
