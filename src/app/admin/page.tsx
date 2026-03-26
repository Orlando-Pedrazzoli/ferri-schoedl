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
      label: 'Artigos',
      count: stats.articles,
      icon: Newspaper,
      href: '/admin/publicacoes',
      color: 'green',
    },
    {
      label: 'Conteudos',
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
        description='Visao geral do painel administrativo'
      />

      <div className='flex-1 p-6 overflow-auto'>
        {/* Stats Cards */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
          {cards.map(card => {
            const Icon = card.icon;
            const colors = colorClasses[card.color];

            return (
              <Link
                key={card.label}
                href={card.href}
                className='bg-[#111827] border border-[#1f2937] rounded-xl p-5 hover:border-[#374151] transition-colors'
              >
                <div className='flex items-center justify-between mb-3'>
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors.bg}`}
                  >
                    <Icon size={20} className={colors.icon} />
                  </div>
                </div>
                <p className={`text-2xl font-bold ${colors.text}`}>
                  {loading ? '...' : card.count}
                </p>
                <p className='text-sm text-gray-400 mt-1'>{card.label}</p>
              </Link>
            );
          })}
        </div>

        {/* Seed Section */}
        <div className='bg-[#111827] border border-[#1f2937] rounded-xl p-6'>
          <div className='flex items-center gap-3 mb-4'>
            <Database size={20} className='text-gray-400' />
            <h2 className='text-lg font-semibold text-white'>Base de Dados</h2>
          </div>
          <p className='text-sm text-gray-400 mb-4'>
            Se a base de dados estiver vazia, execute o seed para popular com os
            dados iniciais do site (livros, artigos e conteudos de paginas).
          </p>

          <button
            onClick={handleSeed}
            disabled={seedLoading}
            className='px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-600/50 text-white text-sm font-medium rounded-lg transition-colors'
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
      </div>
    </>
  );
}
