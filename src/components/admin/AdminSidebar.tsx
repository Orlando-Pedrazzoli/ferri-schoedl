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

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/livros', label: 'Livros', icon: BookOpen },
  { href: '/admin/cursos', label: 'Cursos', icon: GraduationCap },
  { href: '/admin/publicacoes', label: 'Publicacoes', icon: Newspaper },
  { href: '/admin/conteudo', label: 'Conteudo do Site', icon: FileText },
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
      } min-h-screen bg-[#111827] border-r border-[#1f2937] flex flex-col transition-all duration-200`}
    >
      <div className='p-4 border-b border-[#1f2937] flex items-center justify-between'>
        {!collapsed && (
          <div>
            <h2
              className='text-lg font-semibold text-white'
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              Ferri Schoedl
            </h2>
            <p className='text-xs text-gray-500'>Admin</p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className='p-1.5 text-gray-400 hover:text-white hover:bg-[#1f2937] rounded-lg transition-colors'
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <nav className='flex-1 p-3 space-y-1'>
        {navItems.map(item => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-amber-600/10 text-amber-500'
                  : 'text-gray-400 hover:text-white hover:bg-[#1f2937]'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={18} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className='p-3 border-t border-[#1f2937] space-y-1'>
        <Link
          href='/admin/conta'
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
            pathname === '/admin/conta'
              ? 'bg-amber-600/10 text-amber-500'
              : 'text-gray-400 hover:text-white hover:bg-[#1f2937]'
          }`}
          title={collapsed ? 'Minha Conta' : undefined}
        >
          <UserCog size={18} />
          {!collapsed && <span>Minha Conta</span>}
        </Link>
        <Link
          href='/'
          target='_blank'
          className='flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-[#1f2937] transition-colors'
          title={collapsed ? 'Ver Site' : undefined}
        >
          <Settings size={18} />
          {!collapsed && <span>Ver Site</span>}
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className='flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors w-full'
          title={collapsed ? 'Sair' : undefined}
        >
          <LogOut size={18} />
          {!collapsed && <span>Sair</span>}
        </button>
      </div>
    </aside>
  );
}
