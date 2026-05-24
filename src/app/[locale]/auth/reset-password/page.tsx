'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { Lock, Eye, EyeOff, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function ResetPasswordPage() {
  const locale = useLocale()
  const isMl = locale === 'ml'
  const router = useRouter()

  const [password,        setPassword]        = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPass,        setShowPass]        = useState(false)
  const [submitting,      setSubmitting]      = useState(false)
  const [done,            setDone]            = useState(false)
  const [error,           setError]           = useState('')

  // Supabase sends the recovery token in the URL hash; the client SDK picks it up
  // automatically when you call getSession() after page load.
  useEffect(() => {
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        // User is now in password-recovery mode – show the form
      }
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError(isMl ? 'പാസ്‌വേഡ് 8 അക്ഷരമെങ്കിലും ഉണ്ടായിരിക്കണം' : 'Password must be at least 8 characters')
      return
    }
    if (password !== confirmPassword) {
      setError(isMl ? 'പാസ്‌വേഡുകൾ ഒരുപോലെ ആയിരിക്കണം' : 'Passwords do not match')
      return
    }

    setSubmitting(true)
    const { error: updateError } = await supabase.auth.updateUser({ password })
    setSubmitting(false)

    if (updateError) {
      setError(updateError.message)
    } else {
      setDone(true)
      setTimeout(() => router.push(`/${locale}/auth`), 3000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-kerala-deep via-kerala-green to-kerala-deep flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {done ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {isMl ? 'പാസ്‌വേഡ് അപ്‌ഡേറ്റ് ആയി!' : 'Password Updated!'}
              </h2>
              <p className="text-gray-500 text-sm">
                {isMl ? 'ലോഗിൻ പേജിലേക്ക് പോകുന്നു...' : 'Redirecting you to login...'}
              </p>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-gray-800 mb-1">
                {isMl ? 'പുതിയ പാസ്‌വേഡ്' : 'Set New Password'}
              </h1>
              <p className="text-gray-500 text-sm mb-6">
                {isMl ? 'ശക്തമായ ഒരു പുതിയ പാസ്‌വേഡ് നൽകൂ.' : 'Choose a strong new password for your account.'}
              </p>

              {error && (
                <div className="flex items-center gap-2 bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* New password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isMl ? 'പുതിയ പാസ്‌വേഡ്' : 'New Password'}
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      minLength={8}
                      required
                      className="w-full pl-9 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 focus:border-kerala-green"
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Confirm password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isMl ? 'പാസ്‌വേഡ് സ്ഥിരീകരിക്കൂ' : 'Confirm Password'}
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 focus:border-kerala-green"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting || !password || !confirmPassword}
                  className="w-full bg-kerala-green hover:bg-kerala-deep text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <><Loader2 size={16} className="animate-spin" /> {isMl ? 'സേവ് ചെയ്യുന്നു...' : 'Saving...'}</>
                  ) : (
                    isMl ? 'പാസ്‌വേഡ് അപ്‌ഡേറ്റ് ചെയ്യൂ' : 'Update Password'
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
