import type { Metadata } from 'next';
import dbConnect from '@/lib/mongodb';
import Book from '@/models/Book';
import { livros as fallbackLivros, siteConfig } from '@/lib/data';
import { SectionHeading } from '@/components/SectionHeading';
import { LivrosGrid } from './LivrosGrid';

export const metadata: Metadata = {
  title: 'Livros | Ferri Schoedl Advocacia',
  description: `${siteConfig.stats.livrosPublicados} obras publicadas sobre Direito Penal, Constitucional, Notarial, Improbidade Administrativa e preparação para concursos públicos.`,
  openGraph: {
    title: 'Livros | Ferri Schoedl Advocacia',
    description: `${siteConfig.stats.livrosPublicados} obras publicadas sobre Direito Penal, Constitucional, Notarial, Improbidade Administrativa e preparação para concursos públicos.`,
  },
};

async function getBooks() {
  try {
    await dbConnect();
    const books = await Book.find({ isActive: true }).sort({ order: 1 }).lean();
    if (books && books.length > 0) {
      return books.map(book => ({
        ...book,
        _id: book._id?.toString() || '',
      }));
    }
    return null;
  } catch {
    return null;
  }
}

export default async function LivrosPage() {
  const dbBooks = await getBooks();

  // Map DB books to the Livro shape that LivrosGrid expects, or use fallback
  const livros = dbBooks
    ? dbBooks.map(book => ({
        slug: book.slug,
        title: book.title,
        subtitle: book.subtitle || undefined,
        author: book.author,
        coauthor: book.coauthor,
        year: book.year,
        publisher: book.publisher,
        pages: book.pages,
        isbn: book.isbn || undefined,
        edition: book.edition,
        price: book.price,
        originalPrice: book.originalPrice || undefined,
        description: book.description,
        longDescription: book.longDescription,
        topics: book.topics || [],
        dimensions: book.dimensions || {
          width: 0,
          height: 0,
          depth: 0,
          unit: 'cm',
        },
        weight: book.weight,
        weightUnit: book.weightUnit || 'g',
        image: book.image,
        inStock: book.inStock,
        featured: book.featured,
        saleType: book.saleType as 'direto' | 'editora',
        saleNote: book.saleNote || undefined,
      }))
    : fallbackLivros;

  return (
    <section className='pb-16 pt-28 sm:pb-24 sm:pt-32 lg:pb-32'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <SectionHeading
          label='Loja'
          title='Livros'
          description={`${siteConfig.stats.livrosPublicados} obras publicadas sobre Direito Penal, Constitucional, Notarial, Improbidade Administrativa e preparação para concursos públicos.`}
        />

        <LivrosGrid livros={livros} />
      </div>
    </section>
  );
}
