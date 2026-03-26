import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import SiteContent from '@/models/SiteContent';
import { requireAdmin } from '@/lib/auth-helpers';

interface RouteParams {
  params: Promise<{ key: string }>;
}

// GET /api/admin/content/[key]
export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    await dbConnect();
    const { key } = await params;
    const decodedKey = decodeURIComponent(key);

    const content = await SiteContent.findOne({ key: decodedKey }).lean();

    if (!content) {
      return NextResponse.json(
        { success: false, error: 'Conteúdo não encontrado' },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: content });
  } catch (err) {
    console.error('Error fetching content:', err);
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar conteúdo' },
      { status: 500 },
    );
  }
}

// PUT /api/admin/content/[key] — Update content value
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { error, session } = await requireAdmin();
  if (error) return error;

  try {
    await dbConnect();
    const { key } = await params;
    const decodedKey = decodeURIComponent(key);
    const body = await request.json();

    const updateData = {
      ...body,
      updatedBy: session?.user?.email || 'admin',
    };

    const content = await SiteContent.findOneAndUpdate(
      { key: decodedKey },
      updateData,
      { new: true, runValidators: true },
    ).lean();

    if (!content) {
      return NextResponse.json(
        { success: false, error: 'Conteúdo não encontrado' },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: content });
  } catch (err: unknown) {
    console.error('Error updating content:', err);
    const message =
      err instanceof Error ? err.message : 'Erro ao atualizar conteúdo';
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 },
    );
  }
}
