'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  Package,
  GraduationCap,
  User,
  LogOut,
  ShoppingBag,
} from 'lucide-react';

const navItems = [
  { href: '/conta', label: 'Minha Conta', icon: LayoutDashboard, exact: true },
  {
    href: '/conta/pedidos',
    label: 'Meus Pedidos',
    icon: Package,
    exact: false,
  },
  {
    href: '/conta/cursos',
    label: 'Meus Cursos',
    icon: GraduationCap,
    exact: false,
  },
  { href: '/conta/perfil', label: 'Meus Dados', icon: User, exact: false },
];

interface CustomerSidebarProps {
  customerName: string;
}

export function CustomerSidebar({ customerName }: CustomerSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <div className='border border-gold-500/10 bg-navy-900/30'>
      {/* Header */}
      <div className='border-b border-gold-500/10 p-5'>
        <div className='flex items-center gap-3'>
          <div className='flex h-10 w-10 items-center justify-center bg-gold-500/10'>
            <User size={18} className='text-gold-500' />
          </div>
          <div className='min-w-0'>
            <p className='truncate text-sm font-medium text-cream-100'>
              {customerName}
            </p>
            <p className='text-xs text-txt-muted'>Cliente</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className='space-y-1 p-3'>
        {navItems.map(item => {
          const Icon = item.icon;
          const active = isActive(item.href, item.exact);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                active
                  ? 'bg-gold-500/10 text-gold-500'
                  : 'text-txt-muted hover:bg-navy-800 hover:text-cream-100'
              }`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className='border-t border-gold-500/10 p-3'>
        <Link
          href='/livros'
          className='flex items-center gap-3 px-3 py-2.5 text-sm text-txt-muted transition-colors hover:bg-navy-800 hover:text-cream-100'
        >
          <ShoppingBag size={18} />
          <span>Continuar comprando</span>
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/conta/login' })}
          className='flex w-full items-center gap-3 px-3 py-2.5 text-sm text-txt-muted transition-colors hover:bg-red-500/10 hover:text-red-400'
        >
          <LogOut size={18} />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
}
