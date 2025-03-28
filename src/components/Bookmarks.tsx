import { useNavigate } from 'react-router-dom';
import { Bookmark, ChevronLeft } from 'lucide-react';
import { useBookmarks } from '../hooks/useBookmarks';
import SolutionCard from './SolutionCard';

export default function Bookmarks() {
  const navigate = useNavigate();
  const { getBookmarkedSolutions } = useBookmarks();
  const bookmarkedSolutions = getBookmarkedSolutions();
  
  return (
    <div>
      <button 
        className="flex items-center text-blue-600 mb-6 hover:underline"
        onClick={() => navigate(-1)}
      >
        <ChevronLeft size={20} /> Back
      </button>
      
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 text-blue-600">
          <Bookmark size={24} fill="currentColor" />
        </div>
        <h1 className="text-2xl font-bold">Bookmarked Solutions</h1>
      </div>
      
      {bookmarkedSolutions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookmarkedSolutions.map(solution => (
            <SolutionCard key={solution.id} solution={solution} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-2">No bookmarked solutions yet</p>
          <p className="text-sm text-gray-500 mb-4">
            Save your favorite solutions for quick access
          </p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/')}
          >
            Browse Solutions
          </button>
        </div>
      )}
    </div>
  );
}
