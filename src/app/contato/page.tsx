import { getPageContent } from '@/lib/content-helpers';
import { siteConfig } from '@/lib/data';
import { ContatoClient } from './ContatoClient';

export const revalidate = 60;

export const metadata = {
  title: 'Contato | Ferri Schoedl Advocacia',
  description:
    'Entre em contato com o escritório Ferri Schoedl Advocacia. Atendimento presencial em São Paulo e online em todo o Brasil.',
};

export default async function ContatoPage() {
  const configContent = await getPageContent('config');

  // Build contact config from DB with fallbacks to data.ts
  const contactConfig = {
    phone: configContent['config.contact.phone'] || siteConfig.phone,
    phoneLandline:
      configContent['config.contact.phoneLandline'] || siteConfig.phoneLandline,
    whatsapp: configContent['config.contact.whatsapp'] || siteConfig.whatsapp,
    email: configContent['config.contact.email'] || siteConfig.email,
    hours: configContent['config.contact.hours'] || siteConfig.hours,
    oab: configContent['config.contact.oab'] || siteConfig.oab,
    address: siteConfig.address, // fallback default
  };

  // Try to parse address from DB
  const dbAddress = configContent['config.contact.address'];
  if (dbAddress) {
    try {
      const parsed = JSON.parse(dbAddress);
      if (parsed && parsed.street) {
        contactConfig.address = parsed;
      }
    } catch {
      // JSON parse failed — use fallback
    }
  }

  return <ContatoClient config={contactConfig} />;
}
