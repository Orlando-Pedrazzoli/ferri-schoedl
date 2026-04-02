import { getPageContent } from '@/lib/content-helpers';
import { faqItems as fallbackFaqItems } from '@/lib/data';
import { FaqClient } from './FaqClient';

export const revalidate = 60;

export const metadata = {
  title: 'Perguntas Frequentes | Ferri Schoedl Advocacia',
  description:
    'Respostas para as principais dúvidas sobre os serviços jurídicos do escritório Ferri Schoedl Advocacia.',
};

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

  return <FaqClient faqItems={faqItems} />;
}
