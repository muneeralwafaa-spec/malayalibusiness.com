'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import {
  Search, MapPin, BadgeCheck, Briefcase, Filter,
  ArrowRight, Users, Building2, X, Plus, Loader2
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface BusinessProfile {
  id: string
  full_name: string | null
  avatar_url: string | null
  phone: string | null
  is_verified: boolean
  is_business_owner: boolean
  preferred_locale: string | null
  created_at: string
}

const AVATAR_FALLBACK = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80&auto=format&fit=crop&crop=faces'

function BusinessmanCard({ person, locale, isMl }: { person: BusinessProfile; locale: string; isMl: boolean }) {
  const initials = (person.full_name ?? 'B O')
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  return (
    <Link
      href={`/${locale}/owner/${person.id}`}
      className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 hover:border-kerala-green/20 transition-all duration-300 flex flex-col"
    >
      {/* Photo */}
      <div className="relative h-56 overflow-hidden bg-kerala-cream">
        {person.avatar_url ? (
          <Image
            src={person.avatar_url}
            alt={person.full_name ?? ''}
            fill
            className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={(e) => { (e.target as HTMLImageElement).src = AVATAR_FALLBACK }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-kerala-green/20 to-kerala-deep/20">
            <span className="font-serif text-5xl font-bold text-kerala-green/40">{initials}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-kerala-deep/80 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {person.is_verified && (
            <span className="bg-white/90 backdrop-blur text-kerala-green text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow">
              <BadgeCheck size={11} /> {isMl ? 'Verified' : 'Verified'}
            </span>
          )}
        </div>

        {/* Name overlay */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="font-serif text-xl font-bold text-white leading-tight">
            {person.full_name ?? (isMl ? 'ബിസിനസ്മാൻ' : 'Business Owner')}
          </h3>
          <p className="text-white/75 text-xs mt-0.5">
            {isMl ? 'ബിസിനസ് ഉടമ' : 'Business Owner'}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Business */}
        <div className="flex items-start gap-2 mb-3">
          <Building2 size={14} className="text-kerala-green mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-kerala-deep text-sm leading-snug">
              {isMl ? 'ബിസിനസ് ഉടമ' : 'Business Owner'}
            </p>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-3">
          <MapPin size={12} />
          <span>UAE</span>
          <span className="mx-1">·</span>
          <Briefcase size={11} />
          <span>1 {isMl ? 'ബിസിനസ്' : 'business'}</span>
        </div>

        {/* Member since */}
        <p className="text-gray-400 text-xs mb-4 flex-1">
          {isMl ? 'അംഗം' : 'Member since'}{' '}
          {new Date(person.created_at).getFullYear()}
        </p>

        {/* CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="text-kerala-green text-xs font-semibold group-hover:underline flex items-center gap-1 transition-all">
            {isMl ? 'പ്രൊഫൈൽ കാണൂ' : 'View Profile'} <ArrowRight size={13} />
          </span>
          {person.is_verified && (
            <span className="flex items-center gap-1 text-kerala-green text-xs font-medium">
              <BadgeCheck size={12} /> {isMl ? 'Verified' : 'Verified'}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

export default function BusinessmenPage() {
  const locale = useLocale()
  const isMl = locale === 'ml'

  const [profiles,   setProfiles]   = useState<BusinessProfile[]>([])
  const [loading,    setLoading]    = useState(true)
  const [search,     setSearch]     = useState('')
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [showFilters,  setShowFilters]  = useState(false)

  useEffect(() => {
    supabase
      .from('profiles')
      .select('id, full_name, avatar_url, phone, is_verified, is_business_owner, preferred_locale, created_at')
      .eq('is_business_owner', true)
      .order('created_at', { ascending: false })
      .limit(100)
      .then(({ data, error }) => {
        if (!error && data) setProfiles(data as BusinessProfile[])
        setLoading(false)
      })
  }, [])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return profiles.filter(p => {
      if (q && !p.full_name?.toLowerCase().includes(q)) return false
      if (verifiedOnly && !p.is_verified) return false
      return true
    })
  }, [profiles, search, verifiedOnly])

  const featuredProfiles = profiles.filter(p => p.is_verified).slice(0, 4)

  return (
    <main className="min-h-screen bg-kerala-cream">
      <Navbar />

      {/* Hero */}
      <section className="relative h-72 md:h-80 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&q=85&auto=format&fit=crop"
          alt="Dubai skyline"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-kerala-deep/90 via-kerala-deep/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-kerala-deep/60 to-transparent" />

        <div className="relative z-10 h-full flex flex-col justify-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-kerala-gold/20 border border-kerala-gold/40 text-kerala-gold-light text-xs font-semibold px-3 py-1 rounded-full">
              {isMl ? 'കമ്മ്യൂണിറ്റി' : 'COMMUNITY'}
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white max-w-2xl leading-tight mb-3">
            {isMl ? (
              <>UAE-യിലെ <span className="text-kerala-gold-light">പ്രമുഖ</span> മലയാളി ബിസിനസ്മാൻ</>
            ) : (
              <>Prominent Malayali <span className="text-kerala-gold-light">Business Leaders</span> in UAE</>
            )}
          </h1>
          <p className="text-white/70 text-base md:text-lg max-w-xl">
            {isMl
              ? 'UAE-ൽ ബിസിനസ് ലോകം നയിക്കുന്ന മലയാളി സംരംഭകരുടെ ഡയറക്ടറി'
              : 'Celebrating Malayali entrepreneurs who are shaping business across the Emirates'}
          </p>

          {/* Hero stats */}
          <div className="flex flex-wrap gap-6 mt-6">
            {[
              { val: profiles.length ? `${profiles.length}+` : '—', label: isMl ? 'ലിസ്റ്റ് ചെയ്ത നേതാക്കൾ' : 'Listed Leaders' },
              { val: '7',   label: isMl ? 'എമിറേറ്റുകൾ'    : 'Emirates'   },
              { val: '40+', label: isMl ? 'ഇൻഡസ്ട്രികൾ' : 'Industries' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="font-serif text-2xl font-bold text-kerala-gold-light">{s.val}</div>
                <div className="text-white/60 text-xs">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Search + Filters */}
      <section className="bg-white border-b border-gray-100 sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={isMl ? 'പേര് തിരയൂ...' : 'Search by name...'}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-kerala-green focus:ring-1 focus:ring-kerala-green bg-gray-50"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                showFilters ? 'bg-kerala-green text-white border-kerala-green' : 'bg-white text-gray-600 border-gray-200 hover:border-kerala-green'
              }`}
            >
              <Filter size={15} />
              {isMl ? 'ഫിൽട്ടർ' : 'Filters'}
            </button>

            {/* Verified toggle */}
            <button
              onClick={() => setVerifiedOnly(!verifiedOnly)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                verifiedOnly ? 'bg-kerala-green text-white border-kerala-green' : 'bg-white text-gray-600 border-gray-200 hover:border-kerala-green'
              }`}
            >
              <BadgeCheck size={15} />
              {isMl ? 'Verified മാത്രം' : 'Verified Only'}
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500">
              {isMl
                ? 'കൂടുതൽ ഫിൽട്ടറുകൾ ഉടൻ ലഭ്യമാകും'
                : 'More filters coming soon — industry, emirate, and experience range'}
            </div>
          )}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 size={36} className="animate-spin text-kerala-green" />
          </div>
        )}

        {!loading && (
          <>
            {/* Featured Spotlight */}
            {!search && !verifiedOnly && featuredProfiles.length > 0 && (
              <div className="mb-14">
                <div className="flex items-center gap-3 mb-6">
                  <BadgeCheck size={18} className="text-kerala-green" />
                  <h2 className="font-serif text-2xl font-bold text-kerala-deep">
                    {isMl ? 'Verified ലീഡർമാർ' : 'Verified Leaders'}
                  </h2>
                  <div className="h-px bg-gray-200 flex-1" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {featuredProfiles.map(person => (
                    <Link
                      key={person.id}
                      href={`/${locale}/owner/${person.id}`}
                      className="group relative overflow-hidden rounded-3xl h-72 shadow-md hover:shadow-xl transition-all duration-300 bg-kerala-cream"
                    >
                      {person.avatar_url ? (
                        <Image
                          src={person.avatar_url}
                          alt={person.full_name ?? ''}
                          fill
                          className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          onError={(e) => { (e.target as HTMLImageElement).src = AVATAR_FALLBACK }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="font-serif text-6xl font-bold text-kerala-green/30">
                            {(person.full_name ?? 'BO').split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                      <div className="absolute top-3 left-3">
                        <span className="bg-kerala-green text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                          <BadgeCheck size={10} /> {isMl ? 'Verified' : 'Verified'}
                        </span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="font-serif text-lg font-bold text-white">
                          {person.full_name ?? (isMl ? 'ബിസിനസ്മാൻ' : 'Business Owner')}
                        </h3>
                        <p className="text-white/70 text-xs mb-1">
                          {isMl ? 'ബിസിനസ് ഉടമ' : 'Business Owner'}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="bg-white/15 text-white text-xs px-2 py-0.5 rounded-full">UAE</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* All Results */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-kerala-deep">
                  {search || verifiedOnly
                    ? (isMl ? 'ഫലങ്ങൾ' : 'Results')
                    : (isMl ? 'എല്ലാ ബിസിനസ്മാൻ' : 'All Business Leaders')}
                </h2>
                <p className="text-gray-500 text-sm mt-0.5">
                  {filtered.length} {isMl ? 'പ്രൊഫൈലുകൾ കണ്ടെത്തി' : 'profiles found'}
                </p>
              </div>
              {(search || verifiedOnly) && (
                <button
                  onClick={() => { setSearch(''); setVerifiedOnly(false) }}
                  className="text-sm text-kerala-green hover:underline flex items-center gap-1"
                >
                  <X size={14} /> {isMl ? 'ക്ലിയർ' : 'Clear'}
                </button>
              )}
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <Users size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">
                  {isMl ? 'ഫലം കണ്ടെത്തിയില്ല' : 'No profiles found yet'}
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  {isMl ? 'ആദ്യ ബിസിനസ് ഓണർ ആകൂ!' : 'Be the first to register as a business owner!'}
                </p>
                <Link
                  href={`/${locale}/auth?tab=register`}
                  className="inline-flex items-center gap-2 mt-5 bg-kerala-green text-white px-6 py-3 rounded-xl font-semibold hover:bg-kerala-green/90 transition-colors text-sm"
                >
                  {isMl ? 'ഇപ്പോൾ ചേരൂ' : 'Join Now'}
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filtered.map(person => (
                  <BusinessmanCard key={person.id} person={person} locale={locale} isMl={isMl} />
                ))}
              </div>
            )}

            {/* Nominate CTA */}
            <div className="mt-16 relative overflow-hidden rounded-3xl bg-kerala-deep px-8 py-12 text-center">
              <Image
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80&auto=format&fit=crop"
                alt=""
                fill
                className="object-cover opacity-10"
                sizes="100vw"
              />
              <div className="relative z-10">
                <span className="inline-block bg-kerala-gold/20 border border-kerala-gold/30 text-kerala-gold-light text-xs font-bold px-3 py-1 rounded-full mb-4">
                  {isMl ? 'ഇപ്പോൾ ചേരൂ' : 'JOIN NOW'}
                </span>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3 max-w-xl mx-auto">
                  {isMl
                    ? 'ഒരു ബിസിനസ് ഉടമയാണോ? ഇവിടെ ലിസ്റ്റ് ചെയ്യൂ'
                    : 'Are you a Business Owner? Get Listed'}
                </h2>
                <p className="text-white/65 text-base mb-8 max-w-lg mx-auto">
                  {isMl
                    ? 'UAE-ൽ നിങ്ങളുടെ ബിസിനസ് കൂടുതൽ മലയാളികൾക്ക് കാണിക്കൂ'
                    : 'Showcase your business to thousands of Malayalis across the UAE'}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href={`/${locale}/auth?tab=register`}
                    className="inline-flex items-center gap-2 bg-kerala-gold hover:bg-kerala-gold-light text-white font-semibold px-8 py-3 rounded-xl transition-all"
                  >
                    <Plus size={18} />
                    {isMl ? 'ഇപ്പോൾ ചേരൂ' : 'Register Now'}
                  </Link>
                  <Link
                    href={`/${locale}/directory`}
                    className="inline-flex items-center gap-2 border border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-3 rounded-xl transition-all"
                  >
                    {isMl ? 'ബിസിനസ് ഡയറക്ടറി' : 'Business Directory'}
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <Footer />
    </main>
  )
}
