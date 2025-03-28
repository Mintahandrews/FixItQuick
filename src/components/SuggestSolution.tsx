import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronLeft, PenLine, Send } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { setStorageItem, getStorageItem, STORAGE_KEYS } from '../utils/localStorage';

interface FormData {
  title: string;
  category: string;
  description: string;
  steps: string;
  name: string;
  email: string;
}

export default function SuggestSolution() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    category: '',
    description: '',
    steps: '',
    name: currentUser?.username || '',
    email: currentUser?.email || ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when the user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validate = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.steps.trim()) {
      newErrors.steps = 'Steps are required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    // Store the suggestion in localStorage
    const suggestions = getStorageItem<any[]>(STORAGE_KEYS.SUGGESTED_SOLUTIONS, []);
    const newSuggestion = {
      ...formData,
      id: `suggestion-${Date.now()}`,
      userId: currentUser?.id || 'anonymous',
      dateSubmitted: new Date().toISOString()
    };
    
    setStorageItem(STORAGE_KEYS.SUGGESTED_SOLUTIONS, [...suggestions, newSuggestion]);
    
    // Show success message
    setSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({
        title: '',
        category: '',
        description: '',
        steps: '',
        name: currentUser?.username || '',
        email: currentUser?.email || ''
      });
      setSubmitted(false);
    }, 3000);
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <button 
        className="flex items-center text-blue-600 mb-6 hover:underline"
        onClick={() => navigate(-1)}
      >
        <ChevronLeft size={20} /> Back
      </button>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8 animate-enter">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
            <PenLine size={24} />
          </div>
          <h1 className="text-2xl font-bold">Suggest a Solution</h1>
        </div>
        
        {submitted ? (
          <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-4 rounded-lg flex items-center gap-3 animate-fade-in">
            <div className="bg-green-100 dark:bg-green-800/50 p-1.5 rounded-full">
              <Check size={20} />
            </div>
            <div>
              <h3 className="font-medium">Thank you for your suggestion!</h3>
              <p className="text-sm">We'll review your solution and add it to our database if it meets our criteria.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block mb-1 font-medium">
                Solution Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="e.g., Fix Bluetooth Connection Issues on Windows 10"
                value={formData.title}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg border ${
                  errors.title 
                    ? 'border-red-500 dark:border-red-600' 
                    : 'border-gray-300 dark:border-gray-700'
                } bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
            </div>
            
            <div>
              <label htmlFor="category" className="block mb-1 font-medium">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg border ${
                  errors.category 
                    ? 'border-red-500 dark:border-red-600' 
                    : 'border-gray-300 dark:border-gray-700'
                } bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="">Select a category</option>
                <option value="keyboard">Keyboard Issues</option>
                <option value="display">Display Problems</option>
                <option value="audio">Audio Fixes</option>
                <option value="wifi">Wi-Fi & Internet</option>
                <option value="battery">Battery & Power</option>
                <option value="software">Software Issues</option>
                <option value="other">Other</option>
              </select>
              {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
            </div>
            
            <div>
              <label htmlFor="description" className="block mb-1 font-medium">
                Problem Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                placeholder="Describe the problem this solution addresses..."
                value={formData.description}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg border ${
                  errors.description 
                    ? 'border-red-500 dark:border-red-600' 
                    : 'border-gray-300 dark:border-gray-700'
                } bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
            </div>
            
            <div>
              <label htmlFor="steps" className="block mb-1 font-medium">
                Solution Steps <span className="text-red-500">*</span>
              </label>
              <textarea
                id="steps"
                name="steps"
                rows={6}
                placeholder="Provide step-by-step instructions to solve the problem..."
                value={formData.steps}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg border ${
                  errors.steps 
                    ? 'border-red-500 dark:border-red-600' 
                    : 'border-gray-300 dark:border-gray-700'
                } bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.steps && <p className="mt-1 text-sm text-red-500">{errors.steps}</p>}
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Separate each step with a new line. Be as clear and detailed as possible.
              </p>
            </div>
            
            {!currentUser && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block mb-1 font-medium">Your Name (Optional)</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block mb-1 font-medium">Your Email (Optional)</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Your email address"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Only used if we need to contact you about your suggestion.
                  </p>
                </div>
              </div>
            )}
            
            <div className="flex justify-end">
              <button 
                type="submit"
                className="flex items-center gap-2 btn btn-primary"
              >
                <Send size={16} />
                Submit Suggestion
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
