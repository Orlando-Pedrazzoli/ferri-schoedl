'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Package,
  Loader2,
  Clock,
  Check,
  Truck,
  X,
  ShoppingBag,
  ArrowLeft,
} from 'lucide-react';

interface OrderItem {
  title: string;
  quantity: number;
  price: number;
}

interface Order {
  orderCode: string;
  status: string;
  total: number;
  subtotal: number;
  createdAt: string;
  items: OrderItem[];
  shipping: {
    method: string;
    price: number;
  };
  payment: {
    method: string;
    status: string;
  };
}

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; icon: typeof Check }
> = {
  pendente: {
    label: 'Pendente',
    color: 'text-yellow-400',
    bg: 'border-yellow-400/20',
    icon: Clock,
  },
  pago: {
    label: 'Pago',
    color: 'text-green-400',
    bg: 'border-green-400/20',
    icon: Check,
  },
  preparando: {
    label: 'Preparando',
    color: 'text-blue-400',
    bg: 'border-blue-400/20',
    icon: Package,
  },
  enviado: {
    label: 'Enviado',
    color: 'text-blue-400',
    bg: 'border-blue-400/20',
    icon: Truck,
  },
  entregue: {
    label: 'Entregue',
    color: 'text-green-400',
    bg: 'border-green-400/20',
    icon: Check,
  },
  cancelado: {
    label: 'Cancelado',
    color: 'text-red-400',
    bg: 'border-red-400/20',
    icon: X,
  },
  falhou: {
    label: 'Falhou',
    color: 'text-red-400',
    bg: 'border-red-400/20',
    icon: X,
  },
};

const PAYMENT_LABELS: Record<string, string> = {
  credit_card: 'Cartao',
  boleto: 'Boleto',
  pix: 'PIX',
};

export default function PedidosPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch('/api/conta/pedidos');
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders || []);
        }
      } catch {
        // Silencioso
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='font-[family-name:var(--font-cormorant)] text-2xl text-cream-100'>
            Meus Pedidos
          </h1>
          <p className='mt-1 text-sm text-txt-muted'>
            Historico de todas as suas compras.
          </p>
        </div>
      </div>

      {loading ? (
        <div className='flex items-center justify-center py-16'>
          <Loader2 size={24} className='animate-spin text-gold-500' />
        </div>
      ) : orders.length === 0 ? (
        <div className='border border-gold-500/10 bg-navy-900/30 py-16 text-center'>
          <ShoppingBag
            size={40}
            strokeWidth={1}
            className='mx-auto text-gold-600/30'
          />
          <p className='mt-4 text-sm text-txt-muted'>
            Voce ainda nao fez nenhum pedido.
          </p>
          <Link
            href='/livros'
            className='mt-4 inline-flex items-center gap-2 bg-gold-500 px-6 py-2.5 text-xs font-medium uppercase tracking-[2px] text-navy-950 transition-colors hover:bg-gold-400'
          >
            <ShoppingBag size={14} />
            Explorar livros
          </Link>
        </div>
      ) : (
        <div className='space-y-4'>
          {orders.map(order => {
            const statusInfo =
              STATUS_CONFIG[order.status] || STATUS_CONFIG.pendente;
            const StatusIcon = statusInfo.icon;

            return (
              <Link
                key={order.orderCode}
                href={`/pedido/${order.orderCode}`}
                className='block border border-gold-500/10 bg-navy-900/30 transition-colors hover:border-gold-500/20'
              >
                {/* Header */}
                <div className='flex flex-wrap items-center justify-between gap-3 border-b border-gold-500/5 px-5 py-3'>
                  <div className='flex items-center gap-3'>
                    <span className='font-mono text-sm text-gold-500'>
                      {order.orderCode}
                    </span>
                    <span className='text-xs text-txt-muted'>
                      {new Date(order.createdAt).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 border px-2.5 py-1 text-xs ${statusInfo.color} ${statusInfo.bg}`}
                  >
                    <StatusIcon size={12} />
                    {statusInfo.label}
                  </div>
                </div>

                {/* Items */}
                <div className='px-5 py-3'>
                  {order.items.map((item, i) => (
                    <div key={i} className='flex justify-between py-1 text-sm'>
                      <span className='text-cream-100'>
                        {item.quantity}x {item.title}
                      </span>
                      <span className='text-txt-muted'>
                        R${' '}
                        {(item.price * item.quantity)
                          .toFixed(2)
                          .replace('.', ',')}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className='flex flex-wrap items-center justify-between gap-2 border-t border-gold-500/5 px-5 py-3'>
                  <div className='flex items-center gap-4 text-xs text-txt-muted'>
                    <span>{order.shipping.method}</span>
                    <span>
                      {PAYMENT_LABELS[order.payment.method] ||
                        order.payment.method}
                    </span>
                  </div>
                  <span className='font-[family-name:var(--font-cormorant)] text-lg text-gold-500'>
                    R$ {order.total.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
