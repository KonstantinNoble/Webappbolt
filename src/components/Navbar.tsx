























import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
// Die Context-Dateien wurden aktiviert.
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
  User,
  FileText,
  Target,
  Award,
  Zap
} from 'lucide-react';

const Navbar = () => {
  // Use the actual hooks to get user and credit data
  const { user, signOut } = useAuth();
  const { credits, fetchCredits } = useCredits();

  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  // Fetch credits when the user is available
  useEffect(() => {
    // Check if fetchCredits exists before calling it
    if (user && fetchCredits) {
      fetchCredits();
    }
  }, [user, fetchCredits]);


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
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      color: 'text-gray-600 hover:bg-gray-50',
      activeColor: 'text-gray-700 bg-gray-100 border-gray-200'
    }
  ];

  // Show the Dashboard link only for authenticated users
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

            {/* Desktop-Navigationslinks entfernt, durch einen Homepage-Button ersetzt */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                Homepage
              </Link>
            </div>

            {/* Right-side controls */}
            <div className="flex items-center space-x-4">
              {/* Credits display */}
              {user && (
                <div className="flex items-center space-x-2 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <Coins className="w-4 h-4 text-yellow-600" />
                  <span className="text-yellow-700 font-semibold text-sm">{credits}</span>
                </div>
              )}

              {/* Desktop authentication buttons */}
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

              {/* Quick action for authenticated users */}
              {user && (
                <Link 
                  to="/dashboard"
                  className="hidden md:inline-flex bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Dashboard
                </Link>
              )}

              {/* Menu button */}
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

      {/* Sidebar overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" 
          onClick={closeSidebar} 
        />
      )}

      {/* Improved sidebar */}
      <div 
        className={`fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-white border-l border-gray-200 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-6 h-full flex flex-col">
          {/* Sidebar header */}
          <div className="flex justify-between items-center pb-4 border-b border-gray-200">
            <Link to="/" onClick={closeSidebar}>
              <span className="text-2xl font-bold text-gray-900">QuotaSkill</span>
            </Link>
            <button onClick={closeSidebar} className="text-gray-500 hover:text-gray-900">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Sidebar navigation */}
          <div className="flex-1 mt-6 space-y-2">
            {navigationLinks.map((link) => (
              <Link 
                key={link.href}
                to={link.href} 
                onClick={closeSidebar}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                  isActive(link.href)
                    ? `${link.activeColor} border ${link.activeColor.replace('bg-', 'border-')} font-semibold`
                    : `${link.color} font-medium`
                }`}
              >
                <link.icon className={`w-5 h-5 ${
                  isActive(link.href)
                    ? link.activeColor.replace('text-', '')
                    : link.color.replace('hover:bg-', '').replace('text-', '')
                }`} />
                <span>{link.name}</span>
              </Link>
            ))}

            {/* Additional links for unauthenticated users */}
            {!user && (
              <>
                <a 
                  href="#pricing"
                  onClick={closeSidebar}
                  className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors duration-200 font-medium"
                >
                  <Coins className="w-5 h-5 text-gray-400" />
                  <span>Pricing</span>
                </a>
                <a
                  href="#about"
                  onClick={closeSidebar}
                  className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors duration-200 font-medium"
                >
                  <Home className="w-5 h-5 text-gray-400" />
                  <span>About</span>
                </a>
              </>
            )}

            {/* User profile section if logged in */}
            {user && (
              <div className="pt-6 mt-6 border-t border-gray-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-1 border border-gray-200 rounded-full">
                    <User className="w-6 h-6 text-gray-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-800">
                      {user.email}
                    </span>
                    <div className="flex items-center space-x-1 mt-1">
                      <Coins className="w-4 h-4 text-yellow-500" />
                      <span className="text-xs font-medium text-yellow-600">
                        {credits} Credits
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar footer */}
          <div className="mt-auto pt-6 border-t border-gray-200">
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
