import React from 'react';
import { Navigate } from 'react-router-dom';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  // Prüfe hier deinen User-Context oder Auth-State
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (!user || user.role !== 'admin') {
    return <Navigate to="/app/dashboard" replace />;
  }
  
  return <>{children}</>;
};

export default AdminRoute;