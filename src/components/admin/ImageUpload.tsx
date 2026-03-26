'use client';

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
}

export function ImageUpload({
  value,
  onChange,
  folder = 'ferri-schoedl',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Erro no upload');
      }

      onChange(data.data.url);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Erro ao fazer upload';
      setError(message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className='space-y-2'>
      {/* Preview */}
      {value ? (
        <div className='relative inline-block'>
          <Image
            src={value}
            alt='Preview'
            width={200}
            height={200}
            className='rounded-lg object-cover border border-[#1f2937]'
          />
          <button
            type='button'
            onClick={() => onChange('')}
            className='absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors'
          >
            <X size={12} />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className='w-48 h-48 border-2 border-dashed border-[#1f2937] rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-amber-500/50 transition-colors'
        >
          <ImageIcon size={24} className='text-gray-500' />
          <span className='text-xs text-gray-500'>Clique para enviar</span>
        </div>
      )}

      {/* Upload button */}
      <div className='flex items-center gap-2'>
        <button
          type='button'
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className='flex items-center gap-2 px-3 py-1.5 bg-[#1f2937] text-gray-300 text-sm rounded-lg hover:bg-[#374151] disabled:opacity-50 transition-colors'
        >
          <Upload size={14} />
          {uploading ? 'Enviando...' : 'Upload'}
        </button>

        {/* Manual URL input */}
        <input
          type='text'
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder='Ou cole o URL da imagem'
          className='flex-1 px-3 py-1.5 bg-[#0a0f1c] border border-[#1f2937] rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-amber-500/50'
        />
      </div>

      {error && <p className='text-xs text-red-400'>{error}</p>}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type='file'
        accept='image/jpeg,image/png,image/webp,image/gif'
        onChange={handleUpload}
        className='hidden'
      />
    </div>
  );
}
