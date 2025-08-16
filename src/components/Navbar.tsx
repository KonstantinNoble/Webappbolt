import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext'; // Removed this problematic import
// import { useCredits } from '../contexts/CreditContext'; // Removed this problematic import
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
  User,
  FileText,
  Target,
  Award,
  Zap
} from 'lucide-react';

const Navbar = () => {
  // Since we cannot resolve the contexts, we'll simulate the user and credits data.
  // Set user to null to see the logged-out state, or an object to see the logged-in state.
  const user = { email: 'user@example.com' }; // or null
  const credits = 300; // Example credit amount
  
  // A mock signOut function
  const signOut = async () => {
      console.log("Signing out...");
      // In a real app, this would clear the user session.
      // For this mock, we can't change the 'user' const directly, 
      // but we are simulating the action.
  };

  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

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

  const navigationLinks = [
    {
      name: 'Features',
      href: '/learning-plans',
      icon: BookOpen,
      color: 'text-green-600 hover:bg-green-50',
      activeColor: 'text-green-700 bg-green-100 border-green-200'
    },
    {
      name: 'Quiz',
      href: '/quiz',
      icon: HelpCircle,
      color: 'text-purple-600 hover:bg-purple-50',
      activeColor: 'text-purple-700 bg-purple-100 border-purple-200'
    },
    {
      name: 'Learning Hub',
      href: '/learning-hub',
      icon: FileText,
      color: 'text-pink-600 hover:bg-pink-50',
      activeColor: 'text-pink-700 bg-pink-100 border-pink-200'
    }
  ];

  // Show Dashboard link only for authenticated users
  if (user) {
    navigationLinks.push({
      name: 'Dashboard',
      href: '/dashboard',
      icon: Brain,
      color: 'text-blue-600 hover:bg-blue-50',
      activeColor: 'text-blue-700 bg-blue-100 border-blue-200'
    });
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative p-2 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 group-hover:from-blue-100 group-hover:to-indigo-100 transition-all duration-300">
                <div className="relative w-8 h-8">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <circle cx="40" cy="40" r="25" fill="none" stroke="#3B82F6" strokeWidth="4"/>
                    <circle cx="40" cy="40" r="15" fill="none" stroke="#3B82F6" strokeWidth="3"/>
                    <line x1="60" y1="60" x2="85" y2="85" stroke="#6B7280" strokeWidth="6" strokeLinecap="round"/>
                    <circle cx="40" cy="40" r="2" fill="#3B82F6"/>
                  </svg>
                </div>
              </div>
              <span className="text-2xl font-bold text-gray-900">QuotaSkill</span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              
              {/* Additional links for non-authenticated users */}
              {!user && (
                <>
                  <a href="#pricing" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                    Pricing
                  </a>
                  <a href="#about" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                    About
                  </a>
                </>
              )}
            </div>

            {/* Right Side Controls */}
            <div className="flex items-center space-x-4">
              {/* Credits Display */}
              {user && (
                <div className="flex items-center space-x-2 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <Coins className="w-4 h-4 text-yellow-600" />
                  <span className="text-yellow-700 font-semibold text-sm">{credits}</span>
                </div>
              )}

              {/* Desktop Auth Buttons */}
              {!user && (
                <div className="hidden md:flex items-center space-x-4">
                  <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                    Sign In
                  </Link>
                  <Link 
                    to="/register"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Get Started
                  </Link>
                </div>
              )}

              {/* Authenticated User Quick Action */}
              {user && (
                <Link 
                  to="/dashboard"
                  className="hidden md:inline-flex bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Dashboard
                </Link>
              )}
              
              {/* Menu Button */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-300 hover:border-gray-400 rounded-lg transition-all duration-300 font-medium"
              >
                <Menu className="w-5 h-5" />
                <span className="hidden sm:inline">Menu</span>
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

      {/* Enhanced Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-white border-l border-gray-200 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Menu className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Navigation</h2>
            </div>
            <button
              onClick={closeSidebar}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-all duration-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* User Info */}
            {user && (
              <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium">Welcome back!</p>
                    <p className="text-gray-600 text-sm">{user.email?.split('@')[0]}</p>
                  </div>
                </div>
                
                {/* Credits in Sidebar */}
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm text-gray-700">Credits:</span>
                    <span className="text-sm font-semibold text-yellow-700">{credits}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Main Pages Navigation */}
            <div className="mb-8">
              <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wide mb-4">Main Pages</h3>
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
                
                {navigationLinks.map((link) => {
                  const IconComponent = link.icon;
                  return (
                    <Link 
                      key={link.href}
                      to={link.href} 
                      onClick={closeSidebar}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                        isActive(link.href) 
                          ? `${link.activeColor} border` 
                          : `text-gray-700 hover:${link.color}`
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                      <span className="font-medium">{link.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Account Section for authenticated users */}
            {user && (
              <div className="mb-8">
                <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wide mb-4">My Account</h3>
                <div className="space-y-2">
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
                  Go to Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center justify-center space-x-3 w-full px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-300"
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
                  Get Started Free
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
