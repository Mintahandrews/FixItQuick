import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronLeft, CircleAlert, LogOut, Save, Trash2, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useBookmarks } from '../../hooks/useBookmarks';
import { useRecentlyViewed } from '../../contexts/RecentlyViewedContext';

export default function Profile() {
  const { currentUser, logout, updateUserProfile } = useAuth();
  const { getBookmarkedSolutions, clearAllBookmarks } = useBookmarks();
  const { clearRecentlyViewed } = useRecentlyViewed();
  const bookmarks = getBookmarkedSolutions();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(currentUser?.username || '');
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  
  if (!currentUser) {
    return null; // Should be handled by ProtectedRoute
  }
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const handleSaveProfile = async () => {
    if (!username.trim()) {
      setError('Username cannot be empty');
      return;
    }
    
    try {
      const success = await updateUserProfile({ username });
      
      if (success) {
        setSuccessMessage('Profile updated successfully');
        setIsEditing(false);
        setError('');
        
        // Clear success message after a few seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } else {
        setError('Failed to update profile');
      }
    } catch (err) {
      setError('Failed to update profile');
      console.error(err);
    }
  };
  
  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all your bookmarks and viewing history?')) {
      clearAllBookmarks();
      clearRecentlyViewed();
      setSuccessMessage('All bookmarks and history cleared');
      
      // Clear success message after a few seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    }
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
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
              <User size={24} />
            </div>
            <h1 className="text-2xl font-bold">Your Profile</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
        
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg flex items-start gap-3 animate-fade-in">
            <Check className="flex-shrink-0 mt-0.5" size={18} />
            <p>{successMessage}</p>
          </div>
        )}
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg flex items-start gap-3">
            <CircleAlert className="flex-shrink-0 mt-0.5" size={18} />
            <p>{error}</p>
          </div>
        )}
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Username
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="p-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md">
                      {currentUser.username}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <p className="p-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md">
                    {currentUser.email}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Member Since
                  </label>
                  <p className="p-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md">
                    {new Date(currentUser.dateJoined).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                {isEditing ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setUsername(currentUser.username);
                        setError('');
                      }}
                      className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      <Save size={16} />
                      Save
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold mb-4">Account Statistics</h2>
              <div className="space-y-4 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800/30">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">Bookmarked Solutions</span>
                  <span className="text-blue-600 dark:text-blue-400 font-medium">{bookmarks.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">Suggested Solutions</span>
                  <span className="text-blue-600 dark:text-blue-400 font-medium">
                    {JSON.parse(localStorage.getItem('fixitquick-suggested-solutions') || '[]').filter((s: any) => 
                      s.email === currentUser.email
                    ).length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">Solution Feedback Given</span>
                  <span className="text-blue-600 dark:text-blue-400 font-medium">
                    {Object.keys(JSON.parse(localStorage.getItem('fixitquick-feedback-comments') || '{}')).length}
                  </span>
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  onClick={() => navigate('/bookmarks')}
                  className="w-full py-2 text-center text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View my bookmarks
                </button>
                
                <div className="mt-4">
                  <button
                    onClick={handleClearData}
                    className="flex items-center justify-center gap-2 w-full py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                    Clear bookmarks and history
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
