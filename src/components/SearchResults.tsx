import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, CircleX, Search } from "lucide-react";
import { useSearch } from "../hooks/useSearch";
import SolutionCard from "./SolutionCard";
import FilterDropdown from "./FilterDropdown";
import { useFilter } from "../contexts/FilterContext";
import { useState, useEffect } from "react";

export default function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const { filter } = useFilter();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get("q") || "";
    setQuery(searchQuery);
    if (!searchQuery) {
      navigate("/", { replace: true });
    }
  }, [location.search, navigate]);

  const { results: unfilteredResults, isSearching } = useSearch(query);

  // Apply filters
  let results = unfilteredResults;
  if (filter.difficulty !== "all") {
    results = results.filter((s) => s.difficulty === filter.difficulty);
  }

  // Sort results
  if (filter.sort === "difficulty-asc") {
    const order = { easy: 1, medium: 2, hard: 3 };
    results = [...results].sort((a, b) => {
      return (
        (order[a.difficulty || "easy"] || 0) -
        (order[b.difficulty || "easy"] || 0)
      );
    });
  } else if (filter.sort === "difficulty-desc") {
    const order = { easy: 1, medium: 2, hard: 3 };
    results = [...results].sort((a, b) => {
      return (
        (order[b.difficulty || "easy"] || 0) -
        (order[a.difficulty || "easy"] || 0)
      );
    });
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmedQuery = query.trim();
      if (
        trimmedQuery &&
        trimmedQuery !== new URLSearchParams(location.search).get("q")
      ) {
        navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
      }
    }, 300); // Reduced debounce time for better responsiveness

    return () => clearTimeout(timer);
  }, [query, navigate, location.search]);

  return (
    <div>
      <button
        className="flex items-center text-blue-600 mb-6 hover:underline"
        onClick={() => navigate(-1)}
      >
        <ChevronLeft size={20} /> Back
      </button>

      <form onSubmit={handleSearchSubmit} className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for solutions..."
            className="w-full px-4 py-3 pr-10 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              type="button"
              className="absolute right-12 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              onClick={() => setQuery("")}
            >
              <CircleX size={20} />
            </button>
          )}
          <button
            type="submit"
            className="absolute right-3 top-3 text-gray-500 dark:text-gray-400"
          >
            <Search size={20} />
          </button>
        </div>
      </form>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {query ? `Search results for "${query}"` : "Search results"}
        </h1>
        {results.length > 0 && <FilterDropdown />}
      </div>

      {isSearching ? (
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Searching...</p>
        </div>
      ) : results.length > 0 ? (
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {results.length} {results.length === 1 ? "result" : "results"} found
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((solution) => (
              <SolutionCard key={solution.id} solution={solution} />
            ))}
          </div>
        </div>
      ) : query ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-600 dark:text-gray-300 mb-3">
            No results found for "{query}"
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Try different keywords or browse categories
          </p>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/suggest")}
          >
            Suggest a Solution
          </button>
        </div>
      ) : null}
    </div>
  );
}
