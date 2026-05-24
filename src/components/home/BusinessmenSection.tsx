'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { useEffect, useState } from 'react'
import { BadgeCheck, MapPin, ArrowRight, Award, Building2, Users, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface BusinessProfile {
  id: string
  full_name: string | null
  avatar_url: string | null
  phone: string | null
  is_verified: boolean
  preferred_locale: string | null
}

const AVATAR_FALLBACK = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80&auto=format&fit=crop&crop=faces'

export default function BusinessmenSection() {
  const locale = useLocale()
  const isMl = locale === 'ml'
  const [profiles, setProfiles] = useState<BusinessProfile[]>([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    supabase
      .from('profiles')
      .select('id, full_name, avatar_url, phone, is_verified, preferred_locale')
      .eq('is_business_owner', true)
      .eq('is_verified', true)
      .limit(4)
      .then(({ data, error }) => {
        if (!error && data) setProfiles(data as BusinessProfile[])
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto flex justify-center py-16">
          <Loader2 size={32} className="animate-spin text-kerala-green" />
        </div>
      </section>
    )
  }

  // If no verified business owners yet, fall back to a CTA-only section
  const hasProfiles = profiles.length > 0

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-kerala-gold/10 border border-kerala-gold/20 text-kerala-gold text-xs font-semibold px-3 py-1.5 rounded-full mb-3">
              <Award size={12} />
              {isMl ? 'മലയാളി ബിസിനസ് നേതാക്കൾ' : 'Malayali Business Leaders'}
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-kerala-deep">
              {isMl ? 'പ്രമുഖ സംരംഭകർ' : 'Prominent Entrepreneurs'}
            </h2>
            <p className="text-gray-500 mt-2 text-sm max-w-lg">
              {isMl
                ? 'UAE-ൽ കേരളത്തിന്റെ അഭിമാനം ഉയർത്തിപ്പിടിക്കുന്ന ബിസിനസ് ഐക്കണുകൾ'
                : 'Business icons who carry Kerala\'s pride across the UAE and beyond'}
            </p>
          </div>
          <Link
            href={`/${locale}/businessmen`}
            className="flex items-center gap-2 text-kerala-green hover:text-kerala-green-light font-semibold text-sm transition-colors group"
          >
            {isMl ? 'എല്ലാവരെയും കാണൂ' : 'View All Leaders'}
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Cards */}
        {hasProfiles && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {profiles.map((person) => (
              <Link
                key={person.id}
                href={`/${locale}/owner/${person.id}`}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-kerala-green/20 transition-all duration-300"
              >
                {/* Profile photo */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={person.avatar_url || AVATAR_FALLBACK}
                    alt={person.full_name ?? ''}
                    fill
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    onError={(e) => { (e.target as HTMLImageElement).src = AVATAR_FALLBACK }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  {person.is_verified && (
                    <div className="absolute top-3 right-3 bg-white/90 text-kerala-green text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow">
                      <BadgeCheck size={11} /> {isMl ? 'Verified' : 'Verified'}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-center gap-1.5 mb-1">
                    <h3 className="font-bold text-kerala-deep text-base leading-tight group-hover:text-kerala-green transition-colors">
                      {person.full_name ?? (isMl ? 'ബിസിനസ്മാൻ' : 'Business Owner')}
                    </h3>
                    {person.is_verified && (
                      <BadgeCheck size={14} className="text-kerala-green flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs font-semibold text-kerala-green mb-3 flex items-center gap-1">
                    <Building2 size={10} />
                    {isMl ? 'ബിസിനസ് ഉടമ' : 'Business Owner'}
                  </p>
                  <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                    <MapPin size={11} />
                    <span>UAE</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Bottom CTA strip */}
        <div className="mt-4 bg-gradient-to-r from-kerala-green/5 via-kerala-gold/5 to-kerala-green/5 border border-kerala-green/10 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-kerala-green/10 rounded-full flex items-center justify-center">
              <Users size={18} className="text-kerala-green" />
            </div>
            <div>
              <p className="font-semibold text-kerala-deep text-sm">
                {isMl ? 'മലയാളി ബിസിനസ് ലീഡർമാർ' : 'Malayali Business Leaders'}
              </p>
              <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                <Users size={10} />
                {isMl ? 'UAE-ലുടനീളം' : 'Across all UAE emirates'}
              </p>
            </div>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link
              href={`/${locale}/businessmen`}
              className="bg-kerala-green text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-kerala-green-light transition-colors"
            >
              {isMl ? 'എല്ലാ ലീഡർമാർ' : 'Browse All Leaders'}
            </Link>
            <Link
              href={`/${locale}/auth`}
              className="border border-kerala-green text-kerala-green px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-kerala-green/5 transition-colors"
            >
              {isMl ? 'നിങ്ങളുടെ പ്രൊഫൈൽ ചേർക്കൂ' : 'Add Your Profile'}
            </Link>
          </div>
        </div>

      </div>
    </section>
  )
}
