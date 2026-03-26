import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import SiteContent from '@/models/SiteContent';
import { requireAdmin } from '@/lib/auth-helpers';

// GET /api/admin/content — List all content, optionally filtered by page
export async function GET(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page');

    const filter = page ? { page } : {};
    const content = await SiteContent.find(filter)
      .sort({ page: 1, section: 1, field: 1 })
      .lean();

    return NextResponse.json({ success: true, data: content });
  } catch (err) {
    console.error('Error fetching content:', err);
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar conteúdo' },
      { status: 500 },
    );
  }
}

// POST /api/admin/content — Create a new content entry
export async function POST(request: NextRequest) {
  const { error, session } = await requireAdmin();
  if (error) return error;

  try {
    await dbConnect();
    const body = await request.json();

    // Auto-generate key if not provided
    if (!body.key && body.page && body.section && body.field) {
      body.key = `${body.page}.${body.section}.${body.field}`;
    }

    body.updatedBy = session?.user?.email || 'admin';

    const content = await SiteContent.create(body);
    return NextResponse.json({ success: true, data: content }, { status: 201 });
  } catch (err: unknown) {
    console.error('Error creating content:', err);
    const message =
      err instanceof Error ? err.message : 'Erro ao criar conteúdo';
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 },
    );
  }
}
