import { getPageContent } from '@/lib/content-helpers';
import { siteConfig } from '@/lib/data';
import { HomeClient } from './HomeClient';

export const revalidate = 60;

export default async function Home() {
  // Fetch editable content from MongoDB (admin panel)
  const homeContent = await getPageContent('home');
  const configContent = await getPageContent('config');

  // Hero section — merge DB values with data.ts fallbacks
  const hero = {
    label:
      homeContent['home.hero.label'] ||
      'Advocacia e Consultoria Especializadas',
    title:
      homeContent['home.hero.title'] ||
      'Defesa técnica com rigor e experiência',
    subtitle:
      homeContent['home.hero.subtitle'] ||
      'Advocacia criminal, cível e administrativa com a perspectiva estratégica de um ex-Promotor de Justiça.',
    description:
      homeContent['home.hero.description'] ||
      'Atuação estratégica nas áreas criminal, tribunal do júri, improbidade administrativa, imobiliário, cível e disciplinar, com ênfase na defesa de servidores públicos. Escritório com sede em São Paulo e atuação em todo o território nacional.',
  };

  // Stats — from DB or fallback to siteConfig
  const stats = {
    anosExperiencia:
      configContent['config.stats.anosExperiencia'] ||
      String(siteConfig.stats.anosExperiencia),
    livrosPublicados:
      configContent['config.stats.livrosPublicados'] ||
      String(siteConfig.stats.livrosPublicados),
    artigosPublicados:
      configContent['config.stats.artigosPublicados'] ||
      String(siteConfig.stats.artigosPublicados),
  };

  // Areas section headings
  const areas = {
    label: homeContent['home.areas.label'] || 'Especializações',
    title: homeContent['home.areas.title'] || 'Áreas de atuação',
    description:
      homeContent['home.areas.description'] ||
      'Atuação abrangente em áreas estratégicas do Direito, com ênfase na defesa técnica de servidores públicos em causas de alta complexidade.',
  };

  // About section
  const about = {
    name: homeContent['home.about.title'] || 'Dr. Thales Ferri Schoedl',
    subtitle:
      homeContent['home.about.subtitle'] ||
      'Advogado, jurista, professor e palestrante',
    description1:
      homeContent['home.about.description1'] ||
      `Ex-Promotor de Justiça do Estado de São Paulo (2003–2016), com formação pela Universidade Presbiteriana Mackenzie, especialização em Direito Penal e Processual Penal e Mestrado pela UFBA. Autor de mais de ${siteConfig.stats.livrosPublicados} livros e mais de ${siteConfig.stats.artigosPublicados} artigos jurídicos publicados. Professor na Academia Del Guercio SPCM.`,
    description2:
      homeContent['home.about.description2'] ||
      'Sua trajetória une a experiência na Promotoria de Justiça com a advocacia estratégica, oferecendo uma perspectiva única — a visão de quem já esteve do lado da acusação — resultando em uma atuação técnica diferenciada na defesa de servidores públicos e em causas de alta complexidade.',
  };

  // Publicações section headings
  const publicacoesSection = {
    label: homeContent['home.publicacoes.label'] || 'Obras publicadas',
    title: homeContent['home.publicacoes.title'] || 'Publicações',
    description:
      homeContent['home.publicacoes.description'] ||
      `Autor de mais de ${siteConfig.stats.livrosPublicados} livros e mais de ${siteConfig.stats.artigosPublicados} artigos jurídicos — produção acadêmica e editorial que reflete décadas de experiência na prática e no ensino do Direito.`,
  };

  // CTA final
  const cta = {
    title:
      homeContent['home.cta.title'] || 'Cada caso exige uma estratégia única',
    description:
      homeContent['home.cta.description'] ||
      'Entre em contato para uma análise preliminar do seu caso. Atuamos em todo o Brasil com atendimento presencial e online.',
  };

  // Cursos section
  const cursos = {
    title: homeContent['home.cursos.title'] || 'Cursos Preparatórios',
    text:
      homeContent['home.cursos.text'] ||
      'Preparação estratégica para concursos públicos e Exame de Ordem, com a experiência de quem viveu a Promotoria de Justiça por dentro.',
  };

  // OAB (used in hero photo tag)
  const oab = configContent['config.contact.oab'] || siteConfig.oab;

  // NOTE: areasDeAtuacao and publicacoes are imported directly inside HomeClient
  // because they contain React components (Lucide icons) that cannot be
  // serialized from Server Components to Client Components.

  return (
    <HomeClient
      hero={hero}
      stats={stats}
      areas={areas}
      about={about}
      publicacoesSection={publicacoesSection}
      cta={cta}
      cursos={cursos}
      oab={oab}
    />
  );
}
