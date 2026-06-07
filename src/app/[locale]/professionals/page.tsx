'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { Search, MapPin, BadgeCheck, Star, Filter, ArrowRight, Loader2 } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { getProfessionals, PROFESSIONAL_CATEGORIES } from '@/lib/professionals'
import type { Professional } from '@/lib/professionals'

const AVATAR_FALLBACK = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80'

const PBASE = { name_ml: null, profession_ml: null, category_ml: null, emirate_ml: null, phone: null, whatsapp: null, email: null, website: null, bio: null, bio_ml: null, rating_avg: 4.8, review_count: 24, verified: true, featured: false, followers: null, tags: [], status: 'active' as const }
const PLACEHOLDER: Professional[] = [
  { ...PBASE, id: 'pp1',  slug: 'dr-rajan-nair',          name: 'Dr. Rajan Nair',           profession: 'Cardiologist',                  category: 'medical',       emirate: 'Dubai',     photo_url: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&q=80', rating_avg: 4.9, review_count: 87, created_at: new Date().toISOString() },
  { ...PBASE, id: 'pp2',  slug: 'dr-sheena-jacob',         name: 'Dr. Sheena Jacob',          profession: 'Dentist & Orthodontist',         category: 'medical',       emirate: 'Abu Dhabi', photo_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&q=80', rating_avg: 4.8, review_count: 54, created_at: new Date().toISOString() },
  { ...PBASE, id: 'pp3',  slug: 'adv-priya-krishnan',      name: 'Adv. Priya Krishnan',       profession: 'Criminal Advocate',              category: 'legal',         emirate: 'Dubai',     photo_url: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=300&q=80', rating_avg: 4.8, review_count: 45, created_at: new Date().toISOString() },
  { ...PBASE, id: 'pp4',  slug: 'pro-ajith-services',      name: 'Ajith PRO Services',        profession: 'PRO & Visa Consultant',          category: 'legal',         emirate: 'Dubai',     photo_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80', rating_avg: 4.7, review_count: 91, created_at: new Date().toISOString() },
  { ...PBASE, id: 'pp5',  slug: 'ca-suresh-menon',          name: 'CA Suresh Menon',           profession: 'Chartered Accountant',           category: 'finance',       emirate: 'Abu Dhabi', photo_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&q=80', rating_avg: 4.7, review_count: 33, created_at: new Date().toISOString() },
  { ...PBASE, id: 'pp6',  slug: 'anjali-yoga-fitness',      name: 'Anjali Thomas',             profession: 'Fitness & Yoga Coach',           category: 'fitness',       emirate: 'Dubai',     photo_url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300&q=80', rating_avg: 5.0, review_count: 62, followers: 28000, created_at: new Date().toISOString() },
  { ...PBASE, id: 'pp7',  slug: 'coach-arun-sports',        name: 'Arun Krishnan',             profession: 'Cricket & Sports Coach',         category: 'fitness',       emirate: 'Sharjah',   photo_url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=300&q=80', rating_avg: 4.9, review_count: 28, created_at: new Date().toISOString() },
  { ...PBASE, id: 'pp8',  slug: 'nithya-classical-dancer',  name: 'Nithya Pillai',             profession: 'Classical Dancer & Choreographer',category: 'entertainment', emirate: 'Sharjah',   photo_url: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=300&q=80', rating_avg: 4.9, review_count: 18, created_at: new Date().toISOString() },
  { ...PBASE, id: 'pp9',  slug: 'singer-vineeth',           name: 'Vineeth Sreedharan',        profession: 'Playback Singer & Musician',     category: 'entertainment', emirate: 'Abu Dhabi', photo_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&q=80', rating_avg: 5.0, review_count: 53, followers: 85000, created_at: new Date().toISOString() },
  { ...PBASE, id: 'pp10', slug: 'rj-anoop-dubai',           name: 'RJ Anoop',                  profession: 'Radio Jockey & MC',              category: 'media',         emirate: 'Dubai',     photo_url: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=300&q=80', rating_avg: 4.9, review_count: 41, followers: 55000, created_at: new Date().toISOString() },
  { ...PBASE, id: 'pp11', slug: 'meera-lifestyle-influencer',name: 'Meera Das',                profession: 'Lifestyle Influencer',           category: 'influencer',    emirate: 'Dubai',     photo_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b977?w=300&q=80', rating_avg: 4.8, review_count: 29, followers: 120000, created_at: new Date().toISOString() },
  { ...PBASE, id: 'pp12', slug: 'sanjay-food-creator',       name: 'Sanjay Foodie',             profession: 'Food Content Creator',          category: 'influencer',    emirate: 'Dubai',     photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80', rating_avg: 4.7, review_count: 36, followers: 67000, created_at: new Date().toISOString() },
]

const EMIRATES = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain']

export default function ProfessionalsPage() {
  const locale = useLocale()
  const isMl = locale === 'ml'

  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('')
  const [activeEmirate, setActiveEmirate] = useState('')

  useEffect(() => {
    setLoading(true)
    getProfessionals({ category: activeCategory || undefined, emirate: activeEmirate || undefined, search: search || undefined, limit: 24 }).then(data => {
      setProfessionals(data.length > 0 ? data : PLACEHOLDER)
      setLoading(false)
    })
  }, [activeCategory, activeEmirate, search])

  const display = professionals.filter(p =>
    (!activeCategory || p.category === activeCategory) &&
    (!activeEmirate  || p.emirate === activeEmirate) &&
    (!search         || p.name.toLowerCase().includes(search.toLowerCase()) || p.profession.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <main className="min-h-screen bg-kerala-cream">
      <Navbar />

      {/* Hero Banner */}
      <div className="bg-kerala-deep pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-kerala-gold text-sm font-semibold uppercase tracking-widest mb-2">
            {isMl ? 'പ്രൊഫഷണൽ ഡയറക്ടറി' : 'Professional Directory'}
          </p>
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
            {isMl ? 'മലയാളി വിദഗ്ദ്ധർ' : 'Malayali Professionals'}
          </h1>
          <p className="text-white/70 text-lg mb-8 max-w-2xl">
            {isMl
              ? 'ഡോക്ടർ, അഭിഭാഷകർ, ഫിറ്റ്നസ് കോച്ചുകൾ, കലാകാരന്മാർ, ഇൻഫ്ലുവൻസർ — UAE-ൽ'
              : 'Doctors, Advocates, Fitness Coaches, Artists, Influencers & more across UAE'}
          </p>

          {/* Search */}
          <div className="flex gap-2 max-w-xl">
            <div className="flex-1 flex items-center gap-2 bg-white rounded-xl px-4 py-3 shadow-sm">
              <Search size={18} className="text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder={isMl ? 'പേര് അല്ലെങ്കിൽ തൊഴിൽ...' : 'Search by name or profession...'}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 text-sm outline-none bg-transparent text-gray-800 placeholder-gray-400"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar Filters */}
          <aside className="lg:w-56 flex-shrink-0">
            <div className="bg-white rounded-2xl p-5 shadow-sm sticky top-24">
              <h3 className="font-semibold text-kerala-deep text-sm mb-4 flex items-center gap-2">
                <Filter size={15} /> {isMl ? 'ഫിൽട്ടർ' : 'Filter'}
              </h3>

              {/* Category */}
              <div className="mb-5">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{isMl ? 'വിഭാഗം' : 'Category'}</p>
                <div className="space-y-1">
                  <button onClick={() => setActiveCategory('')} className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${!activeCategory ? 'bg-kerala-green text-white' : 'text-gray-600 hover:bg-kerala-cream'}`}>
                    {isMl ? 'എല്ലാം' : 'All'}
                  </button>
                  {PROFESSIONAL_CATEGORIES.map(cat => (
                    <button key={cat.slug} onClick={() => setActiveCategory(cat.slug)} className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${activeCategory === cat.slug ? 'bg-kerala-green text-white' : 'text-gray-600 hover:bg-kerala-cream'}`}>
                      <span>{cat.emoji}</span>
                      <span className="truncate">{isMl ? cat.nameMl : cat.name.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Emirate */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{isMl ? 'എമിറേറ്റ്' : 'Emirate'}</p>
                <div className="space-y-1">
                  <button onClick={() => setActiveEmirate('')} className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${!activeEmirate ? 'bg-kerala-deep text-white' : 'text-gray-600 hover:bg-kerala-cream'}`}>
                    {isMl ? 'എല്ലാ എമിറേറ്റ്' : 'All Emirates'}
                  </button>
                  {EMIRATES.map(e => (
                    <button key={e} onClick={() => setActiveEmirate(e)} className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${activeEmirate === e ? 'bg-kerala-deep text-white' : 'text-gray-600 hover:bg-kerala-cream'}`}>
                      {e}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-500">
                {display.length} {isMl ? 'പ്രൊഫഷണൽസ്' : 'professionals found'}
              </p>
              <Link href={`/${locale}/professionals/register`} className="flex items-center gap-2 bg-kerala-gold text-white text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-all">
                + {isMl ? 'പ്രൊഫൈൽ ചേർക്കൂ' : 'Add Profile'}
              </Link>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 size={36} className="animate-spin text-kerala-green" />
              </div>
            ) : display.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-400 text-lg">{isMl ? 'ആരെയും കണ്ടില്ല' : 'No professionals found'}</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {display.map((pro) => {
                  const catMeta = PROFESSIONAL_CATEGORIES.find(c => c.slug === pro.category)
                  return (
                    <Link
                      key={pro.id}
                      href={`/${locale}/professionals/${pro.slug}`}
                      className="group bg-white hover:shadow-lg border border-gray-100 rounded-2xl p-4 card-hover flex flex-col items-center text-center transition-all"
                    >
                      <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-gray-100 shadow mb-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={pro.photo_url || AVATAR_FALLBACK}
                          alt={pro.name}
                          onError={(e) => { (e.target as HTMLImageElement).src = AVATAR_FALLBACK }}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        {pro.verified && (
                          <div className="absolute bottom-0 right-0 bg-white rounded-full p-0.5 shadow">
                            <BadgeCheck size={14} className="text-kerala-green" />
                          </div>
                        )}
                      </div>

                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-kerala-green/10 text-kerala-green mb-1">
                        {catMeta?.emoji} {isMl ? catMeta?.nameMl : catMeta?.name.split(' ')[0]}
                      </span>

                      <h3 className="font-semibold text-kerala-deep text-sm leading-snug group-hover:text-kerala-green transition-colors mb-0.5 line-clamp-1">{pro.name}</h3>
                      <p className="text-gray-500 text-xs mb-2 line-clamp-1">{isMl ? (pro.profession_ml ?? pro.profession) : pro.profession}</p>

                      <div className="flex items-center gap-1 text-xs text-gray-400 mb-2">
                        <MapPin size={10} />
                        <span>{isMl ? (pro.emirate_ml ?? pro.emirate) : pro.emirate}</span>
                      </div>

                      {pro.followers ? (
                        <div className="text-xs font-semibold text-kerala-gold">
                          {pro.followers >= 1000 ? `${(pro.followers/1000).toFixed(0)}K` : pro.followers} {isMl ? 'ഫോളോ' : 'followers'}
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
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
