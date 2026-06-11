'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  ArrowLeft,
  Truck,
  Lock,
  ShoppingBag,
  Loader2,
  AlertCircle,
  User,
  CreditCard,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart, itemUnitPrice } from '@/components/CartProvider';
import { CheckoutLoginGate } from '@/components/CheckoutLoginGate';
import toast from 'react-hot-toast';

type ShippingMethod = 'PAC' | 'SEDEX';

interface FreteOpcao {
  method: ShippingMethod;
  price: number;
  days: string;
}

interface PersonalForm {
  name: string;
  email: string;
  cpf: string;
  phone: string;
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

function formatCurrency(value: number): string {
  return value.toFixed(2).replace('.', ',');
}
function formatCep(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length > 5) return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  return digits;
}
function formatCpf(value: string): string {
  const d = value.replace(/\D/g, '').slice(0, 11);
  return d
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}
function formatPhone(value: string): string {
  const d = value.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 10) {
    return d.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d)/, '$1-$2');
  }
  return d.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2');
}

function formatTipo(format: string): string | null {
  if (format === 'ebook') return 'eBook';
  if (format === 'course') return 'Curso online';
  return null;
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

export function CheckoutForm() {
  const router = useRouter();
  const {
    data: session,
    status: sessionStatus,
    update: updateSession,
  } = useSession();
  const { items, totalPrice, totalWeight } = useCart();
  const hasPhysical = items.some(i => i.format === 'physical');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [gateOpen, setGateOpen] = useState(false);

  const [personal, setPersonal] = useState<PersonalForm>({
    name: '',
    email: '',
    cpf: '',
    phone: '',
  });

  const [address, setAddress] = useState<AddressForm>({
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    cep: '',
  });

  const [freteOpcoes, setFreteOpcoes] = useState<FreteOpcao[]>([]);
  const [freteRegiao, setFreteRegiao] = useState('');
  const [freteLoading, setFreteLoading] = useState(false);
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>('PAC');

  // Prefill a partir da sessão + perfil
  useEffect(() => {
    if (session?.user?.role === 'customer') {
      setPersonal(prev => ({
        name: prev.name || session.user.name || '',
        email: prev.email || session.user.email || '',
        cpf: prev.cpf || (session.user as { cpf?: string }).cpf || '',
        phone: prev.phone || (session.user as { phone?: string }).phone || '',
      }));

      fetch('/api/conta/perfil')
        .then(res => res.json())
        .then(data => {
          if (data.addresses && data.addresses.length > 0) {
            const def =
              data.addresses.find((a: { isDefault: boolean }) => a.isDefault) ||
              data.addresses[0];
            setAddress(prev => ({
              street: prev.street || def.street || '',
              number: prev.number || def.number || '',
              complement: prev.complement || def.complement || '',
              neighborhood: prev.neighborhood || def.neighborhood || '',
              city: prev.city || def.city || '',
              state: prev.state || def.state || '',
              cep: prev.cep || def.cep || '',
            }));
          }
        })
        .catch(() => {});
    }
  }, [session]);

  // Toast de pagamento cancelado (volta do Stripe com ?canceled=1)
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      new URLSearchParams(window.location.search).get('canceled')
    ) {
      toast.error('Pagamento cancelado. Você pode tentar novamente.');
    }
  }, []);

  // Carrinho vazio -> volta para livros
  useEffect(() => {
    if (items.length === 0) {
      router.push('/livros');
    }
  }, [items, router]);

  const fretePrice =
    freteOpcoes.find(f => f.method === shippingMethod)?.price || 0;
  const freteDays =
    freteOpcoes.find(f => f.method === shippingMethod)?.days || '';
  const total = totalPrice + (hasPhysical ? fretePrice : 0);

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
    } catch {}

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
    } catch {}
    setFreteLoading(false);
  }, [address.cep, totalWeight]);

  const validate = (): boolean => {
    if (!personal.name || personal.name.trim().length < 2) {
      setError('Nome completo é obrigatório.');
      return false;
    }
    if (!personal.email || !/^\S+@\S+\.\S+$/.test(personal.email)) {
      setError('Email inválido.');
      return false;
    }
    if (!personal.cpf || personal.cpf.replace(/\D/g, '').length !== 11) {
      setError('CPF inválido.');
      return false;
    }
    if (!personal.phone || personal.phone.replace(/\D/g, '').length < 10) {
      setError('Telefone inválido.');
      return false;
    }
    if (hasPhysical) {
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
        setError('Preencha todos os campos de endereço obrigatórios.');
        return false;
      }
      if (!ESTADOS_BR.includes(address.state.toUpperCase())) {
        setError('Estado inválido.');
        return false;
      }
      if (freteOpcoes.length === 0) {
        setError('Calcule o frete: preencha o CEP e clique fora do campo.');
        return false;
      }
    }
    setError('');
    return true;
  };

  const submitOrder = async () => {
    setLoading(true);
    setError('');

    try {
      const payload: {
        items: Array<{ slug: string; quantity: number; format: string }>;
        shipping?: {
          method: ShippingMethod;
          address: AddressForm & { state: string; cep: string };
        };
      } = {
        items: items.map(i => ({
          slug: i.livro.slug,
          quantity: i.quantity,
          format: i.format,
        })),
      };

      if (hasPhysical) {
        payload.shipping = {
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
        };
      }

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

      if (data.url) {
        // Redireciona para o checkout do Stripe (mantém loading)
        window.location.href = data.url;
        return;
      }

      setError('Não foi possível iniciar o pagamento. Tente novamente.');
      setLoading(false);
    } catch {
      setError('Erro de conexão. Tente novamente.');
      setLoading(false);
    }
  };

  const handleAuthenticated = async () => {
    setGateOpen(false);
    await updateSession();
    setTimeout(() => {
      submitOrder();
    }, 300);
  };

  const handlePay = () => {
    if (!validate()) return;
    if (
      sessionStatus !== 'authenticated' ||
      session?.user?.role !== 'customer'
    ) {
      setGateOpen(true);
      return;
    }
    submitOrder();
  };

  if (items.length === 0) {
    return (
      <section className='flex min-h-screen items-center justify-center'>
        <Loader2 size={24} className='animate-spin text-gold-500' />
      </section>
    );
  }

  const inputCls =
    'w-full border border-gold-500/12 bg-navy-800/30 px-3 py-2.5 text-sm text-cream-100 outline-none focus:border-gold-500/30';

  return (
    <section className='pb-16 pt-24 sm:pb-24 sm:pt-28'>
      <div className='mx-auto max-w-5xl px-4 sm:px-6 lg:px-8'>
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
            Continuar comprando
          </Link>
          <h1 className='mt-4 font-[family-name:var(--font-cormorant)] text-2xl text-cream-100 sm:text-3xl'>
            Finalizar compra
          </h1>
        </motion.div>

        {error ? (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className='mb-6 flex items-start gap-3 border border-red-500/20 bg-red-500/5 px-4 py-3'
          >
            <AlertCircle size={16} className='mt-0.5 shrink-0 text-red-400' />
            <p className='text-sm text-red-300'>{error}</p>
          </motion.div>
        ) : null}

        <div className='grid gap-8 lg:grid-cols-3'>
          <div className='space-y-6 lg:col-span-2'>
            {/* Dados pessoais */}
            <div className='border border-gold-500/10 bg-navy-900/30 p-5 sm:p-6'>
              <h2 className='mb-4 flex items-center gap-2 text-xs uppercase tracking-[2px] text-gold-500'>
                <User size={14} />
                Seus dados
              </h2>
              <div className='grid gap-4 sm:grid-cols-2'>
                <div className='sm:col-span-2'>
                  <label className='mb-1 block text-xs text-txt-muted'>
                    Nome completo *
                  </label>
                  <input
                    type='text'
                    value={personal.name}
                    onChange={e =>
                      setPersonal(p => ({ ...p, name: e.target.value }))
                    }
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className='mb-1 block text-xs text-txt-muted'>
                    Email *
                  </label>
                  <input
                    type='email'
                    value={personal.email}
                    onChange={e =>
                      setPersonal(p => ({ ...p, email: e.target.value }))
                    }
                    placeholder='seu@email.com'
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className='mb-1 block text-xs text-txt-muted'>
                    Telefone *
                  </label>
                  <input
                    type='text'
                    value={formatPhone(personal.phone)}
                    onChange={e =>
                      setPersonal(p => ({ ...p, phone: e.target.value }))
                    }
                    placeholder='(00) 00000-0000'
                    className={inputCls}
                  />
                </div>
                <div className='sm:col-span-2'>
                  <label className='mb-1 block text-xs text-txt-muted'>
                    CPF *
                  </label>
                  <input
                    type='text'
                    value={formatCpf(personal.cpf)}
                    onChange={e =>
                      setPersonal(p => ({ ...p, cpf: e.target.value }))
                    }
                    placeholder='000.000.000-00'
                    maxLength={14}
                    className={inputCls}
                  />
                </div>
              </div>
            </div>

            {/* Endereço + Frete (só com item físico) */}
            {hasPhysical ? (
              <>
                <div className='border border-gold-500/10 bg-navy-900/30 p-5 sm:p-6'>
                  <h2 className='mb-4 flex items-center gap-2 text-xs uppercase tracking-[2px] text-gold-500'>
                    <Truck size={14} />
                    Endereço de entrega
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
                        className={inputCls}
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
                        className={inputCls}
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
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className='mb-1 block text-xs text-txt-muted'>
                        Número *
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
                        className={inputCls}
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
                        className={inputCls}
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
                        className={inputCls}
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
                        className={inputCls}
                      />
                    </div>
                  </div>
                </div>

                <div className='border border-gold-500/10 bg-navy-900/30 p-5 sm:p-6'>
                  <h2 className='mb-4 text-xs uppercase tracking-[2px] text-gold-500'>
                    Método de envio
                  </h2>

                  {freteLoading ? (
                    <div className='flex items-center gap-2 py-4'>
                      <Loader2
                        size={16}
                        className='animate-spin text-gold-500'
                      />
                      <span className='text-sm text-txt-muted'>
                        Calculando frete...
                      </span>
                    </div>
                  ) : null}

                  {!freteLoading && freteOpcoes.length === 0 ? (
                    <p className='py-4 text-sm text-txt-muted'>
                      Preencha o CEP acima para calcular o frete.
                    </p>
                  ) : null}

                  {!freteLoading && freteOpcoes.length > 0 ? (
                    <div>
                      {freteRegiao ? (
                        <p className='mb-3 text-xs text-txt-muted'>
                          Região: {freteRegiao}
                        </p>
                      ) : null}
                      <div className='space-y-2'>
                        {freteOpcoes.map(opt => {
                          const selected = shippingMethod === opt.method;
                          const btnClass = selected
                            ? 'border-gold-500/40 bg-gold-500/5'
                            : 'border-gold-500/10 hover:border-gold-500/20';
                          return (
                            <button
                              key={opt.method}
                              onClick={() => setShippingMethod(opt.method)}
                              className={`flex w-full items-center justify-between border px-4 py-3 text-left transition-colors ${btnClass}`}
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
                          );
                        })}
                      </div>
                    </div>
                  ) : null}
                </div>
              </>
            ) : (
              <div className='border border-gold-500/10 bg-navy-900/30 p-5 sm:p-6'>
                <p className='text-sm text-txt-muted'>
                  Itens digitais — sem entrega. O acesso é liberado na sua conta
                  assim que o pagamento for confirmado.
                </p>
              </div>
            )}

            <button
              onClick={handlePay}
              disabled={loading}
              className='flex w-full items-center justify-center gap-2 bg-gold-500 py-3.5 text-[13px] font-medium uppercase tracking-[2px] text-navy-950 transition-colors hover:bg-gold-400 disabled:opacity-50'
            >
              {loading ? (
                <span className='flex items-center gap-2'>
                  <Loader2 size={16} className='animate-spin' />
                  Redirecionando...
                </span>
              ) : (
                <span className='flex items-center gap-2'>
                  <CreditCard size={14} />
                  Pagar com cartão — R$ {formatCurrency(total)}
                </span>
              )}
            </button>
          </div>

          {/* Resumo */}
          <div className='lg:col-span-1'>
            <div className='sticky top-28 border border-gold-500/10 bg-navy-900/30 p-5'>
              <h3 className='mb-4 flex items-center gap-2 text-xs uppercase tracking-[2px] text-gold-500'>
                <ShoppingBag size={14} />
                Resumo
              </h3>
              <div className='space-y-3'>
                {items.map(item => {
                  const tipo = formatTipo(item.format);
                  return (
                    <div key={item.id} className='flex justify-between gap-2'>
                      <div className='min-w-0 flex-1'>
                        <p className='truncate text-sm text-cream-100'>
                          {item.livro.title}
                        </p>
                        <p className='text-xs text-txt-muted'>
                          {tipo ? `${tipo}` : `Qtd: ${item.quantity}`}
                        </p>
                      </div>
                      <p className='shrink-0 text-sm text-cream-100'>
                        R$ {formatCurrency(itemUnitPrice(item) * item.quantity)}
                      </p>
                    </div>
                  );
                })}
              </div>
              <div className='mt-4 space-y-2 border-t border-gold-500/8 pt-3'>
                <div className='flex justify-between text-[13px]'>
                  <span className='text-txt-muted'>Subtotal</span>
                  <span className='text-cream-100'>
                    R$ {formatCurrency(totalPrice)}
                  </span>
                </div>
                {hasPhysical && fretePrice > 0 ? (
                  <div className='flex justify-between text-[13px]'>
                    <span className='text-txt-muted'>
                      Frete ({shippingMethod})
                    </span>
                    <span className='text-cream-100'>
                      R$ {formatCurrency(fretePrice)}
                    </span>
                  </div>
                ) : null}
                {hasPhysical && freteDays ? (
                  <div className='flex justify-between text-[13px] text-txt-muted'>
                    <span>Prazo</span>
                    <span>{freteDays}</span>
                  </div>
                ) : null}
                <div className='flex justify-between border-t border-gold-500/8 pt-2'>
                  <span className='text-sm text-cream-100'>Total</span>
                  <span className='font-[family-name:var(--font-cormorant)] text-xl text-gold-500'>
                    R$ {formatCurrency(total)}
                  </span>
                </div>
              </div>
              <div className='mt-4 flex items-center gap-2 text-[11px] text-txt-muted'>
                <Lock size={12} className='text-gold-600' />
                Pagamento seguro via Stripe
              </div>
            </div>
          </div>
        </div>
      </div>

      <CheckoutLoginGate
        open={gateOpen}
        onClose={() => setGateOpen(false)}
        prefilledEmail={personal.email}
        prefilledName={personal.name}
        prefilledCpf={personal.cpf}
        prefilledPhone={personal.phone}
        onAuthenticated={handleAuthenticated}
      />
    </section>
  );
}
