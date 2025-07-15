// src/App.jsx - Main App Component
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { UserProvider } from './context/UserContext'

// Layout Components
import Layout from './components/layout/Layout'

// Pages
import LandingPage from './components/pages/LandingPage'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import Dashboard from './components/pages/Dashboard'
import CoursePage from './components/pages/CoursePage'
import LessonPage from './components/pages/LessonPage'
import Progress from './components/pages/Progress'

// Protected Route Component
import ProtectedRoute from './components/auth/ProtectedRoute'

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
            <Route path="course" element={<CoursePage />} />
            <Route path="lesson/:lessonId" element={<LessonPage />} />
            <Route path="progress" element={<Progress />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </UserProvider>
  )
}

export default App