import React, { useState, useEffect } from 'react';
import { 
  Users, 
  BookOpen, 
  BarChart3, 
  Clock, 
  TrendingUp, 
  Activity,
  Database,
  Upload,
  Settings,
  Eye,
  CheckCircle,
  AlertTriangle,
  FileText,
  Zap
} from 'lucide-react';

// Admin Dashboard Hauptkomponente
const AdminDashboard = () => {
  const [stats, setStats] = useState({
    lessons: {
      total_lessons: 15,
      avg_duration: 23,
      beginner_count: 6,
      intermediate_count: 7,
      advanced_count: 2
    },
    slides: {
      total_slides: 342,
      quiz_slides: 45,
      avg_slide_duration: 3.2
    },
    users: {
      active_users: 128,
      total_progress_entries: 2847,
      completed_slides: 1923
    }
  });
  
  const [migrationStatus, setMigrationStatus] = useState({
    total: 15,
    migrated: 12,
    pending: 2,
    verified: 10,
    published: 8
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Lade Dashboard Stats (du musst die API Endpoints entsprechend anpassen)
      const statsResponse = await fetch('/api/admin/dashboard-stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      // Lade Migration Status
      const migrationResponse = await fetch('/api/admin/migration-status', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      if (migrationResponse.ok) {
        const migrationData = await migrationResponse.json();
        setMigrationStatus(migrationData);
      }

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateTo = (path) => {
    // In deiner echten App würdest du hier React Router verwenden
    window.location.href = path;
  };

  const QuickAction = ({ icon: Icon, title, description, linkTo, color = "blue" }) => (
    <div 
      onClick={() => navigateTo(linkTo)}
      className={`bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-${color}-500 transition-all group cursor-pointer`}
    >
      <div className="flex items-center mb-4">
        <div className={`bg-${color}-600 rounded-lg p-3 mr-4 group-hover:bg-${color}-500 transition-colors`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <p className="text-gray-400 text-sm">{description}</p>
        </div>
      </div>
    </div>
  );

  const StatCard = ({ icon: Icon, title, value, subtitle, color = "blue" }) => (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className={`bg-${color}-600 rounded-lg p-3`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="text-right">
          <div className={`text-2xl font-bold text-${color}-400`}>{value}</div>
          <div className="text-gray-400 text-sm">{title}</div>
        </div>
      </div>
      {subtitle && (
        <div className="text-gray-300 text-sm">{subtitle}</div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Lade Dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            🚀 Admin Dashboard
          </h1>
          <p className="text-gray-400 text-lg">
            Übersicht über deine Trading-Platform und Content-Management
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <QuickAction
            icon={Upload}
            title="Content Migration"
            description="Lesson-Dateien migrieren"
            linkTo="/admin/migration"
            color="green"
          />
          <QuickAction
            icon={BookOpen}
            title="Lesson Management"
            description="Lektionen verwalten"
            linkTo="/admin/lessons"
            color="blue"
          />
          <QuickAction
            icon={Users}
            title="User Management"
            description="Benutzer verwalten"
            linkTo="/admin/users"
            color="purple"
          />
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={BookOpen}
            title="Lektionen"
            value={stats.lessons.total_lessons}
            subtitle={`Ø ${Math.round(stats.lessons.avg_duration)} Minuten`}
            color="blue"
          />
          <StatCard
            icon={FileText}
            title="Slides"
            value={stats.slides.total_slides}
            subtitle={`${stats.slides.quiz_slides} Quiz-Slides`}
            color="green"
          />
          <StatCard
            icon={Users}
            title="Aktive User"
            value={stats.users.active_users}
            subtitle="Letzte 30 Tage"
            color="purple"
          />
          <StatCard
            icon={TrendingUp}
            title="Abgeschlossen"
            value={stats.users.completed_slides}
            subtitle="Slides completed"
            color="yellow"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          
          {/* Lesson Difficulty Distribution */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-6">📊 Lesson Verteilung</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded mr-3"></div>
                  <span className="text-gray-300">Beginner</span>
                </div>
                <div className="flex items-center">
                  <span className="text-white font-bold mr-2">{stats.lessons.beginner_count}</span>
                  <div className="w-24 h-2 bg-gray-700 rounded">
                    <div 
                      className="h-2 bg-green-500 rounded"
                      style={{ 
                        width: `${(stats.lessons.beginner_count / stats.lessons.total_lessons) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-yellow-500 rounded mr-3"></div>
                  <span className="text-gray-300">Intermediate</span>
                </div>
                <div className="flex items-center">
                  <span className="text-white font-bold mr-2">{stats.lessons.intermediate_count}</span>
                  <div className="w-24 h-2 bg-gray-700 rounded">
                    <div 
                      className="h-2 bg-yellow-500 rounded"
                      style={{ 
                        width: `${(stats.lessons.intermediate_count / stats.lessons.total_lessons) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-500 rounded mr-3"></div>
                  <span className="text-gray-300">Advanced</span>
                </div>
                <div className="flex items-center">
                  <span className="text-white font-bold mr-2">{stats.lessons.advanced_count}</span>
                  <div className="w-24 h-2 bg-gray-700 rounded">
                    <div 
                      className="h-2 bg-red-500 rounded"
                      style={{ 
                        width: `${(stats.lessons.advanced_count / stats.lessons.total_lessons) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Migration Status */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-6">🔄 Migration Status</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-600/20 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-blue-400">{migrationStatus.migrated}</div>
                <div className="text-blue-300 text-sm">Migriert</div>
              </div>
              <div className="bg-yellow-600/20 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-yellow-400">{migrationStatus.pending}</div>
                <div className="text-yellow-300 text-sm">Pending</div>
              </div>
              <div className="bg-green-600/20 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-green-400">{migrationStatus.verified}</div>
                <div className="text-green-300 text-sm">Verifiziert</div>
              </div>
              <div className="bg-purple-600/20 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-purple-400">{migrationStatus.published}</div>
                <div className="text-purple-300 text-sm">Published</div>
              </div>
            </div>

            {migrationStatus.total > 0 && (
              <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${(migrationStatus.migrated / migrationStatus.total) * 100}%` 
                  }}
                ></div>
              </div>
            )}
            <div className="text-center text-gray-400 text-sm">
              {Math.round((migrationStatus.migrated / migrationStatus.total) * 100)}% migriert
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-6">📈 Letzte Aktivitäten</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-700">
              <div className="flex items-center">
                <div className="bg-green-600 rounded-lg p-2 mr-4">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-white font-medium">Lesson "Trading Basics" migriert</div>
                  <div className="text-gray-400 text-sm">vor 2 Stunden</div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b border-gray-700">
              <div className="flex items-center">
                <div className="bg-blue-600 rounded-lg p-2 mr-4">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-white font-medium">12 neue User registriert</div>
                  <div className="text-gray-400 text-sm">heute</div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center">
                <div className="bg-purple-600 rounded-lg p-2 mr-4">
                  <BarChart3 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-white font-medium">Content-Analyse abgeschlossen</div>
                  <div className="text-gray-400 text-sm">vor 1 Tag</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl p-6 border border-blue-500/30">
          <h2 className="text-2xl font-bold text-white mb-4">🚀 Nächste Schritte</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigateTo('/admin/migration')}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors text-center font-medium"
            >
              Content Migration starten
            </button>
            <button
              onClick={() => navigateTo('/admin/lessons')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-center font-medium"
            >
              Lektionen verwalten
            </button>
            <button
              onClick={() => navigateTo('/app/lessons')}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors text-center font-medium"
            >
              Live-Lektionen ansehen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;