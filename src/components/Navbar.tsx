'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useCart } from './CartProvider';

const links = [
  { href: '/', label: 'Home' },
  { href: '/sobre', label: 'Sobre' },
  { href: '/areas-de-atuacao', label: 'Áreas de Atuação' },
  { href: '/livros', label: 'Livros' },
  { href: '/publicacoes', label: 'Publicações' },
  { href: '/cursos', label: 'Cursos' },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems, setIsOpen: setCartOpen } = useCart();

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
      {/* ========== DESKTOP NAV (lg+) ========== */}
      <nav className='mx-auto hidden max-w-7xl items-center justify-between px-6 py-4 lg:flex lg:px-8'>
        {/* Logo */}
        <Link href='/' className='group flex items-center gap-3'>
          <Image
            src='/images/thales-logo.png'
            alt='Ferri Schoedl Advocacia'
            width={52}
            height={52}
            className='h-13 w-auto transition-opacity duration-300 group-hover:opacity-80'
            priority
          />
          <div>
            <span className='font-[family-name:var(--font-cormorant)] text-xl tracking-wide text-cream-100'>
              Ferri Schoedl
            </span>
            <span className='ml-2 font-[family-name:var(--font-cormorant)] text-xl tracking-wide text-gold-500'>
              Advocacia
            </span>
          </div>
        </Link>

        {/* Desktop links */}
        <div className='flex items-center gap-1'>
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

        {/* CTA + Cart + Theme */}
        <div className='flex items-center gap-3'>
          <ThemeToggle />
          <button
            onClick={() => setCartOpen(true)}
            className='relative flex h-9 w-9 items-center justify-center border border-gold-500/20 text-gold-500 transition-all duration-300 hover:border-gold-500/50 hover:bg-gold-500/5'
            aria-label='Carrinho'
          >
            <ShoppingBag size={15} strokeWidth={1.5} />
            {totalItems > 0 && (
              <span className='absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center bg-gold-500 text-[9px] font-medium text-navy-950'>
                {totalItems}
              </span>
            )}
          </button>
          <Link
            href='/contato'
            className='border border-gold-500/50 px-5 py-2 text-xs font-medium uppercase tracking-[2px] text-gold-500 transition-all duration-300 hover:border-gold-500 hover:bg-gold-500 hover:text-navy-950'
          >
            Contato
          </Link>
        </div>
      </nav>

      {/* ========== MOBILE NAV (<lg) ========== */}
      <nav className='relative flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 lg:hidden'>
        {/* Left: Menu toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className='flex h-10 w-10 items-center justify-center text-cream-100'
          aria-label='Menu'
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Center: Logo */}
        <Link
          href='/'
          className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
        >
          <Image
            src='/images/thales-logo.png'
            alt='Ferri Schoedl Advocacia'
            width={44}
            height={44}
            className='h-11 w-auto'
            priority
          />
        </Link>

        {/* Right: Theme + Cart */}
        <div className='flex items-center gap-2'>
          <ThemeToggle />
          <button
            onClick={() => setCartOpen(true)}
            className='relative flex h-9 w-9 items-center justify-center border border-gold-500/20 text-gold-500 transition-all duration-300 hover:border-gold-500/50 hover:bg-gold-500/5'
            aria-label='Carrinho'
          >
            <ShoppingBag size={15} strokeWidth={1.5} />
            {totalItems > 0 && (
              <span className='absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center bg-gold-500 text-[9px] font-medium text-navy-950'>
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu dropdown */}
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
                  className={`border-b border-gold-500/5 py-3.5 text-sm tracking-wide ${
                    isActive ? 'text-gold-500' : 'text-txt-muted'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href='/contato'
              className='mt-4 border border-gold-500/50 py-3 text-center text-xs font-medium uppercase tracking-[2px] text-gold-500'
            >
              Contato
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
