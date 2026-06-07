'use client'

import Link from 'next/link'
import { useLocale } from 'next-intl'
import { useEffect, useState } from 'react'
import { ArrowRight, ExternalLink, BadgeCheck, Loader2 } from 'lucide-react'
import { getMediaHouses, MEDIA_TYPE_META } from '@/lib/media'
import type { MediaHouse } from '@/lib/media'

const LOGO_FALLBACK = 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300&q=80'

const MBASE = { name_ml: null, description: null, description_ml: null, cover_url: null, website: null, youtube_url: null, facebook_url: null, instagram_url: null, emirate: 'Dubai', founded_year: null, reach: null, featured: true, verified: true, status: 'active' as const }

const PLACEHOLDER_MEDIA: MediaHouse[] = [
  { ...MBASE, id: 'm1', slug: 'asianet-uae', name: 'Asianet Middle East', media_type: 'tv', description: 'Leading Malayalam TV channel broadcasting across UAE and Middle East', logo_url: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=300&q=80', reach: '2M+', created_at: new Date().toISOString() },
  { ...MBASE, id: 'm2', slug: 'surya-tv-uae', name: 'Surya TV UAE', media_type: 'tv', description: 'Popular Malayalam entertainment and news channel in UAE', logo_url: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=300&q=80', reach: '1.5M+', created_at: new Date().toISOString() },
  { ...MBASE, id: 'm3', slug: 'radio-asia-uae', name: 'Radio Asia UAE', media_type: 'radio', description: 'Malayalam FM radio serving the UAE Malayali community 24/7', logo_url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=300&q=80', emirate: 'Dubai', reach: '500K+', created_at: new Date().toISOString() },
  { ...MBASE, id: 'm4', slug: 'city-fm-dubai', name: 'City FM 101.6 Malayalam', media_type: 'radio', description: 'Dubai\'s favorite Malayalam radio station for music and talk shows', logo_url: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=300&q=80', emirate: 'Dubai', reach: '300K+', created_at: new Date().toISOString() },
  { ...MBASE, id: 'm5', slug: 'malayali-times-uae', name: 'Malayali Times UAE', media_type: 'newspaper', description: 'Daily Malayalam newspaper covering UAE Malayali community news', logo_url: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=300&q=80', reach: '200K+', created_at: new Date().toISOString() },
  { ...MBASE, id: 'm6', slug: 'gulf-madhyamam', name: 'Gulf Madhyamam', media_type: 'newspaper', description: 'Trusted Malayalam news source for Gulf Malayalis since 1987', logo_url: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&q=80', reach: '400K+', created_at: new Date().toISOString() },
  { ...MBASE, id: 'm7', slug: 'malayali-digital-uae', name: 'Malayali Digital UAE', media_type: 'digital', description: 'UAE\'s fastest growing Malayalam YouTube channel and news portal', logo_url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300&q=80', reach: '800K+', youtube_url: 'https://youtube.com', created_at: new Date().toISOString() },
  { ...MBASE, id: 'm8', slug: 'keralam-podcast', name: 'Keralam UAE Podcast', media_type: 'podcast', description: 'Weekly Malayalam podcast on business, culture and life in UAE', logo_url: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=300&q=80', reach: '50K+', created_at: new Date().toISOString() },
]

export default function MediaSection() {
  const locale = useLocale()
  const isMl = locale === 'ml'
  const [houses, setHouses] = useState<MediaHouse[]>([])
  const [loading, setLoading] = useState(true)
  const [activeType, setActiveType] = useState<string>('')

  useEffect(() => {
    setLoading(true)
    getMediaHouses({ featured: true, limit: 8 }).then(data => {
      setHouses(data.length > 0 ? data : PLACEHOLDER_MEDIA)
      setLoading(false)
    })
  }, [])

  const typeTabs = [
    { key: '',          label: 'All',      labelMl: 'എല്ലാം' },
    { key: 'tv',        label: '📺 TV',    labelMl: '📺 ടിവി' },
    { key: 'radio',     label: '📻 Radio', labelMl: '📻 റേഡിയോ' },
    { key: 'digital',   label: '🎬 Digital',labelMl: '🎬 ഡിജിറ്റൽ' },
    { key: 'newspaper', label: '📰 Print', labelMl: '📰 പ്രിന്റ്' },
    { key: 'podcast',   label: '🎙️ Podcast',labelMl: '🎙️ പോഡ്കാസ്റ്റ്' },
  ]

  const display = activeType
    ? houses.filter(h => h.media_type === activeType)
    : houses

  return (
    <section className="bg-kerala-cream py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-kerala-red font-semibold text-sm uppercase tracking-widest mb-2">
              {isMl ? 'മലയാളി മീഡിയ' : 'Malayali Media'}
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-semibold text-kerala-deep">
              {isMl ? 'മലയാളി മീഡിയ UAE' : 'Malayali Media in UAE'}
            </h2>
            <p className="text-gray-500 mt-2">
              {isMl ? 'ടിവി, റേഡിയോ, ഡിജിറ്റൽ, പത്രം — UAE-ൽ മലയാളം' : 'TV channels, radio stations, digital media & newspapers'}
            </p>
          </div>
          <Link
            href={`/${locale}/media`}
            className="flex items-center gap-2 border border-gray-300 text-gray-700 hover:border-kerala-red hover:text-kerala-red font-semibold text-sm px-5 py-2.5 rounded-lg transition-all whitespace-nowrap"
          >
            {isMl ? 'എല്ലാ മീഡിയ' : 'View All Media'}
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Type filter tabs */}
        <div className="flex items-center gap-2 flex-wrap mb-8">
          {typeTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveType(tab.key)}
              className={`text-xs font-semibold px-4 py-2 rounded-full border transition-all ${
                activeType === tab.key
                  ? 'bg-kerala-deep text-white border-kerala-deep'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-kerala-deep hover:text-kerala-deep'
              }`}
            >
              {isMl ? tab.labelMl : tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 size={32} className="animate-spin text-kerala-green" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {(display.length > 0 ? display : PLACEHOLDER_MEDIA.filter(m => !activeType || m.media_type === activeType)).slice(0, 8).map((house) => {
              const meta = MEDIA_TYPE_META[house.media_type]
              return (
                <Link
                  key={house.id}
                  href={`/${locale}/media/${house.slug}`}
                  className="group bg-white hover:bg-kerala-cream border border-gray-100 hover:border-gray-200 rounded-2xl p-4 card-hover flex flex-col transition-all"
                >
                  {/* Logo */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-14 h-14 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={house.logo_url || LOGO_FALLBACK}
                        alt={house.name}
                        onError={(e) => { (e.target as HTMLImageElement).src = LOGO_FALLBACK }}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {house.verified && <BadgeCheck size={15} className="text-kerala-green" />}
                      {house.youtube_url && (
                        <ExternalLink size={13} className="text-gray-400" />
                      )}
                    </div>
                  </div>

                  <span className={`self-start text-[10px] font-bold px-2 py-0.5 rounded-full mb-2 ${meta.color}`}>
                    {meta.emoji} {isMl ? meta.labelMl : meta.label}
                  </span>

                  <h3 className="font-semibold text-kerala-deep text-sm leading-snug group-hover:text-kerala-green transition-colors mb-1 line-clamp-2">
                    {isMl ? (house.name_ml ?? house.name) : house.name}
                  </h3>

                  {house.description && (
                    <p className="text-gray-400 text-xs line-clamp-2 mb-3 flex-1">
                      {isMl ? (house.description_ml ?? house.description) : house.description}
                    </p>
                  )}

                  {house.reach && (
                    <div className="text-xs font-semibold text-kerala-green mt-auto">
                      {house.reach} {isMl ? 'റീച്ച്' : 'reach'}
                    </div>
                  )}
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
