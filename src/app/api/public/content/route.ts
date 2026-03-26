import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import SiteContent from '@/models/SiteContent';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page');
    const key = searchParams.get('key');

    if (key) {
      const content = await SiteContent.findOne({ key }).lean();
      return NextResponse.json({
        success: true,
        data: content ? content.value : null,
      });
    }

    if (page) {
      const contents = await SiteContent.find({ page }).lean();
      const contentMap: Record<string, string> = {};
      for (const item of contents) {
        contentMap[item.key] = item.value;
      }
      return NextResponse.json({ success: true, data: contentMap });
    }

    return NextResponse.json(
      { success: false, error: 'Parâmetro page ou key é obrigatório' },
      { status: 400 },
    );
  } catch (err) {
    console.error('Error fetching public content:', err);
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar conteúdo' },
      { status: 500 },
    );
  }
}
