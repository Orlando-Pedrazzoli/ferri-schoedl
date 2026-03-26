'use client';

import { useSession } from 'next-auth/react';
import { User } from 'lucide-react';

interface AdminHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function AdminHeader({ title, description, actions }: AdminHeaderProps) {
  const { data: session } = useSession();

  return (
    <header className='bg-[#111827] border-b border-[#1f2937] px-6 py-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-xl font-semibold text-white'>{title}</h1>
          {description && (
            <p className='text-sm text-gray-400 mt-0.5'>{description}</p>
          )}
        </div>

        <div className='flex items-center gap-4'>
          {actions}

          {session?.user && (
            <div className='flex items-center gap-2 text-sm text-gray-400'>
              <div className='w-8 h-8 bg-amber-600/10 rounded-full flex items-center justify-center'>
                <User size={14} className='text-amber-500' />
              </div>
              <span className='hidden sm:inline'>{session.user.name}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
