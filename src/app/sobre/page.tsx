import { getPageContent } from '@/lib/content-helpers';
import {
  aboutData,
  siteConfig,
  timeline as fallbackTimeline,
} from '@/lib/data';
import { SobreClient } from './SobreClient';

export const metadata = {
  title: 'Sobre | Ferri Schoedl Advocacia',
  description:
    'Conheça o Dr. Thales Ferri Schoedl — advogado, jurista, professor, palestrante e ex-Promotor de Justiça do Estado de São Paulo.',
};

export default async function SobrePage() {
  // Fetch editable content from MongoDB (admin panel)
  const content = await getPageContent('sobre');
  const configContent = await getPageContent('config');

  // Merge MongoDB values with data.ts fallbacks
  const bio = content['sobre.bio.text'] || aboutData.bio;
  const shortBio = content['sobre.bio.shortBio'] || aboutData.shortBio;
  const title = content['sobre.bio.title'] || aboutData.title;
  const coaching = content['sobre.coaching.text'] || aboutData.coaching;

  // Differentials — parse from DB (JSON) or fallback
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

  // Timeline — parse from DB (JSON) or fallback
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

  // Stats from DB or fallback
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
  );
}
