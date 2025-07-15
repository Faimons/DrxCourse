import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, LoginCredentials, RegisterData, AuthResponse } from '../types';
import apiService from '../services/api';
import toast from 'react-hot-toast';

interface UserContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
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
  children: React.ReactNode;
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
      if (apiService.isAuthenticated()) {
        const userData = await apiService.get<User>('/auth/me');
        setUser(userData);
      }
    } catch (error) {
      console.error('Failed to initialize user:', error);
      apiService.clearAuthTokens();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      const response = await apiService.post<AuthResponse>('/auth/login', credentials);
      
      // Set tokens
      apiService.setAuthTokens(response.tokens.accessToken, response.tokens.refreshToken);
      
      // Set user
      setUser(response.user);
      
      toast.success(`Willkommen zurück, ${response.user.name}!`);
    } catch (error: any) {
      console.error('Login failed:', error);
      toast.error(error.error || 'Anmeldung fehlgeschlagen');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setLoading(true);
      const response = await apiService.post<AuthResponse>('/auth/register', data);
      
      // Set tokens
      apiService.setAuthTokens(response.tokens.accessToken, response.tokens.refreshToken);
      
      // Set user
      setUser(response.user);
      
      toast.success(`Willkommen, ${response.user.name}! Ihr Konto wurde erfolgreich erstellt.`);
    } catch (error: any) {
      console.error('Registration failed:', error);
      toast.error(error.error || 'Registrierung fehlgeschlagen');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    try {
      // Call logout endpoint (fire and forget)
      apiService.post('/auth/logout').catch(console.error);
      
      // Clear tokens
      apiService.clearAuthTokens();
      
      // Clear user
      setUser(null);
      
      toast.success('Erfolgreich abgemeldet');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state even if API call fails
      apiService.clearAuthTokens();
      setUser(null);
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const refreshUser = async () => {
    try {
      if (apiService.isAuthenticated()) {
        const userData = await apiService.get<User>('/auth/me');
        setUser(userData);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
      // If refresh fails, user might be logged out
      if (error && (error as any).code === 'INVALID_TOKEN') {
        logout();
      }
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
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};