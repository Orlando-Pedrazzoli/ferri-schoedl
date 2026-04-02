'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Mail, Loader2 } from 'lucide-react';

export default function VerificarEmailPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [error, setError] = useState('');

  async function handleResend() {
    if (!email || resending) return;

    setResending(true);
    setError('');

    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setResent(true);
      } else {
        const data = await res.json();
        setError(data.error || 'Erro ao reenviar. Tente novamente.');
      }
    } catch {
      setError('Erro de conexão.');
    } finally {
      setResending(false);
    }
  }

  return (
    <div className='min-h-screen bg-navy-950 pt-28 pb-16'>
      <div className='mx-auto max-w-md px-6 text-center'>
        {/* Icon */}
        <div className='mx-auto mb-6 flex h-16 w-16 items-center justify-center border border-gold-500/30 bg-gold-500/5'>
          <Mail size={28} className='text-gold-500' />
        </div>

        <h1 className='font-[family-name:var(--font-cormorant)] text-3xl tracking-wide text-cream-100'>
          Verifique seu email
        </h1>

        <p className='mt-4 text-sm leading-relaxed text-txt-muted'>
          Enviámos um email de verificação para{' '}
          {email ? (
            <span className='text-cream-100'>{email}</span>
          ) : (
            'o seu endereço de email'
          )}
          . Clique no link do email para activar a sua conta.
        </p>

        <p className='mt-3 text-xs text-txt-muted/60'>
          O link expira em 24 horas. Verifique também a pasta de spam.
        </p>

        {/* Resend */}
        <div className='mt-8'>
          {resent ? (
            <p className='text-sm text-green-400'>
              Email reenviado com sucesso!
            </p>
          ) : (
            <>
              {error && <p className='mb-3 text-xs text-red-400'>{error}</p>}
              <button
                onClick={handleResend}
                disabled={resending || !email}
                className='border border-gold-500/30 px-6 py-2.5 text-xs font-medium uppercase tracking-[2px] text-gold-500 transition-all duration-300 hover:border-gold-500/60 hover:bg-gold-500/5 disabled:cursor-not-allowed disabled:opacity-50'
              >
                {resending ? (
                  <span className='flex items-center gap-2'>
                    <Loader2 size={14} className='animate-spin' />A reenviar...
                  </span>
                ) : (
                  'Reenviar email'
                )}
              </button>
            </>
          )}
        </div>

        {/* Link to login */}
        <p className='mt-8 text-sm text-txt-muted'>
          Já verificou?{' '}
          <Link
            href='/conta/login'
            className='text-gold-500 transition-colors hover:text-gold-400'
          >
            Fazer login
          </Link>
        </p>
      </div>
    </div>
  );
}
