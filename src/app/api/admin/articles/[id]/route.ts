import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Article from '@/models/Article';
import { requireAdmin } from '@/lib/auth-helpers';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    await dbConnect();
    const { id } = await params;
    const article = await Article.findById(id).lean();

    if (!article) {
      return NextResponse.json(
        { success: false, error: 'Artigo não encontrado' },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: article });
  } catch (err) {
    console.error('Error fetching article:', err);
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar artigo' },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    const article = await Article.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).lean();

    if (!article) {
      return NextResponse.json(
        { success: false, error: 'Artigo não encontrado' },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: article });
  } catch (err: unknown) {
    console.error('Error updating article:', err);
    const message =
      err instanceof Error ? err.message : 'Erro ao atualizar artigo';
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 },
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    await dbConnect();
    const { id } = await params;
    const article = await Article.findByIdAndDelete(id).lean();

    if (!article) {
      return NextResponse.json(
        { success: false, error: 'Artigo não encontrado' },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Artigo eliminado com sucesso',
    });
  } catch (err) {
    console.error('Error deleting article:', err);
    return NextResponse.json(
      { success: false, error: 'Erro ao eliminar artigo' },
      { status: 500 },
    );
  }
}
