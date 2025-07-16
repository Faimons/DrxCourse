// C:\Users\DRX_SIMON\Drx-cours2.0\trading-platform\frontend\src\context\UserContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Types
interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'student' | 'instructor';
  avatar?: string;
  joinedAt: string;
  lastActive: string;
  preferences: {
    theme: 'dark' | 'light';
    notifications: boolean;
    language: string;
  };
  progress: {
    completedLessons: number;
    totalLessons: number;
    currentStreak: number;
    totalPoints: number;
    level: string;
    certificates: string[];
  };
}

interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
  agreeToPrivacy: boolean;
  newsletter?: boolean;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
  updateProgress: (progressData: Partial<User['progress']>) => void;
  updatePreferences: (preferences: Partial<User['preferences']>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize user on app start
  useEffect(() => {
    initializeUser();
  }, []);

  const initializeUser = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        // In a real app, validate token with backend
        // For now, use mock user data
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        } else {
          // Create default user if token exists but no user data
          const defaultUser = createMockUser('admin@tradingplatform.com', 'admin');
          setUser(defaultUser);
          localStorage.setItem('currentUser', JSON.stringify(defaultUser));
        }
      }
    } catch (error) {
      console.error('Failed to initialize user:', error);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('currentUser');
    } finally {
      setLoading(false);
    }
  };

  const createMockUser = (email: string, role: 'admin' | 'student'): User => {
    const isAdmin = role === 'admin';
    return {
      id: isAdmin ? 1 : 2,
      name: isAdmin ? 'Admin User' : 'Student User',
      email,
      role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      joinedAt: '2024-01-01T00:00:00Z',
      lastActive: new Date().toISOString(),
      preferences: {
        theme: 'dark',
        notifications: true,
        language: 'en'
      },
      progress: {
        completedLessons: isAdmin ? 20 : 8,
        totalLessons: 24,
        currentStreak: isAdmin ? 15 : 7,
        totalPoints: isAdmin ? 5000 : 2850,
        level: isAdmin ? 'Expert' : 'Intermediate',
        certificates: isAdmin ? ['basic-trading', 'technical-analysis', 'risk-management'] : ['basic-trading']
      }
    };
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      
      // Mock authentication - replace with real API call
      const validCredentials = [
        { email: 'admin@tradingplatform.com', password: 'admin123!', role: 'admin' as const },
        { email: 'student@example.com', password: 'student123!', role: 'student' as const }
      ];

      const validUser = validCredentials.find(
        cred => cred.email === credentials.email && cred.password === credentials.password
      );

      if (!validUser) {
        throw new Error('Invalid email or password');
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create user object
      const mockUser = createMockUser(validUser.email, validUser.role);
      
      // Set tokens
      const accessToken = `mock-access-token-${Date.now()}`;
      const refreshToken = `mock-refresh-token-${Date.now()}`;
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('currentUser', JSON.stringify(mockUser));
      
      if (credentials.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }
      
      setUser(mockUser);
      console.log('✅ Login successful:', mockUser.email);
      
    } catch (error: any) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setLoading(true);
      
      // Validation
      if (data.password !== data.confirmPassword) {
        throw new Error('Passwords do not match');
      }
      
      if (!data.agreeToTerms || !data.agreeToPrivacy) {
        throw new Error('You must agree to the terms and privacy policy');
      }

      // Check if user already exists (mock check)
      const existingUser = localStorage.getItem(`user_${data.email}`);
      if (existingUser) {
        throw new Error('User already exists with this email');
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create new user
      const newUser = createMockUser(data.email, 'student');
      newUser.name = data.name;
      
      // Set tokens
      const accessToken = `mock-access-token-${Date.now()}`;
      const refreshToken = `mock-refresh-token-${Date.now()}`;
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      localStorage.setItem(`user_${data.email}`, JSON.stringify(newUser));
      
      setUser(newUser);
      console.log('✅ Registration successful:', newUser.email);
      
    } catch (error: any) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('rememberMe');
      setUser(null);
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  };

  const updateProgress = (progressData: Partial<User['progress']>) => {
    if (user) {
      const updatedUser = {
        ...user,
        progress: { ...user.progress, ...progressData }
      };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  };

  const updatePreferences = (preferences: Partial<User['preferences']>) => {
    if (user) {
      const updatedUser = {
        ...user,
        preferences: { ...user.preferences, ...preferences }
      };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  };

  const refreshUser = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token && user) {
        // In a real app, fetch fresh user data from API
        // For now, just update last active time
        const updatedUser = {
          ...user,
          lastActive: new Date().toISOString()
        };
        setUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        console.log('✅ User refreshed');
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
      logout();
    }
  };

  const value: UserContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    refreshUser,
    isAuthenticated: !!user,
    updateProgress,
    updatePreferences,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};