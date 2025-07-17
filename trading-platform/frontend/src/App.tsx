// trading-platform/frontend/src/App.tsx (ERWEITERT)
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { UserProvider } from './context/UserContext'

// Layout Components
import Layout from './components/layout/Layout'

// Auth Components
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import ProtectedRoute from './components/auth/ProtectedRoute'
import AdminRoute from './components/auth/AdminRoute'  // NEU!

// Existing Page Components
import LandingPage from './components/pages/LandingPage'
import Dashboard from './components/pages/Dashboard'
import CoursePage from './components/pages/CoursePage'
import ProgressPage from './components/pages/ProgressPage'
import AchievementsPage from './components/pages/AchievementsPage'
import LessonPage from './components/pages/LessonPage'
import PracticePage from './components/pages/PracticePage'
import SettingsPage from './components/pages/SettingsPage'
import LessonDemo from './components/pages/LessonDemo'

// NEW: Dynamic Lesson Components
import DynamicLessonEngine from './components/lessons/DynamicLessonEngine'
import LessonOverview from './components/lessons/LessonOverview'

// NEW: Admin Components
import AdminDashboard from './components/admin/AdminDashboard'
import ContentMigration from './components/admin/LessonMigrationSystem'
import LessonManagement from './components/admin/LessonManagement'
import LessonMigrationSystem from './components/admin/LessonMigrationSystem'

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
            
            {/* EXISTING: Static Lessons */}
            <Route path="lesson/:lessonId" element={<LessonPage />} />
            
            {/* NEW: Dynamic Lessons */}
            <Route path="lessons" element={<LessonOverview />} />
            <Route path="lessons/:lessonId" element={<DynamicLessonEngine />} />
            
            <Route path="progress" element={<ProgressPage />} />
            <Route path="achievements" element={<AchievementsPage />} />
            <Route path="practice" element={<PracticePage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="lesson-demo" element={<LessonDemo />} />
          </Route>

          {/* NEW: Admin Routes */}
          <Route path="/admin" element={
            <AdminRoute>
              <Layout />
            </AdminRoute>
          }>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="migration" element={<LessonMigrationSystem />} />
            <Route path="lessons" element={<LessonManagement />} />
          </Route>

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </UserProvider>
  )
}

export default App