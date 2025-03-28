import { Shield } from 'lucide-react';

type DifficultyLevel = 'easy' | 'medium' | 'hard';

interface DifficultyBadgeProps {
  level: DifficultyLevel;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

export default function DifficultyBadge({ level, showLabel = true, size = 'md' }: DifficultyBadgeProps) {
  const colors = {
    easy: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800/30',
    medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800/30',
    hard: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800/30'
  };
  
  const labels = {
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Advanced'
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1'
  };
  
  return (
    <div className={`inline-flex items-center gap-1 rounded-full ${colors[level]} ${sizeClasses[size]} border`}>
      <Shield size={size === 'sm' ? 12 : 14} />
      {showLabel && <span className="font-medium">{labels[level]}</span>}
    </div>
  );
}
