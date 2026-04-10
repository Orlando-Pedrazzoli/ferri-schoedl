import type { Metadata } from 'next';
import { AuthProvider } from '@/components/AuthProvider';
import { LayoutShell } from '@/components/LayoutShell';
import { buildLawFirmJsonLd, buildWebSiteJsonLd } from '@/lib/seo';
import JsonLd from '@/components/JsonLd';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.ferrischoedl.adv.br'),
  title: {
    default: 'Ferri Schoedl Advocacia | Direito Criminal, Júri e Improbidade',
    template: '%s | Ferri Schoedl Advocacia',
  },
  description:
    'Escritório de advocacia com sede em São Paulo e atuação nacional, especializado em Direito Criminal, Tribunal do Júri, Improbidade Administrativa, Imobiliário, Cível e Disciplinar. Ênfase na defesa de servidores públicos, com a experiência de um ex-Promotor de Justiça. Autor de 10 livros e mais de 23 artigos jurídicos.',
  keywords: [
    'advogado criminal São Paulo',
    'tribunal do júri',
    'improbidade administrativa',
    'advogado imobiliário',
    'defesa servidor público',
    'advogado disciplinar',
    'processo administrativo disciplinar',
    'ex-promotor de justiça',
    'livros jurídicos',
    'artigos jurídicos',
    'reintegração servidor público',
    'advogado defesa criminal',
    'Thales Ferri Schoedl',
    'Ferri Schoedl Advocacia',
  ],
  authors: [{ name: 'Thales Ferri Schoedl' }],
  creator: 'Thales Ferri Schoedl',
  publisher: 'Ferri Schoedl Advocacia',
  alternates: {
    canonical: 'https://www.ferrischoedl.adv.br',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://www.ferrischoedl.adv.br',
    siteName: 'Ferri Schoedl Advocacia',
    title: 'Ferri Schoedl Advocacia | Direito Criminal, Júri e Improbidade',
    description:
      'Escritório de advocacia especializado em Direito Criminal, Tribunal do Júri, Improbidade Administrativa e defesa de servidores públicos. Sede em São Paulo, atuação nacional.',
    images: [
      {
        url: 'https://www.ferrischoedl.adv.br/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Ferri Schoedl Advocacia — Defesa técnica com rigor e experiência',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ferri Schoedl Advocacia | Direito Criminal, Júri e Improbidade',
    description:
      'Escritório de advocacia especializado em Direito Criminal, Tribunal do Júri, Improbidade Administrativa e defesa de servidores públicos.',
    images: ['https://www.ferrischoedl.adv.br/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
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
  verification: {
    google: '2u0kuhWkm6I-ljGCpvaYXSh_sPIAxlJMscid5aG-Vro',
  },
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
        <JsonLd data={buildLawFirmJsonLd()} />
        <JsonLd data={buildWebSiteJsonLd()} />
        <AuthProvider>
          <LayoutShell>{children}</LayoutShell>
        </AuthProvider>
      </body>
    </html>
  );
}
