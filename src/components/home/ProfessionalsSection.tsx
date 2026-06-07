'use client'

import Link from 'next/link'
import { useLocale } from 'next-intl'
import { useEffect, useState } from 'react'
import { Star, MapPin, ArrowRight, BadgeCheck, Phone, Loader2 } from 'lucide-react'
import { getProfessionals, PROFESSIONAL_CATEGORIES } from '@/lib/professionals'
import type { Professional } from '@/lib/professionals'

const AVATAR_FALLBACK = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80'

const PBASE = { name_ml: null, profession_ml: null, category_ml: null, emirate_ml: null, phone: null, whatsapp: null, email: null, website: null, bio: null, bio_ml: null, rating_avg: 4.8, review_count: 24, verified: true, featured: true, followers: null, tags: [], status: 'active' as const }

const PLACEHOLDER_PROFESSIONALS: Professional[] = [
  { ...PBASE, id: 'pp1', slug: 'dr-rajan-nair', name: 'Dr. Rajan Nair', profession: 'Cardiologist', category: 'medical', emirate: 'Dubai', photo_url: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&q=80', rating_avg: 4.9, review_count: 87, created_at: new Date().toISOString() },
  { ...PBASE, id: 'pp2', slug: 'adv-priya-krishnan', name: 'Adv. Priya Krishnan', profession: 'Criminal Advocate', category: 'legal', emirate: 'Dubai', photo_url: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=300&q=80', rating_avg: 4.8, review_count: 45, created_at: new Date().toISOString() },
  { ...PBASE, id: 'pp3', slug: 'ca-suresh-menon', name: 'CA Suresh Menon', profession: 'Chartered Accountant', category: 'finance', emirate: 'Abu Dhabi', photo_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&q=80', rating_avg: 4.7, review_count: 33, created_at: new Date().toISOString() },
  { ...PBASE, id: 'pp4', slug: 'anjali-fitness', name: 'Anjali Thomas', profession: 'Fitness & Yoga Coach', category: 'fitness', emirate: 'Dubai', photo_url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300&q=80', rating_avg: 5.0, review_count: 62, followers: 28000, created_at: new Date().toISOString() },
  { ...PBASE, id: 'pp5', slug: 'rj-anoop-dubai', name: 'RJ Anoop', profession: 'Radio Jockey & MC', category: 'media', emirate: 'Dubai', photo_url: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=300&q=80', rating_avg: 4.9, review_count: 41, followers: 55000, created_at: new Date().toISOString() },
  { ...PBASE, id: 'pp6', slug: 'meera-influencer', name: 'Meera Das', profession: 'Lifestyle Influencer', category: 'influencer', emirate: 'Dubai', photo_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b977?w=300&q=80', rating_avg: 4.8, review_count: 29, followers: 120000, created_at: new Date().toISOString() },
  { ...PBASE, id: 'pp7', slug: 'classical-dancer-nithya', name: 'Nithya Pillai', profession: 'Classical Dancer & Choreographer', category: 'entertainment', emirate: 'Sharjah', photo_url: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=300&q=80', rating_avg: 4.9, review_count: 18, created_at: new Date().toISOString() },
  { ...PBASE, id: 'pp8', slug: 'singer-vineeth', name: 'Vineeth Sreedharan', profession: 'Playback Singer & Musician', category: 'entertainment', emirate: 'Abu Dhabi', photo_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&q=80', rating_avg: 5.0, review_count: 53, followers: 85000, created_at: new Date().toISOString() },
]

export default function ProfessionalsSection() {
  const locale = useLocale()
  const isMl = locale === 'ml'
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [activeCategory, setActiveCategory] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getProfessionals({ featured: true, limit: 8, category: activeCategory || undefined }).then(data => {
      setProfessionals(data.length > 0 ? data : PLACEHOLDER_PROFESSIONALS.filter(p => !activeCategory || p.category === activeCategory))
      setLoading(false)
    })
  }, [activeCategory])

  const displayList = activeCategory
    ? (professionals.length > 0 ? professionals : PLACEHOLDER_PROFESSIONALS.filter(p => p.category === activeCategory))
    : professionals.length > 0 ? professionals : PLACEHOLDER_PROFESSIONALS

  const categoryTabs = [
    { slug: '', name: 'All', nameMl: 'എല്ലാം' },
    ...PROFESSIONAL_CATEGORIES.slice(0, 6).map(c => ({ slug: c.slug, name: c.name.split(' ')[0], nameMl: c.nameMl })),
  ]

  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-kerala-green font-semibold text-sm uppercase tracking-widest mb-2">
              {isMl ? 'പ്രൊഫഷണൽസ്' : 'Professionals'}
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-semibold text-kerala-deep">
              {isMl ? 'മലയാളി വിദഗ്ദ്ധർ' : 'Malayali Experts'}
            </h2>
            <p className="text-gray-500 mt-2">
              {isMl ? 'ഡോക്ടർ, അഭിഭാഷകർ, കലാകാരന്മാർ, ഇൻഫ്ലുവൻസർ' : 'Doctors, Advocates, Artists, Influencers & more across UAE'}
            </p>
          </div>
          <Link
            href={`/${locale}/professionals`}
            className="flex items-center gap-2 border border-kerala-green text-kerala-green hover:bg-kerala-green hover:text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-all whitespace-nowrap"
          >
            {isMl ? 'എല്ലാ പ്രൊഫഷണൽസ്' : 'View All Professionals'}
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Category filter tabs */}
        <div className="flex items-center gap-2 flex-wrap mb-8">
          {categoryTabs.map(cat => (
            <button
              key={cat.slug}
              onClick={() => setActiveCategory(cat.slug)}
              className={`text-xs font-semibold px-4 py-2 rounded-full border transition-all ${
                activeCategory === cat.slug
                  ? 'bg-kerala-green text-white border-kerala-green'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-kerala-green hover:text-kerala-green'
              }`}
            >
              {isMl ? cat.nameMl : cat.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 size={32} className="animate-spin text-kerala-green" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayList.slice(0, 8).map((pro) => {
              const catMeta = PROFESSIONAL_CATEGORIES.find(c => c.slug === pro.category)
              return (
                <Link
                  key={pro.id}
                  href={`/${locale}/professionals/${pro.slug}`}
                  className="group bg-kerala-cream hover:bg-white border border-transparent hover:border-gray-200 rounded-2xl p-4 card-hover flex flex-col items-center text-center transition-all"
                >
                  {/* Avatar */}
                  <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow-md mb-3 flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={pro.photo_url || AVATAR_FALLBACK}
                      alt={pro.name}
                      onError={(e) => { (e.target as HTMLImageElement).src = AVATAR_FALLBACK }}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    {pro.verified && (
                      <div className="absolute bottom-0 right-0 bg-white rounded-full p-0.5">
                        <BadgeCheck size={14} className="text-kerala-green" />
                      </div>
                    )}
                  </div>

                  {/* Category badge */}
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-kerala-green/10 text-kerala-green mb-1.5">
                    {catMeta?.emoji} {isMl ? catMeta?.nameMl : catMeta?.name.split(' ')[0]}
                  </span>

                  <h3 className="font-semibold text-kerala-deep text-sm leading-snug group-hover:text-kerala-green transition-colors mb-0.5 line-clamp-1">
                    {pro.name}
                  </h3>
                  <p className="text-gray-500 text-xs mb-2 line-clamp-1">{isMl ? (pro.profession_ml ?? pro.profession) : pro.profession}</p>

                  <div className="flex items-center gap-1 text-xs text-gray-400 mb-2">
                    <MapPin size={10} />
                    <span>{isMl ? (pro.emirate_ml ?? pro.emirate) : pro.emirate}</span>
                  </div>

                  {/* Rating or Followers */}
                  {pro.followers ? (
                    <div className="text-xs font-semibold text-kerala-gold">
                      {pro.followers >= 1000 ? `${(pro.followers / 1000).toFixed(0)}K` : pro.followers} {isMl ? 'ഫോളോവേഴ്സ്' : 'followers'}
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <Star size={11} className="text-kerala-gold fill-kerala-gold" />
                      <span className="text-xs font-semibold text-gray-700">{pro.rating_avg.toFixed(1)}</span>
                      <span className="text-xs text-gray-400">({pro.review_count})</span>
                    </div>
                  )}
                </Link>
              )
            })}
          </div>
        )}

        {/* Join CTA */}
        <div className="mt-10 bg-gradient-to-r from-kerala-deep to-kerala-green rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-serif text-xl font-bold text-white">
              {isMl ? 'ഒരു പ്രൊഫഷണൽ ആണോ?' : 'Are you a Professional?'}
            </h3>
            <p className="text-white/70 text-sm mt-1">
              {isMl ? 'നിങ്ങളുടെ പ്രൊഫൈൽ ലിസ്റ്റ് ചെയ്യൂ — സൗജന്യം' : 'List your professional profile and get discovered — it\'s free'}
            </p>
          </div>
          <Link
            href={`/${locale}/professionals/register`}
            className="flex-shrink-0 bg-kerala-gold hover:bg-kerala-gold-light text-white font-bold px-6 py-3 rounded-xl transition-all"
          >
            {isMl ? 'പ്രൊഫൈൽ ചേർക്കൂ' : 'Add Your Profile'}
          </Link>
        </div>
      </div>
    </section>
  )
}
