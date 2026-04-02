'use client';

import { useEffect, useState } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Save, Check, RefreshCw } from 'lucide-react';

interface ContentItem {
  _id: string;
  key: string;
  page: string;
  section: string;
  field: string;
  value: string;
  type: 'text' | 'textarea' | 'richtext' | 'json';
  label: string;
  description?: string;
}

const PAGE_LABELS: Record<string, string> = {
  home: 'Homepage',
  sobre: 'Sobre',
  contato: 'Contato',
  cursos: 'Cursos',
  faq: 'FAQ',
  areas: 'Áreas de Atuação',
  config: 'Configurações Gerais',
};

const PAGE_ORDER = [
  'config',
  'home',
  'sobre',
  'areas',
  'cursos',
  'contato',
  'faq',
];

export default function AdminContentPage() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingKeys, setSavingKeys] = useState<Set<string>>(new Set());
  const [savedKeys, setSavedKeys] = useState<Set<string>>(new Set());
  const [editedValues, setEditedValues] = useState<Record<string, string>>({});
  const [activePage, setActivePage] = useState('config');

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const res = await fetch('/api/admin/content');
      const data = await res.json();
      if (data.success) setContent(data.data);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleValueChange = (key: string, value: string) => {
    setEditedValues(prev => ({ ...prev, [key]: value }));
    setSavedKeys(prev => {
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
  };

  const handleSave = async (item: ContentItem) => {
    const newValue = editedValues[item.key] ?? item.value;
    setSavingKeys(prev => new Set(prev).add(item.key));

    try {
      const res = await fetch(
        `/api/admin/content/${encodeURIComponent(item.key)}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ value: newValue }),
        },
      );

      const data = await res.json();
      if (data.success) {
        setContent(prev =>
          prev.map(c => (c.key === item.key ? { ...c, value: newValue } : c)),
        );
        setEditedValues(prev => {
          const next = { ...prev };
          delete next[item.key];
          return next;
        });
        setSavedKeys(prev => new Set(prev).add(item.key));
        setTimeout(() => {
          setSavedKeys(prev => {
            const next = new Set(prev);
            next.delete(item.key);
            return next;
          });
        }, 3000);
      }
    } catch (err) {
      console.error('Error saving:', err);
    } finally {
      setSavingKeys(prev => {
        const next = new Set(prev);
        next.delete(item.key);
        return next;
      });
    }
  };

  const grouped = content.reduce<Record<string, ContentItem[]>>((acc, item) => {
    if (!acc[item.page]) acc[item.page] = [];
    acc[item.page].push(item);
    return acc;
  }, {});

  const pages = PAGE_ORDER.filter(p => grouped[p]);
  const filteredContent = grouped[activePage] || [];

  const sectionGroups = filteredContent.reduce<Record<string, ContentItem[]>>(
    (acc, item) => {
      if (!acc[item.section]) acc[item.section] = [];
      acc[item.section].push(item);
      return acc;
    },
    {},
  );

  return (
    <>
      <AdminHeader
        title='Conteúdo do Site'
        description='Edite os textos de todas as páginas'
        actions={
          <button
            onClick={fetchContent}
            className='flex items-center gap-2 rounded-lg border border-gold-500/20 px-3 py-2 text-sm text-txt-muted transition-colors hover:border-gold-500/40 hover:text-cream-100'
          >
            <RefreshCw size={14} />
            Recarregar
          </button>
        }
      />

      <div className='flex flex-1 overflow-hidden'>
        {/* Page tabs - sidebar */}
        <div className='w-48 space-y-1 overflow-auto border-r border-gold-500/10 bg-navy-900 p-3'>
          {pages.map(page => (
            <button
              key={page}
              onClick={() => setActivePage(page)}
              className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                activePage === page
                  ? 'bg-gold-500/10 font-medium text-gold-500'
                  : 'text-txt-muted hover:bg-navy-800 hover:text-cream-100'
              }`}
            >
              {PAGE_LABELS[page] || page}
              <span className='ml-1 text-xs text-txt-muted/50'>
                ({grouped[page]?.length || 0})
              </span>
            </button>
          ))}
        </div>

        {/* Content editor */}
        <div className='flex-1 overflow-auto p-6'>
          {loading ? (
            <div className='py-12 text-center text-txt-muted'>
              Carregando...
            </div>
          ) : (
            <div className='max-w-3xl space-y-6'>
              {Object.entries(sectionGroups).map(([section, items]) => (
                <div
                  key={section}
                  className='rounded-xl border border-gold-500/10 bg-navy-900 p-5'
                >
                  <h3 className='mb-4 text-xs font-semibold uppercase tracking-wider text-txt-muted'>
                    {section}
                  </h3>

                  <div className='space-y-4'>
                    {items.map(item => {
                      const currentValue = editedValues[item.key] ?? item.value;
                      const isEdited =
                        item.key in editedValues &&
                        editedValues[item.key] !== item.value;
                      const isSaving = savingKeys.has(item.key);
                      const isSaved = savedKeys.has(item.key);

                      return (
                        <div key={item._id}>
                          <div className='mb-1 flex items-center justify-between'>
                            <label className='text-sm font-medium text-cream-100'>
                              {item.label}
                            </label>
                            <div className='flex items-center gap-2'>
                              {isSaved && (
                                <span className='flex items-center gap-1 text-xs text-green-400'>
                                  <Check size={12} />
                                  Salvo
                                </span>
                              )}
                              {isEdited && (
                                <button
                                  onClick={() => handleSave(item)}
                                  disabled={isSaving}
                                  className='flex items-center gap-1 rounded bg-gold-500 px-2 py-1 text-xs text-navy-950 transition-colors hover:bg-gold-400 disabled:opacity-50'
                                >
                                  <Save size={10} />
                                  {isSaving ? '...' : 'Salvar'}
                                </button>
                              )}
                            </div>
                          </div>

                          {item.description && (
                            <p className='mb-1 text-xs text-txt-muted'>
                              {item.description}
                            </p>
                          )}

                          {item.type === 'text' ? (
                            <input
                              type='text'
                              value={currentValue}
                              onChange={e =>
                                handleValueChange(item.key, e.target.value)
                              }
                              className='w-full rounded-lg border border-gold-500/15 bg-navy-950 px-3 py-2 text-sm text-cream-100 placeholder-txt-muted/50 transition-colors focus:border-gold-500/40 focus:outline-none focus:ring-1 focus:ring-gold-500/30'
                            />
                          ) : item.type === 'json' ? (
                            <textarea
                              value={currentValue}
                              onChange={e =>
                                handleValueChange(item.key, e.target.value)
                              }
                              rows={6}
                              className='w-full rounded-lg border border-gold-500/15 bg-navy-950 px-3 py-2 font-mono text-xs text-cream-100 placeholder-txt-muted/50 transition-colors focus:border-gold-500/40 focus:outline-none focus:ring-1 focus:ring-gold-500/30'
                            />
                          ) : (
                            <textarea
                              value={currentValue}
                              onChange={e =>
                                handleValueChange(item.key, e.target.value)
                              }
                              rows={item.type === 'richtext' ? 8 : 4}
                              className='w-full rounded-lg border border-gold-500/15 bg-navy-950 px-3 py-2 text-sm text-cream-100 placeholder-txt-muted/50 transition-colors focus:border-gold-500/40 focus:outline-none focus:ring-1 focus:ring-gold-500/30'
                            />
                          )}

                          <p className='mt-1 font-mono text-[10px] text-txt-muted/40'>
                            {item.key}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
