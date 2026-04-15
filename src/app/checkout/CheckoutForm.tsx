'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  ArrowLeft,
  CreditCard,
  QrCode,
  FileText,
  Truck,
  Lock,
  ShoppingBag,
  Loader2,
  AlertCircle,
  Check,
  Copy,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '@/components/CartProvider';
import toast from 'react-hot-toast';

// --- Tipos ---

type PaymentMethod = 'credit_card' | 'boleto' | 'pix';
type ShippingMethod = 'PAC' | 'SEDEX';
type CheckoutStep = 'dados' | 'pagamento' | 'confirmacao';

interface FreteOpcao {
  method: ShippingMethod;
  price: number;
  days: string;
}

interface AddressForm {
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  cep: string;
}

interface CardForm {
  number: string;
  holderName: string;
  expMonth: string;
  expYear: string;
  cvv: string;
  installments: number;
}

interface OrderResult {
  orderCode: string;
  status: string;
  paymentMethod: PaymentMethod;
  total: number;
  boletoUrl?: string;
  boletoBarcode?: string;
  boletoDueDate?: string;
  pixQrCode?: string;
  pixQrCodeUrl?: string;
  pixExpiresAt?: string;
}

// --- Helpers ---

function formatCurrency(value: number): string {
  return value.toFixed(2).replace('.', ',');
}

function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
}

function formatCep(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length > 5) return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  return digits;
}

const ESTADOS_BR = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
];

// --- Componente ---

export function CheckoutForm() {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const { items, totalPrice, totalWeight, clearCart } = useCart();

  const [step, setStep] = useState<CheckoutStep>('dados');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Endereco
  const [address, setAddress] = useState<AddressForm>({
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    cep: '',
  });

  // Frete (calculado via API)
  const [freteOpcoes, setFreteOpcoes] = useState<FreteOpcao[]>([]);
  const [freteRegiao, setFreteRegiao] = useState('');
  const [freteLoading, setFreteLoading] = useState(false);
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>('PAC');

  // Pagamento
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>('credit_card');
  const [card, setCard] = useState<CardForm>({
    number: '',
    holderName: '',
    expMonth: '',
    expYear: '',
    cvv: '',
    installments: 1,
  });

  // Resultado
  const [orderResult, setOrderResult] = useState<OrderResult | null>(null);
  const [pixCopied, setPixCopied] = useState(false);

  // Preco do frete selecionado
  const fretePrice =
    freteOpcoes.find(f => f.method === shippingMethod)?.price || 0;
  const freteDays =
    freteOpcoes.find(f => f.method === shippingMethod)?.days || '';
  const total = totalPrice + fretePrice;

  // Parcelas
  const installmentOptions = useMemo(() => {
    const opts = [];
    const max = total >= 100 ? 12 : total >= 50 ? 6 : total >= 30 ? 3 : 1;
    for (let i = 1; i <= max; i++) {
      const value = total / i;
      opts.push({
        value: i,
        label:
          i === 1
            ? `1x de R$ ${formatCurrency(total)} (sem juros)`
            : `${i}x de R$ ${formatCurrency(value)}`,
      });
    }
    return opts;
  }, [total]);

  // Redirecionar se carrinho vazio ou nao logado
  useEffect(() => {
    if (items.length === 0 && !orderResult) {
      router.push('/livros');
    }
  }, [items, orderResult, router]);

  useEffect(() => {
    if (sessionStatus === 'unauthenticated') {
      router.push('/conta/login?redirect=/checkout');
    }
  }, [sessionStatus, router]);

  // Buscar CEP via ViaCEP
  const handleCepBlur = useCallback(async () => {
    const cepDigits = address.cep.replace(/\D/g, '');
    if (cepDigits.length !== 8) return;

    try {
      const res = await fetch(`https://viacep.com.br/ws/${cepDigits}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setAddress(prev => ({
          ...prev,
          street: data.logradouro || prev.street,
          neighborhood: data.bairro || prev.neighborhood,
          city: data.localidade || prev.city,
          state: data.uf || prev.state,
        }));
      }
    } catch {
      // Silencioso
    }

    // Calcular frete automaticamente
    setFreteLoading(true);
    try {
      const res = await fetch('/api/shipping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cep: cepDigits, weightG: totalWeight }),
      });
      const data = await res.json();
      if (res.ok && data.opcoes) {
        setFreteOpcoes(data.opcoes);
        setFreteRegiao(data.regiao || '');
      }
    } catch {
      // Silencioso
    } finally {
      setFreteLoading(false);
    }
  }, [address.cep, totalWeight]);

  // Validar step 1
  const validateDados = (): boolean => {
    if (!address.cep || address.cep.replace(/\D/g, '').length !== 8) {
      setError('Preencha o CEP corretamente.');
      return false;
    }
    if (
      !address.street ||
      !address.number ||
      !address.neighborhood ||
      !address.city ||
      !address.state
    ) {
      setError('Preencha todos os campos de endereco obrigatorios.');
      return false;
    }
    if (!ESTADOS_BR.includes(address.state.toUpperCase())) {
      setError('Estado invalido.');
      return false;
    }
    if (freteOpcoes.length === 0) {
      setError(
        'Calcule o frete antes de continuar. Preencha o CEP e clique fora do campo.',
      );
      return false;
    }
    setError('');
    return true;
  };

  // Submeter pedido
  const handleSubmit = async () => {
    if (paymentMethod === 'credit_card') {
      const cardDigits = card.number.replace(/\s/g, '');
      if (cardDigits.length < 13 || cardDigits.length > 19) {
        setError('Numero do cartao invalido.');
        return;
      }
      if (!card.holderName.trim()) {
        setError('Nome no cartao e obrigatorio.');
        return;
      }
      if (!card.expMonth || !card.expYear || !card.cvv) {
        setError('Preencha validade e CVV do cartao.');
        return;
      }
    }

    setLoading(true);
    setError('');

    try {
      const user = session?.user as { id?: string } | undefined;
      if (!user?.id) {
        setError('Sessao expirada. Faca login novamente.');
        setLoading(false);
        return;
      }

      const payload = {
        customerId: user.id,
        items: items.map(i => ({ slug: i.livro.slug, quantity: i.quantity })),
        shipping: {
          method: shippingMethod,
          address: {
            street: address.street,
            number: address.number,
            complement: address.complement,
            neighborhood: address.neighborhood,
            city: address.city,
            state: address.state.toUpperCase(),
            cep: address.cep.replace(/\D/g, ''),
          },
        },
        payment: {
          method: paymentMethod,
          ...(paymentMethod === 'credit_card' && {
            card: {
              number: card.number.replace(/\s/g, ''),
              holderName: card.holderName,
              expMonth: parseInt(card.expMonth),
              expYear: parseInt(card.expYear),
              cvv: card.cvv,
              installments: card.installments,
            },
          }),
        },
      };

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Erro ao processar pedido.');
        setLoading(false);
        return;
      }

      setOrderResult(data);
      setStep('confirmacao');
      clearCart();
      toast.success('Pedido realizado com sucesso!');
    } catch {
      setError('Erro de conexao. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Copiar PIX
  const handleCopyPix = () => {
    if (orderResult?.pixQrCode) {
      navigator.clipboard.writeText(orderResult.pixQrCode);
      setPixCopied(true);
      toast.success('Codigo PIX copiado!');
      setTimeout(() => setPixCopied(false), 3000);
    }
  };

  // Loading state
  if (sessionStatus === 'loading' || (items.length === 0 && !orderResult)) {
    return (
      <section className='flex min-h-screen items-center justify-center'>
        <Loader2 size={24} className='animate-spin text-gold-500' />
      </section>
    );
  }

  return (
    <section className='pb-16 pt-24 sm:pb-24 sm:pt-28'>
      <div className='mx-auto max-w-5xl px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className='mb-8'
        >
          <Link
            href='/livros'
            className='group inline-flex items-center gap-2 text-[13px] uppercase tracking-[1.5px] text-gold-600 transition-colors hover:text-gold-500'
          >
            <ArrowLeft
              size={14}
              className='transition-transform group-hover:-translate-x-1'
            />
            Voltar para livros
          </Link>

          <h1 className='mt-4 font-[family-name:var(--font-cormorant)] text-2xl text-cream-100 sm:text-3xl'>
            {step === 'confirmacao' ? 'Pedido realizado' : 'Finalizar compra'}
          </h1>

          {step !== 'confirmacao' && (
            <div className='mt-4 flex items-center gap-3'>
              {(['dados', 'pagamento'] as const).map((s, i) => (
                <div key={s} className='flex items-center gap-3'>
                  <button
                    onClick={() => {
                      if (s === 'dados') setStep('dados');
                    }}
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs transition-colors ${
                      step === s
                        ? 'bg-gold-500 text-navy-950'
                        : i < (['dados', 'pagamento'] as const).indexOf(step)
                          ? 'bg-gold-500/20 text-gold-500'
                          : 'bg-navy-800 text-txt-muted'
                    }`}
                  >
                    {i + 1}
                  </button>
                  <span
                    className={`text-xs uppercase tracking-[1px] ${step === s ? 'text-cream-100' : 'text-txt-muted'}`}
                  >
                    {s === 'dados' ? 'Endereco e Frete' : 'Pagamento'}
                  </span>
                  {i < 1 && <div className='h-px w-8 bg-gold-500/15' />}
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className='mb-6 flex items-start gap-3 border border-red-500/20 bg-red-500/5 px-4 py-3'
          >
            <AlertCircle size={16} className='mt-0.5 shrink-0 text-red-400' />
            <p className='text-sm text-red-300'>{error}</p>
          </motion.div>
        )}

        <div className='grid gap-8 lg:grid-cols-3'>
          <div className='lg:col-span-2'>
            {/* ========== STEP 1: Endereco + Frete ========== */}
            {step === 'dados' && (
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                className='space-y-6'
              >
                <div className='border border-gold-500/10 bg-navy-900/30 p-5 sm:p-6'>
                  <h2 className='mb-4 flex items-center gap-2 text-xs uppercase tracking-[2px] text-gold-500'>
                    <Truck size={14} />
                    Endereco de entrega
                  </h2>
                  <div className='grid gap-4 sm:grid-cols-2'>
                    <div>
                      <label className='mb-1 block text-xs text-txt-muted'>
                        CEP *
                      </label>
                      <input
                        type='text'
                        value={formatCep(address.cep)}
                        onChange={e =>
                          setAddress(prev => ({ ...prev, cep: e.target.value }))
                        }
                        onBlur={handleCepBlur}
                        placeholder='00000-000'
                        maxLength={9}
                        className='w-full border border-gold-500/12 bg-navy-800/30 px-3 py-2.5 text-sm text-cream-100 outline-none placeholder:text-txt-muted/40 focus:border-gold-500/30'
                      />
                    </div>
                    <div>
                      <label className='mb-1 block text-xs text-txt-muted'>
                        Estado *
                      </label>
                      <select
                        value={address.state}
                        onChange={e =>
                          setAddress(prev => ({
                            ...prev,
                            state: e.target.value,
                          }))
                        }
                        className='w-full border border-gold-500/12 bg-navy-800/30 px-3 py-2.5 text-sm text-cream-100 outline-none focus:border-gold-500/30'
                      >
                        <option value=''>Selecione</option>
                        {ESTADOS_BR.map(uf => (
                          <option key={uf} value={uf}>
                            {uf}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className='sm:col-span-2'>
                      <label className='mb-1 block text-xs text-txt-muted'>
                        Rua / Logradouro *
                      </label>
                      <input
                        type='text'
                        value={address.street}
                        onChange={e =>
                          setAddress(prev => ({
                            ...prev,
                            street: e.target.value,
                          }))
                        }
                        className='w-full border border-gold-500/12 bg-navy-800/30 px-3 py-2.5 text-sm text-cream-100 outline-none placeholder:text-txt-muted/40 focus:border-gold-500/30'
                      />
                    </div>
                    <div>
                      <label className='mb-1 block text-xs text-txt-muted'>
                        Numero *
                      </label>
                      <input
                        type='text'
                        value={address.number}
                        onChange={e =>
                          setAddress(prev => ({
                            ...prev,
                            number: e.target.value,
                          }))
                        }
                        className='w-full border border-gold-500/12 bg-navy-800/30 px-3 py-2.5 text-sm text-cream-100 outline-none placeholder:text-txt-muted/40 focus:border-gold-500/30'
                      />
                    </div>
                    <div>
                      <label className='mb-1 block text-xs text-txt-muted'>
                        Complemento
                      </label>
                      <input
                        type='text'
                        value={address.complement}
                        onChange={e =>
                          setAddress(prev => ({
                            ...prev,
                            complement: e.target.value,
                          }))
                        }
                        placeholder='Apto, sala...'
                        className='w-full border border-gold-500/12 bg-navy-800/30 px-3 py-2.5 text-sm text-cream-100 outline-none placeholder:text-txt-muted/40 focus:border-gold-500/30'
                      />
                    </div>
                    <div>
                      <label className='mb-1 block text-xs text-txt-muted'>
                        Bairro *
                      </label>
                      <input
                        type='text'
                        value={address.neighborhood}
                        onChange={e =>
                          setAddress(prev => ({
                            ...prev,
                            neighborhood: e.target.value,
                          }))
                        }
                        className='w-full border border-gold-500/12 bg-navy-800/30 px-3 py-2.5 text-sm text-cream-100 outline-none placeholder:text-txt-muted/40 focus:border-gold-500/30'
                      />
                    </div>
                    <div>
                      <label className='mb-1 block text-xs text-txt-muted'>
                        Cidade *
                      </label>
                      <input
                        type='text'
                        value={address.city}
                        onChange={e =>
                          setAddress(prev => ({
                            ...prev,
                            city: e.target.value,
                          }))
                        }
                        className='w-full border border-gold-500/12 bg-navy-800/30 px-3 py-2.5 text-sm text-cream-100 outline-none placeholder:text-txt-muted/40 focus:border-gold-500/30'
                      />
                    </div>
                  </div>
                </div>

                {/* Frete */}
                <div className='border border-gold-500/10 bg-navy-900/30 p-5 sm:p-6'>
                  <h2 className='mb-4 text-xs uppercase tracking-[2px] text-gold-500'>
                    Metodo de envio
                  </h2>

                  {freteLoading && (
                    <div className='flex items-center gap-2 py-4'>
                      <Loader2
                        size={16}
                        className='animate-spin text-gold-500'
                      />
                      <span className='text-sm text-txt-muted'>
                        Calculando frete...
                      </span>
                    </div>
                  )}

                  {!freteLoading && freteOpcoes.length === 0 && (
                    <p className='py-4 text-sm text-txt-muted'>
                      Preencha o CEP acima para calcular o frete.
                    </p>
                  )}

                  {!freteLoading && freteOpcoes.length > 0 && (
                    <>
                      {freteRegiao && (
                        <p className='mb-3 text-xs text-txt-muted'>
                          Regiao: {freteRegiao}
                        </p>
                      )}
                      <div className='space-y-2'>
                        {freteOpcoes.map(opt => (
                          <button
                            key={opt.method}
                            onClick={() => setShippingMethod(opt.method)}
                            className={`flex w-full items-center justify-between border px-4 py-3 text-left transition-colors ${
                              shippingMethod === opt.method
                                ? 'border-gold-500/40 bg-gold-500/5'
                                : 'border-gold-500/10 hover:border-gold-500/20'
                            }`}
                          >
                            <div>
                              <span className='text-sm text-cream-100'>
                                {opt.method}
                              </span>
                              <span className='ml-2 text-xs text-txt-muted'>
                                {opt.days}
                              </span>
                            </div>
                            <span className='text-sm text-gold-500'>
                              R$ {formatCurrency(opt.price)}
                            </span>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <button
                  onClick={() => {
                    if (validateDados()) setStep('pagamento');
                  }}
                  className='w-full bg-gold-500 py-3.5 text-[13px] font-medium uppercase tracking-[2px] text-navy-950 transition-colors hover:bg-gold-400'
                >
                  Continuar para pagamento
                </button>
              </motion.div>
            )}

            {/* ========== STEP 2: Pagamento ========== */}
            {step === 'pagamento' && (
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                className='space-y-6'
              >
                <div className='border border-gold-500/10 bg-navy-900/30 p-5 sm:p-6'>
                  <h2 className='mb-4 flex items-center gap-2 text-xs uppercase tracking-[2px] text-gold-500'>
                    <Lock size={14} />
                    Forma de pagamento
                  </h2>

                  <div className='mb-6 grid grid-cols-3 gap-2'>
                    {[
                      {
                        value: 'credit_card' as const,
                        label: 'Cartao',
                        icon: CreditCard,
                      },
                      { value: 'pix' as const, label: 'PIX', icon: QrCode },
                      {
                        value: 'boleto' as const,
                        label: 'Boleto',
                        icon: FileText,
                      },
                    ].map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        onClick={() => setPaymentMethod(value)}
                        className={`flex flex-col items-center gap-2 border py-3 text-center transition-colors ${
                          paymentMethod === value
                            ? 'border-gold-500/40 bg-gold-500/5'
                            : 'border-gold-500/10 hover:border-gold-500/20'
                        }`}
                      >
                        <Icon
                          size={20}
                          strokeWidth={1.5}
                          className={
                            paymentMethod === value
                              ? 'text-gold-500'
                              : 'text-txt-muted'
                          }
                        />
                        <span
                          className={`text-xs uppercase tracking-[1px] ${paymentMethod === value ? 'text-cream-100' : 'text-txt-muted'}`}
                        >
                          {label}
                        </span>
                      </button>
                    ))}
                  </div>

                  {paymentMethod === 'credit_card' && (
                    <div className='space-y-4'>
                      <div>
                        <label className='mb-1 block text-xs text-txt-muted'>
                          Numero do cartao *
                        </label>
                        <input
                          type='text'
                          value={formatCardNumber(card.number)}
                          onChange={e =>
                            setCard(prev => ({
                              ...prev,
                              number: e.target.value,
                            }))
                          }
                          placeholder='0000 0000 0000 0000'
                          maxLength={19}
                          className='w-full border border-gold-500/12 bg-navy-800/30 px-3 py-2.5 text-sm text-cream-100 outline-none placeholder:text-txt-muted/40 focus:border-gold-500/30'
                        />
                      </div>
                      <div>
                        <label className='mb-1 block text-xs text-txt-muted'>
                          Nome no cartao *
                        </label>
                        <input
                          type='text'
                          value={card.holderName}
                          onChange={e =>
                            setCard(prev => ({
                              ...prev,
                              holderName: e.target.value.toUpperCase(),
                            }))
                          }
                          placeholder='NOME COMO NO CARTAO'
                          className='w-full border border-gold-500/12 bg-navy-800/30 px-3 py-2.5 text-sm text-cream-100 outline-none placeholder:text-txt-muted/40 focus:border-gold-500/30'
                        />
                      </div>
                      <div className='grid grid-cols-3 gap-3'>
                        <div>
                          <label className='mb-1 block text-xs text-txt-muted'>
                            Mes *
                          </label>
                          <select
                            value={card.expMonth}
                            onChange={e =>
                              setCard(prev => ({
                                ...prev,
                                expMonth: e.target.value,
                              }))
                            }
                            className='w-full border border-gold-500/12 bg-navy-800/30 px-3 py-2.5 text-sm text-cream-100 outline-none focus:border-gold-500/30'
                          >
                            <option value=''>MM</option>
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(
                              m => (
                                <option key={m} value={m}>
                                  {String(m).padStart(2, '0')}
                                </option>
                              ),
                            )}
                          </select>
                        </div>
                        <div>
                          <label className='mb-1 block text-xs text-txt-muted'>
                            Ano *
                          </label>
                          <select
                            value={card.expYear}
                            onChange={e =>
                              setCard(prev => ({
                                ...prev,
                                expYear: e.target.value,
                              }))
                            }
                            className='w-full border border-gold-500/12 bg-navy-800/30 px-3 py-2.5 text-sm text-cream-100 outline-none focus:border-gold-500/30'
                          >
                            <option value=''>AA</option>
                            {Array.from({ length: 12 }, (_, i) => {
                              const y = new Date().getFullYear() + i;
                              return (
                                <option key={y} value={y % 100}>
                                  {y}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                        <div>
                          <label className='mb-1 block text-xs text-txt-muted'>
                            CVV *
                          </label>
                          <input
                            type='text'
                            value={card.cvv}
                            onChange={e =>
                              setCard(prev => ({
                                ...prev,
                                cvv: e.target.value
                                  .replace(/\D/g, '')
                                  .slice(0, 4),
                              }))
                            }
                            placeholder='000'
                            maxLength={4}
                            className='w-full border border-gold-500/12 bg-navy-800/30 px-3 py-2.5 text-sm text-cream-100 outline-none placeholder:text-txt-muted/40 focus:border-gold-500/30'
                          />
                        </div>
                      </div>
                      <div>
                        <label className='mb-1 block text-xs text-txt-muted'>
                          Parcelas
                        </label>
                        <select
                          value={card.installments}
                          onChange={e =>
                            setCard(prev => ({
                              ...prev,
                              installments: parseInt(e.target.value),
                            }))
                          }
                          className='w-full border border-gold-500/12 bg-navy-800/30 px-3 py-2.5 text-sm text-cream-100 outline-none focus:border-gold-500/30'
                        >
                          {installmentOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'pix' && (
                    <div className='rounded border border-gold-500/8 bg-navy-800/20 p-4'>
                      <div className='flex items-start gap-3'>
                        <QrCode size={20} className='mt-0.5 text-gold-600' />
                        <div>
                          <p className='text-sm text-cream-100'>
                            Pagamento via PIX
                          </p>
                          <p className='mt-1 text-xs text-txt-muted'>
                            Apos confirmar, voce recebera o QR Code e o codigo
                            PIX para copiar e colar. Validade: 1 hora.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'boleto' && (
                    <div className='rounded border border-gold-500/8 bg-navy-800/20 p-4'>
                      <div className='flex items-start gap-3'>
                        <FileText size={20} className='mt-0.5 text-gold-600' />
                        <div>
                          <p className='text-sm text-cream-100'>
                            Pagamento via Boleto Bancario
                          </p>
                          <p className='mt-1 text-xs text-txt-muted'>
                            Vencimento em 3 dias uteis. Pedido processado apos
                            compensacao (1-2 dias uteis).
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className='flex gap-3'>
                  <button
                    onClick={() => setStep('dados')}
                    className='border border-gold-500/30 px-6 py-3.5 text-[13px] uppercase tracking-[2px] text-gold-500 transition-colors hover:bg-gold-500/5'
                  >
                    Voltar
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className='flex flex-1 items-center justify-center gap-2 bg-gold-500 py-3.5 text-[13px] font-medium uppercase tracking-[2px] text-navy-950 transition-colors hover:bg-gold-400 disabled:opacity-50'
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className='animate-spin' />
                        Processando...
                      </>
                    ) : (
                      <>
                        <Lock size={14} />
                        Confirmar pedido — R$ {formatCurrency(total)}
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* ========== STEP 3: Confirmacao ========== */}
            {step === 'confirmacao' && orderResult && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className='space-y-6'
              >
                <div className='border border-gold-500/10 bg-navy-900/30 p-6 text-center sm:p-8'>
                  <div className='mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold-500/10'>
                    <Check
                      size={28}
                      strokeWidth={1.5}
                      className='text-gold-500'
                    />
                  </div>
                  <h2 className='font-[family-name:var(--font-cormorant)] text-2xl text-cream-100'>
                    {orderResult.paymentMethod === 'credit_card'
                      ? 'Pagamento confirmado!'
                      : 'Pedido realizado!'}
                  </h2>
                  <p className='mt-2 text-sm text-txt-muted'>
                    Codigo do pedido:{' '}
                    <span className='font-mono text-gold-500'>
                      {orderResult.orderCode}
                    </span>
                  </p>

                  {orderResult.paymentMethod === 'pix' &&
                    orderResult.pixQrCode && (
                      <div className='mt-6 space-y-4'>
                        {orderResult.pixQrCodeUrl && (
                          <div className='mx-auto w-fit border border-gold-500/10 bg-white p-3'>
                            <img
                              src={orderResult.pixQrCodeUrl}
                              alt='QR Code PIX'
                              width={200}
                              height={200}
                            />
                          </div>
                        )}
                        <div>
                          <p className='mb-2 text-xs uppercase tracking-[1px] text-gold-600'>
                            Ou copie o codigo PIX
                          </p>
                          <div className='mx-auto flex max-w-md items-center gap-2'>
                            <input
                              type='text'
                              readOnly
                              value={orderResult.pixQrCode}
                              className='flex-1 truncate border border-gold-500/12 bg-navy-800/30 px-3 py-2 text-xs text-cream-100 outline-none'
                            />
                            <button
                              onClick={handleCopyPix}
                              className='flex items-center gap-1.5 border border-gold-500/30 px-3 py-2 text-xs text-gold-500 transition-colors hover:bg-gold-500/5'
                            >
                              <Copy size={14} />
                              {pixCopied ? 'Copiado!' : 'Copiar'}
                            </button>
                          </div>
                          {orderResult.pixExpiresAt && (
                            <p className='mt-2 text-xs text-txt-muted'>
                              Valido ate:{' '}
                              {new Date(
                                orderResult.pixExpiresAt,
                              ).toLocaleString('pt-BR')}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                  {orderResult.paymentMethod === 'boleto' &&
                    orderResult.boletoUrl && (
                      <div className='mt-6'>
                        <a
                          href={orderResult.boletoUrl}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='inline-flex items-center gap-2 bg-gold-500 px-8 py-3 text-[13px] font-medium uppercase tracking-[2px] text-navy-950 transition-colors hover:bg-gold-400'
                        >
                          <FileText size={16} />
                          Visualizar boleto
                        </a>
                        {orderResult.boletoBarcode && (
                          <p className='mt-3 font-mono text-xs text-txt-muted'>
                            {orderResult.boletoBarcode}
                          </p>
                        )}
                        {orderResult.boletoDueDate && (
                          <p className='mt-2 text-xs text-txt-muted'>
                            Vencimento:{' '}
                            {new Date(
                              orderResult.boletoDueDate,
                            ).toLocaleDateString('pt-BR')}
                          </p>
                        )}
                      </div>
                    )}

                  {orderResult.paymentMethod === 'credit_card' && (
                    <p className='mt-4 text-sm text-txt-muted'>
                      Voce recebera um email de confirmacao em breve.
                    </p>
                  )}
                </div>

                <div className='flex flex-col items-center gap-3 sm:flex-row sm:justify-center'>
                  <Link
                    href={`/pedido/${orderResult.orderCode}`}
                    className='inline-flex items-center gap-2 border border-gold-500/30 px-6 py-3 text-[13px] uppercase tracking-[2px] text-gold-500 transition-colors hover:bg-gold-500/5'
                  >
                    Acompanhar pedido
                  </Link>
                  <Link
                    href='/livros'
                    className='text-[13px] text-txt-muted transition-colors hover:text-cream-100'
                  >
                    Continuar comprando
                  </Link>
                </div>
              </motion.div>
            )}
          </div>

          {/* ========== SIDEBAR: Resumo ========== */}
          {step !== 'confirmacao' && (
            <div className='lg:col-span-1'>
              <div className='sticky top-28 border border-gold-500/10 bg-navy-900/30 p-5'>
                <h3 className='mb-4 flex items-center gap-2 text-xs uppercase tracking-[2px] text-gold-500'>
                  <ShoppingBag size={14} />
                  Resumo
                </h3>
                <div className='space-y-3'>
                  {items.map(item => (
                    <div
                      key={item.livro.slug}
                      className='flex justify-between gap-2'
                    >
                      <div className='min-w-0 flex-1'>
                        <p className='truncate text-sm text-cream-100'>
                          {item.livro.title}
                        </p>
                        <p className='text-xs text-txt-muted'>
                          Qtd: {item.quantity}
                        </p>
                      </div>
                      <p className='shrink-0 text-sm text-cream-100'>
                        R$ {formatCurrency(item.livro.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className='mt-4 space-y-2 border-t border-gold-500/8 pt-3'>
                  <div className='flex justify-between text-[13px]'>
                    <span className='text-txt-muted'>Subtotal</span>
                    <span className='text-cream-100'>
                      R$ {formatCurrency(totalPrice)}
                    </span>
                  </div>
                  {fretePrice > 0 && (
                    <div className='flex justify-between text-[13px]'>
                      <span className='text-txt-muted'>
                        Frete ({shippingMethod})
                      </span>
                      <span className='text-cream-100'>
                        R$ {formatCurrency(fretePrice)}
                      </span>
                    </div>
                  )}
                  {freteDays && (
                    <div className='flex justify-between text-[13px] text-txt-muted'>
                      <span>Prazo</span>
                      <span>{freteDays}</span>
                    </div>
                  )}
                  <div className='flex justify-between border-t border-gold-500/8 pt-2'>
                    <span className='text-sm text-cream-100'>Total</span>
                    <span className='font-[family-name:var(--font-cormorant)] text-xl text-gold-500'>
                      R$ {formatCurrency(total)}
                    </span>
                  </div>
                </div>
                <div className='mt-4 flex items-center gap-2 text-[11px] text-txt-muted'>
                  <Lock size={12} className='text-gold-600' />
                  Pagamento seguro via Pagar.me
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
