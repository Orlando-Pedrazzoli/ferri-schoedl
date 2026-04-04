'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface ArticleData {
  _id?: string;
  title: string;
  year: number;
  publisher: string;
  url: string;
  pdfUrl: string;
  originalPublisher: string;
  coauthors: string[];
  description: string;
  type: 'artigo' | 'capitulo';
  isActive: boolean;
  order: number;
}

const defaultArticle: ArticleData = {
  title: '',
  year: new Date().getFullYear(),
  publisher: '',
  url: '',
  pdfUrl: '',
  originalPublisher: '',
  coauthors: [],
  description: '',
  type: 'artigo',
  isActive: true,
  order: 0,
};

interface ArticleFormProps {
  initialData?: ArticleData;
  isEditing?: boolean;
}

export function ArticleForm({
  initialData,
  isEditing = false,
}: ArticleFormProps) {
  const [form, setForm] = useState<ArticleData>(initialData || defaultArticle);
  const [coauthorsText, setCoauthorsText] = useState(
    (initialData?.coauthors || []).join(', '),
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

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
        coauthors: coauthorsText
          ? coauthorsText
              .split(',')
              .map(c => c.trim())
              .filter(Boolean)
          : [],
      };

      const url = isEditing
        ? `/api/admin/articles/${form._id}`
        : '/api/admin/articles';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Erro ao salvar');
      }

      router.push('/admin/publicacoes');
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao salvar';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    'w-full px-3 py-2 bg-navy-950 border border-gold-500/15 rounded-lg text-cream-100 text-sm placeholder-txt-muted/50 focus:outline-none focus:ring-1 focus:ring-gold-500/30 focus:border-gold-500/40 transition-colors';
  const labelClass = 'block text-sm font-medium text-cream-200 mb-1';

  return (
    <form onSubmit={handleSubmit} className='max-w-2xl space-y-6'>
      {error && (
        <div className='p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm'>
          {error}
        </div>
      )}

      <div className='flex items-center justify-between'>
        <Link
          href='/admin/publicacoes'
          className='flex items-center gap-2 text-sm text-txt-muted hover:text-cream-100 transition-colors'
        >
          <ArrowLeft size={16} /> Voltar
        </Link>
        <button
          type='submit'
          disabled={saving}
          className='flex items-center gap-2 px-4 py-2 bg-gold-500 hover:bg-gold-400 disabled:bg-gold-500/50 text-navy-950 text-sm font-medium rounded-lg transition-colors'
        >
          <Save size={16} />
          {saving
            ? 'Salvando...'
            : isEditing
              ? 'Atualizar'
              : 'Criar Publicação'}
        </button>
      </div>

      <div className='bg-navy-900 border border-gold-500/10 rounded-xl p-5 space-y-4'>
        <h3 className='text-xs font-semibold text-txt-muted uppercase tracking-wider'>
          Informações da Publicação
        </h3>

        <div>
          <label className={labelClass}>Título *</label>
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
              onChange={e => updateField('year', parseInt(e.target.value) || 0)}
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Publicação *</label>
            <input
              type='text'
              value={form.publisher}
              onChange={e => updateField('publisher', e.target.value)}
              placeholder='Ex: Carta Forense, Migalhas'
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
            placeholder='https://...'
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>URL do PDF</label>
          <input
            type='text'
            value={form.pdfUrl}
            onChange={e => updateField('pdfUrl', e.target.value)}
            placeholder='/articles/arquivo.pdf ou https://...'
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Publicação Original</label>
          <input
            type='text'
            value={form.originalPublisher}
            onChange={e => updateField('originalPublisher', e.target.value)}
            placeholder='Publicação original (se republicado)'
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>
            Coautores (separados por vírgula)
          </label>
          <input
            type='text'
            value={coauthorsText}
            onChange={e => setCoauthorsText(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Descrição</label>
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
              <option value='capitulo'>Capítulo de Livro</option>
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
            className='w-4 h-4 rounded border-navy-600 text-gold-500 focus:ring-gold-500/50 bg-navy-950'
          />
          <span className='text-sm text-cream-200'>Ativo</span>
        </label>
      </div>
    </form>
  );
}
