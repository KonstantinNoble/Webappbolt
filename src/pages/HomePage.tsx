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
  Target,
  Users,
  Award,
  Globe,
  Briefcase,
  Clock,
  Shield
} from 'lucide-react';

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-32 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              Master Any Skill with
              <span className="text-blue-600 block">AI-Powered Learning</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
              Generate personalized learning plans and test your knowledge with advanced AI technology. 
              Join thousands of professionals advancing their careers.
            </p>
            
            {!user ? (
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
                <Link 
                  to="/register"
                  className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2"
                >
                  <span>Start Free Trial</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                
                <Link 
                  to="/learning-plans"
                  className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:border-blue-600 hover:text-blue-600 transition-all duration-300"
                >
                  View Demo
                </Link>
              </div>
            ) : (
              <div className="flex justify-center mb-16">
                <Link 
                  to="/dashboard"
                  className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            )}

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16 border-t border-gray-200">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">10K+</div>
                <div className="text-gray-600 font-medium">Active Learners</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                <div className="text-gray-600 font-medium">Skill Categories</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">95%</div>
                <div className="text-gray-600 font-medium">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
                <div className="text-gray-600 font-medium">AI Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose QuotaSkill?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Challenge yourself with AI-generated quizzes tailored to your skill level and learning objectives.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Generally Quiz */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-shadow">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-4">
                  <Zap className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Generally</h3>
                <div className="text-2xl font-bold text-green-600 mb-1">50 credits</div>
                <p className="text-gray-500 text-sm">5 questions</p>
              </div>

              <ul className="space-y-3 mb-6">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-gray-600 text-sm">Basic concepts</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-gray-600 text-sm">Simple questions</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-gray-600 text-sm">Instant feedback</span>
                </li>
              </ul>

              <Link 
                to={user ? "/quiz" : "/register"}
                className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-colors text-center block"
              >
                {user ? 'Start Quiz' : 'Sign Up to Start'}
              </Link>
            </div>

            {/* Accurate Quiz */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-shadow">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-2xl mb-4">
                  <Target className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Accurate</h3>
                <div className="text-2xl font-bold text-yellow-600 mb-1">75 credits</div>
                <p className="text-gray-500 text-sm">8 questions</p>
              </div>

              <ul className="space-y-3 mb-6">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-4 h-4 text-yellow-500" />
                  <span className="text-gray-600 text-sm">Applied knowledge</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-4 h-4 text-yellow-500" />
                  <span className="text-gray-600 text-sm">Problem-solving</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-4 h-4 text-yellow-500" />
                  <span className="text-gray-600 text-sm">Detailed explanations</span>
                </li>
              </ul>

              <Link 
                to={user ? "/quiz" : "/register"}
                className="w-full bg-yellow-600 text-white py-2 rounded-lg font-medium hover:bg-yellow-700 transition-colors text-center block"
              >
                {user ? 'Start Quiz' : 'Sign Up to Start'}
              </Link>
            </div>

            {/* Precise Quiz */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-shadow">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-2xl mb-4">
                  <Star className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Precise</h3>
                <div className="text-2xl font-bold text-red-600 mb-1">100 credits</div>
                <p className="text-gray-500 text-sm">11 questions</p>
              </div>

              <ul className="space-y-3 mb-6">
                <li className="flex items-center space-x-3">
                  <Star className="w-4 h-4 text-red-500" />
                  <span className="text-gray-600 text-sm">Expert-level analysis</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Star className="w-4 h-4 text-red-500" />
                  <span className="text-gray-600 text-sm">Complex scenarios</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Star className="w-4 h-4 text-red-500" />
                  <span className="text-gray-600 text-sm">Advanced insights</span>
                </li>
              </ul>

              <Link 
                to={user ? "/quiz" : "/register"}
                className="w-full bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700 transition-colors text-center block"
              >
                {user ? 'Start Quiz' : 'Sign Up to Start'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section id="about" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Complete Learning Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to accelerate your learning journey and achieve your professional goals.
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
                Track your learning progress with comprehensive analytics and performance insights.
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
              <p className="text-gray-600">
                Organize your learning materials and track personal learning objectives.
              </p>
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
                Powered by the latest AI models including GPT-4o for premium learning experiences.
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
                  <p className="text-gray-500 text-sm">10K+ Learners</p>
                </div>
              </div>
              <p className="text-gray-600">
                Join a thriving community of professionals advancing their careers through learning.
              </p>
            </div>

            {/* Security */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <Shield className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Secure Platform</h3>
                  <p className="text-gray-500 text-sm">Enterprise Grade</p>
                </div>
              </div>
              <p className="text-gray-600">
                Your data is protected with enterprise-grade security and privacy measures.
              </p>
            </div>

            {/* 24/7 Support */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">24/7 Support</h3>
                  <p className="text-gray-500 text-sm">Always Available</p>
                </div>
              </div>
              <p className="text-gray-600">
                Get help whenever you need it with our round-the-clock AI-powered support system.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
            Join thousands of professionals who are already advancing their careers with AI-powered education.
          </p>
          
          {!user ? (
            <div className="space-y-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-4xl mb-4">🎁</div>
                    <h3 className="text-lg font-semibold text-white mb-2">300 Free Credits</h3>
                    <p className="text-blue-100 text-sm">Every month, automatically</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl mb-4">⚡</div>
                    <h3 className="text-lg font-semibold text-white mb-2">Instant Access</h3>
                    <p className="text-blue-100 text-sm">Start learning immediately</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl mb-4">🚫</div>
                    <h3 className="text-lg font-semibold text-white mb-2">No Credit Card</h3>
                    <p className="text-blue-100 text-sm">100% free to get started</p>
                  </div>
                </div>
                
                <Link 
                  to="/register"
                  className="inline-flex items-center space-x-3 bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <span>Start Your Free Trial</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
              
              <p className="text-blue-200 font-medium">
                ✨ Join 10,000+ learners already using QuotaSkill
              </p>
            </div>
          ) : (
            <div>
              <p className="text-xl text-blue-100 mb-8">
                Welcome back! Continue your learning journey.
              </p>
              <Link 
                to="/dashboard"
                className="inline-flex items-center space-x-2 bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
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
                      <circle cx="40" cy="40" r="25" fill="none" stroke="white" strokeWidth="4"/>
                      <circle cx="40" cy="40" r="15" fill="none" stroke="white" strokeWidth="3"/>
                      <line x1="60" y1="60" x2="85" y2="85" stroke="white" strokeWidth="6" strokeLinecap="round"/>
                      <circle cx="40" cy="40" r="2" fill="white"/>
                    </svg>
                  </div>
                </div>
                <span className="text-2xl font-bold">QuotaSkill</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
                Empowering professionals worldwide with AI-powered learning solutions. 
                Master new skills, advance your career, and achieve your goals.
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
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
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
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
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
                      e.preventDefault();
                      window.displayPreferenceModal?.();
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
            <p className="text-gray-400 mb-4 md:mb-0">
              © 2025 QuotaSkill. All rights reserved.
            </p>
            <p className="text-gray-500 text-sm">
              Empowering learning with artificial intelligence
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;-gray-600 max-w-3xl mx-auto">
              Our AI-powered platform provides personalized learning experiences that adapt to your goals and schedule.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {/* Feature 1 */}
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-6 group-hover:bg-blue-200 transition-colors">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Personalized Learning Plans</h3>
              <p className="text-gray-600 leading-relaxed">
                AI creates customized learning paths based on your current knowledge, goals, and preferred learning style.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-6 group-hover:bg-green-200 transition-colors">
                <Target className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Adaptive Assessments</h3>
              <p className="text-gray-600 leading-relaxed">
                Smart quizzes that adjust difficulty in real-time to challenge you at the perfect level for optimal learning.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-2xl mb-6 group-hover:bg-purple-200 transition-colors">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Progress Tracking</h3>
              <p className="text-gray-600 leading-relaxed">
                Comprehensive analytics and insights to track your learning journey and celebrate your achievements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Tiers Section */}
      <section id="pricing" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Choose Your Learning Level
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Two quality tiers designed to match your learning needs and budget. Start with 300 free credits every month.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Basic Tier */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 relative hover:shadow-xl transition-shadow">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Basic</h3>
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <span className="text-4xl font-bold text-blue-600">120</span>
                  <span className="text-gray-500">credits</span>
                </div>
                <p className="text-gray-500">Powered by GPT-4o Mini</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Comprehensive learning plans</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Quality curated resources</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Industry insights</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Practical exercises</span>
                </li>
              </ul>

              <Link 
                to={user ? "/learning-plans" : "/register"}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center block"
              >
                {user ? 'Create Learning Plan' : 'Get Started'}
              </Link>
            </div>

            {/* Premium Tier */}
            <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-200 p-8 relative hover:shadow-xl transition-shadow">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold">Most Popular</span>
              </div>
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Premium</h3>
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <span className="text-4xl font-bold text-blue-600">160</span>
                  <span className="text-gray-500">credits</span>
                </div>
                <p className="text-gray-500">Powered by GPT-4o</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center space-x-3">
                  <Star className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <span className="text-gray-700">Expert-level learning plans</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Star className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <span className="text-gray-700">Premium resources & content</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Star className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <span className="text-gray-700">Advanced career guidance</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Star className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <span className="text-gray-700">Cutting-edge insights</span>
                </li>
              </ul>

              <Link 
                to={user ? "/learning-plans" : "/register"}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center block"
              >
                {user ? 'Create Learning Plan' : 'Get Started'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quiz Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Test Your Knowledge
            </h2>
            <p className="text-xl text
