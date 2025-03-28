import { useState, useEffect } from 'react';
import { BookmarkedSolution, Solution } from '../types';
import { solutions } from '../data/solutions';
import { useAuth } from '../contexts/AuthContext';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '../utils/localStorage';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<BookmarkedSolution[]>([]);
  const { currentUser } = useAuth();
  const userId = currentUser?.id || 'anonymous';
  
  // Load bookmarks from localStorage on initial render
  useEffect(() => {
    const savedBookmarks = getStorageItem<BookmarkedSolution[]>(
      STORAGE_KEYS.BOOKMARKS(userId), 
      []
    );
    setBookmarks(savedBookmarks);
  }, [userId]);
  
  // Save bookmarks to localStorage whenever they change
  useEffect(() => {
    setStorageItem(STORAGE_KEYS.BOOKMARKS(userId), bookmarks);
  }, [bookmarks, userId]);
  
  const addBookmark = (solutionId: string) => {
    if (!bookmarks.some(bookmark => bookmark.id === solutionId)) {
      setBookmarks(prevBookmarks => [
        ...prevBookmarks, 
        { id: solutionId, dateAdded: Date.now() }
      ]);
    }
  };
  
  const removeBookmark = (solutionId: string) => {
    setBookmarks(prevBookmarks => 
      prevBookmarks.filter(bookmark => bookmark.id !== solutionId)
    );
  };
  
  const isBookmarked = (solutionId: string) => {
    return bookmarks.some(bookmark => bookmark.id === solutionId);
  };
  
  const getBookmarkedSolutions = (): Solution[] => {
    return bookmarks
      .map(bookmark => solutions.find(solution => solution.id === bookmark.id))
      .filter((solution): solution is Solution => solution !== undefined)
      .sort((a, b) => {
        const aDate = bookmarks.find(bookmark => bookmark.id === a.id)?.dateAdded || 0;
        const bDate = bookmarks.find(bookmark => bookmark.id === b.id)?.dateAdded || 0;
        return bDate - aDate; // Sort by most recently bookmarked
      });
  };
  
  const clearAllBookmarks = () => {
    setBookmarks([]);
  };
  
  return { 
    bookmarks, 
    addBookmark, 
    removeBookmark, 
    isBookmarked,
    getBookmarkedSolutions,
    clearAllBookmarks
  };
}
