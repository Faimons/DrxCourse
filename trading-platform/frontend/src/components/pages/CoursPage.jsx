// src/components/pages/CoursePage.jsx - Course Overview Stub
import React from 'react'
import { BookOpen, Clock, Users, Star } from 'lucide-react'

export default function CoursePage() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Trading Masterclass</h1>
        <p className="text-lg text-gray-600">Kompletter Kurs von Grundlagen bis Profi-Strategien</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <BookOpen className="h-8 w-8 text-blue-600 mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">15 Lektionen</h3>
          <p className="text-gray-600">Strukturierter Lernpfad vom Anfänger zum Profi</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <Clock className="h-8 w-8 text-green-600 mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">~8 Stunden</h3>
          <p className="text-gray-600">Gesamte Kursdauer mit praktischen Übungen</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <Star className="h-8 w-8 text-yellow-600 mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">4.9/5 Sterne</h3>
          <p className="text-gray-600">Basierend auf 1,247 Bewertungen</p>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <h2 className="text-xl font-semibold text-yellow-800 mb-2">🚧 Course Overview - In Entwicklung</h2>
        <p className="text-yellow-700">Diese Seite wird bald verfügbar sein mit allen Lektionen und Modulen.</p>
      </div>
    </div>
  )
}

// src/components/pages/LessonPage.jsx - Individual Lesson Stub  
import React from 'react'
import { useParams } from 'react-router-dom'
import { PlayCircle, BookOpen, MessageSquare } from 'lucide-react'

export function LessonPage() {
  const { lessonId } = useParams()

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Lektion {lessonId}</h1>
        <p className="text-lg text-gray-600">Einzelne Lektion wird hier angezeigt</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-6">
              <PlayCircle className="h-16 w-16 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold mb-4">Lesson Content</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">🚧 LessonMaster Component</h3>
              <p className="text-blue-700">Hier kommt das LessonMaster Template hin mit Slides, Navigation und Progress.</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="font-semibold mb-4 flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              Notizen
            </h3>
            <p className="text-gray-600 text-sm">Hier können Sie Ihre Notizen zu dieser Lektion verwalten.</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="font-semibold mb-4 flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Diskussion
            </h3>
            <p className="text-gray-600 text-sm">Tauschen Sie sich mit anderen Lernenden aus.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// src/components/pages/Progress.jsx - Progress Dashboard Stub
import React from 'react'
import { TrendingUp, Target, Trophy, Calendar } from 'lucide-react'

export function Progress() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Ihr Lernfortschritt</h1>
        <p className="text-lg text-gray-600">Detaillierte Übersicht über Ihre Trading-Ausbildung</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Abgeschlossen</p>
              <p className="text-2xl font-bold text-green-600">8/15</p>
            </div>
            <Target className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Lernstreak</p>
              <p className="text-2xl font-bold text-blue-600">5 Tage</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Punkte</p>
              <p className="text-2xl font-bold text-purple-600">2,450</p>
            </div>
            <Trophy className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Lernzeit</p>
              <p className="text-2xl font-bold text-orange-600">24h</p>
            </div>
            <Calendar className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 text-center">
        <h2 className="text-xl font-semibold text-purple-800 mb-2">📊 Progress Analytics - Coming Soon</h2>
        <p className="text-purple-700">Detaillierte Charts und Analytics für Ihren Lernfortschritt werden hier angezeigt.</p>
      </div>
    </div>
  )
}

// WICHTIG: Export all components at the end for easy importing
export { CoursePage, LessonPage, Progress }