// src/components/auth/Register.jsx - User Registration
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../../context/UserContext'
import { 
  TrendingUp, 
  Mail, 
  Lock, 
  User as UserIcon, 
  Eye, 
  EyeOff,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  
  const { register, authenticated } = useUser()
  const navigate = useNavigate()

  // Redirect if already authenticated
  useEffect(() => {
    if (authenticated) {
      navigate('/app/dashboard')
    }
  }, [authenticated, navigate])

  // Password strength checker
  const getPasswordStrength = (password) => {
    let score = 0
    if (password.length >= 8) score++
    if (/[a-z]/.test(password)) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    
    return { score, percentage: (score / 5) * 100 }
  }

  const passwordStrength = getPasswordStrength(formData.password)

  // Form validation
  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name ist erforderlich'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-Mail ist erforderlich'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Ungültige E-Mail-Adresse'
    }

    if (!formData.password) {
      newErrors.password = 'Passwort ist erforderlich'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Passwort muss mindestens 8 Zeichen lang sein'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwörter stimmen nicht überein'
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Sie müssen den Nutzungsbedingungen zustimmen'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      })
      
      // Registration successful - redirect will happen via useEffect
      console.log('✅ Registration successful')
      
    } catch (error) {
      setErrors({ 
        submit: error.message || 'Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.' 
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="flex items-center">
            <TrendingUp className="h-12 w-12 text-blue-600" />
            <span className="ml-2 text-2xl font-bold text-gray-900">
              Trading Academy
            </span>
          </div>
        </div>

        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Kostenloses Konto erstellen
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Oder{' '}
          <Link 
            to="/login" 
            className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
          >
            melden Sie sich in Ihr bestehendes Konto an
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          
          {/* Registration Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Global Error */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{errors.submit}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Name Field */}
            <div>
              <label htmlFor="name" className="form-label">
                Vollständiger Name
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={`form-input pl-10 ${errors.name ? 'border-red-300 focus:ring-red-500' : ''}`}
                  placeholder="Max Mustermann"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="form-label">
                E-Mail-Adresse
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`form-input pl-10 ${errors.email ? 'border-red-300 focus:ring-red-500' : ''}`}
                  placeholder="max@beispiel.de"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="form-label">
                Passwort
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`form-input pl-10 pr-10 ${errors.password ? 'border-red-300 focus:ring-red-500' : ''}`}
                  placeholder="Mindestens 8 Zeichen"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                  )}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          passwordStrength.score < 2 ? 'bg-red-500' :
                          passwordStrength.score < 4 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${passwordStrength.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600">
                      {passwordStrength.score < 2 ? 'Schwach' :
                       passwordStrength.score < 4 ? 'Mittel' : 'Stark'}
                    </span>
                  </div>
                </div>
              )}
              
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="form-label">
                Passwort bestätigen
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`form-input pl-10 pr-10 ${errors.confirmPassword ? 'border-red-300 focus:ring-red-500' : ''}`}
                  placeholder="Passwort wiederholen"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms Checkbox */}
            <div>
              <div className="flex items-center">
                <input
                  id="acceptTerms"
                  name="acceptTerms"
                  type="checkbox"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-900">
                  Ich akzeptiere die{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-500">
                    Nutzungsbedingungen
                  </a>{' '}
                  und{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-500">
                    Datenschutzerklärung
                  </a>
                </label>
              </div>
              {errors.acceptTerms && (
                <p className="mt-1 text-sm text-red-600">{errors.acceptTerms}</p>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <div className="spinner mr-2"></div>
                    Registrierung läuft...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Kostenloses Konto erstellen
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Additional Info */}
          <div className="mt-6 border-t border-gray-200 pt-6">
            <div className="text-center">
              <p className="text-xs text-gray-500">
                Mit der Registrierung erhalten Sie sofort Zugang zu allen 15 Trading-Lektionen.
                100% kostenlos, keine versteckten Kosten.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}