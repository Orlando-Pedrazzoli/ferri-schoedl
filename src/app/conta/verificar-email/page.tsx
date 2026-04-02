import { Suspense } from 'react';
import VerificarEmailForm from './VerificarEmailForm';

export default function VerificarEmailPage() {
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
      <VerificarEmailForm />
    </Suspense>
  );
}
