import { AdminHeader } from '@/components/admin/AdminHeader';
import { BookForm } from '@/components/admin/BookForm';

export default function NewBookPage() {
  return (
    <>
      <AdminHeader
        title='Novo Livro'
        description='Adicionar um novo livro a loja'
      />
      <div className='flex-1 p-6 overflow-auto'>
        <BookForm />
      </div>
    </>
  );
}
