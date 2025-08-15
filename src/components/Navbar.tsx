import React, { useState } from 'react';
// HINWEIS: Stellen Sie sicher, dass 'react-router-dom' installiert ist.
// npm install react-router-dom
import { Link, useLocation } from 'react-router-dom';
// HINWEIS: Stellen Sie sicher, dass 'lucide-react' installiert ist.
// npm install lucide-react
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

// Mock-Kontexte für die eigenständige Lauffähigkeit der Komponente
// In Ihrer echten App würden Sie Ihre tatsächlichen AuthContext und CreditContext verwenden
const useAuth = () => ({
  user: { email: 'user@example.com' },
  signOut: async () => console.log('Abgemeldet'),
});
const useCredits = () => ({ credits: 120 });


const Navbar = () => {
  const { user, signOut } = useAuth();
  const { credits } = useCredits();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Hilfsfunktion, um den aktiven Link basierend auf dem Pfad zu bestimmen
  const isActive = (path) => location.pathname === path;

  // Funktion zum Abmelden des Benutzers
  const handleSignOut = async () => {
    try {
      await signOut();
      setIsSidebarOpen(false); // Schließt die Seitenleiste nach dem Abmelden
    } catch (error) {
      console.error('Fehler beim Abmelden:', error);
    }
  };

  // Funktion zum Schließen der Seitenleiste
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Einheitliche Stilklassen für Navigationslinks in der Seitenleiste
  const navLinkClasses = (path, color) => `
    flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300
    ${isActive(path)
      ? `text-${color}-400 bg-${color}-500/10 border border-${color}-500/20 font-semibold`
      : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
    }
  `;

  return (
    <>
      {/* Haupt-Navigationsleiste */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo und Markenname */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="p-2 rounded-lg bg-gray-800 group-hover:bg-gray-700 transition-colors duration-300">
                {/* Vereinfachtes SVG-Logo, das dem Screenshot entspricht */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="10.5" cy="10.5" r="7" stroke="#38bdf8" strokeWidth="2"/>
                  <line x1="15.5" y1="15.5" x2="20" y2="20" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="text-xl font-bold text-white tracking-wide">
                QuotaSkill
              </span>
            </Link>

            {/* Rechte Seite: Credits und Menü-Button */}
            <div className="flex items-center space-x-4">
              {user && (
                <div className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg">
                  <Coins className="w-4 h-4 text-yellow-400" />
                  <span className="text-white font-semibold text-sm">{credits}</span>
                </div>
              )}
              
              {/* Menü-Button zum Öffnen der Seitenleiste */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-300 font-medium text-sm"
              >
                <Menu className="w-5 h-5" />
                <span className="hidden sm:inline">Menu</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Overlay für die Seitenleiste, wird angezeigt, wenn die Seitenleiste geöffnet ist */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={closeSidebar}
        />
      )}

      {/* Seitenleiste */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-gray-900/95 backdrop-blur-lg border-l border-gray-700 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Kopfzeile der Seitenleiste */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">Navigation</h2>
            <button
              onClick={closeSidebar}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors duration-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Hauptinhalt der Seitenleiste */}
          <div className="flex-1 overflow-y-auto p-6">
            {user && (
              <div className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <User className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Angemeldet als</p>
                    <p className="text-gray-400 text-sm">{user.email?.split('@')[0]}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Hauptnavigation */}
            <div className="mb-8">
              <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wide mb-4">Hauptmenü</h3>
              <div className="space-y-2">
                <Link to="/" onClick={closeSidebar} className={navLinkClasses('/', 'sky')}>
                  <Home className="w-5 h-5" />
                  <span className="font-medium">Home</span>
                </Link>
                <Link to="/learning-plans" onClick={closeSidebar} className={navLinkClasses('/learning-plans', 'green')}>
                  <BookOpen className="w-5 h-5" />
                  <span className="font-medium">Lernpläne</span>
                </Link>
                <Link to="/quiz" onClick={closeSidebar} className={navLinkClasses('/quiz', 'purple')}>
                  <HelpCircle className="w-5 h-5" />
                  <span className="font-medium">Quiz</span>
                </Link>
                <Link to="/learning-hub" onClick={closeSidebar} className={navLinkClasses('/learning-hub', 'pink')}>
                  <Brain className="w-5 h-5" />
                  <span className="font-medium">Lernzentrum</span>
                </Link>
              </div>
            </div>

            {/* Benutzerbereich */}
            {user && (
              <div className="mb-8">
                <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wide mb-4">Mein Konto</h3>
                <div className="space-y-2">
                  <Link to="/dashboard" onClick={closeSidebar} className={navLinkClasses('/dashboard', 'blue')}>
                    <Settings className="w-5 h-5" />
                    <span className="font-medium">Dashboard</span>
                  </Link>
                  <Link to="/settings" onClick={closeSidebar} className={navLinkClasses('/settings', 'gray')}>
                    <Settings className="w-5 h-5" />
                    <span className="font-medium">Einstellungen</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Fußzeile der Seitenleiste */}
          <div className="p-6 border-t border-gray-700">
            {user ? (
              <div className="space-y-3">
                <Link
                  to="/dashboard"
                  onClick={closeSidebar}
                  className="flex items-center justify-center w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors duration-300 shadow-lg"
                >
                  Zum Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center justify-center w-full space-x-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors duration-300"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Abmelden</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Link
                  to="/login"
                  onClick={closeSidebar}
                  className="flex items-center justify-center w-full px-4 py-3 text-gray-300 hover:text-white border border-gray-600 hover:border-gray-500 hover:bg-gray-800 rounded-lg transition-colors duration-300 font-medium"
                >
                  Anmelden
                </Link>
                <Link
                  to="/register"
                  onClick={closeSidebar}
                  className="flex items-center justify-center w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors duration-300 shadow-lg"
                >
                  Registrieren
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// Da wir uns nicht in einer vollständigen React-Anwendung mit Routing befinden,
// exportieren wir die Komponente zur potenziellen Verwendung.
export default Navbar;
