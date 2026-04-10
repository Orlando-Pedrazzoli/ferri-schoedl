import { getPageContent } from '@/lib/content-helpers';
import { areasDeAtuacao as fallbackAreas } from '@/lib/data';
import { AreasClient } from './AreasClient';
import { buildPageMetadata, buildBreadcrumbJsonLd, SITE_URL } from '@/lib/seo';
import JsonLd from '@/components/JsonLd';

export const revalidate = 60;

export const metadata = buildPageMetadata({
  title: 'Áreas de Atuação',
  description:
    'Atuação especializada em Direito Criminal, Tribunal do Júri, Improbidade Administrativa, Imobiliário, Cível e Disciplinar. Defesa técnica de servidores públicos em causas de alta complexidade. Atendimento em todo o Brasil.',
  path: '/areas-de-atuacao',
  keywords: [
    'áreas de atuação advocacia',
    'direito criminal São Paulo',
    'tribunal do júri advogado',
    'improbidade administrativa defesa',
    'advogado imobiliário São Paulo',
    'processo administrativo disciplinar',
    'sindicância administrativa',
    'defesa servidor público',
  ],
});

export default async function AreasDeAtuacaoPage() {
  const areasContent = await getPageContent('areas');

  // Merge DB content with fallback data.ts
  // Icons stay from data.ts (React components, not serializable)
  // Texts come from DB when available
  const areasData = fallbackAreas.map(area => {
    const dbDescription =
      areasContent[`areas.${area.slug}.description`] || area.description;
    const dbTitle = areasContent[`areas.${area.slug}.title`] || area.title;
    const dbSubtitle =
      areasContent[`areas.${area.slug}.subtitle`] || area.subtitle;

    // Parse details from DB (JSON string) or use fallback
    let details = area.details;
    const dbDetailsJson = areasContent[`areas.${area.slug}.details`];
    if (dbDetailsJson) {
      try {
        const parsed = JSON.parse(dbDetailsJson);
        if (Array.isArray(parsed) && parsed.length > 0) {
          details = parsed;
        }
      } catch {
        // JSON parse failed — use fallback
      }
    }

    return {
      slug: area.slug,
      title: dbTitle,
      subtitle: dbSubtitle,
      description: dbDescription,
      details,
    };
  });

  // Pass only serializable data (no icons) — AreasClient imports icons itself
  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: 'Início', url: SITE_URL },
          { name: 'Áreas de Atuação', url: `${SITE_URL}/areas-de-atuacao` },
        ])}
      />
      <AreasClient areasData={areasData} />
    </>
  );
}
