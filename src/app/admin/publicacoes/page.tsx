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
      if (data.success) setArticles(articles.filter(a => a._id !== deleteId));
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
        title='Publicacoes'
        description={`${articles.length} artigos registados`}
        actions={
          <Link
            href='/admin/publicacoes/novo'
            className='flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-lg transition-colors'
          >
            <Plus size={16} />
            Novo Artigo
          </Link>
        }
      />
      <div className='flex-1 p-6 overflow-auto'>
        {loading ? (
          <div className='text-gray-400 text-center py-12'>Carregando...</div>
        ) : articles.length === 0 ? (
          <div className='text-center py-12'>
            <p className='text-gray-400 mb-4'>Nenhum artigo registado.</p>
            <Link
              href='/admin/publicacoes/novo'
              className='text-amber-500 hover:text-amber-400'
            >
              Adicionar primeiro artigo
            </Link>
          </div>
        ) : (
          <div className='bg-[#111827] border border-[#1f2937] rounded-xl overflow-hidden'>
            <table className='w-full'>
              <thead>
                <tr className='border-b border-[#1f2937]'>
                  <th className='text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3'>
                    Titulo
                  </th>
                  <th className='text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3'>
                    Publicacao
                  </th>
                  <th className='text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3'>
                    Ano
                  </th>
                  <th className='text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3'>
                    Status
                  </th>
                  <th className='text-right text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3'>
                    Acoes
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-[#1f2937]'>
                {articles.map(article => (
                  <tr
                    key={article._id}
                    className='hover:bg-[#1f2937]/50 transition-colors'
                  >
                    <td className='px-4 py-3'>
                      <div className='flex items-center gap-2'>
                        <p className='text-sm font-medium text-white truncate max-w-md'>
                          {article.title}
                        </p>
                        {article.url && (
                          <a
                            href={article.url}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-gray-500 hover:text-amber-500 flex-shrink-0'
                          >
                            <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className='px-4 py-3 text-sm text-gray-300'>
                      {article.publisher}
                    </td>
                    <td className='px-4 py-3 text-sm text-gray-300'>
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
                          className='p-2 text-gray-400 hover:text-amber-500 hover:bg-amber-500/10 rounded-lg transition-colors'
                        >
                          <Pencil size={14} />
                        </Link>
                        <button
                          onClick={() => setDeleteId(article._id)}
                          className='p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors'
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
        title='Eliminar Artigo'
        message='Tem a certeza que deseja eliminar este artigo?'
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </>
  );
}
