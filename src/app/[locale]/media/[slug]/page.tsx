'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { useParams } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import {
  Globe, BadgeCheck, Share2, Flag, ArrowLeft, Users, Calendar,
  ExternalLink, PlayCircle, Loader2, CheckCircle, Mail, Phone, Radio
} from 'lucide-react'
import FavouriteButton from '@/components/ui/FavouriteButton'
import { getMediaHouses, MEDIA_TYPE_META } from '@/lib/media'
import type { MediaHouse } from '@/lib/media'

const LOGO_FALLBACK = 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&q=80'

const MB = { name_ml: null, description_ml: null, cover_url: null, website: null, youtube_url: null, facebook_url: null, instagram_url: null, founded_year: null, featured: false, verified: true, status: 'active' as const }
const PLACEHOLDER_MAP: Record<string, MediaHouse> = {
  'asianet-uae':           { ...MB, id: 'm1',  slug: 'asianet-uae',           name: 'Asianet Middle East',   media_type: 'tv',        logo_url: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400&q=80',  emirate: 'Dubai',     reach: '2M+',   featured: true, founded_year: 2000, website: 'https://asianetnews.com', youtube_url: 'https://youtube.com', facebook_url: 'https://facebook.com', instagram_url: 'https://instagram.com', description: 'Asianet Middle East is the leading Malayalam TV channel broadcasting across UAE and the broader Middle East region. With 2M+ viewers, it delivers 24/7 entertainment, news, and cultural programming.', created_at: new Date().toISOString() },
  'surya-tv-uae':           { ...MB, id: 'm2',  slug: 'surya-tv-uae',           name: 'Surya TV UAE',          media_type: 'tv',        logo_url: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=400&q=80',  emirate: 'Dubai',     reach: '1.5M+', description: 'Popular Malayalam entertainment and news channel in UAE with 1.5M+ viewers. Known for premium serials, reality shows and live news.', created_at: new Date().toISOString() },
  'mazhavil-uae':           { ...MB, id: 'm3',  slug: 'mazhavil-uae',           name: 'Mazhavil Manorama UAE', media_type: 'tv',        logo_url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&q=80',  emirate: 'Dubai',     reach: '1M+',   description: 'Family entertainment Malayalam channel in UAE with 1M+ viewers. Part of the Manorama group, delivering quality programming for all ages.', created_at: new Date().toISOString() },
  'radio-asia-uae':         { ...MB, id: 'm4',  slug: 'radio-asia-uae',         name: 'Radio Asia UAE',        media_type: 'radio',     logo_url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&q=80',  emirate: 'Dubai',     reach: '500K+', founded_year: 2010, description: 'The most popular Malayalam FM radio station serving the UAE community 24/7. Broadcasting music, talk shows, news, and community programs.', created_at: new Date().toISOString() },
  'city-fm-malayalam':      { ...MB, id: 'm5',  slug: 'city-fm-malayalam',      name: 'City FM Malayalam',     media_type: 'radio',     logo_url: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&q=80',  emirate: 'Dubai',     reach: '300K+', description: "Dubai's favourite Malayalam radio for music and talk. Entertaining the UAE Malayali community with the best of old and new songs.", created_at: new Date().toISOString() },
  'malayali-times':         { ...MB, id: 'm6',  slug: 'malayali-times',         name: 'Malayali Times UAE',    media_type: 'newspaper', logo_url: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&q=80',  emirate: 'Dubai',     reach: '200K+', description: 'Daily Malayalam newspaper covering UAE community news, local events, business and international news for the Malayali diaspora.', created_at: new Date().toISOString() },
  'gulf-madhyamam':         { ...MB, id: 'm7',  slug: 'gulf-madhyamam',         name: 'Gulf Madhyamam',        media_type: 'newspaper', logo_url: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&q=80',  emirate: 'Dubai',     reach: '400K+', description: 'Trusted Malayalam news for Gulf Malayalis. One of the oldest and most respected newspapers serving the UAE and GCC Malayalam community.', created_at: new Date().toISOString() },
  'malayali-digital-uae':   { ...MB, id: 'm8',  slug: 'malayali-digital-uae',   name: 'Malayali Digital UAE',  media_type: 'digital',   logo_url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&q=80',  emirate: 'Dubai',     reach: '800K+', youtube_url: 'https://youtube.com', description: "UAE's fastest growing Malayalam YouTube channel and news portal. Breaking news, viral content and community stories.", created_at: new Date().toISOString() },
  'uae-malayali-news':      { ...MB, id: 'm9',  slug: 'uae-malayali-news',      name: 'UAE Malayali News',     media_type: 'digital',   logo_url: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&q=80',  emirate: 'Abu Dhabi', reach: '350K+', youtube_url: 'https://youtube.com', description: 'Breaking news and community updates for UAE Malayalis. Covers local events, business news, entertainment and diaspora stories.', created_at: new Date().toISOString() },
  'keralam-podcast':        { ...MB, id: 'm10', slug: 'keralam-podcast',        name: 'Keralam UAE Podcast',   media_type: 'podcast',   logo_url: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&q=80',  emirate: 'Dubai',     reach: '50K+',  description: 'Weekly Malayalam podcast on business, culture and UAE life. Deep conversations with community leaders, entrepreneurs and creatives.', created_at: new Date().toISOString() },
  'malayalam-magazine-uae': { ...MB, id: 'm11', slug: 'malayalam-magazine-uae', name: 'Gulf Vanitha Magazine',  media_type: 'magazine',  logo_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80',  emirate: 'Dubai',     reach: '100K+', description: "Monthly Malayalam lifestyle magazine for UAE's Malayali women. Covers fashion, health, recipes, parenting, and community stories.", created_at: new Date().toISOString() },
  'khaleeji-malayali':      { ...MB, id: 'm12', slug: 'khaleeji-malayali',      name: 'Khaleeji Malayali',     media_type: 'digital',   logo_url: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=400&q=80',  emirate: 'Dubai',     reach: '1.2M+', youtube_url: 'https://youtube.com', description: 'Viral Malayalam content from Dubai — comedy sketches, cultural commentary and slice-of-life content for UAE Malayalis.', created_at: new Date().toISOString() },
}

export default function MediaDetailPage() {
  const locale = useLocale()
  const isMl = locale === 'ml'
  const params = useParams<{ slug: string }>()
  const slug = params.slug

  const [house, setHouse] = useState<MediaHouse | null>(null)
  const [related, setRelated] = useState<MediaHouse[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    getMediaHouses({ limit: 20 }).then(data => {
      const found = data.find(h => h.slug === slug) ?? PLACEHOLDER_MAP[slug] ?? null
      setHouse(found)
      if (found) setRelated(data.filter(h => h.slug !== slug && h.media_type === found.media_type).slice(0, 3))
      setLoading(false)
    })
  }, [slug])

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) return (
    <main className="min-h-screen bg-kerala-cream"><Navbar />
      <div className="flex justify-center items-center min-h-[60vh]"><Loader2 size={40} className="animate-spin text-kerala-green" /></div>
    <Footer /></main>
  )

  if (!house) return (
    <main className="min-h-screen bg-kerala-cream"><Navbar />
      <div className="max-w-2xl mx-auto px-4 py-40 text-center">
        <p className="text-4xl mb-4">😕</p>
        <h1 className="font-serif text-2xl font-bold text-kerala-deep mb-2">{isMl ? 'കണ്ടെത്തിയില്ല' : 'Not Found'}</h1>
        <Link href={`/${locale}/media`} className="text-kerala-green hover:underline">{isMl ? 'തിരിച്ചു' : '← Back to Media'}</Link>
      </div>
    <Footer /></main>
  )

  const meta = MEDIA_TYPE_META[house.media_type]

  return (
    <main className="min-h-screen bg-kerala-cream">
      <Navbar />

      {/* Cover / Hero */}
      <div className="relative h-64 md:h-80 overflow-hidden bg-kerala-deep">
        {house.cover_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={house.cover_url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-kerala-deep via-kerala-green/20 to-kerala-deep" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-kerala-deep via-transparent to-transparent" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 pb-16 relative z-10">
        <Link href={`/${locale}/media`} className="inline-flex items-center gap-1.5 text-white/80 hover:text-white text-sm mb-6 transition-colors">
          <ArrowLeft size={15} /> {isMl ? 'തിരിച്ചു' : 'Back to Media'}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT: Card */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
              <div className="flex flex-col items-center pt-8 pb-6 px-6 text-center">
                <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-xl mb-4 bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={house.logo_url || LOGO_FALLBACK} alt={house.name} onError={(e) => { (e.target as HTMLImageElement).src = LOGO_FALLBACK }} className="w-full h-full object-cover" />
                </div>

                <span className={`text-xs font-bold px-3 py-1 rounded-full mb-3 ${meta.color}`}>
                  {meta.emoji} {isMl ? meta.labelMl : meta.label}
                </span>

                <h1 className="font-serif text-xl font-bold text-kerala-deep mb-1">{isMl ? (house.name_ml ?? house.name) : house.name}</h1>
                {house.emirate && <p className="text-gray-400 text-xs mb-4">{house.emirate}, UAE</p>}

                {house.reach && (
                  <div className="bg-kerala-green/10 border border-kerala-green/20 rounded-full px-5 py-1.5 mb-4">
                    <span className="text-kerala-green font-bold text-sm">{house.reach} {isMl ? 'റീച്ച്' : 'reach'}</span>
                  </div>
                )}

                {house.verified && (
                  <div className="flex items-center gap-1.5 text-kerala-green text-xs font-semibold mb-4">
                    <BadgeCheck size={14} /> {isMl ? 'വെരിഫൈഡ്' : 'Verified'}
                  </div>
                )}

                {/* Links */}
                <div className="w-full space-y-2">
                  {house.website && (
                    <a href={house.website} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 bg-kerala-deep text-white font-semibold py-2.5 rounded-xl text-sm hover:bg-kerala-green transition-colors">
                      <Globe size={15} /> {isMl ? 'വെബ്‌സൈറ്റ് സന്ദർശിക്കൂ' : 'Visit Website'}
                    </a>
                  )}
                  {house.youtube_url && (
                    <a href={house.youtube_url} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 bg-red-600 text-white font-semibold py-2.5 rounded-xl text-sm hover:bg-red-700 transition-colors">
                      <PlayCircle size={15} /> YouTube Channel
                    </a>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-100 px-6 py-4 space-y-2.5">
                {house.founded_year && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar size={13} className="text-gray-400" /> {isMl ? 'സ്ഥാപിതം' : 'Founded'} {house.founded_year}
                  </div>
                )}
                {house.emirate && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Radio size={13} className="text-gray-400" /> {house.emirate}, UAE
                  </div>
                )}
                {house.facebook_url && (
                  <a href={house.facebook_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-blue-500 hover:underline">
                    <ExternalLink size={12} /> Facebook
                  </a>
                )}
                {house.instagram_url && (
                  <a href={house.instagram_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-pink-500 hover:underline">
                    <ExternalLink size={12} /> Instagram
                  </a>
                )}
              </div>

              <div className="border-t border-gray-100 px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button onClick={handleShare} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-kerala-green">
                    <Share2 size={12} /> {copied ? (isMl ? 'കോപ്പി!' : 'Copied!') : (isMl ? 'ഷെയർ' : 'Share')}
                  </button>
                  <FavouriteButton itemType="media" itemId={house.id} size="sm" />
                </div>
                <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500">
                  <Flag size={11} /> {isMl ? 'റിപ്പോർട്ട്' : 'Report'}
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: About + Related */}
          <div className="lg:col-span-2 space-y-5">

            {/* About */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="font-serif text-xl font-bold text-kerala-deep mb-4">{isMl ? 'കുറിച്ച്' : 'About'}</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                {isMl ? (house.description_ml ?? house.description) : house.description}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Users, value: house.reach ?? '—', label: isMl ? 'റീച്ച്' : 'Reach' },
                { icon: Calendar, value: house.founded_year ?? '—', label: isMl ? 'സ്ഥാപിതം' : 'Founded' },
                { icon: BadgeCheck, value: house.verified ? (isMl ? 'ഉണ്ട്' : 'Yes') : 'No', label: isMl ? 'വെരിഫൈഡ്' : 'Verified' },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-2xl shadow-sm p-4 text-center">
                  <s.icon size={20} className="text-kerala-green mx-auto mb-2" />
                  <div className="font-bold text-kerala-deep">{s.value}</div>
                  <div className="text-gray-400 text-xs">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Related */}
            {related.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="font-serif text-lg font-bold text-kerala-deep mb-4">{isMl ? 'സമാന മീഡിയ' : 'Similar Media Outlets'}</h2>
                <div className="space-y-3">
                  {related.map(r => (
                    <Link key={r.id} href={`/${locale}/media/${r.slug}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-kerala-cream transition-colors group">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={r.logo_url || LOGO_FALLBACK} alt={r.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-kerala-deep text-sm group-hover:text-kerala-green transition-colors truncate">{r.name}</p>
                        <p className="text-gray-400 text-xs">{MEDIA_TYPE_META[r.media_type].label} · {r.reach}</p>
                      </div>
                      <ExternalLink size={14} className="text-gray-300 group-hover:text-kerala-green flex-shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="bg-kerala-deep rounded-2xl p-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-white font-semibold">{isMl ? 'ഒരു മീഡിയ ഹൗസ് ഉണ്ടോ?' : 'Run a Malayali media outlet?'}</p>
                <p className="text-white/60 text-xs mt-0.5">{isMl ? 'ഇവിടെ ലിസ്റ്റ് ചെയ്യൂ — സൗജന്യം' : 'Get listed here for free'}</p>
              </div>
              <Link href={`/${locale}/media/register`} className="bg-kerala-gold text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-kerala-gold-light transition-colors whitespace-nowrap">
                {isMl ? 'ലിസ്റ്റ് ചെയ്യൂ' : 'List Your Media'}
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
