import type { MetadataRoute } from 'next';
import dbConnect from '@/lib/mongodb';
import Book from '@/models/Book';
import Course from '@/models/Course';

const BASE_URL = 'https://www.ferrischoedl.adv.br';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();

  // ─── Static Pages ──────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/sobre`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/areas-de-atuacao`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/livros`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/publicacoes`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/cursos`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contato`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/faq`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/politica-de-privacidade`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/termos-de-uso`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // ─── Dynamic — Books from MongoDB ─────────────────────
  let bookPages: MetadataRoute.Sitemap = [];
  try {
    await dbConnect();
    const books = await Book.find({ isActive: true })
      .select('slug updatedAt')
      .lean();
    bookPages = books.map((b: any) => ({
      url: `${BASE_URL}/livros/${b.slug}`,
      lastModified: b.updatedAt ? new Date(b.updatedAt).toISOString() : now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));
  } catch {
    // DB fail — sitemap still works with static pages
  }

  // ─── Dynamic — Courses from MongoDB ───────────────────
  let coursePages: MetadataRoute.Sitemap = [];
  try {
    await dbConnect();
    const courses = await Course.find({ isActive: true, status: 'publicado' })
      .select('slug updatedAt')
      .lean();
    coursePages = courses.map((c: any) => ({
      url: `${BASE_URL}/cursos/${c.slug}`,
      lastModified: c.updatedAt ? new Date(c.updatedAt).toISOString() : now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch {
    // DB fail — sitemap still works with static pages
  }

  return [...staticPages, ...bookPages, ...coursePages];
}
