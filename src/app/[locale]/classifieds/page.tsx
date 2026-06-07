'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { getClassifieds, getCategoryCounts, classifiedCategories } from '@/lib/classifieds'
import type { Classified } from '@/lib/classifieds'
import {
  Search, Plus, MapPin, Clock, Eye, Heart, SlidersHorizontal,
  X, MessageCircle, Phone, Tag, AlertCircle
} from 'lucide-react'

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
const CLASSIFIED_FALLBACK = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&q=80'

function classifiedFallback(category?: string) {
  if (!category) return CLASSIFIED_FALLBACK
  const key = category.toLowerCase()
  for (const [k, url] of Object.entries(CATEGORY_FALLBACKS)) {
    if (key.includes(k)) return url
  }
  return CLASSIFIED_FALLBACK
}

const typeColors = {
  sale: 'bg-blue-100 text-blue-700',
  rent: 'bg-green-100 text-green-700',
  wanted: 'bg-yellow-100 text-yellow-700',
  service: 'bg-purple-100 text-purple-700',
}
const typeLabels = {
  sale:    { en: 'For Sale', ml: 'വിൽക്കാൻ' },
  rent:    { en: 'For Rent', ml: 'വാടകയ്ക്ക്' },
  wanted:  { en: 'Wanted',   ml: 'ആവശ്യം' },
  service: { en: 'Service',  ml: 'സേവനം' },
}

function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

function ClassifiedCard({ item, isMl }: { item: Classified; isMl: boolean }) {
  const locale = isMl ? 'ml' : 'en'
  const [saved, setSaved] = useState(false)
  return (
    <div className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg hover:border-kerala-green/20 transition-all duration-300 flex flex-col">
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-gray-50">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.images[0] || classifiedFallback(item.category)}
          alt={item.title}
          onError={(e) => { (e.target as HTMLImageElement).src = classifiedFallback(item.category) }}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {item.featured && (
            <span className="bg-kerala-gold text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
              {isMl ? 'ഫീച്ചർഡ്' : 'Featured'}
            </span>
          )}
          {item.urgent && (
            <span className="bg-kerala-red text-white text-xs font-bold px-2.5 py-1 rounded-full shadow flex items-center gap-1">
              <AlertCircle size={10} />
              {isMl ? 'അർജന്റ്' : 'Urgent'}
            </span>
          )}
        </div>
        {/* Type badge */}
        <div className="absolute top-2.5 right-2.5">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shadow ${typeColors[item.type]}`}>
            {isMl ? typeLabels[item.type].ml : typeLabels[item.type].en}
          </span>
        </div>
        {/* Save button */}
        <button
          onClick={() => setSaved(!saved)}
          className="absolute bottom-2.5 right-2.5 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow hover:bg-white transition-colors"
        >
          <Heart size={14} className={saved ? 'fill-kerala-red text-kerala-red' : 'text-gray-400'} />
        </button>
        {/* Image count */}
        {item.images.length > 1 && (
          <span className="absolute bottom-2.5 left-2.5 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
            +{item.images.length - 1} {isMl ? 'ഫോട്ടോ' : 'photos'}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs font-semibold text-kerala-green uppercase tracking-wide">
            {isMl ? (item.category_ml ?? item.category) : item.category}
          </span>
          {item.condition && (
            <span className="text-xs text-gray-400 capitalize">· {item.condition}</span>
          )}
        </div>

        <Link href={`/${locale}/classifieds/${item.id}`} className="font-semibold text-kerala-deep hover:text-kerala-green transition-colors line-clamp-2 text-sm leading-snug mb-2">
          {isMl ? (item.title_ml ?? item.title) : item.title}
        </Link>

        <div className="flex items-center justify-between mb-3">
          <span className="text-kerala-green font-bold text-lg">{item.price ?? 'Free'}</span>
          {item.negotiable && (
            <span className="text-xs text-gray-500 italic">{isMl ? 'ചർച്ചചെയ്യാം' : 'Negotiable'}</span>
          )}
        </div>

        <div className="flex items-center gap-3 text-gray-400 text-xs mb-3">
          <span className="flex items-center gap-1"><MapPin size={11} />{isMl ? (item.location_ml ?? item.location) : item.location}</span>
          <span className="flex items-center gap-1"><Clock size={11} />{timeAgo(item.created_at)}</span>
          <span className="flex items-center gap-1 ml-auto"><Eye size={11} />{item.views}</span>
        </div>

        {/* Seller */}
        <div className="flex items-center gap-2 pt-3 border-t border-gray-100 mt-auto">
          <div className="relative w-7 h-7 rounded-full overflow-hidden flex-shrink-0 bg-kerala-cream flex items-center justify-center">
            {item.seller_avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.seller_avatar}
                alt={item.seller_name ?? ''}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs text-kerala-green font-bold">{(item.seller_name ?? 'A')[0]}</span>
            )}
          </div>
          <span className="text-xs text-gray-600 flex-1 truncate">
            {isMl ? (item.seller_name_ml ?? item.seller_name) : item.seller_name}
          </span>
          <div className="flex gap-1.5">
            {item.whatsapp && (
              <a href={`https://wa.me/${item.whatsapp.replace(/\D/g,'')}`}
                className="w-7 h-7 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-lg flex items-center justify-center hover:bg-emerald-100 transition-colors">
                <MessageCircle size={12} />
              </a>
            )}
            {item.phone && (
              <a href={`tel:${item.phone}`}
                className="w-7 h-7 bg-kerala-cream text-kerala-green border border-kerala-green/20 rounded-lg flex items-center justify-center hover:bg-kerala-green hover:text-white transition-colors">
                <Phone size={12} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ClassifiedsPage() {
  const locale = useLocale()
  const isMl = locale === 'ml'
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('')
  const [activeType, setActiveType] = useState<string>('')
  const [activeEmirate, setActiveEmirate] = useState('')
  const [sort, setSort] = useState<'newest' | 'views'>('newest')
  const [filterOpen, setFilterOpen] = useState(false)
  const [page, setPage] = useState(1)
  const PER = 9

  const [classifieds, setClassifieds] = useState<Classified[]>([])
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const [items, counts] = await Promise.all([
        getClassifieds({ limit: 200 }),
        getCategoryCounts(),
      ])
      setClassifieds(items)
      setCategoryCounts(counts)
      setLoading(false)
    }
    load()
  }, [])

  const filtered = useMemo(() => {
    let list = [...classifieds]
    if (query) {
      const q = query.toLowerCase()
      list = list.filter(i =>
        i.title.toLowerCase().includes(q) ||
        (i.title_ml ?? '').includes(q) ||
        (i.description ?? '').toLowerCase().includes(q)
      )
    }
    if (activeCategory) list = list.filter(i => i.category === activeCategory)
    if (activeType)     list = list.filter(i => i.type === activeType)
    if (activeEmirate)  list = list.filter(i => i.emirate.toLowerCase() === activeEmirate)
    if (sort === 'views') list.sort((a,b) => b.views - a.views)
    else list.sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    list.sort((a,b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    return list
  }, [classifieds, query, activeCategory, activeType, activeEmirate, sort])

  const paginated = filtered.slice((page-1)*PER, page*PER)
  const totalPages = Math.ceil(filtered.length / PER)

  const emirates = Array.from(new Set(classifieds.map(i => i.emirate)))
  const activeCount = [activeCategory, activeType, activeEmirate].filter(Boolean).length

  return (
    <main className="min-h-screen bg-kerala-cream">
      <Navbar />

      {/* Hero */}
      <div className="bg-kerala-deep pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-white/40 text-xs mb-3">
                <span>{isMl ? 'ഹോം' : 'Home'}</span><span>/</span>
                <span className="text-kerala-gold-light">{isMl ? 'ക്ലാസിഫൈഡ്സ്' : 'Classifieds'}</span>
              </div>
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-2">
                {isMl ? 'ക്ലാസിഫൈഡ്സ്' : 'Classifieds'}
              </h1>
              <p className="text-white/60">
                {isMl ? 'മലയാളി കമ്മ്യൂണിറ്റിക്കുള്ളിൽ വാങ്ങൂ, വിൽക്കൂ, വാടകയ്ക്ക് നൽകൂ' : 'Buy, sell & rent within the Malayali community across UAE'}
              </p>
            </div>
            <Link href={`/${locale}/classifieds/new`}
              className="flex-shrink-0 flex items-center gap-2 bg-kerala-gold hover:bg-kerala-gold-light text-white font-bold px-5 py-3 rounded-xl transition-all text-sm">
              <Plus size={16} />{isMl ? 'പരസ്യം ഇടൂ' : 'Post Free Ad'}
            </Link>
          </div>

          {/* Search */}
          <div className="flex gap-2">
            <div className="flex-1 flex items-center gap-2 bg-white/10 border border-white/20 focus-within:border-kerala-gold rounded-xl px-4 py-3 transition-colors">
              <Search size={16} className="text-white/40 flex-shrink-0" />
              <input value={query} onChange={e => { setQuery(e.target.value); setPage(1) }}
                placeholder={isMl ? 'ക്ലാസിഫൈഡ്സ് തിരയൂ...' : 'Search classifieds...'}
                className="flex-1 bg-transparent text-white placeholder-white/40 outline-none text-sm" />
              {query && <button onClick={() => setQuery('')}><X size={14} className="text-white/40 hover:text-white" /></button>}
            </div>
            <button onClick={() => setFilterOpen(!filterOpen)}
              className="relative flex items-center gap-2 bg-white/10 border border-white/20 hover:border-kerala-gold text-white px-4 py-3 rounded-xl text-sm transition-colors">
              <SlidersHorizontal size={15} />
              <span className="hidden sm:inline">{isMl ? 'ഫിൽട്ടർ' : 'Filter'}</span>
              {activeCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-kerala-gold text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">{activeCount}</span>
              )}
            </button>
          </div>

          {/* Filter panel */}
          {filterOpen && (
            <div className="mt-3 bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-white/50 text-xs mb-1 block">{isMl ? 'തരം' : 'Type'}</label>
                <select value={activeType} onChange={e => { setActiveType(e.target.value); setPage(1) }}
                  className="w-full bg-white/10 border border-white/20 text-white text-sm rounded-lg px-3 py-2 outline-none">
                  <option value="">{isMl ? 'എല്ലാം' : 'All Types'}</option>
                  <option value="sale">{isMl ? 'വിൽക്കാൻ' : 'For Sale'}</option>
                  <option value="rent">{isMl ? 'വാടകയ്ക്ക്' : 'For Rent'}</option>
                  <option value="wanted">{isMl ? 'ആവശ്യം' : 'Wanted'}</option>
                  <option value="service">{isMl ? 'സേവനം' : 'Service'}</option>
                </select>
              </div>
              <div>
                <label className="text-white/50 text-xs mb-1 block">{isMl ? 'എമിറേറ്റ്' : 'Emirate'}</label>
                <select value={activeEmirate} onChange={e => { setActiveEmirate(e.target.value); setPage(1) }}
                  className="w-full bg-white/10 border border-white/20 text-white text-sm rounded-lg px-3 py-2 outline-none">
                  <option value="">{isMl ? 'എല്ലാം' : 'All Emirates'}</option>
                  {emirates.map(e => <option key={e} value={e.toLowerCase()}>{e}</option>)}
                </select>
              </div>
              <div>
                <label className="text-white/50 text-xs mb-1 block">{isMl ? 'ക്രമം' : 'Sort By'}</label>
                <select value={sort} onChange={e => setSort(e.target.value as typeof sort)}
                  className="w-full bg-white/10 border border-white/20 text-white text-sm rounded-lg px-3 py-2 outline-none">
                  <option value="newest">{isMl ? 'പുതിയത്' : 'Newest First'}</option>
                  <option value="views">{isMl ? 'ഏറ്റവും കൂടുതൽ കണ്ടത്' : 'Most Viewed'}</option>
                </select>
              </div>
              <div className="flex items-end">
                <button onClick={() => { setActiveCategory(''); setActiveType(''); setActiveEmirate(''); setSort('newest'); setPage(1); setFilterOpen(false) }}
                  className="w-full text-center bg-kerala-red/20 hover:bg-kerala-red text-white text-sm py-2 rounded-lg border border-kerala-red/30 transition-colors">
                  {isMl ? 'ഫിൽട്ടർ മായ്ക്കൂ' : 'Clear Filters'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Category Pills */}
      <div className="bg-white border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-3 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex items-center gap-2 min-w-max">
          <button onClick={() => { setActiveCategory(''); setPage(1) }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${!activeCategory ? 'bg-kerala-green text-white' : 'bg-kerala-cream text-gray-600 hover:bg-gray-100'}`}>
            {isMl ? 'എല്ലാം' : 'All'} <span className="text-xs opacity-70">{classifieds.length}</span>
          </button>
          {classifiedCategories.map(cat => (
            <button key={cat.slug} onClick={() => { setActiveCategory(cat.slug); setPage(1) }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeCategory === cat.slug ? 'bg-kerala-green text-white' : 'bg-kerala-cream text-gray-600 hover:bg-gray-100'}`}>
              <span>{cat.icon}</span>
              {isMl ? cat.nameMl : cat.name}
              <span className="text-xs opacity-70">{categoryCounts[cat.slug] ?? 0}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Result bar */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-gray-600 font-medium">
            <span className="text-kerala-deep font-bold">{filtered.length}</span> {isMl ? 'പരസ്യങ്ങൾ' : 'ads found'}
            {activeCategory && <span className="text-kerala-green"> · {classifiedCategories.find(c=>c.slug===activeCategory)?.[isMl?'nameMl':'name']}</span>}
          </p>
          <Link href={`/${locale}/classifieds/new`}
            className="hidden sm:flex items-center gap-1.5 text-sm text-kerala-green hover:text-kerala-green-light font-semibold border border-kerala-green/30 hover:border-kerala-green px-4 py-1.5 rounded-lg transition-all">
            <Plus size={14} />{isMl ? 'പരസ്യം ഇടൂ' : 'Post Ad'}
          </Link>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                <div className="h-44 bg-gray-100" />
                <div className="p-4 space-y-3">
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-5 bg-gray-100 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : paginated.length === 0 ? (
          <div className="text-center py-20">
            <Tag size={48} className="text-gray-200 mx-auto mb-4" />
            <h3 className="font-serif text-2xl font-semibold text-kerala-deep mb-2">{isMl ? 'ഒന്നും കണ്ടെത്തിയില്ല' : 'No ads found'}</h3>
            <p className="text-gray-500 text-sm mb-5">{isMl ? 'ഫിൽട്ടറുകൾ മാറ്റി ശ്രമിക്കൂ' : 'Try adjusting your filters'}</p>
            <Link href={`/${locale}/classifieds/new`} className="inline-flex items-center gap-2 bg-kerala-green text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-kerala-green-light transition-all text-sm">
              <Plus size={15} />{isMl ? 'ആദ്യ പരസ്യം ഇടൂ' : 'Post the first ad'}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginated.map(item => <ClassifiedCard key={item.id} item={item} isMl={isMl} />)}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10">
            <button onClick={() => setPage(p=>Math.max(1,p-1))} disabled={page===1}
              className="px-4 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:border-kerala-green hover:text-kerala-green disabled:opacity-40 transition-colors">
              ← {isMl ? 'മുൻ' : 'Prev'}
            </button>
            {Array.from({length:totalPages},(_,i)=>i+1).map(p=>(
              <button key={p} onClick={() => setPage(p)}
                className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${p===page ? 'bg-kerala-green text-white' : 'border border-gray-200 text-gray-600 hover:border-kerala-green'}`}>
                {p}
              </button>
            ))}
            <button onClick={() => setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages}
              className="px-4 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:border-kerala-green hover:text-kerala-green disabled:opacity-40 transition-colors">
              {isMl ? 'അടുത്ത' : 'Next'} →
            </button>
          </div>
        )}

        {/* Post Ad CTA */}
        <div className="mt-12 bg-gradient-to-r from-kerala-deep to-kerala-green rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-serif text-2xl font-bold text-white mb-1">{isMl ? 'വിൽക്കാൻ / ആവശ്യമുണ്ടോ?' : 'Have something to sell or need something?'}</h3>
            <p className="text-white/60 text-sm">{isMl ? '3.5 ദശലക്ഷം മലയാളികളിൽ ഒരാൾ കാണും — സൗജന്യ പരസ്യം ഇടൂ' : 'Reach 3.5M Malayalis — post your classified ad for free'}</p>
          </div>
          <Link href={`/${locale}/classifieds/new`}
            className="flex-shrink-0 flex items-center gap-2 bg-kerala-gold hover:bg-kerala-gold-light text-white font-bold px-7 py-3.5 rounded-xl transition-all">
            <Plus size={18} />{isMl ? 'സൗജന്യ പരസ്യം' : 'Post Free Ad'}
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  )
}
