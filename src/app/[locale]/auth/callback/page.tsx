'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { supabase } from '@/lib/supabase'
import { Loader2 } from 'lucide-react'

export default function AuthCallbackPage() {
  const router = useRouter()
  const locale = useLocale()

  useEffect(() => {
    async function handleCallback() {
      // Handle PKCE code exchange — Next.js App Router needs this
      const { data: { session }, error } = await supabase.auth.getSession()

      if (error) {
        console.error('Auth callback error:', error)
        router.replace(`/auth?error=callback_failed`)
        return
      }

      if (session) {
        await redirectUser(session.user.id)
        return
      }

      // Listen for auth state change — OAuth may still be exchanging the token
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
        if (event === 'PASSWORD_RECOVERY') {
          subscription.unsubscribe()
          router.replace(`/auth/reset-password`)
          return
        }
        if (event === 'SIGNED_IN' && newSession) {
          subscription.unsubscribe()
          await redirectUser(newSession.user.id)
        }
      })

      // Fallback timeout — if nothing happens in 5s, redirect to auth
      setTimeout(() => {
        subscription.unsubscribe()
        router.replace(`/auth`)
      }, 5000)
    }

    async function redirectUser(userId: string) {
      try {
        const { data } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', userId)
          .single()
        if (data?.is_admin) {
          router.replace(`/admin`)
        } else {
          router.replace(`/dashboard`)
        }
      } catch {
        router.replace(`/dashboard`)
      }
    }

    handleCallback()
  }, [locale, router])

  return (
    <div className="min-h-screen bg-kerala-cream flex items-center justify-center">
      <div className="text-center">
        <Loader2 size={36} className="animate-spin text-kerala-green mx-auto mb-4" />
        <p className="text-gray-600 font-medium">Signing you in…</p>
        <p className="text-gray-400 text-sm mt-1">Please wait a moment</p>
      </div>
    </div>
  )
}
