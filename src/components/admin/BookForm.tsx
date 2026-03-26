'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface BookData {
  _id?: string;
  slug: string;
  title: string;
  subtitle: string;
  author: string;
  coauthor: boolean;
  year: number;
  publisher: string;
  pages: number;
  isbn: string;
  edition: string;
  price: number;
  originalPrice: number;
  description: string;
  longDescription: string;
  topics: string[];
  dimensions: { width: number; height: number; depth: number; unit: string };
  weight: number;
  weightUnit: string;
  image: string;
  inStock: boolean;
  featured: boolean;
  saleType: 'direto' | 'editora';
  saleNote: string;
  order: number;
  isActive: boolean;
}

const defaultBook: BookData = {
  slug: '',
  title: '',
  subtitle: '',
  author: 'Thales Ferri Schoedl',
  coauthor: false,
  year: new Date().getFullYear(),
  publisher: '',
  pages: 0,
  isbn: '',
  edition: '1a edicao',
  price: 0,
  originalPrice: 0,
  description: '',
  longDescription: '',
  topics: [],
  dimensions: { width: 16, height: 23, depth: 1.5, unit: 'cm' },
  weight: 0,
  weightUnit: 'g',
  image: '',
  inStock: true,
  featured: false,
  saleType: 'direto',
  saleNote: '',
  order: 0,
  isActive: true,
};

interface BookFormProps {
  initialData?: BookData;
  isEditing?: boolean;
}

export function BookForm({ initialData, isEditing = false }: BookFormProps) {
  const [form, setForm] = useState<BookData>(initialData || defaultBook);
  const [topicsText, setTopicsText] = useState(
    (initialData?.topics || []).join(', '),
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const updateField = (field: string, value: unknown) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const updateDimension = (field: string, value: number) => {
    setForm(prev => ({
      ...prev,
      dimensions: { ...prev.dimensions, [field]: value },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const payload = {
        ...form,
        topics: topicsText
          .split(',')
          .map(t => t.trim())
          .filter(Boolean),
      };

      const url = isEditing
        ? `/api/admin/books/${form._id}`
        : '/api/admin/books';
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

      router.push('/admin/livros');
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao salvar';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    'w-full px-3 py-2 bg-[#0a0f1c] border border-[#1f2937] rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500/50 transition-colors';
  const labelClass = 'block text-sm font-medium text-gray-300 mb-1';

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      {error && (
        <div className='p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm'>
          {error}
        </div>
      )}

      {/* Header actions */}
      <div className='flex items-center justify-between'>
        <Link
          href='/admin/livros'
          className='flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors'
        >
          <ArrowLeft size={16} />
          Voltar
        </Link>
        <button
          type='submit'
          disabled={saving}
          className='flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-600/50 text-white text-sm font-medium rounded-lg transition-colors'
        >
          <Save size={16} />
          {saving ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar Livro'}
        </button>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Main content - 2 cols */}
        <div className='lg:col-span-2 space-y-6'>
          {/* Basic info */}
          <div className='bg-[#111827] border border-[#1f2937] rounded-xl p-5 space-y-4'>
            <h3 className='text-sm font-semibold text-white uppercase tracking-wider'>
              Informacoes Basicas
            </h3>

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

            <div>
              <label className={labelClass}>Subtitulo</label>
              <input
                type='text'
                value={form.subtitle}
                onChange={e => updateField('subtitle', e.target.value)}
                className={inputClass}
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className={labelClass}>Slug</label>
                <input
                  type='text'
                  value={form.slug}
                  onChange={e => updateField('slug', e.target.value)}
                  placeholder='auto-gerado se vazio'
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Autor *</label>
                <input
                  type='text'
                  value={form.author}
                  onChange={e => updateField('author', e.target.value)}
                  required
                  className={inputClass}
                />
              </div>
            </div>

            <div className='grid grid-cols-3 gap-4'>
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
                <label className={labelClass}>Editora *</label>
                <input
                  type='text'
                  value={form.publisher}
                  onChange={e => updateField('publisher', e.target.value)}
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Edicao *</label>
                <input
                  type='text'
                  value={form.edition}
                  onChange={e => updateField('edition', e.target.value)}
                  required
                  className={inputClass}
                />
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className={labelClass}>Paginas *</label>
                <input
                  type='number'
                  value={form.pages}
                  onChange={e =>
                    updateField('pages', parseInt(e.target.value) || 0)
                  }
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>ISBN</label>
                <input
                  type='text'
                  value={form.isbn}
                  onChange={e => updateField('isbn', e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Descriptions */}
          <div className='bg-[#111827] border border-[#1f2937] rounded-xl p-5 space-y-4'>
            <h3 className='text-sm font-semibold text-white uppercase tracking-wider'>
              Descricoes
            </h3>

            <div>
              <label className={labelClass}>Descricao Curta *</label>
              <textarea
                value={form.description}
                onChange={e => updateField('description', e.target.value)}
                required
                rows={3}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Descricao Longa *</label>
              <textarea
                value={form.longDescription}
                onChange={e => updateField('longDescription', e.target.value)}
                required
                rows={6}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Topicos (separados por virgula)
              </label>
              <input
                type='text'
                value={topicsText}
                onChange={e => setTopicsText(e.target.value)}
                placeholder='Direito Penal, Constitucional, ...'
                className={inputClass}
              />
            </div>
          </div>

          {/* Physical specs */}
          <div className='bg-[#111827] border border-[#1f2937] rounded-xl p-5 space-y-4'>
            <h3 className='text-sm font-semibold text-white uppercase tracking-wider'>
              Especificacoes Fisicas
            </h3>

            <div className='grid grid-cols-4 gap-4'>
              <div>
                <label className={labelClass}>Largura (cm)</label>
                <input
                  type='number'
                  step='0.1'
                  value={form.dimensions.width}
                  onChange={e =>
                    updateDimension('width', parseFloat(e.target.value) || 0)
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Altura (cm)</label>
                <input
                  type='number'
                  step='0.1'
                  value={form.dimensions.height}
                  onChange={e =>
                    updateDimension('height', parseFloat(e.target.value) || 0)
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Profundidade (cm)</label>
                <input
                  type='number'
                  step='0.1'
                  value={form.dimensions.depth}
                  onChange={e =>
                    updateDimension('depth', parseFloat(e.target.value) || 0)
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Peso (g)</label>
                <input
                  type='number'
                  value={form.weight}
                  onChange={e =>
                    updateField('weight', parseInt(e.target.value) || 0)
                  }
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - 1 col */}
        <div className='space-y-6'>
          {/* Image */}
          <div className='bg-[#111827] border border-[#1f2937] rounded-xl p-5 space-y-4'>
            <h3 className='text-sm font-semibold text-white uppercase tracking-wider'>
              Imagem
            </h3>
            <ImageUpload
              value={form.image}
              onChange={url => updateField('image', url)}
              folder='ferri-schoedl/livros'
            />
          </div>

          {/* Pricing */}
          <div className='bg-[#111827] border border-[#1f2937] rounded-xl p-5 space-y-4'>
            <h3 className='text-sm font-semibold text-white uppercase tracking-wider'>
              Preco e Venda
            </h3>

            <div>
              <label className={labelClass}>Preco (R$) *</label>
              <input
                type='number'
                step='0.01'
                value={form.price}
                onChange={e =>
                  updateField('price', parseFloat(e.target.value) || 0)
                }
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Preco Original (R$)</label>
              <input
                type='number'
                step='0.01'
                value={form.originalPrice}
                onChange={e =>
                  updateField('originalPrice', parseFloat(e.target.value) || 0)
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Tipo de Venda *</label>
              <select
                value={form.saleType}
                onChange={e => updateField('saleType', e.target.value)}
                className={inputClass}
              >
                <option value='direto'>Venda Direta</option>
                <option value='editora'>Editora / Livrarias</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Nota de Venda</label>
              <input
                type='text'
                value={form.saleNote}
                onChange={e => updateField('saleNote', e.target.value)}
                placeholder='Ex: Venda direta com o autor'
                className={inputClass}
              />
            </div>
          </div>

          {/* Status */}
          <div className='bg-[#111827] border border-[#1f2937] rounded-xl p-5 space-y-4'>
            <h3 className='text-sm font-semibold text-white uppercase tracking-wider'>
              Status
            </h3>

            <div className='space-y-3'>
              <label className='flex items-center gap-3 cursor-pointer'>
                <input
                  type='checkbox'
                  checked={form.isActive}
                  onChange={e => updateField('isActive', e.target.checked)}
                  className='w-4 h-4 rounded border-gray-600 text-amber-600 focus:ring-amber-500/50 bg-[#0a0f1c]'
                />
                <span className='text-sm text-gray-300'>Ativo</span>
              </label>

              <label className='flex items-center gap-3 cursor-pointer'>
                <input
                  type='checkbox'
                  checked={form.inStock}
                  onChange={e => updateField('inStock', e.target.checked)}
                  className='w-4 h-4 rounded border-gray-600 text-amber-600 focus:ring-amber-500/50 bg-[#0a0f1c]'
                />
                <span className='text-sm text-gray-300'>Em Stock</span>
              </label>

              <label className='flex items-center gap-3 cursor-pointer'>
                <input
                  type='checkbox'
                  checked={form.featured}
                  onChange={e => updateField('featured', e.target.checked)}
                  className='w-4 h-4 rounded border-gray-600 text-amber-600 focus:ring-amber-500/50 bg-[#0a0f1c]'
                />
                <span className='text-sm text-gray-300'>Destaque</span>
              </label>

              <label className='flex items-center gap-3 cursor-pointer'>
                <input
                  type='checkbox'
                  checked={form.coauthor}
                  onChange={e => updateField('coauthor', e.target.checked)}
                  className='w-4 h-4 rounded border-gray-600 text-amber-600 focus:ring-amber-500/50 bg-[#0a0f1c]'
                />
                <span className='text-sm text-gray-300'>Coautoria</span>
              </label>
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
        </div>
      </div>
    </form>
  );
}
