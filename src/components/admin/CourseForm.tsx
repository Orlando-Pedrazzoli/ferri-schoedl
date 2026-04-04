'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { Save, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface CourseModule {
  title: string;
  description: string;
  lessons: string[];
  duration: string;
}

interface CourseData {
  _id?: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  instructor: string;
  image: string;
  price: number;
  originalPrice: number;
  duration: string;
  modules: CourseModule[];
  level: 'iniciante' | 'intermediario' | 'avancado';
  category: string;
  topics: string[];
  featured: boolean;
  isActive: boolean;
  status: 'rascunho' | 'publicado' | 'arquivado';
  order: number;
}

const defaultCourse: CourseData = {
  slug: '',
  title: '',
  subtitle: '',
  description: '',
  longDescription: '',
  instructor: 'Dr. Thales Ferri Schoedl',
  image: '',
  price: 0,
  originalPrice: 0,
  duration: '',
  modules: [],
  level: 'intermediario',
  category: '',
  topics: [],
  featured: false,
  isActive: true,
  status: 'rascunho',
  order: 0,
};

interface CourseFormProps {
  initialData?: CourseData;
  isEditing?: boolean;
}

export function CourseForm({
  initialData,
  isEditing = false,
}: CourseFormProps) {
  const [form, setForm] = useState<CourseData>(initialData || defaultCourse);
  const [topicsText, setTopicsText] = useState(
    (initialData?.topics || []).join(', '),
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const updateField = (field: string, value: unknown) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const addModule = () => {
    setForm(prev => ({
      ...prev,
      modules: [
        ...prev.modules,
        { title: '', description: '', lessons: [''], duration: '' },
      ],
    }));
  };

  const updateModule = (index: number, field: string, value: unknown) => {
    setForm(prev => {
      const modules = [...prev.modules];
      modules[index] = { ...modules[index], [field]: value };
      return { ...prev, modules };
    });
  };

  const removeModule = (index: number) => {
    setForm(prev => ({
      ...prev,
      modules: prev.modules.filter((_, i) => i !== index),
    }));
  };

  const updateLesson = (
    modIndex: number,
    lessonIndex: number,
    value: string,
  ) => {
    setForm(prev => {
      const modules = [...prev.modules];
      const lessons = [...modules[modIndex].lessons];
      lessons[lessonIndex] = value;
      modules[modIndex] = { ...modules[modIndex], lessons };
      return { ...prev, modules };
    });
  };

  const addLesson = (modIndex: number) => {
    setForm(prev => {
      const modules = [...prev.modules];
      modules[modIndex] = {
        ...modules[modIndex],
        lessons: [...modules[modIndex].lessons, ''],
      };
      return { ...prev, modules };
    });
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
        ? `/api/admin/courses/${form._id}`
        : '/api/admin/courses';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Erro ao salvar');

      router.push('/admin/cursos');
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
    <form onSubmit={handleSubmit} className='space-y-6'>
      {error && (
        <div className='p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm'>
          {error}
        </div>
      )}

      <div className='flex items-center justify-between'>
        <Link
          href='/admin/cursos'
          className='flex items-center gap-2 text-sm text-txt-muted hover:text-cream-100 transition-colors'
        >
          <ArrowLeft size={16} />
          Voltar
        </Link>
        <button
          type='submit'
          disabled={saving}
          className='flex items-center gap-2 px-4 py-2 bg-gold-500 hover:bg-gold-400 disabled:bg-gold-500/50 text-navy-950 text-sm font-medium rounded-lg transition-colors'
        >
          <Save size={16} />
          {saving ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar Curso'}
        </button>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2 space-y-6'>
          <div className='bg-navy-900 border border-gold-500/10 rounded-xl p-5 space-y-4'>
            <h3 className='text-xs font-semibold text-txt-muted uppercase tracking-wider'>
              Informações do Curso
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

            <div>
              <label className={labelClass}>Subtítulo</label>
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
                  placeholder='auto-gerado'
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Categoria *</label>
                <input
                  type='text'
                  value={form.category}
                  onChange={e => updateField('category', e.target.value)}
                  placeholder='Ex: Concursos Públicos'
                  required
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Descrição Curta *</label>
              <textarea
                value={form.description}
                onChange={e => updateField('description', e.target.value)}
                required
                rows={3}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Descrição Longa *</label>
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
                Tópicos (separados por vírgula)
              </label>
              <input
                type='text'
                value={topicsText}
                onChange={e => setTopicsText(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div className='bg-navy-900 border border-gold-500/10 rounded-xl p-5 space-y-4'>
            <div className='flex items-center justify-between'>
              <h3 className='text-xs font-semibold text-txt-muted uppercase tracking-wider'>
                Módulos
              </h3>
              <button
                type='button'
                onClick={addModule}
                className='flex items-center gap-1 px-3 py-1.5 text-xs bg-navy-800 text-cream-200 rounded-lg hover:bg-navy-700 transition-colors'
              >
                <Plus size={12} />
                Adicionar Módulo
              </button>
            </div>

            {form.modules.map((mod, modIndex) => (
              <div
                key={modIndex}
                className='border border-gold-500/10 rounded-lg p-4 space-y-3'
              >
                <div className='flex items-center justify-between'>
                  <span className='text-xs text-txt-muted'>
                    Módulo {modIndex + 1}
                  </span>
                  <button
                    type='button'
                    onClick={() => removeModule(modIndex)}
                    className='p-1 text-txt-muted hover:text-red-400 transition-colors'
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className='grid grid-cols-2 gap-3'>
                  <div>
                    <label className={labelClass}>Título</label>
                    <input
                      type='text'
                      value={mod.title}
                      onChange={e =>
                        updateModule(modIndex, 'title', e.target.value)
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Duração</label>
                    <input
                      type='text'
                      value={mod.duration}
                      onChange={e =>
                        updateModule(modIndex, 'duration', e.target.value)
                      }
                      placeholder='Ex: 2h30'
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Descrição</label>
                  <input
                    type='text'
                    value={mod.description}
                    onChange={e =>
                      updateModule(modIndex, 'description', e.target.value)
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Aulas</label>
                  {mod.lessons.map((lesson, lessonIndex) => (
                    <input
                      key={lessonIndex}
                      type='text'
                      value={lesson}
                      onChange={e =>
                        updateLesson(modIndex, lessonIndex, e.target.value)
                      }
                      placeholder={`Aula ${lessonIndex + 1}`}
                      className={`${inputClass} mb-2`}
                    />
                  ))}
                  <button
                    type='button'
                    onClick={() => addLesson(modIndex)}
                    className='text-xs text-gold-500 hover:text-gold-400'
                  >
                    + Adicionar aula
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='space-y-6'>
          <div className='bg-navy-900 border border-gold-500/10 rounded-xl p-5 space-y-4'>
            <h3 className='text-xs font-semibold text-txt-muted uppercase tracking-wider'>
              Imagem
            </h3>
            <ImageUpload
              value={form.image}
              onChange={url => updateField('image', url)}
              folder='ferri-schoedl/cursos'
            />
          </div>

          <div className='bg-navy-900 border border-gold-500/10 rounded-xl p-5 space-y-4'>
            <h3 className='text-xs font-semibold text-txt-muted uppercase tracking-wider'>
              Preço e Detalhes
            </h3>

            <div>
              <label className={labelClass}>Preço (R$) *</label>
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
              <label className={labelClass}>Preço Original (R$)</label>
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
              <label className={labelClass}>Duração Total *</label>
              <input
                type='text'
                value={form.duration}
                onChange={e => updateField('duration', e.target.value)}
                placeholder='Ex: 40 horas'
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Nível</label>
              <select
                value={form.level}
                onChange={e => updateField('level', e.target.value)}
                className={inputClass}
              >
                <option value='iniciante'>Iniciante</option>
                <option value='intermediario'>Intermediário</option>
                <option value='avancado'>Avançado</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Instrutor</label>
              <input
                type='text'
                value={form.instructor}
                onChange={e => updateField('instructor', e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div className='bg-navy-900 border border-gold-500/10 rounded-xl p-5 space-y-4'>
            <h3 className='text-xs font-semibold text-txt-muted uppercase tracking-wider'>
              Status
            </h3>

            <div>
              <label className={labelClass}>Estado</label>
              <select
                value={form.status}
                onChange={e => updateField('status', e.target.value)}
                className={inputClass}
              >
                <option value='rascunho'>Rascunho</option>
                <option value='publicado'>Publicado</option>
                <option value='arquivado'>Arquivado</option>
              </select>
              <p className='mt-1.5 text-[11px] text-gold-500/70'>
                Apenas cursos com estado &quot;Publicado&quot; aparecem no site.
              </p>
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
            <label className='flex items-center gap-3 cursor-pointer'>
              <input
                type='checkbox'
                checked={form.featured}
                onChange={e => updateField('featured', e.target.checked)}
                className='w-4 h-4 rounded border-navy-600 text-gold-500 focus:ring-gold-500/50 bg-navy-950'
              />
              <span className='text-sm text-cream-200'>Destaque</span>
            </label>

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
