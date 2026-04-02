import { Suspense } from 'react';
import LoginForm from './LoginForm';

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen bg-navy-950 pt-28 pb-16'>
          <div className='mx-auto max-w-md px-6 text-center'>
            <p className='text-txt-muted'>A carregar...</p>
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
