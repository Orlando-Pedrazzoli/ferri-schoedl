'use client';

import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { AuthProvider } from '@/components/AuthProvider';
import { useEffect } from 'react';
import { CustomerSidebar } from '@/components/CustomerSidebar';

function ContaLayoutInner({ children }: { children: React.ReactNode }) {
  const { status, data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  // Rotas publicas dentro de /conta que nao precisam de auth
  const publicRoutes = [
    '/conta/login',
    '/conta/registro',
    '/conta/verificar-email',
  ];
  const isPublicRoute = publicRoutes.some(r => pathname.startsWith(r));

  useEffect(() => {
    if (status === 'unauthenticated' && !isPublicRoute) {
      router.push('/conta/login');
    }
  }, [status, isPublicRoute, router]);

  // Rotas publicas: render sem sidebar
  if (isPublicRoute) {
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
    <div className='min-h-screen bg-navy-950 pt-20'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='grid gap-8 py-8 lg:grid-cols-4'>
          <div className='lg:col-span-1'>
            <CustomerSidebar customerName={session?.user?.name || ''} />
          </div>
          <div className='lg:col-span-3'>{children}</div>
        </div>
      </div>
    </div>
  );
}

export default function ContaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <ContaLayoutInner>{children}</ContaLayoutInner>
    </AuthProvider>
  );
}
