'use client';

import { useState, useEffect, useCallback } from 'react';
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

  const handleBuy = useCallback(async () => {
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

      // Não logado → vai pro login e volta já sinalizando "retomar compra"
      if (res.status === 401) {
        const callback = encodeURIComponent(`/cursos/${slug}?comprar=1`);
        router.push(`/conta/login?callbackUrl=${callback}`);
        return;
      }

      const data = await res.json();

      if (!res.ok || !data.url) {
        setError(data.error || 'Não foi possível iniciar a compra.');
        setLoading(false);
        return;
      }

      window.location.href = data.url;
    } catch {
      setError('Erro de conexão. Tente novamente.');
      setLoading(false);
    }
  }, [router, slug]);

  // Após login/cadastro, volta com ?comprar=1 e a compra é retomada automaticamente
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('comprar') === '1') {
      handleBuy();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            Comprar curso — R$ {price.toFixed(2).replace('.', ',')}
          </>
        )}
      </button>
      {error && (
        <p className='mt-2 text-center text-xs text-red-400'>{error}</p>
      )}
    </div>
  );
}
