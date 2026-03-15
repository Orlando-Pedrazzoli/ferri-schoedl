import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ThemeProvider } from '@/components/ThemeProvider';
import { CartProvider } from '@/components/CartProvider';
import { CartDrawer } from '@/components/CartDrawer';
import { CookieConsent } from '@/components/CookieConsent';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Ferri Schoedl Advocacia | Direito Criminal, Júri e Improbidade',
    template: '%s | Ferri Schoedl Advocacia',
  },
  description:
    'Escritório de advocacia com sede em São Paulo e atuação nacional. Especializado em Direito Criminal, Tribunal do Júri, Improbidade Administrativa, Imobiliário, Cível e Disciplinar.',
  keywords: [
    'advogado criminal São Paulo',
    'tribunal do júri',
    'improbidade administrativa',
    'advogado imobiliário',
    'defesa servidor público',
    'Thales Ferri Schoedl',
    'Ferri Schoedl Advocacia',
  ],
  authors: [{ name: 'Thales Ferri Schoedl' }],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Ferri Schoedl Advocacia',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Ferri Schoedl Advocacia — Defesa técnica com rigor e experiência',
      },
    ],
  },
  icons: {
    icon: [
      { url: '/images/favicon.svg?v=2', type: 'image/svg+xml' },
      {
        url: '/images/favicon-96x96.png?v=2',
        sizes: '96x96',
        type: 'image/png',
      },
      { url: '/images/favicon.ico?v=2', sizes: 'any' },
    ],
    apple: '/images/apple-touch-icon.png?v=2',
  },
  manifest: '/images/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='pt-BR' data-theme='dark' suppressHydrationWarning>
      <head>
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link
          rel='preconnect'
          href='https://fonts.gstatic.com'
          crossOrigin='anonymous'
        />
        <link
          href='https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500&display=swap'
          rel='stylesheet'
        />
        {/* Force favicon refresh — SVG first (modern browsers), then PNG, then ICO fallback */}
        <link rel='icon' type='image/svg+xml' href='/images/favicon.svg?v=2' />
        <link
          rel='icon'
          type='image/png'
          sizes='96x96'
          href='/images/favicon-96x96.png?v=2'
        />
        <link rel='icon' sizes='any' href='/images/favicon.ico?v=2' />
        <link rel='apple-touch-icon' href='/images/apple-touch-icon.png?v=2' />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('fs-theme');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t)}catch(e){}})()`,
          }}
        />
      </head>
      <body className='min-h-screen bg-navy-950 text-txt antialiased'>
        <ThemeProvider>
          <CartProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <CartDrawer />
            <CookieConsent />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
