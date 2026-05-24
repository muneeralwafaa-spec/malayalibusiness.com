'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { Mail, ArrowLeft, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function ForgotPasswordPage() {
  const locale = useLocale()
  const isMl = locale === 'ml'

  const [email,       setEmail]       = useState('')
  const [submitting,  setSubmitting]  = useState(false)
  const [sent,        setSent]        = useState(false)
  const [error,       setError]       = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setSubmitting(true)
    setError('')

    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/${locale}/auth/reset-password`,
    })

    setSubmitting(false)

    if (resetError) {
      setError(resetError.message)
    } else {
      setSent(true)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-kerala-deep via-kerala-green to-kerala-deep flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Back link */}
          <Link
            href={`/${locale}/auth`}
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-kerala-green mb-6 transition-colors"
          >
            <ArrowLeft size={15} />
            {isMl ? 'ലോഗിനിലേക്ക് മടങ്ങുക' : 'Back to Login'}
          </Link>

          {sent ? (
            /* ── Success state ── */
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {isMl ? 'ഇമെയിൽ അയച്ചു!' : 'Email Sent!'}
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                {isMl
                  ? `${email} എന്ന വിലാസത്തിൽ പാസ്‌വേഡ് റീസെറ്റ് ലിങ്ക് അയച്ചിരിക്കുന്നു.`
                  : `We sent a password reset link to ${email}. Check your inbox (and spam folder).`
                }
              </p>
              <Link
                href={`/${locale}/auth`}
                className="inline-block bg-kerala-green text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-kerala-deep transition-colors"
              >
                {isMl ? 'ലോഗിൻ' : 'Back to Login'}
              </Link>
            </div>
          ) : (
            /* ── Form ── */
            <>
              <h1 className="text-2xl font-bold text-gray-800 mb-1">
                {isMl ? 'പാസ്‌വേഡ് മറന്നോ?' : 'Forgot Password?'}
              </h1>
              <p className="text-gray-500 text-sm mb-6">
                {isMl
                  ? 'നിങ്ങളുടെ ഇമെയിൽ നൽകൂ. റീസെറ്റ് ലിങ്ക് അയക്കാം.'
                  : 'Enter your email and we\'ll send you a reset link.'
                }
              </p>

              {error && (
                <div className="flex items-center gap-2 bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isMl ? 'ഇമെയിൽ' : 'Email Address'}
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={isMl ? 'നിങ്ങളുടെ ഇമെയിൽ' : 'your@email.com'}
                      required
                      className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 focus:border-kerala-green"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting || !email}
                  className="w-full bg-kerala-green hover:bg-kerala-deep text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <><Loader2 size={16} className="animate-spin" /> {isMl ? 'അയക്കുന്നു...' : 'Sending...'}</>
                  ) : (
                    isMl ? 'റീസെറ്റ് ലിങ്ക് അയക്കൂ' : 'Send Reset Link'
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
