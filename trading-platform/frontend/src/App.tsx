// src/App.tsx - Trading Platform Main App
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { UserProvider } from './context/UserContext'

// Import Components (erstelle einfache Versionen falls nicht vorhanden)
import LandingPage from './components/pages/LandingPage'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import Dashboard from './components/pages/Dashboard'
import Layout from './components/layout/Layout'

// Simple Protected Route
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('accessToken')
  
  if (!token) {
    return <Navigate to="/login" replace />
  }
  
  return <>{children}</>
}

function App() {
  return (
    <UserProvider>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected App Routes */}
          <Route path="/app" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="course" element={<div className="p-6"><h1 className="text-2xl">Kurs Übersicht</h1><p>Coming Soon...</p></div>} />
            <Route path="progress" element={<div className="p-6"><h1 className="text-2xl">Fortschritt</h1><p>Coming Soon...</p></div>} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </UserProvider>
  )
}

export default App