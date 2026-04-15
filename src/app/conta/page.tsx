'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  Package,
  GraduationCap,
  ShoppingBag,
  Loader2,
  Clock,
  Check,
  Truck,
  X,
} from 'lucide-react';

interface OrderSummary {
  orderCode: string;
  status: string;
  total: number;
  createdAt: string;
  itemCount: number;
}

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; icon: typeof Check }
> = {
  pendente: { label: 'Pendente', color: 'text-yellow-400', icon: Clock },
  pago: { label: 'Pago', color: 'text-green-400', icon: Check },
  preparando: { label: 'Preparando', color: 'text-blue-400', icon: Package },
  enviado: { label: 'Enviado', color: 'text-blue-400', icon: Truck },
  entregue: { label: 'Entregue', color: 'text-green-400', icon: Check },
  cancelado: { label: 'Cancelado', color: 'text-red-400', icon: X },
  falhou: { label: 'Falhou', color: 'text-red-400', icon: X },
};

export default function ContaDashboard() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
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

  const customerName = session?.user?.name || 'Cliente';

  return (
    <div className='space-y-6'>
      {/* Saudacao */}
      <div>
        <h1 className='font-[family-name:var(--font-cormorant)] text-2xl text-cream-100'>
          Ola, {customerName}
        </h1>
        <p className='mt-1 text-sm text-txt-muted'>
          Bem-vindo a sua area de cliente.
        </p>
      </div>

      {/* Cards rapidos */}
      <div className='grid gap-4 sm:grid-cols-3'>
        <Link
          href='/conta/pedidos'
          className='flex items-center gap-4 border border-gold-500/10 bg-navy-900/30 p-5 transition-colors hover:border-gold-500/20'
        >
          <div className='flex h-10 w-10 items-center justify-center bg-gold-500/10'>
            <Package size={20} className='text-gold-500' />
          </div>
          <div>
            <p className='text-sm font-medium text-cream-100'>Meus Pedidos</p>
            <p className='text-xs text-txt-muted'>
              {orders.length} {orders.length === 1 ? 'pedido' : 'pedidos'}
            </p>
          </div>
        </Link>

        <Link
          href='/conta/cursos'
          className='flex items-center gap-4 border border-gold-500/10 bg-navy-900/30 p-5 transition-colors hover:border-gold-500/20'
        >
          <div className='flex h-10 w-10 items-center justify-center bg-gold-500/10'>
            <GraduationCap size={20} className='text-gold-500' />
          </div>
          <div>
            <p className='text-sm font-medium text-cream-100'>Meus Cursos</p>
            <p className='text-xs text-txt-muted'>Em breve</p>
          </div>
        </Link>

        <Link
          href='/livros'
          className='flex items-center gap-4 border border-gold-500/10 bg-navy-900/30 p-5 transition-colors hover:border-gold-500/20'
        >
          <div className='flex h-10 w-10 items-center justify-center bg-gold-500/10'>
            <ShoppingBag size={20} className='text-gold-500' />
          </div>
          <div>
            <p className='text-sm font-medium text-cream-100'>Loja</p>
            <p className='text-xs text-txt-muted'>Ver livros</p>
          </div>
        </Link>
      </div>

      {/* Ultimos pedidos */}
      <div className='border border-gold-500/10 bg-navy-900/30'>
        <div className='flex items-center justify-between border-b border-gold-500/10 px-5 py-4'>
          <h2 className='text-xs uppercase tracking-[2px] text-gold-500'>
            Ultimos pedidos
          </h2>
          {orders.length > 0 && (
            <Link
              href='/conta/pedidos'
              className='text-xs text-gold-600 transition-colors hover:text-gold-500'
            >
              Ver todos
            </Link>
          )}
        </div>

        <div className='p-5'>
          {loading ? (
            <div className='flex items-center justify-center py-8'>
              <Loader2 size={20} className='animate-spin text-gold-500' />
            </div>
          ) : orders.length === 0 ? (
            <div className='py-8 text-center'>
              <ShoppingBag
                size={32}
                strokeWidth={1}
                className='mx-auto text-gold-600/30'
              />
              <p className='mt-3 text-sm text-txt-muted'>
                Voce ainda nao fez nenhum pedido.
              </p>
              <Link
                href='/livros'
                className='mt-4 inline-block text-sm text-gold-500 transition-colors hover:text-gold-400'
              >
                Explorar livros
              </Link>
            </div>
          ) : (
            <div className='space-y-3'>
              {orders.slice(0, 5).map(order => {
                const statusInfo =
                  STATUS_CONFIG[order.status] || STATUS_CONFIG.pendente;
                const StatusIcon = statusInfo.icon;
                return (
                  <Link
                    key={order.orderCode}
                    href={`/pedido/${order.orderCode}`}
                    className='flex items-center justify-between border border-gold-500/5 px-4 py-3 transition-colors hover:border-gold-500/15'
                  >
                    <div>
                      <p className='text-sm text-cream-100'>
                        <span className='font-mono text-gold-500'>
                          {order.orderCode}
                        </span>
                        <span className='ml-2 text-txt-muted'>
                          ({order.itemCount}{' '}
                          {order.itemCount === 1 ? 'item' : 'itens'})
                        </span>
                      </p>
                      <p className='mt-0.5 text-xs text-txt-muted'>
                        {new Date(order.createdAt).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className='flex items-center gap-3'>
                      <span className='text-sm text-cream-100'>
                        R$ {order.total.toFixed(2).replace('.', ',')}
                      </span>
                      <span
                        className={`flex items-center gap-1 text-xs ${statusInfo.color}`}
                      >
                        <StatusIcon size={12} />
                        {statusInfo.label}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
