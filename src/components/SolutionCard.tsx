import { useNavigate } from 'react-router-dom';
import { Bookmark, Clock, Shield } from 'lucide-react';
import { Solution } from '../types';
import { useBookmarks } from '../hooks/useBookmarks';
import DifficultyBadge from './DifficultyBadge';

interface SolutionCardProps {
  solution: Solution;
}

export default function SolutionCard({ solution }: SolutionCardProps) {
  const navigate = useNavigate();
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarks();
  const bookmarked = isBookmarked(solution.id);
  
  const handleClick = () => {
    navigate(`/solution/${solution.id}`);
  };
  
  const toggleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (bookmarked) {
      removeBookmark(solution.id);
    } else {
      addBookmark(solution.id);
    }
  };
  
  return (
    <div 
      className="card cursor-pointer relative h-full flex flex-col transition-all hover:-translate-y-1 hover:shadow-md animate-enter"
      onClick={handleClick}
    >
      <div className="flex justify-between items-start">
        <div className="mb-2">
          {solution.difficulty && <DifficultyBadge level={solution.difficulty} size="sm" />}
        </div>
        <button 
          className={`p-1.5 rounded-full transition-colors ${
            bookmarked 
              ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30' 
              : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
          onClick={toggleBookmark}
          title={bookmarked ? "Remove bookmark" : "Add bookmark"}
          aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
        >
          <Bookmark size={18} fill={bookmarked ? "currentColor" : "none"} />
        </button>
      </div>
      
      <h3 className="font-medium text-lg mb-2">{solution.title}</h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 flex-grow">{solution.shortDescription}</p>
      
      <div className="flex justify-between items-center">
        <div className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide flex items-center">
          {solution.steps.length} {solution.steps.length === 1 ? 'STEP' : 'STEPS'}
        </div>
        
        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
          <Clock size={14} />
          <span>{solution.steps.length < 3 ? '~2 min' : solution.steps.length < 5 ? '~5 min' : '~10 min'}</span>
        </div>
      </div>
    </div>
  );
}
