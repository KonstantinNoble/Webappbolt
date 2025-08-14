import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { User } from '@supabase/supabase-js';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import LearningPlansPage from './pages/LearningPlansPage';
import QuizPage from './pages/QuizPage';
import SettingsPage from './pages/SettingsPage';
import PersonalLearningHubPage from './pages/PersonalLearningHubPage';
import { AuthProvider } from './contexts/AuthContext';
import { CreditProvider } from './contexts/CreditContext';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import CookiePolicyPage from './pages/CookiePolicyPage';
import ImprintPage from './pages/ImprintPage';
function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session with error handling
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.warn('Session error:', error.message);
        // Clear invalid session data
        supabase.auth.signOut();
        setUser(null);
      } else {
        setUser(session?.user ?? null);
      }
      setLoading(false);
    });

    // Listen for auth changes with error handling
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed successfully');
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
      }
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <CreditProvider>
        <Router>
          <div className="min-h-screen bg-gray-900 text-white">
            <Navbar />
            <main className="pt-16">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route 
                  path="/login" 
                  element={user ? <Navigate to="/dashboard" /> : <LoginPage />} 
                />
                <Route 
                  path="/register" 
                  element={user ? <Navigate to="/dashboard" /> : <RegisterPage />} 
                />
                <Route 
                  path="/dashboard" 
                  element={user ? <DashboardPage /> : <Navigate to="/login" />} 
                />
                <Route path="/learning-plans" element={<LearningPlansPage />} />
                <Route path="/quiz" element={<QuizPage />} />
                <Route 
                  path="/learning-hub" 
                  element={user ? <PersonalLearningHubPage /> : <Navigate to="/login" />} 
                />
                <Route 
                  path="/settings" 
                  element={user ? <SettingsPage /> : <Navigate to="/login" />} 
                />
                <Route path="/cookie-richtlinie" element={<CookiePolicyPage />} />
                <Route path="/datenschutz" element={<PrivacyPolicyPage />} />
                <Route path="/Impressum" element={<ImprintPage />} />
                
          
                
              </Routes>
            </main>
          </div>
        </Router>
      </CreditProvider>
    </AuthProvider>
  );
}

export default App;