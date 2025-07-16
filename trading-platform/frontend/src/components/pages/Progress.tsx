// C:\Users\DRX_SIMON\Drx-cours2.0\trading-platform\frontend\src\components\pages\ProgressPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Award, 
  Target,
  Calendar,
  Star,
  CheckCircle,
  PlayCircle,
  BookOpen,
  Zap,
  Trophy,
  Fire,
  ArrowUp,
  ArrowDown,
  Filter,
  Download
} from 'lucide-react';
import { useUser } from '../../context/UserContext';

interface ProgressData {
  overview: {
    totalLessons: number;
    completedLessons: number;
    totalTimeSpent: number; // in minutes
    averageScore: number;
    currentStreak: number;
    longestStreak: number;
    totalPoints: number;
    level: string;
    nextLevelPoints: number;
  };
  weeklyProgress: {
    week: string;
    lessonsCompleted: number;
    timeSpent: number;
    averageScore: number;
  }[];
  recentActivity: {
    date: string;
    lessonTitle: string;
    timeSpent: number;
    score: number;
    type: 'lesson' | 'quiz' | 'exercise';
  }[];
  moduleProgress: {
    moduleId: number;
    moduleName: string;
    totalLessons: number;
    completedLessons: number;
    averageScore: number;
    timeSpent: number;
    completed: boolean;
  }[];
  achievements: {
    id: string;
    title: string;
    description: string;
    icon: string;
    earned: boolean;
    earnedDate?: string;
    progress?: number;
    maxProgress?: number;
  }[];
  learningStreak: {
    date: string;
    active: boolean;
  }[];
}

const ProgressPage = () => {
  const { user } = useUser();
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'all'>('month');
  const [selectedModule, setSelectedModule] = useState<string>('all');

  useEffect(() => {
    loadProgressData();
  }, []);

  const loadProgressData = async () => {
    setLoading(true);
    try {
      // Mock progress data - replace with real API call
      const mockData: ProgressData = {
        overview: {
          totalLessons: 24,
          completedLessons: 8,
          totalTimeSpent: 750, // 12.5 hours
          averageScore: 87,
          currentStreak: 7,
          longestStreak: 12,
          totalPoints: 2850,
          level: 'Intermediate',
          nextLevelPoints: 1150
        },
        weeklyProgress: [
          { week: 'Week 1', lessonsCompleted: 3, timeSpent: 180, averageScore: 85 },
          { week: 'Week 2', lessonsCompleted: 2, timeSpent: 150, averageScore: 89 },
          { week: 'Week 3', lessonsCompleted: 2, timeSpent: 120, averageScore: 92 },
          { week: 'Week 4', lessonsCompleted: 1, timeSpent: 90, averageScore: 88 },
        ],
        recentActivity: [
          { date: '2024-07-15', lessonTitle: 'Risk Management Fundamentals', timeSpent: 25, score: 92, type: 'lesson' },
          { date: '2024-07-14', lessonTitle: 'Chart Patterns Quiz', timeSpent: 10, score: 88, type: 'quiz' },
          { date: '2024-07-13', lessonTitle: 'Position Sizing Exercise', timeSpent: 15, score: 95, type: 'exercise' },
          { date: '2024-07-12', lessonTitle: 'Technical Analysis Basics', timeSpent: 30, score: 86, type: 'lesson' },
          { date: '2024-07-11', lessonTitle: 'Market Structure', timeSpent: 28, score: 91, type: 'lesson' },
        ],
        moduleProgress: [
          { moduleId: 1, moduleName: 'Trading Fundamentals', totalLessons: 6, completedLessons: 6, averageScore: 89, timeSpent: 180, completed: true },
          { moduleId: 2, moduleName: 'Technical Analysis', totalLessons: 8, completedLessons: 8, averageScore: 87, timeSpent: 240, completed: true },
          { moduleId: 3, moduleName: 'Risk Management', totalLessons: 6, completedLessons: 2, averageScore: 90, timeSpent: 90, completed: false },
          { moduleId: 4, moduleName: 'Trading Psychology', totalLessons: 4, completedLessons: 0, averageScore: 0, timeSpent: 0, completed: false },
        ],
        achievements: [
          { id: 'first-lesson', title: 'First Steps', description: 'Complete your first lesson', icon: '🎯', earned: true, earnedDate: '2024-06-15' },
          { id: 'week-streak', title: 'Week Warrior', description: 'Learn for 7 days in a row', icon: '🔥', earned: true, earnedDate: '2024-07-10' },
          { id: 'quiz-master', title: 'Quiz Master', description: 'Score 90%+ on 5 quizzes', icon: '🧠', earned: true, earnedDate: '2024-07-12' },
          { id: 'module-complete', title: 'Module Master', description: 'Complete your first module', icon: '📚', earned: true, earnedDate: '2024-06-28' },
          { id: 'speed-learner', title: 'Speed Learner', description: 'Complete 3 lessons in one day', icon: '⚡', earned: false, progress: 2, maxProgress: 3 },
          { id: 'perfectionist', title: 'Perfectionist', description: 'Score 100% on a quiz', icon: '💯', earned: false, progress: 95, maxProgress: 100 },
          { id: 'dedicated', title: 'Dedicated Trader', description: 'Learn for 30 days in a row', icon: '🏆', earned: false, progress: 7, maxProgress: 30 },
        ],
        learningStreak: [
          { date: '2024-07-09', active: true },
          { date: '2024-07-10', active: true },
          { date: '2024-07-11', active: true },
          { date: '2024-07-12', active: true },
          { date: '2024-07-13', active: true },
          { date: '2024-07-14', active: true },
          { date: '2024-07-15', active: true },
        ]
      };

      setProgressData(mockData);
    } catch (error) {
      console.error('Failed to load progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCompletionRate = () => {
    if (!progressData) return 0;
    return Math.round((progressData.overview.completedLessons / progressData.overview.totalLessons) * 100);
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'lesson': return <BookOpen className="h-4 w-4" />;
      case 'quiz': return <Star className="h-4 w-4" />;
      case 'exercise': return <Target className="h-4 w-4" />;
      default: return <PlayCircle className="h-4 w-4" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 80) return 'text-yellow-400';
    if (score >= 70) return 'text-orange-400';
    return 'text-red-400';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400"></div>
          <span className="text-gray-400">Loading progress data...</span>
        </div>
      </div>
    );
  }

  if (!progressData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">No progress data available</h1>
          <Link to="/app/course" className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
            Start Learning
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Learning Progress</h1>
              <p className="text-gray-400">Track your trading education journey</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value as 'week' | 'month' | 'all')}
                className="bg-gray-800 border border-gray-700 rounded-lg text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="all">All Time</option>
              </select>
              
              <button className="bg-gray-800 border border-gray-700 rounded-lg text-gray-300 px-4 py-2 hover:bg-gray-700 transition-colors flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Completion Rate</p>
                <p className="text-2xl font-bold text-white">{getCompletionRate()}%</p>
                <p className="text-sm text-gray-400">{progressData.overview.completedLessons}/{progressData.overview.totalLessons} lessons</p>
              </div>
              <div className="bg-emerald-500/20 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-emerald-400" />
              </div>
            </div>
            <div className="mt-4 bg-gray-700 rounded-full h-2">
              <div 
                className="bg-emerald-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${getCompletionRate()}%` }}
              />
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Time Invested</p>
                <p className="text-2xl font-bold text-white">{formatTime(progressData.overview.totalTimeSpent)}</p>
                <p className="text-sm text-emerald-400 flex items-center">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  +2.5h this week
                </p>
              </div>
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Current Streak</p>
                <p className="text-2xl font-bold text-white">{progressData.overview.currentStreak}</p>
                <p className="text-sm text-gray-400">days • Best: {progressData.overview.longestStreak}</p>
              </div>
              <div className="bg-orange-500/20 p-3 rounded-lg">
                <Fire className="h-6 w-6 text-orange-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Average Score</p>
                <p className="text-2xl font-bold text-white">{progressData.overview.averageScore}%</p>
                <p className="text-sm text-emerald-400 flex items-center">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  +3% improvement
                </p>
              </div>
              <div className="bg-yellow-500/20 p-3 rounded-lg">
                <Star className="h-6 w-6 text-yellow-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Module Progress */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
              <h2 className="text-xl font-bold text-white mb-6">Module Progress</h2>
              <div className="space-y-4">
                {progressData.moduleProgress.map((module) => (
                  <div key={module.moduleId} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-white">{module.moduleName}</h3>
                        <p className="text-sm text-gray-400">
                          {module.completedLessons}/{module.totalLessons} lessons • {formatTime(module.timeSpent)}
                        </p>
                      </div>
                      <div className="text-right">
                        {module.completed && <CheckCircle className="h-5 w-5 text-emerald-400 mb-1" />}
                        <div className={`text-sm font-medium ${
                          module.averageScore > 0 ? getScoreColor(module.averageScore) : 'text-gray-400'
                        }`}>
                          {module.averageScore > 0 ? `${module.averageScore}%` : 'Not started'}
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          module.completed ? 'bg-emerald-400' : 'bg-blue-400'
                        }`}
                        style={{ width: `${(module.completedLessons / module.totalLessons) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly Progress Chart */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-6">Weekly Progress</h2>
              <div className="grid grid-cols-4 gap-4">
                {progressData.weeklyProgress.map((week, index) => (
                  <div key={index} className="text-center">
                    <div className="bg-gray-700 rounded-lg p-4 mb-2">
                      <div className="text-2xl font-bold text-emerald-400 mb-1">
                        {week.lessonsCompleted}
                      </div>
                      <div className="text-xs text-gray-400">lessons</div>
                    </div>
                    <div className="text-sm text-gray-300">{week.week}</div>
                    <div className="text-xs text-gray-400">{formatTime(week.timeSpent)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            
            {/* Learning Streak */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <Fire className="h-5 w-5 text-orange-400 mr-2" />
                Learning Streak
              </h3>
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-white mb-1">
                  {progressData.overview.currentStreak}
                </div>
                <div className="text-sm text-gray-400">days in a row</div>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {progressData.learningStreak.map((day, index) => (
                  <div
                    key={index}
                    className={`w-6 h-6 rounded ${
                      day.active ? 'bg-emerald-400' : 'bg-gray-700'
                    }`}
                    title={day.date}
                  />
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Achievements</h3>
                <Link to="/app/achievements" className="text-emerald-400 hover:text-emerald-300 text-sm">
                  View All
                </Link>
              </div>
              <div className="space-y-3">
                {progressData.achievements.slice(0, 4).map((achievement) => (
                  <div key={achievement.id} className={`p-3 rounded-lg border ${
                    achievement.earned 
                      ? 'bg-yellow-500/10 border-yellow-500/30' 
                      : 'bg-gray-700 border-gray-600'
                  }`}>
                    <div className="flex items-center">
                      <div className={`text-2xl mr-3 ${achievement.earned ? '' : 'grayscale opacity-50'}`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-medium text-sm ${
                          achievement.earned ? 'text-yellow-400' : 'text-gray-400'
                        }`}>
                          {achievement.title}
                        </h4>
                        <p className="text-xs text-gray-400">{achievement.description}</p>
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
                  </div>
                ))}
              </div>
            </div>

            {/* Level Progress */}
            <div className="bg-gradient-to-r from-emerald-600/20 to-blue-600/20 rounded-xl p-6 border border-emerald-500/30">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <Trophy className="h-5 w-5 text-yellow-400 mr-2" />
                Level Progress
              </h3>
              <div className="text-center mb-4">
                <div className="text-xl font-bold text-emerald-400 mb-1">
                  {progressData.overview.level}
                </div>
                <div className="text-sm text-gray-400">
                  {progressData.overview.totalPoints} / {progressData.overview.totalPoints + progressData.overview.nextLevelPoints} XP
                </div>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                <div 
                  className="bg-gradient-to-r from-emerald-400 to-blue-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(progressData.overview.totalPoints / (progressData.overview.totalPoints + progressData.overview.nextLevelPoints)) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 text-center">
                {progressData.overview.nextLevelPoints} XP to next level
              </p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-6">Recent Activity</h2>
          <div className="space-y-3">
            {progressData.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-gray-600 p-2 rounded-lg mr-4">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{activity.lessonTitle}</h3>
                    <p className="text-sm text-gray-400">
                      {new Date(activity.date).toLocaleDateString()} • {formatTime(activity.timeSpent)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-semibold ${getScoreColor(activity.score)}`}>
                    {activity.score}%
                  </div>
                  <div className="text-xs text-gray-400 capitalize">{activity.type}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;