'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  FileText,
  Settings,
  LogOut,
  Newspaper,
  ChevronLeft,
  ChevronRight,
  UserCog,
} from 'lucide-react';
import { useState } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/livros', label: 'Livros', icon: BookOpen },
  { href: '/admin/cursos', label: 'Cursos', icon: GraduationCap },
  { href: '/admin/publicacoes', label: 'Publicações', icon: Newspaper },
  { href: '/admin/conteudo', label: 'Conteúdo do Site', icon: FileText },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={`${
        collapsed ? 'w-16' : 'w-64'
      } flex min-h-screen flex-col border-r border-gold-500/10 bg-navy-900 transition-all duration-200`}
    >
      <div className='flex items-center justify-between border-b border-gold-500/10 p-4'>
        {!collapsed && (
          <div>
            <h2
              className='text-lg font-semibold text-cream-100'
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              Ferri Schoedl
            </h2>
            <p className='text-xs text-txt-muted'>Admin</p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className='rounded-lg p-1.5 text-txt-muted transition-colors hover:bg-navy-800 hover:text-cream-100'
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <nav className='flex-1 space-y-1 p-3'>
        {navItems.map(item => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? 'bg-gold-500/10 text-gold-500'
                  : 'text-txt-muted hover:bg-navy-800 hover:text-cream-100'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={18} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className='space-y-1 border-t border-gold-500/10 p-3'>
        {!collapsed && (
          <div className='mb-2 flex justify-center'>
            <ThemeToggle />
          </div>
        )}
        <Link
          href='/admin/conta'
          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
            pathname === '/admin/conta'
              ? 'bg-gold-500/10 text-gold-500'
              : 'text-txt-muted hover:bg-navy-800 hover:text-cream-100'
          }`}
          title={collapsed ? 'Minha Conta' : undefined}
        >
          <UserCog size={18} />
          {!collapsed && <span>Minha Conta</span>}
        </Link>
        <Link
          href='/'
          target='_blank'
          className='flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-txt-muted transition-colors hover:bg-navy-800 hover:text-cream-100'
          title={collapsed ? 'Ver Site' : undefined}
        >
          <Settings size={18} />
          {!collapsed && <span>Ver Site</span>}
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className='flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-txt-muted transition-colors hover:bg-red-500/10 hover:text-red-400'
          title={collapsed ? 'Sair' : undefined}
        >
          <LogOut size={18} />
          {!collapsed && <span>Sair</span>}
        </button>
      </div>
    </aside>
  );
}
