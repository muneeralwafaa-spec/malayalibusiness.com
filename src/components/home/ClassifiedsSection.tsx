'use client'

import Image from 'next/image'
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

const FALLBACK = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400&q=80'

export default function ClassifiedsSection() {
  const locale = useLocale()
  const isMl = locale === 'ml'
  const [items,   setItems]   = useState<Classified[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getClassifieds({ limit: 6 }).then(data => {
      setItems(data)
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
                <Image
                  src={item.images?.[0] || FALLBACK}
                  alt={isMl ? (item.title_ml ?? item.title) : item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK }}
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
