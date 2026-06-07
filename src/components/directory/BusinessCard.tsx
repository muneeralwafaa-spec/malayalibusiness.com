'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { MapPin, Phone, BadgeCheck, Clock, ChevronRight, MessageCircle } from 'lucide-react'
import { useState } from 'react'
import type { Business } from '@/types/business'
import FavouriteButton from '@/components/ui/FavouriteButton'

type Props = {
  business: Business
  view: 'grid' | 'list'
}

// priceRange: 1=free, 2=basic, 3=premium, 4=elite (see adaptListing)
const planLabels = ['', '', 'Basic', 'Premium', 'Elite']

// Unsplash cover photos by category (fixed, no random so SSR/CSR match)
const categoryCoverPhotos: Record<string, string> = {
  restaurant: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
  food: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
  'real estate': 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80',
  property: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80',
  healthcare: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80',
  medical: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80',
  clinic: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80',
  technology: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
  tech: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
  it: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
  beauty: 'https://images.unsplash.com/photo-1560066984-138daaa7b78a?w=800&q=80',
  salon: 'https://images.unsplash.com/photo-1560066984-138daaa7b78a?w=800&q=80',
  spa: 'https://images.unsplash.com/photo-1560066984-138daaa7b78a?w=800&q=80',
  education: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80',
  school: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80',
  finance: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
  bank: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
  construction: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
  contracting: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
  retail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
  shopping: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
}

const DEFAULT_COVER = 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80' // Dubai skyline

function getCoverPhoto(category: string, existingImage?: string): string {
  if (existingImage && !existingImage.includes('placeholder') && !existingImage.startsWith('/placeholder')) {
    return existingImage
  }
  const key = category.toLowerCase()
  for (const [cat, url] of Object.entries(categoryCoverPhotos)) {
    if (key.includes(cat)) return url
  }
  return DEFAULT_COVER
}

// Initials avatar rendered as a plain div (no broken img)
function InitialsAvatar({ name, size = 40 }: { name: string; size?: number }) {
  const initial = (name || '?').trim()[0].toUpperCase()
  return (
    <div
      style={{
        width: size,
        height: size,
        background: '#1a7a4a',
        borderRadius: size >= 80 ? 16 : 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <span
        style={{
          color: '#fff',
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: size * 0.45,
          fontWeight: 700,
          lineHeight: 1,
        }}
      >
        {initial}
      </span>
    </div>
  )
}

// Logo with onError fallback to initials
function BusinessLogo({ logo, name, size = 40 }: { logo?: string; name: string; size?: number }) {
  const [failed, setFailed] = useState(false)

  if (!logo || failed) {
    return <InitialsAvatar name={name} size={size} />
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={logo}
      alt=""
      width={size}
      height={size}
      onError={() => setFailed(true)}
      style={{ width: size, height: size, objectFit: 'cover', borderRadius: size >= 80 ? 16 : 8 }}
    />
  )
}

// Cover image with onError fallback to category photo
function CoverImage({ src, alt, category }: { src: string; alt: string; category: string }) {
  const [imgSrc, setImgSrc] = useState(() => getCoverPhoto(category, src))

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imgSrc}
      alt={alt}
      onError={() => setImgSrc(getCoverPhoto(category))}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
    />
  )
}

function Stars({ rating, size = 13 }: { rating: number; size?: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`${i <= Math.floor(rating) ? 'fill-kerala-gold text-kerala-gold' : 'fill-gray-200 text-gray-200'}`}
          style={{ width: size, height: size }}
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </span>
  )
}

export default function BusinessCard({ business: b, view }: Props) {
  const locale = useLocale()
  const isMl = locale === 'ml'
  const planLabel = planLabels[b.priceRange] || ''

  if (view === 'list') {
    return (
      <div className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg hover:border-kerala-green/20 transition-all duration-300 flex">
        {/* Cover */}
        <div className="relative w-28 sm:w-40 md:w-52 flex-shrink-0">
          <CoverImage src={b.image} alt={b.name} category={b.category} />
          {b.premium && (
            <div className="absolute top-2 left-2 bg-kerala-gold text-white text-xs font-bold px-2 py-0.5 rounded-full z-10">
              Premium
            </div>
          )}
          {b.open ? (
            <div className="absolute bottom-2 left-2 bg-emerald-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 z-10">
              <span className="w-1.5 h-1.5 bg-white rounded-full inline-block" />
              {isMl ? 'തുറന്നിരിക്കുന്നു' : 'Open'}
            </div>
          ) : (
            <div className="absolute bottom-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full z-10">
              {isMl ? 'അടഞ്ഞിരിക്കുന്നു' : 'Closed'}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between min-w-0">
          <div>
            {/* Category + Logo + Verified */}
            <div className="flex items-center gap-2 mb-1.5">
              <BusinessLogo logo={b.logo} name={b.name} size={32} />
              <span className="text-xs font-semibold text-kerala-green uppercase tracking-wide">
                {isMl ? b.categoryMl : b.category}
              </span>
              {b.verified && (
                <BadgeCheck size={14} className="text-kerala-green flex-shrink-0" />
              )}
              {b.featured && (
                <span className="bg-kerala-gold/10 text-kerala-gold text-xs font-semibold px-2 py-0.5 rounded-full">
                  {isMl ? 'ഫീച്ചർഡ്' : 'Featured'}
                </span>
              )}
            </div>

            {/* Name */}
            <Link
              href={`/${locale}/company/${b.slug}`}
              className="font-serif text-xl font-bold text-kerala-deep group-hover:text-kerala-green transition-colors line-clamp-1 block"
            >
              {isMl ? b.nameMl : b.name}
            </Link>

            {/* Rating row */}
            <div className="flex items-center gap-3 mt-1.5 mb-2">
              <Stars rating={b.rating} />
              <span className="font-semibold text-sm text-gray-800">{b.rating}</span>
              <span className="text-gray-400 text-sm">({b.reviewCount.toLocaleString()} reviews)</span>
              {planLabel && (
                <>
                  <span className="text-gray-300">·</span>
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                    {planLabel}
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-500 text-sm line-clamp-2 mb-3">
              {isMl ? b.descriptionMl : b.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {(isMl ? b.tagsMl : b.tags).slice(0, 4).map((tag) => (
                <span key={tag} className="text-xs bg-kerala-cream text-gray-600 px-2.5 py-1 rounded-full border border-gray-200">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom row */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <MapPin size={12} className="text-kerala-green" />
                {isMl ? b.locationMl : b.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={12} className="text-kerala-green" />
                {b.hours}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {b.whatsapp && (
                <a
                  href={`https://wa.me/${b.whatsapp.replace(/\D/g, '')}`}
                  className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors"
                >
                  <MessageCircle size={13} />
                  WhatsApp
                </a>
              )}
              <a
                href={`tel:${b.phone}`}
                className="flex items-center gap-1.5 bg-kerala-cream text-kerala-green border border-kerala-green/20 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-kerala-green hover:text-white transition-colors"
              >
                <Phone size={13} />
                {isMl ? 'വിളിക്കൂ' : 'Call'}
              </a>
              <Link
                href={`/${locale}/company/${b.slug}`}
                className="flex items-center gap-1 bg-kerala-green text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-kerala-green-light transition-colors"
              >
                {isMl ? 'കൂടുതൽ' : 'View'}
                <ChevronRight size={13} />
              </Link>
              <FavouriteButton itemType="listing" itemId={String(b.id)} size="sm" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Grid view
  return (
    <div className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:border-kerala-green/20 transition-all duration-300 flex flex-col">
      {/* Cover */}
      <div className="relative h-44 overflow-hidden">
        <CoverImage src={b.image} alt={b.name} category={b.category} />
        {/* Gradient overlay so badges are readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {b.premium && (
            <span className="bg-kerala-gold text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
              Premium
            </span>
          )}
          {b.featured && !b.premium && (
            <span className="bg-kerala-red text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
              {isMl ? 'ഫീച്ചർഡ്' : 'Featured'}
            </span>
          )}
        </div>

        {/* Open/Closed */}
        <div className="absolute bottom-3 right-3 z-10">
          {b.open ? (
            <span className="bg-emerald-500/90 backdrop-blur text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-white rounded-full" />
              {isMl ? 'തുറന്നിരിക്കുന്നു' : 'Open'}
            </span>
          ) : (
            <span className="bg-red-500/90 backdrop-blur text-white text-xs font-semibold px-2.5 py-1 rounded-full">
              {isMl ? 'അടഞ്ഞ്' : 'Closed'}
            </span>
          )}
        </div>

        {/* Logo — always shown, falls back to initials */}
        <div className="absolute bottom-3 left-3 z-10 rounded-lg border-2 border-white shadow-md overflow-hidden bg-white" style={{ width: 40, height: 40 }}>
          <BusinessLogo logo={b.logo} name={b.name} size={40} />
        </div>

        {/* Favourite button */}
        <div className="absolute top-3 right-3 z-10">
          <FavouriteButton itemType="listing" itemId={String(b.id)} size="sm" />
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        {/* Category + Verified */}
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="text-xs font-semibold text-kerala-green uppercase tracking-wide truncate">
            {isMl ? b.categoryMl : b.category}
          </span>
          {b.verified && <BadgeCheck size={13} className="text-kerala-green flex-shrink-0" />}
        </div>

        {/* Name */}
        <Link
          href={`/${locale}/company/${b.slug}`}
          className="font-serif text-lg font-bold text-kerala-deep group-hover:text-kerala-green transition-colors leading-snug line-clamp-2 mb-1.5"
        >
          {isMl ? b.nameMl : b.name}
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-2">
          <Stars rating={b.rating} size={12} />
          <span className="font-semibold text-xs text-gray-800">{b.rating}</span>
          <span className="text-gray-400 text-xs">({b.reviewCount})</span>
          {planLabel && (
            <span className="ml-auto text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {planLabel}
            </span>
          )}
        </div>

        {/* Location + Hours */}
        <div className="flex flex-col gap-1 mb-3">
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <MapPin size={11} className="text-kerala-green flex-shrink-0" />
            <span className="truncate">{isMl ? b.locationMl : b.location}</span>
          </span>
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <Clock size={11} className="text-kerala-green flex-shrink-0" />
            {b.hours}
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {(isMl ? b.tagsMl : b.tags).slice(0, 3).map((tag) => (
            <span key={tag} className="text-xs bg-kerala-cream text-gray-600 px-2 py-0.5 rounded-full border border-gray-200">
              {tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-auto flex items-center gap-2">
          {b.whatsapp && (
            <a
              href={`https://wa.me/${b.whatsapp.replace(/\D/g, '')}`}
              className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold py-2 rounded-xl hover:bg-emerald-100 transition-colors"
            >
              <MessageCircle size={12} />
              WhatsApp
            </a>
          )}
          <Link
            href={`/${locale}/company/${b.slug}`}
            className="flex-1 flex items-center justify-center gap-1 bg-kerala-green text-white text-xs font-semibold py-2 rounded-xl hover:bg-kerala-green-light transition-colors"
          >
            {isMl ? 'വിശദാംശങ്ങൾ' : 'View Details'}
            <ChevronRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  )
}
