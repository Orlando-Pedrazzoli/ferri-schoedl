import { getPageContent } from '@/lib/content-helpers';
import {
  aboutData,
  siteConfig,
  timeline as fallbackTimeline,
} from '@/lib/data';
import { SobreClient } from './SobreClient';
import {
  buildPageMetadata,
  buildPersonJsonLd,
  buildBreadcrumbJsonLd,
  SITE_URL,
} from '@/lib/seo';
import JsonLd from '@/components/JsonLd';

export const revalidate = 60;

export const metadata = buildPageMetadata({
  title: 'Sobre — Dr. Thales Ferri Schoedl',
  description:
    'Conheça o Dr. Thales Ferri Schoedl — ex-Promotor de Justiça do Estado de São Paulo (2003–2016), advogado criminalista, jurista, professor e palestrante. Autor de mais de 10 livros e 22 artigos jurídicos. Mestre pela UFBA. OAB/SP 196.377.',
  path: '/sobre',
  ogType: 'profile',
  keywords: [
    'Thales Ferri Schoedl',
    'advogado criminalista',
    'ex-promotor de justiça São Paulo',
    'professor direito penal',
    'OAB/SP 196.377',
    'mestrado UFBA',
    'Mackenzie direito',
  ],
});

export default async function SobrePage() {
  const content = await getPageContent('sobre');
  const configContent = await getPageContent('config');

  const bio = content['sobre.bio.text'] || aboutData.bio;
  const shortBio = content['sobre.bio.shortBio'] || aboutData.shortBio;
  const title = content['sobre.bio.title'] || aboutData.title;
  const coaching = content['sobre.coaching.text'] || aboutData.coaching;

  let differentials = aboutData.differentials;
  const dbDifferentials = content['sobre.differentials.items'];
  if (dbDifferentials) {
    try {
      const parsed = JSON.parse(dbDifferentials);
      if (Array.isArray(parsed) && parsed.length > 0) {
        differentials = parsed;
      }
    } catch {
      // JSON parse failed — use fallback
    }
  }

  let timeline = fallbackTimeline;
  const dbTimeline = content['sobre.timeline.items'];
  if (dbTimeline) {
    try {
      const parsed = JSON.parse(dbTimeline);
      if (Array.isArray(parsed) && parsed.length > 0) {
        timeline = parsed;
      }
    } catch {
      // JSON parse failed — use fallback
    }
  }

  const oab = configContent['config.contact.oab'] || siteConfig.oab;
  const livrosPublicados = Number(
    configContent['config.stats.livrosPublicados'] ||
      siteConfig.stats.livrosPublicados,
  );
  const artigosPublicados = Number(
    configContent['config.stats.artigosPublicados'] ||
      siteConfig.stats.artigosPublicados,
  );

  return (
    <>
      <JsonLd data={buildPersonJsonLd()} />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: 'Início', url: SITE_URL },
          { name: 'Sobre', url: `${SITE_URL}/sobre` },
        ])}
      />
      <SobreClient
        bio={bio}
        shortBio={shortBio}
        title={title}
        coaching={coaching}
        differentials={differentials}
        timeline={timeline}
        siteConfig={{
          oab,
          stats: {
            livrosPublicados,
            artigosPublicados,
          },
        }}
      />
    </>
  );
}
