'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { CourseForm, type CourseInput } from '@/components/admin/CourseForm';

export default function EditCoursePage() {
  const params = useParams();
  const [course, setCourse] = useState<CourseInput | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`/api/admin/courses/${params.id}`);
        const data = await res.json();
        if (data.success) setCourse(data.data);
        else setError('Curso não encontrado');
      } catch {
        setError('Erro ao carregar curso');
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchCourse();
  }, [params.id]);

  if (loading) {
    return (
      <>
        <AdminHeader title='Editar Curso' />
        <div className='flex-1 p-6 flex items-center justify-center'>
          <p className='text-txt-muted'>Carregando...</p>
        </div>
      </>
    );
  }

  if (error || !course) {
    return (
      <>
        <AdminHeader title='Erro' />
        <div className='flex-1 p-6 flex items-center justify-center'>
          <p className='text-red-400'>{error}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminHeader title='Editar Curso' description={course.title} />
      <div className='flex-1 p-6 overflow-auto'>
        <CourseForm initialData={course} isEditing />
      </div>
    </>
  );
}
