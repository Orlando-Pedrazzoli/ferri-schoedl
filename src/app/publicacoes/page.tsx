import type { Metadata } from 'next';
import dbConnect from '@/lib/mongodb';
import Article from '@/models/Article';
import {
  publicacoes as fallbackPublicacoes,
  artigos as fallbackArtigos,
  siteConfig,
} from '@/lib/data';
import { SectionHeading } from '@/components/SectionHeading';
import { PublicacoesContent } from './PublicacoesContent';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Publicações | Ferri Schoedl Advocacia',
  description: `Autor de mais de ${siteConfig.stats.livrosPublicados} livros e mais de ${siteConfig.stats.artigosPublicados} artigos jurídicos — produção acadêmica e editorial sobre Direito Penal, Constitucional e Improbidade Administrativa.`,
  openGraph: {
    title: 'Publicações | Ferri Schoedl Advocacia',
    description: `Autor de mais de ${siteConfig.stats.livrosPublicados} livros e mais de ${siteConfig.stats.artigosPublicados} artigos jurídicos publicados.`,
  },
};

async function getArticles() {
  try {
    await dbConnect();
    const articles = await Article.find({ isActive: true })
      .sort({ year: -1, order: 1 })
      .lean();
    if (articles && articles.length > 0) {
      return articles.map(a => ({
        ...a,
        _id: a._id?.toString() || '',
      }));
    }
    return null;
  } catch {
    return null;
  }
}

export default async function PublicacoesPage() {
  const dbArticles = await getArticles();

  // Map DB articles to the shape PublicacoesContent expects
  const artigos = dbArticles
    ? dbArticles.map(a => ({
        title: a.title as string,
        year: a.year as number,
        publisher: a.publisher as string,
        url: (a.url as string) || undefined,
        pdfUrl: (a.pdfUrl as string) || undefined,
        originalPublisher: (a.originalPublisher as string) || undefined,
        coauthors: (a.coauthors as string[]) || undefined,
        description: (a.description as string) || undefined,
      }))
    : fallbackArtigos;

  const totalArtigos = artigos.length;

  // Publicacoes (books as academic entries) still come from data.ts
  const publicacoes = fallbackPublicacoes;

  return (
    <section className='pb-16 pt-28 sm:pb-24 sm:pt-32 lg:pb-32'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <SectionHeading
          label='Obras e artigos'
          title='Publicações'
          description={`Autor de mais de ${siteConfig.stats.livrosPublicados} livros e mais de ${siteConfig.stats.artigosPublicados} artigos jurídicos — produção acadêmica e editorial que reflete décadas de experiência na prática e no ensino do Direito.`}
        />

        <PublicacoesContent
          publicacoes={publicacoes}
          artigos={artigos}
          totalArtigos={totalArtigos}
        />
      </div>
    </section>
  );
}
