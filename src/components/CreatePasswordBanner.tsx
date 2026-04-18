'use client';

import { useState } from 'react';
import { Lock, X, Loader2, Check, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface Props {
  orderCode: string;
  setupToken?: string;
  onDismiss: () => void;
  onSuccess: () => void;
}

export function CreatePasswordBanner({
  orderCode,
  setupToken,
  onDismiss,
  onSuccess,
}: Props) {
  const [expanded, setExpanded] = useState(true);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const handleSnooze = async () => {
    try {
      await fetch('/api/conta/definir-senha/snooze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderCode, setupToken }),
      });
    } catch {
      // Silencioso: se falhar, banner some da sessao atual de qualquer forma
    }
    onDismiss();
  };

  const handleSubmit = async () => {
    if (password.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setError('As senhas nao coincidem.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/conta/definir-senha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, orderCode, setupToken }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Erro ao definir senha.');
        setLoading(false);
        return;
      }
      setDone(true);
      toast.success('Senha definida! Agora pode aceder a area do cliente.');
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch {
      setError('Erro de conexao. Tente novamente.');
      setLoading(false);
    }
  };

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className='mb-6 flex items-center gap-3 border border-green-500/30 bg-green-500/5 px-5 py-4'
      >
        <Check size={18} className='shrink-0 text-green-400' />
        <p className='text-sm text-cream-100'>
          Senha definida com sucesso. Redirecionando para a area do cliente...
        </p>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        className='mb-6 border border-gold-500/25 bg-gradient-to-r from-gold-500/8 to-gold-500/3'
      >
        <div className='flex items-start gap-4 px-5 py-4 sm:px-6'>
          <div className='mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-500/15'>
            <Lock size={16} className='text-gold-500' />
          </div>

          <div className='min-w-0 flex-1'>
            <h3 className='text-sm font-medium text-cream-100'>
              Crie uma senha para sua conta
            </h3>
            <p className='mt-1 text-xs text-txt-muted'>
              Defina uma senha agora para aceder a area do cliente, acompanhar
              pedidos futuros e gerir seus dados.
            </p>

            {expanded ? (
              <div className='mt-4 space-y-3'>
                <div className='grid gap-3 sm:grid-cols-2'>
                  <input
                    type='password'
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder='Nova senha (min. 8 caracteres)'
                    className='w-full border border-gold-500/20 bg-navy-900/40 px-3 py-2.5 text-sm text-cream-100 outline-none placeholder:text-txt-muted/50 focus:border-gold-500/50'
                    disabled={loading}
                  />
                  <input
                    type='password'
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder='Confirmar senha'
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleSubmit();
                    }}
                    className='w-full border border-gold-500/20 bg-navy-900/40 px-3 py-2.5 text-sm text-cream-100 outline-none placeholder:text-txt-muted/50 focus:border-gold-500/50'
                    disabled={loading}
                  />
                </div>

                {error ? (
                  <div className='flex items-start gap-2'>
                    <AlertCircle
                      size={13}
                      className='mt-0.5 shrink-0 text-red-400'
                    />
                    <p className='text-xs text-red-300'>{error}</p>
                  </div>
                ) : null}

                <div className='flex flex-wrap items-center gap-3'>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className='flex items-center gap-2 bg-gold-500 px-5 py-2 text-xs font-medium uppercase tracking-[1.5px] text-navy-950 transition-colors hover:bg-gold-400 disabled:opacity-50'
                  >
                    {loading ? (
                      <Loader2 size={14} className='animate-spin' />
                    ) : (
                      <Check size={14} />
                    )}
                    Definir senha
                  </button>
                  <button
                    onClick={handleSnooze}
                    disabled={loading}
                    className='text-xs text-txt-muted transition-colors hover:text-cream-100 disabled:opacity-50'
                  >
                    Lembrar-me em 7 dias
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setExpanded(true)}
                className='mt-2 text-xs font-medium text-gold-500 transition-colors hover:text-gold-400'
              >
                Criar senha agora
              </button>
            )}
          </div>

          <button
            onClick={handleSnooze}
            className='shrink-0 text-txt-muted transition-colors hover:text-cream-100'
            aria-label='Fechar e lembrar depois'
            disabled={loading}
          >
            <X size={16} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
