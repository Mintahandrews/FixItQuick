import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Filter } from 'lucide-react';
import { useFilter } from '../contexts/FilterContext';

export default function FilterDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { filter, updateFilter } = useFilter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center gap-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Filter size={16} />
        <span>Filter</span>
        <ChevronDown size={16} className={`ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 p-3 animate-fade-in">
          <div className="mb-4">
            <h3 className="font-medium mb-2 text-sm text-gray-900 dark:text-gray-100">Difficulty</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="difficulty"
                  value="all"
                  checked={filter.difficulty === 'all'}
                  onChange={() => updateFilter({ ...filter, difficulty: 'all' })}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">All</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="difficulty"
                  value="easy"
                  checked={filter.difficulty === 'easy'}
                  onChange={() => updateFilter({ ...filter, difficulty: 'easy' })}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Easy</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="difficulty"
                  value="medium"
                  checked={filter.difficulty === 'medium'}
                  onChange={() => updateFilter({ ...filter, difficulty: 'medium' })}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Medium</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="difficulty"
                  value="hard"
                  checked={filter.difficulty === 'hard'}
                  onChange={() => updateFilter({ ...filter, difficulty: 'hard' })}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Hard</span>
              </label>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2 text-sm text-gray-900 dark:text-gray-100">Sort By</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="sort"
                  value="default"
                  checked={filter.sort === 'default'}
                  onChange={() => updateFilter({ ...filter, sort: 'default' })}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Default</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="sort"
                  value="difficulty-asc"
                  checked={filter.sort === 'difficulty-asc'}
                  onChange={() => updateFilter({ ...filter, sort: 'difficulty-asc' })}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Easiest First</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="sort"
                  value="difficulty-desc"
                  checked={filter.sort === 'difficulty-desc'}
                  onChange={() => updateFilter({ ...filter, sort: 'difficulty-desc' })}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Hardest First</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
