import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Course from '@/models/Course';
import { requireAdmin } from '@/lib/auth-helpers';

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    await dbConnect();
    const courses = await Course.find().sort({ order: 1 }).lean();
    return NextResponse.json({ success: true, data: courses });
  } catch (err) {
    console.error('Error fetching courses:', err);
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar cursos' },
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

    if (!body.slug && body.title) {
      body.slug = body.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    }

    if (body.order === undefined) {
      const lastCourse = await Course.findOne().sort({ order: -1 }).lean();
      body.order = lastCourse ? lastCourse.order + 1 : 0;
    }

    const course = await Course.create(body);
    return NextResponse.json({ success: true, data: course }, { status: 201 });
  } catch (err: unknown) {
    console.error('Error creating course:', err);
    const message = err instanceof Error ? err.message : 'Erro ao criar curso';
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 },
    );
  }
}
