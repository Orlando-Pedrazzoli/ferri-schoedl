import Link from 'next/link';
import { siteConfig, areasDeAtuacao } from '@/lib/data';
import { MapPin, Phone, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className='border-t border-gold-500/8 bg-navy-950'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Main footer */}
        <div className='grid gap-10 py-12 sm:gap-12 sm:py-16 md:grid-cols-4'>
          {/* Brand column */}
          <div className='md:col-span-1'>
            <Link href='/' className='inline-block'>
              <span className='font-[family-name:var(--font-cormorant)] text-xl tracking-wide text-cream-100'>
                Ferri Schoedl
              </span>
            </Link>
            <p className='mt-3 text-sm leading-relaxed text-txt-muted'>
              Advocacia especializada com sede em São Paulo e atuação em todo o
              território nacional.
            </p>
            <p className='mt-4 text-xs uppercase tracking-[1.5px] text-gold-600'>
              {siteConfig.oab}
            </p>

            {/* Social links */}
            <div className='mt-5 flex items-center gap-3'>
              <a
                href='https://www.linkedin.com/in/thales-ferri-schoedl-00517816b/'
                target='_blank'
                rel='noopener noreferrer'
                className='flex h-8 w-8 items-center justify-center border border-gold-500/15 text-txt-muted transition-all duration-300 hover:border-gold-500/40 hover:text-gold-500'
                aria-label='LinkedIn'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='14'
                  height='14'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path d='M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z' />
                  <rect width='4' height='12' x='2' y='9' />
                  <circle cx='4' cy='4' r='2' />
                </svg>
              </a>
              <a
                href='https://www.instagram.com/ferrischoedladvocacia/'
                target='_blank'
                rel='noopener noreferrer'
                className='flex h-8 w-8 items-center justify-center border border-gold-500/15 text-txt-muted transition-all duration-300 hover:border-gold-500/40 hover:text-gold-500'
                aria-label='Instagram'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='14'
                  height='14'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <rect width='20' height='20' x='2' y='2' rx='5' ry='5' />
                  <path d='M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z' />
                  <line x1='17.5' x2='17.51' y1='6.5' y2='6.5' />
                </svg>
              </a>
              <a
                href='https://www.facebook.com/profile.php?id=61581144217079'
                target='_blank'
                rel='noopener noreferrer'
                className='flex h-8 w-8 items-center justify-center border border-gold-500/15 text-txt-muted transition-all duration-300 hover:border-gold-500/40 hover:text-gold-500'
                aria-label='Facebook'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='14'
                  height='14'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path d='M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' />
                </svg>
              </a>
            </div>
          </div>

          {/* Areas column */}
          <div>
            <h4 className='mb-4 text-xs font-medium uppercase tracking-[2px] text-gold-500'>
              Áreas de atuação
            </h4>
            <ul className='space-y-2.5'>
              {areasDeAtuacao.map(area => (
                <li key={area.slug}>
                  <Link
                    href={`/areas-de-atuacao#${area.slug}`}
                    className='text-sm text-txt-muted transition-colors hover:text-cream-100'
                  >
                    {area.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation column */}
          <div>
            <h4 className='mb-4 text-xs font-medium uppercase tracking-[2px] text-gold-500'>
              Navegação
            </h4>
            <ul className='space-y-2.5'>
              {[
                { href: '/sobre', label: 'Sobre' },
                { href: '/livros', label: 'Livros' },
                { href: '/publicacoes', label: 'Publicações' },
                { href: '/cursos', label: 'Cursos' },
                { href: '/faq', label: 'Perguntas frequentes' },
                { href: '/contato', label: 'Contato' },
              ].map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className='text-sm text-txt-muted transition-colors hover:text-cream-100'
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Legal links */}
            <h4 className='mb-4 mt-8 text-xs font-medium uppercase tracking-[2px] text-gold-500'>
              Legal
            </h4>
            <ul className='space-y-2.5'>
              <li>
                <Link
                  href='/politica-de-privacidade'
                  className='text-sm text-txt-muted transition-colors hover:text-cream-100'
                >
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link
                  href='/termos-de-uso'
                  className='text-sm text-txt-muted transition-colors hover:text-cream-100'
                >
                  Termos de Uso
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact column */}
          <div>
            <h4 className='mb-4 text-xs font-medium uppercase tracking-[2px] text-gold-500'>
              Contato
            </h4>
            <ul className='space-y-3.5'>
              <li className='flex gap-3'>
                <MapPin size={14} className='mt-1 shrink-0 text-gold-600' />
                <span className='text-sm leading-relaxed text-txt-muted'>
                  {siteConfig.address.street}, {siteConfig.address.complement}
                  <br />
                  {siteConfig.address.neighborhood} — {siteConfig.address.city}/
                  {siteConfig.address.state}
                </span>
              </li>
              <li className='flex items-center gap-3'>
                <Phone size={14} className='shrink-0 text-gold-600' />
                <span className='text-sm text-txt-muted'>
                  {siteConfig.phone}
                </span>
              </li>
              <li className='flex items-center gap-3'>
                <Mail size={14} className='shrink-0 text-gold-600' />
                <span className='text-sm text-txt-muted'>
                  {siteConfig.email}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className='flex flex-col items-center justify-between gap-3 border-t border-gold-500/8 py-6 sm:flex-row'>
          <p className='text-xs text-txt-muted'>
            Ferri Schoedl Advocacia — Página institucional em observância ao
            Código de Ética da OAB
          </p>
          <p className='text-xs text-txt-muted'>
            Desenvolvido por{' '}
            <a
              href='https://pedrazzolidigital.com'
              target='_blank'
              rel='noopener noreferrer'
              className='text-gold-600 transition-colors hover:text-gold-500'
            >
              Pedrazzoli Digital
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
