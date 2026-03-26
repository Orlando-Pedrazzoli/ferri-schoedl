'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { CourseForm } from '@/components/admin/CourseForm';

interface CourseModule {
  title: string;
  description: string;
  lessons: string[];
  duration: string;
}

interface CourseData {
  _id?: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  instructor: string;
  image: string;
  price: number;
  originalPrice: number;
  duration: string;
  modules: CourseModule[];
  level: 'iniciante' | 'intermediario' | 'avancado';
  category: string;
  topics: string[];
  featured: boolean;
  isActive: boolean;
  status: 'rascunho' | 'publicado' | 'arquivado';
  order: number;
}

export default function EditCoursePage() {
  const params = useParams();
  const [course, setCourse] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`/api/admin/courses/${params.id}`);
        const data = await res.json();
        if (data.success) setCourse(data.data);
        else setError('Curso nao encontrado');
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
          <p className='text-gray-400'>Carregando...</p>
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
