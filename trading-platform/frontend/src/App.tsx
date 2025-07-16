// C:\Users\DRX_SIMON\Drx-cours2.0\trading-platform\frontend\src\App.tsx
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { UserProvider } from './context/UserContext'

// Layout Components
import Layout from './components/layout/Layout'

// Auth Components
import Login from './components/auth/Login'
import ProtectedRoute from './components/auth/ProtectedRoute'

// Page Components
import LandingPage from './components/pages/LandingPage'
import Dashboard from './components/pages/Dashboard'
import CoursePage from './components/pages/CoursePage'

// Placeholder components for missing pages
const Register = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 flex items-center justify-center p-4">
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 text-center">
      <h1 className="text-2xl font-bold text-white mb-4">Registration Page</h1>
      <p className="text-gray-300 mb-6">Registration form coming soon!</p>
      <Link to="/login" className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
        Back to Login
      </Link>
    </div>
  </div>
);

const LessonPage = () => (
  <div className="min-h-screen bg-gray-900 p-6">
    <div className="max-w-4xl mx-auto">
      <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Lesson Player</h1>
        <p className="text-gray-300 mb-6">Interactive lesson player coming soon!</p>
        <div className="flex justify-center space-x-4">
          <Link to="/app/course" className="bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors">
            Back to Course
          </Link>
          <Link to="/app/dashboard" className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  </div>
);

const ProgressPage = () => (
  <div className="min-h-screen bg-gray-900 p-6">
    <div className="max-w-6xl mx-auto">
      <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Progress Analytics</h1>
        <p className="text-gray-300 mb-6">Detailed progress tracking and analytics coming soon!</p>
        <Link to="/app/dashboard" className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
          Back to Dashboard
        </Link>
      </div>
    </div>
  </div>
);

const AchievementsPage = () => (
  <div className="min-h-screen bg-gray-900 p-6">
    <div className="max-w-6xl mx-auto">
      <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Achievements & Badges</h1>
        <p className="text-gray-300 mb-6">Achievement system and badges coming soon!</p>
        <Link to="/app/dashboard" className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
          Back to Dashboard
        </Link>
      </div>
    </div>
  </div>
);

const PracticePage = () => (
  <div className="min-h-screen bg-gray-900 p-6">
    <div className="max-w-6xl mx-auto">
      <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Trading Practice</h1>
        <p className="text-gray-300 mb-6">Practice trading simulator coming soon!</p>
        <Link to="/app/dashboard" className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
          Back to Dashboard
        </Link>
      </div>
    </div>
  </div>
);

const SettingsPage = () => (
  <div className="min-h-screen bg-gray-900 p-6">
    <div className="max-w-4xl mx-auto">
      <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Settings</h1>
        <p className="text-gray-300 mb-6">User settings and preferences coming soon!</p>
        <Link to="/app/dashboard" className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
          Back to Dashboard
        </Link>
      </div>
    </div>
  </div>
);

// Import Link for placeholder components
import { Link } from 'react-router-dom';

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
            {/* Redirect /app to /app/dashboard */}
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            
            {/* Main App Pages */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="course" element={<CoursePage />} />
            <Route path="lesson/:lessonId" element={<LessonPage />} />
            <Route path="progress" element={<ProgressPage />} />
            <Route path="achievements" element={<AchievementsPage />} />
            <Route path="practice" element={<PracticePage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Catch all route - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </UserProvider>
  )
}

export default App