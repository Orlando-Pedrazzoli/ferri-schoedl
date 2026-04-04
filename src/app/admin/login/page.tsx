'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Email ou password incorretos.');
      } else {
        router.push('/admin');
        router.refresh();
      }
    } catch {
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-navy-950'>
      <div className='w-full max-w-md p-8'>
        <div className='bg-navy-900 rounded-2xl p-8 border border-gold-500/10 shadow-2xl'>
          <div className='text-center mb-8'>
            <h1
              className='text-2xl font-semibold text-cream-100'
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              Ferri Schoedl
            </h1>
            <p className='text-sm text-txt-muted mt-1'>Painel Administrativo</p>
          </div>

          {error && (
            <div className='mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm text-center'>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-5'>
            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-cream-200 mb-1.5'
              >
                Email
              </label>
              <input
                id='email'
                type='email'
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className='w-full px-4 py-2.5 bg-navy-950 border border-gold-500/15 rounded-lg text-cream-100 placeholder-txt-muted/50 focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500/40 transition-colors'
                placeholder='thales@ferrischoedl.adv.br'
              />
            </div>

            <div>
              <label
                htmlFor='password'
                className='block text-sm font-medium text-cream-200 mb-1.5'
              >
                Password
              </label>
              <input
                id='password'
                type='password'
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className='w-full px-4 py-2.5 bg-navy-950 border border-gold-500/15 rounded-lg text-cream-100 placeholder-txt-muted/50 focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500/40 transition-colors'
                placeholder='••••••••'
              />
            </div>

            <button
              type='submit'
              disabled={loading}
              className='w-full py-2.5 bg-gold-500 hover:bg-gold-400 disabled:bg-gold-500/50 text-navy-950 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gold-500/30'
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
