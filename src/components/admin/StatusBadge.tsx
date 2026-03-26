interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

const variantMap: Record<string, string> = {
  publicado: 'bg-green-500/10 text-green-400 border-green-500/20',
  rascunho: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  arquivado: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  ativo: 'bg-green-500/10 text-green-400 border-green-500/20',
  inativo: 'bg-red-500/10 text-red-400 border-red-500/20',
  direto: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  editora: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  true: 'bg-green-500/10 text-green-400 border-green-500/20',
  false: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const colorMap: Record<string, string> = {
  default: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  success: 'bg-green-500/10 text-green-400 border-green-500/20',
  warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  danger: 'bg-red-500/10 text-red-400 border-red-500/20',
  info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
};

export function StatusBadge({ status, variant }: StatusBadgeProps) {
  const classes =
    (variant ? colorMap[variant] : variantMap[status.toLowerCase()]) ||
    colorMap.default;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${classes}`}
    >
      {status}
    </span>
  );
}
