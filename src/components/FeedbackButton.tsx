import { useState } from 'react';
import { CircleCheck, MessageSquare, ThumbsDown, ThumbsUp } from 'lucide-react';

interface FeedbackButtonProps {
  solutionId: string;
}

export default function FeedbackButton({ solutionId }: FeedbackButtonProps) {
  const [feedback, setFeedback] = useState<'helpful' | 'unhelpful' | null>(() => {
    const savedFeedback = localStorage.getItem(`feedback-${solutionId}`);
    return savedFeedback as 'helpful' | 'unhelpful' | null;
  });
  const [showFeedbackMessage, setShowFeedbackMessage] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [comment, setComment] = useState('');

  const handleFeedback = (type: 'helpful' | 'unhelpful') => {
    setFeedback(type);
    localStorage.setItem(`feedback-${solutionId}`, type);
    
    if (type === 'unhelpful') {
      setShowCommentForm(true);
    } else {
      setShowFeedbackMessage(true);
      setTimeout(() => setShowFeedbackMessage(false), 3000);
    }
  };
  
  const submitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    // Save comment to localStorage
    const comments = JSON.parse(localStorage.getItem(`feedback-comments`) || '{}');
    comments[solutionId] = comment;
    localStorage.setItem('feedback-comments', JSON.stringify(comments));
    
    // Show thank you message
    setShowCommentForm(false);
    setShowFeedbackMessage(true);
    setTimeout(() => setShowFeedbackMessage(false), 3000);
  };

  return (
    <div className="mt-8 border-t pt-4 dark:border-gray-700">
      <div className="flex flex-col items-center">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Was this solution helpful?</p>
        <div className="flex gap-3">
          <button
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition-colors ${
              feedback === 'helpful'
                ? 'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
            }`}
            onClick={() => handleFeedback('helpful')}
          >
            <ThumbsUp size={16} /> Yes
          </button>
          <button
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition-colors ${
              feedback === 'unhelpful'
                ? 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
            }`}
            onClick={() => handleFeedback('unhelpful')}
          >
            <ThumbsDown size={16} /> No
          </button>
        </div>
        
        {showCommentForm && (
          <div className="mt-4 w-full max-w-md animate-fade-in">
            <form onSubmit={submitComment}>
              <label htmlFor="feedback-comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                How can we improve this solution?
              </label>
              <textarea
                id="feedback-comment"
                rows={3}
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Please share your suggestions..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:underline"
                  onClick={() => setShowCommentForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-1"
                >
                  <MessageSquare size={14} />
                  Submit Feedback
                </button>
              </div>
            </form>
          </div>
        )}
        
        {showFeedbackMessage && (
          <div className="flex items-center gap-2 text-sm mt-3 text-green-600 dark:text-green-400 animate-fade-in">
            <CircleCheck size={16} />
            <span>Thank you for your feedback!</span>
          </div>
        )}
      </div>
    </div>
  );
}
