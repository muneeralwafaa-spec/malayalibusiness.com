'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { BadgeCheck, ExternalLink, Loader2, PlayCircle, Globe } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { getMediaHouses, MEDIA_TYPE_META } from '@/lib/media'
import type { MediaHouse, MediaType } from '@/lib/media'

const LOGO_FALLBACK = 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300&q=80'

const MBASE = { name_ml: null, description: null, description_ml: null, cover_url: null, website: null, youtube_url: null, facebook_url: null, instagram_url: null, emirate: 'Dubai', founded_year: null, reach: null, featured: false, verified: true, status: 'active' as const }
const PLACEHOLDER: MediaHouse[] = [
  { ...MBASE, id: 'm1',  slug: 'asianet-uae',          name: 'Asianet Middle East',     media_type: 'tv',        description: 'Leading Malayalam TV channel across UAE & Middle East', logo_url: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=300&q=80', reach: '2M+',   created_at: new Date().toISOString() },
  { ...MBASE, id: 'm2',  slug: 'surya-tv-uae',          name: 'Surya TV UAE',            media_type: 'tv',        description: 'Popular Malayalam entertainment and news channel in UAE', logo_url: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=300&q=80', reach: '1.5M+', created_at: new Date().toISOString() },
  { ...MBASE, id: 'm3',  slug: 'mazhavil-uae',          name: 'Mazhavil Manorama UAE',   media_type: 'tv',        description: 'Family entertainment Malayalam channel in UAE', logo_url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300&q=80', reach: '1M+',   created_at: new Date().toISOString() },
  { ...MBASE, id: 'm4',  slug: 'radio-asia-uae',        name: 'Radio Asia UAE',          media_type: 'radio',     description: 'Malayalam FM radio serving the UAE 24/7', logo_url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=300&q=80', reach: '500K+', created_at: new Date().toISOString() },
  { ...MBASE, id: 'm5',  slug: 'city-fm-malayalam',     name: 'City FM Malayalam',       media_type: 'radio',     description: "Dubai's favorite Malayalam radio for music & talk", logo_url: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=300&q=80', reach: '300K+', created_at: new Date().toISOString() },
  { ...MBASE, id: 'm6',  slug: 'malayali-times',        name: 'Malayali Times UAE',      media_type: 'newspaper',  description: 'Daily Malayalam newspaper for UAE community news', logo_url: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=300&q=80', reach: '200K+', created_at: new Date().toISOString() },
  { ...MBASE, id: 'm7',  slug: 'gulf-madhyamam',        name: 'Gulf Madhyamam',          media_type: 'newspaper',  description: 'Trusted Malayalam news for Gulf Malayalis since 1987', logo_url: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&q=80', reach: '400K+', created_at: new Date().toISOString() },
  { ...MBASE, id: 'm8',  slug: 'malayali-digital-uae',  name: 'Malayali Digital UAE',    media_type: 'digital',   description: "UAE's fastest growing Malayalam YouTube & news portal", logo_url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300&q=80', reach: '800K+', youtube_url: 'https://youtube.com', created_at: new Date().toISOString() },
  { ...MBASE, id: 'm9',  slug: 'uae-malayali-news',     name: 'UAE Malayali News',       media_type: 'digital',   description: 'Breaking news and community updates for UAE Malayalis', logo_url: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=300&q=80', reach: '350K+', youtube_url: 'https://youtube.com', created_at: new Date().toISOString() },
  { ...MBASE, id: 'm10', slug: 'keralam-podcast',       name: 'Keralam UAE Podcast',     media_type: 'podcast',   description: 'Weekly Malayalam podcast on business, culture, UAE life', logo_url: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=300&q=80', reach: '50K+',  created_at: new Date().toISOString() },
  { ...MBASE, id: 'm11', slug: 'malayalam-magazine-uae',name: 'Gulf Vanitha Magazine',   media_type: 'magazine',  description: "Monthly Malayalam magazine for UAE's Malayali women", logo_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&q=80', reach: '100K+', created_at: new Date().toISOString() },
  { ...MBASE, id: 'm12', slug: 'khaleeji-malayali',     name: 'Khaleeji Malayali',       media_type: 'digital',   description: 'Viral Malayalam content from Dubai — comedy, culture & life', logo_url: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=300&q=80', reach: '1.2M+', youtube_url: 'https://youtube.com', created_at: new Date().toISOString() },
]

const TYPE_TABS: { key: string; label: string; labelMl: string }[] = [
  { key: '',          label: 'All',       labelMl: 'എല്ലാം'       },
  { key: 'tv',        label: '📺 TV',     labelMl: '📺 ടിവി'      },
  { key: 'radio',     label: '📻 Radio',  labelMl: '📻 റേഡിയോ'    },
  { key: 'digital',   label: '🎬 Digital',labelMl: '🎬 ഡിജിറ്റൽ'  },
  { key: 'newspaper', label: '📰 Print',  labelMl: '📰 പ്രിന്റ്'   },
  { key: 'magazine',  label: '📖 Magazine',labelMl: '📖 മാഗസിൻ'   },
  { key: 'podcast',   label: '🎙️ Podcast',labelMl: '🎙️ പോഡ്കാസ്റ്റ്'},
]

export default function MediaPage() {
  const locale = useLocale()
  const isMl = locale === 'ml'

  const [houses, setHouses]       = useState<MediaHouse[]>([])
  const [loading, setLoading]     = useState(true)
  const [activeType, setActiveType] = useState('')

  useEffect(() => {
    getMediaHouses({ limit: 50 }).then(data => {
      setHouses(data.length > 0 ? data : PLACEHOLDER)
      setLoading(false)
    })
  }, [])

  const display = activeType ? houses.filter(h => h.media_type === activeType) : houses

  return (
    <main className="min-h-screen bg-kerala-cream">
      <Navbar />

      {/* Hero */}
      <div className="bg-kerala-deep pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-kerala-gold text-sm font-semibold uppercase tracking-widest mb-2">
            {isMl ? 'മലയാളി മീഡിയ' : 'Malayali Media'}
          </p>
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
            {isMl ? 'UAE മലയാളി മീഡിയ' : 'UAE Malayali Media'}
          </h1>
          <p className="text-white/70 text-sm sm:text-base lg:text-lg max-w-2xl">
            {isMl
              ? 'TV, റേഡിയോ, ഡിജിറ്റൽ, പത്രം — UAE-ൽ മലയാളം സംസാരിക്കുന്ന എല്ലാ മാധ്യമങ്ങളും'
              : 'TV channels, radio stations, digital media, newspapers & podcasts serving the UAE Malayali community'}
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-6 mt-8">
            {[
              { value: '3+',  label: 'TV Channels',    labelMl: 'ടിവി ചാനലുകൾ' },
              { value: '2+',  label: 'Radio Stations', labelMl: 'റേഡിയോ സ്റ്റേഷൻ' },
              { value: '10+', label: 'Digital Media',  labelMl: 'ഡിജിറ്റൽ' },
              { value: '5+',  label: 'Publications',   labelMl: 'പ്രസിദ്ധീകരണങ്ങൾ' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="text-kerala-gold font-serif text-2xl font-bold">{s.value}</div>
                <div className="text-white/60 text-xs">{isMl ? s.labelMl : s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Type filter tabs */}
        <div className="flex items-center gap-2 flex-wrap mb-8">
          {TYPE_TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveType(tab.key)}
              className={`text-sm font-semibold px-5 py-2 rounded-full border transition-all ${
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
          <div className="flex justify-center py-20">
            <Loader2 size={36} className="animate-spin text-kerala-green" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {(display.length > 0 ? display : PLACEHOLDER.filter(m => !activeType || m.media_type === activeType)).map((house) => {
              const meta = MEDIA_TYPE_META[house.media_type]
              return (
                <Link
                  key={house.id}
                  href={`/${locale}/media/${house.slug}`}
                  className="group bg-white hover:shadow-lg border border-gray-100 rounded-2xl overflow-hidden card-hover transition-all flex"
                >
                  {/* Logo */}
                  <div className="w-24 h-full bg-gray-50 flex-shrink-0 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={house.logo_url || LOGO_FALLBACK}
                      alt={house.name}
                      onError={(e) => { (e.target as HTMLImageElement).src = LOGO_FALLBACK }}
                      className="w-full h-full object-cover min-h-[100px]"
                    />
                  </div>

                  <div className="p-4 flex flex-col flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${meta.color}`}>
                        {meta.emoji} {isMl ? meta.labelMl : meta.label}
                      </span>
                      {house.verified && <BadgeCheck size={14} className="text-kerala-green flex-shrink-0" />}
                    </div>

                    <h3 className="font-semibold text-kerala-deep text-sm leading-snug group-hover:text-kerala-green transition-colors mb-1 line-clamp-1">
                      {isMl ? (house.name_ml ?? house.name) : house.name}
                    </h3>

                    {house.description && (
                      <p className="text-gray-400 text-xs line-clamp-2 mb-3 flex-1">
                        {isMl ? (house.description_ml ?? house.description) : house.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-auto">
                      {house.reach && (
                        <span className="text-xs font-semibold text-kerala-green">{house.reach} reach</span>
                      )}
                      <div className="flex items-center gap-2 ml-auto">
                        {house.youtube_url && <PlayCircle size={14} className="text-red-500" />}
                        {house.website    && <Globe size={14} className="text-blue-400" />}
                        <ExternalLink size={13} className="text-gray-300 group-hover:text-kerala-green transition-colors" />
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 bg-gradient-to-r from-kerala-deep to-kerala-green rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-serif text-xl font-bold text-white">
              {isMl ? 'ഒരു മീഡിയ ഹൗസ് ഉണ്ടോ?' : 'Run a Malayali media outlet?'}
            </h3>
            <p className="text-white/70 text-sm mt-1">
              {isMl ? 'നിങ്ങളുടെ ചാനൽ / സ്റ്റേഷൻ ലിസ്റ്റ് ചെയ്യൂ — സൗജന്യം' : 'List your channel, station or publication — it\'s free'}
            </p>
          </div>
          <Link href={`/${locale}/media/register`} className="flex-shrink-0 bg-kerala-gold hover:bg-kerala-gold-light text-white font-bold px-6 py-3 rounded-xl transition-all">
            {isMl ? 'ലിസ്റ്റ് ചെയ്യൂ' : 'List Your Media'}
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  )
}
