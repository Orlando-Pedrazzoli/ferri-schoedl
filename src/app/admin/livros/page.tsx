'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { DeleteModal } from '@/components/admin/DeleteModal';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface Book {
  _id: string;
  title: string;
  subtitle?: string;
  author: string;
  year: number;
  price: number;
  image: string;
  inStock: boolean;
  featured: boolean;
  saleType: string;
  isActive: boolean;
  order: number;
}

export default function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await fetch('/api/admin/books');
      const data = await res.json();
      if (data.success) setBooks(data.data);
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
      const res = await fetch(`/api/admin/books/${deleteId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setBooks(books.filter(b => b._id !== deleteId));
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
        title='Livros'
        description={`${books.length} livros registados`}
        actions={
          <Link
            href='/admin/livros/novo'
            className='flex items-center gap-2 px-4 py-2 bg-gold-500 hover:bg-gold-400 text-navy-950 text-sm font-medium rounded-lg transition-colors'
          >
            <Plus size={16} />
            Novo Livro
          </Link>
        }
      />

      <div className='flex-1 p-6 overflow-auto'>
        {loading ? (
          <div className='text-txt-muted text-center py-12'>Carregando...</div>
        ) : books.length === 0 ? (
          <div className='text-center py-12'>
            <p className='text-txt-muted mb-4'>Nenhum livro registado.</p>
            <Link
              href='/admin/livros/novo'
              className='text-gold-500 hover:text-gold-400'
            >
              Adicionar primeiro livro
            </Link>
          </div>
        ) : (
          <div className='bg-navy-900 border border-gold-500/10 rounded-xl overflow-hidden'>
            <table className='w-full'>
              <thead>
                <tr className='border-b border-gold-500/10'>
                  <th className='text-left text-xs font-medium text-txt-muted uppercase tracking-wider px-4 py-3'>
                    Livro
                  </th>
                  <th className='text-left text-xs font-medium text-txt-muted uppercase tracking-wider px-4 py-3'>
                    Ano
                  </th>
                  <th className='text-left text-xs font-medium text-txt-muted uppercase tracking-wider px-4 py-3'>
                    Preço
                  </th>
                  <th className='text-left text-xs font-medium text-txt-muted uppercase tracking-wider px-4 py-3'>
                    Tipo
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
                {books.map(book => (
                  <tr
                    key={book._id}
                    className='hover:bg-navy-800/50 transition-colors'
                  >
                    <td className='px-4 py-3'>
                      <div className='flex items-center gap-3'>
                        <div className='w-10 h-14 relative rounded overflow-hidden bg-navy-800 flex-shrink-0'>
                          {book.image && (
                            <Image
                              src={book.image}
                              alt={book.title}
                              fill
                              className='object-cover'
                            />
                          )}
                        </div>
                        <div className='min-w-0'>
                          <p className='text-sm font-medium text-cream-100 truncate'>
                            {book.title}
                          </p>
                          {book.subtitle && (
                            <p className='text-xs text-txt-muted truncate'>
                              {book.subtitle}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className='px-4 py-3 text-sm text-cream-200'>
                      {book.year}
                    </td>
                    <td className='px-4 py-3 text-sm text-cream-200'>
                      R$ {book.price.toFixed(2)}
                    </td>
                    <td className='px-4 py-3'>
                      <StatusBadge status={book.saleType} />
                    </td>
                    <td className='px-4 py-3'>
                      <StatusBadge
                        status={book.isActive ? 'Ativo' : 'Inativo'}
                      />
                    </td>
                    <td className='px-4 py-3'>
                      <div className='flex items-center justify-end gap-2'>
                        <Link
                          href={`/admin/livros/${book._id}/editar`}
                          className='p-2 text-txt-muted hover:text-gold-500 hover:bg-gold-500/10 rounded-lg transition-colors'
                        >
                          <Pencil size={14} />
                        </Link>
                        <button
                          onClick={() => setDeleteId(book._id)}
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
        title='Eliminar Livro'
        message='Tem a certeza que deseja eliminar este livro? Esta ação não pode ser desfeita.'
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </>
  );
}
