import { createContext, useState, useContext } from 'react';
import { DifficultyLevel } from '../types';

type FilterSort = 'default' | 'difficulty-asc' | 'difficulty-desc';

interface FilterState {
  difficulty: DifficultyLevel | 'all';
  sort: FilterSort;
}

interface FilterContextType {
  filter: FilterState;
  updateFilter: (newFilter: FilterState) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider = ({ children }: { children: React.ReactNode }) => {
  const [filter, setFilter] = useState<FilterState>({
    difficulty: 'all',
    sort: 'default'
  });

  const updateFilter = (newFilter: FilterState) => {
    setFilter(newFilter);
  };

  return (
    <FilterContext.Provider value={{ filter, updateFilter }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
};
