'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { ArticleForm } from '@/components/admin/ArticleForm';

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

export default function EditArticlePage() {
  const params = useParams();
  const [article, setArticle] = useState<ArticleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(`/api/admin/articles/${params.id}`);
        const data = await res.json();
        if (data.success) setArticle(data.data);
        else setError('Publicação não encontrada');
      } catch {
        setError('Erro ao carregar publicação');
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchArticle();
  }, [params.id]);

  if (loading) {
    return (
      <>
        <AdminHeader title='Editar Publicação' />
        <div className='flex-1 p-6 flex items-center justify-center'>
          <p className='text-txt-muted'>Carregando...</p>
        </div>
      </>
    );
  }

  if (error || !article) {
    return (
      <>
        <AdminHeader title='Erro' />
        <div className='flex-1 p-6 flex items-center justify-center'>
          <p className='text-red-400'>{error}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminHeader title='Editar Publicação' description={article.title} />
      <div className='flex-1 p-6 overflow-auto'>
        <ArticleForm initialData={article} isEditing />
      </div>
    </>
  );
}
