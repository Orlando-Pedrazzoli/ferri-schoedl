'use client';

import { useState, useEffect, useRef } from 'react';
import { signIn } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, X, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

type GateMode = 'email' | 'login' | 'otp';

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
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isNewAccount, setIsNewAccount] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (open) {
      setEmail(prefilledEmail);
      setMode('email');
      setError('');
      setPassword('');
      setOtpDigits(['', '', '', '', '', '']);
    }
  }, [open, prefilledEmail]);

  const handleEmailSubmit = async () => {
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Digite um email valido.');
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
      if (data.mode === 'login') {
        setMode('login');
        setIsNewAccount(false);
      } else {
        setMode('otp');
        setIsNewAccount(!data.emailExists);
        toast.success('Codigo enviado para o seu email.');
        setTimeout(() => otpRefs.current[0]?.focus(), 200);
      }
    } catch {
      setError('Erro de conexao. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

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

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(0, 1);
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);
    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, 6);
    if (pasted.length === 6) {
      setOtpDigits(pasted.split(''));
      otpRefs.current[5]?.focus();
    }
  };

  const handleOtpSubmit = async () => {
    const code = otpDigits.join('');
    if (code.length !== 6) {
      setError('Digite os 6 digitos do codigo.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/checkout-otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          code,
          name: prefilledName,
          cpf: prefilledCpf,
          phone: prefilledPhone,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Codigo invalido.');
        setLoading(false);
        return;
      }
      const signInResult = await signIn('otp-login', {
        email,
        customerId: data.customerId,
        otpSignature: data.otpSignature,
        redirect: false,
      });
      if (signInResult?.error) {
        setError('Erro ao autenticar. Tente novamente.');
        setLoading(false);
        return;
      }
      toast.success(
        data.action === 'created'
          ? 'Conta criada e verificada!'
          : 'Email verificado!',
      );
      onAuthenticated();
    } catch {
      setError('Erro de conexao. Tente novamente.');
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/checkout-otp/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name: prefilledName }),
      });
      if (res.ok) {
        toast.success('Novo codigo enviado.');
        setOtpDigits(['', '', '', '', '', '']);
        otpRefs.current[0]?.focus();
      } else {
        const data = await res.json();
        setError(data.error || 'Erro ao reenviar.');
      }
    } catch {
      setError('Erro de conexao.');
    } finally {
      setLoading(false);
    }
  };

  const handleMainButton = () => {
    if (mode === 'email') handleEmailSubmit();
    else if (mode === 'login') handlePasswordSubmit();
    else handleOtpSubmit();
  };

  const mainButtonLabel =
    mode === 'email'
      ? 'Continuar'
      : mode === 'login'
        ? 'Entrar'
        : 'Confirmar codigo';

  const headerTitle =
    mode === 'email'
      ? 'Confirme seu email'
      : mode === 'login'
        ? 'Entrar na sua conta'
        : 'Verificar codigo';

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
                    Use seu email para finalizar a compra. Se ja tem conta, faz
                    login; se nao, enviamos um codigo de verificacao.
                  </p>
                  <div className='space-y-4'>
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
                </div>
              ) : null}

              {/* Step login password */}
              {mode === 'login' ? (
                <div>
                  <p className='mb-5 text-sm text-txt-muted'>
                    Ja existe uma conta com <strong>{email}</strong>. Digite sua
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
                    <p className='text-xs text-txt-muted'>
                      Esqueceu a senha?{' '}
                      <a
                        href='/conta/login'
                        className='text-gold-500 hover:text-gold-400'
                      >
                        Recuperar
                      </a>
                    </p>
                  </div>
                </div>
              ) : null}

              {/* Step OTP */}
              {mode === 'otp' ? (
                <div>
                  <p className='mb-5 text-sm text-txt-muted'>
                    Enviamos um codigo de 6 digitos para{' '}
                    <strong>{email}</strong>.{' '}
                    {isNewAccount
                      ? 'Ao confirmar, sua conta sera criada automaticamente.'
                      : 'Digite o codigo para continuar.'}
                  </p>
                  <div className='space-y-4'>
                    <div
                      className='flex justify-center gap-2'
                      onPaste={handleOtpPaste}
                    >
                      {otpDigits.map((d, i) => (
                        <input
                          key={i}
                          ref={el => {
                            otpRefs.current[i] = el;
                          }}
                          type='text'
                          inputMode='numeric'
                          maxLength={1}
                          value={d}
                          onChange={e => handleOtpChange(i, e.target.value)}
                          onKeyDown={e => handleOtpKeyDown(i, e)}
                          className='h-12 w-10 border border-gold-500/20 bg-navy-800/30 text-center text-lg text-cream-100 outline-none focus:border-gold-500/50 sm:h-14 sm:w-12 sm:text-xl'
                        />
                      ))}
                    </div>
                    <button
                      onClick={handleResendOtp}
                      disabled={loading}
                      className='w-full text-center text-xs text-gold-500 hover:text-gold-400 disabled:opacity-50'
                    >
                      Reenviar codigo
                    </button>
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
                Ao continuar, voce concorda com os{' '}
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
                  Politica de Privacidade
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
