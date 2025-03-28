import { createContext, useState, useEffect, useContext } from 'react';
import { Solution } from '../types';
import { solutions } from '../data/solutions';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '../utils/localStorage';

type RecentlyViewedItem = {
  id: string;
  viewedAt: number;
};

type RecentlyViewedContextType = {
  addToRecentlyViewed: (solutionId: string) => void;
  getRecentlyViewedSolutions: () => Solution[];
  clearRecentlyViewed: () => void;
};

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

export const RecentlyViewedProvider = ({ children }: { children: React.ReactNode }) => {
  // Maximum number of recently viewed items to store
  const MAX_RECENTLY_VIEWED = 8;
  
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedItem[]>(() => {
    return getStorageItem<RecentlyViewedItem[]>(STORAGE_KEYS.RECENTLY_VIEWED, []);
  });

  // Update localStorage when recentlyViewed changes
  useEffect(() => {
    setStorageItem(STORAGE_KEYS.RECENTLY_VIEWED, recentlyViewed);
  }, [recentlyViewed]);

  const addToRecentlyViewed = (solutionId: string) => {
    setRecentlyViewed(prev => {
      // Remove if already exists
      const filtered = prev.filter(item => item.id !== solutionId);
      // Add to beginning of array with current timestamp
      const updated = [{ id: solutionId, viewedAt: Date.now() }, ...filtered];
      // Limit to MAX_RECENTLY_VIEWED items
      return updated.slice(0, MAX_RECENTLY_VIEWED);
    });
  };

  const getRecentlyViewedSolutions = (): Solution[] => {
    return recentlyViewed
      .map(item => solutions.find(solution => solution.id === item.id))
      .filter((solution): solution is Solution => solution !== undefined);
  };
  
  const clearRecentlyViewed = () => {
    setRecentlyViewed([]);
  };

  return (
    <RecentlyViewedContext.Provider value={{ 
      addToRecentlyViewed, 
      getRecentlyViewedSolutions,
      clearRecentlyViewed
    }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
};

export const useRecentlyViewed = () => {
  const context = useContext(RecentlyViewedContext);
  if (context === undefined) {
    throw new Error('useRecentlyViewed must be used within a RecentlyViewedProvider');
  }
  return context;
};
