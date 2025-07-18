// C:\Users\DRX_SIMON\Drx-cours2.0\trading-platform\frontend\src\components\layout\Layout.tsx
import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  TrendingUp, 
  Home, 
  BookOpen, 
  BarChart3, 
  Award, 
  Target,
  Settings,
  Menu,
  X,
  LogOut,
  User,
  CheckCircle,
  Lock,
  Play,
  Clock
} from 'lucide-react';
import { useUser } from '../../context/UserContext';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  // Mock Progress Data - replace with real API
  const progressData = {
    completedLessons: 8,
    totalLessons: 24,
    completionRate: 33,
    currentStreak: 7,
    totalPoints: 2850,
    currentLevel: 'Intermediate'
  };

  const navigation = [
    { name: 'Dashboard', href: '/app/dashboard', icon: Home },
    { name: 'Course Overview', href: '/app/course', icon: BookOpen },
    { name: 'Progress', href: '/app/progress', icon: BarChart3 },
    { name: 'Achievements', href: '/app/achievements', icon: Award },
    { name: 'Practice', href: '/app/practice', icon: Target },
  ];

  const courseModules = [
    { 
      id: 1, 
      name: 'Trading Basics', 
      completed: true, 
      lessons: 6, 
      completedLessons: 6 
    },
    { 
      id: 2, 
      name: 'Technical Analysis', 
      completed: true, 
      lessons: 8, 
      completedLessons: 8 
    },
    { 
      id: 3, 
      name: 'Risk Management', 
      completed: false, 
      lessons: 6, 
      completedLessons: 2,
      current: true
    },
    { 
      id: 4, 
      name: 'Psychology', 
      completed: false, 
      lessons: 4, 
      completedLessons: 0 
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isCurrentPath = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-900">
      
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 fixed w-full top-0 z-30">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Left: Logo & Mobile Menu */}
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-300 hover:bg-gray-700 transition-colors"
              >
                {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              
              <div className="flex items-center ml-4 lg:ml-0">
                <TrendingUp className="h-8 w-8 text-emerald-400" />
                <span className="ml-2 text-xl font-bold text-white">Trading Academy</span>
              </div>
            </div>

            {/* Center: Progress Overview */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="text-center">
                <div className="text-sm text-gray-400">Progress</div>
                <div className="text-lg font-semibold text-white">{progressData.completionRate}%</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-400">Streak</div>
                <div className="text-lg font-semibold text-emerald-400">{progressData.currentStreak} days</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-400">Level</div>
                <div className="text-lg font-semibold text-yellow-400">{progressData.currentLevel}</div>
              </div>
            </div>

            {/* Right: User Menu */}
            <div className="flex items-center space-x-3">
              <div className="hidden sm:block text-right">
                <div className="text-sm font-medium text-white">{user?.name || 'Trading Pro'}</div>
                <div className="text-xs text-gray-400">{progressData.totalPoints} points</div>
              </div>
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        
        {/* Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 z-20 w-80 bg-gray-800 border-r border-gray-700 transform transition-transform duration-200 ease-in-out pt-16
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:inset-0
        `}>
          <div className="flex flex-col h-full">
            
            {/* Progress Summary */}
            <div className="p-6 border-b border-gray-700">
              <div className="bg-gradient-to-r from-emerald-600 to-blue-600 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-white">Course Progress</span>
                  <Target className="h-4 w-4 text-white" />
                </div>
                
                <div className="mb-3">
                  <div className="flex justify-between text-sm text-white mb-1">
                    <span>{progressData.completedLessons}/{progressData.totalLessons} lessons</span>
                    <span>{progressData.completionRate}%</span>
                  </div>
                  <div className="w-full bg-emerald-500 rounded-full h-2">
                    <div 
                      className="bg-white rounded-full h-2 transition-all duration-300"
                      style={{ width: `${progressData.completionRate}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between text-xs text-emerald-100">
                  <span>🔥 {progressData.currentStreak} day streak</span>
                  <span>⭐ {progressData.totalPoints} points</span>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                  Navigation
                </h3>
                
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const current = isCurrentPath(item.href);
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                        current 
                          ? 'bg-emerald-600 text-white' 
                          : 'text-gray-300 hover:text-white hover:bg-gray-700'
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon className={`mr-3 h-4 w-4 flex-shrink-0 ${
                        current ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'
                      }`} />
                      {item.name}
                    </Link>
                  );
                })}
              </div>

              {/* Course Modules */}
              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                  Course Modules
                </h3>
                <div className="space-y-2">
                  {courseModules.map((module) => (
                    <div key={module.id} className="px-3 py-2 rounded-lg bg-gray-700">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-white">{module.name}</span>
                        {module.completed && (
                          <CheckCircle className="h-4 w-4 text-emerald-400" />
                        )}
                        {module.current && (
                          <Play className="h-4 w-4 text-yellow-400" />
                        )}
                        {!module.completed && !module.current && (
                          <Lock className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                      <div className="text-xs text-gray-400 mb-2">
                        {module.completedLessons}/{module.lessons} lessons
                      </div>
                      {!module.completed && (
                        <div className="w-full bg-gray-600 rounded-full h-1">
                          <div 
                            className={`h-1 rounded-full transition-all duration-500 ${
                              module.completed ? 'bg-emerald-400' : 'bg-yellow-400'
                            }`}
                            style={{ width: `${(module.completedLessons / module.lessons) * 100}%` }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </nav>

            {/* Settings Link */}
            <div className="p-4 border-t border-gray-700">
              <Link
                to="/app/settings"
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  isCurrentPath('/app/settings')
                    ? 'bg-emerald-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                <Settings className="mr-3 h-4 w-4 text-gray-400 group-hover:text-gray-300" />
                Settings
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-80 overflow-hidden">
          <Outlet />
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-10 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;