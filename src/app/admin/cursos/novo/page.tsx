import { AdminHeader } from '@/components/admin/AdminHeader';
import { CourseForm } from '@/components/admin/CourseForm';

export default function NewCoursePage() {
  return (
    <>
      <AdminHeader
        title='Novo Curso'
        description='Adicionar um novo curso preparatorio'
      />
      <div className='flex-1 p-6 overflow-auto'>
        <CourseForm />
      </div>
    </>
  );
}
