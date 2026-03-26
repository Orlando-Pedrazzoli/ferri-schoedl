import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import dbConnect from '@/lib/mongodb';
import Book from '@/models/Book';
import { livros as fallbackLivros } from '@/lib/data';
import { LivroDetail } from './LivroDetail';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getBook(slug: string) {
  try {
    await dbConnect();
    const book = await Book.findOne({ slug, isActive: true }).lean();
    if (book) {
      return { ...book, _id: book._id?.toString() || '' };
    }
    return null;
  } catch {
    return null;
  }
}

async function getRelatedBooks(currentSlug: string) {
  try {
    await dbConnect();
    const books = await Book.find({
      isActive: true,
      slug: { $ne: currentSlug },
    })
      .sort({ order: 1 })
      .limit(3)
      .select('slug title image year price saleNote')
      .lean();
    if (books && books.length > 0) {
      return books.map(b => ({
        slug: b.slug,
        title: b.title,
        image: b.image,
        year: b.year,
        price: b.price,
        saleNote: b.saleNote || '',
      }));
    }
    return null;
  } catch {
    return null;
  }
}

function dbBookToLivro(book: Record<string, unknown>) {
  return {
    slug: book.slug as string,
    title: book.title as string,
    subtitle: (book.subtitle as string) || undefined,
    author: book.author as string,
    coauthor: book.coauthor as boolean,
    year: book.year as number,
    publisher: book.publisher as string,
    pages: book.pages as number,
    isbn: (book.isbn as string) || undefined,
    edition: book.edition as string,
    price: book.price as number,
    originalPrice: (book.originalPrice as number) || undefined,
    description: book.description as string,
    longDescription: book.longDescription as string,
    topics: (book.topics as string[]) || [],
    dimensions: (book.dimensions as {
      width: number;
      height: number;
      depth: number;
      unit: string;
    }) || { width: 0, height: 0, depth: 0, unit: 'cm' },
    weight: book.weight as number,
    weightUnit: (book.weightUnit as string) || 'g',
    image: book.image as string,
    inStock: book.inStock as boolean,
    featured: book.featured as boolean,
    saleType: book.saleType as 'direto' | 'editora',
    saleNote: (book.saleNote as string) || undefined,
  };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const dbBook = await getBook(slug);
  if (dbBook) {
    return {
      title: `${dbBook.title} | Ferri Schoedl Advocacia`,
      description: dbBook.description as string,
      openGraph: {
        title: `${dbBook.title} | Ferri Schoedl Advocacia`,
        description: dbBook.description as string,
        images: dbBook.image ? [{ url: dbBook.image as string }] : [],
      },
    };
  }

  const fallback = fallbackLivros.find(l => l.slug === slug);
  if (fallback) {
    return {
      title: `${fallback.title} | Ferri Schoedl Advocacia`,
      description: fallback.description,
    };
  }

  return { title: 'Livro não encontrado' };
}

export default async function LivroSlugPage({ params }: PageProps) {
  const { slug } = await params;

  // Try MongoDB first
  const dbBook = await getBook(slug);
  const dbRelated = await getRelatedBooks(slug);

  if (dbBook) {
    const livro = dbBookToLivro(dbBook);
    const outrosLivros =
      dbRelated ||
      fallbackLivros
        .filter(l => l.slug !== slug)
        .slice(0, 3)
        .map(l => ({
          slug: l.slug,
          title: l.title,
          image: l.image,
          year: l.year,
          price: l.price,
          saleNote: l.saleNote || '',
        }));

    return <LivroDetail livro={livro} outrosLivros={outrosLivros} />;
  }

  // Fallback to data.ts
  const fallback = fallbackLivros.find(l => l.slug === slug);
  if (!fallback) {
    notFound();
  }

  const outrosLivros = fallbackLivros
    .filter(l => l.slug !== slug)
    .slice(0, 3)
    .map(l => ({
      slug: l.slug,
      title: l.title,
      image: l.image,
      year: l.year,
      price: l.price,
      saleNote: l.saleNote || '',
    }));

  return <LivroDetail livro={fallback} outrosLivros={outrosLivros} />;
}
