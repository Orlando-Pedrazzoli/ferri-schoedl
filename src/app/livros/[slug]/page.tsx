import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import dbConnect from '@/lib/mongodb';
import Book from '@/models/Book';
import { livros as fallbackLivros } from '@/lib/data';
import { LivroDetail } from './LivroDetail';
import {
  buildPageMetadata,
  buildBookJsonLd,
  buildBreadcrumbJsonLd,
  SITE_URL,
  LAWYER_NAME,
} from '@/lib/seo';
import JsonLd from '@/components/JsonLd';

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
    const title = dbBook.title as string;
    const description =
      (dbBook.description as string) || `${title} — Obra de ${LAWYER_NAME}`;
    const image = dbBook.image as string;
    const publisher = dbBook.publisher as string;
    const year = dbBook.year as number;

    return buildPageMetadata({
      title,
      description: `${title}${publisher ? ` — ${publisher}` : ''}${year ? `, ${year}` : ''}. ${description}`,
      path: `/livros/${slug}`,
      ogType: 'book',
      ogImage: image || undefined,
      keywords: [
        title,
        LAWYER_NAME,
        'livro jurídico',
        publisher || '',
        'direito penal',
      ].filter(Boolean),
    });
  }

  const fallback = fallbackLivros.find(l => l.slug === slug);
  if (fallback) {
    return buildPageMetadata({
      title: fallback.title,
      description: `${fallback.title} — ${fallback.publisher}, ${fallback.year}. ${fallback.description}`,
      path: `/livros/${slug}`,
      ogType: 'book',
      keywords: [
        fallback.title,
        LAWYER_NAME,
        'livro jurídico',
        fallback.publisher,
      ],
    });
  }

  return buildPageMetadata({
    title: 'Livro não encontrado',
    description: 'O livro solicitado não foi encontrado.',
    path: `/livros/${slug}`,
    noIndex: true,
  });
}

export default async function LivroSlugPage({ params }: PageProps) {
  const { slug } = await params;

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

    return (
      <>
        <JsonLd
          data={buildBookJsonLd({
            title: livro.title,
            description: livro.description,
            slug: livro.slug,
            isbn: livro.isbn,
            publisher: livro.publisher,
            year: livro.year,
            pages: livro.pages,
            imageUrl: livro.image,
          })}
        />
        <JsonLd
          data={buildBreadcrumbJsonLd([
            { name: 'Início', url: SITE_URL },
            { name: 'Livros', url: `${SITE_URL}/livros` },
            { name: livro.title, url: `${SITE_URL}/livros/${slug}` },
          ])}
        />
        <LivroDetail livro={livro} outrosLivros={outrosLivros} />
      </>
    );
  }

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

  return (
    <>
      <JsonLd
        data={buildBookJsonLd({
          title: fallback.title,
          description: fallback.description,
          slug: fallback.slug,
          isbn: fallback.isbn,
          publisher: fallback.publisher,
          year: fallback.year,
          pages: fallback.pages,
          imageUrl: fallback.image,
        })}
      />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: 'Início', url: SITE_URL },
          { name: 'Livros', url: `${SITE_URL}/livros` },
          { name: fallback.title, url: `${SITE_URL}/livros/${slug}` },
        ])}
      />
      <LivroDetail livro={fallback} outrosLivros={outrosLivros} />
    </>
  );
}
