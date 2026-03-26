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
    <div className='min-h-screen flex items-center justify-center bg-[#0a0f1c]'>
      <div className='w-full max-w-md p-8'>
        <div className='bg-[#111827] rounded-2xl p-8 border border-[#1f2937] shadow-2xl'>
          {/* Logo / Title */}
          <div className='text-center mb-8'>
            <h1
              className='text-2xl font-semibold text-white'
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              Ferri Schoedl
            </h1>
            <p className='text-sm text-gray-400 mt-1'>Painel Administrativo</p>
          </div>

          {/* Error message */}
          {error && (
            <div className='mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm text-center'>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className='space-y-5'>
            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-gray-300 mb-1.5'
              >
                Email
              </label>
              <input
                id='email'
                type='email'
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className='w-full px-4 py-2.5 bg-[#0a0f1c] border border-[#1f2937] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-colors'
                placeholder='thales@ferrischoedl.adv.br'
              />
            </div>

            <div>
              <label
                htmlFor='password'
                className='block text-sm font-medium text-gray-300 mb-1.5'
              >
                Password
              </label>
              <input
                id='password'
                type='password'
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className='w-full px-4 py-2.5 bg-[#0a0f1c] border border-[#1f2937] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-colors'
                placeholder='••••••••'
              />
            </div>

            <button
              type='submit'
              disabled={loading}
              className='w-full py-2.5 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-600/50 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500/50'
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
