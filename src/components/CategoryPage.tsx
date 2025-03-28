import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Filter } from 'lucide-react';
import { categories } from '../data/categories';
import { solutions } from '../data/solutions';
import SolutionCard from './SolutionCard';
import * as Icons from 'lucide-react';
import { useFilter } from '../contexts/FilterContext';
import FilterDropdown from './FilterDropdown';

export default function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { filter, updateFilter } = useFilter();
  
  const category = categories.find(c => c.id === categoryId);
  let categorySolutions = solutions.filter(s => s.category === categoryId);
  
  // Apply filters
  if (filter.difficulty !== 'all') {
    categorySolutions = categorySolutions.filter(s => s.difficulty === filter.difficulty);
  }
  
  // Sort solutions
  if (filter.sort === 'difficulty-asc') {
    const order = { easy: 1, medium: 2, hard: 3 };
    categorySolutions = [...categorySolutions].sort((a, b) => {
      return (order[a.difficulty || 'easy'] || 0) - (order[b.difficulty || 'easy'] || 0);
    });
  } else if (filter.sort === 'difficulty-desc') {
    const order = { easy: 1, medium: 2, hard: 3 };
    categorySolutions = [...categorySolutions].sort((a, b) => {
      return (order[b.difficulty || 'easy'] || 0) - (order[a.difficulty || 'easy'] || 0);
    });
  }
  
  // Dynamically get the icon component
  const IconComponent = category ? (Icons as any)[category.icon] || Icons.HelpCircle : Icons.HelpCircle;
  
  if (!category) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-4">Category not found</h2>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/')}
        >
          Back to home
        </button>
      </div>
    );
  }
  
  return (
    <div>
      <button 
        className="flex items-center text-blue-600 mb-6 hover:underline"
        onClick={() => navigate('/')}
      >
        <ChevronLeft size={20} /> Back to categories
      </button>
      
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 bg-blue-50 rounded-full text-blue-600">
          <IconComponent size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{category.name}</h1>
          <p className="text-gray-600">{category.description}</p>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-gray-500">
          {categorySolutions.length} {categorySolutions.length === 1 ? 'solution' : 'solutions'} found
        </div>
        <FilterDropdown />
      </div>
      
      {categorySolutions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categorySolutions.map(solution => (
            <SolutionCard key={solution.id} solution={solution} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-600 dark:text-gray-300 mb-3">No solutions match your current filters.</p>
          <button 
            className="text-blue-600 dark:text-blue-400 underline"
            onClick={() => updateFilter({ difficulty: 'all', sort: 'default' })}
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
