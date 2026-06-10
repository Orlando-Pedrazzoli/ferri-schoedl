'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Package,
  CreditCard,
  Truck,
  Check,
  CheckCircle2,
  Clock,
  X,
  AlertCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { CreatePasswordBanner } from '@/components/CreatePasswordBanner';

interface OrderItem {
  type: string;
  title: string;
  quantity: number;
  price: number;
  slug: string;
}

interface OrderShipping {
  method: string;
  price: number;
  estimatedDays: string;
  trackingCode: string;
  address: {
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    cep: string;
  };
}

interface OrderData {
  orderCode: string;
  status: string;
  items: OrderItem[];
  subtotal: number;
  shipping?: OrderShipping | null;
  total: number;
  payment: {
    method: string;
    status: string;
    cardBrand: string;
    cardLastDigits: string;
    paidAt: string;
  };
  createdAt: string;
}

interface Props {
  order: OrderData;
  showPasswordSetup: boolean;
  setupToken?: string;
}

const REDIRECT_SECONDS = 8;

function formatCurrency(value: number): string {
  return value.toFixed(2).replace('.', ',');
}

type StatusInfo = { label: string; color: string; icon: typeof Check };

const STATUS_MAP: Record<string, StatusInfo> = {
  pendente: {
    label: 'Aguardando pagamento',
    color: 'text-yellow-400',
    icon: Clock,
  },
  pago: { label: 'Pago', color: 'text-green-400', icon: Check },
  preparando: { label: 'Preparando', color: 'text-blue-400', icon: Package },
  enviado: { label: 'Enviado', color: 'text-blue-400', icon: Truck },
  entregue: { label: 'Entregue', color: 'text-green-400', icon: Check },
  cancelado: { label: 'Cancelado', color: 'text-red-400', icon: X },
  falhou: { label: 'Falhou', color: 'text-red-400', icon: AlertCircle },
};

function itemHref(item: OrderItem): string {
  return item.type === 'course'
    ? `/cursos/${item.slug}`
    : `/livros/${item.slug}`;
}

function itemTipo(type: string): string | null {
  if (type === 'ebook') return 'eBook';
  if (type === 'course') return 'Curso online';
  return null;
}

export function OrderStatusClient({
  order,
  showPasswordSetup,
  setupToken,
}: Props) {
  const [bannerVisible, setBannerVisible] = useState(showPasswordSetup);

  const statusInfo = STATUS_MAP[order.status] || STATUS_MAP.pendente;
  const StatusIcon = statusInfo.icon;
  const hasShipping = !!order.shipping;
  const isPaid = order.status === 'pago';

  // --- Composição do pedido: define o destino certo para o cliente ---
  const hasCourse = order.items.some(i => i.type === 'course');
  const hasEbook = order.items.some(i => i.type === 'ebook');
  const hasPhysical = order.items.some(i => i.type === 'physical');
  const hasDigital = hasCourse || hasEbook;

  const courseItems = order.items.filter(i => i.type === 'course');
  const singleCourseSlug =
    courseItems.length === 1 ? courseItems[0].slug : null;

  // CTA principal + destino do redirect, conforme o que foi comprado.
  // - Curso único  -> direto ao player do curso
  // - Só cursos    -> lista de cursos
  // - Só eBooks    -> lista de eBooks
  // - Só físico    -> acompanhar pedido
  // - Misto        -> área do cliente
  const primaryCta: { label: string; href: string } = (() => {
    if (hasDigital && !hasPhysical) {
      if (hasCourse && !hasEbook) {
        return singleCourseSlug
          ? {
              label: 'Começar o curso agora',
              href: `/conta/cursos/${singleCourseSlug}`,
            }
          : { label: 'Acessar meus cursos', href: '/conta/cursos' };
      }
      if (hasEbook && !hasCourse) {
        return { label: 'Acessar meus eBooks', href: '/conta/ebooks' };
      }
      return { label: 'Acessar meus produtos', href: '/conta' };
    }
    if (hasPhysical && !hasDigital) {
      return { label: 'Acompanhar meu pedido', href: '/conta/pedidos' };
    }
    return { label: 'Ir para a minha área', href: '/conta' };
  })();

  const redirectHref = primaryCta.href;

  // Frase de agradecimento conforme a natureza dos itens.
  const thankYouDetail = (() => {
    if (hasDigital && !hasPhysical) {
      return 'O seu acesso já está liberado na sua área de cliente.';
    }
    if (hasPhysical && !hasDigital) {
      return 'Pode acompanhar o status da entrega a qualquer momento na sua área de cliente.';
    }
    return 'O acesso aos itens digitais já está liberado e o item físico será preparado para envio.';
  })();

  // Redirecionamento automático para a área do cliente (só quando pago e
  // sem o banner de criação de senha aberto).
  // IMPORTANTE: usamos window.location.href (navegação completa) em vez de
  // router.push para rotas protegidas pelo middleware. A navegação soft do
  // router corre em paralelo com a checagem de sessão no middleware e, ao
  // voltar do Stripe, por vezes o token ainda não é reconhecido → bounce
  // para /conta/login. A navegação completa faz um pedido normal com o
  // cookie e o middleware lê a sessão corretamente.
  const [autoRedirect, setAutoRedirect] = useState(true);
  const [seconds, setSeconds] = useState(REDIRECT_SECONDS);
  const countdownActive = isPaid && !bannerVisible && autoRedirect;

  useEffect(() => {
    if (!countdownActive) return;
    if (seconds <= 0) {
      window.location.href = redirectHref;
      return;
    }
    const t = setTimeout(() => setSeconds(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [countdownActive, seconds, redirectHref]);

  return (
    <section className='pb-16 pt-24 sm:pb-24 sm:pt-28'>
      <div className='mx-auto max-w-3xl px-4 sm:px-6 lg:px-8'>
        {bannerVisible ? (
          <CreatePasswordBanner
            orderCode={order.orderCode}
            setupToken={setupToken}
            onDismiss={() => setBannerVisible(false)}
            onSuccess={() => {
              setBannerVisible(false);
              window.location.href = '/conta/pedidos';
            }}
          />
        ) : null}

        {/* Agradecimento + redirect (pedido pago) */}
        {isPaid ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className='mb-8 border border-green-500/30 bg-green-500/5 p-6 text-center'
          >
            <div className='mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-green-500/15'>
              <CheckCircle2 size={30} className='text-green-400' />
            </div>
            <h2 className='font-[family-name:var(--font-cormorant)] text-2xl text-cream-100'>
              Compra aprovada!
            </h2>
            <p className='mx-auto mt-2 max-w-md text-sm text-txt-muted'>
              Obrigado pela sua compra. Você receberá um email com os detalhes
              do seu pedido. {thankYouDetail}
            </p>

            {countdownActive ? (
              <p className='mt-3 text-xs text-txt-muted'>
                Redirecionando em{' '}
                <span className='text-gold-500'>{seconds}s</span>…
              </p>
            ) : null}

            <div className='mt-5 flex flex-wrap items-center justify-center gap-3'>
              <button
                type='button'
                onClick={() => {
                  window.location.href = redirectHref;
                }}
                className='bg-gold-500 px-5 py-2.5 text-sm font-medium text-navy-950 transition-colors hover:bg-gold-400'
              >
                {primaryCta.label}
              </button>
              {countdownActive ? (
                <button
                  type='button'
                  onClick={() => setAutoRedirect(false)}
                  className='border border-gold-500/20 px-5 py-2.5 text-sm text-cream-200 transition-colors hover:border-gold-500/40 hover:text-cream-100'
                >
                  Continuar nesta página
                </button>
              ) : null}
            </div>
          </motion.div>
        ) : null}

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

          <div className='mt-6 flex flex-wrap items-start justify-between gap-4'>
            <div>
              <h1 className='font-[family-name:var(--font-cormorant)] text-2xl text-cream-100 sm:text-3xl'>
                Pedido {order.orderCode}
              </h1>
              <p className='mt-1 text-sm text-txt-muted'>
                Realizado em{' '}
                {new Date(order.createdAt).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>

            <div
              className={`inline-flex items-center gap-2 border border-current/20 px-3 py-1.5 ${statusInfo.color}`}
            >
              <StatusIcon size={14} />
              <span className='text-xs font-medium uppercase tracking-[1.5px]'>
                {statusInfo.label}
              </span>
            </div>
          </div>
        </motion.div>

        <div className='space-y-6'>
          {/* Itens */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className='border border-gold-500/10 bg-navy-900/30 p-5 sm:p-6'
          >
            <h2 className='mb-4 text-xs uppercase tracking-[2px] text-gold-500'>
              Itens do pedido
            </h2>
            <div className='space-y-3'>
              {order.items.map((item, i) => {
                const tipo = itemTipo(item.type);
                return (
                  <div
                    key={i}
                    className='flex items-center justify-between gap-3 border-b border-gold-500/5 pb-3 last:border-0 last:pb-0'
                  >
                    <div className='min-w-0 flex-1'>
                      <Link
                        href={itemHref(item)}
                        className='text-sm text-cream-100 transition-colors hover:text-gold-400'
                      >
                        {item.title}
                        {tipo ? (
                          <span className='ml-2 text-xs text-gold-600'>
                            ({tipo})
                          </span>
                        ) : null}
                      </Link>
                      <p className='text-xs text-txt-muted'>
                        Qtd: {item.quantity} x R$ {formatCurrency(item.price)}
                      </p>
                    </div>
                    <p className='shrink-0 text-sm text-cream-100'>
                      R$ {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className='mt-4 space-y-2 border-t border-gold-500/8 pt-3'>
              <div className='flex justify-between text-[13px]'>
                <span className='text-txt-muted'>Subtotal</span>
                <span className='text-cream-100'>
                  R$ {formatCurrency(order.subtotal)}
                </span>
              </div>
              {hasShipping && order.shipping ? (
                <div className='flex justify-between text-[13px]'>
                  <span className='text-txt-muted'>
                    Frete ({order.shipping.method})
                  </span>
                  <span className='text-cream-100'>
                    R$ {formatCurrency(order.shipping.price)}
                  </span>
                </div>
              ) : null}
              <div className='flex justify-between border-t border-gold-500/8 pt-2'>
                <span className='text-sm text-cream-100'>Total</span>
                <span className='font-[family-name:var(--font-cormorant)] text-xl text-gold-500'>
                  R$ {formatCurrency(order.total)}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Pagamento */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className='border border-gold-500/10 bg-navy-900/30 p-5 sm:p-6'
          >
            <h2 className='mb-4 text-xs uppercase tracking-[2px] text-gold-500'>
              Pagamento
            </h2>

            <div className='space-y-2 text-sm'>
              <div className='flex items-center gap-2'>
                <CreditCard size={16} className='text-gold-600' />
                <span className='text-cream-100'>Cartão de crédito</span>
              </div>

              {order.payment.cardLastDigits ? (
                <p className='text-txt-muted'>
                  {order.payment.cardBrand
                    ? `${order.payment.cardBrand.charAt(0).toUpperCase() + order.payment.cardBrand.slice(1)} `
                    : ''}
                  **** {order.payment.cardLastDigits}
                </p>
              ) : null}

              {order.payment.paidAt ? (
                <p className='text-xs text-txt-muted'>
                  Pago em{' '}
                  {new Date(order.payment.paidAt).toLocaleString('pt-BR')}
                </p>
              ) : order.payment.status !== 'paid' ? (
                <p className='text-xs text-txt-muted'>
                  Aguardando confirmação do pagamento.
                </p>
              ) : null}
            </div>
          </motion.div>

          {/* Entrega (só para itens físicos) */}
          {hasShipping && order.shipping ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className='border border-gold-500/10 bg-navy-900/30 p-5 sm:p-6'
            >
              <h2 className='mb-4 flex items-center gap-2 text-xs uppercase tracking-[2px] text-gold-500'>
                <Truck size={14} />
                Entrega
              </h2>

              <div className='space-y-2 text-sm'>
                <p className='text-cream-100'>
                  {order.shipping.method} — {order.shipping.estimatedDays}
                </p>
                <p className='text-txt-muted'>
                  {order.shipping.address.street},{' '}
                  {order.shipping.address.number}
                  {order.shipping.address.complement
                    ? ` — ${order.shipping.address.complement}`
                    : ''}
                </p>
                <p className='text-txt-muted'>
                  {order.shipping.address.neighborhood},{' '}
                  {order.shipping.address.city} — {order.shipping.address.state}
                </p>
                <p className='text-txt-muted'>
                  CEP: {order.shipping.address.cep}
                </p>

                {order.shipping.trackingCode ? (
                  <div className='mt-3 border-t border-gold-500/8 pt-3'>
                    <p className='text-xs uppercase tracking-[1px] text-gold-600'>
                      Código de rastreio
                    </p>
                    <p className='mt-1 font-mono text-sm text-cream-100'>
                      {order.shipping.trackingCode}
                    </p>
                  </div>
                ) : null}
              </div>
            </motion.div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
