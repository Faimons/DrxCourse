// C:\Users\DRX_SIMON\Drx-cours2.0\trading-platform\frontend\src\App.tsx
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { UserProvider } from './context/UserContext'

// Layout Components
import Layout from './components/layout/Layout'

// Auth Components
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import ProtectedRoute from './components/auth/ProtectedRoute'

// Page Components
import LandingPage from './components/pages/LandingPage'
import Dashboard from './components/pages/Dashboard'
import CoursePage from './components/pages/CoursePage'
import ProgressPage from './components/pages/ProgressPage'
import AchievementsPage from './components/pages/AchievementsPage'
import LessonPage from './components/pages/LessonPage'
import PracticePage from './components/pages/PracticePage'
import SettingsPage from './components/pages/SettingsPage'
import LessonDemo from './components/pages/LessonDemo'

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
            <Route path="progress" element={<ProgressPage />} />
            <Route path="achievements" element={<AchievementsPage />} />
            <Route path="practice" element={<PracticePage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="lesson-demo" element={<LessonDemo />} />
          </Route>

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </UserProvider>
  )
}

export default App