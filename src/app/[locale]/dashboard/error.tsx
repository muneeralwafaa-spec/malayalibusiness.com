'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[Dashboard Error]', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={28} className="text-red-500" />
        </div>
        <h2 className="font-serif font-bold text-xl text-kerala-deep mb-2">
          Something went wrong
        </h2>
        <p className="text-gray-500 text-sm mb-1">
          The dashboard ran into an unexpected error.
        </p>
        {error?.message && (
          <p className="text-xs font-mono text-red-500 bg-red-50 rounded-lg px-3 py-2 mb-5 break-all">
            {error.message}
          </p>
        )}
        <button
          onClick={reset}
          className="flex items-center gap-2 bg-kerala-green text-white font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity mx-auto text-sm"
        >
          <RefreshCw size={14} />
          Try again
        </button>
      </div>
    </div>
  )
}
