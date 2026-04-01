'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, ShoppingBag, ChevronDown } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useCart } from './CartProvider';
import { useTheme } from './ThemeProvider';

interface NavLink {
  href: string;
  label: string;
  children?: { href: string; label: string }[];
}

const links: NavLink[] = [
  {
    href: '/sobre',
    label: 'O Escritório',
    children: [
      { href: '/sobre', label: 'Sobre' },
      { href: '/areas-de-atuacao', label: 'Áreas de Atuação' },
      { href: '/faq', label: 'Perguntas Frequentes' },
    ],
  },
  {
    href: '/livros',
    label: 'Obras',
    children: [
      { href: '/livros', label: 'Livros à Venda' },
      { href: '/publicacoes', label: 'Publicações e Artigos' },
    ],
  },
  { href: '/cursos', label: 'Cursos' },
];

// Flat list for mobile
const mobileLinks = [
  { href: '/', label: 'Home' },
  { href: '/sobre', label: 'Sobre' },
  { href: '/areas-de-atuacao', label: 'Áreas de Atuação' },
  { href: '/livros', label: 'Livros' },
  { href: '/publicacoes', label: 'Publicações' },
  { href: '/cursos', label: 'Cursos' },
  { href: '/faq', label: 'Perguntas Frequentes' },
];

function DropdownMenu({ link, pathname }: { link: NavLink; pathname: string }) {
  const [open, setOpen] = useState(false);
  const timeout = useRef<NodeJS.Timeout | null>(null);

  const isActive = link.children
    ? link.children.some(c =>
        c.href === '/' ? pathname === '/' : pathname.startsWith(c.href),
      )
    : link.href === '/'
      ? pathname === '/'
      : pathname.startsWith(link.href);

  const handleEnter = () => {
    if (timeout.current) clearTimeout(timeout.current);
    setOpen(true);
  };

  const handleLeave = () => {
    timeout.current = setTimeout(() => setOpen(false), 150);
  };

  if (!link.children) {
    return (
      <Link
        href={link.href}
        className={`relative px-4 py-2 text-sm tracking-wide transition-colors duration-200 ${
          isActive ? 'text-gold-500' : 'text-txt-muted hover:text-cream-100'
        }`}
      >
        {link.label}
        {isActive && (
          <span className='absolute bottom-0 left-4 right-4 h-px bg-gold-500/50' />
        )}
      </Link>
    );
  }

  return (
    <div
      className='relative'
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <button
        className={`flex items-center gap-1 px-4 py-2 text-sm tracking-wide transition-colors duration-200 ${
          isActive ? 'text-gold-500' : 'text-txt-muted hover:text-cream-100'
        }`}
      >
        {link.label}
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
        {isActive && (
          <span className='absolute bottom-0 left-4 right-4 h-px bg-gold-500/50' />
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className='absolute left-0 top-full z-50 min-w-[200px] border border-gold-500/10 bg-navy-950/98 pt-1 shadow-xl backdrop-blur-md'>
          {link.children.map(child => {
            const childActive =
              child.href === '/'
                ? pathname === '/'
                : pathname.startsWith(child.href);
            return (
              <Link
                key={child.href}
                href={child.href}
                onClick={() => setOpen(false)}
                className={`block px-5 py-3 text-sm tracking-wide transition-colors duration-150 ${
                  childActive
                    ? 'bg-gold-500/5 text-gold-500'
                    : 'text-txt-muted hover:bg-gold-500/5 hover:text-cream-100'
                }`}
              >
                {child.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems, setIsOpen: setCartOpen } = useCart();

  const logoSrc = isDark
    ? '/images/thales-logo1.png'
    : '/images/thales-logo.png';

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
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'border-b border-gold-500/10 bg-navy-950/95 backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      {/* ========== DESKTOP NAV (lg+) ========== */}
      <nav className='mx-auto hidden max-w-7xl items-center justify-between px-6 py-4 lg:flex lg:px-8'>
        {/* Logo — larger with golden glow */}
        <Link href='/' className='group flex items-center gap-4'>
          <div className='relative'>
            <Image
              src={logoSrc}
              alt='Ferri Schoedl Advocacia'
              width={72}
              height={72}
              className='relative z-10 h-[72px] w-auto transition-all duration-300 group-hover:brightness-110'
              style={{
                filter: 'drop-shadow(0 0 6px rgba(184, 150, 90, 0.25))',
              }}
              priority
            />
          </div>
          <div>
            <span className='font-[family-name:var(--font-cormorant)] text-[26px] tracking-wide text-cream-100'>
              Ferri Schoedl
            </span>
            <span className='ml-2 font-[family-name:var(--font-cormorant)] text-[26px] tracking-wide text-gold-500'>
              Advocacia
            </span>
          </div>
        </Link>

        {/* Desktop links — with dropdowns */}
        <div className='flex items-center'>
          {links.map(link => (
            <DropdownMenu key={link.label} link={link} pathname={pathname} />
          ))}
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

        {/* Center: Logo — larger on mobile too */}
        <Link
          href='/'
          className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
        >
          <Image
            src={logoSrc}
            alt='Ferri Schoedl Advocacia'
            width={52}
            height={52}
            className='h-13 w-auto'
            style={{
              filter: 'drop-shadow(0 0 4px rgba(184, 150, 90, 0.2))',
            }}
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
            {mobileLinks.map(link => {
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
