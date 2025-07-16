// src/components/pages/Dashboard.tsx - Korrigierte Version
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  TrendingUp, 
  Award, 
  Clock, 
  Target, 
  Play,
  ChevronRight,
  Calendar,
  BarChart3
} from 'lucide-react';
import { useUser } from '../../context/UserContext';

interface DashboardData {
  overview: {
    totalLessons: number;
    completedLessons: number;
    completionRate: number;
    totalTimeSpent: number;
    currentStreak: number;
    longestStreak: number;
  };
  recentActivity: Array<{
    lessonTitle: string;
    completedAt: string;
    timeSpent: number;
    quizScore?: number;
    quizPassed?: boolean;
  }>;
  achievements: any[];
}

const Dashboard = () => {
  const { user } = useUser();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Fallback data for demo
      setDashboardData({
        overview: {
          totalLessons: 15,
          completedLessons: 3,
          completionRate: 20,
          totalTimeSpent: 180,
          currentStreak: 5,
          longestStreak: 12,
        },
        recentActivity: [],
        achievements: [],
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-neutral-600">Dashboard wird geladen...</span>
        </div>
      </div>
    );
  }

  const { overview } = dashboardData || {};

  return (
    <div className="min-h-screen bg-neutral-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900">
            Willkommen zurück, {user?.name}!
          </h1>
          <p className="text-neutral-600 mt-2">
            Hier ist Ihr Lernfortschritt und Ihre nächsten Schritte
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Lektionen</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {overview?.completedLessons || 0}/{overview?.totalLessons || 0}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 bg-neutral-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${overview?.completionRate || 0}%` }}
              />
            </div>
            <p className="text-sm text-neutral-600 mt-2">
              {overview?.completionRate || 0}% abgeschlossen
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Lernzeit</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {Math.round((overview?.totalTimeSpent || 0) / 60)}h
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="text-sm text-neutral-600 mt-2">
              Diese Woche
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Aktuelle Serie</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {overview?.currentStreak || 0}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <p className="text-sm text-neutral-600 mt-2">
              Tage in Folge
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Erfolge</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {dashboardData?.achievements.length || 0}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Award className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <p className="text-sm text-neutral-600 mt-2">
              Errungenschaften
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Next Lessons */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-neutral-900">Nächste Lektionen</h2>
              <Link 
                to="/app/course" 
                className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center"
              >
                Alle anzeigen <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            
            <div className="space-y-4">
              {/* Demo Lessons */}
              <div className="flex items-center p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
                <div className="bg-blue-600 p-2 rounded-lg mr-4">
                  <Play className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-neutral-900">Trading Grundlagen</h3>
                  <p className="text-sm text-neutral-600">15 Minuten • Anfänger</p>
                </div>
                <Link
                  to="/app/lesson/1"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Starten
                </Link>
              </div>

              <div className="flex items-center p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
                <div className="bg-neutral-400 p-2 rounded-lg mr-4">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-neutral-900">Marktanalyse</h3>
                  <p className="text-sm text-neutral-600">20 Minuten • Anfänger</p>
                </div>
                <Link
                  to="/app/lesson/2"
                  className="bg-neutral-600 text-white px-4 py-2 rounded-lg hover:bg-neutral-700 transition-colors"
                >
                  Starten
                </Link>
              </div>

              <div className="flex items-center p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
                <div className="bg-neutral-400 p-2 rounded-lg mr-4">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-neutral-900">Risikomanagement</h3>
                  <p className="text-sm text-neutral-600">25 Minuten • Intermediate</p>
                </div>
                <Link
                  to="/app/lesson/3"
                  className="bg-neutral-600 text-white px-4 py-2 rounded-lg hover:bg-neutral-700 transition-colors"
                >
                  Starten
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-neutral-900">Letzte Aktivität</h2>
              <Link 
                to="/app/progress" 
                className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center"
              >
                Fortschritt <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
              <p className="text-neutral-600">Noch keine Aktivität</p>
              <p className="text-sm text-neutral-500">Starten Sie Ihre erste Lektion!</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
          <h2 className="text-xl font-bold text-neutral-900 mb-6">Schnellzugriff</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/app/course"
              className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <BookOpen className="h-8 w-8 text-blue-600 mr-4" />
              <div>
                <h3 className="font-medium text-neutral-900">Alle Lektionen</h3>
                <p className="text-sm text-neutral-600">Kursübersicht</p>
              </div>
            </Link>
            
            <Link
              to="/app/progress"
              className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <BarChart3 className="h-8 w-8 text-green-600 mr-4" />
              <div>
                <h3 className="font-medium text-neutral-900">Fortschritt</h3>
                <p className="text-sm text-neutral-600">Statistiken</p>
              </div>
            </Link>
            
            <Link
              to="/app/achievements"
              className="flex items-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
            >
              <Award className="h-8 w-8 text-yellow-600 mr-4" />
              <div>
                <h3 className="font-medium text-neutral-900">Erfolge</h3>
                <p className="text-sm text-neutral-600">Achievements</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;