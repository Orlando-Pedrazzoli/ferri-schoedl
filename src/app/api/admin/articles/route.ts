import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Article from '@/models/Article';
import { requireAdmin } from '@/lib/auth-helpers';

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    await dbConnect();
    const articles = await Article.find().sort({ year: -1, order: 1 }).lean();
    return NextResponse.json({ success: true, data: articles });
  } catch (err) {
    console.error('Error fetching articles:', err);
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar artigos' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    await dbConnect();
    const body = await request.json();

    if (body.order === undefined) {
      const lastArticle = await Article.findOne().sort({ order: -1 }).lean();
      body.order = lastArticle ? lastArticle.order + 1 : 0;
    }

    const article = await Article.create(body);
    return NextResponse.json({ success: true, data: article }, { status: 201 });
  } catch (err: unknown) {
    console.error('Error creating article:', err);
    const message = err instanceof Error ? err.message : 'Erro ao criar artigo';
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 },
    );
  }
}
