'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { MapPin, Phone, BadgeCheck, Clock, ChevronRight, MessageCircle } from 'lucide-react'
import type { Business } from '@/types/business'

type Props = {
  business: Business
  view: 'grid' | 'list'
}

const priceLabels = ['', 'AED', 'AED AED', 'AED AED AED', 'AED AED AED AED']

function Stars({ rating, size = 13 }: { rating: number; size?: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`w-[${size}px] h-[${size}px] ${i <= Math.floor(rating) ? 'fill-kerala-gold text-kerala-gold' : 'fill-gray-200 text-gray-200'}`}
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

  if (view === 'list') {
    return (
      <div className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg hover:border-kerala-green/20 transition-all duration-300 flex">
        {/* Image */}
        <div className="relative w-40 sm:w-52 flex-shrink-0">
          <Image
            src={b.image}
            alt={b.name}
            fill
            className="object-cover"
            sizes="208px"
          />
          {b.premium && (
            <div className="absolute top-2 left-2 bg-kerala-gold text-white text-xs font-bold px-2 py-0.5 rounded-full">
              Premium
            </div>
          )}
          {b.open ? (
            <div className="absolute bottom-2 left-2 bg-emerald-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-white rounded-full inline-block" />
              {isMl ? 'തുറന്നിരിക്കുന്നു' : 'Open'}
            </div>
          ) : (
            <div className="absolute bottom-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              {isMl ? 'അടഞ്ഞിരിക്കുന്നു' : 'Closed'}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between min-w-0">
          <div>
            {/* Category + Verified */}
            <div className="flex items-center gap-2 mb-1.5">
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
              <span className="text-gray-300">·</span>
              <span className="text-gray-500 text-sm font-medium">{priceLabels[b.priceRange]}</span>
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
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Grid view
  return (
    <div className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:border-kerala-green/20 transition-all duration-300 flex flex-col">
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <Image
          src={b.image}
          alt={b.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
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
        <div className="absolute bottom-3 right-3">
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
        {/* Logo */}
        {b.logo && (
          <div className="absolute bottom-3 left-3 w-10 h-10 rounded-lg border-2 border-white overflow-hidden bg-white shadow-md">
            <Image src={b.logo} alt="" fill className="object-cover" sizes="40px" />
          </div>
        )}
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
          <span className="ml-auto text-xs font-medium text-gray-500">{priceLabels[b.priceRange]}</span>
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
