import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCredits } from '../contexts/CreditContext';
import { useMarketingConsent } from '../hooks/useMarketingConsent';
import { Settings, User, Mail, Coins, LogOut, Shield, Bell, Palette, HelpCircle, AlertCircle, CheckCircle, ToggleLeft as Toggle, Loader } from 'lucide-react';

const SettingsPage = () => {
  const { user, signOut } = useAuth();
  const { credits } = useCredits();
  const { hasConsent, updating, updateConsent } = useMarketingConsent();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
      setMessage('Successfully signed out');
      setMessageType('success');
    } catch (error) {
      setMessage('Error signing out. Please try again.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleMarketingConsentToggle = async () => {
    // Optimistic UI update - immediately toggle the button
    const newConsentState = !hasConsent;
    
    const result = await updateConsent(!hasConsent);
    
    if (result.success) {
      showMessage(result.message, 'success');
    } else {
      // If failed, the hook will revert the state automatically
      showMessage(result.message, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-gradient-to-r from-gray-400 to-gray-600 animate-pulse">
              <Settings className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-gray-400 to-gray-600 bg-clip-text text-transparent">
              Account Settings
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Manage your account preferences and view your learning statistics.
          </p>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg border flex items-center space-x-3 ${
            messageType === 'success' 
              ? 'bg-green-500/10 border-green-500/20 text-green-400' 
              : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}>
            {messageType === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span>{message}</span>
          </div>
        )}

        {/* Account Information */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
            <User className="w-6 h-6" />
            <span>Account Information</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Email */}
            <div className="p-6 bg-gray-700/30 rounded-lg border border-gray-600/50">
              <div className="flex items-center space-x-3 mb-3">
                <Mail className="w-5 h-5 text-cyan-400" />
                <h3 className="text-white font-semibold">Email Address</h3>
              </div>
              <p className="text-gray-300">{user?.email}</p>
            </div>

            {/* Credits */}
            <div className="p-6 bg-gray-700/30 rounded-lg border border-gray-600/50">
              <div className="flex items-center space-x-3 mb-3">
                <Coins className="w-5 h-5 text-yellow-400" />
                <h3 className="text-white font-semibold">Available Credits</h3>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-yellow-400">{credits}</span>
                <span className="text-gray-400">/ 300 monthly</span>
              </div>
              <p className="text-gray-400 text-sm mt-1">Resets every month</p>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
            <Shield className="w-6 h-6" />
            <span>Account Actions</span>
          </h2>
          
          <div className="space-y-4">
            {/* Sign Out */}
            <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-semibold mb-2 flex items-center space-x-2">
                    <LogOut className="w-5 h-5 text-red-400" />
                    <span>Sign Out</span>
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Sign out of your account on this device. You can sign back in anytime.
                  </p>
                </div>
                <button
                  onClick={handleSignOut}
                  disabled={loading}
                  className="px-6 py-3 bg-red-500 hover:bg-red-400 disabled:bg-red-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
                >
                  {loading ? 'Signing Out...' : 'Sign Out'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Preferences (Future Features) */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
            <Palette className="w-6 h-6" />
            <span>Preferences</span>
          </h2>
          
          <div className="space-y-4">
            {/* Marketing Emails */}
            <div className="p-6 bg-gray-700/30 rounded-lg border border-gray-600/50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-semibold mb-2 flex items-center space-x-2">
                    <Bell className="w-5 h-5 text-blue-400" />
                    <span>📧 Email & Push Notifications</span>
                  </h3>
                  <p className="text-gray-400 text-sm mb-3">
                    Stay informed with updates on new features, tips, and exclusive offers. Receive detailed newsletters and promotions.
                  </p>
                  <p className="text-xs text-gray-500">
                    GDPR compliant • Unsubscribe anytime • No data sharing with third parties
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  {updating && <Loader className="w-4 h-4 text-blue-400 animate-spin" />}
                  <button
                    onClick={handleMarketingConsentToggle}
                    disabled={updating}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 ${
                      hasConsent 
                        ? 'bg-blue-500 hover:bg-blue-400' 
                        : 'bg-gray-600 hover:bg-gray-500'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                        hasConsent ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>


            {/* Help */}
            <div className="p-6 bg-gray-700/30 rounded-lg border border-gray-600/50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-semibold mb-2 flex items-center space-x-2">
                    <HelpCircle className="w-5 h-5 text-purple-400" />
                    <span>Help & Support</span>
                  </h3>
                  <p className="text-gray-400 text-sm mb-3">
                    Get help using the platform and contact support.
                  </p>
                  <a 
                    href="mailto:quotaskill01@gmail.com"
                    className="inline-flex items-center space-x-2 text-purple-400 hover:text-purple-300 font-medium text-sm transition-colors duration-300"
                  >
                    <Mail className="w-4 h-4" />
                    <span>quotaskill01@gmail.com</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;