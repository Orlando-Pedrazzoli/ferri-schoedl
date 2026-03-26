import type { Metadata } from 'next';
import { AuthProvider } from '@/components/AuthProvider';
import { LayoutShell } from '@/components/LayoutShell';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Ferri Schoedl Advocacia | Direito Criminal, Juri e Improbidade',
    template: '%s | Ferri Schoedl Advocacia',
  },
  description:
    'Escritorio de advocacia com sede em Sao Paulo e atuacao nacional, especializado em Direito Criminal, Tribunal do Juri, Improbidade Administrativa, Imobiliario, Civel e Disciplinar. Enfase na defesa de servidores publicos, com a experiencia de um ex-Promotor de Justica. Autor de 10 livros e mais de 23 artigos juridicos.',
  keywords: [
    'advogado criminal Sao Paulo',
    'tribunal do juri',
    'improbidade administrativa',
    'advogado imobiliario',
    'defesa servidor publico',
    'advogado disciplinar',
    'processo administrativo disciplinar',
    'ex-promotor de justica',
    'livros juridicos',
    'artigos juridicos',
    'reintegracao servidor publico',
    'advogado defesa criminal',
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
        alt: 'Ferri Schoedl Advocacia — Defesa tecnica com rigor e experiencia',
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
        <AuthProvider>
          <LayoutShell>{children}</LayoutShell>
        </AuthProvider>
      </body>
    </html>
  );
}
