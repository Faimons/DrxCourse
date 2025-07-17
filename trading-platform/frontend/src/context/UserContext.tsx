// C:\Users\DRX_SIMON\Drx-cours2.0\trading-platform\frontend\src\context\UserContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Types
interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'student' | 'instructor';
  avatar?: string;
  status: 'active' | 'inactive' | 'suspended';
  email_verified: boolean;
  created_at: string;
  updated_at: string;
  last_login?: string;
  preferences: {
    theme: 'dark' | 'light';
    notifications: boolean;
    language: string;
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

// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

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
        // Validate token with backend
        await fetchCurrentUser();
      }
    } catch (error) {
      console.error('Failed to initialize user:', error);
      // Clear invalid tokens
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('currentUser');
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }

      const data = await response.json();
      const userData = data.user;

      // Transform backend user to frontend format
      const transformedUser: User = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        avatar: userData.avatar_url,
        status: userData.status,
        email_verified: userData.email_verified,
        created_at: userData.created_at,
        updated_at: userData.updated_at,
        last_login: userData.last_login,
        preferences: userData.preferences || {
          theme: 'dark',
          notifications: true,
          language: 'en'
        }
      };

      setUser(transformedUser);
      localStorage.setItem('currentUser', JSON.stringify(transformedUser));
      
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      throw error;
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      
      // Store tokens
      localStorage.setItem('accessToken', data.token);
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }
      
      if (credentials.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }

      // Transform and store user
      const transformedUser: User = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        avatar: data.user.avatar_url,
        status: data.user.status || 'active',
        email_verified: data.user.email_verified || false,
        created_at: data.user.created_at || new Date().toISOString(),
        updated_at: data.user.updated_at || new Date().toISOString(),
        last_login: new Date().toISOString(),
        preferences: data.user.preferences || {
          theme: 'dark',
          notifications: true,
          language: 'en'
        }
      };

      setUser(transformedUser);
      localStorage.setItem('currentUser', JSON.stringify(transformedUser));
      
      console.log('✅ Login successful:', transformedUser.email);
      
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
      
      // Client-side validation
      if (data.password !== data.confirmPassword) {
        throw new Error('Passwords do not match');
      }
      
      if (!data.agreeToTerms || !data.agreeToPrivacy) {
        throw new Error('You must agree to the terms and privacy policy');
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          newsletter: data.newsletter || false,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const responseData = await response.json();
      
      // Store tokens
      localStorage.setItem('accessToken', responseData.token);
      if (responseData.refreshToken) {
        localStorage.setItem('refreshToken', responseData.refreshToken);
      }

      // Transform and store user
      const transformedUser: User = {
        id: responseData.user.id,
        name: responseData.user.name,
        email: responseData.user.email,
        role: responseData.user.role || 'student',
        avatar: responseData.user.avatar_url,
        status: responseData.user.status || 'active',
        email_verified: responseData.user.email_verified || false,
        created_at: responseData.user.created_at,
        updated_at: responseData.user.updated_at,
        last_login: new Date().toISOString(),
        preferences: {
          theme: 'dark',
          notifications: true,
          language: 'en'
        }
      };

      setUser(transformedUser);
      localStorage.setItem('currentUser', JSON.stringify(transformedUser));
      
      console.log('✅ Registration successful:', transformedUser.email);
      
    } catch (error: any) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    try {
      // Optional: Call logout endpoint to invalidate server-side session
      const token = localStorage.getItem('accessToken');
      if (token) {
        fetch(`${API_BASE_URL}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }).catch(err => console.warn('Logout endpoint failed:', err));
      }

      // Clear local storage
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

  const updateUser = async (userData: Partial<User>) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      const data = await response.json();
      const updatedUser = { ...user, ...data.user };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
    } catch (error) {
      console.error('Failed to update user:', error);
      throw error;
    }
  };

  const updatePreferences = async (preferences: Partial<User['preferences']>) => {
    try {
      if (!user) return;

      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_BASE_URL}/api/users/preferences`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ preferences }),
      });

      if (!response.ok) {
        throw new Error('Failed to update preferences');
      }

      const updatedUser = {
        ...user,
        preferences: { ...user.preferences, ...preferences }
      };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
    } catch (error) {
      console.error('Failed to update preferences:', error);
      // Update locally even if API fails
      if (user) {
        const updatedUser = {
          ...user,
          preferences: { ...user.preferences, ...preferences }
        };
        setUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      }
    }
  };

  const refreshUser = async () => {
    try {
      await fetchCurrentUser();
      console.log('✅ User refreshed');
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
    updatePreferences,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};