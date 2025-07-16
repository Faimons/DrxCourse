// C:\Users\DRX_SIMON\Drx-cours2.0\trading-platform\frontend\src\components\pages\LandingPage.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  BookOpen, 
  Award, 
  Users, 
  ArrowRight, 
  Play,
  CheckCircle,
  Star,
  BarChart3,
  Target,
  Clock,
  Shield,
  Zap,
  Globe,
  Menu,
  X
} from 'lucide-react';

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: BookOpen,
      title: '24 Interactive Lessons',
      description: 'From basics to advanced strategies. Learn step-by-step with real examples.',
      color: 'text-blue-400'
    },
    {
      icon: BarChart3,
      title: 'Real Market Analysis',
      description: 'Practice with live charts and real market data from TradingView.',
      color: 'text-emerald-400'
    },
    {
      icon: Award,
      title: 'Certificates & Achievements',
      description: 'Earn certificates and track your progress with our achievement system.',
      color: 'text-yellow-400'
    },
    {
      icon: Users,
      title: 'Expert Community',
      description: 'Join thousands of traders and learn from experienced professionals.',
      color: 'text-purple-400'
    },
    {
      icon: Target,
      title: 'Risk Management',
      description: 'Master the most important skill - protecting your capital.',
      color: 'text-red-400'
    },
    {
      icon: Zap,
      title: 'Live Trading Tools',
      description: 'Access to MT5, TradingView and professional trading platforms.',
      color: 'text-orange-400'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Day Trader',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
      rating: 5,
      text: 'This academy transformed my trading. From losing money to consistent profits in 3 months!'
    },
    {
      name: 'Michael Chen',
      role: 'Swing Trader',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michael',
      rating: 5,
      text: 'The risk management module alone paid for the entire course. Highly recommended!'
    },
    {
      name: 'Emma Rodriguez',
      role: 'Forex Trader',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma',
      rating: 5,
      text: 'Professional, practical, and profitable. Everything you need to become a successful trader.'
    }
  ];

  const pricingPlans = [
    {
      name: 'Basic',
      price: 'Free',
      description: 'Get started with trading basics',
      features: [
        '5 Free Lessons',
        'Basic Charts Access',
        'Community Forum',
        'Email Support'
      ],
      buttonText: 'Start Free',
      buttonClass: 'bg-gray-700 hover:bg-gray-600',
      popular: false
    },
    {
      name: 'Pro Trader',
      price: '$97',
      period: '/month',
      description: 'Complete trading education',
      features: [
        'All 24 Lessons',
        'Live Trading Signals',
        'Advanced Analytics',
        'MT5 & TradingView Access',
        '1-on-1 Mentoring',
        'Priority Support'
      ],
      buttonText: 'Start Learning',
      buttonClass: 'bg-emerald-600 hover:bg-emerald-700',
      popular: true
    },
    {
      name: 'VIP Masterclass',
      price: '$297',
      period: '/month',
      description: 'Elite trader program',
      features: [
        'Everything in Pro',
        'Personal Trading Coach',
        'Live Trading Room',
        'Advanced Strategies',
        'Portfolio Review',
        'Lifetime Access'
      ],
      buttonText: 'Go VIP',
      buttonClass: 'bg-yellow-600 hover:bg-yellow-700',
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      
      {/* Navigation */}
      <nav className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-emerald-400" />
              <span className="ml-2 text-xl font-bold text-white">Trading Academy</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">Reviews</a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
              <Link 
                to="/login" 
                className="text-gray-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link 
                to="/register" 
                className="bg-emerald-600 text-white hover:bg-emerald-700 px-4 py-2 rounded-lg transition-colors"
              >
                Start Free
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-300 hover:text-white"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-800 border-t border-gray-700">
                <a href="#features" className="block px-3 py-2 text-gray-300 hover:text-white">Features</a>
                <a href="#testimonials" className="block px-3 py-2 text-gray-300 hover:text-white">Reviews</a>
                <a href="#pricing" className="block px-3 py-2 text-gray-300 hover:text-white">Pricing</a>
                <Link to="/login" className="block px-3 py-2 text-gray-300 hover:text-white">Sign In</Link>
                <Link to="/register" className="block px-3 py-2 bg-emerald-600 text-white rounded-lg mt-2">Start Free</Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Master <span className="text-emerald-400">Trading</span>
              <br />Like a Pro
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              From zero to profitable trader in 90 days. Learn the strategies that actually work with our 
              step-by-step trading academy.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link 
                to="/register" 
                className="bg-emerald-600 text-white hover:bg-emerald-700 px-8 py-4 rounded-lg text-lg font-medium transition-all duration-200 flex items-center justify-center transform hover:scale-105"
              >
                <Play className="h-5 w-5 mr-2" />
                Start Free Trial
              </Link>
              <Link 
                to="/login" 
                className="bg-gray-800 text-white hover:bg-gray-700 px-8 py-4 rounded-lg text-lg font-medium transition-all duration-200 border border-gray-700 hover:border-gray-600"
              >
                Watch Demo
              </Link>
            </div>

            {/* Demo Login Info */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 max-w-md mx-auto border border-gray-700">
              <p className="text-gray-300 text-sm mb-3">🎯 Try Demo Account:</p>
              <div className="space-y-1 text-sm">
                <p className="text-emerald-400">
                  <strong>admin@tradingplatform.com</strong> / <strong>admin123!</strong>
                </p>
                <p className="text-blue-400">
                  <strong>student@example.com</strong> / <strong>student123!</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Professional trading education with real-world tools and strategies used by successful traders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors">
                  <div className={`inline-flex p-3 rounded-lg bg-gray-700 mb-4`}>
                    <Icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-emerald-400 mb-2">10,000+</div>
              <div className="text-gray-300">Students Trained</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">85%</div>
              <div className="text-gray-300">Success Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-400 mb-2">24</div>
              <div className="text-gray-300">Expert Lessons</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">24/7</div>
              <div className="text-gray-300">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              What Our Students Say
            </h2>
            <p className="text-xl text-gray-300">
              Join thousands of successful traders who started their journey here.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-white">{testimonial.name}</h4>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300">{testimonial.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Choose Your Learning Path
            </h2>
            <p className="text-xl text-gray-300">
              Start free or unlock the full potential with our professional courses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`bg-gray-800 rounded-xl p-8 border transition-all duration-200 hover:scale-105 ${
                plan.popular ? 'border-emerald-500 ring-2 ring-emerald-500' : 'border-gray-700'
              }`}>
                {plan.popular && (
                  <div className="text-center mb-4">
                    <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold text-white mb-2">
                    {plan.price}
                    {plan.period && <span className="text-lg text-gray-400">{plan.period}</span>}
                  </div>
                  <p className="text-gray-300">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-300">
                      <CheckCircle className="h-5 w-5 text-emerald-400 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  to="/register"
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors text-center block ${plan.buttonClass}`}
                >
                  {plan.buttonText}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-emerald-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Your Trading?
          </h2>
          <p className="text-xl text-white mb-8 opacity-90">
            Join over 10,000 successful traders who started their journey with us. 
            Begin with our free trial today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register" 
              className="bg-white text-emerald-600 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-medium transition-all duration-200 inline-flex items-center justify-center"
            >
              Start Free Trial
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
            <Link 
              to="/login" 
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-emerald-600 px-8 py-4 rounded-lg text-lg font-medium transition-all duration-200"
            >
              Try Demo Account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <TrendingUp className="h-8 w-8 text-emerald-400" />
                <span className="ml-2 text-xl font-bold text-white">Trading Academy</span>
              </div>
              <p className="text-gray-300">
                Professional trading education for the next generation of successful traders.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Platform</h4>
              <div className="space-y-2">
                <a href="#" className="block text-gray-300 hover:text-white">Courses</a>
                <a href="#" className="block text-gray-300 hover:text-white">Trading Tools</a>
                <a href="#" className="block text-gray-300 hover:text-white">Community</a>
                <a href="#" className="block text-gray-300 hover:text-white">Support</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <div className="space-y-2">
                <a href="#" className="block text-gray-300 hover:text-white">About</a>
                <a href="#" className="block text-gray-300 hover:text-white">Blog</a>
                <a href="#" className="block text-gray-300 hover:text-white">Careers</a>
                <a href="#" className="block text-gray-300 hover:text-white">Contact</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <div className="space-y-2">
                <a href="#" className="block text-gray-300 hover:text-white">Privacy Policy</a>
                <a href="#" className="block text-gray-300 hover:text-white">Terms of Service</a>
                <a href="#" className="block text-gray-300 hover:text-white">Risk Disclosure</a>
                <a href="#" className="block text-gray-300 hover:text-white">Refund Policy</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 Trading Academy. All rights reserved. 
              <span className="text-yellow-400 ml-2">⚠️ Trading involves risk of loss.</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;