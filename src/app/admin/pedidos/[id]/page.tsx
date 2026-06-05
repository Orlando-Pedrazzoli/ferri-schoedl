'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { StatusBadge } from '@/components/admin/StatusBadge';
import {
  ArrowLeft,
  Save,
  Truck,
  CreditCard,
  User,
  Copy,
  Check,
  Eye,
  EyeOff,
} from 'lucide-react';

interface OrderItem {
  type: string;
  title: string;
  quantity: number;
  price: number;
}

interface OrderShipping {
  method: string;
  price: number;
  estimatedDays: string;
  trackingCode?: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    cep: string;
  };
}

interface OrderDetail {
  _id: string;
  orderCode: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerCpf: string;
  items: OrderItem[];
  subtotal: number;
  total: number;
  status: string;
  shipping?: OrderShipping | null;
  payment: {
    method: string;
    status: string;
    cardBrand?: string;
    cardLastDigits?: string;
    paidAt?: string;
  };
  createdAt: string;
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
  if (type === 'course') return 'Curso online';
  return 'Livro físico';
}

function formatCurrency(v: number): string {
  return `R$ ${v.toFixed(2).replace('.', ',')}`;
}

function formatCep(cep: string): string {
  const d = (cep || '').replace(/\D/g, '');
  if (d.length !== 8) return cep || '—';
  return `${d.slice(0, 5)}-${d.slice(5)}`;
}

function formatCpf(cpf: string): string {
  const d = (cpf || '').replace(/\D/g, '');
  if (d.length !== 11) return cpf || '—';
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

function maskCpf(cpf: string): string {
  const d = (cpf || '').replace(/\D/g, '');
  if (d.length !== 11) return '•••';
  return `•••.${d.slice(3, 6)}.${d.slice(6, 9)}-••`;
}

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState('');
  const [tracking, setTracking] = useState('');
  const [saving, setSaving] = useState(false);
  const [showCpf, setShowCpf] = useState(false);
  const [copied, setCopied] = useState(false);
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(
    null,
  );

  const hasPhysical = !!order?.items.some(i => i.type === 'physical');
  const allowed = hasPhysical
    ? ['preparando', 'enviado', 'entregue', 'cancelado']
    : ['entregue', 'cancelado'];

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/admin/orders/${id}`);
        const data = await res.json();
        if (data.success) {
          const o: OrderDetail = data.data;
          setOrder(o);
          setTracking(o.shipping?.trackingCode || '');
          const physical = o.items.some(i => i.type === 'physical');
          const opts = physical
            ? ['preparando', 'enviado', 'entregue', 'cancelado']
            : ['entregue', 'cancelado'];
          setNewStatus(opts.includes(o.status) ? o.status : opts[0]);
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleCopyAddress = async () => {
    if (!order?.shipping) return;
    const a = order.shipping.address;
    const lines = [
      order.customerName,
      `${a.street}, ${a.number}${a.complement ? ` - ${a.complement}` : ''}`,
      a.neighborhood,
      `${a.city} - ${a.state}`,
      `CEP: ${formatCep(a.cep)}`,
      order.customerPhone ? `Tel: ${order.customerPhone}` : '',
    ].filter(Boolean);

    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setMsg({ type: 'err', text: 'Não foi possível copiar o endereço.' });
    }
  };

  const handleSave = async () => {
    if (!order) return;
    if (
      newStatus === 'cancelado' &&
      !confirm('Cancelar este pedido? O cliente será notificado por e-mail.')
    ) {
      return;
    }
    if (newStatus === 'enviado' && !tracking.trim()) {
      setMsg({ type: 'err', text: 'Informe o código de rastreio.' });
      return;
    }

    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/admin/orders/${order._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, trackingCode: tracking }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Erro ao salvar');
      setOrder(data.data);
      setTracking(data.data.shipping?.trackingCode || '');
      setMsg({
        type: 'ok',
        text: 'Pedido atualizado. O cliente foi notificado por e-mail.',
      });
    } catch (err) {
      const text = err instanceof Error ? err.message : 'Erro ao salvar';
      setMsg({ type: 'err', text });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <AdminHeader title='Pedido' description='Carregando...' />
        <div className='flex-1 p-6 text-txt-muted'>Carregando...</div>
      </>
    );
  }

  if (!order) {
    return (
      <>
        <AdminHeader title='Pedido' description='Não encontrado' />
        <div className='flex-1 p-6'>
          <p className='text-txt-muted'>Pedido não encontrado.</p>
          <Link
            href='/admin/pedidos'
            className='mt-3 inline-block text-gold-500 hover:text-gold-400'
          >
            Voltar para pedidos
          </Link>
        </div>
      </>
    );
  }

  const labelClass = 'block text-sm font-medium text-cream-200 mb-1';
  const inputClass =
    'w-full px-3 py-2 bg-navy-950 border border-gold-500/15 rounded-lg text-cream-100 text-sm placeholder-txt-muted/50 focus:outline-none focus:ring-1 focus:ring-gold-500/30 focus:border-gold-500/40 transition-colors';

  return (
    <>
      <AdminHeader
        title={`Pedido ${order.orderCode}`}
        description={`${order.customerName} · ${new Date(
          order.createdAt,
        ).toLocaleDateString('pt-BR')}`}
      />

      <div className='flex-1 overflow-auto p-6'>
        <Link
          href='/admin/pedidos'
          className='mb-5 inline-flex items-center gap-2 text-sm text-txt-muted transition-colors hover:text-cream-100'
        >
          <ArrowLeft size={16} />
          Voltar para pedidos
        </Link>

        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
          {/* Coluna esquerda — detalhes */}
          <div className='space-y-6 lg:col-span-2'>
            {/* Cliente */}
            <div className='rounded-xl border border-gold-500/10 bg-navy-900 p-5'>
              <h3 className='mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-txt-muted'>
                <User size={14} />
                Cliente
              </h3>
              <div className='space-y-1 text-sm'>
                <p className='text-cream-100'>{order.customerName}</p>
                <p className='text-txt-muted'>{order.customerEmail}</p>
                <p className='text-txt-muted'>{order.customerPhone}</p>
                <p className='flex items-center gap-2 text-txt-muted'>
                  CPF:{' '}
                  {showCpf
                    ? formatCpf(order.customerCpf)
                    : maskCpf(order.customerCpf)}
                  <button
                    type='button'
                    onClick={() => setShowCpf(v => !v)}
                    className='inline-flex items-center gap-1 text-[11px] text-gold-600 transition-colors hover:text-gold-500'
                  >
                    {showCpf ? <EyeOff size={12} /> : <Eye size={12} />}
                    {showCpf ? 'Ocultar' : 'Mostrar'}
                  </button>
                </p>
              </div>
            </div>

            {/* Itens */}
            <div className='rounded-xl border border-gold-500/10 bg-navy-900 p-5'>
              <h3 className='mb-3 text-xs font-semibold uppercase tracking-wider text-txt-muted'>
                Itens do pedido
              </h3>
              <div className='space-y-3'>
                {order.items.map((item, i) => (
                  <div
                    key={i}
                    className='flex items-center justify-between gap-3 border-b border-gold-500/5 pb-3 last:border-0 last:pb-0'
                  >
                    <div className='min-w-0'>
                      <p className='text-sm text-cream-100'>{item.title}</p>
                      <p className='text-xs text-txt-muted'>
                        {tipoLabel(item.type)} · Qtd {item.quantity} ×{' '}
                        {formatCurrency(item.price)}
                      </p>
                    </div>
                    <p className='shrink-0 text-sm text-cream-100'>
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
              <div className='mt-4 space-y-1 border-t border-gold-500/10 pt-3 text-sm'>
                <div className='flex justify-between'>
                  <span className='text-txt-muted'>Subtotal</span>
                  <span className='text-cream-100'>
                    {formatCurrency(order.subtotal)}
                  </span>
                </div>
                {order.shipping ? (
                  <div className='flex justify-between'>
                    <span className='text-txt-muted'>
                      Frete ({order.shipping.method})
                    </span>
                    <span className='text-cream-100'>
                      {formatCurrency(order.shipping.price)}
                    </span>
                  </div>
                ) : null}
                <div className='flex justify-between border-t border-gold-500/10 pt-2'>
                  <span className='text-cream-100'>Total</span>
                  <span className='font-semibold text-gold-500'>
                    {formatCurrency(order.total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Pagamento (somente leitura) */}
            <div className='rounded-xl border border-gold-500/10 bg-navy-900 p-5'>
              <h3 className='mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-txt-muted'>
                <CreditCard size={14} />
                Pagamento
              </h3>
              <div className='space-y-2 text-sm'>
                <div className='flex items-center gap-2'>
                  <span className='text-cream-100'>Cartão de crédito</span>
                  <StatusBadge
                    status={
                      PAYMENT_STATUS_LABEL[order.payment.status] ||
                      order.payment.status
                    }
                  />
                </div>
                {order.payment.cardLastDigits ? (
                  <p className='text-txt-muted'>
                    {order.payment.cardBrand
                      ? `${order.payment.cardBrand} `
                      : ''}
                    **** {order.payment.cardLastDigits}
                  </p>
                ) : null}
                {order.payment.paidAt ? (
                  <p className='text-xs text-txt-muted'>
                    Pago em{' '}
                    {new Date(order.payment.paidAt).toLocaleString('pt-BR')}
                  </p>
                ) : null}
                <p className='text-[11px] text-txt-muted/70'>
                  O status do pagamento é definido automaticamente pelo Stripe.
                </p>
              </div>
            </div>

            {/* Entrega */}
            {order.shipping ? (
              <div className='rounded-xl border border-gold-500/10 bg-navy-900 p-5'>
                <div className='mb-3 flex items-center justify-between gap-2'>
                  <h3 className='flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-txt-muted'>
                    <Truck size={14} />
                    Endereço de entrega
                  </h3>
                  <button
                    type='button'
                    onClick={handleCopyAddress}
                    className='inline-flex items-center gap-1.5 rounded-lg border border-gold-500/15 px-2.5 py-1 text-xs text-cream-200 transition-colors hover:border-gold-500/40 hover:text-cream-100'
                  >
                    {copied ? (
                      <>
                        <Check size={13} className='text-green-400' />
                        Copiado!
                      </>
                    ) : (
                      <>
                        <Copy size={13} />
                        Copiar endereço
                      </>
                    )}
                  </button>
                </div>
                <div className='space-y-1 text-sm text-txt-muted'>
                  <p className='text-cream-100'>
                    {order.shipping.method} — {order.shipping.estimatedDays}
                  </p>
                  <p>
                    {order.shipping.address.street},{' '}
                    {order.shipping.address.number}
                    {order.shipping.address.complement
                      ? ` — ${order.shipping.address.complement}`
                      : ''}
                  </p>
                  <p>
                    {order.shipping.address.neighborhood},{' '}
                    {order.shipping.address.city} —{' '}
                    {order.shipping.address.state}
                  </p>
                  <p>CEP: {formatCep(order.shipping.address.cep)}</p>
                </div>
              </div>
            ) : null}
          </div>

          {/* Coluna direita — gestão */}
          <div className='space-y-6'>
            <div className='rounded-xl border border-gold-500/10 bg-navy-900 p-5'>
              <h3 className='mb-3 text-xs font-semibold uppercase tracking-wider text-txt-muted'>
                Gerir pedido
              </h3>

              <div className='mb-4 flex items-center gap-2'>
                <span className='text-sm text-txt-muted'>Status atual:</span>
                <StatusBadge
                  status={ORDER_STATUS_LABEL[order.status] || order.status}
                />
              </div>

              {order.payment.status !== 'paid' ? (
                <p className='mb-4 rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-3 text-xs text-yellow-400'>
                  Este pedido ainda não foi pago. Aguarde a confirmação do
                  pagamento antes de processar.
                </p>
              ) : !hasPhysical ? (
                <p className='mb-4 rounded-lg border border-blue-500/20 bg-blue-500/5 p-3 text-xs text-blue-400'>
                  Pedido digital — o acesso é liberado automaticamente após o
                  pagamento.
                </p>
              ) : null}

              <div className='mb-3'>
                <label className={labelClass}>Alterar status para</label>
                <select
                  value={newStatus}
                  onChange={e => setNewStatus(e.target.value)}
                  className={inputClass}
                >
                  {allowed.map(s => (
                    <option key={s} value={s}>
                      {ORDER_STATUS_LABEL[s]}
                    </option>
                  ))}
                </select>
              </div>

              {hasPhysical ? (
                <div className='mb-3'>
                  <label className={labelClass}>
                    Código de rastreio
                    {newStatus === 'enviado' ? ' *' : ''}
                  </label>
                  <input
                    type='text'
                    value={tracking}
                    onChange={e => setTracking(e.target.value)}
                    placeholder='Ex: AA123456789BR'
                    className={inputClass}
                  />
                </div>
              ) : null}

              <button
                type='button'
                onClick={handleSave}
                disabled={saving}
                className='mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-gold-500 px-4 py-2.5 text-sm font-medium text-navy-950 transition-colors hover:bg-gold-400 disabled:opacity-50'
              >
                <Save size={16} />
                {saving ? 'Salvando...' : 'Salvar e notificar cliente'}
              </button>

              {msg ? (
                <p
                  className={`mt-3 text-sm ${
                    msg.type === 'ok' ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {msg.text}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
