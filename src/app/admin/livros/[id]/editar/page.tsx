'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { BookForm } from '@/components/admin/BookForm';

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

export default function EditBookPage() {
  const params = useParams();
  const [book, setBook] = useState<BookData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(`/api/admin/books/${params.id}`);
        const data = await res.json();

        if (data.success) {
          setBook(data.data);
        } else {
          setError('Livro não encontrado');
        }
      } catch {
        setError('Erro ao carregar livro');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchBook();
  }, [params.id]);

  if (loading) {
    return (
      <>
        <AdminHeader title='Editar Livro' />
        <div className='flex-1 p-6 flex items-center justify-center'>
          <p className='text-txt-muted'>Carregando...</p>
        </div>
      </>
    );
  }

  if (error || !book) {
    return (
      <>
        <AdminHeader title='Erro' />
        <div className='flex-1 p-6 flex items-center justify-center'>
          <p className='text-red-400'>{error || 'Livro não encontrado'}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminHeader title='Editar Livro' description={book.title} />
      <div className='flex-1 p-6 overflow-auto'>
        <BookForm initialData={book} isEditing />
      </div>
    </>
  );
}
