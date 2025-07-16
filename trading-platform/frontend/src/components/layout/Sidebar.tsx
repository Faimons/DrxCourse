// src/components/layout/Sidebar.jsx - App Sidebar Navigation
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useUser } from '../../context/UserContext'
import {
  Home,
  BookOpen,
  TrendingUp,
  BarChart3,
  Trophy,
  Target,
  Settings,
  HelpCircle,
  ChevronRight,
  PlayCircle,
  CheckCircle2
} from 'lucide-react'

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation()
  const { user } = useUser()

  // Progress data (TODO: Get from API)
  const progressData = {
    completedLessons: 8,
    totalLessons: 15,
    currentStreak: 5,
    totalPoints: 2450
  }

  const progressPercentage = Math.round((progressData.completedLessons / progressData.totalLessons) * 100)

  // Navigation items
  const navigation = [
    {
      name: 'Dashboard',
      href: '/app/dashboard',
      icon: Home,
      current: location.pathname === '/app/dashboard'
    },
    {
      name: 'Kurs Übersicht',
      href: '/app/course',
      icon: BookOpen,
      current: location.pathname === '/app/course'
    },
    {
      name: 'Trading Charts',
      href: '/app/charts',
      icon: TrendingUp,
      current: location.pathname === '/app/charts'
    },
    {
      name: 'Fortschritt',
      href: '/app/progress',
      icon: BarChart3,
      current: location.pathname === '/app/progress'
    },
    {
      name: 'Achievements',
      href: '/app/achievements',
      icon: Trophy,
      current: location.pathname === '/app/achievements'
    }
  ]

  // Quick access lessons (TODO: Get from API)
  const quickLessons = [
    { id: 1, title: 'Grundlagen des Tradings', completed: true },
    { id: 2, title: 'Technische Analyse', completed: true },
    { id: 3, title: 'Candlestick Patterns', completed: false, current: true },
    { id: 4, title: 'Risk Management', completed: false },
    { id: 5, title: 'Trading Psychologie', completed: false }
  ]

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out
    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
    lg:translate-x-0 lg:static lg:inset-0
  `

  return (
    <div className={sidebarClasses}>
      <div className="flex flex-col h-full">
        
        {/* Top spacing for header */}
        <div className="h-16 flex-shrink-0"></div>

        {/* Progress Summary */}
        <div className="p-4 border-b border-gray-200">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Kurs Fortschritt</span>
              <Target className="h-4 w-4" />
            </div>
            
            <div className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span>{progressData.completedLessons}/{progressData.totalLessons} Lektionen</span>
                <span>{progressPercentage}%</span>
              </div>
              <div className="w-full bg-blue-400 rounded-full h-2">
                <div 
                  className="bg-white rounded-full h-2 transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>

            <div className="flex justify-between text-xs">
              <span>🔥 {progressData.currentStreak} Tage Streak</span>
              <span>⭐ {progressData.totalPoints} Punkte</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Navigation
            </h3>
            
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200
                    ${item.current 
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }
                  `}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className={`
                    mr-3 h-5 w-5 flex-shrink-0
                    ${item.current ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'}
                  `} />
                  {item.name}
                  {item.current && (
                    <ChevronRight className="ml-auto h-4 w-4 text-blue-500" />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Quick Lessons */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Schnellzugriff Lektionen
            </h3>
            
            <div className="space-y-2">
              {quickLessons.map((lesson) => (
                <Link
                  key={lesson.id}
                  to={`/app/lesson/${lesson.id}`}
                  className={`
                    group flex items-center px-3 py-2 text-sm rounded-lg transition-colors duration-200
                    ${lesson.current 
                      ? 'bg-yellow-50 text-yellow-800 border-l-3 border-yellow-500' 
                      : lesson.completed
                        ? 'text-green-600 hover:bg-green-50'
                        : 'text-gray-600 hover:bg-gray-50'
                    }
                  `}
                  onClick={() => setSidebarOpen(false)}
                >
                  {lesson.completed ? (
                    <CheckCircle2 className="mr-3 h-4 w-4 text-green-500 flex-shrink-0" />
                  ) : lesson.current ? (
                    <PlayCircle className="mr-3 h-4 w-4 text-yellow-500 flex-shrink-0" />
                  ) : (
                    <div className="mr-3 h-4 w-4 rounded-full border-2 border-gray-300 flex-shrink-0"></div>
                  )}
                  
                  <span className="truncate">{lesson.title}</span>
                  
                  {lesson.current && (
                    <div className="ml-auto">
                      <div className="h-2 w-2 bg-yellow-500 rounded-full animate-pulse"></div>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="flex-shrink-0 p-4 border-t border-gray-200">
          <Link
            to="/app/settings"
            className="group flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200"
            onClick={() => setSidebarOpen(false)}
          >
            <Settings className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
            Einstellungen
          </Link>
          
          <Link
            to="/app/help"
            className="group flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200"
            onClick={() => setSidebarOpen(false)}
          >
            <HelpCircle className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
            Hilfe & Support
          </Link>

          {/* User info */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center">
              <img
                src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=3b82f6&color=fff`}
                alt="Profile"
                className="h-8 w-8 rounded-full"
              />
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-900 truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.subscription || 'Premium Member'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}