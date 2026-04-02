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
    <header className='border-b border-gold-500/10 bg-navy-900 px-6 py-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-xl font-semibold text-cream-100'>{title}</h1>
          {description && (
            <p className='mt-0.5 text-sm text-txt-muted'>{description}</p>
          )}
        </div>

        <div className='flex items-center gap-4'>
          {actions}

          {session?.user && (
            <div className='flex items-center gap-2 text-sm text-txt-muted'>
              <div className='flex h-8 w-8 items-center justify-center rounded-full bg-gold-500/10'>
                <User size={14} className='text-gold-500' />
              </div>
              <span className='hidden sm:inline'>{session.user.name}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
