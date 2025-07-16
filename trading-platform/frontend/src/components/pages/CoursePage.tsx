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


