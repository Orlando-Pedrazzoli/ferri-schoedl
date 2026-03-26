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
  areas: 'Areas de Atuacao',
  config: 'Configuracoes Gerais',
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
    // Remove saved indicator when editing
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
        // Update local state
        setContent(prev =>
          prev.map(c => (c.key === item.key ? { ...c, value: newValue } : c)),
        );
        // Remove from edited, add to saved
        setEditedValues(prev => {
          const next = { ...prev };
          delete next[item.key];
          return next;
        });
        setSavedKeys(prev => new Set(prev).add(item.key));

        // Remove saved indicator after 3s
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

  // Group by page
  const grouped = content.reduce<Record<string, ContentItem[]>>((acc, item) => {
    if (!acc[item.page]) acc[item.page] = [];
    acc[item.page].push(item);
    return acc;
  }, {});

  const pages = PAGE_ORDER.filter(p => grouped[p]);

  const filteredContent = grouped[activePage] || [];

  // Group filtered content by section
  const sectionGroups = filteredContent.reduce<Record<string, ContentItem[]>>(
    (acc, item) => {
      if (!acc[item.section]) acc[item.section] = [];
      acc[item.section].push(item);
      return acc;
    },
    {},
  );

  const inputClass =
    'w-full px-3 py-2 bg-[#0a0f1c] border border-[#1f2937] rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-colors';

  return (
    <>
      <AdminHeader
        title='Conteudo do Site'
        description='Edite os textos de todas as paginas'
        actions={
          <button
            onClick={fetchContent}
            className='flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white bg-[#1f2937] rounded-lg transition-colors'
          >
            <RefreshCw size={14} />
            Recarregar
          </button>
        }
      />

      <div className='flex-1 flex overflow-hidden'>
        {/* Page tabs - sidebar */}
        <div className='w-48 bg-[#111827] border-r border-[#1f2937] p-3 space-y-1 overflow-auto'>
          {pages.map(page => (
            <button
              key={page}
              onClick={() => setActivePage(page)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                activePage === page
                  ? 'bg-amber-600/10 text-amber-500 font-medium'
                  : 'text-gray-400 hover:text-white hover:bg-[#1f2937]'
              }`}
            >
              {PAGE_LABELS[page] || page}
              <span className='ml-1 text-xs text-gray-600'>
                ({grouped[page]?.length || 0})
              </span>
            </button>
          ))}
        </div>

        {/* Content editor */}
        <div className='flex-1 p-6 overflow-auto'>
          {loading ? (
            <div className='text-gray-400 text-center py-12'>Carregando...</div>
          ) : (
            <div className='space-y-6 max-w-3xl'>
              {Object.entries(sectionGroups).map(([section, items]) => (
                <div
                  key={section}
                  className='bg-[#111827] border border-[#1f2937] rounded-xl p-5'
                >
                  <h3 className='text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4'>
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
                          <div className='flex items-center justify-between mb-1'>
                            <label className='text-sm font-medium text-gray-300'>
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
                                  className='flex items-center gap-1 px-2 py-1 text-xs bg-amber-600 hover:bg-amber-700 disabled:bg-amber-600/50 text-white rounded transition-colors'
                                >
                                  <Save size={10} />
                                  {isSaving ? '...' : 'Salvar'}
                                </button>
                              )}
                            </div>
                          </div>

                          {item.description && (
                            <p className='text-xs text-gray-500 mb-1'>
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
                              className={inputClass}
                            />
                          ) : item.type === 'json' ? (
                            <textarea
                              value={currentValue}
                              onChange={e =>
                                handleValueChange(item.key, e.target.value)
                              }
                              rows={6}
                              className={`${inputClass} font-mono text-xs`}
                            />
                          ) : (
                            <textarea
                              value={currentValue}
                              onChange={e =>
                                handleValueChange(item.key, e.target.value)
                              }
                              rows={item.type === 'richtext' ? 8 : 4}
                              className={inputClass}
                            />
                          )}

                          <p className='text-[10px] text-gray-600 mt-1 font-mono'>
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
