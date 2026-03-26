'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditArticlePage() {
  const params = useParams();
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    year: 2024,
    publisher: '',
    url: '',
    coauthors: '',
    description: '',
    type: 'artigo',
    isActive: true,
    order: 0,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(`/api/admin/articles/${params.id}`);
        const data = await res.json();
        if (data.success) {
          const a = data.data;
          setForm({
            title: a.title,
            year: a.year,
            publisher: a.publisher,
            url: a.url || '',
            coauthors: (a.coauthors || []).join(', '),
            description: a.description || '',
            type: a.type || 'artigo',
            isActive: a.isActive,
            order: a.order || 0,
          });
        } else {
          setError('Artigo nao encontrado');
        }
      } catch {
        setError('Erro ao carregar artigo');
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchArticle();
  }, [params.id]);

  const updateField = (field: string, value: unknown) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload = {
        ...form,
        coauthors: form.coauthors
          ? form.coauthors
              .split(',')
              .map(c => c.trim())
              .filter(Boolean)
          : [],
      };
      const res = await fetch(`/api/admin/articles/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      router.push('/admin/publicacoes');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar');
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    'w-full px-3 py-2 bg-[#0a0f1c] border border-[#1f2937] rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-colors';
  const labelClass = 'block text-sm font-medium text-gray-300 mb-1';

  if (loading) {
    return (
      <>
        <AdminHeader title='Editar Artigo' />
        <div className='flex-1 p-6 flex items-center justify-center'>
          <p className='text-gray-400'>Carregando...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminHeader title='Editar Artigo' description={form.title} />
      <div className='flex-1 p-6 overflow-auto'>
        <form onSubmit={handleSubmit} className='max-w-2xl space-y-6'>
          {error && (
            <div className='p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm'>
              {error}
            </div>
          )}

          <div className='flex items-center justify-between'>
            <Link
              href='/admin/publicacoes'
              className='flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors'
            >
              <ArrowLeft size={16} /> Voltar
            </Link>
            <button
              type='submit'
              disabled={saving}
              className='flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-600/50 text-white text-sm font-medium rounded-lg transition-colors'
            >
              <Save size={16} /> {saving ? 'Salvando...' : 'Atualizar'}
            </button>
          </div>

          <div className='bg-[#111827] border border-[#1f2937] rounded-xl p-5 space-y-4'>
            <div>
              <label className={labelClass}>Titulo *</label>
              <input
                type='text'
                value={form.title}
                onChange={e => updateField('title', e.target.value)}
                required
                className={inputClass}
              />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className={labelClass}>Ano *</label>
                <input
                  type='number'
                  value={form.year}
                  onChange={e =>
                    updateField('year', parseInt(e.target.value) || 0)
                  }
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Publicacao *</label>
                <input
                  type='text'
                  value={form.publisher}
                  onChange={e => updateField('publisher', e.target.value)}
                  required
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>URL</label>
              <input
                type='url'
                value={form.url}
                onChange={e => updateField('url', e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>
                Coautores (separados por virgula)
              </label>
              <input
                type='text'
                value={form.coauthors}
                onChange={e => updateField('coauthors', e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Descricao</label>
              <textarea
                value={form.description}
                onChange={e => updateField('description', e.target.value)}
                rows={3}
                className={inputClass}
              />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className={labelClass}>Tipo</label>
                <select
                  value={form.type}
                  onChange={e => updateField('type', e.target.value)}
                  className={inputClass}
                >
                  <option value='artigo'>Artigo</option>
                  <option value='capitulo'>Capitulo de Livro</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Ordem</label>
                <input
                  type='number'
                  value={form.order}
                  onChange={e =>
                    updateField('order', parseInt(e.target.value) || 0)
                  }
                  className={inputClass}
                />
              </div>
            </div>
            <label className='flex items-center gap-3 cursor-pointer'>
              <input
                type='checkbox'
                checked={form.isActive}
                onChange={e => updateField('isActive', e.target.checked)}
                className='w-4 h-4 rounded border-gray-600 text-amber-600 focus:ring-amber-500/50 bg-[#0a0f1c]'
              />
              <span className='text-sm text-gray-300'>Ativo</span>
            </label>
          </div>
        </form>
      </div>
    </>
  );
}
