import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Article from '@/models/Article';

export async function GET() {
  try {
    await dbConnect();
    const articles = await Article.find({ isActive: true })
      .sort({ year: -1, order: 1 })
      .lean();

    return NextResponse.json({ success: true, data: articles });
  } catch (err) {
    console.error('Error fetching public articles:', err);
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar artigos' },
      { status: 500 },
    );
  }
}
