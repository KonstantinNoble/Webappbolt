"use client"

import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useCredits } from "../contexts/CreditContext"
import { useMarketingConsent } from "../hooks/useMarketingConsent"
import {
  Settings,
  User,
  Mail,
  Coins,
  LogOut,
  Shield,
  Bell,
  Palette,
  HelpCircle,
  AlertCircle,
  CheckCircle,
  Loader,
} from "lucide-react"

const SettingsPage = () => {
  const { user, signOut } = useAuth()
  const { credits } = useCredits()
  const { hasConsent, updating, updateConsent } = useMarketingConsent()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error">("success")

  const handleSignOut = async () => {
    setLoading(true)
    try {
      await signOut()
      setMessage("Successfully signed out")
      setMessageType("success")
    } catch (error) {
      setMessage("Error signing out. Please try again.")
      setMessageType("error")
    } finally {
      setLoading(false)
    }
  }

  const showMessage = (text: string, type: "success" | "error") => {
    setMessage(text)
    setMessageType(type)
    setTimeout(() => setMessage(""), 3000)
  }

  const handleMarketingConsentToggle = async () => {
    // Optimistic UI update - immediately toggle the button
    const newConsentState = !hasConsent

    const result = await updateConsent(!hasConsent)

    if (result.success) {
      showMessage(result.message, "success")
    } else {
      // If failed, the hook will revert the state automatically
      showMessage(result.message, "error")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg">
              <Settings className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Account Settings
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Manage your account preferences and view your learning statistics.
          </p>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg border flex items-center space-x-3 ${
              messageType === "success"
                ? "bg-green-50 border-green-200 text-green-700"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            {messageType === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span>{message}</span>
          </div>
        )}

        {/* Account Information */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
            <User className="w-6 h-6" />
            <span>Account Information</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Email */}
            <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-3 mb-3">
                <Mail className="w-5 h-5 text-blue-600" />
                <h3 className="text-gray-900 font-semibold">Email Address</h3>
              </div>
              <p className="text-gray-700">{user?.email}</p>
            </div>

            {/* Credits */}
            <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-3 mb-3">
                <Coins className="w-5 h-5 text-yellow-600" />
                <h3 className="text-gray-900 font-semibold">Available Credits</h3>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-yellow-600">{credits}</span>
                <span className="text-gray-600">/ 300 monthly</span>
              </div>
              <p className="text-gray-600 text-sm mt-1">Resets every month</p>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
            <Shield className="w-6 h-6" />
            <span>Account Actions</span>
          </h2>

          <div className="space-y-4">
            {/* Sign Out */}
            <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-gray-900 font-semibold mb-2 flex items-center space-x-2">
                    <LogOut className="w-5 h-5 text-red-600" />
                    <span>Sign Out</span>
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Sign out of your account on this device. You can sign back in anytime.
                  </p>
                </div>
                <button
                  onClick={handleSignOut}
                  disabled={loading}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-sm"
                >
                  {loading ? "Signing Out..." : "Sign Out"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Preferences (Future Features) */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
            <Palette className="w-6 h-6" />
            <span>Preferences</span>
          </h2>

          <div className="space-y-4">
            {/* Marketing Emails */}
            <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-gray-900 font-semibold mb-2 flex items-center space-x-2">
                    <Bell className="w-5 h-5 text-blue-600" />
                    <span>📧 Email & Push Notifications</span>
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Stay informed with updates on new features, tips, and exclusive offers. Receive detailed newsletters
                    and promotions.
                  </p>
                  <p className="text-xs text-gray-500">
                    GDPR compliant • Unsubscribe anytime • No data sharing with third parties
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  {updating && <Loader className="w-4 h-4 text-blue-600 animate-spin" />}
                  <button
                    onClick={handleMarketingConsentToggle}
                    disabled={updating}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50 ${
                      hasConsent ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 hover:bg-gray-400"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                        hasConsent ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Help */}
            <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-gray-900 font-semibold mb-2 flex items-center space-x-2">
                    <HelpCircle className="w-5 h-5 text-purple-600" />
                    <span>Help & Support</span>
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">Get help using the platform and contact support.</p>
                  <a
                    href="mailto:quotaskill01@gmail.com"
                    className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-medium text-sm transition-colors duration-300"
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
  )
}

export default SettingsPage
