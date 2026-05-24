'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import {
  MapPin, BadgeCheck, Building2, Calendar, Share2,
  MessageCircle, Award, Star,
  Briefcase, ChevronRight, Flag,
  Phone, Loader2, ArrowRight, Users, FileText
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

const DEFAULT_COVER = 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1400&q=85&auto=format&fit=crop'
const AVATAR_FALLBACK = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80&auto=format&fit=crop&crop=faces'

interface OwnerProfile {
  id: string
  full_name: string | null
  avatar_url: string | null
  phone: string | null
  is_verified: boolean
  is_business_owner: boolean
  preferred_locale: string | null
  created_at: string
}

function getInitials(name: string | null): string {
  if (!name) return 'B'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

function memberSinceYear(dateStr: string): string {
  return new Date(dateStr).getFullYear().toString()
}

export default function OwnerProfilePage() {
  const locale = useLocale()
  const isMl = locale === 'ml'
  const params = useParams<{ username: string }>()
  const profileId = params.username // route param is actually the UUID

  const [profile, setProfile] = useState<OwnerProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [activeTab, setActiveTab] = useState<'posts' | 'businesses' | 'achievements'>('businesses')

  useEffect(() => {
    supabase
      .from('profiles')
      .select('id, full_name, avatar_url, phone, is_verified, is_business_owner, preferred_locale, created_at')
      .eq('id', profileId)
      .single()
      .then(({ data, error }) => {
        if (error || !data || !data.is_business_owner) {
          setNotFound(true)
        } else {
          setProfile(data as OwnerProfile)
        }
        setLoading(false)
      })
  }, [profileId])

  // ── Loading ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <main className="min-h-screen bg-kerala-cream">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 size={36} className="animate-spin text-kerala-green" />
        </div>
        <Footer />
      </main>
    )
  }

  // ── Not Found ────────────────────────────────────────────────────────
  if (notFound || !profile) {
    return (
      <main className="min-h-screen bg-kerala-cream">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-32 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users size={28} className="text-gray-400" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-kerala-deep mb-3">
            {isMl ? 'പ്രൊഫൈൽ കണ്ടെത്തിയില്ല' : 'Profile Not Found'}
          </h1>
          <p className="text-gray-500 mb-6">
            {isMl
              ? 'ഈ ബിസിനസ്മാൻ പ്രൊഫൈൽ നിലവിൽ ലഭ്യമല്ല'
              : 'This business owner profile is not available or does not exist.'}
          </p>
          <Link
            href={`/${locale}/businessmen`}
            className="inline-flex items-center gap-2 bg-kerala-green text-white font-bold px-6 py-3 rounded-xl hover:bg-kerala-green-light transition-colors"
          >
            {isMl ? 'ഡയറക്ടറിയിലേക്ക് തിരിച്ചു പോകൂ' : 'Back to Directory'}
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  const displayName = profile.full_name ?? (isMl ? 'ബിസിനസ് ഉടമ' : 'Business Owner')
  const initials = getInitials(profile.full_name)

  return (
    <main className="min-h-screen bg-kerala-cream">
      <Navbar />

      {/* ── Cover Banner ─────────────────────────────────────── */}
      <div className="relative h-64 md:h-80 lg:h-96 w-full overflow-hidden">
        <Image
          src={DEFAULT_COVER}
          alt="Cover"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-kerala-deep/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-kerala-deep/50 to-transparent" />

        {profile.is_verified && (
          <div className="absolute top-6 right-6 bg-kerala-gold/90 backdrop-blur text-white text-xs font-bold px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
            <Star size={13} className="fill-white" />
            {isMl ? 'MalayaliBusiness.com-ൽ Verified' : 'Verified on MalayaliBusiness.com'}
          </div>
        )}
      </div>

      {/* ── Profile Header ────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-20 md:-mt-24 mb-6 flex flex-col md:flex-row md:items-end gap-5 md:gap-6">

          {/* Avatar */}
          <div className="relative w-32 h-32 md:w-36 md:h-36 rounded-2xl overflow-hidden border-4 border-white shadow-2xl flex-shrink-0 bg-gray-100">
            {profile.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={displayName}
                fill
                className="object-cover object-top"
                sizes="144px"
                onError={(e) => { (e.target as HTMLImageElement).src = AVATAR_FALLBACK }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-kerala-green/10">
                <span className="text-kerala-green font-bold text-3xl">{initials}</span>
              </div>
            )}
            {profile.is_verified && (
              <div className="absolute bottom-2 right-2 bg-kerala-green text-white rounded-full p-1 shadow">
                <BadgeCheck size={14} />
              </div>
            )}
          </div>

          {/* Name block */}
          <div className="flex-1 md:pb-2">
            <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
              <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-kerala-deep">
                {displayName}
              </h1>
              {profile.is_verified && (
                <span className="flex items-center gap-1 bg-kerala-green/10 text-kerala-green text-xs font-bold px-2.5 py-1 rounded-full border border-kerala-green/20">
                  <BadgeCheck size={12} /> {isMl ? 'Verified' : 'Verified'}
                </span>
              )}
            </div>
            <p className="text-gray-600 text-sm md:text-base mb-2 font-semibold">
              {isMl ? 'ബിസിനസ് ഉടമ' : 'Business Owner'}
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <MapPin size={12} className="text-kerala-green" /> UAE
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {isMl ? 'അംഗം' : 'Member since'} {memberSinceYear(profile.created_at)}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2.5 md:pb-2 flex-shrink-0">
            {profile.phone && (
              <a
                href={`https://wa.me/${profile.phone.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-kerala-green hover:bg-kerala-green-light text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm"
              >
                <MessageCircle size={16} />
                {isMl ? 'WhatsApp' : 'WhatsApp'}
              </a>
            )}
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: displayName, url: window.location.href })
                } else {
                  navigator.clipboard.writeText(window.location.href)
                }
              }}
              className="flex items-center gap-2 bg-white border border-gray-200 text-gray-500 hover:text-kerala-green hover:border-kerala-green text-sm font-semibold px-3.5 py-2.5 rounded-xl transition-all shadow-sm"
            >
              <Share2 size={15} />
            </button>
          </div>
        </div>

        {/* ── Main Two-Column Layout ────────────────────────── */}
        <div className="flex flex-col lg:flex-row gap-7 pb-16">

          {/* ── Left column ─────────── */}
          <div className="flex-1 min-w-0 space-y-6">

            {/* About */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-7">
              <h2 className="font-serif font-bold text-kerala-deep text-xl mb-4">
                {isMl ? 'ആത്മകഥ' : 'About'}
              </h2>
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                  <FileText size={20} className="text-gray-300" />
                </div>
                <p className="text-gray-400 text-sm">
                  {isMl
                    ? 'ഈ ബിസിനസ് ഉടമ ഇതുവരെ ഒരു ബയോ ചേർത്തിട്ടില്ല.'
                    : 'This business owner hasn\'t added a bio yet.'}
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex border-b border-gray-100">
                {(
                  [
                    { key: 'businesses', label: isMl ? 'ബിസിനസ്' : 'Businesses' },
                    { key: 'achievements', label: isMl ? 'അവാർഡ്' : 'Achievements' },
                    { key: 'posts', label: isMl ? 'ലേഖനങ്ങൾ' : 'Posts' },
                  ] as const
                ).map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex-1 px-4 py-4 text-sm font-semibold transition-all border-b-2 flex items-center justify-center gap-1.5 ${
                      activeTab === tab.key
                        ? 'border-kerala-green text-kerala-green bg-kerala-green/5'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-6">

                {/* Businesses tab */}
                {activeTab === 'businesses' && (
                  <div className="space-y-4">
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <div className="w-14 h-14 bg-kerala-green/5 rounded-full flex items-center justify-center mb-3">
                        <Building2 size={22} className="text-kerala-green/40" />
                      </div>
                      <p className="text-gray-400 text-sm mb-4">
                        {isMl
                          ? 'ഈ ഉടമ ഇതുവരെ ബിസിനസ്സുകൾ ലിസ്റ്റ് ചെയ്തിട്ടില്ല.'
                          : 'No businesses listed by this owner yet.'}
                      </p>
                      <Link
                        href={`/${locale}/directory`}
                        className="flex items-center gap-2 text-kerala-green font-semibold text-sm py-2.5 px-5 border border-dashed border-kerala-green/30 rounded-xl hover:bg-kerala-green/5 transition-colors"
                      >
                        {isMl ? 'ബിസിനസ് ഡയറക്ടറി കാണൂ' : 'Explore Business Directory'}
                        <ArrowRight size={15} />
                      </Link>
                    </div>
                  </div>
                )}

                {/* Achievements tab */}
                {activeTab === 'achievements' && (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="w-14 h-14 bg-kerala-gold/5 rounded-full flex items-center justify-center mb-3">
                      <Award size={22} className="text-kerala-gold/40" />
                    </div>
                    <p className="text-gray-400 text-sm">
                      {isMl
                        ? 'ഇതുവരെ നേട്ടങ്ങൾ ചേർത്തിട്ടില്ല.'
                        : 'No achievements added yet.'}
                    </p>
                  </div>
                )}

                {/* Posts tab */}
                {activeTab === 'posts' && (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                      <FileText size={22} className="text-gray-300" />
                    </div>
                    <p className="text-gray-400 text-sm">
                      {isMl
                        ? 'ഇതുവരെ ലേഖനങ്ങൾ ഒന്നും പ്രസിദ്ധീകരിച്ചിട്ടില്ല.'
                        : 'No posts published yet.'}
                    </p>
                  </div>
                )}

              </div>
            </div>
          </div>

          {/* ── Right Sidebar ───────── */}
          <div className="w-full lg:w-72 flex-shrink-0 space-y-5">

            {/* Profile summary card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-serif font-bold text-kerala-deep text-base mb-4">
                {isMl ? 'പ്രൊഫൈൽ വിവരങ്ങൾ' : 'Profile Info'}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-kerala-cream rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building2 size={14} className="text-kerala-green" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">{isMl ? 'തൊഴിൽ' : 'Role'}</p>
                    <p className="text-gray-700 text-xs font-medium">
                      {isMl ? 'ബിസിനസ് ഉടമ' : 'Business Owner'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-kerala-cream rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin size={14} className="text-kerala-green" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">{isMl ? 'സ്ഥലം' : 'Location'}</p>
                    <p className="text-gray-700 text-xs font-medium">UAE</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-kerala-cream rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar size={14} className="text-kerala-green" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">{isMl ? 'അംഗമായത്' : 'Member since'}</p>
                    <p className="text-gray-700 text-xs font-medium">{memberSinceYear(profile.created_at)}</p>
                  </div>
                </div>

                {profile.phone && (
                  <a
                    href={`tel:${profile.phone}`}
                    className="flex items-center gap-3 group"
                  >
                    <div className="w-8 h-8 bg-kerala-cream rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone size={14} className="text-kerala-green" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">{isMl ? 'ഫോൺ' : 'Phone'}</p>
                      <p className="text-gray-700 text-xs font-medium group-hover:text-kerala-green transition-colors">
                        {profile.phone}
                      </p>
                    </div>
                  </a>
                )}

                {profile.is_verified && (
                  <div className="flex items-center gap-2 mt-2 pt-3 border-t border-gray-50">
                    <BadgeCheck size={15} className="text-kerala-green" />
                    <span className="text-kerala-green text-xs font-semibold">
                      {isMl ? 'Verified ബിസിനസ് ഉടമ' : 'Verified Business Owner'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* WhatsApp CTA if phone present */}
            {profile.phone && (
              <a
                href={`https://wa.me/${profile.phone.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3 rounded-xl text-sm transition-all shadow-sm"
              >
                <MessageCircle size={16} />
                {isMl ? 'WhatsApp-ൽ ബന്ധപ്പെടൂ' : 'Contact on WhatsApp'}
              </a>
            )}

            {/* Businessmen Directory CTA */}
            <div className="bg-kerala-cream rounded-2xl border border-kerala-green/20 p-5">
              <div className="flex items-center gap-2 mb-2">
                <Briefcase size={16} className="text-kerala-green" />
                <h3 className="font-semibold text-kerala-deep text-sm">
                  {isMl ? 'ബിസിനസ്മാൻ ഡയറക്ടറി' : 'Businessmen Directory'}
                </h3>
              </div>
              <p className="text-gray-500 text-xs leading-relaxed mb-3">
                {isMl
                  ? 'UAE-ൽ മറ്റ് മലയാളി ബിസിനസ് ലീഡർമാരെ കണ്ടെത്തൂ'
                  : 'Discover more Malayali business leaders across the UAE'}
              </p>
              <Link
                href={`/${locale}/businessmen`}
                className="flex items-center justify-center gap-2 bg-kerala-green text-white font-semibold text-xs py-2.5 rounded-lg hover:bg-kerala-green-light transition-all"
              >
                {isMl ? 'ഡയറക്ടറി കാണൂ' : 'View Directory'}
                <ArrowRight size={13} />
              </Link>
            </div>

            {/* Register CTA */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
              <p className="text-gray-500 text-xs leading-relaxed mb-3">
                {isMl
                  ? 'നിങ്ങൾ ഒരു ബിസിനസ് ഉടമയാണോ? ഇന്ന് ലിസ്റ്റ് ചെയ്യൂ!'
                  : 'Are you a business owner? Get listed today!'}
              </p>
              <Link
                href={`/${locale}/auth?tab=register`}
                className="flex items-center justify-center gap-2 bg-kerala-gold/10 border border-kerala-gold/30 text-kerala-gold font-semibold text-xs py-2.5 rounded-lg hover:bg-kerala-gold/20 transition-all"
              >
                <Star size={12} />
                {isMl ? 'പ്രൊഫൈൽ ചേർക്കൂ' : 'Add Your Profile'}
              </Link>
            </div>

            {/* Report */}
            <button className="flex items-center gap-2 text-gray-400 hover:text-gray-500 text-xs mx-auto transition-colors">
              <Flag size={12} />
              {isMl ? 'പ്രൊഫൈൽ റിപ്പോർട്ട് ചെയ്യൂ' : 'Report this profile'}
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
