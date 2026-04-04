'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { DeleteModal } from '@/components/admin/DeleteModal';
import { Plus, Pencil, Trash2, ExternalLink } from 'lucide-react';

interface Article {
  _id: string;
  title: string;
  year: number;
  publisher: string;
  url?: string;
  type: string;
  isActive: boolean;
}

export default function AdminPublicacoesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const res = await fetch('/api/admin/articles');
      const data = await res.json();
      if (data.success) setArticles(data.data);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/articles/${deleteId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setArticles(prev => prev.filter(a => a._id !== deleteId));
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  return (
    <>
      <AdminHeader
        title='Publicações'
        description={`${articles.length} publicações registadas`}
        actions={
          <Link
            href='/admin/publicacoes/novo'
            className='flex items-center gap-2 px-4 py-2 bg-gold-500 hover:bg-gold-400 text-navy-950 text-sm font-medium rounded-lg transition-colors'
          >
            <Plus size={16} />
            Nova Publicação
          </Link>
        }
      />

      <div className='flex-1 p-6 overflow-auto'>
        {loading ? (
          <div className='text-txt-muted text-center py-12'>Carregando...</div>
        ) : articles.length === 0 ? (
          <div className='text-center py-12'>
            <p className='text-txt-muted mb-4'>Nenhuma publicação registada.</p>
            <Link
              href='/admin/publicacoes/novo'
              className='text-gold-500 hover:text-gold-400'
            >
              Adicionar primeira publicação
            </Link>
          </div>
        ) : (
          <div className='bg-navy-900 border border-gold-500/10 rounded-xl overflow-hidden'>
            <table className='w-full'>
              <thead>
                <tr className='border-b border-gold-500/10'>
                  <th className='text-left text-xs font-medium text-txt-muted uppercase tracking-wider px-4 py-3'>
                    Título
                  </th>
                  <th className='text-left text-xs font-medium text-txt-muted uppercase tracking-wider px-4 py-3'>
                    Publicação
                  </th>
                  <th className='text-left text-xs font-medium text-txt-muted uppercase tracking-wider px-4 py-3'>
                    Ano
                  </th>
                  <th className='text-left text-xs font-medium text-txt-muted uppercase tracking-wider px-4 py-3'>
                    Status
                  </th>
                  <th className='text-right text-xs font-medium text-txt-muted uppercase tracking-wider px-4 py-3'>
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody className='divide-y divide-gold-500/10'>
                {articles.map(article => (
                  <tr
                    key={article._id}
                    className='hover:bg-navy-800/50 transition-colors'
                  >
                    <td className='px-4 py-3'>
                      <div className='flex items-center gap-2'>
                        <p className='text-sm font-medium text-cream-100 truncate max-w-md'>
                          {article.title}
                        </p>

                        {article.url && (
                          <a
                            href={article.url}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-txt-muted hover:text-gold-500 flex-shrink-0'
                          >
                            <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                    </td>

                    <td className='px-4 py-3 text-sm text-cream-200'>
                      {article.publisher}
                    </td>

                    <td className='px-4 py-3 text-sm text-cream-200'>
                      {article.year}
                    </td>

                    <td className='px-4 py-3'>
                      <StatusBadge
                        status={article.isActive ? 'Ativo' : 'Inativo'}
                      />
                    </td>

                    <td className='px-4 py-3'>
                      <div className='flex items-center justify-end gap-2'>
                        <Link
                          href={`/admin/publicacoes/${article._id}/editar`}
                          className='p-2 text-txt-muted hover:text-gold-500 hover:bg-gold-500/10 rounded-lg transition-colors'
                        >
                          <Pencil size={14} />
                        </Link>

                        <button
                          onClick={() => setDeleteId(article._id)}
                          className='p-2 text-txt-muted hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors'
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <DeleteModal
        isOpen={!!deleteId}
        title='Eliminar Publicação'
        message='Tem a certeza que deseja eliminar esta publicação?'
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </>
  );
}
