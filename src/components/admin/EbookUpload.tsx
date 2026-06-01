'use client';

import { useState, useRef } from 'react';
import { Upload, X, FileText } from 'lucide-react';

interface EbookValue {
  fileId: string;
  fileName: string;
  size: number;
}

interface EbookUploadProps {
  fileId: string;
  fileName: string;
  size: number;
  onChange: (val: EbookValue) => void;
  folder?: string; // mantido por compatibilidade; a pasta real vem da assinatura
}

function formatBytes(bytes: number): string {
  if (!bytes) return '';
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function EbookUpload({
  fileId,
  fileName,
  size,
  onChange,
}: EbookUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');

    if (file.type !== 'application/pdf') {
      setError('Apenas ficheiros PDF.');
      return;
    }

    setUploading(true);
    try {
      // 1) Pedir assinatura ao backend (admin-only)
      const signRes = await fetch('/api/admin/upload/sign', {
        method: 'POST',
      });
      const signData = await signRes.json();
      if (!signData.success) {
        throw new Error(signData.error || 'Falha ao assinar upload');
      }
      const { signature, timestamp, apiKey, cloudName, folder } = signData.data;

      // 2) Upload direto para o Cloudinary (sem passar pela função serverless)
      const fd = new FormData();
      fd.append('file', file);
      fd.append('api_key', apiKey);
      fd.append('timestamp', String(timestamp));
      fd.append('signature', signature);
      fd.append('folder', folder);
      fd.append('type', 'authenticated');

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`,
        { method: 'POST', body: fd },
      );
      const data = await res.json();

      if (data.error) {
        throw new Error(data.error.message || 'Erro no upload');
      }

      onChange({
        fileId: data.public_id,
        fileName: file.name,
        size: data.bytes,
      });
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
      {fileId ? (
        <div className='flex items-center gap-3 rounded-lg border border-gold-500/15 bg-navy-950 p-3'>
          <FileText size={20} className='shrink-0 text-gold-500' />
          <div className='min-w-0 flex-1'>
            <p className='truncate text-sm text-cream-100'>
              {fileName || 'ebook.pdf'}
            </p>
            <p className='text-xs text-txt-muted'>
              {formatBytes(size)} · PDF protegido
            </p>
          </div>
          <button
            type='button'
            onClick={() => onChange({ fileId: '', fileName: '', size: 0 })}
            className='shrink-0 text-txt-muted transition-colors hover:text-red-400'
            aria-label='Remover eBook'
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className='flex h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gold-500/15 transition-colors hover:border-gold-500/40'
        >
          <FileText size={22} className='text-txt-muted' />
          <span className='text-xs text-txt-muted'>
            Clique para enviar o PDF
          </span>
        </div>
      )}

      <button
        type='button'
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className='flex items-center gap-2 rounded-lg bg-navy-800 px-3 py-1.5 text-sm text-cream-200 transition-colors hover:bg-navy-700 disabled:opacity-50'
      >
        <Upload size={14} />
        {uploading ? 'Enviando...' : fileId ? 'Substituir PDF' : 'Upload PDF'}
      </button>

      {error && <p className='text-xs text-red-400'>{error}</p>}

      <input
        ref={fileInputRef}
        type='file'
        accept='application/pdf'
        onChange={handleUpload}
        className='hidden'
      />
    </div>
  );
}
