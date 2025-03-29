import {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { Solution } from "../types";
import { solutions } from "../data/solutions";

type RecentlyViewedItem = {
  id: string;
  viewedAt: number;
};

type RecentlyViewedContextType = {
  addToRecentlyViewed: (solutionId: string) => void;
  getRecentlyViewedSolutions: () => Solution[];
};

const RecentlyViewedContext = createContext<RecentlyViewedContextType>({
  addToRecentlyViewed: () => {},
  getRecentlyViewedSolutions: () => [],
});

export const useRecentlyViewed = () => {
  const context = useContext(RecentlyViewedContext);
  if (context === undefined) {
    throw new Error(
      "useRecentlyViewed must be used within a RecentlyViewedProvider"
    );
  }
  return context;
};

export const RecentlyViewedProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedItem[]>(
    () => {
      const saved = localStorage.getItem("recentlyViewed");
      return saved ? JSON.parse(saved) : [];
    }
  );

  useEffect(() => {
    localStorage.setItem("recentlyViewed", JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  const addToRecentlyViewed = useCallback((solutionId: string) => {
    setRecentlyViewed((prev) => {
      // Remove if already exists
      const filtered = prev.filter((item) => item.id !== solutionId);
      // Add to beginning of array
      return [{ id: solutionId, viewedAt: Date.now() }, ...filtered].slice(
        0,
        8
      );
    });
  }, []);

  const getRecentlyViewedSolutions = useCallback((): Solution[] => {
    return recentlyViewed
      .map((item) => solutions.find((solution) => solution.id === item.id))
      .filter((solution): solution is Solution => solution !== undefined);
  }, [recentlyViewed]);

  return (
    <RecentlyViewedContext.Provider
      value={{ addToRecentlyViewed, getRecentlyViewedSolutions }}
    >
      {children}
    </RecentlyViewedContext.Provider>
  );
};
