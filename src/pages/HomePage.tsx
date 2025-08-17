"use client"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { useState, useEffect } from "react"
import {
  BookOpen,
  Zap,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Target,
  Users,
  Clock,
  Shield,
  History,
  Settings,
  Brain,
  BarChart3,
  Sparkles,
} from "lucide-react"

const HomePage = () => {
  const { user } = useAuth()
  const [isVisible, setIsVisible] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setIsVisible(true)
    
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const FloatingParticles = () => (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-30 animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${15 + Math.random() * 10}s`
          }}
        />
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-100px) rotate(180deg); }
        }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.5); }
          50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.8); }
        }
        
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-float { animation: float linear infinite; }
        .animate-fadeInUp { animation: fadeInUp 0.8s ease-out; }
        .animate-fadeInLeft { animation: fadeInLeft 0.8s ease-out; }
        .animate-fadeInRight { animation: fadeInRight 0.8s ease-out; }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        .animate-gradient { 
          background: linear-gradient(-45deg, #3b82f6, #8b5cf6, #06b6d4, #10b981);
          background-size: 400% 400%;
          animation: gradient-shift 6s ease infinite;
        }
        
        .hover-lift {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .hover-lift:hover {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        
        .card-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        
        .card-hover:before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }
        
        .card-hover:hover:before {
          left: 100%;
        }
        
        .stagger-animation > * {
          opacity: 0;
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .stagger-animation > *:nth-child(1) { animation-delay: 0.1s; }
        .stagger-animation > *:nth-child(2) { animation-delay: 0.2s; }
        .stagger-animation > *:nth-child(3) { animation-delay: 0.3s; }
        .stagger-animation > *:nth-child(4) { animation-delay: 0.4s; }
        .stagger-animation > *:nth-child(5) { animation-delay: 0.5s; }
        .stagger-animation > *:nth-child(6) { animation-delay: 0.6s; }
      `}</style>

      <FloatingParticles />
      
      <div className="fixed top-4 right-4 z-50">{/* Placeholder for any authentication toggle button or link */}</div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-32 pb-32 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-10 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-15 animate-bounce" style={{ animationDuration: '3s' }}></div>
          <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className={`text-center max-w-4xl mx-auto ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}>
            {!user ? (
              <>
                <div className="relative">
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
                    Build Essential Skills with
                    <span className="text-transparent bg-clip-text animate-gradient block">AI-Powered Personalized Learning</span>
                  </h1>
                  
                  {/* Sparkle effects around the title */}
                  <div className="absolute top-0 left-1/4 animate-pulse">
                    <Sparkles className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="absolute top-10 right-1/4 animate-pulse" style={{ animationDelay: '1s' }}>
                    <Sparkles className="w-8 h-8 text-purple-400" />
                  </div>
                  <div className="absolute bottom-10 left-1/3 animate-pulse" style={{ animationDelay: '2s' }}>
                    <Sparkles className="w-5 h-5 text-green-400" />
                  </div>
                </div>

                <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                  Create custom learning plans tailored to your goals, assess your progress with smart AI quizzes, and stay organized with intuitive tracking tools. Start your journey to skill mastery today.
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
                  <Link
                    to="/register"
                    className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-2xl flex items-center space-x-2 hover-lift group animate-pulse-glow"
                  >
                    <span>Get Started for Free</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link
                    to="/learning-plans"
                    className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:border-blue-600 hover:text-blue-600 transition-all duration-300 hover-lift backdrop-blur-sm"
                  >
                    Explore Features
                  </Link>
                </div>
              </>
            ) : (
              <>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  Welcome Back, <span className="text-blue-600 font-bold">{user.email?.split("@")[0] || "Learner"}!</span>
                </h1>

                <p className="text-xl text-gray-600 mb-12 leading-relaxed max-w-2xl mx-auto">
                  Pick up right where you left off. Access your dashboard for quick insights, or dive into quizzes, plans, and more.
                </p>

                <div className="flex justify-center mb-16">
                  <Link
                    to="/dashboard"
                    className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2 hover-lift animate-pulse-glow"
                  >
                    <span>Access Dashboard</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </>
            )}

            {/* Trust Indicators with animation */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16 border-t border-gray-200 stagger-animation">
              <div className="text-center group cursor-default">
                <div className="text-3xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform">Tailored</div>
                <div className="text-gray-600 font-medium">Learning Paths</div>
              </div>
              <div className="text-center group cursor-default">
                <div className="text-3xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform">Smart</div>
                <div className="text-gray-600 font-medium">AI Quizzes</div>
              </div>
              <div className="text-center group cursor-default">
                <div className="text-3xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform">Intuitive</div>
                <div className="text-gray-600 font-medium">Progress Tracking</div>
              </div>
              <div className="text-center group cursor-default">
                <div className="text-3xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform">Flexible</div>
                <div className="text-gray-600 font-medium">Skill Building</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {!user ? (
        <>
          {/* Features Section for New Users */}
          <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-20 animate-fadeInUp">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Why QuotaSkill for AI-Powered Learning?</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Discover a smart platform that adapts to your learning style, helping you master skills efficiently with AI-driven tools.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 stagger-animation">
                {/* AI Quizzes */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-2xl transition-all duration-500 card-hover hover-lift group">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-4 group-hover:bg-green-200 group-hover:scale-110 transition-all duration-300">
                      <Brain className="w-8 h-8 text-green-600 group-hover:rotate-12 transition-transform" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Intelligent AI Quizzes</h3>
                    <p className="text-gray-600 text-sm mb-4">Assess and reinforce your knowledge effectively</p>
                  </div>

                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center space-x-3 group-hover:translate-x-2 transition-transform">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-gray-600 text-sm">Adaptive difficulty levels</span>
                    </li>
                    <li className="flex items-center space-x-3 group-hover:translate-x-2 transition-transform" style={{ transitionDelay: '0.1s' }}>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-gray-600 text-sm">Real-time feedback</span>
                    </li>
                    <li className="flex items-center space-x-3 group-hover:translate-x-2 transition-transform" style={{ transitionDelay: '0.2s' }}>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-gray-600 text-sm">In-depth explanations</span>
                    </li>
                  </ul>

                  <Link
                    to="/register"
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-all duration-300 text-center block group-hover:shadow-lg"
                  >
                    Begin Your Assessment
                  </Link>
                </div>

                {/* Learning Plans */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-2xl transition-all duration-500 card-hover hover-lift group">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-2xl mb-4 group-hover:bg-purple-200 group-hover:scale-110 transition-all duration-300">
                      <Target className="w-8 h-8 text-purple-600 group-hover:rotate-12 transition-transform" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Customized Learning Plans</h3>
                    <p className="text-gray-600 text-sm mb-4">Roadmaps designed for your specific objectives</p>
                  </div>

                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center space-x-3 group-hover:translate-x-2 transition-transform">
                      <CheckCircle className="w-4 h-4 text-purple-500" />
                      <span className="text-gray-600 text-sm">Goal-based customization</span>
                    </li>
                    <li className="flex items-center space-x-3 group-hover:translate-x-2 transition-transform" style={{ transitionDelay: '0.1s' }}>
                      <CheckCircle className="w-4 h-4 text-purple-500" />
                      <span className="text-gray-600 text-sm">Milestone tracking</span>
                    </li>
                    <li className="flex items-center space-x-3 group-hover:translate-x-2 transition-transform" style={{ transitionDelay: '0.2s' }}>
                      <CheckCircle className="w-4 h-4 text-purple-500" />
                      <span className="text-gray-600 text-sm">Dynamic adjustments</span>
                    </li>
                  </ul>

                  <Link
                    to="/register"
                    className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-all duration-300 text-center block group-hover:shadow-lg"
                  >
                    Build Your Roadmap
                  </Link>
                </div>

                {/* Learning Hub */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-2xl transition-all duration-500 card-hover hover-lift group">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4 group-hover:bg-blue-200 group-hover:scale-110 transition-all duration-300">
                      <BookOpen className="w-8 h-8 text-blue-600 group-hover:rotate-12 transition-transform" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Integrated Learning Hub</h3>
                    <p className="text-gray-600 text-sm mb-4">Centralize your notes and objectives</p>
                  </div>

                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center space-x-3 group-hover:translate-x-2 transition-transform">
                      <CheckCircle className="w-4 h-4 text-blue-500" />
                      <span className="text-gray-600 text-sm">Efficient note organization</span>
                    </li>
                    <li className="flex items-center space-x-3 group-hover:translate-x-2 transition-transform" style={{ transitionDelay: '0.1s' }}>
                      <CheckCircle className="w-4 h-4 text-blue-500" />
                      <span className="text-gray-600 text-sm">Objective management</span>
                    </li>
                    <li className="flex items-center space-x-3 group-hover:translate-x-2 transition-transform" style={{ transitionDelay: '0.2s' }}>
                      <CheckCircle className="w-4 h-4 text-blue-500" />
                      <span className="text-gray-600 text-sm">Performance insights</span>
                    </li>
                  </ul>

                  <Link
                    to="/register"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-all duration-300 text-center block group-hover:shadow-lg"
                  >
                    Get Organized Now
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </>
      ) : (
        <>
          {/* Quick Access Services for Authenticated Users */}
          <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-20 animate-fadeInUp">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Your Personalized Learning Tools</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Easily navigate to your key features and continue building skills with clear, guided access.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-animation">
                {/* Dashboard */}
                <Link
                  to="/dashboard"
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-2xl transition-all hover:border-blue-300 group card-hover hover-lift"
                >
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-all duration-300 group-hover:scale-110">
                      <BarChart3 className="w-6 h-6 text-blue-600 group-hover:rotate-12 transition-transform" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Dashboard</h3>
                      <p className="text-gray-500 text-sm">Overview & Analytics</p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Get a quick overview of your progress, key metrics, and next steps in one place.
                  </p>
                  <div className="flex items-center text-blue-600 font-medium group-hover:translate-x-2 transition-transform">
                    <span>Open Dashboard</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>

                {/* AI Quizzes */}
                <Link
                  to="/quiz"
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-2xl transition-all hover:border-green-300 group card-hover hover-lift"
                >
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-all duration-300 group-hover:scale-110">
                      <Brain className="w-6 h-6 text-green-600 group-hover:rotate-12 transition-transform" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">AI Quizzes</h3>
                      <p className="text-gray-500 text-sm">Test Your Knowledge</p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Select from various topics and difficulties to test and improve your skills.
                  </p>
                  <div className="flex items-center text-green-600 font-medium group-hover:translate-x-2 transition-transform">
                    <span>Start Quiz</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>

                {/* Learning Plans */}
                <Link
                  to="/learning-plans"
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-2xl transition-all hover:border-purple-300 group card-hover hover-lift"
                >
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-all duration-300 group-hover:scale-110">
                      <Target className="w-6 h-6 text-purple-600 group-hover:rotate-12 transition-transform" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Learning Plans</h3>
                      <p className="text-gray-500 text-sm">Personalized Roadmaps</p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Review or create new plans aligned with your career and skill development goals.
                  </p>
                  <div className="flex items-center text-purple-600 font-medium group-hover:translate-x-2 transition-transform">
                    <span>View Plans</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>

                {/* Personal Learning Hub */}
                <Link
                  to="/learning-hub"
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-2xl transition-all hover:border-indigo-300 group card-hover hover-lift"
                >
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="p-3 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-all duration-300 group-hover:scale-110">
                      <BookOpen className="w-6 h-6 text-indigo-600 group-hover:rotate-12 transition-transform" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Learning Hub</h3>
                      <p className="text-gray-500 text-sm">Notes & Goals</p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Manage your notes, set new goals, and track achievements effortlessly.
                  </p>
                  <div className="flex items-center text-indigo-600 font-medium group-hover:translate-x-2 transition-transform">
                    <span>Open Hub</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>

                {/* Settings */}
                <Link
                  to="/settings"
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-2xl transition-all hover:border-gray-400 group card-hover hover-lift"
                >
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="p-3 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-all duration-300 group-hover:scale-110">
                      <Settings className="w-6 h-6 text-gray-600 group-hover:rotate-180 transition-transform duration-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Settings</h3>
                      <p className="text-gray-500 text-sm">Account & Preferences</p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Customize your experience, update details, and adjust preferences easily.
                  </p>
                  <div className="flex items-center text-gray-600 font-medium group-hover:translate-x-2 transition-transform">
                    <span>Open Settings</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Platform Features */}
      <section id="about" className="py-24 bg-gray-50 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-bounce" style={{ animationDuration: '4s' }}></div>
          <div className="absolute bottom-20 right-20 w-16 h-16 bg-purple-200 rounded-full opacity-25 animate-pulse"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20 animate-fadeInUp">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Your All-in-One AI Learning Platform</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Equip yourself with tools for effective skill development, from personalized plans to advanced AI insights.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-animation">
            {/* Dashboard */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover-lift group card-hover">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 group-hover:scale-110 transition-all duration-300">
                  <TrendingUp className="w-6 h-6 text-blue-600 group-hover:rotate-12 transition-transform" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Dashboard</h3>
                  <p className="text-gray-500 text-sm">Overview & Analytics</p>
                </div>
              </div>
              <p className="text-gray-600">
                Monitor your skill development with detailed analytics and actionable insights.
              </p>
            </div>

            {/* Learning Hub */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover-lift group card-hover">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 group-hover:scale-110 transition-all duration-300">
                  <BookOpen className="w-6 h-6 text-purple-600 group-hover:rotate-12 transition-transform" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Learning Hub</h3>
                  <p className="text-gray-500 text-sm">Notes & Goals</p>
                </div>
              </div>
              <p className="text-gray-600">Centralize your resources and objectives for streamlined learning.</p>
            </div>

            {/* AI Technology */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover-lift group card-hover">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 group-hover:scale-110 transition-all duration-300">
                  <Zap className="w-6 h-6 text-green-600 group-hover:rotate-12 transition-transform" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">AI Technology</h3>
                  <p className="text-gray-500 text-sm">Advanced Models</p>
                </div>
              </div>
              <p className="text-gray-600">
                Leverage cutting-edge AI, including GPT-4o, for optimized learning experiences.
              </p>
            </div>

            {/* Professional Network */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover-lift group card-hover">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 group-hover:scale-110 transition-all duration-300">
                  <Users className="w-6 h-6 text-indigo-600 group-hover:rotate-12 transition-transform" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Community</h3>
                  <p className="text-gray-500 text-sm">Growing Network</p>
                </div>
              </div>
              <p className="text-gray-600">
                Connect with like-minded learners focused on professional growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-blue-600 relative overflow-hidden">
        {/* Animated background patterns */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-white rounded-full animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${Math.random() * 20 + 10}px`,
                  height: `${Math.random() * 20 + 10}px`,
                  animationDelay: `${Math.random() * 10}s`,
                  animationDuration: `${20 + Math.random() * 10}s`
                }}
              />
            ))}
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          {!user ? (
            <>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 animate-fadeInUp">Ready to Master New Skills with AI?</h2>
              <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                Experience personalized learning that fits your schedule and accelerates your professional development.
              </p>

              <div className="space-y-8 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-500 hover-lift">
                  <div className="grid md:grid-cols-3 gap-6 mb-8 stagger-animation">
                    <div className="text-center group">
                      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🎯</div>
                      <h3 className="text-lg font-semibold text-white mb-2">Free Starter Credits</h3>
                      <p className="text-blue-100 text-sm">Begin with resources to explore</p>
                    </div>
                    <div className="text-center group">
                      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">⚡</div>
                      <h3 className="text-lg font-semibold text-white mb-2">Quick Setup</h3>
                      <p className="text-blue-100 text-sm">Get learning in minutes</p>
                    </div>
                    <div className="text-center group">
                      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🚫</div>
                      <h3 className="text-lg font-semibold text-white mb-2">No Commitment</h3>
                      <p className="text-blue-100 text-sm">Sign up without any obligations</p>
                    </div>
                  </div>

                  <Link
                    to="/register"
                    className="inline-flex items-center space-x-3 bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-2xl hover-lift group animate-pulse-glow"
                  >
                    <span>Begin Free Trial</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                <p className="text-blue-200 font-medium animate-pulse">✨ Start your AI-powered skill journey today</p>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 animate-fadeInUp">Advance Your Skills Further</h2>
              <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                Build on your progress with easy access to tools that support your ongoing development.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center space-x-2 bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-2xl hover-lift group"
                >
                  <span>Check Progress</span>
                  <BarChart3 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </Link>

                <Link
                  to="/quiz"
                  className="inline-flex items-center space-x-2 border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 hover-lift group"
                >
                  <span>New Quiz</span>
                  <Brain className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 relative overflow-hidden">
        {/* Subtle background animation */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-1/4 w-32 h-32 bg-blue-500 rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-1/3 w-20 h-20 bg-purple-500 rounded-full animate-bounce" style={{ animationDuration: '6s' }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-4 gap-12 stagger-animation">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6 group">
                <div className="relative p-2 rounded-lg bg-blue-600 group-hover:bg-blue-700 transition-colors">
                  <div className="relative w-8 h-8 group-hover:scale-110 transition-transform">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <circle cx="40" cy="40" r="25" fill="none" stroke="white" strokeWidth="4" />
                      <circle cx="40" cy="40" r="15" fill="none" stroke="white" strokeWidth="3" />
                      <line x1="60" y1="60" x2="85" y2="85" stroke="white" strokeWidth="6" strokeLinecap="round" />
                      <circle cx="40" cy="40" r="2" fill="white" />
                    </svg>
                  </div>
                </div>
                <span className="text-2xl font-bold group-hover:text-blue-400 transition-colors">QuotaSkill</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
                Your go-to platform for AI-powered personalized learning, helping you master skills and advance professionally.
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://www.instagram.com/quota_skill/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition-all duration-300 hover:scale-110 hover:shadow-lg group"
                  aria-label="Follow QuotaSkill on Instagram"
                >
                  <svg className="w-5 h-5 group-hover:text-pink-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.664-4.919-4.919-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0c-3.258 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="https://x.com/Quoatskill"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition-all duration-300 hover:scale-110 hover:shadow-lg group"
                  aria-label="Follow QuotaSkill on X (Twitter)"
                >
                  <svg className="w-5 h-5 group-hover:text-blue-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Platform</h4>
              <ul className="space-y-4">
                <li>
                  <Link to="/learning-plans" className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">
                    Learning Plans
                  </Link>
                </li>
                <li>
                  <Link to="/quiz" className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">
                    AI Quizzes
                  </Link>
                </li>
                <li>
                  <Link to="/learning-hub" className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">
                    Learning Hub
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Legal</h4>
              <ul className="space-y-4">
                <li>
                  <Link to="/imprint" className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">
                    Imprint
                  </Link>
                </li>
                <li>
                  <Link to="/privacypolicy" className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/cookiepolicy" className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      window.displayPreferenceModal?.()
                    }}
                    className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block"
                  >
                    Cookie Preferences
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center animate-fadeInUp">
            <p className="text-gray-400 mb-4 md:mb-0">© 2025 QuotaSkill. All rights reserved.</p>
            <p className="text-gray-500 text-sm">Empowering skill mastery through AI learning</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
