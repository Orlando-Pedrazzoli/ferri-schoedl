import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { AuthProvider } from '@/components/AuthProvider';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export const metadata = {
  title: 'Admin | Ferri Schoedl Advocacia',
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Login page renders without sidebar
  if (!session) {
    return <AuthProvider>{children}</AuthProvider>;
  }

  return (
    <AuthProvider>
      <div className='flex min-h-screen bg-[#0a0f1c]'>
        <AdminSidebar />
        <div className='flex-1 flex flex-col overflow-hidden'>{children}</div>
      </div>
    </AuthProvider>
  );
}
