import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock, LogIn, TrendingUp } from 'lucide-react';
import { useUser } from '../../context/UserContext';

const loginSchema = z.object({
  email: z.string().email('Bitte geben Sie eine gültige E-Mail-Adresse ein'),
  password: z.string().min(1, 'Passwort ist erforderlich'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading } = useUser();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
      navigate('/dashboard');
    } catch (error) {
      // Error is handled by the context
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-brand-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-brand-600 p-3 rounded-full">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Willkommen zurück
          </h2>
          <p className="text-neutral-400">
            Melden Sie sich an, um Ihre Trading-Ausbildung fortzusetzen
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-glass rounded-2xl p-8 shadow-glass border border-white/20">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                E-Mail-Adresse
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  {...register('email')}
                  type="email"
                  id="email"
                  className="block w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200"
                  placeholder="ihre@email.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-loss-400">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                Passwort
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className="block w-full pl-10 pr-10 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200"
                  placeholder="Ihr Passwort"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-neutral-400 hover:text-white transition-colors"
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
                <p className="mt-1 text-sm text-loss-400">{errors.password.message}</p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  {...register('rememberMe')}
                  id="rememberMe"
                  type="checkbox"
                  className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-neutral-300 rounded bg-white/10"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-neutral-300">
                  Angemeldet bleiben
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-brand-400 hover:text-brand-300 transition-colors"
              >
                Passwort vergessen?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center py-3 px-4 bg-brand-600 hover:bg-brand-700 disabled:bg-brand-800 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  Anmelden...
                </div>
              ) : (
                <div className="flex items-center">
                  <LogIn className="h-5 w-5 mr-2" />
                  Anmelden
                </div>
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-neutral-400">
              Noch kein Konto?{' '}
              <Link
                to="/register"
                className="text-brand-400 hover:text-brand-300 font-medium transition-colors"
              >
                Jetzt registrieren
              </Link>
            </p>
          </div>
        </div>

        {/* Demo Login */}
        <div className="bg-white/5 backdrop-blur-glass rounded-lg p-4 border border-white/10">
          <p className="text-center text-neutral-400 text-sm mb-3">
            Demo-Login für Tests:
          </p>
          <div className="space-y-2 text-xs">
            <div className="text-center">
              <span className="text-neutral-300">Admin:</span>{' '}
              <span className="text-brand-400">admin@tradingplatform.com</span> / {' '}
              <span className="text-brand-400">admin123!</span>
            </div>
            <div className="text-center">
              <span className="text-neutral-300">Student:</span>{' '}
              <span className="text-brand-400">student@example.com</span> / {' '}
              <span className="text-brand-400">student123!</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;