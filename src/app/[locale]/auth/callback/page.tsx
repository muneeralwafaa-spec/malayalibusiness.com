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
    // Supabase handles the token exchange from the URL hash
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace(`/${locale}/dashboard`)
      } else {
        router.replace(`/${locale}/auth`)
      }
    })
  }, [locale, router])

  return (
    <div className="min-h-screen bg-kerala-cream flex items-center justify-center">
      <div className="text-center">
        <Loader2 size={36} className="animate-spin text-kerala-green mx-auto mb-3" />
        <p className="text-gray-500 text-sm">Signing you in…</p>
      </div>
    </div>
  )
}
