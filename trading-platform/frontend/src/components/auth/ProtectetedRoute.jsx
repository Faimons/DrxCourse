// src/components/auth/ProtectedRoute.jsx - Route Protection
import React, { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useUser } from '../../context/UserContext'

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="spinner mx-auto mb-4"></div>
      <p className="text-gray-600">Überprüfe Anmeldung...</p>
    </div>
  </div>
)

export default function ProtectedRoute({ children }) {
  const { user, authenticated, loading, checkAuthStatus } = useUser()
  const location = useLocation()
  const [isInitialCheck, setIsInitialCheck] = useState(true)

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        await checkAuthStatus()
      } catch (error) {
        console.error('Auth check failed:', error)
      } finally {
        setIsInitialCheck(false)
      }
    }

    if (isInitialCheck) {
      verifyAuth()
    }
  }, [checkAuthStatus, isInitialCheck])

  // Show loading during initial auth check
  if (isInitialCheck || loading) {
    return <LoadingSpinner />
  }

  // Redirect to login if not authenticated
  if (!authenticated || !user) {
    console.log('🔒 Not authenticated, redirecting to login')
    return (
      <Navigate 
        to="/login" 
        state={{ from: location.pathname }} 
        replace 
      />
    )
  }

  // User is authenticated, render protected content
  return children
}