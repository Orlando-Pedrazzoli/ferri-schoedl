'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

/* ─── CPF Mask: 123.456.789-00 ─── */
function maskCPF(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9)
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

/* ─── Phone Mask: (11) 99999-9999 ─── */
function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : '';
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export default function RegistroPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    cpf: '',
    phone: '',
    website: '', // honeypot
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    let maskedValue = value;
    if (name === 'cpf') maskedValue = maskCPF(value);
    if (name === 'phone') maskedValue = maskPhone(value);

    setForm(prev => ({ ...prev, [name]: maskedValue }));

    // Clear error on type
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  }

  function validate(): boolean {
    const errs: Record<string, string> = {};

    if (!form.name.trim() || form.name.trim().length < 2) {
      errs.name = 'Nome deve ter pelo menos 2 caracteres';
    }

    if (!form.email.trim()) {
      errs.email = 'Email é obrigatório';
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      errs.email = 'Email inválido';
    }

    if (!form.password || form.password.length < 8) {
      errs.password = 'Password deve ter pelo menos 8 caracteres';
    }

    if (form.password !== form.confirmPassword) {
      errs.confirmPassword = 'As passwords não coincidem';
    }

    const cpfDigits = form.cpf.replace(/\D/g, '');
    if (cpfDigits.length !== 11) {
      errs.cpf = 'CPF deve ter 11 dígitos';
    }

    const phoneDigits = form.phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      errs.phone = 'Telefone inválido';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGlobalError('');

    if (!validate()) return;

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
          cpf: form.cpf,
          phone: form.phone,
          website: form.website, // honeypot
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setGlobalError(data.error || 'Erro ao criar conta. Tente novamente.');
        }
        return;
      }

      // Sucesso — redirecionar para página de verificação
      router.push(
        `/conta/verificar-email?email=${encodeURIComponent(form.email)}`,
      );
    } catch {
      setGlobalError(
        'Erro de conexão. Verifique sua internet e tente novamente.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='min-h-screen bg-navy-950 pt-28 pb-16'>
      <div className='mx-auto max-w-md px-6'>
        {/* Header */}
        <div className='mb-10 text-center'>
          <h1 className='font-[family-name:var(--font-cormorant)] text-3xl tracking-wide text-cream-100'>
            Criar Conta
          </h1>
          <p className='mt-2 text-sm text-txt-muted'>
            Registre-se para comprar livros e acompanhar seus pedidos
          </p>
        </div>

        {/* Global error */}
        {globalError && (
          <div className='mb-6 border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400'>
            {globalError}
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-5'>
          {/* Honeypot — invisible to real users */}
          <div className='absolute -left-[9999px] opacity-0' aria-hidden='true'>
            <input
              type='text'
              name='website'
              tabIndex={-1}
              autoComplete='off'
              value={form.website}
              onChange={handleChange}
            />
          </div>

          {/* Nome */}
          <div>
            <label
              htmlFor='name'
              className='mb-1.5 block text-xs font-medium uppercase tracking-wider text-txt-muted'
            >
              Nome completo
            </label>
            <input
              id='name'
              name='name'
              type='text'
              autoComplete='name'
              value={form.name}
              onChange={handleChange}
              className={`w-full border bg-navy-900/50 px-4 py-3 text-sm text-cream-100 outline-none transition-colors placeholder:text-txt-muted/40 focus:border-gold-500/50 ${
                errors.name ? 'border-red-500/50' : 'border-gold-500/20'
              }`}
              placeholder='Seu nome completo'
            />
            {errors.name && (
              <p className='mt-1 text-xs text-red-400'>{errors.name}</p>
            )}
          </div>

          {/* Email */}
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
              className={`w-full border bg-navy-900/50 px-4 py-3 text-sm text-cream-100 outline-none transition-colors placeholder:text-txt-muted/40 focus:border-gold-500/50 ${
                errors.email ? 'border-red-500/50' : 'border-gold-500/20'
              }`}
              placeholder='seu@email.com'
            />
            {errors.email && (
              <p className='mt-1 text-xs text-red-400'>{errors.email}</p>
            )}
          </div>

          {/* CPF */}
          <div>
            <label
              htmlFor='cpf'
              className='mb-1.5 block text-xs font-medium uppercase tracking-wider text-txt-muted'
            >
              CPF
            </label>
            <input
              id='cpf'
              name='cpf'
              type='text'
              inputMode='numeric'
              autoComplete='off'
              value={form.cpf}
              onChange={handleChange}
              className={`w-full border bg-navy-900/50 px-4 py-3 text-sm text-cream-100 outline-none transition-colors placeholder:text-txt-muted/40 focus:border-gold-500/50 ${
                errors.cpf ? 'border-red-500/50' : 'border-gold-500/20'
              }`}
              placeholder='000.000.000-00'
            />
            {errors.cpf && (
              <p className='mt-1 text-xs text-red-400'>{errors.cpf}</p>
            )}
          </div>

          {/* Telefone */}
          <div>
            <label
              htmlFor='phone'
              className='mb-1.5 block text-xs font-medium uppercase tracking-wider text-txt-muted'
            >
              Telefone
            </label>
            <input
              id='phone'
              name='phone'
              type='text'
              inputMode='numeric'
              autoComplete='tel'
              value={form.phone}
              onChange={handleChange}
              className={`w-full border bg-navy-900/50 px-4 py-3 text-sm text-cream-100 outline-none transition-colors placeholder:text-txt-muted/40 focus:border-gold-500/50 ${
                errors.phone ? 'border-red-500/50' : 'border-gold-500/20'
              }`}
              placeholder='(11) 99999-9999'
            />
            {errors.phone && (
              <p className='mt-1 text-xs text-red-400'>{errors.phone}</p>
            )}
          </div>

          {/* Password */}
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
                autoComplete='new-password'
                value={form.password}
                onChange={handleChange}
                className={`w-full border bg-navy-900/50 px-4 py-3 pr-11 text-sm text-cream-100 outline-none transition-colors placeholder:text-txt-muted/40 focus:border-gold-500/50 ${
                  errors.password ? 'border-red-500/50' : 'border-gold-500/20'
                }`}
                placeholder='Mínimo 8 caracteres'
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
            {errors.password && (
              <p className='mt-1 text-xs text-red-400'>{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor='confirmPassword'
              className='mb-1.5 block text-xs font-medium uppercase tracking-wider text-txt-muted'
            >
              Confirmar password
            </label>
            <div className='relative'>
              <input
                id='confirmPassword'
                name='confirmPassword'
                type={showConfirm ? 'text' : 'password'}
                autoComplete='new-password'
                value={form.confirmPassword}
                onChange={handleChange}
                className={`w-full border bg-navy-900/50 px-4 py-3 pr-11 text-sm text-cream-100 outline-none transition-colors placeholder:text-txt-muted/40 focus:border-gold-500/50 ${
                  errors.confirmPassword
                    ? 'border-red-500/50'
                    : 'border-gold-500/20'
                }`}
                placeholder='Repita a password'
              />
              <button
                type='button'
                onClick={() => setShowConfirm(!showConfirm)}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-txt-muted/60 hover:text-gold-500'
                tabIndex={-1}
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className='mt-1 text-xs text-red-400'>
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type='submit'
            disabled={loading}
            className='flex w-full items-center justify-center border border-gold-500 bg-gold-500 py-3 text-xs font-medium uppercase tracking-[2px] text-navy-950 transition-all duration-300 hover:bg-gold-500/90 disabled:cursor-not-allowed disabled:opacity-50'
          >
            {loading ? (
              <>
                <Loader2 size={16} className='mr-2 animate-spin' />A criar
                conta...
              </>
            ) : (
              'Criar conta'
            )}
          </button>
        </form>

        {/* Login link */}
        <p className='mt-8 text-center text-sm text-txt-muted'>
          Já tem uma conta?{' '}
          <Link
            href='/conta/login'
            className='text-gold-500 transition-colors hover:text-gold-400'
          >
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
