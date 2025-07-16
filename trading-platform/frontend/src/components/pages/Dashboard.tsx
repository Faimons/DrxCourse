// C:\Users\DRX_SIMON\Drx-cours2.0\trading-platform\frontend\src\components\pages\Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Clock, 
  Target, 
  Trophy, 
  CheckCircle, 
  ChevronRight,
  Play,
  Lock,
  ExternalLink,
  BookOpen,
  Award,
  BarChart3,
  Star,
  Zap,
  Users,
  ArrowRight
} from 'lucide-react';
import { useUser } from '../../context/UserContext';

interface LessonData {
  id: number;
  title: string;
  duration: number;
  completed: boolean;
  locked: boolean;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  module: string;
  progress?: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  progress?: number;
  maxProgress?: number;
}

interface BrokerRecommendation {
  name: string;
  description: string;
  rating: number;
  users: string;
  image: string;
  ctaText: string;
  relevant: string;
}

const Dashboard = () => {
  const { user } = useUser();
  const [userProgress, setUserProgress] = useState({
    completedLessons: 8,
    totalLessons: 24,
    completionRate: 33,
    timeSpent: 12.5,
    currentStreak: 7,
    totalPoints: 2850,
    currentLevel: 'Intermediate'
  });

  const [upcomingLessons, setUpcomingLessons] = useState<LessonData[]>([
    {
      id: 9,
      title: 'Psychology of Trading',
      duration: 15,
      completed: false,
      locked: false,
      difficulty: 'Intermediate',
      module: 'Module 3',
      progress: 0
    },
    {
      id: 10,
      title: 'Advanced Order Types',
      duration: 20,
      completed: false,
      locked: false,
      difficulty: 'Advanced',
      module: 'Module 4',
      progress: 0
    },
    {
      id: 11,
      title: 'Algorithmic Trading Basics',
      duration: 25,
      completed: false,
      locked: true,
      difficulty: 'Advanced',
      module: 'Module 5',
      progress: 0
    }
  ]);

  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      lesson: 'Risk Management Fundamentals',
      completedAt: '2 hours ago',
      score: 95,
      type: 'lesson' as const
    },
    {
      id: 2,
      lesson: 'Chart Pattern Recognition',
      completedAt: '1 day ago',
      score: 88,
      type: 'quiz' as const
    },
    {
      id: 3,
      lesson: 'Position Sizing Strategies',
      completedAt: '2 days ago',
      score: 92,
      type: 'exercise' as const
    }
  ]);

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'first-week',
      title: 'First Week Complete',
      description: 'Completed your first week of learning',
      icon: '🏆',
      earned: true
    },
    {
      id: 'quiz-master',
      title: 'Quiz Master',
      description: 'Score 90%+ on 5 quizzes',
      icon: '🎯',
      earned: true
    },
    {
      id: 'consistent-learner',
      title: 'Consistent Learner',
      description: 'Learn for 7 days straight',
      icon: '📚',
      earned: true
    },
    {
      id: 'advanced-trader',
      title: 'Advanced Trader',
      description: 'Complete all advanced modules',
      icon: '⚡',
      earned: false,
      progress: 2,
      maxProgress: 5
    }
  ]);

  const brokerRecommendations: BrokerRecommendation[] = [
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
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user?.name || 'Trading Pro'}!
          </h1>
          <p className="text-gray-400">
            Continue your journey to becoming a profitable trader. You're making great progress!
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Lessons Completed</p>
                <p className="text-2xl font-bold text-white">{userProgress.completedLessons}/{userProgress.totalLessons}</p>
                <p className="text-sm text-gray-400">{userProgress.completionRate}% complete</p>
              </div>
              <div className="bg-emerald-500/20 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-emerald-400" />
              </div>
            </div>
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
            <p className="text-sm text-gray-400 mt-2">This week</p>
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
            <p className="text-sm text-gray-400 mt-2">Days in a row</p>
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
            <p className="text-sm text-gray-400 mt-2">Level: {userProgress.currentLevel}</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Continue Learning */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Continue Learning</h2>
              <Link to="/app/course" className="text-emerald-400 hover:text-emerald-300 font-medium text-sm flex items-center">
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
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
                    <h3 className="font-medium text-white">{lesson.title}</h3>
                    <div className="flex items-center text-sm text-gray-400 mt-1">
                      <span className="mr-4">{lesson.module}</span>
                      <span className="mr-4">{lesson.duration} min</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        lesson.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                        lesson.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {lesson.difficulty}
                      </span>
                    </div>
                  </div>
                  {!lesson.locked && (
                    <Link 
                      to={`/app/lesson/${lesson.id}`}
                      className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                    >
                      Start
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Recent Activity</h2>
              <Link to="/app/progress" className="text-emerald-400 hover:text-emerald-300 font-medium text-sm flex items-center">
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
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
                    <div className="text-xs text-gray-400 capitalize">{activity.type}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="mt-8 bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Recent Achievements</h2>
            <Link to="/app/achievements" className="text-emerald-400 hover:text-emerald-300 font-medium text-sm flex items-center">
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {achievements.map((achievement) => (
              <div key={achievement.id} className={`p-4 rounded-lg border-2 transition-colors ${
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
                  <p className="text-xs text-gray-400 mt-1">{achievement.description}</p>
                  {!achievement.earned && achievement.progress && achievement.maxProgress && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-600 rounded-full h-1">
                        <div 
                          className="bg-yellow-400 h-1 rounded-full"
                          style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {achievement.progress}/{achievement.maxProgress}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/app/course" className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl p-6 hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Browse Courses</h3>
                <p className="text-emerald-100">Explore all available lessons</p>
              </div>
              <BookOpen className="h-8 w-8 text-emerald-200 group-hover:scale-110 transition-transform" />
            </div>
          </Link>

          <Link to="/app/practice" className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Practice Trading</h3>
                <p className="text-blue-100">Test your skills with simulation</p>
              </div>
              <Target className="h-8 w-8 text-blue-200 group-hover:scale-110 transition-transform" />
            </div>
          </Link>

          <Link to="/app/progress" className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-6 hover:from-purple-700 hover:to-purple-800 transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white mb-2">View Progress</h3>
                <p className="text-purple-100">Track your learning journey</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-200 group-hover:scale-110 transition-transform" />
            </div>
          </Link>
        </div>

        {/* Recommended Brokers */}
        <div className="mt-8 bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-6">Recommended Trading Platforms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {brokerRecommendations.map((broker, index) => (
              <div key={index} className="bg-gray-700 rounded-lg p-6 hover:bg-gray-600 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-white text-lg">{broker.name}</h3>
                    <p className="text-gray-300 text-sm">{broker.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-yellow-400 mb-1">
                      <Star className="h-4 w-4 mr-1" />
                      <span className="font-semibold">{broker.rating}</span>
                    </div>
                    <div className="text-xs text-gray-400 flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      {broker.users} users
                    </div>
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
    </div>
  );
};

export default Dashboard;