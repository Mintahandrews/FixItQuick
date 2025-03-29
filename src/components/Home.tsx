import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  Clock,
  Lightbulb,
  Search,
  Sparkles,
  Star,
} from "lucide-react";
import { categories } from "../data/categories";
import { solutions } from "../data/solutions";
import SolutionCard from "./SolutionCard";
import CategoryCard from "./CategoryCard";
import { useRecentlyViewed } from "../contexts/RecentlyViewedContext";
import QuickTip from "./QuickTip";
import SuggestedSolution from "./SuggestedSolution";
import { Solution } from "../types";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  const [popularSolutions] = useState(solutions.slice(0, 4));
  const [featuredSolutions] = useState(
    solutions.filter((s) => s.difficulty === "easy").slice(0, 2)
  );
  const [suggestedSolutions, setSuggestedSolutions] = useState<
    typeof solutions
  >([]);
  const navigate = useNavigate();
  const { getRecentlyViewedSolutions } = useRecentlyViewed();
  const [recentlyViewedSolutions, setRecentlyViewedSolutions] = useState<
    Solution[]
  >([]);

  useEffect(() => {
    setRecentlyViewedSolutions(getRecentlyViewedSolutions());
  }, [getRecentlyViewedSolutions]);

  // Load font
  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // Generate suggested solutions based on recently viewed
  useEffect(() => {
    if (recentlyViewedSolutions.length > 0) {
      // Get categories from recently viewed
      const categories = recentlyViewedSolutions.map((s) => s.category);
      // Find solutions from those categories (excluding already viewed ones)
      const viewedIds = recentlyViewedSolutions.map((s) => s.id);
      const suggestions = solutions
        .filter(
          (s) => categories.includes(s.category) && !viewedIds.includes(s.id)
        )
        .slice(0, 3);

      setSuggestedSolutions(suggestions);
    }
  }, [recentlyViewedSolutions]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="space-y-8 animate-enter">
      {/* Hero section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 dark:from-blue-800 dark:via-blue-700 dark:to-indigo-800 text-white rounded-2xl p-8 md:p-12 shadow-lg">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
            Tech help for students,{" "}
            <span className="text-blue-200">simplified</span>
          </h1>
          <p className="text-lg mb-8 opacity-90 max-w-xl mx-auto">
            Find quick solutions to your computer problems without technical
            jargon or paying for help
          </p>

          <form
            onSubmit={handleSearch}
            className="max-w-md mx-auto relative group"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Type your problem here..."
                className="w-full px-5 py-4 pr-12 rounded-lg text-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-300/50 shadow-md transition-all group-hover:shadow-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors"
              >
                <Search size={22} />
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Featured solutions */}
      <section className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-900/30 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles
            size={20}
            className="text-purple-600 dark:text-purple-400"
          />
          <h2 className="text-xl font-semibold">Featured Solutions</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {featuredSolutions.map((solution) => (
            <div
              key={solution.id}
              className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer animate-enter"
              onClick={() => navigate(`/solution/${solution.id}`)}
            >
              <h3 className="font-semibold text-lg mb-2">{solution.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                {solution.shortDescription}
              </p>
              <button className="text-blue-600 dark:text-blue-400 text-sm font-medium flex items-center">
                View solution{" "}
                <ChevronRight
                  size={16}
                  className="ml-1 transition-transform group-hover:translate-x-1"
                />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Quick tips */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb
            size={20}
            className="text-yellow-600 dark:text-yellow-400"
          />
          <h2 className="text-xl font-semibold">Quick Tips</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickTip
            title="Function Key Toggle"
            content="Most laptops use Fn+Esc or Fn+Function Lock key to toggle between function key modes"
          />
          <QuickTip
            title="Quick Screenshot"
            content="Windows: Win+Shift+S for screenshot tool. Mac: Cmd+Shift+4 to select an area"
          />
          <QuickTip
            title="Restart Bluetooth"
            content="If Bluetooth isn't connecting, toggle it off and on again in settings, or restart your device"
          />
        </div>
      </section>

      {/* Categories */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Categories</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* Suggested based on view history */}
      {suggestedSolutions.length > 0 && (
        <section className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-900/30">
          <div className="flex items-center gap-2 mb-4">
            <Star size={20} className="text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-semibold">Suggested For You</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {suggestedSolutions.map((solution) => (
              <SuggestedSolution key={solution.id} solution={solution} />
            ))}
          </div>
        </section>
      )}

      {/* Recently viewed */}
      {recentlyViewedSolutions.length > 0 && (
        <section>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Clock size={20} className="text-blue-600 dark:text-blue-400" />
              <h2 className="text-xl font-semibold">Recently Viewed</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentlyViewedSolutions.slice(0, 4).map((solution) => (
              <SolutionCard key={solution.id} solution={solution} />
            ))}
          </div>
        </section>
      )}

      {/* Popular solutions */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Star size={20} className="text-amber-500" />
            <h2 className="text-xl font-semibold">Popular Solutions</h2>
          </div>
          <button
            className="text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline text-sm font-medium"
            onClick={() => navigate("/category/keyboard")}
          >
            See more <ChevronRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularSolutions.map((solution) => (
            <SolutionCard key={solution.id} solution={solution} />
          ))}
        </div>
      </section>

      {/* Quick help */}
      <section className="bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-800/70 rounded-xl p-8 border dark:border-gray-700 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Need Immediate Help?</h2>
        <p className="mb-6 dark:text-gray-300 max-w-xl">
          Having trouble with your function keys? Check out our most popular
          guide or suggest a new solution if you can't find what you need:
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            className="btn btn-primary shadow-sm hover:shadow transition-all"
            onClick={() => navigate("/solution/function-keys-locked")}
          >
            Fix Function Keys
          </button>
          <button
            className="btn bg-white text-gray-800 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow transition-all"
            onClick={() => navigate("/suggest")}
          >
            Suggest a Solution
          </button>
        </div>
      </section>
    </div>
  );
}
