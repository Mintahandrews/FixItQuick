export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface Solution {
  id: string;
  title: string;
  category: string;
  shortDescription: string;
  difficulty?: DifficultyLevel;
  steps: {
    title: string;
    description: string;
    imageUrl?: string;
  }[];
  relatedSolutions?: string[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface BookmarkedSolution {
  id: string;
  dateAdded: number;
}
