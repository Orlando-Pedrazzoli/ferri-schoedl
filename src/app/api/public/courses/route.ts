import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Course from '@/models/Course';

export async function GET() {
  try {
    await dbConnect();
    const courses = await Course.find({
      isActive: true,
      status: 'publicado',
    })
      .sort({ order: 1 })
      .lean();

    return NextResponse.json({ success: true, data: courses });
  } catch (err) {
    console.error('Error fetching public courses:', err);
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar cursos' },
      { status: 500 },
    );
  }
}
