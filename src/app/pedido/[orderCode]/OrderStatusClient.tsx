'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  Package,
  CreditCard,
  QrCode,
  FileText,
  Truck,
  Check,
  Clock,
  X,
  AlertCircle,
  Copy,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import toast from 'react-hot-toast';

// --- Tipos ---

interface OrderData {
  orderCode: string;
  status: string;
  items: Array<{
    title: string;
    quantity: number;
    price: number;
    slug: string;
  }>;
  subtotal: number;
  shipping: {
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
  };
  total: number;
  payment: {
    method: string;
    status: string;
    installments: number;
    cardLastDigits: string;
    cardBrand: string;
    boletoUrl: string;
    pixQrCode: string;
    pixQrCodeUrl: string;
    paidAt: string;
  };
  createdAt: string;
}

// --- Helpers ---

function formatCurrency(value: number): string {
  return value.toFixed(2).replace('.', ',');
}

const STATUS_MAP: Record<
  string,
  { label: string; color: string; icon: typeof Check }
> = {
  pendente: { label: 'Pendente', color: 'text-yellow-400', icon: Clock },
  pago: { label: 'Pago', color: 'text-green-400', icon: Check },
  preparando: { label: 'Preparando', color: 'text-blue-400', icon: Package },
  enviado: { label: 'Enviado', color: 'text-blue-400', icon: Truck },
  entregue: { label: 'Entregue', color: 'text-green-400', icon: Check },
  cancelado: { label: 'Cancelado', color: 'text-red-400', icon: X },
  falhou: { label: 'Falhou', color: 'text-red-400', icon: AlertCircle },
};

const PAYMENT_LABEL: Record<string, string> = {
  credit_card: 'Cartao de credito',
  boleto: 'Boleto bancario',
  pix: 'PIX',
};

// --- Componente ---

export function OrderStatusClient({ order }: { order: OrderData }) {
  const [pixCopied, setPixCopied] = useState(false);
  const statusInfo = STATUS_MAP[order.status] || STATUS_MAP.pendente;
  const StatusIcon = statusInfo.icon;

  const handleCopyPix = () => {
    if (order.payment.pixQrCode) {
      navigator.clipboard.writeText(order.payment.pixQrCode);
      setPixCopied(true);
      toast.success('Codigo PIX copiado!');
      setTimeout(() => setPixCopied(false), 3000);
    }
  };

  return (
    <section className='pb-16 pt-24 sm:pb-24 sm:pt-28'>
      <div className='mx-auto max-w-3xl px-4 sm:px-6 lg:px-8'>
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

            {/* Status badge */}
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
              {order.items.map((item, i) => (
                <div
                  key={i}
                  className='flex items-center justify-between gap-3 border-b border-gold-500/5 pb-3 last:border-0 last:pb-0'
                >
                  <div className='min-w-0 flex-1'>
                    <Link
                      href={`/livros/${item.slug}`}
                      className='text-sm text-cream-100 transition-colors hover:text-gold-400'
                    >
                      {item.title}
                    </Link>
                    <p className='text-xs text-txt-muted'>
                      Qtd: {item.quantity} x R$ {formatCurrency(item.price)}
                    </p>
                  </div>
                  <p className='shrink-0 text-sm text-cream-100'>
                    R$ {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            {/* Totais */}
            <div className='mt-4 space-y-2 border-t border-gold-500/8 pt-3'>
              <div className='flex justify-between text-[13px]'>
                <span className='text-txt-muted'>Subtotal</span>
                <span className='text-cream-100'>
                  R$ {formatCurrency(order.subtotal)}
                </span>
              </div>
              <div className='flex justify-between text-[13px]'>
                <span className='text-txt-muted'>
                  Frete ({order.shipping.method})
                </span>
                <span className='text-cream-100'>
                  R$ {formatCurrency(order.shipping.price)}
                </span>
              </div>
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
                {order.payment.method === 'credit_card' && (
                  <CreditCard size={16} className='text-gold-600' />
                )}
                {order.payment.method === 'pix' && (
                  <QrCode size={16} className='text-gold-600' />
                )}
                {order.payment.method === 'boleto' && (
                  <FileText size={16} className='text-gold-600' />
                )}
                <span className='text-cream-100'>
                  {PAYMENT_LABEL[order.payment.method] || order.payment.method}
                </span>
              </div>

              {/* Detalhes por metodo */}
              {order.payment.method === 'credit_card' && (
                <>
                  {order.payment.cardLastDigits && (
                    <p className='text-txt-muted'>
                      {order.payment.cardBrand
                        ? `${order.payment.cardBrand.charAt(0).toUpperCase() + order.payment.cardBrand.slice(1)} `
                        : ''}
                      **** {order.payment.cardLastDigits}
                      {order.payment.installments > 1 &&
                        ` em ${order.payment.installments}x`}
                    </p>
                  )}
                </>
              )}

              {order.payment.method === 'pix' &&
                order.payment.status !== 'paid' &&
                order.payment.pixQrCode && (
                  <div className='mt-3 space-y-3'>
                    {order.payment.pixQrCodeUrl && (
                      <div className='w-fit border border-gold-500/10 bg-white p-3'>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={order.payment.pixQrCodeUrl}
                          alt='QR Code PIX'
                          width={180}
                          height={180}
                        />
                      </div>
                    )}
                    <div className='flex items-center gap-2'>
                      <input
                        type='text'
                        readOnly
                        value={order.payment.pixQrCode}
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
                  </div>
                )}

              {order.payment.method === 'boleto' && order.payment.boletoUrl && (
                <a
                  href={order.payment.boletoUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='mt-2 inline-flex items-center gap-2 border border-gold-500/30 px-4 py-2 text-xs uppercase tracking-[1px] text-gold-500 transition-colors hover:bg-gold-500/5'
                >
                  <FileText size={14} />
                  Visualizar boleto
                </a>
              )}

              {order.payment.paidAt && (
                <p className='text-xs text-txt-muted'>
                  Pago em{' '}
                  {new Date(order.payment.paidAt).toLocaleString('pt-BR')}
                </p>
              )}
            </div>
          </motion.div>

          {/* Entrega */}
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
                {order.shipping.address.street}, {order.shipping.address.number}
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

              {order.shipping.trackingCode && (
                <div className='mt-3 border-t border-gold-500/8 pt-3'>
                  <p className='text-xs uppercase tracking-[1px] text-gold-600'>
                    Codigo de rastreio
                  </p>
                  <p className='mt-1 font-mono text-sm text-cream-100'>
                    {order.shipping.trackingCode}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
