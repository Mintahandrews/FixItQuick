import { useNavigate } from 'react-router-dom';
import { ArrowRight, Zap } from 'lucide-react';
import { Solution } from '../types';
import DifficultyBadge from './DifficultyBadge';

interface SuggestedSolutionProps {
  solution: Solution;
}

export default function SuggestedSolution({ solution }: SuggestedSolutionProps) {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/solution/${solution.id}`);
  };
  
  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg p-4 cursor-pointer hover:shadow-md transition-all hover:-translate-y-1 group animate-enter"
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex-shrink-0">
          <Zap size={18} />
        </div>
        <div>
          <div className="mb-1">
            {solution.difficulty && <DifficultyBadge level={solution.difficulty} size="sm" />}
          </div>
          <h3 className="font-medium text-lg">{solution.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">{solution.shortDescription}</p>
          <div className="mt-3 flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium">
            View solution
            <ArrowRight size={14} className="ml-1 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </div>
  );
}
