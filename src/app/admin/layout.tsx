'use client';

import type { Metadata } from 'next';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { AuthProvider } from '@/components/AuthProvider';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { useEffect } from 'react';

// ─── SEO: Block all search engines from admin area ───────────
// NOTA: Como este layout é 'use client', o export const metadata
// não funciona directamente aqui. O bloqueio é feito via:
// 1. robots.ts (disallow /admin/)
// 2. next.config.ts headers (X-Robots-Tag: noindex para /admin/*)
// Ambos já estão configurados nos ficheiros 03 e 05.
// ─────────────────────────────────────────────────────────────

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (status === 'unauthenticated' && !isLoginPage) {
      router.push('/admin/login');
    }
  }, [status, isLoginPage, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (status === 'loading') {
    return (
      <div className='flex min-h-screen items-center justify-center bg-navy-950'>
        <div className='text-sm text-txt-muted'>Carregando...</div>
      </div>
    );
  }

  if (status !== 'authenticated') {
    return null;
  }

  return (
    <div className='flex min-h-screen bg-navy-950'>
      <AdminSidebar />
      <div className='flex flex-1 flex-col overflow-hidden'>{children}</div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AdminLayoutInner>{children}</AdminLayoutInner>
      </ThemeProvider>
    </AuthProvider>
  );
}
