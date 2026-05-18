'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search, MapPin, ChevronDown, Star, Building2, Users, Globe } from 'lucide-react'
import { useLocale } from 'next-intl'

const categories = [
  'All Categories', 'Restaurants', 'Real Estate', 'Healthcare', 'Education',
  'Finance', 'Retail', 'Travel', 'Beauty', 'Technology', 'Legal', 'Construction',
]

const stats = [
  { icon: Building2, value: '15,000+', label: 'Businesses', labelMl: 'ബിസിനസുകൾ' },
  { icon: Users, value: '3.5M', label: 'Members', labelMl: 'അംഗങ്ങൾ' },
  { icon: Globe, value: '7', label: 'Emirates', labelMl: 'എമിറേറ്റുകൾ' },
  { icon: Star, value: '50K+', label: 'Reviews', labelMl: 'റിവ്യൂകൾ' },
]

export default function Hero() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All Categories')
  const [catOpen, setCatOpen] = useState(false)
  const locale = useLocale()
  const isMl = locale === 'ml'

  return (
    <section className="relative min-h-screen flex flex-col">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&q=85&auto=format&fit=crop"
          alt="Dubai skyline"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-kerala-deep/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-kerala-deep/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col flex-1 items-center justify-center px-4 sm:px-6 pt-32 pb-24">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-kerala-gold/20 border border-kerala-gold/40 text-kerala-gold-light text-sm font-medium px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
          <Star size={14} className="fill-current" />
          {isMl ? 'യുഎഇയിലെ നമ്പർ 1 മലയാളി ബിസിനസ് നെറ്റ്‌വർക്ക്' : "UAE's #1 Malayali Business Network"}
        </div>

        {/* Headline */}
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white text-center leading-tight max-w-4xl mb-3">
          {isMl ? (
            <>
              യുഎഇയിലെ <span className="text-kerala-gold-light">എല്ലാ</span>
              <br />
              <span className="text-kerala-gold-light">മലയാളി</span> ബിസിനസുകളും
            </>
          ) : (
            <>
              Find Every <span className="text-kerala-gold-light">Malayali</span>
              <br />
              Business in the <span className="text-kerala-gold-light">UAE</span>
            </>
          )}
        </h1>

        <p className="text-white/75 text-lg md:text-xl text-center max-w-2xl mb-10 font-light">
          {isMl
            ? 'ദുബായ്, അബുദാബി, ഷാർജ, മറ്റ് എമിറേറ്റുകളിലെ 35 ലക്ഷം മലയാളികളെ ബന്ധിപ്പിക്കുന്നു'
            : 'Connecting 3.5 million Malayalis across Dubai, Abu Dhabi, Sharjah and all seven emirates'}
        </p>

        {/* Search Box */}
        <div className="w-full max-w-3xl">
          <div className="bg-white rounded-2xl shadow-2xl p-2 flex flex-col sm:flex-row gap-2">
            {/* Category Dropdown */}
            <div className="relative sm:w-48 flex-shrink-0">
              <button
                onClick={() => setCatOpen(!catOpen)}
                className="w-full flex items-center justify-between gap-2 px-4 py-3 text-gray-700 text-sm font-medium border-b sm:border-b-0 sm:border-r border-gray-200 hover:text-kerala-green transition-colors"
              >
                <span className="truncate">{category}</span>
                <ChevronDown size={16} className={`flex-shrink-0 transition-transform ${catOpen ? 'rotate-180' : ''}`} />
              </button>
              {catOpen && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-xl z-50 min-w-[200px] py-1 max-h-64 overflow-y-auto">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => { setCategory(cat); setCatOpen(false) }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-kerala-cream hover:text-kerala-green transition-colors"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search Input */}
            <div className="flex-1 flex items-center gap-2 px-3">
              <Search size={18} className="text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={isMl ? 'ബിസിനസുകൾ, സേവനങ്ങൾ...' : 'Search businesses, services, products...'}
                className="flex-1 py-3 text-gray-800 placeholder-gray-400 outline-none text-sm bg-transparent"
                onKeyDown={(e) => e.key === 'Enter' && console.log('search', query)}
              />
            </div>

            {/* Location */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 border-l border-gray-200">
              <MapPin size={16} className="text-kerala-green" />
              <span className="text-sm text-gray-500">Dubai</span>
            </div>

            {/* Search Button */}
            <Link
              href={`/${locale}/directory?q=${query}&cat=${category}`}
              className="bg-kerala-green hover:bg-kerala-green-light text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 text-sm flex items-center gap-2 justify-center whitespace-nowrap"
            >
              <Search size={16} />
              {isMl ? 'തിരയൂ' : 'Search'}
            </Link>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap gap-2 justify-center mt-4">
            {['Restaurants', 'Real Estate', 'Healthcare', 'Jobs', 'Events'].map((q) => (
              <Link
                key={q}
                href={`/${locale}/directory?q=${q}`}
                className="text-xs text-white/70 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full transition-all border border-white/20"
              >
                {q}
              </Link>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 mt-16 w-full max-w-2xl">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-kerala-gold-light font-serif text-3xl sm:text-4xl font-bold mb-1">
                {stat.value}
              </div>
              <div className="text-white/60 text-xs sm:text-sm font-medium">
                {isMl ? stat.labelMl : stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z" fill="#faf7f2" />
        </svg>
      </div>
    </section>
  )
}
