import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Book from '@/models/Book';
import { requireAdmin } from '@/lib/auth-helpers';

// GET /api/admin/books — List all books
export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    await dbConnect();
    const books = await Book.find().sort({ order: 1 }).lean();
    return NextResponse.json({ success: true, data: books });
  } catch (err) {
    console.error('Error fetching books:', err);
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar livros' },
      { status: 500 },
    );
  }
}

// POST /api/admin/books — Create a new book
export async function POST(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    await dbConnect();
    const body = await request.json();

    // Auto-generate slug if not provided
    if (!body.slug && body.title) {
      body.slug = body.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    }

    // Set order to last position if not provided
    if (body.order === undefined) {
      const lastBook = await Book.findOne().sort({ order: -1 }).lean();
      body.order = lastBook ? lastBook.order + 1 : 0;
    }

    const book = await Book.create(body);
    return NextResponse.json({ success: true, data: book }, { status: 201 });
  } catch (err: unknown) {
    console.error('Error creating book:', err);
    const message = err instanceof Error ? err.message : 'Erro ao criar livro';
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 },
    );
  }
}
