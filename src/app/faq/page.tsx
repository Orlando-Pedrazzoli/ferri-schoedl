import { getPageContent } from '@/lib/content-helpers';
import { faqItems as fallbackFaqItems } from '@/lib/data';
import { FaqClient } from './FaqClient';
import {
  buildPageMetadata,
  buildFaqJsonLd,
  buildBreadcrumbJsonLd,
  SITE_URL,
} from '@/lib/seo';
import JsonLd from '@/components/JsonLd';

export const revalidate = 60;

export const metadata = buildPageMetadata({
  title: 'Perguntas Frequentes',
  description:
    'Respostas para as principais dúvidas sobre os serviços jurídicos do escritório Ferri Schoedl Advocacia.',
  path: '/faq',
  keywords: [
    'perguntas frequentes advogado',
    'dúvidas advocacia criminal',
    'como funciona consulta advogado',
    'honorários advocacia',
    'atendimento online advogado',
  ],
});

export default async function FaqPage() {
  const content = await getPageContent('faq');

  // Parse FAQ items from DB (JSON string) or fallback to data.ts
  let faqItems = fallbackFaqItems;
  const dbFaqJson = content['faq.items'];
  if (dbFaqJson) {
    try {
      const parsed = JSON.parse(dbFaqJson);
      if (Array.isArray(parsed) && parsed.length > 0) {
        faqItems = parsed;
      }
    } catch {
      // JSON parse failed — use fallback
    }
  }

  // Build FAQ structured data for Google Rich Results
  // Maps faqItems to the {question, answer} shape that buildFaqJsonLd expects
  const faqJsonLdItems = faqItems.map((item: any) => ({
    question: item.question || item.pergunta || '',
    answer: item.answer || item.resposta || '',
  }));

  return (
    <>
      <JsonLd data={buildFaqJsonLd(faqJsonLdItems)} />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: 'Início', url: SITE_URL },
          { name: 'Perguntas Frequentes', url: `${SITE_URL}/faq` },
        ])}
      />
      <FaqClient faqItems={faqItems} />
    </>
  );
}
