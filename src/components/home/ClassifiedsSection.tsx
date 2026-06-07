'use client'

import Link from 'next/link'
import { useLocale } from 'next-intl'
import { useEffect, useState } from 'react'
import { Clock, MapPin, ArrowRight, Plus, Loader2 } from 'lucide-react'
import { getClassifieds } from '@/lib/classifieds'
import type { Classified } from '@/lib/classifieds'

const typeColors: Record<string, string> = {
  sale:    'bg-blue-100 text-blue-700',
  rent:    'bg-green-100 text-green-700',
  wanted:  'bg-yellow-100 text-yellow-700',
  service: 'bg-purple-100 text-purple-700',
}
const typeLabels: Record<string, { en: string; ml: string }> = {
  sale:    { en: 'For Sale', ml: 'വിൽക്കാൻ' },
  rent:    { en: 'For Rent', ml: 'വാടകയ്ക്ക്' },
  wanted:  { en: 'Wanted',   ml: 'ആവശ്യം' },
  service: { en: 'Service',  ml: 'സേവനം' },
}

function timeAgo(iso: string, isMl: boolean) {
  const h = Math.floor((Date.now() - new Date(iso).getTime()) / 3600000)
  if (h < 1)  return isMl ? 'ഇപ്പോൾ' : 'Just now'
  if (h < 24) return isMl ? `${h} മണിക്കൂർ മുൻപ്` : `${h}h ago`
  const d = Math.floor(h / 24)
  return isMl ? `${d} ദിവസം മുൻപ്` : `${d}d ago`
}

const CATEGORY_FALLBACKS: Record<string, string> = {
  vehicles:    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80',
  property:    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80',
  electronics: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&q=80',
  furniture:   'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80',
  fashion:     'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80',
  jobs:        'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80',
  services:    'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&q=80',
  food:        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80',
}
const FALLBACK = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&q=80'

function classifiedFallback(category?: string) {
  if (!category) return FALLBACK
  const key = category.toLowerCase()
  for (const [k, url] of Object.entries(CATEGORY_FALLBACKS)) {
    if (key.includes(k)) return url
  }
  return FALLBACK
}

const BASE = { description: null, description_ml: null, category_ml: null, subcategory: null, price_numeric: null, negotiable: true, condition: null as null, location: 'UAE', location_ml: null, views: 0, featured: false, phone: null, whatsapp: null, seller_name: null, seller_name_ml: null, seller_avatar: null, owner_id: null, status: 'active' as const, expires_at: null }
const PLACEHOLDER_CLASSIFIEDS: Classified[] = [
  { ...BASE, id: 1, title: 'Toyota Camry 2021 — Excellent Condition', title_ml: 'ടൊയോറ്റ കാംറി 2021', type: 'sale', category: 'vehicles', price: 'AED 52,000', emirate: 'Dubai', images: ['https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80'], urgent: false, created_at: new Date(Date.now() - 3600000).toISOString() },
  { ...BASE, id: 2, title: '2BHK Apartment for Rent — Dubai Marina', title_ml: 'ദുബായ് മറീനയിൽ 2BHK ഫ്ലാറ്റ്', type: 'rent', category: 'property', price: 'AED 6,500/mo', emirate: 'Dubai', images: ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80'], urgent: false, created_at: new Date(Date.now() - 7200000).toISOString() },
  { ...BASE, id: 3, title: 'iPhone 15 Pro Max 256GB — Like New', title_ml: 'iPhone 15 Pro Max', type: 'sale', category: 'electronics', price: 'AED 3,800', emirate: 'Sharjah', images: ['https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&q=80'], urgent: true, created_at: new Date(Date.now() - 10800000).toISOString() },
  { ...BASE, id: 4, title: 'Kerala Home Cook — Available for Events', title_ml: 'കേരള ഹോം കുക്ക്', type: 'service', category: 'services', price: 'AED 150/event', emirate: 'Abu Dhabi', images: ['https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80'], urgent: false, created_at: new Date(Date.now() - 86400000).toISOString() },
  { ...BASE, id: 5, title: 'Sofa Set 5-Seater — Good Condition', title_ml: 'സോഫ സെറ്റ്', type: 'sale', category: 'furniture', price: 'AED 1,200', emirate: 'Ajman', images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80'], urgent: false, created_at: new Date(Date.now() - 172800000).toISOString() },
  { ...BASE, id: 6, title: 'Looking for Malayalam Speaking Driver', title_ml: 'ഡ്രൈവർ ആവശ്യം', type: 'wanted', category: 'jobs', price: 'AED 2,500/mo', emirate: 'Dubai', images: ['https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80'], urgent: true, created_at: new Date(Date.now() - 259200000).toISOString() },
]

export default function ClassifiedsSection() {
  const locale = useLocale()
  const isMl = locale === 'ml'
  const [items,   setItems]   = useState<Classified[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getClassifieds({ limit: 6 }).then(data => {
      setItems(data.length > 0 ? data : PLACEHOLDER_CLASSIFIEDS)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <section className="bg-kerala-cream py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex justify-center py-20">
          <Loader2 size={36} className="animate-spin text-kerala-green" />
        </div>
      </section>
    )
  }

  if (!items.length) return null

  return (
    <section className="bg-kerala-cream py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-kerala-orange font-semibold text-sm uppercase tracking-widest mb-2">
              {isMl ? 'ക്ലാസിഫൈഡ്സ്' : 'Classifieds'}
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-semibold text-kerala-deep">
              {isMl ? 'ഏറ്റവും പുതിയ ക്ലാസിഫൈഡ്സ്' : 'Latest Classifieds'}
            </h2>
            <p className="text-gray-500 mt-2">
              {isMl ? 'മലയാളി കമ്മ്യൂണിറ്റിക്കുള്ളിൽ വാങ്ങൂ, വിൽക്കൂ' : 'Buy, sell, rent within the Malayali community'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/${locale}/classifieds/new`}
              className="flex items-center gap-2 bg-kerala-orange text-white font-semibold text-sm px-4 py-2.5 rounded-lg hover:opacity-90 transition-all whitespace-nowrap"
            >
              <Plus size={16} />
              {isMl ? 'പരസ്യം ഇടൂ' : 'Post Ad'}
            </Link>
            <Link
              href={`/${locale}/classifieds`}
              className="flex items-center gap-2 border border-gray-300 text-gray-700 hover:border-kerala-green hover:text-kerala-green font-semibold text-sm px-4 py-2.5 rounded-lg transition-all whitespace-nowrap"
            >
              {isMl ? 'എല്ലാം കാണൂ' : 'View All'}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/${locale}/classifieds/${item.id}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg card-hover border border-gray-100"
            >
              <div className="relative h-44 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.images?.[0] || classifiedFallback(item.category)}
                  alt={isMl ? (item.title_ml ?? item.title) : item.title}
                  onError={(e) => { (e.target as HTMLImageElement).src = classifiedFallback(item.category) }}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${typeColors[item.type] ?? 'bg-gray-100 text-gray-700'}`}>
                    {isMl ? (typeLabels[item.type]?.ml ?? item.type) : (typeLabels[item.type]?.en ?? item.type)}
                  </span>
                </div>
                {item.urgent && (
                  <div className="absolute top-3 right-3">
                    <span className="bg-kerala-red text-white text-xs font-bold px-2.5 py-1 rounded-full">
                      {isMl ? 'അർജന്റ്' : 'Urgent'}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-kerala-deep text-sm leading-snug group-hover:text-kerala-green transition-colors mb-2 line-clamp-2">
                  {isMl ? (item.title_ml ?? item.title) : item.title}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-kerala-green font-bold text-base">
                    {item.price ?? (isMl ? 'വിലം ചോദിക്കൂ' : 'Ask for price')}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-2 text-gray-400 text-xs">
                  <span className="flex items-center gap-1">
                    <MapPin size={11} />
                    {item.emirate}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={11} />
                    {timeAgo(item.created_at, isMl)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
