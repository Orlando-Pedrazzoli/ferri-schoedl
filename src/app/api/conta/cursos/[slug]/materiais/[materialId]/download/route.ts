import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Course from '@/models/Course';
import { hasCourseAccess } from '@/lib/access';
import { getEbookDownloadUrl } from '@/lib/cloudinary';

export const runtime = 'nodejs';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string; materialId: string }> },
) {
  const { slug, materialId } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== 'customer') {
    return NextResponse.json(
      { error: 'Autenticação necessária.' },
      { status: 401 },
    );
  }

  await dbConnect();

  const course = await Course.findOne({ slug }).select('modules').lean<{
    _id: unknown;
    modules: Array<{
      lessons?: Array<{
        materials?: Array<{ _id: unknown; fileId: string; fileName: string }>;
      }>;
    }>;
  } | null>();

  if (!course) {
    return NextResponse.json(
      { error: 'Curso não encontrado.' },
      { status: 404 },
    );
  }

  // Localiza o material pelo _id dentro de qualquer aula do curso
  let material: { fileId: string; fileName: string } | null = null;
  for (const mod of course.modules || []) {
    for (const lesson of mod.lessons || []) {
      for (const mat of lesson.materials || []) {
        if (String(mat._id) === materialId && mat.fileId) {
          material = { fileId: mat.fileId, fileName: mat.fileName };
          break;
        }
      }
      if (material) break;
    }
    if (material) break;
  }

  if (!material) {
    return NextResponse.json(
      { error: 'Material não disponível.' },
      { status: 404 },
    );
  }

  // Mesmo gate de compra usado para assistir ao curso
  const allowed = await hasCourseAccess({
    email: session.user.email,
    customerId: session.user.id,
    courseId: String(course._id),
  });

  if (!allowed) {
    return NextResponse.json(
      { error: 'Você não tem acesso a este material.' },
      { status: 403 },
    );
  }

  // URL assinada e temporária do Cloudinary (gerada a cada clique)
  const url = getEbookDownloadUrl(
    material.fileId,
    material.fileName || 'material.pdf',
  );

  return NextResponse.redirect(url);
}
