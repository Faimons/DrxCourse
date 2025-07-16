import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

// Simple Components
const LandingPage = () => (
  <div className="min-h-screen bg-blue-900 flex items-center justify-center text-white">
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">🚀 Trading Academy</h1>
      <p className="mb-8">Professionell Trading lernen</p>
      <div className="space-x-4">
        <a href="/login" className="bg-yellow-400 text-blue-900 px-6 py-2 rounded-lg font-medium">
          Zum Login
        </a>
        <a href="/register" className="bg-white/20 text-white px-6 py-2 rounded-lg">
          Registrieren
        </a>
      </div>
    </div>
  </div>
)

const Dashboard = () => (
  <div className="min-h-screen bg-gray-50 p-8">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🎯 Trading Platform Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-bold text-green-600">Lektionen</h3>
          <p className="text-2xl">3/15</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-bold text-blue-600">Lernzeit</h3>
          <p className="text-2xl">5h</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-bold text-yellow-600">Punkte</h3>
          <p className="text-2xl">2,450</p>
        </div>
      </div>
      <div className="mt-8">
        <button 
          onClick={() => {localStorage.removeItem('accessToken'); window.location.href = '/login'}}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  </div>
)

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={
        <div className="min-h-screen bg-blue-900 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Trading Platform Login</h2>
            <button 
              onClick={() => {localStorage.setItem('accessToken', 'demo'); window.location.href = '/app/dashboard'}}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              🎯 Demo Login (admin@tradingplatform.com)
            </button>
            <div className="mt-4 text-center">
              <a href="/register" className="text-blue-600">Registrieren</a>
            </div>
          </div>
        </div>
      } />
      <Route path="/register" element={<div className="p-8 text-center"><h1>Registrierung</h1><a href="/login">Zum Login</a></div>} />
      <Route path="/app/dashboard" element={
        localStorage.getItem('accessToken') ? <Dashboard /> : <Navigate to="/login" />
      } />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default App