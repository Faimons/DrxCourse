// C:\Users\DRX_SIMON\Drx-cours2.0\trading-platform\frontend\src\components\auth\ProtectedRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'student' | 'instructor';
  fallbackPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole,
  fallbackPath = '/login'
}) => {
  const { user, loading } = useUser();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400"></div>
          <p className="text-gray-400 text-lg">Loading your trading dashboard...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Check role-based access
  if (requiredRole && user.role !== requiredRole) {
    // KORRIGIERT: Redirect based on user role with correct paths
    const roleRedirects = {
      admin: '/admin/dashboard',        // ← KORRIGIERT: /admin/dashboard statt /app/admin
      instructor: '/app/instructor', 
      student: '/app/dashboard'
    };
    
    console.log(`User has role: ${user.role}, redirecting to: ${roleRedirects[user.role] || '/app/dashboard'}`);
    
    return <Navigate to={roleRedirects[user.role] || '/app/dashboard'} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;