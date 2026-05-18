'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Home, Search, ArrowLeft, MapPin, Phone } from 'lucide-react'

const MALAYALAM_PROVERBS = [
  { ml: 'വഴി തെറ്റിയവൻ ചോദിക്കണം', en: 'One who has lost the way must ask.' },
  { ml: 'ഇല്ലായ്മ ഒരു അനുഗ്രഹം', en: 'A missing thing can be a blessing.' },
  { ml: 'തെറ്റ് ആർക്കും ഉണ്ടാകും', en: 'Mistakes happen to everyone.' },
]

export default function NotFound() {
  const [proverb] = useState(MALAYALAM_PROVERBS[Math.floor(Math.random() * MALAYALAM_PROVERBS.length)])
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <main className="min-h-screen bg-kerala-cream flex flex-col">
      {/* Decorative top border */}
      <div className="h-1.5 w-full bg-gradient-to-r from-kerala-green via-kerala-gold to-kerala-green" />

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
        {/* Kerala illustration */}
        <div className="relative mb-8">
          <div className="w-40 h-40 rounded-full bg-kerala-green/10 flex items-center justify-center mx-auto">
            <div className="w-28 h-28 rounded-full bg-kerala-green/20 flex items-center justify-center">
              <MapPin size={52} className="text-kerala-green" />
            </div>
          </div>
          {/* Floating elements */}
          <div className="absolute -top-2 -left-2 w-10 h-10 rounded-full bg-kerala-gold/20 flex items-center justify-center text-2xl">
            🌴
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-kerala-red/20 flex items-center justify-center text-2xl">
            🌺
          </div>
        </div>

        {/* 404 number */}
        <div className="font-serif text-[120px] sm:text-[160px] font-bold leading-none text-kerala-green/20 select-none mb-0">
          404
        </div>

        {/* Heading */}
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-kerala-deep -mt-6 mb-3">
          Page Not Found
        </h1>
        <p className="text-lg text-gray-500 font-malayalam mb-2">
          ഈ പേജ് കണ്ടെത്താൻ കഴിഞ്ഞില്ല
        </p>

        {/* Proverb */}
        <div className="max-w-sm mx-auto my-6 p-4 bg-white rounded-2xl border border-kerala-gold/30 shadow-sm">
          <p className="text-sm font-bold text-kerala-gold font-malayalam mb-1">&ldquo;{proverb.ml}&rdquo;</p>
          <p className="text-xs text-gray-400 italic">&ldquo;{proverb.en}&rdquo;</p>
        </div>

        <p className="text-gray-500 max-w-md mx-auto mb-8">
          The page you&apos;re looking for may have been moved, deleted, or the URL might be incorrect.
          Let&apos;s get you back on track.
        </p>

        {/* Search */}
        <div className="w-full max-w-md mb-8">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search for a business, event..."
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-kerala-green"
              />
            </div>
            <Link
              href={`/en/directory${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''}`}
              className="bg-kerala-green text-white px-5 py-3 rounded-xl font-semibold text-sm hover:bg-kerala-green-light transition-colors whitespace-nowrap"
            >
              Search
            </Link>
          </div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl w-full mb-10">
          {[
            { href: '/en', label: 'Home', labelMl: 'ഹോം', icon: Home },
            { href: '/en/directory', label: 'Directory', labelMl: 'ഡയറക്ടറി', icon: Search },
            { href: '/en/events', label: 'Events', labelMl: 'ഇവന്റുകൾ', icon: MapPin },
            { href: '/en/community', label: 'Community', labelMl: 'കമ്മ്യൂണിറ്റി', icon: Phone },
          ].map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-gray-100 hover:border-kerala-green hover:shadow-sm transition-all group"
            >
              <link.icon size={22} className="text-kerala-green group-hover:scale-110 transition-transform" />
              <span className="text-sm font-semibold text-kerala-deep">{link.label}</span>
              <span className="text-xs text-gray-400 font-malayalam">{link.labelMl}</span>
            </Link>
          ))}
        </div>

        {/* Back button */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-kerala-green hover:text-kerala-green-light font-semibold text-sm"
        >
          <ArrowLeft size={16} />
          Go Back
        </button>
      </div>

      {/* Footer strip */}
      <div className="bg-kerala-deep py-4 text-center text-white/50 text-xs">
        © 2025 MalayaliBusiness.com · UAE&apos;s Malayali Business Directory
      </div>
    </main>
  )
}
