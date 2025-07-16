// ===================================
// 3. trading-platform/frontend/src/components/admin/LessonManagement.tsx
// ===================================
import React, { useState, useEffect } from 'react';
import { BookOpen, Eye, Edit, Trash2, Plus, Filter } from 'lucide-react';
import { lessonService, DynamicLesson } from '../../services/lessonService';

const LessonManagement = () => {
  const [lessons, setLessons] = useState<DynamicLesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);

  useEffect(() => {
    loadLessons();
  }, []);

  const loadLessons = async () => {
    try {
      setLoading(true);
      const { lessons: data } = await lessonService.getAllLessons();
      setLessons(data);
    } catch (error) {
      console.error('Error loading lessons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm('Wirklich löschen?')) return;
    
    try {
      await lessonService.deleteLesson(lessonId);
      setLessons(prev => prev.filter(l => l.id !== lessonId));
    } catch (error) {
      console.error('Error deleting lesson:', error);
    }
  };

  const navigateToLesson = (lessonId: string) => {
    window.location.href = `/app/lessons/${lessonId}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Lade Lektionen...</p>
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
          <h1 className="text-4xl font-bold text-white mb-2">🎓 Lesson Management</h1>
          <p className="text-gray-400 text-lg">Verwalte alle migrierten Lektionen</p>
        </div>

        {/* Actions */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.location.href = '/admin/migration'}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Neue Lektionen migrieren
              </button>
            </div>
            <div className="text-gray-400">
              {lessons.length} Lektionen verwaltet
            </div>
          </div>
        </div>

        {/* Lessons Table */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="text-left p-4 text-gray-300 font-medium">Lektion</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Schwierigkeit</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Slides</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Dauer</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Features</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Aktionen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {lessons.map((lesson) => (
                  <tr key={lesson.id} className="hover:bg-gray-700/50 transition-colors">
                    <td className="p-4">
                      <div>
                        <div className="font-bold text-white">{lesson.title}</div>
                        <div className="text-gray-400 text-sm">{lesson.subtitle}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        lesson.difficulty === 'Beginner' ? 'bg-green-600 text-green-100' :
                        lesson.difficulty === 'Intermediate' ? 'bg-yellow-600 text-yellow-100' :
                        'bg-red-600 text-red-100'
                      }`}>
                        {lesson.difficulty}
                      </span>
                    </td>
                    <td className="p-4 text-gray-300">{lesson.slides.length}</td>
                    <td className="p-4 text-gray-300">{lesson.estimatedTime} Min</td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        {lesson.slides.some(s => s.interactiveComponents.hasTTS) && 
                          <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">TTS</span>}
                        {lesson.slides.some(s => s.interactiveComponents.hasCharts) && 
                          <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">Charts</span>}
                        {lesson.slides.some(s => s.interactiveComponents.hasQuiz) && 
                          <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs">Quiz</span>}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigateToLesson(lesson.id)}
                          className="p-2 bg-blue-600 rounded hover:bg-blue-700 transition-colors"
                          title="Lektion ansehen"
                        >
                          <Eye className="w-4 h-4 text-white" />
                        </button>
                        <button
                          onClick={() => handleDeleteLesson(lesson.id)}
                          className="p-2 bg-red-600 rounded hover:bg-red-700 transition-colors"
                          title="Lektion löschen"
                        >
                          <Trash2 className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {lessons.length === 0 && (
          <div className="bg-gray-800 rounded-xl p-12 text-center border border-gray-700">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Keine Lektionen verfügbar</h3>
            <p className="text-gray-400 mb-6">Migriere deine ersten Lektionen um zu starten</p>
            <button
              onClick={() => window.location.href = '/admin/migration'}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Jetzt migrieren
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonManagement;