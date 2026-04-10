import dbConnect from '@/lib/mongodb';
import Course from '@/models/Course';
import { siteConfig } from '@/lib/data';
import { SectionHeading } from '@/components/SectionHeading';
import { CursosContent } from './CursosContent';
import { buildPageMetadata, buildBreadcrumbJsonLd, SITE_URL } from '@/lib/seo';
import JsonLd from '@/components/JsonLd';

export const revalidate = 60;

export const metadata = buildPageMetadata({
  title: 'Cursos e Preparatórios',
  description:
    'Coaching jurídico e preparatórios com a experiência de quem atuou na Promotoria de Justiça, no ensino e na advocacia criminal de alta complexidade.',
  path: '/cursos',
  keywords: [
    'curso direito penal',
    'preparatório concurso magistratura',
    'preparatório ministério público',
    'curso OAB',
    'exame de ordem preparatório',
    'coaching jurídico',
    'concurso público direito',
  ],
});

async function getCourses() {
  try {
    await dbConnect();
    const courses = await Course.find({
      isActive: true,
      status: 'publicado',
    })
      .sort({ order: 1 })
      .lean();
    if (courses && courses.length > 0) {
      return courses.map(c => ({
        slug: c.slug as string,
        title: c.title as string,
        subtitle: (c.subtitle as string) || undefined,
        description: c.description as string,
        image: c.image as string,
        price: c.price as number,
        originalPrice: (c.originalPrice as number) || undefined,
        duration: c.duration as string,
        level: c.level as string,
        category: c.category as string,
      }));
    }
    return null;
  } catch {
    return null;
  }
}

export default async function CursosPage() {
  const dbCourses = await getCourses();

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: 'Início', url: SITE_URL },
          { name: 'Cursos', url: `${SITE_URL}/cursos` },
        ])}
      />
      <section className='pb-16 pt-28 sm:pb-24 sm:pt-32 lg:pb-32'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <SectionHeading
            label='Formação jurídica'
            title='Cursos e preparatórios'
            description='Coaching jurídico e preparatórios com a experiência de quem atuou na Promotoria de Justiça, no ensino e na advocacia criminal de alta complexidade.'
          />

          <CursosContent
            dbCourses={dbCourses}
            stats={{
              livrosPublicados: siteConfig.stats.livrosPublicados,
              artigosPublicados: siteConfig.stats.artigosPublicados,
              anosExperiencia: siteConfig.stats.anosExperiencia,
            }}
          />
        </div>
      </section>
    </>
  );
}
