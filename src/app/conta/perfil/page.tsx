'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Loader2, Save, Check } from 'lucide-react';
import toast from 'react-hot-toast';

interface ProfileData {
  name: string;
  email: string;
  cpf: string;
  phone: string;
}

export default function PerfilPage() {
  const { data: session } = useSession();
  const [form, setForm] = useState<ProfileData>({
    name: '',
    email: '',
    cpf: '',
    phone: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/conta/perfil');
        if (res.ok) {
          const data = await res.json();
          setForm({
            name: data.name || '',
            email: data.email || '',
            cpf: data.cpf || '',
            phone: data.phone || '',
          });
        }
      } catch {
        // Silencioso
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch('/api/conta/perfil', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
        }),
      });

      if (res.ok) {
        toast.success('Dados atualizados com sucesso!');
      } else {
        const data = await res.json();
        toast.error(data.error || 'Erro ao atualizar dados.');
      }
    } catch {
      toast.error('Erro de conexao.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center py-16'>
        <Loader2 size={24} className='animate-spin text-gold-500' />
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='font-[family-name:var(--font-cormorant)] text-2xl text-cream-100'>
          Meus Dados
        </h1>
        <p className='mt-1 text-sm text-txt-muted'>
          Gerencie suas informacoes pessoais.
        </p>
      </div>

      <div className='border border-gold-500/10 bg-navy-900/30 p-5 sm:p-6'>
        <div className='grid gap-5 sm:grid-cols-2'>
          <div>
            <label className='mb-1.5 block text-xs uppercase tracking-[1.5px] text-gold-600'>
              Nome completo
            </label>
            <input
              type='text'
              value={form.name}
              onChange={e =>
                setForm(prev => ({ ...prev, name: e.target.value }))
              }
              className='w-full border border-gold-500/12 bg-navy-800/30 px-4 py-3 text-sm text-cream-100 outline-none transition-colors focus:border-gold-500/30'
            />
          </div>

          <div>
            <label className='mb-1.5 block text-xs uppercase tracking-[1.5px] text-gold-600'>
              Email
            </label>
            <input
              type='email'
              value={form.email}
              disabled
              className='w-full border border-gold-500/8 bg-navy-800/10 px-4 py-3 text-sm text-txt-muted outline-none'
            />
            <p className='mt-1 text-[11px] text-txt-muted'>
              O email nao pode ser alterado.
            </p>
          </div>

          <div>
            <label className='mb-1.5 block text-xs uppercase tracking-[1.5px] text-gold-600'>
              CPF
            </label>
            <input
              type='text'
              value={form.cpf}
              disabled
              className='w-full border border-gold-500/8 bg-navy-800/10 px-4 py-3 text-sm text-txt-muted outline-none'
            />
            <p className='mt-1 text-[11px] text-txt-muted'>
              O CPF nao pode ser alterado.
            </p>
          </div>

          <div>
            <label className='mb-1.5 block text-xs uppercase tracking-[1.5px] text-gold-600'>
              Telefone
            </label>
            <input
              type='tel'
              value={form.phone}
              onChange={e =>
                setForm(prev => ({ ...prev, phone: e.target.value }))
              }
              className='w-full border border-gold-500/12 bg-navy-800/30 px-4 py-3 text-sm text-cream-100 outline-none transition-colors focus:border-gold-500/30'
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className='mt-6 inline-flex items-center gap-2 bg-gold-500 px-6 py-3 text-[13px] font-medium uppercase tracking-[2px] text-navy-950 transition-colors hover:bg-gold-400 disabled:opacity-50'
        >
          {saving ? (
            <>
              <Loader2 size={14} className='animate-spin' />
              Salvando...
            </>
          ) : (
            <>
              <Save size={14} />
              Salvar alteracoes
            </>
          )}
        </button>
      </div>
    </div>
  );
}
