'use client'

import { useState } from 'react'
import { Lock, Loader2 } from 'lucide-react'

interface AdminAuthProps {
  onSuccess: () => void
}

/**
 * Renders an admin password login UI that authenticates the entered password, stores a returned token in `sessionStorage` and `localStorage`, displays errors on failure, and invokes a success callback on successful authentication.
 *
 * @param onSuccess - Callback invoked after successful authentication.
 * @returns The component's JSX element.
 */
export default function AdminAuth({ onSuccess }: AdminAuthProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Invalid password')
        setLoading(false)
        return
      }

      // Store token in sessionStorage
      if (data.token) {
        sessionStorage.setItem('adminToken', data.token)
      }

      // Store in localStorage as well for persistence
      localStorage.setItem('adminToken', data.token)

      setPassword('')
      onSuccess()
    } catch (err) {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Lock Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <Lock className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Card */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-white mb-2 text-center">
            Admin Panel
          </h1>
          <p className="text-slate-400 text-center mb-8">
            Enter your password to access the admin dashboard
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                placeholder="Enter admin password"
                className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-900/20 border border-red-700 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !password}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Access Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-slate-500 text-xs text-center mt-6">
            Session will be remembered in your browser
          </p>
        </div>
      </div>
    </div>
  )
}
