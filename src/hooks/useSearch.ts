import { useState, useEffect } from 'react';
import { Solution } from '../types';
import { solutions } from '../data/solutions';

export function useSearch(query: string) {
  const [results, setResults] = useState<Solution[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    
    // Simple search implementation
    const searchQuery = query.toLowerCase();
    const searchResults = solutions.filter(solution => 
      solution.title.toLowerCase().includes(searchQuery) || 
      solution.shortDescription.toLowerCase().includes(searchQuery) ||
      solution.steps.some(step => 
        step.title.toLowerCase().includes(searchQuery) || 
        step.description.toLowerCase().includes(searchQuery)
      )
    );
    
    // Simulate network delay
    const timer = setTimeout(() => {
      setResults(searchResults);
      setIsSearching(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [query]);

  return { results, isSearching };
}
