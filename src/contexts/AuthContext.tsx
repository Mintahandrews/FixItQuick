import { createContext, useState, useEffect, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface User {
  id: string;
  username: string;
  email: string;
  dateJoined: number;
}

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  updateUserProfile: (updates: Partial<User>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>('fixitquick-user', null);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useLocalStorage<any[]>('fixitquick-users', []);
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!currentUser);

  // Update authenticated status when currentUser changes
  useEffect(() => {
    setIsAuthenticated(!!currentUser);
  }, [currentUser]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Find user with matching email and password
      const user = users.find((u: any) => 
        u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      
      if (user) {
        const { password, ...userWithoutPassword } = user;
        setCurrentUser(userWithoutPassword);
        setIsLoading(false);
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Check if user already exists
      if (users.some((u: any) => u.email.toLowerCase() === email.toLowerCase())) {
        setIsLoading(false);
        return false;
      }
      
      // Create new user
      const newUser = {
        id: `user_${Date.now()}`,
        username,
        email,
        password, // In a real app, this would be hashed
        dateJoined: Date.now()
      };
      
      // Save to users array
      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      
      // Log user in
      const { password: _, ...userWithoutPassword } = newUser;
      setCurrentUser(userWithoutPassword);
      
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const updateUserProfile = async (updates: Partial<User>): Promise<boolean> => {
    try {
      if (!currentUser) return false;
      
      // Update current user
      const updatedUser = { ...currentUser, ...updates };
      setCurrentUser(updatedUser);
      
      // Update user in users array
      const updatedUsers = users.map(user => {
        if (user.id === currentUser.id) {
          return { ...user, ...updates };
        }
        return user;
      });
      
      setUsers(updatedUsers);
      return true;
    } catch (error) {
      console.error('Profile update error:', error);
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
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
