import { createContext, useState, useEffect, useContext } from 'react';
import { 
  getStorageItem, 
  setStorageItem, 
  removeStorageItem, 
  STORAGE_KEYS,
  encryptData,
  decryptData
} from '../utils/localStorage';

interface User {
  id: string;
  username: string;
  email: string;
  dateJoined: number;
}

interface UserWithPassword extends User {
  password: string;
}

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  updateUserProfile: (userUpdates: Partial<User>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user data from localStorage on initial render
  useEffect(() => {
    const savedUser = getStorageItem<User | null>(STORAGE_KEYS.USER, null);
    if (savedUser) {
      setCurrentUser(savedUser);
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      // This is a simplified version using localStorage
      const users = getStorageItem<UserWithPassword[]>(STORAGE_KEYS.USERS, []);
      const user = users.find((u: UserWithPassword) => 
        u.email.toLowerCase() === email.toLowerCase()
      );
      
      if (user && decryptData(user.password) === password) {
        const { password: _, ...userWithoutPassword } = user;
        setCurrentUser(userWithoutPassword);
        setIsAuthenticated(true);
        setStorageItem(STORAGE_KEYS.USER, userWithoutPassword);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Check if user already exists
      const users = getStorageItem<UserWithPassword[]>(STORAGE_KEYS.USERS, []);
      if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
        return false;
      }
      
      // Create new user with encrypted password
      const newUser: UserWithPassword = {
        id: `user_${Date.now()}`,
        username,
        email,
        password: encryptData(password), // Simple encryption
        dateJoined: Date.now()
      };
      
      // Save to users array
      const updatedUsers = [...users, newUser];
      setStorageItem(STORAGE_KEYS.USERS, updatedUsers);
      
      // Log user in
      const { password: _, ...userWithoutPassword } = newUser;
      setCurrentUser(userWithoutPassword);
      setIsAuthenticated(true);
      setStorageItem(STORAGE_KEYS.USER, userWithoutPassword);
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    removeStorageItem(STORAGE_KEYS.USER);
  };

  const updateUserProfile = async (userUpdates: Partial<User>): Promise<boolean> => {
    try {
      if (!currentUser) return false;

      // Update current user state
      const updatedUser = { ...currentUser, ...userUpdates };
      setCurrentUser(updatedUser);
      
      // Update in localStorage
      setStorageItem(STORAGE_KEYS.USER, updatedUser);
      
      // Update in users list too
      const users = getStorageItem<UserWithPassword[]>(STORAGE_KEYS.USERS, []);
      const updatedUsers = users.map(user => {
        if (user.id === currentUser.id) {
          return { ...user, ...userUpdates };
        }
        return user;
      });
      
      setStorageItem(STORAGE_KEYS.USERS, updatedUsers);
      return true;
    } catch (error) {
      console.error('Error updating user profile:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      isLoading, 
      login, 
      register, 
      logout,
      isAuthenticated,
      updateUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
