'use client';

import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { AuthProvider } from '@/components/AuthProvider';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  if (isLoginPage || status !== 'authenticated') {
    return <>{children}</>;
  }

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
