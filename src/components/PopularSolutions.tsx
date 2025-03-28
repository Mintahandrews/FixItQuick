import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Star } from 'lucide-react';
import { solutions } from '../data/solutions';
import SolutionCard from './SolutionCard';

export default function PopularSolutions() {
  const navigate = useNavigate();
  
  // We'll show the 8 most popular solutions (in a real app, this would be based on user activity)
  const popularSolutions = solutions.slice(0, 8);
  
  return (
    <div className="animate-enter">
      <button 
        className="flex items-center text-blue-600 mb-6 hover:underline"
        onClick={() => navigate(-1)}
      >
        <ChevronLeft size={20} /> Back
      </button>
      
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-full text-amber-600 dark:text-amber-400">
          <Star size={24} />
        </div>
        <h1 className="text-2xl font-bold">Popular Solutions</h1>
      </div>
      
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        These are our most frequently accessed solutions. They address common tech problems faced by students every day.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {popularSolutions.map(solution => (
          <SolutionCard key={solution.id} solution={solution} />
        ))}
      </div>
      
      <div className="mt-10 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-100 dark:border-blue-900/30 text-center">
        <h2 className="text-xl font-semibold mb-3">Don't see what you're looking for?</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Browse our categories or use the search function to find specific solutions.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/')}
          >
            Browse Categories
          </button>
          <button
            className="btn bg-white text-gray-800 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600"
            onClick={() => navigate('/suggest')}
          >
            Suggest a Solution
          </button>
        </div>
      </div>
    </div>
  );
}
