import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Course from '@/models/Course';
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
    const course = await Course.findById(id).lean();

    if (!course) {
      return NextResponse.json(
        { success: false, error: 'Curso não encontrado' },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: course });
  } catch (err) {
    console.error('Error fetching course:', err);
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar curso' },
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

    const course = await Course.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).lean();

    if (!course) {
      return NextResponse.json(
        { success: false, error: 'Curso não encontrado' },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: course });
  } catch (err: unknown) {
    console.error('Error updating course:', err);
    const message =
      err instanceof Error ? err.message : 'Erro ao atualizar curso';
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
    const course = await Course.findByIdAndDelete(id).lean();

    if (!course) {
      return NextResponse.json(
        { success: false, error: 'Curso não encontrado' },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Curso eliminado com sucesso',
    });
  } catch (err) {
    console.error('Error deleting course:', err);
    return NextResponse.json(
      { success: false, error: 'Erro ao eliminar curso' },
      { status: 500 },
    );
  }
}
