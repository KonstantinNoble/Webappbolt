import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
// Dummy-Kontexte, um den Code in einer isolierten Umgebung lauffähig zu machen.
// In einer echten Anwendung würden diese aus den entsprechenden Kontext-Dateien importiert.
const useAuth = () => ({ user: { email: 'user@example.com' }, signOut: () => console.log('Signing out...') });
const useCredits = () => ({ credits: 0 });
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

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="relative p-2 rounded-xl bg-gradient-to-br from-gray-100 to-white group-hover:from-gray-50 group-hover:to-gray-100 transition-all duration-300 shadow-md shadow-fuchsia-300/50 group-hover:shadow-lg group-hover:shadow-fuchsia-400/60 border-2 border-fuchsia-400/30 group-hover:border-fuchsia-400/50">
                {/* Minimalist QuotaSkill Magnifying Glass */}
                <div className="relative w-6 h-6">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    {/* Main Glass Circle - Gradient matching website */}
                    <circle cx="40" cy="40" r="25" fill="none" stroke="url(#glassGradient)" strokeWidth="4"/>
                    
                    {/* QuotaSkill "Q" - Simple and clean */}
                    <circle cx="40" cy="40" r="15" fill="none" stroke="#6D28D9" strokeWidth="3"/>
                    <path d="M 40 25 A 15 15 0 1 1 40 55" fill="none" stroke="#6D28D9" strokeWidth="3"/>
                    <line x1="50" y1="50" x2="54" y2="54" stroke="#6D28D9" strokeWidth="3" strokeLinecap="round"/>
                    
                    {/* Center dot */}
                    <circle cx="40" cy="40" r="2" fill="#6D28D9"/>
                    
                    {/* Minimalist Handle - Gradient */}
                    <line x1="60" y1="60" x2="85" y2="85" stroke="url(#handleGradient)" strokeWidth="6" strokeLinecap="round"/>
                    
                    {/* Gradients */}
                    <defs>
                      <linearGradient id="glassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8B5CF6" />
                        <stop offset="50%" stopColor="#EC4899" />
                        <stop offset="100%" stopColor="#EF4444" />
                      </linearGradient>
                      <linearGradient id="handleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#F87171" />
                        <stop offset="100%" stopColor="#FCA5A5" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
              <span className="text-xl font-black bg-gradient-to-r from-violet-500 to-rose-500 bg-clip-text text-transparent tracking-wide">
                QuotaSkill
              </span>
            </Link>

            {/* Right side controls */}
            <div className="flex items-center space-x-4">
              {/* Credits display */}
              {user && (
                <div className="flex items-center space-x-2 px-3 py-2 bg-yellow-400/10 border border-yellow-400/20 rounded-lg">
                  <Coins className="w-4 h-4 text-yellow-400" />
                  <span className="text-gray-900 font-semibold text-sm">{credits}</span>
                </div>
              )}
              
              {/* Menu Button */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="flex items-center space-x-2 px-4 py-2 md:px-6 md:py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-100/50 border border-gray-400 hover:border-gray-500 rounded-lg transition-all duration-300 font-medium text-sm md:text-base"
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
      <div className={`fixed top-0 right-0 h-full w-80 bg-white/98 backdrop-blur-lg border-l border-gray-200 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Navigation</h2>
            <button
              onClick={closeSidebar}
              className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* User Info */}
            {user && (
              <div className="mb-6 p-4 bg-gray-100/50 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-400/20 rounded-lg">
                    <User className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium">Signed in as</p>
                    <p className="text-gray-500 text-sm">{user.email?.split('@')[0]}</p>
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
                      ? 'text-blue-500 bg-blue-500/10 border border-blue-500/20' 
                      : 'text-gray-700 hover:text-blue-500 hover:bg-blue-500/5'
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
                      ? 'text-green-500 bg-green-500/10 border border-green-500/20' 
                      : 'text-gray-700 hover:text-green-500 hover:bg-green-500/5'
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
                      ? 'text-purple-500 bg-purple-500/10 border border-purple-500/20' 
                      : 'text-gray-700 hover:text-purple-500 hover:bg-purple-500/5'
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
                      ? 'text-pink-500 bg-pink-500/10 border border-pink-500/20' 
                      : 'text-gray-700 hover:text-pink-500 hover:bg-pink-500/5'
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
                        ? 'text-blue-500 bg-blue-500/10 border border-blue-500/20' 
                        : 'text-gray-700 hover:text-blue-500 hover:bg-blue-500/5'
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
                        ? 'text-gray-500 bg-gray-500/10 border border-gray-500/20' 
                        : 'text-gray-700 hover:text-gray-500 hover:bg-gray-500/5'
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
          <div className="p-6 border-t border-gray-200">
            {user ? (
              <div className="space-y-3">
                <Link 
                  to="/dashboard"
                  onClick={closeSidebar}
                  className="flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white rounded-lg font-bold transition-all duration-300 shadow-lg"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-3 w-full px-4 py-3 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-300"
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
                  className="flex items-center justify-center w-full px-4 py-3 text-gray-700 hover:text-gray-900 border border-gray-400 hover:border-gray-500 rounded-lg transition-all duration-300 font-medium"
                >
                  Sign In
                </Link>
                <Link 
                  to="/register"
                  onClick={closeSidebar}
                  className="flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white rounded-lg font-bold transition-all duration-300 shadow-lg"
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
