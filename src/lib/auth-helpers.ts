import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function getAdminSession() {
  const session = await getServerSession(authOptions);

  if (!session?.user || !(session.user as { role: string }).role) {
    return null;
  }

  return session;
}

export async function requireAdmin() {
  const session = await getAdminSession();

  if (!session) {
    return {
      error: NextResponse.json(
        { success: false, error: 'Não autorizado' },
        { status: 401 },
      ),
      session: null,
    };
  }

  return { error: null, session };
}

// Helper to get content with fallback to data.ts values
export async function getContentValue(
  key: string,
  fallback: string = '',
): Promise<string> {
  try {
    const { default: dbConnect } = await import('@/lib/mongodb');
    const { default: SiteContent } = await import('@/models/SiteContent');

    await dbConnect();
    const content = await SiteContent.findOne({ key }).lean();

    if (content && content.value) {
      return content.value;
    }

    return fallback;
  } catch {
    // If DB is unavailable, return fallback
    return fallback;
  }
}

// Helper to get multiple content values for a page
export async function getPageContent(
  page: string,
): Promise<Record<string, string>> {
  try {
    const { default: dbConnect } = await import('@/lib/mongodb');
    const { default: SiteContent } = await import('@/models/SiteContent');

    await dbConnect();
    const contents = await SiteContent.find({ page }).lean();

    const contentMap: Record<string, string> = {};
    for (const item of contents) {
      contentMap[item.key] = item.value;
    }

    return contentMap;
  } catch {
    return {};
  }
}
