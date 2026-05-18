'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { mockBusinesses } from '@/lib/mock-businesses'
import {
  MapPin, BadgeCheck, Building2, Calendar, Users, TrendingUp, ArrowRight,
  MessageCircle, Globe, Award, Star,
  Briefcase, Clock, ChevronRight, Heart, Share2, Bookmark, Flag,
  Phone, Mail, ExternalLink
} from 'lucide-react'

function IconWhatsApp({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

function IconLinkedIn({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function IconInstagram({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  )
}

function IconYouTube({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

interface OwnerPost {
  id: number
  title: string
  titleMl: string
  excerpt: string
  excerptMl: string
  image: string
  date: string
  readTime: string
  likes: number
  tag: string
  tagMl: string
}

interface Achievement {
  year: string
  title: string
  titleMl: string
  org: string
  orgMl: string
  icon: 'award' | 'business' | 'community' | 'media'
}

interface OwnerProfile {
  username: string
  name: string
  nameMl: string
  title: string
  titleMl: string
  bio: string
  bioMl: string
  bioLong: string
  bioLongMl: string
  avatar: string
  coverImage: string
  location: string
  locationMl: string
  origin: string
  originMl: string
  memberSince: string
  verified: boolean
  featured: boolean
  phone: string
  email: string
  website: string
  whatsapp: string
  linkedin: string
  instagram: string
  youtube: string
  stats: {
    yearsInBusiness: number
    employees: string
    businesses: number
    countries: number
    reviews: number
    followers: number
  }
  businesses: typeof mockBusinesses
  achievements: Achievement[]
  posts: OwnerPost[]
  tags: string[]
  tagsMl: string[]
}

const ownerProfiles: OwnerProfile[] = [
  {
    username: 'rajannair',
    name: 'Rajan Nair',
    nameMl: 'രാജൻ നായർ',
    title: 'Chairman & Founder — Nair Group of Companies',
    titleMl: 'ചെയർമാൻ & സ്ഥാപകൻ — നായർ ഗ്രൂപ്പ് ഓഫ് കമ്പനീസ്',
    bio: 'Pioneer Malayali entrepreneur with 22+ years in UAE. Founder of 6 businesses across real estate, healthcare & technology.',
    bioMl: 'UAE-ൽ 22+ വർഷം. റിയൽ എസ്റ്റേറ്റ്, ഹെൽത്ത്കെയർ, ടെക്നോളജിയിൽ 6 ബിസിനസ്സുകൾ.',
    bioLong: `Rajan Nair arrived in Dubai in 2002 with a vision to build a business empire rooted in Kerala's values of hard work, community, and excellence. Starting with a single property brokerage firm in Deira, he methodically expanded into healthcare facilities, technology ventures, and hospitality across the UAE and beyond.

Today, Nair Group of Companies employs over 500 people across four countries and manages assets exceeding AED 500 million. Rajan is deeply committed to mentoring young Malayali professionals, regularly speaking at community forums and business schools.`,
    bioLongMl: `2002-ൽ ദുബായിൽ എത്തിയ രാജൻ നായർ കേരളത്തിന്റെ ആദർശങ്ങളും കഠിനാദ്ധ്വാനവും ഉൾക്കൊണ്ട് ഒരു ബിസിനസ് സാമ്രാജ്യം സ്ഥാപിക്കാൻ ദൃഢനിശ്ചയമെടുത്തു. ദേരയിൽ ഒരു പ്രോപ്പർടി ബ്രോക്കറേജ് ഫേം ആരംഭിച്ചു, ആ ഒരു ഫേം ഇന്ന് UAE-ൽ 500-ലധികം ജീവനക്കാരുള്ള ഒരു ഗ്രൂപ്പായി വളർന്നിരിക്കുന്നു.`,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80&auto=format&fit=crop&crop=faces',
    coverImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1400&q=85&auto=format&fit=crop',
    location: 'Dubai, UAE',
    locationMl: 'ദുബായ്, UAE',
    origin: 'Thrissur, Kerala',
    originMl: 'തൃശ്ശൂർ, കേരളം',
    memberSince: '2018',
    verified: true,
    featured: true,
    phone: '+971 50 123 4567',
    email: 'rajan@nairgroup.ae',
    website: 'https://nairgroup.ae',
    whatsapp: '+971 50 123 4567',
    linkedin: 'https://linkedin.com/in/rajannair',
    instagram: 'https://instagram.com/rajannair',
    youtube: 'https://youtube.com/@rajannair',
    stats: {
      yearsInBusiness: 22,
      employees: '500+',
      businesses: 6,
      countries: 4,
      reviews: 142,
      followers: 4820,
    },
    businesses: [mockBusinesses[0], mockBusinesses[1], mockBusinesses[4]],
    achievements: [
      { year: '2023', title: 'Forbes Middle East Top 50 Indian Business Leaders', titleMl: 'ഫോർബ്സ് ME ടോപ് 50 ഇന്ത്യൻ ബിസിനസ് ലീഡർ', org: 'Forbes Middle East', orgMl: 'ഫോർബ്സ് മിഡിൽ ഈസ്റ്റ്', icon: 'award' },
      { year: '2022', title: 'CNBC Arabia Business Leader of the Year', titleMl: 'CNBC അറേബ്യ ബിസിനസ് ലീഡർ ഓഫ് ദ ഇയർ', org: 'CNBC Arabia', orgMl: 'CNBC അറേബ്യ', icon: 'media' },
      { year: '2021', title: 'Pravasi Bharatiya Samman Award', titleMl: 'പ്രവാസി ഭാരതീയ സമ്മാൻ അവാർഡ്', org: 'Ministry of External Affairs, India', orgMl: 'ഇന്ത്യ, വിദേശ മന്ത്രാലയം', icon: 'award' },
      { year: '2020', title: 'Opened 5th business — TechVenture UAE', titleMl: '5-ാം ബിസിനസ് ആരംഭം — TechVenture UAE', org: 'Dubai Internet City', orgMl: 'ദുബായ് ഇന്റർനെറ്റ് സിറ്റി', icon: 'business' },
      { year: '2018', title: 'Keralites Global Icon Award for Business Excellence', titleMl: 'Keralites Global Icon Award', org: 'Keralites Global Inc.', orgMl: 'Keralites Global Inc.', icon: 'award' },
      { year: '2015', title: 'Expanded to Abu Dhabi & Sharjah operations', titleMl: 'അബുദാബി, ഷാർജ ഓപ്പറേഷൻ വ്യാപനം', org: 'Nair Group', orgMl: 'നായർ ഗ്രൂപ്പ്', icon: 'business' },
      { year: '2010', title: 'Launched Malabar Medical Centre — first healthcare venture', titleMl: 'മലബാർ മെഡിക്കൽ സെന്റർ ആരംഭം', org: 'Nair Group Healthcare', orgMl: 'നായർ ഗ്രൂപ്പ് ഹെൽത്ത്കെയർ', icon: 'business' },
      { year: '2002', title: 'Founded first business in Deira, Dubai', titleMl: 'ദേര, ദുബായിൽ ആദ്യ ബിസിനസ് ആരംഭം', org: 'Nair Properties', orgMl: 'നായർ പ്രോപ്പർടീസ്', icon: 'business' },
    ],
    posts: [
      {
        id: 1,
        title: '10 Lessons I Learned Building a Business Empire in Dubai',
        titleMl: 'ദുബായിൽ ബിസിനസ് സാമ്രാജ്യം കെട്ടിപ്പടുക്കുമ്പോൾ ഞാൻ പഠിച്ച 10 പാഠങ്ങൾ',
        excerpt: 'From a single brokerage desk in Deira to a 500-person group — here\'s what no business school will ever teach you.',
        excerptMl: 'ദേരയിലെ ഒരു ബ്രോക്കറേജ് ഡെസ്കിൽ നിന്ന് 500 പേരുടെ ഗ്രൂപ്പ് — ബിസിനസ് സ്കൂൾ പഠിപ്പിക്കാത്ത കാര്യങ്ങൾ.',
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80&auto=format&fit=crop',
        date: 'May 12, 2025',
        readTime: '8 min',
        likes: 1240,
        tag: 'Business',
        tagMl: 'ബിസിനസ്',
      },
      {
        id: 2,
        title: 'Why UAE Real Estate is Still the Best Bet for NRI Investment in 2025',
        titleMl: '2025-ൽ UAE റിയൽ എസ്റ്റേറ്റ് NRI-കൾക്ക് ഏറ്റവും മികച്ച നിക്ഷേപം',
        excerpt: 'Market fundamentals, Golden Visa benefits, and the data behind our latest portfolio expansion decisions.',
        excerptMl: 'Golden Visa ഗുണങ്ങൾ, ഞങ്ങളുടെ ഏറ്റവും പുതിയ നിക്ഷേപ തീരുമാനങ്ങൾക്ക് പിന്നിലെ ഡേറ്റ.',
        image: 'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=600&q=80&auto=format&fit=crop',
        date: 'Apr 3, 2025',
        readTime: '12 min',
        likes: 876,
        tag: 'Real Estate',
        tagMl: 'റിയൽ എസ്റ്റേറ്റ്',
      },
      {
        id: 3,
        title: 'Mentoring Young Malayalis: Building the Next Generation of Gulf Leaders',
        titleMl: 'അടുത്ത തലമുറ ഗൾഫ് ലീഡർമാർ: യുവ മലയാളികൾക്ക് മാർഗ്ഗദർശനം',
        excerpt: 'We launched the UAE Malayali Mentorship Program — and the response from young professionals exceeded all expectations.',
        excerptMl: 'UAE മലയാളി Mentorship Program — യുവ പ്രൊഫഷണലുകളുടെ പ്രതികരണം എല്ലാ പ്രതീക്ഷകളെയും മറികടന്നു.',
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80&auto=format&fit=crop',
        date: 'Mar 18, 2025',
        readTime: '6 min',
        likes: 2104,
        tag: 'Community',
        tagMl: 'കമ്മ്യൂണിറ്റി',
      },
    ],
    tags: ['Real Estate', 'Healthcare', 'Technology', 'Mentor', 'Community Leader'],
    tagsMl: ['റിയൽ എസ്റ്റേറ്റ്', 'ഹെൽത്ത്കെയർ', 'ടെക്നോളജി', 'മെന്റർ', 'കമ്മ്യൂണിറ്റി ലീഡർ'],
  },
]

const defaultOwner = ownerProfiles[0]

const achievementIconColor: Record<string, string> = {
  award: 'bg-kerala-gold/10 text-kerala-gold border-kerala-gold/20',
  business: 'bg-kerala-green/10 text-kerala-green border-kerala-green/20',
  community: 'bg-blue-50 text-blue-600 border-blue-100',
  media: 'bg-purple-50 text-purple-600 border-purple-100',
}

function AchievementIcon({ type }: { type: string }) {
  if (type === 'award') return <Award size={16} />
  if (type === 'business') return <Building2 size={16} />
  if (type === 'community') return <Users size={16} />
  return <Star size={16} />
}

export default function OwnerProfilePage() {
  const locale = useLocale()
  const isMl = locale === 'ml'
  const params = useParams<{ username: string }>()
  const owner = ownerProfiles.find(o => o.username === params.username) ?? defaultOwner

  const [bioExpanded, setBioExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState<'posts' | 'businesses' | 'achievements'>('posts')
  const [postLikes, setPostLikes] = useState<Record<number, boolean>>({})

  const socialLinks = [
    { href: `https://wa.me/${owner.whatsapp.replace(/\D/g, '')}`, Icon: IconWhatsApp, label: 'WhatsApp', color: 'bg-green-500 hover:bg-green-600' },
    { href: owner.linkedin, Icon: IconLinkedIn, label: 'LinkedIn', color: 'bg-blue-700 hover:bg-blue-800' },
    { href: owner.instagram, Icon: IconInstagram, label: 'Instagram', color: 'bg-pink-600 hover:bg-pink-700' },
    { href: owner.youtube, Icon: IconYouTube, label: 'YouTube', color: 'bg-red-600 hover:bg-red-700' },
  ]

  return (
    <main className="min-h-screen bg-kerala-cream">
      <Navbar />

      {/* ── Cover Banner ─────────────────────────────────────── */}
      <div className="relative h-64 md:h-80 lg:h-96 w-full overflow-hidden">
        <Image
          src={owner.coverImage}
          alt="Cover"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-kerala-deep/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-kerala-deep/50 to-transparent" />

        {/* Featured badge */}
        {owner.featured && (
          <div className="absolute top-6 right-6 bg-kerala-gold/90 backdrop-blur text-white text-xs font-bold px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
            <Star size={13} className="fill-white" />
            {isMl ? 'MalayaliBusiness.com-ൽ ഫീച്ചർ ചെയ്തത്' : 'Featured on MalayaliBusiness.com'}
          </div>
        )}
      </div>

      {/* ── Profile Header ────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-20 md:-mt-24 mb-6 flex flex-col md:flex-row md:items-end gap-5 md:gap-6">
          {/* Avatar */}
          <div className="relative w-32 h-32 md:w-36 md:h-36 rounded-2xl overflow-hidden border-4 border-white shadow-2xl flex-shrink-0 bg-gray-100">
            <Image
              src={owner.avatar}
              alt={owner.name}
              fill
              className="object-cover object-top"
              sizes="144px"
            />
            {owner.verified && (
              <div className="absolute bottom-2 right-2 bg-kerala-green text-white rounded-full p-1 shadow">
                <BadgeCheck size={14} />
              </div>
            )}
          </div>

          {/* Name block */}
          <div className="flex-1 md:pb-2">
            <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
              <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-kerala-deep">
                {isMl ? owner.nameMl : owner.name}
              </h1>
              {owner.verified && (
                <span className="flex items-center gap-1 bg-kerala-green/10 text-kerala-green text-xs font-bold px-2.5 py-1 rounded-full border border-kerala-green/20">
                  <BadgeCheck size={12} /> {isMl ? 'Verified' : 'Verified'}
                </span>
              )}
            </div>
            <p className="text-gray-600 text-sm md:text-base mb-2 leading-snug max-w-xl">
              {isMl ? owner.titleMl : owner.title}
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1"><MapPin size={12} className="text-kerala-green" /> {isMl ? owner.locationMl : owner.location}</span>
              <span className="flex items-center gap-1"><Building2 size={12} className="text-kerala-green" /> {isMl ? 'സ്വദേശം:' : 'From:'} {isMl ? owner.originMl : owner.origin}</span>
              <span className="flex items-center gap-1"><Calendar size={12} /> {isMl ? 'അംഗം' : 'Member'} {owner.memberSince}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2.5 md:pb-2 flex-shrink-0">
            <a
              href={`https://wa.me/${owner.whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-kerala-green hover:bg-kerala-green-light text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm"
            >
              <MessageCircle size={16} />
              {isMl ? 'കണക്ട് ചെയ്യൂ' : 'Connect'}
            </a>
            <a
              href={`mailto:${owner.email}`}
              className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 hover:border-kerala-green hover:text-kerala-green text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm"
            >
              <Mail size={15} />
              {isMl ? 'ഇമെയിൽ' : 'Email'}
            </a>
            <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-500 hover:text-kerala-green hover:border-kerala-green text-sm font-semibold px-3.5 py-2.5 rounded-xl transition-all shadow-sm">
              <Share2 size={15} />
            </button>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-7">
          {(isMl ? owner.tagsMl : owner.tags).map(tag => (
            <span key={tag} className="bg-white border border-gray-200 text-gray-600 text-xs font-medium px-3 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        {/* ── Stats Bar ────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {[
            { icon: Clock, val: `${owner.stats.yearsInBusiness}`, unit: isMl ? 'വർഷം' : 'yrs', label: isMl ? 'ബിസിനസ് അനുഭവം' : 'In Business', color: 'text-kerala-green' },
            { icon: Users, val: owner.stats.employees, unit: '', label: isMl ? 'ജീവനക്കാർ' : 'Employees', color: 'text-blue-600' },
            { icon: Building2, val: `${owner.stats.businesses}`, unit: '', label: isMl ? 'ബിസിനസ്' : 'Businesses', color: 'text-kerala-gold' },
            { icon: Globe, val: `${owner.stats.countries}`, unit: '', label: isMl ? 'രാജ്യങ്ങൾ' : 'Countries', color: 'text-purple-600' },
            { icon: Star, val: `${owner.stats.reviews}`, unit: '', label: isMl ? 'റിവ്യൂ' : 'Reviews', color: 'text-orange-500' },
            { icon: TrendingUp, val: owner.stats.followers.toLocaleString(), unit: '', label: isMl ? 'ഫോളോവർ' : 'Followers', color: 'text-kerala-red' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-4 flex flex-col items-center text-center">
              <s.icon size={20} className={`${s.color} mb-2`} />
              <div className="font-serif font-bold text-kerala-deep text-xl leading-none">
                {s.val}{s.unit && <span className="text-sm font-normal text-gray-400 ml-0.5">{s.unit}</span>}
              </div>
              <div className="text-gray-500 text-xs mt-1 leading-tight">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Main Two-Column Layout ────────────────────────── */}
        <div className="flex flex-col lg:flex-row gap-7 pb-16">

          {/* ── Left column ─────────── */}
          <div className="flex-1 min-w-0 space-y-6">

            {/* Bio */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-7">
              <h2 className="font-serif font-bold text-kerala-deep text-xl mb-4 flex items-center gap-2">
                {isMl ? 'ആത്മകഥ' : 'About'}
              </h2>
              <div className="space-y-4">
                <div>
                  <p className={`text-gray-600 text-sm leading-relaxed ${!bioExpanded ? 'line-clamp-4' : ''}`}>
                    {isMl ? owner.bioLongMl : owner.bioLong}
                  </p>
                  <button
                    onClick={() => setBioExpanded(!bioExpanded)}
                    className="text-kerala-green text-sm font-semibold mt-2 hover:underline flex items-center gap-1"
                  >
                    {bioExpanded
                      ? (isMl ? 'ചുരുക്കൂ' : 'Show less')
                      : (isMl ? 'കൂടുതൽ വായിക്കൂ' : 'Read more')}
                    <ChevronRight size={14} className={`transition-transform ${bioExpanded ? 'rotate-90' : ''}`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex border-b border-gray-100">
                {(
                  [
                    { key: 'posts', label: isMl ? 'ലേഖനങ്ങൾ' : 'Posts', count: owner.posts.length },
                    { key: 'businesses', label: isMl ? 'ബിസിനസ്' : 'Businesses', count: owner.businesses.length },
                    { key: 'achievements', label: isMl ? 'അവാർഡ്' : 'Achievements', count: owner.achievements.length },
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
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.key ? 'bg-kerala-green text-white' : 'bg-gray-100 text-gray-500'}`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              <div className="p-6">
                {/* Posts tab */}
                {activeTab === 'posts' && (
                  <div className="space-y-5">
                    {owner.posts.map((post, idx) => (
                      <article
                        key={post.id}
                        className={`flex gap-5 ${idx !== owner.posts.length - 1 ? 'pb-5 border-b border-gray-100' : ''}`}
                      >
                        <div className="relative w-28 h-20 rounded-xl overflow-hidden flex-shrink-0">
                          <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover"
                            sizes="112px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="bg-kerala-cream text-kerala-green text-xs font-semibold px-2 py-0.5 rounded-full">
                              {isMl ? post.tagMl : post.tag}
                            </span>
                            <span className="text-gray-400 text-xs flex items-center gap-1">
                              <Clock size={11} /> {post.readTime}
                            </span>
                          </div>
                          <h3 className="font-serif font-bold text-kerala-deep text-base leading-snug mb-1.5 line-clamp-2">
                            {isMl ? post.titleMl : post.title}
                          </h3>
                          <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-2.5">
                            {isMl ? post.excerptMl : post.excerpt}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-400">
                            <span>{post.date}</span>
                            <button
                              onClick={() => setPostLikes(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                              className={`flex items-center gap-1 transition-colors ${postLikes[post.id] ? 'text-red-500' : 'hover:text-red-400'}`}
                            >
                              <Heart size={13} className={postLikes[post.id] ? 'fill-current' : ''} />
                              {post.likes + (postLikes[post.id] ? 1 : 0)}
                            </button>
                            <button className="flex items-center gap-1 hover:text-gray-600">
                              <Bookmark size={13} />
                              {isMl ? 'സേവ്' : 'Save'}
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}

                {/* Businesses tab */}
                {activeTab === 'businesses' && (
                  <div className="space-y-4">
                    {owner.businesses.map(biz => (
                      <Link
                        key={biz.id}
                        href={`/${locale}/company/${biz.slug}`}
                        className="group flex gap-4 p-4 rounded-2xl hover:bg-kerala-cream transition-colors border border-transparent hover:border-gray-200"
                      >
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0">
                          <Image src={biz.image} alt={biz.name} fill className="object-cover" sizes="64px" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <h3 className="font-serif font-bold text-kerala-deep text-base group-hover:text-kerala-green transition-colors">
                                  {isMl ? biz.nameMl : biz.name}
                                </h3>
                                {biz.verified && <BadgeCheck size={14} className="text-kerala-green flex-shrink-0" />}
                              </div>
                              <p className="text-kerala-green text-xs font-semibold mt-0.5">{isMl ? biz.categoryMl : biz.category}</p>
                            </div>
                            <ChevronRight size={16} className="text-gray-300 group-hover:text-kerala-green mt-1 transition-colors flex-shrink-0" />
                          </div>
                          <p className="text-gray-500 text-xs leading-relaxed mt-1.5 line-clamp-2">
                            {isMl ? biz.descriptionMl : biz.description}
                          </p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                            <span className="flex items-center gap-1"><MapPin size={11} /> {biz.emirate}</span>
                            <span className="flex items-center gap-1"><Star size={11} className="text-kerala-gold" /> {biz.rating} ({biz.reviewCount})</span>
                            <span className="flex items-center gap-1"><Calendar size={11} /> Est. {biz.established}</span>
                          </div>
                        </div>
                      </Link>
                    ))}

                    <Link
                      href={`/${locale}/directory`}
                      className="flex items-center justify-center gap-2 text-kerala-green font-semibold text-sm py-3 border border-dashed border-kerala-green/30 rounded-xl hover:bg-kerala-green/5 transition-colors"
                    >
                      {isMl ? 'ബിസിനസ് ഡയറക്ടറി കാണൂ' : 'Explore Business Directory'}
                      <ArrowRight size={15} />
                    </Link>
                  </div>
                )}

                {/* Achievements tab */}
                {activeTab === 'achievements' && (
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-5 top-0 bottom-0 w-px bg-gray-100" />

                    <div className="space-y-6">
                      {owner.achievements.map((ach, idx) => (
                        <div key={idx} className="flex gap-5 relative">
                          {/* Icon */}
                          <div className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 z-10 ${achievementIconColor[ach.icon]}`}>
                            <AchievementIcon type={ach.icon} />
                          </div>

                          {/* Content */}
                          <div className="flex-1 pb-2">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h4 className="font-semibold text-kerala-deep text-sm leading-snug">
                                  {isMl ? ach.titleMl : ach.title}
                                </h4>
                                <p className="text-gray-500 text-xs mt-0.5 flex items-center gap-1">
                                  <Building2 size={11} /> {isMl ? ach.orgMl : ach.org}
                                </p>
                              </div>
                              <span className="bg-gray-100 text-gray-500 text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0">
                                {ach.year}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Right Sidebar ───────── */}
          <div className="w-full lg:w-72 flex-shrink-0 space-y-5">

            {/* Contact card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-serif font-bold text-kerala-deep text-base mb-4">
                {isMl ? 'ബന്ധപ്പെടൂ' : 'Get in Touch'}
              </h3>
              <div className="space-y-3">
                {[
                  { icon: Phone, val: owner.phone, href: `tel:${owner.phone}`, label: isMl ? 'ഫോൺ' : 'Phone' },
                  { icon: Mail, val: owner.email, href: `mailto:${owner.email}`, label: isMl ? 'ഇമെയിൽ' : 'Email' },
                  { icon: Globe, val: owner.website.replace('https://', ''), href: owner.website, label: isMl ? 'വെബ്സൈറ്റ്' : 'Website' },
                ].map(c => (
                  <a
                    key={c.href}
                    href={c.href}
                    target={c.href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 group"
                  >
                    <div className="w-8 h-8 bg-kerala-cream rounded-lg flex items-center justify-center flex-shrink-0">
                      <c.icon size={14} className="text-kerala-green" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-gray-400 text-xs">{c.label}</p>
                      <p className="text-gray-700 text-xs font-medium truncate group-hover:text-kerala-green transition-colors">
                        {c.val}
                      </p>
                    </div>
                    <ExternalLink size={11} className="text-gray-300 group-hover:text-kerala-green flex-shrink-0 ml-auto" />
                  </a>
                ))}
              </div>
            </div>

            {/* Social links */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-serif font-bold text-kerala-deep text-base mb-4">
                {isMl ? 'സോഷ്യൽ മീഡിയ' : 'Social Media'}
              </h3>
              <div className="grid grid-cols-2 gap-2.5">
                {socialLinks.map(s => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center gap-2 ${s.color} text-white text-xs font-semibold py-2.5 rounded-xl transition-all`}
                  >
                    <s.Icon size={15} />
                    {s.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Follow CTA */}
            <div className="relative overflow-hidden rounded-2xl bg-kerala-deep p-5 text-white">
              <Image
                src="https://images.unsplash.com/photo-1546412414-e1885259563a?w=400&q=80&auto=format&fit=crop"
                alt=""
                fill
                className="object-cover opacity-10"
                sizes="288px"
              />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp size={18} className="text-kerala-gold-light" />
                  <span className="text-kerala-gold-light font-bold text-sm">
                    {owner.stats.followers.toLocaleString()} {isMl ? 'ഫോളോവർ' : 'Followers'}
                  </span>
                </div>
                <p className="text-white/70 text-xs mb-4 leading-relaxed">
                  {isMl
                    ? 'ഏറ്റവും പുതിയ ബിസിനസ് അപ്ഡേറ്റ്, ഇൻസൈറ്റ്സ്, ഇവന്റ് ഇൻവൈറ്റ് ലഭിക്കൂ'
                    : 'Get the latest business updates, insights, and event invitations'}
                </p>
                <button className="w-full bg-kerala-gold hover:bg-kerala-gold-light text-white font-bold py-2.5 rounded-xl text-sm transition-all">
                  {isMl ? 'ഫോളോ ചെയ്യൂ' : 'Follow'}
                </button>
              </div>
            </div>

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
