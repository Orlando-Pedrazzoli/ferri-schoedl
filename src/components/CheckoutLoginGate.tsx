'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, X, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

type GateMode = 'email' | 'login' | 'register';

interface Props {
  open: boolean;
  onClose: () => void;
  prefilledEmail?: string;
  prefilledName?: string;
  prefilledCpf?: string;
  prefilledPhone?: string;
  onAuthenticated: () => void;
}

export function CheckoutLoginGate({
  open,
  onClose,
  prefilledEmail = '',
  prefilledName = '',
  prefilledCpf = '',
  prefilledPhone = '',
  onAuthenticated,
}: Props) {
  const [mode, setMode] = useState<GateMode>('email');
  const [email, setEmail] = useState(prefilledEmail);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setEmail(prefilledEmail);
      setMode('email');
      setError('');
      setPassword('');
      setConfirmPassword('');
    }
  }, [open, prefilledEmail]);

  // Passo 1: descobrir se o email já tem conta com senha
  const handleEmailSubmit = async () => {
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Digite um email válido.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/checkout-otp/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name: prefilledName }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Erro ao processar. Tente novamente.');
        setLoading(false);
        return;
      }
      // Conta existente com senha → login; senão → criar conta com senha
      if (data.mode === 'login') {
        setMode('login');
      } else {
        setMode('register');
      }
    } catch {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Login de conta existente
  const handlePasswordSubmit = async () => {
    if (!password) {
      setError('Digite sua senha.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
      if (result?.error) {
        setError(
          result.error === 'CredentialsSignin'
            ? 'Email ou senha incorretos.'
            : result.error,
        );
        setLoading(false);
        return;
      }
      toast.success('Login efetuado!');
      onAuthenticated();
    } catch {
      setError('Erro ao fazer login. Tente novamente.');
      setLoading(false);
    }
  };

  // Criar conta com senha (sem código por email)
  const handleRegisterSubmit = async () => {
    if (!password || password.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: prefilledName,
          email,
          password,
          cpf: prefilledCpf,
          phone: prefilledPhone,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        // Email já cadastrado → manda pro login
        if (data.errors?.email) {
          setError(data.errors.email);
          setMode('login');
          setLoading(false);
          return;
        }
        const firstErr = data.errors && Object.values(data.errors)[0];
        setError(
          (firstErr as string) ||
            data.error ||
            'Erro ao criar conta. Verifique seus dados.',
        );
        setLoading(false);
        return;
      }
      // Conta criada (já verificada) → autentica e segue para o pagamento
      const signInResult = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
      if (signInResult?.error) {
        setError('Conta criada, mas falha ao entrar. Tente fazer login.');
        setMode('login');
        setLoading(false);
        return;
      }
      toast.success('Conta criada!');
      onAuthenticated();
    } catch {
      setError('Erro de conexão. Tente novamente.');
      setLoading(false);
    }
  };

  const handleMainButton = () => {
    if (mode === 'email') handleEmailSubmit();
    else if (mode === 'login') handlePasswordSubmit();
    else handleRegisterSubmit();
  };

  const mainButtonLabel =
    mode === 'email'
      ? 'Continuar'
      : mode === 'login'
        ? 'Entrar'
        : 'Criar conta e continuar';

  const headerTitle =
    mode === 'email'
      ? 'Confirme seu email'
      : mode === 'login'
        ? 'Entrar na sua conta'
        : 'Criar sua conta';

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key='gate-root'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='fixed inset-0 z-[100]'
        >
          <div
            onClick={onClose}
            className='absolute inset-0 bg-navy-950/80 backdrop-blur-sm'
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.2 }}
            className='absolute left-1/2 top-1/2 z-[101] w-full max-w-md -translate-x-1/2 -translate-y-1/2 px-4'
          >
            <div className='border border-gold-500/20 bg-navy-900 p-6 shadow-2xl sm:p-8'>
              {/* Header */}
              <div className='mb-6 flex items-start justify-between'>
                <div className='flex items-center gap-3'>
                  {mode !== 'email' ? (
                    <button
                      onClick={() => {
                        setMode('email');
                        setError('');
                      }}
                      className='text-txt-muted transition-colors hover:text-cream-100'
                      aria-label='Voltar'
                    >
                      <ArrowLeft size={18} />
                    </button>
                  ) : null}
                  <h2 className='font-[family-name:var(--font-cormorant)] text-2xl text-cream-100'>
                    {headerTitle}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className='text-txt-muted transition-colors hover:text-cream-100'
                  aria-label='Fechar'
                >
                  <X size={20} />
                </button>
              </div>

              {/* Step email */}
              {mode === 'email' ? (
                <div>
                  <p className='mb-5 text-sm text-txt-muted'>
                    Use seu email para finalizar a compra. Se já tem conta, você
                    faz login; se não, criamos sua conta na hora.
                  </p>
                  <div>
                    <label className='mb-1 block text-xs text-txt-muted'>
                      Email
                    </label>
                    <div className='relative'>
                      <Mail
                        size={14}
                        className='absolute left-3 top-1/2 -translate-y-1/2 text-txt-muted'
                      />
                      <input
                        type='email'
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') handleEmailSubmit();
                        }}
                        placeholder='seu@email.com'
                        autoFocus
                        className='w-full border border-gold-500/12 bg-navy-800/30 py-2.5 pl-9 pr-3 text-sm text-cream-100 outline-none placeholder:text-txt-muted/40 focus:border-gold-500/30'
                      />
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Step login */}
              {mode === 'login' ? (
                <div>
                  <p className='mb-5 text-sm text-txt-muted'>
                    Já existe uma conta com <strong>{email}</strong>. Digite sua
                    senha para continuar.
                  </p>
                  <div className='space-y-4'>
                    <div>
                      <label className='mb-1 block text-xs text-txt-muted'>
                        Senha
                      </label>
                      <div className='relative'>
                        <Lock
                          size={14}
                          className='absolute left-3 top-1/2 -translate-y-1/2 text-txt-muted'
                        />
                        <input
                          type='password'
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') handlePasswordSubmit();
                          }}
                          autoFocus
                          className='w-full border border-gold-500/12 bg-navy-800/30 py-2.5 pl-9 pr-3 text-sm text-cream-100 outline-none focus:border-gold-500/30'
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Step register */}
              {mode === 'register' ? (
                <div>
                  <p className='mb-5 text-sm text-txt-muted'>
                    Vamos criar sua conta com <strong>{email}</strong>. Defina
                    uma senha para finalizar a compra.
                  </p>
                  <div className='space-y-4'>
                    <div>
                      <label className='mb-1 block text-xs text-txt-muted'>
                        Senha (mín. 8 caracteres)
                      </label>
                      <div className='relative'>
                        <Lock
                          size={14}
                          className='absolute left-3 top-1/2 -translate-y-1/2 text-txt-muted'
                        />
                        <input
                          type='password'
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          autoFocus
                          className='w-full border border-gold-500/12 bg-navy-800/30 py-2.5 pl-9 pr-3 text-sm text-cream-100 outline-none focus:border-gold-500/30'
                        />
                      </div>
                    </div>
                    <div>
                      <label className='mb-1 block text-xs text-txt-muted'>
                        Confirmar senha
                      </label>
                      <div className='relative'>
                        <Lock
                          size={14}
                          className='absolute left-3 top-1/2 -translate-y-1/2 text-txt-muted'
                        />
                        <input
                          type='password'
                          value={confirmPassword}
                          onChange={e => setConfirmPassword(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') handleRegisterSubmit();
                          }}
                          className='w-full border border-gold-500/12 bg-navy-800/30 py-2.5 pl-9 pr-3 text-sm text-cream-100 outline-none focus:border-gold-500/30'
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Erro */}
              {error ? (
                <div className='mt-4 flex items-start gap-2 border border-red-500/20 bg-red-500/5 px-3 py-2'>
                  <AlertCircle
                    size={14}
                    className='mt-0.5 shrink-0 text-red-400'
                  />
                  <p className='text-xs text-red-300'>{error}</p>
                </div>
              ) : null}

              {/* Main button */}
              <button
                onClick={handleMainButton}
                disabled={loading}
                className='mt-6 flex w-full items-center justify-center gap-2 bg-gold-500 py-3 text-[13px] font-medium uppercase tracking-[2px] text-navy-950 transition-colors hover:bg-gold-400 disabled:opacity-50'
              >
                {loading ? (
                  <Loader2 size={16} className='animate-spin' />
                ) : (
                  <span>{mainButtonLabel}</span>
                )}
              </button>

              <p className='mt-4 text-center text-[11px] text-txt-muted'>
                Ao continuar, você concorda com os{' '}
                <a
                  href='/termos-de-uso'
                  className='text-gold-600 hover:text-gold-500'
                >
                  Termos de Uso
                </a>{' '}
                e{' '}
                <a
                  href='/politica-de-privacidade'
                  className='text-gold-600 hover:text-gold-500'
                >
                  Política de Privacidade
                </a>
                .
              </p>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
