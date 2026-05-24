'use client'

import { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useCart } from '@/context/CartContext'
import { getMarketplaceListings, LISTING_TYPE_META, type MarketplaceListing, type ListingType } from '@/lib/shop'
import {
  Search, ShoppingCart, Star, Filter, X, ChevronDown,
  BadgeCheck, MapPin, Clock, MessageCircle, Phone,
  Package, Calendar, FileText, Zap, ArrowRight, SlidersHorizontal
} from 'lucide-react'
import CartDrawer from '@/components/shop/CartDrawer'

const CATEGORIES = ['All', 'Food & Grocery', 'Healthcare', 'Beauty & Wellness', 'Technology', 'Legal & Finance', 'Services']
const TYPES: { value: ListingType | 'all'; label: string; icon: React.ReactNode }[] = [
  { value: 'all',            label: 'All Types',    icon: <Package size={14} /> },
  { value: 'product',        label: 'Products',     icon: <Package size={14} /> },
  { value: 'appointment',    label: 'Appointments', icon: <Calendar size={14} /> },
  { value: 'quote',          label: 'Get Quote',    icon: <FileText size={14} /> },
  { value: 'direct_service', label: 'Services',     icon: <Zap size={14} /> },
  { value: 'contact_only',   label: 'Enquire',      icon: <MessageCircle size={14} /> },
]

export default function ShopPage() {
  const locale = useLocale()
  const isMl = locale === 'ml'
  const { addItem, totalItems, openCart } = useCart()

  const [allListings, setAllListings] = useState<MarketplaceListing[]>([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch]       = useState('')
  const [category, setCategory]   = useState('All')
  const [typeFilter, setTypeFilter] = useState<ListingType | 'all'>('all')
  const [emirate, setEmirate]     = useState('All')
  const [vendor, setVendor]       = useState('All')
  const [sortBy, setSortBy]       = useState('featured')
  const [showFilters, setShowFilters] = useState(false)
  const [addedId, setAddedId]     = useState<string | null>(null)

  useEffect(() => {
    getMarketplaceListings({ limit: 200 }).then(data => {
      setAllListings(data)
      setLoading(false)
    })
  }, [])

  const vendors  = useMemo(() => ['All', ...Array.from(new Set(allListings.map(l => l.vendor_name)))], [allListings])
  const emirates = useMemo(() => ['All', ...Array.from(new Set(allListings.map(l => l.vendor_emirate)))], [allListings])

  const filtered = useMemo(() => {
    let list = [...allListings]
    if (search)
      list = list.filter(l =>
        l.name.toLowerCase().includes(search.toLowerCase()) ||
        l.vendor_name.toLowerCase().includes(search.toLowerCase()) ||
        l.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
      )
    if (category !== 'All')   list = list.filter(l => l.category === category)
    if (typeFilter !== 'all') list = list.filter(l => l.listing_type === typeFilter)
    if (emirate !== 'All')    list = list.filter(l => l.vendor_emirate === emirate)
    if (vendor !== 'All')     list = list.filter(l => l.vendor_name === vendor)
    if (sortBy === 'price-asc')  list.sort((a, b) => a.price - b.price)
    else if (sortBy === 'price-desc') list.sort((a, b) => b.price - a.price)
    else if (sortBy === 'rating') list.sort((a, b) => b.rating_avg - a.rating_avg)
    else list.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0))
    return list
  }, [search, category, typeFilter, emirate, vendor, sortBy, allListings])

  function handleAdd(listing: MarketplaceListing) {
    // adapt to cart shape (CartContext expects certain fields)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    addItem(listing as any)
    setAddedId(listing.id)
    setTimeout(() => setAddedId(null), 1500)
  }

  const canAddToCart = (type: ListingType) => type === 'product' || type === 'direct_service' || type === 'appointment'

  return (
    <main className="min-h-screen bg-kerala-cream">
      <Navbar />
      <div className="h-1 w-full bg-gradient-to-r from-kerala-green via-kerala-gold to-kerala-green" />
      <CartDrawer />

      {/* Hero */}
      <div className="bg-kerala-deep py-10 px-4 text-center">
        <p className="text-kerala-gold text-xs font-semibold uppercase tracking-widest mb-2">Multi-Vendor Marketplace</p>
        <h1 className={`font-serif text-3xl sm:text-4xl font-bold text-white mb-2 ${isMl ? 'font-malayalam' : ''}`}>
          {isMl ? 'മലയാളി ഷോപ്പ്' : 'Malayali Shop'}
        </h1>
        <p className="text-white/50 text-sm max-w-lg mx-auto">
          {isMl ? 'UAE-ലെ മലയാളി കമ്പനികളുടെ ഉൽപ്പന്നങ്ങളും സേവനങ്ങളും' : 'Products & services from verified Malayali businesses across UAE'}
        </p>

        {/* Search bar */}
        <div className="mt-6 max-w-xl mx-auto flex gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={isMl ? 'ഉൽപ്പന്നം, സേവനം, കമ്പനി...' : 'Search products, services, vendors...'}
              className="w-full pl-9 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm focus:outline-none focus:bg-white/20"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-sm hover:bg-white/20 transition-colors"
          >
            <SlidersHorizontal size={15} />
            {isMl ? 'ഫിൽറ്റർ' : 'Filter'}
          </button>
          <button
            onClick={openCart}
            className="relative flex items-center gap-2 px-4 py-3 rounded-xl bg-kerala-gold text-white text-sm font-semibold hover:bg-kerala-gold-light transition-colors"
          >
            <ShoppingCart size={15} />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{totalItems}</span>
            )}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Type pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {TYPES.map(t => (
            <button
              key={t.value}
              onClick={() => setTypeFilter(t.value as ListingType | 'all')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap border transition-all ${typeFilter === t.value ? 'bg-kerala-green text-white border-kerala-green' : 'bg-white text-gray-500 border-gray-200 hover:border-kerala-green hover:text-kerala-green'}`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Expanded filters */}
        {showFilters && (
          <div className="bg-white rounded-2xl p-5 mb-6 border border-gray-100 shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-400 mb-1.5 block">Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-kerala-green">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-400 mb-1.5 block">Emirate</label>
              <select value={emirate} onChange={e => setEmirate(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-kerala-green">
                {emirates.map(e => <option key={e}>{e}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-400 mb-1.5 block">Vendor</label>
              <select value={vendor} onChange={e => setVendor(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-kerala-green">
                {vendors.map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-400 mb-1.5 block">Sort By</label>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-kerala-green">
                <option value="featured">Featured</option>
                <option value="rating">Top Rated</option>
                <option value="price-asc">Price: Low–High</option>
                <option value="price-desc">Price: High–Low</option>
              </select>
            </div>
          </div>
        )}

        {/* Results count */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-gray-500">
            {loading ? (
              <span className="animate-pulse bg-gray-200 rounded h-4 w-32 inline-block" />
            ) : (
              <>
                <span className="font-bold text-kerala-deep">{filtered.length}</span> {isMl ? 'ഇനങ്ങൾ' : 'listings found'}
                {(category !== 'All' || typeFilter !== 'all' || vendor !== 'All') && (
                  <button onClick={() => { setCategory('All'); setTypeFilter('all'); setVendor('All'); setEmirate('All') }} className="ml-2 text-red-400 hover:text-red-500 text-xs underline">
                    Clear filters
                  </button>
                )}
              </>
            )}
          </p>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
                <div className="h-44 bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-8 bg-gray-200 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Grid */}
        {!loading && filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🛍️</p>
            <p className="text-gray-400">{isMl ? 'ഒന്നും കണ്ടെത്തിയില്ല' : 'No listings found'}</p>
          </div>
        ) : !loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(listing => {
              const meta = LISTING_TYPE_META[listing.listing_type]
              const isAdded = addedId === listing.id
              const discount = listing.original_price ? Math.round((1 - listing.price / listing.original_price) * 100) : 0

              return (
                <div key={listing.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg hover:border-kerala-green/20 transition-all group flex flex-col">

                  {/* Image */}
                  <div className="relative h-44 overflow-hidden bg-gray-100">
                    {listing.image_url && (
                      <Image src={listing.image_url} alt={listing.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    )}
                    <div className="absolute top-2 left-2 flex gap-1.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${meta.color}`}>
                        {meta.icon} {meta.label}
                      </span>
                      {discount > 0 && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500 text-white">-{discount}%</span>
                      )}
                      {listing.is_bestseller && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-kerala-gold text-white">🔥</span>
                      )}
                    </div>
                  </div>

                  <div className="p-4 flex flex-col flex-1">
                    {/* Vendor */}
                    <Link href={`/${locale}/company/${listing.vendor_slug}`} className="flex items-center gap-2 mb-2 group/vendor">
                      <div className="relative w-6 h-6 rounded-full overflow-hidden flex-shrink-0 bg-gray-100">
                        {listing.vendor_logo_url && (
                          <Image src={listing.vendor_logo_url} alt="" fill className="object-cover" />
                        )}
                      </div>
                      <span className="text-[11px] text-gray-400 group-hover/vendor:text-kerala-green transition-colors truncate flex items-center gap-1">
                        {listing.vendor_name}
                        {listing.vendor_verified && <BadgeCheck size={11} className="text-kerala-green flex-shrink-0" />}
                      </span>
                    </Link>

                    {/* Name */}
                    <h3 className={`font-semibold text-kerala-deep text-sm leading-snug mb-1 line-clamp-2 flex-1 ${isMl ? 'font-malayalam' : ''}`}>
                      {isMl ? (listing.name_ml ?? listing.name) : listing.name}
                    </h3>

                    {/* Meta */}
                    <div className="flex items-center gap-2 text-[11px] text-gray-400 mb-3">
                      <span className="flex items-center gap-0.5">
                        <Star size={10} className="text-kerala-gold fill-kerala-gold" />
                        {listing.rating_avg} ({listing.review_count})
                      </span>
                      <span className="flex items-center gap-0.5">
                        <MapPin size={10} />
                        {isMl ? (listing.vendor_emirate_ml ?? listing.vendor_emirate) : listing.vendor_emirate}
                      </span>
                      {listing.duration && <span className="flex items-center gap-0.5"><Clock size={10} />{listing.duration}</span>}
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-1.5 mb-3">
                      {listing.price > 0 ? (
                        <>
                          <span className="font-bold text-kerala-green text-base">AED {listing.price.toLocaleString()}</span>
                          {listing.original_price && <span className="text-xs text-gray-300 line-through">AED {listing.original_price}</span>}
                          {listing.unit && <span className="text-[11px] text-gray-400">/ {isMl ? (listing.unit_ml ?? listing.unit) : listing.unit}</span>}
                        </>
                      ) : (
                        <span className="font-semibold text-orange-500 text-sm">{isMl ? 'ക്വോട്ട് ലഭിക്കും' : 'Get Custom Quote'}</span>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2 mt-auto">
                      <Link
                        href={`/${locale}/company/${listing.vendor_slug}/shop/${listing.id}`}
                        className="flex-1 border border-gray-200 text-gray-600 text-xs font-semibold py-2 rounded-xl text-center hover:border-kerala-green hover:text-kerala-green transition-colors"
                      >
                        {isMl ? 'വിശദാംശം' : 'View Details'}
                      </Link>

                      {listing.listing_type === 'contact_only' ? (
                        <a
                          href={`https://wa.me/${(listing.vendor_whatsapp ?? '').replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-[#25D366] text-white text-xs font-semibold py-2 rounded-xl text-center hover:bg-[#20bd5a] transition-colors flex items-center justify-center gap-1"
                        >
                          <MessageCircle size={12} />
                          WhatsApp
                        </a>
                      ) : listing.listing_type === 'quote' ? (
                        <Link
                          href={`/${locale}/company/${listing.vendor_slug}/shop/${listing.id}`}
                          className="flex-1 bg-orange-500 text-white text-xs font-semibold py-2 rounded-xl text-center hover:bg-orange-600 transition-colors"
                        >
                          {isMl ? 'ക്വോട്ട്' : 'Get Quote'}
                        </Link>
                      ) : (
                        <button
                          onClick={() => handleAdd(listing)}
                          className={`flex-1 text-xs font-semibold py-2 rounded-xl transition-all ${isAdded ? 'bg-kerala-green/20 text-kerala-green' : 'bg-kerala-green text-white hover:bg-kerala-green-light'}`}
                        >
                          {isAdded ? '✓ Added' : isMl ? meta.actionLabelMl : meta.actionLabel}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Vendor showcase strip */}
        <div className="mt-16 bg-kerala-deep rounded-3xl p-8 text-center">
          <p className="text-kerala-gold text-xs font-semibold uppercase tracking-widest mb-2">Are you a business owner?</p>
          <h2 className="font-serif text-2xl font-bold text-white mb-3">
            {isMl ? 'നിങ്ങളുടെ ഉൽപ്പന്നങ്ങളും സേവനങ്ങളും ഷോക്കേസ് ചെയ്യൂ' : 'Showcase Your Products & Services Here'}
          </h2>
          <p className="text-white/50 text-sm mb-6 max-w-md mx-auto">
            {isMl ? '3.5 ദശലക്ഷം മലയാളികൾക്ക് നിങ്ങളുടെ ഷോപ്പ് കാണിക്കൂ. ഇന്ന് ഫ്രീ ആയി ആരംഭിക്കൂ.' : 'List your products and services for 3.5M Malayalis. Start free today.'}
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href={`/${locale}/auth`} className="bg-kerala-gold text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-kerala-gold-light transition-colors">
              {isMl ? 'ഉടൻ ആരംഭിക്കൂ' : 'Start Selling Free'}
            </Link>
            <Link href={`/${locale}/pricing`} className="border border-white/30 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-white/10 transition-colors">
              {isMl ? 'പ്ലാനുകൾ കാണൂ' : 'View Plans'}
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
