import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Copy,
  Bookmark,
  Timer,
  Share2,
  CircleCheck,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

import { solutions } from "../data/solutions";
import { useBookmarks } from "../hooks/useBookmarks";
import { useRecentlyViewed } from "../contexts/RecentlyViewedContext";
import DifficultyBadge from "./DifficultyBadge";
import FeedbackButton from "./FeedbackButton";
import SolutionCard from "./SolutionCard";

export default function SolutionDetail() {
  const { solutionId } = useParams<{ solutionId: string }>();
  const navigate = useNavigate();
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarks();
  const { addToRecentlyViewed } = useRecentlyViewed();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [shareMessage, setShareMessage] = useState("");
  const [copyMessage, setCopyMessage] = useState("");
  const [showStepAnimation, setShowStepAnimation] = useState(false);

  const solution = solutions.find((s) => s.id === solutionId);
  const bookmarked = isBookmarked(solutionId || "");
  const relatedSolutions = solution?.relatedSolutions
    ? solutions.filter((s) => solution.relatedSolutions?.includes(s.id))
    : [];

  useEffect(() => {
    if (solution) {
      addToRecentlyViewed(solution.id);
    }
    // Reset step index when solution changes
    setCurrentStepIndex(0);
  }, [solution?.id, addToRecentlyViewed]); // Include addToRecentlyViewed in dependencies

  const toggleBookmark = () => {
    if (!solution) return;
    if (bookmarked) {
      removeBookmark(solution.id);
    } else {
      addBookmark(solution.id);
    }
  };

  const shareSolution = () => {
    if (navigator.share && solution) {
      navigator
        .share({
          title: solution.title,
          text: `Check out this tech solution: ${solution.title}`,
          url: window.location.href,
        })
        .catch(() => {
          // Fallback if Web Share API fails
          copyToClipboard();
        });
    } else {
      // Fallback for browsers without Web Share API
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareMessage("Link copied to clipboard!");
    setTimeout(() => setShareMessage(""), 3000);
  };

  const copyStepContent = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopyMessage("Copied to clipboard!");
    setTimeout(() => setCopyMessage(""), 2000);
  };

  const nextStep = () => {
    if (solution && currentStepIndex < solution.steps.length - 1) {
      setShowStepAnimation(true);
      setTimeout(() => {
        setCurrentStepIndex(currentStepIndex + 1);
        setShowStepAnimation(false);
      }, 200);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setShowStepAnimation(true);
      setTimeout(() => {
        setCurrentStepIndex(currentStepIndex - 1);
        setShowStepAnimation(false);
      }, 200);
    }
  };

  const goToStep = (index: number) => {
    if (solution && index >= 0 && index < solution.steps.length) {
      if (index !== currentStepIndex) {
        setShowStepAnimation(true);
        setTimeout(() => {
          setCurrentStepIndex(index);
          setShowStepAnimation(false);
        }, 200);
      }
    }
  };

  const estimatedTime = () => {
    if (!solution) return "";
    const steps = solution.steps.length;
    return steps < 3 ? "~2 min" : steps < 5 ? "~5 min" : "~10 min";
  };

  // Function to detect if text contains command-like patterns
  const hasCommandSyntax = (text: string): boolean => {
    // Check for common command patterns
    return (
      /^\s*(sudo|npm|yarn|git|cd|ls|mkdir|python|java|gcc|apt|brew)\s+/.test(
        text
      ) || /^[a-z]+\s+[\-a-z0-9\/]+/.test(text)
    );
  };

  // Format description with command highlighting
  const formatDescription = (description: string) => {
    // Split by newlines
    const lines = description.split("\n");

    return lines.map((line, i) => {
      if (hasCommandSyntax(line)) {
        return (
          <div
            key={i}
            className="bg-gray-100 dark:bg-gray-700 p-2 my-2 rounded-md font-mono text-sm relative group"
          >
            {line}
            <button
              onClick={() => copyStepContent(line)}
              className="absolute right-1 top-1 p-1 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
              title="Copy to clipboard"
            >
              <Copy size={14} />
            </button>
          </div>
        );
      }
      return (
        <p key={i} className="my-2">
          {line}
        </p>
      );
    });
  };

  useEffect(() => {
    if (!solution) {
      navigate("/", { replace: true });
    }
  }, [solution, navigate]);

  if (!solution) {
    return null;
  }

  return (
    <div className="animate-enter">
      <button
        className="flex items-center text-blue-600 dark:text-blue-400 mb-6 hover:underline"
        onClick={() => navigate(-1)}
      >
        <ChevronLeft size={20} /> Back
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/10 p-6 mb-8 border dark:border-gray-700">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold">{solution.title}</h1>
              {solution.difficulty && (
                <DifficultyBadge level={solution.difficulty} />
              )}
              <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <Timer size={16} />
                <span>{estimatedTime()}</span>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              {solution.shortDescription}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              className={`p-2 rounded-full transition-colors ${
                bookmarked
                  ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30"
                  : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50"
              }`}
              onClick={toggleBookmark}
              title={bookmarked ? "Remove bookmark" : "Add bookmark"}
            >
              <Bookmark size={20} fill={bookmarked ? "currentColor" : "none"} />
            </button>
            <button
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-full transition-colors"
              onClick={shareSolution}
              title="Share solution"
            >
              <Share2 size={20} />
            </button>
          </div>
        </div>

        {shareMessage && (
          <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-3 rounded-lg flex items-center gap-2 mb-4 animate-fade-in">
            <CircleCheck size={18} />
            <span>{shareMessage}</span>
          </div>
        )}

        {copyMessage && (
          <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-3 rounded-lg flex items-center gap-2 mb-4 animate-fade-in fixed bottom-4 right-4 z-50 shadow-md">
            <CircleCheck size={18} />
            <span>{copyMessage}</span>
          </div>
        )}

        {/* Progress indicator */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
            <span>Progress</span>
            <span>
              Step {currentStepIndex + 1} of {solution.steps.length}
            </span>
          </div>
          <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-300"
              style={{
                width: `${
                  ((currentStepIndex + 1) / solution.steps.length) * 100
                }%`,
              }}
            ></div>
          </div>
        </div>

        {/* Steps navigation */}
        <div className="flex flex-wrap gap-2 mb-6">
          {solution.steps.map((_, index) => (
            <button
              key={index}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                index === currentStepIndex
                  ? "bg-blue-600 text-white"
                  : index < currentStepIndex
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                  : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
              }`}
              onClick={() => goToStep(index)}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {/* Current step */}
        <div
          className={`border-l-4 border-blue-600 dark:border-blue-500 pl-4 py-2 ${
            showStepAnimation
              ? "opacity-0 -translate-x-4"
              : "opacity-100 translate-x-0"
          } transition-all duration-200`}
        >
          <h3 className="font-medium text-lg mb-3">
            {solution.steps[currentStepIndex].title}
          </h3>
          <div className="text-gray-600 dark:text-gray-300 whitespace-pre-line leading-relaxed">
            {formatDescription(solution.steps[currentStepIndex].description)}
          </div>
          {solution.steps[currentStepIndex].imageUrl && (
            <img
              src={solution.steps[currentStepIndex].imageUrl}
              alt={solution.steps[currentStepIndex].title}
              className="mt-4 rounded-lg max-w-full border dark:border-gray-700 shadow-sm"
            />
          )}
        </div>

        {/* Step navigation buttons */}
        <div className="flex justify-between mt-8">
          <button
            className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
              currentStepIndex > 0
                ? "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                : "invisible"
            }`}
            onClick={prevStep}
            disabled={currentStepIndex === 0}
          >
            <ArrowLeft size={16} />
            Previous
          </button>
          <button
            className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
              currentStepIndex < solution.steps.length - 1
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "invisible"
            }`}
            onClick={nextStep}
            disabled={currentStepIndex === solution.steps.length - 1}
          >
            Next
            <ArrowRight size={16} />
          </button>
        </div>

        <FeedbackButton solutionId={solution.id} />
      </div>

      {/* Related solutions */}
      {relatedSolutions.length > 0 && (
        <div
          className="mt-8 animate-fade-in"
          style={{ animationDelay: "300ms" }}
        >
          <h2 className="text-xl font-semibold mb-4">Related Solutions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedSolutions.map((solution) => (
              <SolutionCard key={solution.id} solution={solution} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
