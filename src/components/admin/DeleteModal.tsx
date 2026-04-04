'use client';

interface DeleteModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function DeleteModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  loading = false,
}: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      <div
        className='absolute inset-0 bg-black/60 backdrop-blur-sm'
        onClick={onCancel}
      />

      <div className='relative bg-navy-900 border border-gold-500/10 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl'>
        <h3 className='text-lg font-semibold text-cream-100 mb-2'>{title}</h3>
        <p className='text-sm text-txt-muted mb-6'>{message}</p>

        <div className='flex justify-end gap-3'>
          <button
            onClick={onCancel}
            disabled={loading}
            className='px-4 py-2 text-sm text-txt-muted hover:text-cream-100 bg-navy-800 rounded-lg transition-colors'
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className='px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 rounded-lg transition-colors'
          >
            {loading ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
}
