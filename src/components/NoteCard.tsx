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
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative p-2 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 group-hover:from-blue-100 group-hover:to-indigo-100 transition-all duration-300 border border-blue-200">
                {/* QuotaSkill Magnifying Glass */}
                <div className="relative w-6 h-6">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    {/* Main Glass Circle */}
                    <circle cx="40" cy="40" r="25" fill="none" stroke="#3B82F6" strokeWidth="4"/>
                    
                    {/* Inner Circle */}
                    <circle cx="40" cy="40" r="15" fill="none" stroke="#3B82F6" strokeWidth="3"/>
                    <line x1="50" y1="50" x2="54" y2="54" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round"/>
                    
                    {/* Center dot */}
                    <circle cx="40" cy="40" r="2" fill="#3B82F6"/>
                    
                    {/* Handle */}
                    <line x1="60" y1="60" x2="85" y2="85" stroke="#6B7280" strokeWidth="6" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>
              <span className="text-xl font-bold text-gray-900">
                QuotaSkill
              </span>
            </Link>

            {/* Right side controls */}
            <div className="flex items-center space-x-4">
              {/* Credits display */}
              {user && (
                <div className="flex items-center space-x-2 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <Coins className="w-4 h-4 text-yellow-600" />
                  <span className="text-yellow-700 font-semibold text-sm">{credits}</span>
                </div>
              )}
              
              {/* Menu Button */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="flex items-center space-x-2 px-4 py-2 md:px-6 md:py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-300 hover:border-gray-400 rounded-lg transition-all duration-300 font-medium text-sm md:text-base"
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
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-white/98 backdrop-blur-lg border-l border-gray-200 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Navigation</h2>
            <button
              onClick={closeSidebar}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* User Info */}
            {user && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium">Signed in as</p>
                    <p className="text-gray-600 text-sm">{user.email?.split('@')[0]}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Main Navigation */}
            <div className="mb-8">
              <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wide mb-4">Main Navigation</h3>
              <div className="space-y-2">
                <Link 
                  to="/" 
                  onClick={closeSidebar}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    isActive('/') 
                      ? 'text-blue-700 bg-blue-100 border border-blue-200' 
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
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
                      ? 'text-green-700 bg-green-100 border border-green-200' 
                      : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
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
                      ? 'text-purple-700 bg-purple-100 border border-purple-200' 
                      : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
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
                      ? 'text-pink-700 bg-pink-100 border border-pink-200' 
                      : 'text-gray-700 hover:text-pink-600 hover:bg-pink-50'
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
                <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wide mb-4">My Account</h3>
                <div className="space-y-2">
                  <Link 
                    to="/dashboard" 
                    onClick={closeSidebar}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                      isActive('/dashboard') 
                        ? 'text-blue-700 bg-blue-100 border border-blue-200' 
                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
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
                        ? 'text-gray-700 bg-gray-100 border border-gray-200' 
                        : 'text-gray-700 hover:text-gray-600 hover:bg-gray-50'
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
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            {user ? (
              <div className="space-y-3">
                <Link 
                  to="/dashboard"
                  onClick={closeSidebar}
                  className="flex items-center justify-center w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-300 shadow-sm"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-3 w-full px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-300"
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
                  className="flex items-center justify-center w-full px-4 py-3 text-gray-700 hover:text-gray-900 border border-gray-300 hover:border-gray-400 rounded-lg transition-all duration-300 font-medium"
                >
                  Sign In
                </Link>
                <Link 
                  to="/register"
                  onClick={closeSidebar}
                  className="flex items-center justify-center w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-300 shadow-sm"
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



