'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { DeleteModal } from '@/components/admin/DeleteModal';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface Course {
  _id: string;
  title: string;
  subtitle?: string;
  image: string;
  price: number;
  status: string;
  isActive: boolean;
  level: string;
  category: string;
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/admin/courses');
      const data = await res.json();
      if (data.success) setCourses(data.data);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/courses/${deleteId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) setCourses(courses.filter(c => c._id !== deleteId));
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  return (
    <>
      <AdminHeader
        title='Cursos'
        description={`${courses.length} cursos registados`}
        actions={
          <Link
            href='/admin/cursos/novo'
            className='flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-lg transition-colors'
          >
            <Plus size={16} />
            Novo Curso
          </Link>
        }
      />
      <div className='flex-1 p-6 overflow-auto'>
        {loading ? (
          <div className='text-gray-400 text-center py-12'>Carregando...</div>
        ) : courses.length === 0 ? (
          <div className='text-center py-12'>
            <p className='text-gray-400 mb-4'>Nenhum curso registado.</p>
            <Link
              href='/admin/cursos/novo'
              className='text-amber-500 hover:text-amber-400'
            >
              Adicionar primeiro curso
            </Link>
          </div>
        ) : (
          <div className='bg-[#111827] border border-[#1f2937] rounded-xl overflow-hidden'>
            <table className='w-full'>
              <thead>
                <tr className='border-b border-[#1f2937]'>
                  <th className='text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3'>
                    Curso
                  </th>
                  <th className='text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3'>
                    Categoria
                  </th>
                  <th className='text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3'>
                    Preco
                  </th>
                  <th className='text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3'>
                    Nivel
                  </th>
                  <th className='text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3'>
                    Status
                  </th>
                  <th className='text-right text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3'>
                    Acoes
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-[#1f2937]'>
                {courses.map(course => (
                  <tr
                    key={course._id}
                    className='hover:bg-[#1f2937]/50 transition-colors'
                  >
                    <td className='px-4 py-3'>
                      <div className='flex items-center gap-3'>
                        <div className='w-12 h-8 relative rounded overflow-hidden bg-[#1f2937] flex-shrink-0'>
                          {course.image && (
                            <Image
                              src={course.image}
                              alt={course.title}
                              fill
                              className='object-cover'
                            />
                          )}
                        </div>
                        <div className='min-w-0'>
                          <p className='text-sm font-medium text-white truncate'>
                            {course.title}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className='px-4 py-3 text-sm text-gray-300'>
                      {course.category}
                    </td>
                    <td className='px-4 py-3 text-sm text-gray-300'>
                      R$ {course.price.toFixed(2)}
                    </td>
                    <td className='px-4 py-3'>
                      <StatusBadge status={course.level} />
                    </td>
                    <td className='px-4 py-3'>
                      <StatusBadge status={course.status} />
                    </td>
                    <td className='px-4 py-3'>
                      <div className='flex items-center justify-end gap-2'>
                        <Link
                          href={`/admin/cursos/${course._id}/editar`}
                          className='p-2 text-gray-400 hover:text-amber-500 hover:bg-amber-500/10 rounded-lg transition-colors'
                        >
                          <Pencil size={14} />
                        </Link>
                        <button
                          onClick={() => setDeleteId(course._id)}
                          className='p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors'
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <DeleteModal
        isOpen={!!deleteId}
        title='Eliminar Curso'
        message='Tem a certeza que deseja eliminar este curso?'
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </>
  );
}
