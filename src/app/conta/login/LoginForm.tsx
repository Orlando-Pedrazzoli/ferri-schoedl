'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const urlError = searchParams.get('error');
    const urlMessage = searchParams.get('message');
    if (urlError) setError(decodeURIComponent(urlError));
    if (urlMessage) setMessage(decodeURIComponent(urlMessage));
  }, [searchParams]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!form.email || !form.password) {
      setError('Preencha todos os campos');
      return;
    }

    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email: form.email.trim().toLowerCase(),
        password: form.password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        return;
      }

      const redirect = searchParams.get('redirect');
      router.push(redirect || '/conta');
      router.refresh();
    } catch {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='min-h-screen bg-navy-950 pt-28 pb-16'>
      <div className='mx-auto max-w-md px-6'>
        <div className='mb-10 text-center'>
          <h1 className='font-[family-name:var(--font-cormorant)] text-3xl tracking-wide text-cream-100'>
            Entrar
          </h1>
          <p className='mt-2 text-sm text-txt-muted'>
            Acesse sua conta para ver pedidos e comprar livros
          </p>
        </div>

        {message && (
          <div className='mb-6 border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400'>
            {message}
          </div>
        )}

        {error && (
          <div className='mb-6 border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400'>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-5'>
          <div>
            <label
              htmlFor='email'
              className='mb-1.5 block text-xs font-medium uppercase tracking-wider text-txt-muted'
            >
              Email
            </label>
            <input
              id='email'
              name='email'
              type='email'
              autoComplete='email'
              value={form.email}
              onChange={handleChange}
              className='w-full border border-gold-500/20 bg-navy-900/50 px-4 py-3 text-sm text-cream-100 outline-none transition-colors placeholder:text-txt-muted/40 focus:border-gold-500/50'
              placeholder='seu@email.com'
            />
          </div>

          <div>
            <label
              htmlFor='password'
              className='mb-1.5 block text-xs font-medium uppercase tracking-wider text-txt-muted'
            >
              Password
            </label>
            <div className='relative'>
              <input
                id='password'
                name='password'
                type={showPassword ? 'text' : 'password'}
                autoComplete='current-password'
                value={form.password}
                onChange={handleChange}
                className='w-full border border-gold-500/20 bg-navy-900/50 px-4 py-3 pr-11 text-sm text-cream-100 outline-none transition-colors placeholder:text-txt-muted/40 focus:border-gold-500/50'
                placeholder='Sua password'
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-txt-muted/60 hover:text-gold-500'
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type='submit'
            disabled={loading}
            className='flex w-full items-center justify-center border border-gold-500 bg-gold-500 py-3 text-xs font-medium uppercase tracking-[2px] text-navy-950 transition-all duration-300 hover:bg-gold-500/90 disabled:cursor-not-allowed disabled:opacity-50'
          >
            {loading ? (
              <>
                <Loader2 size={16} className='mr-2 animate-spin' />A entrar...
              </>
            ) : (
              'Entrar'
            )}
          </button>
        </form>

        <p className='mt-8 text-center text-sm text-txt-muted'>
          Não tem uma conta?{' '}
          <Link
            href='/conta/registro'
            className='text-gold-500 transition-colors hover:text-gold-400'
          >
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  );
}
