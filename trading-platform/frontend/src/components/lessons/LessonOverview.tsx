// ===================================
// 2. trading-platform/frontend/src/components/lessons/LessonOverview.tsx
// ===================================
import React, { useState, useEffect } from 'react';
import { BookOpen, Clock, Users, Star, ChevronRight } from 'lucide-react';
import { lessonService, DynamicLesson } from '../../services/lessonService';

const LessonOverview = () => {
  const [lessons, setLessons] = useState<DynamicLesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    difficulty: '',
    module: ''
  });

  useEffect(() => {
    loadLessons();
  }, [filter]);

  const loadLessons = async () => {
    try {
      setLoading(true);
      const { lessons: data } = await lessonService.getAllLessons(filter);
      setLessons(data);
    } catch (error) {
      console.error('Error loading lessons:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateToLesson = (lessonId: string) => {
    window.location.href = `/app/lessons/${lessonId}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500';
      case 'Intermediate': return 'bg-yellow-500';
      case 'Advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-6xl mx-auto">
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
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">📚 Trading Lektionen</h1>
          <p className="text-gray-400 text-lg">Migrierte Lektionen aus dem neuen System</p>
        </div>

        {/* Filters */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={filter.difficulty}
              onChange={(e) => setFilter(prev => ({ ...prev, difficulty: e.target.value }))}
              className="bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600"
            >
              <option value="">Alle Schwierigkeiten</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
            
            <select
              value={filter.module}
              onChange={(e) => setFilter(prev => ({ ...prev, module: e.target.value }))}
              className="bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600"
            >
              <option value="">Alle Module</option>
              <option value="Trading Masterclass">Trading Masterclass</option>
              <option value="Advanced Strategies">Advanced Strategies</option>
            </select>

            <div className="text-gray-400 flex items-center">
              {lessons.length} Lektionen verfügbar
            </div>
          </div>
        </div>

        {/* Lessons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              onClick={() => navigateToLesson(lesson.id)}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${getDifficultyColor(lesson.difficulty)} px-3 py-1 rounded-full text-white text-sm font-medium`}>
                  {lesson.difficulty}
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
              </div>

              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                {lesson.title}
              </h3>
              
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                {lesson.subtitle}
              </p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center text-gray-300">
                  <BookOpen className="w-4 h-4 mr-2 text-blue-400" />
                  {lesson.slides.length} Slides
                </div>
                <div className="flex items-center text-gray-300">
                  <Clock className="w-4 h-4 mr-2 text-green-400" />
                  {lesson.estimatedTime} Min
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="text-xs text-gray-400 mb-2">Features:</div>
                <div className="flex flex-wrap gap-1">
                  {lesson.slides.some(s => s.interactiveComponents.hasTTS) && 
                    <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">🎵 TTS</span>}
                  {lesson.slides.some(s => s.interactiveComponents.hasCharts) && 
                    <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">📊 Charts</span>}
                  {lesson.slides.some(s => s.interactiveComponents.hasQuiz) && 
                    <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs">❓ Quiz</span>}
                </div>
              </div>
            </div>
          ))}
        </div>

        {lessons.length === 0 && (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Keine Lektionen gefunden</h3>
            <p className="text-gray-400 mb-6">Keine Lektionen entsprechen deinen Filterkriterien</p>
            <button
              onClick={() => setFilter({ difficulty: '', module: '' })}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Filter zurücksetzen
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonOverview;