import { getToken } from 'next-auth/jwt';
import { cookies, headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function getAdminSession() {
  try {
    // Build a minimal request object from headers and cookies
    // so getToken can read the JWT from the cookie
    const cookieStore = await cookies();
    const headerStore = await headers();

    const req = {
      headers: {
        get: (name: string) => headerStore.get(name),
      },
      cookies: {
        get: (name: string) => cookieStore.get(name),
        getAll: () => cookieStore.getAll(),
      },
    };

    const token = await getToken({
      req: req as any,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token || !token.role) {
      return null;
    }

    return {
      user: {
        id: token.id as string,
        name: token.name as string,
        email: token.email as string,
        role: token.role as string,
      },
    };
  } catch (err) {
    console.error('Error getting admin session:', err);
    return null;
  }
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
