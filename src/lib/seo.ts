import { Metadata } from 'next';

// ─── Base Constants ──────────────────────────────────────────
export const SITE_URL = 'https://www.ferrischoedl.adv.br';
export const SITE_NAME = 'Ferri Schoedl Advocacia';
export const SITE_DESCRIPTION =
  'Escritório de advocacia com sede em São Paulo e atuação nacional, especializado em Direito Criminal, Tribunal do Júri, Improbidade Administrativa, Imobiliário, Cível e Disciplinar. Ênfase na defesa de servidores públicos, com a experiência de um ex-Promotor de Justiça.';
export const OG_IMAGE = `${SITE_URL}/images/og-image.jpg`;
export const LAWYER_NAME = 'Thales Ferri Schoedl';

export const PRACTICE_AREAS = [
  'Direito Criminal',
  'Tribunal do Júri',
  'Improbidade Administrativa',
  'Direito Imobiliário',
  'Direito Cível',
  'Direito Disciplinar',
] as const;

export const DEFAULT_KEYWORDS = [
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
];

// ─── Metadata Builder ────────────────────────────────────────
interface PageMetadataOptions {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  ogType?: 'website' | 'article' | 'profile' | 'book';
  ogImage?: string;
  noIndex?: boolean;
}

export function buildPageMetadata({
  title,
  description,
  path,
  keywords = [],
  ogType = 'website',
  ogImage,
  noIndex = false,
}: PageMetadataOptions): Metadata {
  const url = `${SITE_URL}${path}`;
  const image = ogImage || OG_IMAGE;
  const allKeywords = [...new Set([...keywords, ...DEFAULT_KEYWORDS])];

  return {
    title,
    description,
    keywords: allKeywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: 'pt_BR',
      type: ogType as any,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${title} — ${SITE_NAME}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
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
  };
}

// ─── JSON-LD Builders ────────────────────────────────────────

export function buildLawFirmJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    telephone: '(11) 94990-3000',
    email: 'thales@ferrischoedl.adv.br',
    image: OG_IMAGE,
    logo: `${SITE_URL}/images/thales-logo1.png`,
    priceRange: '$$$',
    areaServed: { '@type': 'Country', name: 'Brasil' },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Av. Queiroz Filho, 1.700, Sala 211D',
      addressLocality: 'São Paulo',
      addressRegion: 'SP',
      postalCode: '05319-000',
      addressCountry: 'BR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -23.5278,
      longitude: -46.7349,
    },
    founder: {
      '@type': 'Person',
      '@id': `${SITE_URL}/#thales`,
      name: LAWYER_NAME,
      jobTitle: 'Advogado Criminalista',
      image: `${SITE_URL}/images/thales-perfil.png`,
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Áreas de Atuação',
      itemListElement: PRACTICE_AREAS.map(area => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: area },
      })),
    },
    knowsAbout: [...PRACTICE_AREAS],
  };
}

export function buildWebSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    publisher: { '@type': 'LegalService', '@id': `${SITE_URL}/#organization` },
    inLanguage: 'pt-BR',
  };
}

export function buildPersonJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/#thales`,
    name: LAWYER_NAME,
    jobTitle: 'Advogado Criminalista',
    description:
      'Ex-Promotor de Justiça do Estado de São Paulo (2003–2016). Advogado, jurista, professor e palestrante. Autor de mais de 10 livros e 22 artigos jurídicos publicados. Mestre pela UFBA.',
    url: `${SITE_URL}/sobre`,
    image: `${SITE_URL}/images/thales-perfil.png`,
    telephone: '(11) 94990-3000',
    email: 'thales@ferrischoedl.adv.br',
    worksFor: {
      '@type': 'LegalService',
      '@id': `${SITE_URL}/#organization`,
      name: SITE_NAME,
    },
    alumniOf: [
      {
        '@type': 'CollegeOrUniversity',
        name: 'Universidade Presbiteriana Mackenzie',
      },
      {
        '@type': 'CollegeOrUniversity',
        name: 'Universidade Federal da Bahia (UFBA)',
      },
    ],
    knowsAbout: [...PRACTICE_AREAS],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Av. Queiroz Filho, 1.700, Sala 211D',
      addressLocality: 'São Paulo',
      addressRegion: 'SP',
      postalCode: '05319-000',
      addressCountry: 'BR',
    },
  };
}

export function buildBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildBookJsonLd(book: {
  title: string;
  description: string;
  slug: string;
  isbn?: string;
  publisher?: string;
  year?: number;
  pages?: number;
  imageUrl?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: book.title,
    description: book.description,
    url: `${SITE_URL}/livros/${book.slug}`,
    image: book.imageUrl || OG_IMAGE,
    author: {
      '@type': 'Person',
      '@id': `${SITE_URL}/#thales`,
      name: LAWYER_NAME,
    },
    publisher: { '@type': 'Organization', name: book.publisher || 'Editora' },
    ...(book.isbn && { isbn: book.isbn }),
    ...(book.year && { datePublished: String(book.year) }),
    ...(book.pages && { numberOfPages: book.pages }),
    inLanguage: 'pt-BR',
  };
}

export function buildCourseJsonLd(course: {
  title: string;
  description: string;
  slug: string;
  imageUrl?: string;
  price?: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: course.description,
    url: `${SITE_URL}/cursos/${course.slug}`,
    image: course.imageUrl || OG_IMAGE,
    provider: {
      '@type': 'LegalService',
      '@id': `${SITE_URL}/#organization`,
      name: SITE_NAME,
    },
    instructor: {
      '@type': 'Person',
      '@id': `${SITE_URL}/#thales`,
      name: LAWYER_NAME,
    },
    inLanguage: 'pt-BR',
    ...(course.price && {
      offers: {
        '@type': 'Offer',
        price: course.price,
        priceCurrency: 'BRL',
        availability: 'https://schema.org/InStock',
      },
    }),
  };
}

export function buildFaqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
}
