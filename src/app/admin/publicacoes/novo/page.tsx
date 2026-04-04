import { AdminHeader } from '@/components/admin/AdminHeader';
import { ArticleForm } from '@/components/admin/ArticleForm';

export default function NewArticlePage() {
  return (
    <>
      <AdminHeader
        title='Nova Publicação'
        description='Adicionar uma nova publicação'
      />
      <div className='flex-1 p-6 overflow-auto'>
        <ArticleForm />
      </div>
    </>
  );
}
