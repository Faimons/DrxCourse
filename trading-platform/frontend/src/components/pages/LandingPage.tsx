// src/components/pages/LandingPage.tsx - Trading Platform Startseite
import React from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, BookOpen, Award, Users, ArrowRight, Play } from 'lucide-react'

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
      
      {/* Navigation */}
      <nav className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-white" />
              <span className="ml-2 text-xl font-bold text-white">Trading Academy</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                to="/login" 
                className="text-white hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Anmelden
              </Link>
              <Link 
                to="/register" 
                className="bg-white text-blue-900 hover:bg-blue-50 px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Registrieren
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Lerne <span className="text-yellow-400">Trading</span>
            <br />wie ein Profi
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Von den Grundlagen bis zu fortgeschrittenen Strategien. 
            Unsere interaktive Lernplattform macht dich zum erfolgreichen Trader.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register" 
              className="bg-yellow-400 text-blue-900 hover:bg-yellow-300 px-8 py-3 rounded-lg text-lg font-medium transition-all duration-200 flex items-center justify-center"
            >
              <Play className="h-5 w-5 mr-2" />
              Jetzt kostenlos starten
            </Link>
            <Link 
              to="/login" 
              className="bg-white/10 text-white hover:bg-white/20 px-8 py-3 rounded-lg text-lg font-medium transition-all duration-200 backdrop-blur-sm border border-white/20"
            >
              Demo Login
            </Link>
          </div>

          {/* Demo Login Info */}
          <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-lg p-4 max-w-md mx-auto border border-white/20">
            <p className="text-blue-100 text-sm mb-2">🎯 Demo Login:</p>
            <p className="text-white text-sm">
              <strong>admin@tradingplatform.com</strong> / <strong>admin123!</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <BookOpen className="h-12 w-12 text-yellow-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">15 Interaktive Lektionen</h3>
            <p className="text-blue-100">
              Von Grundlagen bis Profi-Strategien. Schritt für Schritt zum Trading-Experten.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <Award className="h-12 w-12 text-yellow-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Achievements & Fortschritt</h3>
            <p className="text-blue-100">
              Sammle Punkte, verdiene Badges und verfolge deinen Lernfortschritt in Echtzeit.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <Users className="h-12 w-12 text-yellow-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Community & Support</h3>
            <p className="text-blue-100">
              Lerne mit anderen, teile Erfahrungen und erhalte Unterstützung von Experten.
            </p>
          </div>

        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white/5 backdrop-blur-sm border-t border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Bereit für deine Trading-Reise?
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Starte jetzt und werde Teil der Trading Academy Community!
          </p>
          <Link 
            to="/register" 
            className="bg-yellow-400 text-blue-900 hover:bg-yellow-300 px-8 py-3 rounded-lg text-lg font-medium transition-all duration-200 inline-flex items-center"
          >
            Kostenlos registrieren
            <ArrowRight className="h-5 w-5 ml-2" />
          </Link>
        </div>
      </div>

    </div>
  )
}

export default LandingPage