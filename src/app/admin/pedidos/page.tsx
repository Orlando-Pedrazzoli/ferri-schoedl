'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Search, Eye } from 'lucide-react';

interface OrderItem {
  type: string;
  title: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  orderCode: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
  shipping?: { method: string } | null;
  payment: { status: string };
}

const ORDER_STATUS_LABEL: Record<string, string> = {
  pendente: 'Pendente',
  pago: 'Pago',
  preparando: 'Preparando',
  enviado: 'Enviado',
  entregue: 'Entregue',
  cancelado: 'Cancelado',
  falhou: 'Falhou',
};

const PAYMENT_STATUS_LABEL: Record<string, string> = {
  paid: 'Pago',
  pending: 'Pendente',
  failed: 'Falhou',
  canceled: 'Cancelado',
  chargedback: 'Estornado',
};

function tipoLabel(type: string): string {
  if (type === 'ebook') return 'eBook';
  if (type === 'course') return 'Curso';
  return 'Físico';
}

function formatCurrency(v: number): string {
  return `R$ ${v.toFixed(2).replace('.', ',')}`;
}

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      if (data.success) setOrders(data.data);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const q = query.trim().toLowerCase();
  const filtered = orders.filter(o => {
    if (statusFilter && o.status !== statusFilter) return false;
    if (!q) return true;
    return (
      o.orderCode.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.customerEmail.toLowerCase().includes(q)
    );
  });

  return (
    <>
      <AdminHeader
        title='Pedidos'
        description={`${orders.length} pedidos registados`}
      />

      <div className='flex-1 overflow-auto p-6'>
        {/* Filtros */}
        <div className='mb-4 flex flex-wrap items-center gap-3'>
          <div className='relative flex-1 min-w-[220px]'>
            <Search
              size={16}
              className='absolute left-3 top-1/2 -translate-y-1/2 text-txt-muted'
            />
            <input
              type='text'
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder='Buscar por código, nome ou e-mail'
              className='w-full rounded-lg border border-gold-500/15 bg-navy-950 py-2 pl-9 pr-3 text-sm text-cream-100 placeholder-txt-muted/50 focus:border-gold-500/40 focus:outline-none focus:ring-1 focus:ring-gold-500/30'
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className='rounded-lg border border-gold-500/15 bg-navy-950 px-3 py-2 text-sm text-cream-100 focus:border-gold-500/40 focus:outline-none focus:ring-1 focus:ring-gold-500/30'
          >
            <option value=''>Todos os status</option>
            <option value='pendente'>Pendente</option>
            <option value='pago'>Pago</option>
            <option value='preparando'>Preparando</option>
            <option value='enviado'>Enviado</option>
            <option value='entregue'>Entregue</option>
            <option value='cancelado'>Cancelado</option>
            <option value='falhou'>Falhou</option>
          </select>
        </div>

        {loading ? (
          <div className='py-12 text-center text-txt-muted'>Carregando...</div>
        ) : filtered.length === 0 ? (
          <div className='py-12 text-center text-txt-muted'>
            Nenhum pedido encontrado.
          </div>
        ) : (
          <div className='overflow-hidden rounded-xl border border-gold-500/10 bg-navy-900'>
            <table className='w-full'>
              <thead>
                <tr className='border-b border-gold-500/10'>
                  <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-txt-muted'>
                    Pedido
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-txt-muted'>
                    Cliente
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-txt-muted'>
                    Itens
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-txt-muted'>
                    Total
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-txt-muted'>
                    Pagamento
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-txt-muted'>
                    Status
                  </th>
                  <th className='px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-txt-muted'>
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gold-500/10'>
                {filtered.map(o => {
                  const tipos = Array.from(
                    new Set(o.items.map(i => tipoLabel(i.type))),
                  );
                  const totalQty = o.items.reduce((s, i) => s + i.quantity, 0);
                  return (
                    <tr
                      key={o._id}
                      onClick={() => router.push(`/admin/pedidos/${o._id}`)}
                      className='cursor-pointer transition-colors hover:bg-navy-800/50'
                    >
                      <td className='px-4 py-3'>
                        <p className='font-mono text-sm text-gold-500'>
                          {o.orderCode}
                        </p>
                        <p className='text-xs text-txt-muted'>
                          {new Date(o.createdAt).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })}
                        </p>
                      </td>
                      <td className='px-4 py-3'>
                        <p className='text-sm text-cream-100'>
                          {o.customerName}
                        </p>
                        <p className='text-xs text-txt-muted'>
                          {o.customerEmail}
                        </p>
                      </td>
                      <td className='px-4 py-3 text-sm text-cream-200'>
                        {totalQty} {totalQty > 1 ? 'itens' : 'item'}
                        <span className='block text-xs text-txt-muted'>
                          {tipos.join(', ')}
                        </span>
                      </td>
                      <td className='px-4 py-3 text-sm text-cream-200'>
                        {formatCurrency(o.total)}
                      </td>
                      <td className='px-4 py-3'>
                        <StatusBadge
                          status={
                            PAYMENT_STATUS_LABEL[o.payment.status] ||
                            o.payment.status
                          }
                        />
                      </td>
                      <td className='px-4 py-3'>
                        <StatusBadge
                          status={ORDER_STATUS_LABEL[o.status] || o.status}
                        />
                      </td>
                      <td className='px-4 py-3'>
                        <div className='flex justify-end'>
                          <span className='rounded-lg p-2 text-txt-muted transition-colors hover:bg-gold-500/10 hover:text-gold-500'>
                            <Eye size={14} />
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
