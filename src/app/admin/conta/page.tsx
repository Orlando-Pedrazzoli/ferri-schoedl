'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Lock, User, Check } from 'lucide-react';

export default function AdminContaPage() {
  const { data: session } = useSession();
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const updateField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.newPassword !== form.confirmPassword) {
      setError('As passwords nao coincidem.');
      return;
    }

    if (form.newPassword.length < 6) {
      setError('A nova password deve ter no minimo 6 caracteres.');
      return;
    }

    setSaving(true);

    try {
      const res = await fetch('/api/admin/account/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Erro ao alterar password');
      }

      setSuccess('Password alterada com sucesso!');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Erro ao alterar password';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    'w-full px-3 py-2 bg-[#0a0f1c] border border-[#1f2937] rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-colors';
  const labelClass = 'block text-sm font-medium text-gray-300 mb-1';

  return (
    <>
      <AdminHeader
        title='Minha Conta'
        description='Gerir credenciais de acesso'
      />

      <div className='flex-1 p-6 overflow-auto'>
        <div className='max-w-xl space-y-6'>
          {/* Account info */}
          <div className='bg-[#111827] border border-[#1f2937] rounded-xl p-5'>
            <div className='flex items-center gap-3 mb-4'>
              <div className='w-10 h-10 bg-amber-600/10 rounded-full flex items-center justify-center'>
                <User size={18} className='text-amber-500' />
              </div>
              <div>
                <p className='text-sm font-medium text-white'>
                  {session?.user?.name || 'Admin'}
                </p>
                <p className='text-xs text-gray-400'>
                  {session?.user?.email || ''}
                </p>
              </div>
            </div>
          </div>

          {/* Change password */}
          <div className='bg-[#111827] border border-[#1f2937] rounded-xl p-5'>
            <div className='flex items-center gap-2 mb-5'>
              <Lock size={16} className='text-gray-400' />
              <h3 className='text-sm font-semibold text-white uppercase tracking-wider'>
                Alterar Password
              </h3>
            </div>

            {error && (
              <div className='mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm'>
                {error}
              </div>
            )}

            {success && (
              <div className='mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm flex items-center gap-2'>
                <Check size={14} />
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <label className={labelClass}>Password Atual *</label>
                <input
                  type='password'
                  value={form.currentPassword}
                  onChange={e => updateField('currentPassword', e.target.value)}
                  required
                  className={inputClass}
                  placeholder='Digite a password atual'
                />
              </div>

              <div>
                <label className={labelClass}>Nova Password *</label>
                <input
                  type='password'
                  value={form.newPassword}
                  onChange={e => updateField('newPassword', e.target.value)}
                  required
                  minLength={6}
                  className={inputClass}
                  placeholder='Minimo 6 caracteres'
                />
              </div>

              <div>
                <label className={labelClass}>Confirmar Nova Password *</label>
                <input
                  type='password'
                  value={form.confirmPassword}
                  onChange={e => updateField('confirmPassword', e.target.value)}
                  required
                  minLength={6}
                  className={inputClass}
                  placeholder='Repita a nova password'
                />
              </div>

              <button
                type='submit'
                disabled={saving}
                className='flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-600/50 text-white text-sm font-medium rounded-lg transition-colors'
              >
                <Lock size={14} />
                {saving ? 'Alterando...' : 'Alterar Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
