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
    'w-full px-3 py-2 bg-[#0a0f1c] border border-[#1f2937] rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-colors';
  const labelClass = 'block text-sm font-medium text-gray-300 mb-1';

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
          {saving ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar Curso'}
        </button>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2 space-y-6'>
          {/* Basic info */}
          <div className='bg-[#111827] border border-[#1f2937] rounded-xl p-5 space-y-4'>
            <h3 className='text-sm font-semibold text-white uppercase tracking-wider'>
              Informacoes do Curso
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
                  placeholder='Ex: Concursos Publicos'
                  required
                  className={inputClass}
                />
              </div>
            </div>

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
                className={inputClass}
              />
            </div>
          </div>

          {/* Modules */}
          <div className='bg-[#111827] border border-[#1f2937] rounded-xl p-5 space-y-4'>
            <div className='flex items-center justify-between'>
              <h3 className='text-sm font-semibold text-white uppercase tracking-wider'>
                Modulos
              </h3>
              <button
                type='button'
                onClick={addModule}
                className='flex items-center gap-1 px-3 py-1.5 text-xs bg-[#1f2937] text-gray-300 rounded-lg hover:bg-[#374151] transition-colors'
              >
                <Plus size={12} />
                Adicionar Modulo
              </button>
            </div>

            {form.modules.map((mod, modIndex) => (
              <div
                key={modIndex}
                className='border border-[#1f2937] rounded-lg p-4 space-y-3'
              >
                <div className='flex items-center justify-between'>
                  <span className='text-xs text-gray-500'>
                    Modulo {modIndex + 1}
                  </span>
                  <button
                    type='button'
                    onClick={() => removeModule(modIndex)}
                    className='p-1 text-gray-400 hover:text-red-400 transition-colors'
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className='grid grid-cols-2 gap-3'>
                  <div>
                    <label className={labelClass}>Titulo</label>
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
                    <label className={labelClass}>Duracao</label>
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
                  <label className={labelClass}>Descricao</label>
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
                    className='text-xs text-amber-500 hover:text-amber-400'
                  >
                    + Adicionar aula
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className='space-y-6'>
          <div className='bg-[#111827] border border-[#1f2937] rounded-xl p-5 space-y-4'>
            <h3 className='text-sm font-semibold text-white uppercase tracking-wider'>
              Imagem
            </h3>
            <ImageUpload
              value={form.image}
              onChange={url => updateField('image', url)}
              folder='ferri-schoedl/cursos'
            />
          </div>

          <div className='bg-[#111827] border border-[#1f2937] rounded-xl p-5 space-y-4'>
            <h3 className='text-sm font-semibold text-white uppercase tracking-wider'>
              Preco e Detalhes
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
              <label className={labelClass}>Duracao Total *</label>
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
              <label className={labelClass}>Nivel</label>
              <select
                value={form.level}
                onChange={e => updateField('level', e.target.value)}
                className={inputClass}
              >
                <option value='iniciante'>Iniciante</option>
                <option value='intermediario'>Intermediario</option>
                <option value='avancado'>Avancado</option>
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

          <div className='bg-[#111827] border border-[#1f2937] rounded-xl p-5 space-y-4'>
            <h3 className='text-sm font-semibold text-white uppercase tracking-wider'>
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
            <label className='flex items-center gap-3 cursor-pointer'>
              <input
                type='checkbox'
                checked={form.featured}
                onChange={e => updateField('featured', e.target.checked)}
                className='w-4 h-4 rounded border-gray-600 text-amber-600 focus:ring-amber-500/50 bg-[#0a0f1c]'
              />
              <span className='text-sm text-gray-300'>Destaque</span>
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
