'use client';

import { useEffect, useState } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import {
  BookOpen,
  GraduationCap,
  Newspaper,
  FileText,
  Database,
} from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  books: number;
  courses: number;
  articles: number;
  content: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    books: 0,
    courses: 0,
    articles: 0,
    content: 0,
  });
  const [loading, setLoading] = useState(true);
  const [seedLoading, setSeedLoading] = useState(false);
  const [seedMessage, setSeedMessage] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [booksRes, coursesRes, articlesRes, contentRes] = await Promise.all(
        [
          fetch('/api/admin/books'),
          fetch('/api/admin/courses'),
          fetch('/api/admin/articles'),
          fetch('/api/admin/content'),
        ],
      );

      const [books, courses, articles, content] = await Promise.all([
        booksRes.json(),
        coursesRes.json(),
        articlesRes.json(),
        contentRes.json(),
      ]);

      setStats({
        books: books.data?.length || 0,
        courses: courses.data?.length || 0,
        articles: articles.data?.length || 0,
        content: content.data?.length || 0,
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSeed = async () => {
    if (
      !confirm(
        'Isto vai popular a base de dados com os dados iniciais do site. Continuar?',
      )
    )
      return;

    setSeedLoading(true);
    setSeedMessage('');

    try {
      const res = await fetch('/api/admin/seed', { method: 'POST' });
      const data = await res.json();

      if (data.success) {
        setSeedMessage('Seed executado com sucesso!');
        fetchStats();
      } else {
        setSeedMessage('Erro: ' + (data.error || 'Erro desconhecido'));
      }
    } catch {
      setSeedMessage('Erro ao executar seed.');
    } finally {
      setSeedLoading(false);
    }
  };

  const cards = [
    {
      label: 'Livros',
      count: stats.books,
      icon: BookOpen,
      href: '/admin/livros',
      color: 'amber',
    },
    {
      label: 'Cursos',
      count: stats.courses,
      icon: GraduationCap,
      href: '/admin/cursos',
      color: 'blue',
    },
    {
      label: 'Publicações',
      count: stats.articles,
      icon: Newspaper,
      href: '/admin/publicacoes',
      color: 'green',
    },
    {
      label: 'Conteúdos',
      count: stats.content,
      icon: FileText,
      href: '/admin/conteudo',
      color: 'purple',
    },
  ];

  const colorClasses: Record<
    string,
    { bg: string; text: string; icon: string }
  > = {
    amber: {
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      icon: 'text-amber-500',
    },
    blue: {
      bg: 'bg-blue-500/10',
      text: 'text-blue-400',
      icon: 'text-blue-500',
    },
    green: {
      bg: 'bg-green-500/10',
      text: 'text-green-400',
      icon: 'text-green-500',
    },
    purple: {
      bg: 'bg-purple-500/10',
      text: 'text-purple-400',
      icon: 'text-purple-500',
    },
  };

  return (
    <>
      <AdminHeader
        title='Dashboard'
        description='Visão geral do painel administrativo'
      />

      <div className='flex-1 overflow-auto p-6'>
        <div className='mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {cards.map(card => {
            const Icon = card.icon;
            const colors = colorClasses[card.color];

            return (
              <Link
                key={card.label}
                href={card.href}
                className='rounded-xl border border-gold-500/10 bg-navy-900 p-5 transition-colors hover:border-gold-500/25'
              >
                <div className='mb-3 flex items-center justify-between'>
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${colors.bg}`}
                  >
                    <Icon size={20} className={colors.icon} />
                  </div>
                </div>
                <p className={`text-2xl font-bold ${colors.text}`}>
                  {loading ? '...' : card.count}
                </p>
                <p className='mt-1 text-sm text-txt-muted'>{card.label}</p>
              </Link>
            );
          })}
        </div>

        {!loading && stats.books === 0 && stats.articles === 0 && (
          <div className='rounded-xl border border-gold-500/10 bg-navy-900 p-6'>
            <div className='mb-4 flex items-center gap-3'>
              <Database size={20} className='text-txt-muted' />
              <h2 className='text-lg font-semibold text-cream-100'>
                Base de Dados
              </h2>
            </div>
            <p className='mb-4 text-sm text-txt-muted'>
              Se a base de dados estiver vazia, execute o seed para popular com
              os dados iniciais do site (livros, publicações e conteúdos de
              páginas).
            </p>

            <button
              onClick={handleSeed}
              disabled={seedLoading}
              className='rounded-lg bg-gold-500 px-4 py-2 text-sm font-medium text-navy-950 transition-colors hover:bg-gold-400 disabled:opacity-50'
            >
              {seedLoading ? 'Executando...' : 'Executar Seed Inicial'}
            </button>

            {seedMessage && (
              <p
                className={`mt-3 text-sm ${
                  seedMessage.includes('sucesso')
                    ? 'text-green-400'
                    : 'text-red-400'
                }`}
              >
                {seedMessage}
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
