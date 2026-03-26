'use client';

import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { AuthProvider } from '@/components/AuthProvider';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { useEffect } from 'react';

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === '/admin/login';

  // Redirect to login if not authenticated (and not already on login page)
  useEffect(() => {
    if (status === 'unauthenticated' && !isLoginPage) {
      router.push('/admin/login');
    }
  }, [status, isLoginPage, router]);

  // Login page — no sidebar, no loading
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Loading state — show a spinner instead of rendering without sidebar
  if (status === 'loading') {
    return (
      <div className='flex min-h-screen bg-[#0a0f1c] items-center justify-center'>
        <div className='text-gray-400 text-sm'>Carregando...</div>
      </div>
    );
  }

  // Not authenticated — don't render anything (redirect will happen via useEffect)
  if (status !== 'authenticated') {
    return null;
  }

  // Authenticated — render with sidebar
  return (
    <div className='flex min-h-screen bg-[#0a0f1c]'>
      <AdminSidebar />
      <div className='flex-1 flex flex-col overflow-hidden'>{children}</div>
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
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AuthProvider>
  );
}
