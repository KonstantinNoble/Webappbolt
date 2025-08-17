"use client"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
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
} from "lucide-react"

const HomePage = () => {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-white">
      <div className="fixed top-4 right-4 z-50">{/* Placeholder for any authentication toggle button or link */}</div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-32 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {!user ? (
              <>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
                  Build Essential Skills with
                  <span className="text-blue-600 block">AI-Powered Personalized Learning</span>
                </h1>

                <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
                  Create custom learning plans tailored to your goals, assess your progress with smart AI quizzes, and stay organized with intuitive tracking tools. Start your journey to skill mastery today.
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
                  <Link
                    to="/register"
                    className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2"
                  >
                    <span>Get Started for Free</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>

                  <Link
                    to="/learning-plans"
                    className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:border-blue-600 hover:text-blue-600 transition-all duration-300"
                  >
                    Explore Features
                  </Link>
                </div>
              </>
            ) : (
              <>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  Welcome Back, <span className="text-blue-600">{user.email?.split("@")[0] || "Learner"}!</span>
                </h1>

                <p className="text-xl text-gray-600 mb-12 leading-relaxed max-w-2xl mx-auto">
                  Pick up right where you left off. Access your dashboard for quick insights, or dive into quizzes, plans, and more.
                </p>

                <div className="flex justify-center mb-16">
                  <Link
                    to="/dashboard"
                    className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2"
                  >
                    <span>Access Dashboard</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </>
            )}

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16 border-t border-gray-200">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">Tailored</div>
                <div className="text-gray-600 font-medium">Learning Paths</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">Smart</div>
                <div className="text-gray-600 font-medium">AI Quizzes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">Intuitive</div>
                <div className="text-gray-600 font-medium">Progress Tracking</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">Flexible</div>
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
              <div className="text-center mb-20">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Why QuotaSkill for AI-Powered Learning?</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Discover a smart platform that adapts to your learning style, helping you master skills efficiently with AI-driven tools.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {/* AI Quizzes */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-shadow">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-4">
                      <Brain className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Intelligent AI Quizzes</h3>
                    <p className="text-gray-600 text-sm mb-4">Assess and reinforce your knowledge effectively</p>
                  </div>

                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center space-x-3">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-gray-600 text-sm">Adaptive difficulty levels</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-gray-600 text-sm">Real-time feedback</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-gray-600 text-sm">In-depth explanations</span>
                    </li>
                  </ul>

                  <Link
                    to="/register"
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors text-center block"
                  >
                    Begin Your Assessment
                  </Link>
                </div>

                {/* Learning Plans */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-shadow">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-2xl mb-4">
                      <Target className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Customized Learning Plans</h3>
                    <p className="text-gray-600 text-sm mb-4">Roadmaps designed for your specific objectives</p>
                  </div>

                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center space-x-3">
                      <CheckCircle className="w-4 h-4 text-purple-500" />
                      <span className="text-gray-600 text-sm">Goal-based customization</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <CheckCircle className="w-4 h-4 text-purple-500" />
                      <span className="text-gray-600 text-sm">Milestone tracking</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <CheckCircle className="w-4 h-4 text-purple-500" />
                      <span className="text-gray-600 text-sm">Dynamic adjustments</span>
                    </li>
                  </ul>

                  <Link
                    to="/register"
                    className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors text-center block"
                  >
                    Build Your Roadmap
                  </Link>
                </div>

                {/* Learning Hub */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-shadow">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
                      <BookOpen className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Integrated Learning Hub</h3>
                    <p className="text-gray-600 text-sm mb-4">Centralize your notes and objectives</p>
                  </div>

                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center space-x-3">
                      <CheckCircle className="w-4 h-4 text-blue-500" />
                      <span className="text-gray-600 text-sm">Efficient note organization</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <CheckCircle className="w-4 h-4 text-blue-500" />
                      <span className="text-gray-600 text-sm">Objective management</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <CheckCircle className="w-4 h-4 text-blue-500" />
                      <span className="text-gray-600 text-sm">Performance insights</span>
                    </li>
                  </ul>

                  <Link
                    to="/register"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors text-center block"
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
              <div className="text-center mb-20">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Your Personalized Learning Tools</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Easily navigate to your key features and continue building skills with clear, guided access.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Dashboard */}
                <Link
                  to="/dashboard"
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-all hover:border-blue-300 group"
                >
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                      <BarChart3 className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Dashboard</h3>
                      <p className="text-gray-500 text-sm">Overview & Analytics</p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Get a quick overview of your progress, key metrics, and next steps in one place.
                  </p>
                  <div className="flex items-center text-blue-600 font-medium">
                    <span>Open Dashboard</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </Link>

                {/* AI Quizzes */}
                <Link
                  to="/quiz"
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-all hover:border-green-300 group"
                >
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                      <Brain className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">AI Quizzes</h3>
                      <p className="text-gray-500 text-sm">Test Your Knowledge</p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Select from various topics and difficulties to test and improve your skills.
                  </p>
                  <div className="flex items-center text-green-600 font-medium">
                    <span>Start Quiz</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </Link>

                {/* Learning Plans */}
                <Link
                  to="/learning-plans"
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-all hover:border-purple-300 group"
                >
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                      <Target className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Learning Plans</h3>
                      <p className="text-gray-500 text-sm">Personalized Roadmaps</p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Review or create new plans aligned with your career and skill development goals.
                  </p>
                  <div className="flex items-center text-purple-600 font-medium">
                    <span>View Plans</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </Link>

                {/* Personal Learning Hub */}
                <Link
                  to="/learning-hub"
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-all hover:border-indigo-300 group"
                >
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="p-3 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
                      <BookOpen className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Learning Hub</h3>
                      <p className="text-gray-500 text-sm">Notes & Goals</p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Manage your notes, set new goals, and track achievements effortlessly.
                  </p>
                  <div className="flex items-center text-indigo-600 font-medium">
                    <span>Open Hub</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </Link>

                {/* History */}
                <Link
                  to="/history"
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-all hover:border-orange-300 group"
                >
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="p-3 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                      <History className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Learning History</h3>
                      <p className="text-gray-500 text-sm">Past Activities</p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Browse your previous quizzes, plans, and activities for review and reflection.
                  </p>
                  <div className="flex items-center text-orange-600 font-medium">
                    <span>View History</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </Link>

                {/* Settings */}
                <Link
                  to="/settings"
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-all hover:border-gray-400 group"
                >
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="p-3 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                      <Settings className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Settings</h3>
                      <p className="text-gray-500 text-sm">Account & Preferences</p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Customize your experience, update details, and adjust preferences easily.
                  </p>
                  <div className="flex items-center text-gray-600 font-medium">
                    <span>Open Settings</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </Link>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Platform Features */}
      <section id="about" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Your All-in-One AI Learning Platform</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Equip yourself with tools for effective skill development, from personalized plans to advanced AI insights.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Dashboard */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
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
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Learning Hub</h3>
                  <p className="text-gray-500 text-sm">Notes & Goals</p>
                </div>
              </div>
              <p className="text-gray-600">Centralize your resources and objectives for streamlined learning.</p>
            </div>

            {/* AI Technology */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Zap className="w-6 h-6 text-green-600" />
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
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-indigo-100 rounded-lg">
                  <Users className="w-6 h-6 text-indigo-600" />
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
      <section className="py-24 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          {!user ? (
            <>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Ready to Master New Skills with AI?</h2>
              <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
                Experience personalized learning that fits your schedule and accelerates your professional development.
              </p>

              <div className="space-y-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="text-center">
                      <div className="text-4xl mb-4">🎁</div>
                      <h3 className="text-lg font-semibold text-white mb-2">Free Starter Credits</h3>
                      <p className="text-blue-100 text-sm">Begin with resources to explore</p>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl mb-4">⚡</div>
                      <h3 className="text-lg font-semibold text-white mb-2">Quick Setup</h3>
                      <p className="text-blue-100 text-sm">Get learning in minutes</p>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl mb-4">🚫</div>
                      <h3 className="text-lg font-semibold text-white mb-2">No Commitment</h3>
                      <p className="text-blue-100 text-sm">Sign up without any obligations</p>
                    </div>
                  </div>

                  <Link
                    to="/register"
                    className="inline-flex items-center space-x-3 bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <span>Begin Free Trial</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>

                <p className="text-blue-200 font-medium">✨ Start your AI-powered skill journey today</p>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Advance Your Skills Further</h2>
              <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
                Build on your progress with easy access to tools that support your ongoing development.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center space-x-2 bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <span>Check Progress</span>
                  <BarChart3 className="w-5 h-5" />
                </Link>

                <Link
                  to="/quiz"
                  className="inline-flex items-center space-x-2 border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300"
                >
                  <span>New Quiz</span>
                  <Brain className="w-5 h-5" />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="relative p-2 rounded-lg bg-blue-600">
                  <div className="relative w-8 h-8">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <circle cx="40" cy="40" r="25" fill="none" stroke="white" strokeWidth="4" />
                      <circle cx="40" cy="40" r="15" fill="none" stroke="white" strokeWidth="3" />
                      <line x1="60" y1="60" x2="85" y2="85" stroke="white" strokeWidth="6" strokeLinecap="round" />
                      <circle cx="40" cy="40" r="2" fill="white" />
                    </svg>
                  </div>
                </div>
                <span className="text-2xl font-bold">QuotaSkill</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
                Your go-to platform for AI-powered personalized learning, helping you master skills and advance professionally.
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://www.instagram.com/quota_skill/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition-colors"
                  aria-label="Follow QuotaSkill on Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.664-4.919-4.919-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0c-3.258 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="https://x.com/Quoatskill"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition-colors"
                  aria-label="Follow QuotaSkill on X (Twitter)"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
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
                  <Link to="/learning-plans" className="text-gray-400 hover:text-white transition-colors">
                    Learning Plans
                  </Link>
                </li>
                <li>
                  <Link to="/quiz" className="text-gray-400 hover:text-white transition-colors">
                    AI Quizzes
                  </Link>
                </li>
                <li>
                  <Link to="/learning-hub" className="text-gray-400 hover:text-white transition-colors">
                    Learning Hub
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="text-gray-400 hover:text-white transition-colors">
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
                  <Link to="/imprint" className="text-gray-400 hover:text-white transition-colors">
                    Imprint
                  </Link>
                </li>
                <li>
                  <Link to="/privacypolicy" className="text-gray-400 hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/cookiepolicy" className="text-gray-400 hover:text-white transition-colors">
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
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Cookie Preferences
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">© 2025 QuotaSkill. All rights reserved.</p>
            <p className="text-gray-500 text-sm">Empowering skill mastery through AI learning</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage


