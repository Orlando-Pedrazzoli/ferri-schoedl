import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Book from '@/models/Book';
import { requireAdmin } from '@/lib/auth-helpers';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/admin/books/[id]
export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    await dbConnect();
    const { id } = await params;
    const book = await Book.findById(id).lean();

    if (!book) {
      return NextResponse.json(
        { success: false, error: 'Livro não encontrado' },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: book });
  } catch (err) {
    console.error('Error fetching book:', err);
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar livro' },
      { status: 500 },
    );
  }
}

// PUT /api/admin/books/[id]
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    const book = await Book.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).lean();

    if (!book) {
      return NextResponse.json(
        { success: false, error: 'Livro não encontrado' },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: book });
  } catch (err: unknown) {
    console.error('Error updating book:', err);
    const message =
      err instanceof Error ? err.message : 'Erro ao atualizar livro';
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 },
    );
  }
}

// DELETE /api/admin/books/[id]
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    await dbConnect();
    const { id } = await params;
    const book = await Book.findByIdAndDelete(id).lean();

    if (!book) {
      return NextResponse.json(
        { success: false, error: 'Livro não encontrado' },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Livro eliminado com sucesso',
    });
  } catch (err) {
    console.error('Error deleting book:', err);
    return NextResponse.json(
      { success: false, error: 'Erro ao eliminar livro' },
      { status: 500 },
    );
  }
}
