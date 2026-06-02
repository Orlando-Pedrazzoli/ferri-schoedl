'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, Loader2 } from 'lucide-react';

interface CursoBuyButtonProps {
  slug: string;
  price: number;
}

export default function CursoBuyButton({ slug, price }: CursoBuyButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleBuy() {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{ slug, quantity: 1, format: 'course' }],
        }),
      });

      // Não logado → manda pro login e volta pra cá depois
      if (res.status === 401) {
        router.push(
          `/conta/login?callbackUrl=${encodeURIComponent(`/cursos/${slug}`)}`,
        );
        return;
      }

      const data = await res.json();

      if (!res.ok || !data.url) {
        setError(data.error || 'Não foi possível iniciar a compra.');
        setLoading(false);
        return;
      }

      // Redireciona para o checkout do Stripe
      window.location.href = data.url;
    } catch {
      setError('Erro de conexão. Tente novamente.');
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type='button'
        onClick={handleBuy}
        disabled={loading}
        className='flex w-full items-center justify-center gap-2 bg-gold-500 px-6 py-3 text-[13px] font-medium uppercase tracking-[2px] text-navy-950 transition-colors hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-60'
      >
        {loading ? (
          <>
            <Loader2 size={14} className='animate-spin' />
            Processando...
          </>
        ) : (
          <>
            <CreditCard size={14} />
            Comprar curso — R$ {price.toFixed(2)}
          </>
        )}
      </button>
      {error && (
        <p className='mt-2 text-center text-xs text-red-400'>{error}</p>
      )}
    </div>
  );
}
