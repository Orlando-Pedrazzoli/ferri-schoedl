import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Book from '@/models/Book';

// GET /api/public/books — Active books for storefront
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const featured = searchParams.get('featured');

    if (slug) {
      const book = await Book.findOne({ slug, isActive: true }).lean();
      if (!book) {
        return NextResponse.json(
          { success: false, error: 'Livro não encontrado' },
          { status: 404 },
        );
      }
      return NextResponse.json({ success: true, data: book });
    }

    const filter: Record<string, unknown> = { isActive: true };
    if (featured === 'true') filter.featured = true;

    const books = await Book.find(filter).sort({ order: 1 }).lean();
    return NextResponse.json({ success: true, data: books });
  } catch (err) {
    console.error('Error fetching public books:', err);
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar livros' },
      { status: 500 },
    );
  }
}
