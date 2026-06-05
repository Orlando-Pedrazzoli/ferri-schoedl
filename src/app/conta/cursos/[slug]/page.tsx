import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Course from '@/models/Course';
import { hasCourseAccess } from '@/lib/access';
import { CoursePlayer } from './CoursePlayer';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Assistir curso — Ferri Schoedl Advocacia`,
    alternates: { canonical: `/conta/cursos/${slug}` },
    robots: { index: false, follow: false },
  };
}

export default async function AssistirCursoPage({ params }: Props) {
  const { slug } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== 'customer') {
    redirect(`/conta/login?callbackUrl=/conta/cursos/${slug}`);
  }

  await dbConnect();
  const course = await Course.findOne({ slug }).lean<{
    _id: unknown;
    title: string;
    subtitle?: string;
    modules: Array<{
      title: string;
      lessons: Array<{
        title: string;
        duration: string;
        videoId: string;
        isPreview?: boolean;
        materials?: Array<{
          _id: unknown;
          title: string;
          fileName: string;
          fileId: string;
          size: number;
        }>;
      }>;
    }>;
  } | null>();

  if (!course) {
    notFound();
  }

  const allowed = await hasCourseAccess({
    email: session.user.email,
    customerId: session.user.id,
    courseId: String(course._id),
  });
  if (!allowed) {
    // Ainda não comprou — manda para a página de venda
    redirect(`/cursos/${slug}`);
  }

  const modules = (course.modules || []).map(m => ({
    title: m.title || '',
    lessons: (m.lessons || [])
      .filter(l => l.videoId)
      .map(l => ({
        title: l.title || '',
        duration: l.duration || '',
        videoId: l.videoId,
        materials: (l.materials || [])
          .filter(mat => mat.fileId)
          .map(mat => ({
            title: mat.title || mat.fileName || 'Material em PDF',
            fileName: mat.fileName || '',
            size: mat.size || 0,
            href: `/api/conta/cursos/${slug}/materiais/${String(mat._id)}/download`,
          })),
      })),
  }));

  return (
    <CoursePlayer
      title={course.title}
      subtitle={course.subtitle || ''}
      modules={modules}
    />
  );
}
