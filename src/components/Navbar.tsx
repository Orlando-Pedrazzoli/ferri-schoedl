'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

const links = [
  { href: '/', label: 'Home' },
  { href: '/sobre', label: 'Sobre' },
  { href: '/areas-de-atuacao', label: 'Areas de Atuacao' },
  { href: '/publicacoes', label: 'Publicacoes' },
  { href: '/cursos', label: 'Cursos' },
  { href: '/contato', label: 'Contato' },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-navy-950/95 backdrop-blur-md border-b border-gold-500/10'
          : 'bg-transparent'
      }`}
    >
      <nav className='mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8'>
        {/* Logo */}
        <Link href='/' className='group flex items-center gap-3'>
          <Image
            src='/images/thales-logo.png'
            alt='Ferri Schoedl Advocacia'
            width={40}
            height={40}
            className='h-10 w-auto transition-opacity duration-300 group-hover:opacity-80'
            priority
          />
          <div className='hidden sm:block'>
            <span className='font-[family-name:var(--font-cormorant)] text-lg tracking-wide text-cream-100'>
              Advocacia
            </span>
          </div>
        </Link>

        {/* Desktop links */}
        <div className='hidden items-center gap-1 lg:flex'>
          {links.map(link => {
            const isActive =
              link.href === '/'
                ? pathname === '/'
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 text-[13px] tracking-wide transition-colors duration-200 ${
                  isActive
                    ? 'text-gold-500'
                    : 'text-txt-muted hover:text-cream-100'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className='absolute bottom-0 left-4 right-4 h-px bg-gold-500/50' />
                )}
              </Link>
            );
          })}
        </div>

        {/* CTA + Theme + Mobile toggle */}
        <div className='flex items-center gap-3'>
          <ThemeToggle />
          <Link
            href='/contato'
            className='hidden border border-gold-500/50 px-5 py-2 text-[11px] font-medium uppercase tracking-[2px] text-gold-500 transition-all duration-300 hover:border-gold-500 hover:bg-gold-500 hover:text-navy-950 sm:block'
          >
            Fale conosco
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className='text-cream-100 lg:hidden'
            aria-label='Menu'
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className='border-t border-gold-500/10 bg-navy-950/98 backdrop-blur-md lg:hidden'>
          <div className='flex flex-col px-6 py-4'>
            {links.map(link => {
              const isActive =
                link.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`border-b border-gold-500/5 py-3 text-[14px] tracking-wide ${
                    isActive ? 'text-gold-500' : 'text-txt-muted'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href='/contato'
              className='mt-4 border border-gold-500/50 py-3 text-center text-[11px] font-medium uppercase tracking-[2px] text-gold-500'
            >
              Fale conosco
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
