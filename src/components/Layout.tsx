import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Bookmark,
  CircleHelp,
  House,
  Info,
  Menu,
  PenLine,
  Search,
  User,
  X,
} from "lucide-react";
import DarkModeToggle from "./DarkModeToggle";
import { useAuth } from "../contexts/AuthContext";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useAuth();

  // Close mobile menu and reset scroll position when changing routes
  useEffect(() => {
    const handleRouteChange = () => {
      setMenuOpen(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    handleRouteChange(); // Handle initial route

    // Add event listener for route changes
    window.addEventListener("popstate", handleRouteChange);
    return () => {
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, [location.pathname]);

  // Handle clicking outside mobile menu to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const menuElement = document.querySelector(".mobile-menu");
      if (
        menuOpen &&
        menuElement &&
        !menuElement.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  // Handle scroll events for header effects
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        setMenuOpen(false); // Close mobile menu after search
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchQuery, navigate]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-200">
      {/* Header */}
      <header
        className={`bg-white dark:bg-gray-800 sticky top-0 z-10 transition-all duration-300 ${
          isScrolled
            ? "shadow-md dark:shadow-gray-900/30"
            : "shadow-sm dark:shadow-gray-900/10"
        }`}
      >
        <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1
              className="text-xl font-bold text-blue-600 dark:text-blue-400 cursor-pointer flex items-center gap-1"
              onClick={() => navigate("/")}
            >
              <span className="text-2xl">⚡</span> FixItQuick
            </h1>
          </div>

          <form
            onSubmit={handleSearch}
            className="flex-1 max-w-md mx-4 hidden md:block"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search for solutions..."
                className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:placeholder-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <Search size={20} />
              </button>
            </div>
          </form>

          <div className="flex items-center gap-1">
            <DarkModeToggle />
            <button
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-full transition-colors"
              onClick={() => navigate("/")}
              title="Home"
              aria-label="Home"
            >
              <House size={20} />
            </button>
            <button
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-full transition-colors"
              onClick={() => navigate("/bookmarks")}
              title="Bookmarks"
              aria-label="Bookmarks"
            >
              <Bookmark size={20} />
            </button>
            {isAuthenticated ? (
              <button
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-full transition-colors"
                onClick={() => navigate("/profile")}
                title={`Profile - ${currentUser?.email || "User"}`}
                aria-label="Profile"
              >
                <User size={20} />
              </button>
            ) : (
              <button
                className="hidden sm:block ml-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                onClick={() => navigate("/login")}
              >
                Sign In
              </button>
            )}
            <button
              className="hidden sm:block ml-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
              onClick={() => navigate("/suggest")}
            >
              Suggest
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        // Add click outside handler to close menu
        <div
          className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50 animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setMenuOpen(false);
            }
          }}
        >
          <div className="mobile-menu bg-white dark:bg-gray-800 h-full w-80 max-w-[80vw] animate-slide-up transition-transform duration-300">
            <div className="p-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold">Menu</h2>
                <button
                  className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                  onClick={() => setMenuOpen(false)}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for solutions..."
                    className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      className="absolute right-12 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      onClick={() => setSearchQuery("")}
                    >
                      <X size={16} />
                    </button>
                  )}
                  <button
                    type="submit"
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <Search size={20} />
                  </button>
                </div>
              </form>
              <div className="flex flex-col space-y-1">
                <button
                  className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => navigate("/")}
                >
                  <House size={20} />
                  <span>Home</span>
                </button>
                <button
                  className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => navigate("/bookmarks")}
                >
                  <Bookmark size={20} />
                  <span>Bookmarks</span>
                </button>
                {isAuthenticated && (
                  <button
                    className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => navigate("/profile")}
                  >
                    <User size={20} />
                    <span>Profile</span>
                  </button>
                )}
                <button
                  className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => navigate("/faq")}
                >
                  <CircleHelp size={20} />
                  <span>FAQ</span>
                </button>
                <button
                  className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => navigate("/about")}
                >
                  <Info size={20} />
                  <span>About</span>
                </button>
                <button
                  className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 sm:hidden"
                  onClick={() => navigate("/suggest")}
                >
                  <PenLine size={20} />
                  <span>Suggest Solution</span>
                </button>
                {!isAuthenticated && (
                  <button
                    className="flex items-center gap-2 p-3 mt-2 text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 rounded-lg sm:hidden"
                    onClick={() => navigate("/login")}
                  >
                    <User size={20} />
                    <span>Sign In</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 animate-enter">
        <div className="container mx-auto px-4 py-6">{children}</div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t dark:border-gray-700 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-6 md:mb-0">
              <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 flex items-center justify-center md:justify-start gap-1">
                <span className="text-xl">⚡</span> FixItQuick
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Quick tech solutions for students
              </p>
            </div>
            <div className="grid grid-cols-2 sm:flex sm:gap-8 text-sm">
              <div className="space-y-2 px-4 sm:px-0">
                <h4 className="font-medium text-gray-800 dark:text-gray-200">
                  Resources
                </h4>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate("/about");
                      }}
                    >
                      About
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate("/faq");
                      }}
                    >
                      FAQ
                    </a>
                  </li>
                </ul>
              </div>
              <div className="space-y-2 px-4 sm:px-0">
                <h4 className="font-medium text-gray-800 dark:text-gray-200">
                  Contribute
                </h4>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate("/suggest");
                      }}
                    >
                      Suggest a Solution
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate("/popular");
                      }}
                    >
                      Popular Solutions
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t dark:border-gray-700 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              &copy; {new Date().getFullYear()} FixItQuick. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
