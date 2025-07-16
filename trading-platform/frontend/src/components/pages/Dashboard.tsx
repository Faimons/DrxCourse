import React, { useState } from 'react';
import { 
  BarChart3, 
  BookOpen, 
  Clock, 
  Trophy, 
  Target,
  TrendingUp,
  ChevronRight,
  Play,
  CheckCircle,
  Lock,
  Star,
  Calendar,
  Award,
  ExternalLink,
  Menu,
  X,
  User,
  Settings,
  LogOut
} from 'lucide-react';

const TradingDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Mock Data - replace with real data
  const userProgress = {
    completedLessons: 8,
    totalLessons: 24,
    completionRate: 33,
    timeSpent: 12.5,
    currentStreak: 7,
    totalPoints: 2850,
    currentLevel: 'Intermediate',
    nextLevel: 'Advanced',
    pointsToNext: 1150
  };

  const recentActivity = [
    { lesson: 'Risk Management Fundamentals', completedAt: '2 hours ago', score: 95 },
    { lesson: 'Chart Pattern Recognition', completedAt: '1 day ago', score: 88 },
    { lesson: 'Position Sizing Strategies', completedAt: '2 days ago', score: 92 }
  ];

  const upcomingLessons = [
    { 
      id: 1, 
      title: 'Psychology of Trading', 
      module: 'Module 3: Mindset',
      duration: '15 min',
      difficulty: 'Intermediate',
      locked: false,
      hasQuiz: true
    },
    { 
      id: 2, 
      title: 'Advanced Order Types', 
      module: 'Module 4: Execution',
      duration: '20 min',
      difficulty: 'Advanced',
      locked: false,
      hasQuiz: true
    },
    { 
      id: 3, 
      title: 'Algorithmic Trading Basics', 
      module: 'Module 5: Automation',
      duration: '25 min',
      difficulty: 'Advanced',
      locked: true,
      hasQuiz: false
    }
  ];

  const achievements = [
    { title: 'First Week Complete', icon: '🏆', earned: true },
    { title: 'Quiz Master', icon: '🎯', earned: true },
    { title: 'Consistent Learner', icon: '📚', earned: false },
    { title: 'Advanced Trader', icon: '⚡', earned: false }
  ];

  const brokerRecommendations = [
    {
      name: 'MetaTrader 5',
      description: 'Professional trading platform',
      rating: 4.8,
      users: '50M+',
      image: '/api/placeholder/120/80',
      ctaText: 'Get MT5 Free',
      relevant: 'Required for lessons 12-18'
    },
    {
      name: 'TradingView',
      description: 'Advanced charting & analysis',
      rating: 4.9,
      users: '30M+',
      image: '/api/placeholder/120/80',
      ctaText: 'Start Free Trial',
      relevant: 'Essential for technical analysis'
    }
  ];

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
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-300 hover:bg-gray-700"
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
                <div className="text-lg font-semibold text-white">{userProgress.completionRate}%</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-400">Streak</div>
                <div className="text-lg font-semibold text-emerald-400">{userProgress.currentStreak} days</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-400">Level</div>
                <div className="text-lg font-semibold text-yellow-400">{userProgress.currentLevel}</div>
              </div>
            </div>

            {/* Right: User Menu */}
            <div className="flex items-center space-x-3">
              <div className="hidden sm:block text-right">
                <div className="text-sm font-medium text-white">Trading Pro</div>
                <div className="text-xs text-gray-400">{userProgress.totalPoints} points</div>
              </div>
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 z-20 w-80 bg-gray-800 border-r border-gray-700 transform transition-transform duration-200 ease-in-out pt-16
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:inset-0 lg:pt-0
        `}>
          <div className="flex flex-col h-full">
            
            {/* Quick Stats */}
            <div className="p-6 border-b border-gray-700">
              <div className="bg-gradient-to-r from-emerald-600 to-blue-600 rounded-xl p-4 text-white">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">Course Progress</span>
                  <BarChart3 className="h-4 w-4" />
                </div>
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>{userProgress.completedLessons}/{userProgress.totalLessons} Lessons</span>
                    <span>{userProgress.completionRate}%</span>
                  </div>
                  <div className="w-full bg-emerald-400/30 rounded-full h-2">
                    <div 
                      className="bg-white rounded-full h-2 transition-all duration-500"
                      style={{ width: `${userProgress.completionRate}%` }}
                    ></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="text-emerald-200">Time Invested</div>
                    <div className="font-semibold">{userProgress.timeSpent}h</div>
                  </div>
                  <div>
                    <div className="text-emerald-200">Points</div>
                    <div className="font-semibold">{userProgress.totalPoints}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Navigation */}
            <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Quick Access
              </div>
              
              <a href="#" className="group flex items-center px-3 py-2 text-sm font-medium text-white bg-gray-700 rounded-lg">
                <BarChart3 className="mr-3 h-5 w-5 text-emerald-400" />
                Dashboard
              </a>
              
              <a href="#" className="group flex items-center px-3 py-2 text-sm font-medium text-gray-300 rounded-lg hover:text-white hover:bg-gray-700">
                <BookOpen className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-300" />
                All Lessons
              </a>
              
              <a href="#" className="group flex items-center px-3 py-2 text-sm font-medium text-gray-300 rounded-lg hover:text-white hover:bg-gray-700">
                <Target className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-300" />
                Practice Tests
              </a>
              
              <a href="#" className="group flex items-center px-3 py-2 text-sm font-medium text-gray-300 rounded-lg hover:text-white hover:bg-gray-700">
                <Trophy className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-300" />
                Achievements
              </a>

              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 mt-6">
                Course Modules
              </div>

              <div className="space-y-1">
                <div className="flex items-center px-3 py-2 text-sm text-emerald-400">
                  <CheckCircle className="mr-3 h-4 w-4" />
                  Module 1: Basics ✓
                </div>
                <div className="flex items-center px-3 py-2 text-sm text-emerald-400">
                  <CheckCircle className="mr-3 h-4 w-4" />
                  Module 2: Analysis ✓
                </div>
                <div className="flex items-center px-3 py-2 text-sm text-white">
                  <div className="mr-3 h-4 w-4 bg-yellow-400 rounded-full animate-pulse"></div>
                  Module 3: Psychology
                </div>
                <div className="flex items-center px-3 py-2 text-sm text-gray-400">
                  <Lock className="mr-3 h-4 w-4" />
                  Module 4: Execution
                </div>
                <div className="flex items-center px-3 py-2 text-sm text-gray-400">
                  <Lock className="mr-3 h-4 w-4" />
                  Module 5: Automation
                </div>
              </div>
            </nav>

            {/* Bottom Section */}
            <div className="p-4 border-t border-gray-700">
              <div className="flex items-center justify-between">
                <button className="flex items-center text-sm text-gray-400 hover:text-gray-300">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </button>
                <button className="flex items-center text-sm text-gray-400 hover:text-gray-300">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-80 overflow-hidden">
          <div className="p-6 space-y-8">
            
            {/* Welcome Section */}
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome back, Trading Pro!
              </h1>
              <p className="text-gray-400">
                Continue your journey to becoming a profitable trader. You're making great progress!
              </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Lessons Completed</p>
                    <p className="text-2xl font-bold text-white">
                      {userProgress.completedLessons}/{userProgress.totalLessons}
                    </p>
                  </div>
                  <div className="bg-emerald-500/20 p-3 rounded-lg">
                    <BookOpen className="h-6 w-6 text-emerald-400" />
                  </div>
                </div>
                <div className="mt-4 bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-emerald-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${userProgress.completionRate}%` }}
                  />
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  {userProgress.completionRate}% complete
                </p>
              </div>

              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Learning Time</p>
                    <p className="text-2xl font-bold text-white">{userProgress.timeSpent}h</p>
                  </div>
                  <div className="bg-blue-500/20 p-3 rounded-lg">
                    <Clock className="h-6 w-6 text-blue-400" />
                  </div>
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  This week
                </p>
              </div>

              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Current Streak</p>
                    <p className="text-2xl font-bold text-white">{userProgress.currentStreak}</p>
                  </div>
                  <div className="bg-orange-500/20 p-3 rounded-lg">
                    <Target className="h-6 w-6 text-orange-400" />
                  </div>
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  Days in a row
                </p>
              </div>

              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Total Points</p>
                    <p className="text-2xl font-bold text-white">{userProgress.totalPoints}</p>
                  </div>
                  <div className="bg-yellow-500/20 p-3 rounded-lg">
                    <Trophy className="h-6 w-6 text-yellow-400" />
                  </div>
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  Level: {userProgress.currentLevel}
                </p>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Continue Learning */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Continue Learning</h2>
                  <a href="#" className="text-emerald-400 hover:text-emerald-300 font-medium text-sm flex items-center">
                    View All <ChevronRight className="h-4 w-4 ml-1" />
                  </a>
                </div>
                
                <div className="space-y-4">
                  {upcomingLessons.map((lesson) => (
                    <div key={lesson.id} className="flex items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                      <div className={`p-2 rounded-lg mr-4 ${lesson.locked ? 'bg-gray-600' : 'bg-emerald-500/20'}`}>
                        {lesson.locked ? (
                          <Lock className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Play className="h-5 w-5 text-emerald-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-medium ${lesson.locked ? 'text-gray-400' : 'text-white'}`}>
                          {lesson.title}
                        </h3>
                        <p className="text-sm text-gray-400">{lesson.module} • {lesson.duration}</p>
                        <div className="flex items-center mt-1">
                          <span className={`text-xs px-2 py-1 rounded ${
                            lesson.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                            lesson.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {lesson.difficulty}
                          </span>
                          {lesson.hasQuiz && (
                            <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded ml-2">
                              Quiz
                            </span>
                          )}
                        </div>
                      </div>
                      {!lesson.locked && (
                        <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
                          Start
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Recent Activity</h2>
                  <a href="#" className="text-emerald-400 hover:text-emerald-300 font-medium text-sm flex items-center">
                    View All <ChevronRight className="h-4 w-4 ml-1" />
                  </a>
                </div>
                
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                      <div className="flex items-center">
                        <div className="bg-emerald-500/20 p-2 rounded-lg mr-4">
                          <CheckCircle className="h-5 w-5 text-emerald-400" />
                        </div>
                        <div>
                          <h3 className="font-medium text-white">{activity.lesson}</h3>
                          <p className="text-sm text-gray-400">{activity.completedAt}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-emerald-400 font-semibold">{activity.score}%</div>
                        <div className="text-xs text-gray-400">Quiz Score</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Achievements</h2>
                <a href="#" className="text-emerald-400 hover:text-emerald-300 font-medium text-sm flex items-center">
                  View All <ChevronRight className="h-4 w-4 ml-1" />
                </a>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className={`p-4 rounded-lg border-2 transition-colors ${
                    achievement.earned 
                      ? 'bg-yellow-500/10 border-yellow-500/30' 
                      : 'bg-gray-700 border-gray-600'
                  }`}>
                    <div className="text-center">
                      <div className={`text-3xl mb-2 ${achievement.earned ? '' : 'grayscale opacity-50'}`}>
                        {achievement.icon}
                      </div>
                      <h3 className={`font-medium text-sm ${
                        achievement.earned ? 'text-yellow-400' : 'text-gray-400'
                      }`}>
                        {achievement.title}
                      </h3>
                      {achievement.earned && (
                        <div className="text-xs text-yellow-300 mt-1">Completed!</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Broker Recommendations */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Recommended Platforms</h2>
                  <p className="text-gray-400 text-sm">Essential tools for your trading journey</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {brokerRecommendations.map((broker, index) => (
                  <div key={index} className="bg-gray-700 rounded-lg p-6 border border-gray-600 hover:border-emerald-500/50 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <img 
                          src={broker.image} 
                          alt={broker.name}
                          className="w-12 h-8 rounded bg-gray-600 mr-3"
                        />
                        <div>
                          <h3 className="font-semibold text-white">{broker.name}</h3>
                          <p className="text-sm text-gray-400">{broker.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center text-yellow-400 text-sm">
                          <Star className="h-4 w-4 mr-1 fill-current" />
                          {broker.rating}
                        </div>
                        <div className="text-xs text-gray-400">{broker.users} users</div>
                      </div>
                    </div>
                    
                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 mb-4">
                      <p className="text-emerald-400 text-sm font-medium">{broker.relevant}</p>
                    </div>
                    
                    <button className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center">
                      {broker.ctaText}
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
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

export default TradingDashboard;