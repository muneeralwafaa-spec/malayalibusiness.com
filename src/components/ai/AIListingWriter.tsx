'use client'

import { useState } from 'react'
import { Sparkles, Loader2, Check, RefreshCw } from 'lucide-react'

interface AIListingWriterProps {
  businessName: string
  category: string
  location: string
  services: string
  onGenerated: (data: { description: string; tagline: string; keywords: string }) => void
}

export default function AIListingWriter({
  businessName,
  category,
  location,
  services,
  onGenerated,
}: AIListingWriterProps) {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const generate = async () => {
    if (!businessName || !category) {
      setError('Please enter your business name and select a category first.')
      return
    }
    setLoading(true)
    setError('')
    setDone(false)

    try {
      const res = await fetch('/api/ai/generate-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessName, category, location, services }),
      })
      const data = await res.json()
      if (data.error) {
        setError(data.error)
        return
      }
      onGenerated(data)
      setDone(true)
      setTimeout(() => setDone(false), 3000)
    } catch {
      setError('AI service unavailable. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mb-4">
      <button
        type="button"
        onClick={generate}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-kerala-deep to-kerala-green text-white rounded-xl text-sm font-medium hover:shadow-md transition-all disabled:opacity-60"
      >
        {loading ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Writing with AI...</>
        ) : done ? (
          <><Check className="w-4 h-4" /> Done! Description generated</>
        ) : (
          <><Sparkles className="w-4 h-4" /> AI Write My Listing</>
        )}
      </button>
      {done && (
        <button
          type="button"
          onClick={generate}
          className="ml-2 inline-flex items-center gap-1 text-xs text-kerala-deep hover:underline"
        >
          <RefreshCw className="w-3 h-3" /> Regenerate
        </button>
      )}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      <p className="mt-1 text-xs text-gray-400">AI will write a professional description, tagline, and keywords for you</p>
    </div>
  )
}
