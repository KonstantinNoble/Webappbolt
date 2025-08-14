import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCredits } from '../contexts/CreditContext';
import { 
  Brain,
  Home, 
  BookOpen, 
  HelpCircle, 
  Settings, 
  LogOut,
  Coins,
  Menu,
  X,
  User
} from 'lucide-react';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const { credits } = useCredits();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsSidebarOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-lg border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="relative p-2 rounded-xl bg-gradient-to-br from-gray-800/80 to-gray-900/80 group-hover:from-gray-700/80 group-hover:to-gray-800/80 transition-all duration-300 shadow-lg shadow-cyan-400/20 group-hover:shadow-xl group-hover:shadow-cyan-400/30 border-2 border-cyan-400/30 group-hover:border-cyan-400/50">
                {/* Minimalist QuotaSkill Magnifying Glass */}
                <div className="relative w-6 h-6">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    {/* Main Glass Circle - Gradient matching website */}
                    <circle cx="40" cy="40" r="25" fill="none" stroke="url(#glassGradient)" strokeWidth="4"/>
                    
                    {/* QuotaSkill "Q" - Simple and clean */}
                    <circle cx="40" cy="40" r="15" fill="none" stroke="#06B6D4" strokeWidth="3"/>
                    <path d="M 40 25 A 15 15 0 1 1 40 55" fill="none" stroke="#06B6D4" strokeWidth="3"/>
                    <line x1="50" y1="50" x2="54" y2="54" stroke="#06B6D4" strokeWidth="3" strokeLinecap="round"/>
                    
                    {/* Center dot */}
                    <circle cx="40" cy="40" r="2" fill="#06B6D4"/>
                    
                    {/* Minimalist Handle - Gradient */}
                    <line x1="60" y1="60" x2="85" y2="85" stroke="url(#handleGradient)" strokeWidth="6" strokeLinecap="round"/>
                    
                    {/* Gradients */}
                    <defs>
                      <linearGradient id="glassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#06B6D4" />
                        <stop offset="50%" stopColor="#8B5CF6" />
                        <stop offset="100%" stopColor="#EC4899" />
                      </linearGradient>
                      <linearGradient id="handleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#374151" />
                        <stop offset="100%" stopColor="#6B7280" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
              <span className="text-xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent tracking-wide">
                QuotaSkill
              </span>
            </Link>

            {/* Right side controls */}
            <div className="flex items-center space-x-4">
              {/* Credits display */}
              {user && (
                <div className="flex items-center space-x-2 px-3 py-2 bg-yellow-400/10 border border-yellow-400/20 rounded-lg">
                  <Coins className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-400 font-semibold text-sm">{credits}</span>
                </div>
              )}
              
              {/* Menu Button */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="flex items-center space-x-2 px-4 py-2 md:px-6 md:py-3 text-gray-300 hover:text-white hover:bg-gray-700/50 border border-gray-600 hover:border-gray-500 rounded-lg transition-all duration-300 font-medium text-sm md:text-base"
              >
                <Menu className="w-5 h-5" />
                <span>Menu</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-gray-900/98 backdrop-blur-lg border-l border-gray-700 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">Navigation</h2>
            <button
              onClick={closeSidebar}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* User Info */}
            {user && (
              <div className="mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-cyan-400/20 rounded-lg">
                    <User className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Signed in as</p>
                    <p className="text-gray-400 text-sm">{user.email?.split('@')[0]}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Main Navigation */}
            <div className="mb-8">
              <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wide mb-4">Main Navigation</h3>
              <div className="space-y-2">
                <Link 
                  to="/" 
                  onClick={closeSidebar}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    isActive('/') 
                      ? 'text-cyan-400 bg-cyan-400/10 border border-cyan-400/20' 
                      : 'text-gray-300 hover:text-cyan-400 hover:bg-cyan-400/5'
                  }`}
                >
                  <Home className="w-5 h-5" />
                  <span className="font-medium">Home</span>
                </Link>
                
                <Link 
                  to="/learning-plans" 
                  onClick={closeSidebar}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    isActive('/learning-plans') 
                      ? 'text-green-400 bg-green-400/10 border border-green-400/20' 
                      : 'text-gray-300 hover:text-green-400 hover:bg-green-400/5'
                  }`}
                >
                  <BookOpen className="w-5 h-5" />
                  <span className="font-medium">Learning Plans</span>
                </Link>
                
                <Link 
                  to="/quiz" 
                  onClick={closeSidebar}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    isActive('/quiz') 
                      ? 'text-purple-400 bg-purple-400/10 border border-purple-400/20' 
                      : 'text-gray-300 hover:text-purple-400 hover:bg-purple-400/5'
                  }`}
                >
                  <HelpCircle className="w-5 h-5" />
                  <span className="font-medium">Quiz</span>
                </Link>
                
                <Link 
                  to="/learning-hub" 
                  onClick={closeSidebar}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    isActive('/learning-hub') 
                      ? 'text-pink-400 bg-pink-400/10 border border-pink-400/20' 
                      : 'text-gray-300 hover:text-pink-400 hover:bg-pink-400/5'
                  }`}
                >
                  <BookOpen className="w-5 h-5" />
                  <span className="font-medium">Learning Hub</span>
                </Link>
              </div>
            </div>

            {/* User Area */}
            {user && (
              <div className="mb-8">
                <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wide mb-4">My Account</h3>
                <div className="space-y-2">
                  <Link 
                    to="/dashboard" 
                    onClick={closeSidebar}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                      isActive('/dashboard') 
                        ? 'text-blue-400 bg-blue-400/10 border border-blue-400/20' 
                        : 'text-gray-300 hover:text-blue-400 hover:bg-blue-400/5'
                    }`}
                  >
                    <Brain className="w-5 h-5" />
                    <span className="font-medium">Dashboard</span>
                  </Link>
                  
                  <Link 
                    to="/settings" 
                    onClick={closeSidebar}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                      isActive('/settings') 
                        ? 'text-gray-400 bg-gray-400/10 border border-gray-400/20' 
                        : 'text-gray-300 hover:text-gray-400 hover:bg-gray-400/5'
                    }`}
                  >
                    <Settings className="w-5 h-5" />
                    <span className="font-medium">Settings</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Footer */}
          <div className="p-6 border-t border-gray-700">
            {user ? (
              <div className="space-y-3">
                <Link 
                  to="/dashboard"
                  onClick={closeSidebar}
                  className="flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 rounded-lg font-bold transition-all duration-300 shadow-lg"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-3 w-full px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-all duration-300"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Link 
                  to="/login"
                  onClick={closeSidebar}
                  className="flex items-center justify-center w-full px-4 py-3 text-gray-300 hover:text-white border border-gray-600 hover:border-gray-500 rounded-lg transition-all duration-300 font-medium"
                >
                  Sign In
                </Link>
                <Link 
                  to="/register"
                  onClick={closeSidebar}
                  className="flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 rounded-lg font-bold transition-all duration-300 shadow-lg"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;