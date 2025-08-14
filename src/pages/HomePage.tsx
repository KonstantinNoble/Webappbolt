import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  BookOpen, 
  HelpCircle, 
  Zap, 
  TrendingUp,
  ArrowRight,
  Star,
  CheckCircle,
  Target
} from 'lucide-react';

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-dark-bg-primary">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-overlay" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="text-center">
            <div className="flex justify-center mb-8 sm:mb-12">
              <div className="relative p-6 sm:p-8 rounded-full bg-dark-bg-card shadow-professional shadow-glow-cyan border-2 border-cyan-400/40">
                {/* Outer glow effect */}
                <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-cyan-400/30 via-purple-400/30 to-pink-400/30 blur-xl"></div>
                
                {/* Minimalist QuotaSkill Hero Magnifying Glass */}
                <div className="relative w-12 h-12 sm:w-16 sm:h-16">
                  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
                    {/* Main Glass Circle - Minimalist with website gradient */}
                    <circle cx="40" cy="40" r="28" fill="none" stroke="url(#heroGlassGradient)" strokeWidth="5"/>
                    <circle cx="40" cy="40" r="24" fill="rgba(6,182,212,0.1)" stroke="url(#innerGlassGradient)" strokeWidth="2"/>
                    
                    {/* Minimalist reflection */}
                    <ellipse cx="32" cy="30" rx="6" ry="10" fill="rgba(6,182,212,0.3)" transform="rotate(-25 32 30)"/>
                    
                    {/* QuotaSkill "Q" - Clean and bold */}
                    <circle cx="40" cy="40" r="16" fill="none" stroke="#06B6D4" strokeWidth="4"/>
                    <path d="M 40 24 A 16 16 0 1 1 40 56" fill="none" stroke="#06B6D4" strokeWidth="4"/>
                    <line x1="52" y1="52" x2="58" y2="58" stroke="#06B6D4" strokeWidth="4" strokeLinecap="round"/>
                    
                    {/* Center focus dot - glowing */}
                    <circle cx="40" cy="40" r="3" fill="#06B6D4">
                      <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite"/>
                    </circle>
                    
                    {/* Skill indicator dots - minimalist */}
                    <circle cx="28" cy="28" r="2" fill="#06B6D4" opacity="0.8">
                      <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="52" cy="28" r="2" fill="#8B5CF6" opacity="0.8">
                      <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="28" cy="52" r="2" fill="#EC4899" opacity="0.8">
                      <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" begin="0.5s"/>
                    </circle>
                    <circle cx="52" cy="52" r="2" fill="#10B981" opacity="0.8">
                      <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" begin="1s"/>
                    </circle>
                    
                    {/* Minimalist Handle - Gradient */}
                    <line x1="63" y1="63" x2="88" y2="88" stroke="url(#heroHandleGradient)" strokeWidth="8" strokeLinecap="round"/>
                    
                    {/* Simple grip indicator */}
                    <circle cx="80" cy="80" r="3" fill="#6B7280" opacity="0.8"/>
                    
                    {/* Gradients */}
                    <defs>
                      <linearGradient id="heroGlassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#06B6D4" />
                        <stop offset="50%" stopColor="#8B5CF6" />
                        <stop offset="100%" stopColor="#EC4899" />
                      </linearGradient>
                      <linearGradient id="innerGlassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.3" />
                      </linearGradient>
                      <linearGradient id="heroHandleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#374151" />
                        <stop offset="100%" stopColor="#6B7280" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 sm:mb-8 tracking-tight leading-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Master Any Skill
              </span>
              <br />
              <span className="text-text-primary">With AI Power</span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-text-secondary mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed font-medium px-4">
              Generate personalized learning plans and test your knowledge with AI-powered quizzes. 
              Transform your learning journey with cutting-edge technology.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
              {user ? (
                <Link 
                  to="/dashboard"
                  className="btn-primary text-lg px-8 py-4 rounded-xl"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <span>Go to Dashboard</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              ) : (
                <div className="flex flex-col items-center space-y-4">
                  {/* Primary CTA - Register */}
                  <Link 
                    to="/register"
                    className="group relative px-8 sm:px-12 py-4 sm:py-5 bg-gradient-to-r from-green-500 via-cyan-500 to-blue-500 hover:from-green-400 hover:via-cyan-400 hover:to-blue-400 rounded-2xl font-black text-lg sm:text-xl transition-all duration-300 transform hover:scale-105 shadow-professional hover:shadow-glow-green"
                  >
                    {/* Glow effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-green-400 via-cyan-400 to-blue-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
                    <div className="relative flex items-center justify-center space-x-3">
                      <span className="text-2xl">🚀</span>
                      <span>Start Your FREE Journey</span>
                      <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                    </div>
                  </Link>
                  
                  {/* Benefits highlight */}
                  <div className="text-center card-professional border-green-400/40 max-w-md mx-4">
                    <p className="text-green-300 font-bold text-base sm:text-lg mb-1">
                      ✨ Includes 300 FREE Monthly Credits
                    </p>
                    <p className="text-cyan-300 text-xs sm:text-sm font-medium">
                      No credit card required • Start learning immediately • Full access to all features
                    </p>
                  </div>
                  
                  {/* Secondary CTA - Explore */}
                  <div className="flex flex-col sm:flex-row gap-3 items-center mt-4">
                    <span className="flex items-center justify-center space-x-2">
                      <span className="text-text-muted text-sm">or</span>
                    </span>
                    <Link 
                      to="/learning-plans"
                      className="btn-secondary text-sm sm:text-base"
                    >
                      <span className="flex items-center justify-center space-x-2">
                        <span>👀 Explore Features First</span>
                      </span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Images Section */}
      <section className="py-12 sm:py-16 bg-dark-bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-text-primary mb-4 tracking-tight">
              Powered by
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent block sm:inline"> AI Technology</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-text-secondary max-w-2xl mx-auto font-medium px-4">
              Experience the future of learning with our advanced AI-powered platform
            </p>
          </div>
          
          {/* Images Grid */}
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {/* AI Learning Book */}
            <div className="card-professional border-cyan-400/40 overflow-hidden hover:shadow-glow-cyan group">
              <div className="relative">
                <img 
                  src="/Lucid_Origin_A_dazzlingly_sleek_hightech_book_stands_in_a_futu_3 copy.jpg"
                  alt="Futuristic AI-powered learning book with holographic displays"
                  className="w-full h-48 sm:h-64 md:h-80 object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4 sm:p-6 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 border-t border-cyan-400/20">
                <h3 className="text-lg sm:text-xl font-bold text-cyan-400 mb-3 flex items-center space-x-2">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                  <span>Interactive Learning</span>
                </h3>
                <p className="text-text-secondary leading-relaxed text-sm sm:text-base">Advanced AI creates personalized learning experiences with cutting-edge technology</p>
              </div>
            </div>

            {/* AI Computer Setup */}
            <div className="card-professional border-purple-400/40 overflow-hidden hover:shadow-glow-purple group">
              <div className="relative">
                <img 
                  src="/Lucid_Realism_A_futuristic_computer_stands_out_against_the_bac_0 copy.jpg"
                  alt="Futuristic computer setup with AI-powered learning interface"
                  className="w-full h-48 sm:h-64 md:h-80 object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4 sm:p-6 bg-gradient-to-r from-purple-500/5 to-pink-500/5 border-t border-purple-400/20">
                <h3 className="text-lg sm:text-xl font-bold text-purple-400 mb-3 flex items-center space-x-2">
                  <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                  <span>Smart Technology</span>
                </h3>
                <p className="text-text-secondary leading-relaxed text-sm sm:text-base">State-of-the-art AI systems power your learning journey with intelligent insights</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Tiers */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-text-primary mb-4 sm:mb-6 tracking-tight">
              {user ? 'Choose Your' : 'Unlock Premium'}
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent block sm:inline"> Learning Tier</span>
            </h2>
            {user ? (
              <p className="text-lg sm:text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto font-medium px-4">
                Two quality levels to match your learning needs and budget
              </p>
            ) : (
              <div className="max-w-4xl mx-auto">
                <p className="text-lg sm:text-xl md:text-2xl text-text-secondary font-medium mb-4 px-4">
                  Two quality levels to match your learning needs and budget
                </p>
                <div className="card-professional border-yellow-400/40 mx-4">
                  <p className="text-yellow-300 font-bold text-base sm:text-lg mb-2">
                    🎁 Sign up now and get instant access to both tiers!
                  </p>
                  <p className="text-orange-300 font-medium text-sm sm:text-base">
                    Your 300 free monthly credits are enough for multiple learning plans and quizzes
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
            {/* Basic Tier (formerly Advanced) */}
            <Link 
              to={user ? "/learning-plans" : "/register"}
              className="group card-professional hover:border-green-400/50 hover:shadow-glow-green block overflow-hidden mx-4 md:mx-0"
            >
              {!user && (
                <div className="absolute top-3 right-3 z-10">
                  <span className="px-3 py-1 bg-green-400/20 text-green-400 text-xs font-bold rounded-full border border-green-400/40">
                    🔓 FREE ACCESS
                  </span>
                </div>
              )}
              <div className="text-center mb-4 sm:mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-text-primary mb-3">Basic</h3>
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <span className="text-2xl sm:text-3xl font-bold text-green-400">120</span>
                  <span className="text-text-muted">credits</span>
                </div>
                <p className="text-text-muted text-xs sm:text-sm">gpt-4o-mini powered</p>
              </div>
              <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-text-secondary text-sm sm:text-base">Comprehensive learning plans</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-text-secondary text-sm sm:text-base">Quality curated resources</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-text-secondary text-sm sm:text-base">Industry insights</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-text-secondary text-sm sm:text-base">Practical exercises</span>
                </li>
              </ul>
              <div className="text-center">
                <span className="inline-flex items-center space-x-2 px-3 sm:px-4 py-2 bg-green-400/10 border border-green-400/20 rounded-lg text-green-400 font-medium text-xs sm:text-sm group-hover:bg-green-400/20 transition-all duration-300">
                  <span>{user ? 'Create Learning Plan' : 'Sign Up & Create Plan'}</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>


            {/* Premium Tier */}
            <Link 
              to={user ? "/learning-plans" : "/register"}
              className="group card-professional hover:border-purple-400/50 hover:shadow-glow-purple block overflow-hidden mx-4 md:mx-0"
            >
              {!user && (
                <div className="absolute top-3 right-3 z-10">
                  <span className="px-3 py-1 bg-purple-400/20 text-purple-400 text-xs font-bold rounded-full border border-purple-400/40">
                    🔓 FREE ACCESS
                  </span>
                </div>
              )}
              <div className="text-center mb-4 sm:mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-text-primary mb-3">Premium</h3>
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <span className="text-2xl sm:text-3xl font-bold text-purple-400">160</span>
                  <span className="text-text-muted">credits</span>
                </div>
                <p className="text-text-muted text-xs sm:text-sm">gpt-4o powered</p>
              </div>
              <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                <li className="flex items-center space-x-3">
                  <Star className="w-5 h-5 text-purple-400" />
                  <span className="text-text-secondary text-sm sm:text-base">Expert-level plans</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Star className="w-5 h-5 text-purple-400" />
                  <span className="text-text-secondary text-sm sm:text-base">Premium resources</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Star className="w-5 h-5 text-purple-400" />
                  <span className="text-text-secondary text-sm sm:text-base">Cutting-edge content</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Star className="w-5 h-5 text-purple-400" />
                  <span className="text-text-secondary text-sm sm:text-base">Career guidance</span>
                </li>
              </ul>
              <div className="text-center">
                <span className="inline-flex items-center space-x-2 px-3 sm:px-4 py-2 bg-purple-400/10 border border-purple-400/20 rounded-lg text-purple-400 font-medium text-xs sm:text-sm group-hover:bg-purple-400/20 transition-all duration-300">
                  <span>{user ? 'Create Learning Plan' : 'Sign Up & Create Plan'}</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Quiz Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-dark-bg-secondary relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {!user && (
            <div className="absolute top-4 sm:top-8 left-1/2 transform -translate-x-1/2 z-10 mx-4">
              <div className="card-professional border-yellow-400/50 px-4 sm:px-6 py-2 sm:py-3">
                <p className="text-yellow-300 font-bold text-xs sm:text-sm text-center">
                  🎯 Sign up to unlock all quiz difficulties with your free credits!
                </p>
              </div>
            </div>
          )}
          <div className="text-center mb-12 sm:mb-16 pt-16 sm:pt-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-text-primary mb-4 sm:mb-6 tracking-tight">
              Test Your
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent block sm:inline"> Knowledge</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-text-secondary max-w-3xl mx-auto font-medium px-4">
              Challenge yourself with AI-generated quizzes tailored to your skill level
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Easy Quiz */}
            <Link 
              to={user ? "/quiz" : "/register"}
              className="group card-professional hover:border-green-400/50 hover:shadow-glow-green block overflow-hidden mx-4 sm:mx-0"
            >
              {!user && (
                <div className="absolute top-3 right-3 z-10">
                  <span className="px-2 py-1 bg-green-400/20 text-green-400 text-xs font-bold rounded-full border border-green-400/40">
                    🔓 FREE
                  </span>
                </div>
              )}
              <div className="text-center mb-4 sm:mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-gradient-to-r from-green-400 to-emerald-400 mb-4 shadow-glow-green">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-text-primary mb-3">Generally</h3>
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <span className="text-2xl sm:text-3xl font-bold text-green-400">50</span>
                  <span className="text-text-muted">credits</span>
                </div>
              </div>
              <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-text-secondary text-sm sm:text-base">Basic concepts</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-text-secondary text-sm sm:text-base">Simple questions</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-text-secondary text-sm sm:text-base">5 questions</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-text-secondary text-sm sm:text-base">Instant feedback</span>
                </li>
              </ul>
              <div className="text-center">
                <span className="inline-flex items-center space-x-2 px-3 sm:px-4 py-2 bg-green-400/10 border border-green-400/20 rounded-lg text-green-400 font-medium text-xs sm:text-sm group-hover:bg-green-400/20 transition-all duration-300">
                  <span>{user ? 'Start Generally Quiz' : 'Sign Up & Take Quiz'}</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>

            {/* Medium Quiz */}
            <Link 
              to={user ? "/quiz" : "/register"}
              className="group card-professional hover:border-yellow-400/50 hover:shadow-lg hover:shadow-yellow-400/20 block overflow-hidden mx-4 sm:mx-0 sm:col-span-2 lg:col-span-1"
            >
              {!user && (
                <div className="absolute top-3 right-3 z-10">
                  <span className="px-2 py-1 bg-yellow-400/20 text-yellow-400 text-xs font-bold rounded-full border border-yellow-400/40">
                    🔓 FREE
                  </span>
                </div>
              )}
              <div className="text-center mb-4 sm:mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-400 mb-4 shadow-lg shadow-yellow-400/30">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-text-primary mb-3">Accurate</h3>
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <span className="text-2xl sm:text-3xl font-bold text-yellow-400">75</span>
                  <span className="text-text-muted">credits</span>
                </div>
              </div>
              <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-yellow-400" />
                  <span className="text-text-secondary text-sm sm:text-base">Applied knowledge</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-yellow-400" />
                  <span className="text-text-secondary text-sm sm:text-base">Problem-solving</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-yellow-400" />
                  <span className="text-text-secondary text-sm sm:text-base">8 questions</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-yellow-400" />
                  <span className="text-text-secondary text-sm sm:text-base">Detailed explanations</span>
                </li>
              </ul>
              <div className="text-center">
                <span className="inline-flex items-center space-x-2 px-3 sm:px-4 py-2 bg-yellow-400/10 border border-yellow-400/20 rounded-lg text-yellow-400 font-medium text-xs sm:text-sm group-hover:bg-yellow-400/20 transition-all duration-300">
                  <span>{user ? 'Start Accurate Quiz' : 'Sign Up & Take Quiz'}</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>

            {/* Hard Quiz */}
            <Link 
              to={user ? "/quiz" : "/register"}
              className="group card-professional hover:border-red-400/50 hover:shadow-lg hover:shadow-red-400/20 block overflow-hidden mx-4 sm:mx-0 sm:col-span-2 lg:col-span-1"
            >
              {!user && (
                <div className="absolute top-3 right-3 z-10">
                  <span className="px-2 py-1 bg-red-400/20 text-red-400 text-xs font-bold rounded-full border border-red-400/40">
                    🔓 FREE
                  </span>
                </div>
              )}
              <div className="text-center mb-4 sm:mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-gradient-to-r from-red-400 to-pink-400 mb-4 shadow-lg shadow-red-400/30">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-text-primary mb-3">Precise</h3>
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <span className="text-2xl sm:text-3xl font-bold text-red-400">100</span>
                  <span className="text-text-muted">credits</span>
                </div>
              </div>
              <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                <li className="flex items-center space-x-3">
                  <Star className="w-5 h-5 text-red-400" />
                  <span className="text-text-secondary text-sm sm:text-base">Expert-level analysis</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Star className="w-5 h-5 text-red-400" />
                  <span className="text-text-secondary text-sm sm:text-base">Complex scenarios</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Star className="w-5 h-5 text-red-400" />
                  <span className="text-text-secondary text-sm sm:text-base">11 questions</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Star className="w-5 h-5 text-red-400" />
                  <span className="text-text-secondary text-sm sm:text-base">gpt-4o-mini powered</span>
                </li>
              </ul>
              <div className="text-center">
                <span className="inline-flex items-center space-x-2 px-3 sm:px-4 py-2 bg-red-400/10 border border-red-400/20 rounded-lg text-red-400 font-medium text-xs sm:text-sm group-hover:bg-red-400/20 transition-all duration-300">
                  <span>{user ? 'Start Precise Quiz' : 'Sign Up & Take Quiz'}</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Dashboard Features Section */}
      <section className="py-12 sm:py-16 bg-dark-bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-text-primary mb-4 tracking-tight">
              {user ? 'Your Learning' : 'Learning'}
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent block sm:inline"> Dashboard</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-text-secondary max-w-2xl mx-auto font-medium px-4">
              {user ? 'Track your progress and manage your learning journey' : 'Sign up to track your progress and manage your learning journey'}
            </p>
          </div>

          {/* Learning Hub Highlight Section */}
          <div className="mb-8">
            <Link 
              to={user ? "/learning-hub" : "/register"}
              className="group block p-6 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-pink-400/50 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-pink-400/10"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white">Learning Hub</h3>
                  <p className="text-gray-400">Organize your notes and track your learning goals</p>
                </div>
                <div className="text-pink-400">
                  <ArrowRight className="w-6 h-6" />
                </div>
              </div>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Dashboard */}
            {user ? (
              <Link 
                to="/dashboard"
                className="group card-professional hover:border-cyan-400/50 hover:shadow-glow-cyan block mx-4 sm:mx-0"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-text-primary">Dashboard</h3>
                    <p className="text-text-muted text-xs sm:text-sm">Overview & Stats</p>
                  </div>
                </div>
                <p className="text-text-secondary text-xs sm:text-sm">
                  View your learning progress, recent activity, and performance statistics
                </p>
              </Link>
            ) : (
              <Link 
                to="/register"
                className="group card-professional hover:border-cyan-400/50 hover:shadow-glow-cyan block relative mx-4 sm:mx-0"
              >
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-1 bg-cyan-400/20 text-cyan-400 text-xs font-medium rounded-full border border-cyan-400/30">
                    Sign Up Required
                  </span>
                </div>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-text-primary">Dashboard</h3>
                    <p className="text-text-muted text-xs sm:text-sm">Overview & Stats</p>
                  </div>
                </div>
                <p className="text-text-secondary text-xs sm:text-sm">
                  View your learning progress, recent activity, and performance statistics
                </p>
              </Link>
            )}

            {/* Learning Hub */}
            {user ? (
              <Link 
                to="/learning-hub"
                className="group card-professional hover:border-pink-400/50 hover:shadow-lg hover:shadow-pink-400/20 block mx-4 sm:mx-0"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-text-primary">Learning Hub</h3>
                    <p className="text-text-muted text-xs sm:text-sm">Notes & Goals</p>
                  </div>
                </div>
                <p className="text-text-secondary text-xs sm:text-sm">
                  Organize your learning notes and track your personal goals
                </p>
              </Link>
            ) : (
              <Link 
                to="/register"
                className="group card-professional hover:border-pink-400/50 hover:shadow-lg hover:shadow-pink-400/20 block relative mx-4 sm:mx-0"
              >
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-1 bg-pink-400/20 text-pink-400 text-xs font-medium rounded-full border border-pink-400/30">
                    Sign Up Required
                  </span>
                </div>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-text-primary">Learning Hub</h3>
                    <p className="text-text-muted text-xs sm:text-sm">Notes & Goals</p>
                  </div>
                </div>
                <p className="text-text-secondary text-xs sm:text-sm">
                  Organize your learning notes and track your personal goals
                </p>
              </Link>
            )}

            {/* History */}

            {/* Settings */}
            {user ? (
              <Link 
                to="/settings"
                className="group card-professional hover:border-gray-400/50 hover:shadow-lg hover:shadow-gray-400/20 block mx-4 sm:mx-0 sm:col-span-2 lg:col-span-1"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-gradient-to-r from-gray-400 to-gray-600 rounded-lg">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-text-primary">Settings</h3>
                    <p className="text-text-muted text-xs sm:text-sm">Account & Preferences</p>
                  </div>
                </div>
                <p className="text-text-secondary text-xs sm:text-sm">
                  Manage your account settings and learning preferences
                </p>
              </Link>
            ) : (
              <Link 
                to="/register"
                className="group card-professional hover:border-gray-400/50 hover:shadow-lg hover:shadow-gray-400/20 block relative mx-4 sm:mx-0 sm:col-span-2 lg:col-span-1"
              >
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-1 bg-gray-400/20 text-gray-400 text-xs font-medium rounded-full border border-gray-400/30">
                    Sign Up Required
                  </span>
                </div>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-gradient-to-r from-gray-400 to-gray-600 rounded-lg">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-text-primary">Settings</h3>
                    <p className="text-text-muted text-xs sm:text-sm">Account & Preferences</p>
                  </div>
                </div>
                <p className="text-text-secondary text-xs sm:text-sm">
                  Manage your account settings and learning preferences
                </p>
              </Link>
            )}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-dark-bg-secondary">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative">
          <div className="absolute inset-0 gradient-overlay rounded-3xl"></div>
          {!user ? (
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-text-primary mb-6 sm:mb-8 tracking-tight">
                Ready to Transform Your Learning?
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-text-secondary mb-6 font-medium px-4">
                Join thousands of learners who are already mastering new skills with AI-powered education.
              </p>
              
              {/* Final conversion section */}
              <div className="card-professional border-green-400/40 p-6 sm:p-8 mb-6 sm:mb-8 mx-4">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl mb-2">🎁</div>
                    <h3 className="text-base sm:text-lg font-bold text-green-300 mb-1">300 Free Credits</h3>
                    <p className="text-xs sm:text-sm text-text-secondary">Every month, automatically</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl mb-2">⚡</div>
                    <h3 className="text-base sm:text-lg font-bold text-cyan-300 mb-1">Instant Access</h3>
                    <p className="text-xs sm:text-sm text-text-secondary">No waiting, start immediately</p>
                  </div>
                  <div className="text-center sm:col-span-2 lg:col-span-1">
                    <div className="text-3xl sm:text-4xl mb-2">🚫</div>
                    <h3 className="text-base sm:text-lg font-bold text-blue-300 mb-1">No Credit Card</h3>
                    <p className="text-xs sm:text-sm text-text-secondary">100% free to get started</p>
                  </div>
                </div>
                
                <Link 
                  to="/register"
                  className="group relative inline-flex items-center space-x-3 sm:space-x-4 px-8 sm:px-12 py-4 sm:py-6 bg-gradient-to-r from-green-500 via-cyan-500 to-blue-500 hover:from-green-400 hover:via-cyan-400 hover:to-blue-400 rounded-2xl font-black text-lg sm:text-xl lg:text-2xl transition-all duration-300 transform hover:scale-105 shadow-professional hover:shadow-glow-green"
                >
                  {/* Glow effect */}
                  <div className="absolute -inset-2 bg-gradient-to-r from-green-400 via-cyan-400 to-blue-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
                  <div className="relative flex items-center space-x-3 sm:space-x-4">
                    <span className="text-2xl sm:text-3xl">🚀</span>
                    <span>Start Your FREE Journey Now</span>
                    <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </Link>
                
                <p className="text-green-200 font-medium mt-4 text-sm sm:text-base lg:text-lg">
                  ✨ Join 10,000+ learners already using QuotaSkill
                </p>
              </div>
            </div>
          ) : (
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-text-primary mb-6 sm:mb-8 tracking-tight">
                Welcome Back, Learner!
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-text-secondary mb-8 sm:mb-10 font-medium px-4">
                Continue your learning journey with AI-powered education.
              </p>
              <Link 
                to="/dashboard"
                className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-professional hover:shadow-glow-cyan"
              >
                <span className="text-lg">Go to Dashboard</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* === KORRIGIERTER FOOTER START === */}
      <footer className="bg-dark-bg-primary border-t border-gray-800/50 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center space-y-6">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3">
              <div className="relative p-3 rounded-xl bg-gradient-to-br from-gray-800/80 to-gray-900/80 shadow-lg shadow-cyan-400/20 border-2 border-cyan-400/30">
                {/* Minimalist QuotaSkill Footer Magnifying Glass */}
                <div className="relative w-8 h-8">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    {/* Main Glass Circle */}
                    <circle cx="40" cy="40" r="25" fill="none" stroke="url(#footerGlassGradient)" strokeWidth="4"/>
                    
                    {/* QuotaSkill "Q" */}
                    <circle cx="40" cy="40" r="15" fill="none" stroke="#06B6D4" strokeWidth="3"/>
                    <path d="M 40 25 A 15 15 0 1 1 40 55" fill="none" stroke="#06B6D4" strokeWidth="3"/>
                    <line x1="50" y1="50" x2="54" y2="54" stroke="#06B6D4" strokeWidth="3" strokeLinecap="round"/>
                    
                    {/* Center dot */}
                    <circle cx="40" cy="40" r="2" fill="#06B6D4"/>
                    
                    {/* Handle */}
                    <line x1="60" y1="60" x2="85" y2="85" stroke="url(#footerHandleGradient)" strokeWidth="6" strokeLinecap="round"/>
                    
                    {/* Gradients */}
                    <defs>
                      <linearGradient id="footerGlassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#06B6D4" />
                        <stop offset="50%" stopColor="#8B5CF6" />
                        <stop offset="100%" stopColor="#EC4899" />
                      </linearGradient>
                      <linearGradient id="footerHandleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#374151" />
                        <stop offset="100%" stopColor="#6B7280" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
              <span className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent tracking-wide">
                QuotaSkill
              </span>
            </div>

            {/* Social Media Links */}
            <div className="flex items-center space-x-6">
              <a
                href="https://www.instagram.com/quota_skill/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 hover:border-pink-400/50 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-pink-400/20 hover:scale-105"
                aria-label="Follow QuotaSkill on Instagram"
              >
                <div className="p-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-pink-400 font-bold text-sm">Instagram</p>
                  <p className="text-gray-400 text-xs">@quotaskill</p>
                </div>
              </a>

              <a
                href="https://x.com/Quoatskill"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-gray-500/10 to-gray-600/10 border border-gray-500/20 hover:border-gray-400/50 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-gray-400/20 hover:scale-105"
                aria-label="Follow QuotaSkill on X (Twitter)"
              >
                <div className="p-2 bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-gray-400 font-bold text-sm">X (Twitter)</p>
                  <p className="text-gray-500 text-xs">@Quoatskill</p>
                </div>
              </a>
            </div>

            {/* Footer Text */}
            <div className="text-center pt-6 border-t border-gray-800/50 w-full">
              <p className="text-text-muted text-sm mb-2">
                © 2025 QuotaSkill. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs">
                Follow us for updates, tips, and learning inspiration
              </p>
              
              {/* Rechtliche Links mit <Link> Komponente */}
              <div className="flex justify-center items-center space-x-4 mt-4 text-xs text-gray-400">
                <Link to="/impressum" className="hover:text-cyan-400 transition-colors">
                  Imprint
                </Link>
                <span className="text-gray-600">|</span>
                <Link to="/datenschutz" className="hover:text-cyan-400 transition-colors">
                  Privacy Policy
                </Link>
                <span className="text-gray-600">|</span>
                <Link to="/cookie-richtlinie" className="hover:text-cyan-400 transition-colors">
                  Cookie Policy
                </Link>
                <span className="text-gray-600">|</span>
                
                {/* === HIER IST DIE ÄNDERUNG === */}
                <a
                  
  href="#"
  onClick={(e) => {
    e.preventDefault();
    window.displayPreferenceModal();
  }}
  className="hover:text-cyan-400 transition-colors"
>
  Cookie Preferences
</a>
                 

              </div>
              
            </div>
          </div>
        </div>
      </footer>
      {/* === KORRIGIERTER FOOTER ENDE === */}
    </div>
  );
};

export default HomePage;





      
