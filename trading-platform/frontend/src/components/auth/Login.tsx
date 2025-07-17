// C:\Users\DRX_SIMON\Drx-cours2.0\trading-platform\frontend\src\components\auth\Login.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, LogIn, TrendingUp, AlertCircle } from 'lucide-react';
import { useUser } from '../../context/UserContext';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

const Login = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useUser();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // KORRIGIERT: Rollenbasierte Navigation nach Login
  const navigateBasedOnRole = () => {
    // Prüfe User-Rolle im localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      console.log('User role after login:', user.role); // Debug log
      
      // Leite basierend auf Rolle weiter
      if (user.role === 'admin') {
        console.log('Redirecting admin to /admin/dashboard');
        navigate('/admin/dashboard');
      } else {
        console.log('Redirecting student to /app/dashboard');
        navigate('/app/dashboard');
      }
    } else {
      // Fallback wenn kein User gespeichert
      console.log('No user found, redirecting to /app/dashboard');
      navigate('/app/dashboard');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      await login(formData);
      // KORRIGIERT: Verwende rollenbasierte Navigation
      navigateBasedOnRole();
    } catch (error: any) {
      setErrors({ submit: error.message || 'Login failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (type: 'admin' | 'student') => {
    const demoCredentials = {
      admin: { email: 'admin@tradingplatform.com', password: 'admin123!' },
      student: { email: 'student@example.com', password: 'student123!' }
    };

    setFormData(prev => ({
      ...prev,
      ...demoCredentials[type]
    }));

    setIsLoading(true);
    try {
      await login({ ...demoCredentials[type], rememberMe: false });
      // KORRIGIERT: Verwende rollenbasierte Navigation statt hardcoded /app/dashboard
      navigateBasedOnRole();
    } catch (error: any) {
      setErrors({ submit: error.message || 'Demo login failed.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        
        {/* Logo and Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-emerald-500 p-4 rounded-full">
              <TrendingUp className="h-10 w-10 text-white" />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-white mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-300 text-lg">
            Continue your trading education journey
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-gray-700">
          
          {/* Error Message */}
          {errors.submit && (
            <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start">
              <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-red-400 text-sm">{errors.submit}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                    errors.email 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-600 focus:ring-emerald-500'
                  }`}
                  placeholder="admin@tradingplatform.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-12 py-3 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                    errors.password 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-600 focus:ring-emerald-500'
                  }`}
                  placeholder="admin123!"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 text-emerald-500 focus:ring-emerald-500 border-gray-600 rounded bg-gray-700"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-300">
                  Remember me
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center">
                  <LogIn className="h-5 w-5 mr-2" />
                  Sign In
                </div>
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-300">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
              >
                Start your journey
              </Link>
            </p>
          </div>
        </div>

        {/* Demo Login Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
            <h3 className="text-white font-medium mb-2">Admin Demo</h3>
            <p className="text-gray-400 text-sm mb-3">Full platform access → /admin/dashboard</p>
            <button
              onClick={() => handleDemoLogin('admin')}
              disabled={isLoading}
              className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-800 text-white py-2 px-3 rounded-lg text-sm transition-colors"
            >
              Try Admin Account
            </button>
          </div>

          <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
            <h3 className="text-white font-medium mb-2">Student Demo</h3>
            <p className="text-gray-400 text-sm mb-3">Standard learning access → /app/dashboard</p>
            <button
              onClick={() => handleDemoLogin('student')}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white py-2 px-3 rounded-lg text-sm transition-colors"
            >
              Try Student Account
            </button>
          </div>
        </div>

        {/* Security Notice */}
        <div className="text-center">
          <p className="text-gray-400 text-xs">
            By signing in, you agree to our{' '}
            <Link to="/terms" className="text-emerald-400 hover:text-emerald-300">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-emerald-400 hover:text-emerald-300">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;