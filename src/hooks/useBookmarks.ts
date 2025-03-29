import { BookmarkedSolution, Solution } from "../types";
import { solutions } from "../data/solutions";
import { useAuth } from "../contexts/AuthContext";
import { useLocalStorage } from "./useLocalStorage";

export function useBookmarks() {
  const { currentUser } = useAuth();
  const userId = currentUser?.id || "anonymous";
  const bookmarkKey = `bookmarks-${userId}`;

  const [bookmarks, setBookmarks] = useLocalStorage<BookmarkedSolution[]>(
    bookmarkKey,
    []
  );

  const addBookmark = (solutionId: string) => {
    if (!bookmarks.some((bookmark) => bookmark.id === solutionId)) {
      setBookmarks([...bookmarks, { id: solutionId, dateAdded: Date.now() }]);
    }
  };

  const removeBookmark = (solutionId: string) => {
    setBookmarks(bookmarks.filter((bookmark) => bookmark.id !== solutionId));
  };

  const isBookmarked = (solutionId: string) => {
    return bookmarks.some((bookmark) => bookmark.id === solutionId);
  };

  const getBookmarkedSolutions = (): Solution[] => {
    return bookmarks
      .map((bookmark) =>
        solutions.find((solution) => solution.id === bookmark.id)
      )
      .filter((solution): solution is Solution => solution !== undefined)
      .sort((a, b) => {
        const aDate =
          bookmarks.find((bookmark) => bookmark.id === a.id)?.dateAdded || 0;
        const bDate =
          bookmarks.find((bookmark) => bookmark.id === b.id)?.dateAdded || 0;
        return bDate - aDate; // Sort by most recently bookmarked
      });
  };

  return {
    bookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked,
    getBookmarkedSolutions,
  };
}
