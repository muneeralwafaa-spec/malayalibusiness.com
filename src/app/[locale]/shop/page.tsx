'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { useLocale } from 'next-intl'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import {
  Search, ShoppingCart, Heart, Star, Filter, X, ChevronDown,
  Package, Truck, ShieldCheck, ArrowRight, Tag
} from 'lucide-react'

interface Product {
  id: string
  name: string
  nameMl: string
  brand: string
  brandMl: string
  category: string
  categoryMl: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  image: string
  images: string[]
  description: string
  descriptionMl: string
  tags: string[]
  inStock: boolean
  featured: boolean
  bestseller: boolean
  origin: string
  originMl: string
}

const products: Product[] = [
  {
    id: 'coconut-oil-premium',
    name: 'Premium Cold-Pressed Coconut Oil',
    nameMl: 'തേങ്ങ എണ്ണ – ശീതകൊടുങ്ങൽ',
    brand: 'Kerala Harvest',
    brandMl: 'കേരള ഹാർവസ്റ്റ്',
    category: 'Food & Grocery',
    categoryMl: 'ഭക്ഷണം & ഗ്രോസറി',
    price: 45,
    originalPrice: 55,
    rating: 4.8,
    reviews: 234,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&q=80&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&q=80',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80',
    ],
    description: 'Pure cold-pressed virgin coconut oil from traditional Kerala plantations. Unrefined and rich in natural lauric acid.',
    descriptionMl: 'കേരളത്തിലെ പരമ്പരാഗത തോട്ടങ്ങളിൽ നിന്ന് ശുദ്ധമായ തണുത്ത ഞെക്കി എടുത്ത തേങ്ങ എണ്ണ.',
    tags: ['Organic', 'Cold Pressed', 'Hair & Skin', 'Cooking'],
    inStock: true,
    featured: true,
    bestseller: true,
    origin: 'Thrissur, Kerala',
    originMl: 'തൃശ്ശൂർ, കേരളം',
  },
  {
    id: 'kerala-spices-box',
    name: 'Kerala Spice Collection Box',
    nameMl: 'കേരള മസാല കലക്ഷൻ',
    brand: 'Malabar Spices',
    brandMl: 'മലബാർ സ്പൈസസ്',
    category: 'Food & Grocery',
    categoryMl: 'ഭക്ഷണം & ഗ്രോസറി',
    price: 89,
    originalPrice: 110,
    rating: 4.9,
    reviews: 456,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=80&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=80'],
    description: 'An exquisite collection of 12 authentic Kerala spices: cardamom, pepper, turmeric, cinnamon, cloves, and more.',
    descriptionMl: '12 ആധികാരിക കേരള മസാലകളുടെ ശേഖരം: ഏലം, കുരുമുളക്, മഞ്ഞൾ, ദാൽചിനി.',
    tags: ['Spices', 'Gift Box', 'Organic', 'Authentic'],
    inStock: true,
    featured: true,
    bestseller: true,
    origin: 'Wayanad, Kerala',
    originMl: 'വയനാട്, കേരളം',
  },
  {
    id: 'kasavu-saree',
    name: 'Traditional Kasavu Saree',
    nameMl: 'കസവ് സാരി – തനതു കേരളം',
    brand: 'Balaramapuram Weaves',
    brandMl: 'ബാലരാമപുരം നെയ്ത്ത്',
    category: 'Fashion & Textiles',
    categoryMl: 'ഫാഷൻ & വസ്ത്രം',
    price: 250,
    originalPrice: 320,
    rating: 4.7,
    reviews: 189,
    image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&q=80&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&q=80'],
    description: 'Handwoven Kerala Kasavu saree with golden zari border. Perfect for Onam, Vishu, and special occasions.',
    descriptionMl: 'കൈത്തറി കേരള കസവ് സാരി. ഓണം, വിഷു, പ്രത്യേക അവസരങ്ങൾക്ക് അനുയോജ്യം.',
    tags: ['Handwoven', 'Onam', 'Traditional', 'Cotton'],
    inStock: true,
    featured: false,
    bestseller: true,
    origin: 'Balaramapuram, Kerala',
    originMl: 'ബാലരാമപുരം, കേരളം',
  },
  {
    id: 'kathakali-mask',
    name: 'Kathakali Face Mask – Handcrafted',
    nameMl: 'കഥകളി മുഖം – കൈകൊണ്ട് നിർമ്മിച്ചത്',
    brand: 'Trivandrum Crafts',
    brandMl: 'തിരുവനന്തപുരം ക്രാഫ്റ്റ്സ്',
    category: 'Art & Handicrafts',
    categoryMl: 'കല & കരകൗശലം',
    price: 120,
    rating: 4.6,
    reviews: 78,
    image: 'https://images.unsplash.com/photo-1578301978018-3005759f48f7?w=600&q=80&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1578301978018-3005759f48f7?w=600&q=80'],
    description: 'Authentic handcrafted Kathakali face mask made by traditional artisans. Papier-mâché construction with natural colors.',
    descriptionMl: 'പരമ്പരാഗത കലാകാരന്മാർ നിർമ്മിച്ച ആധികാരിക കഥകളി മുഖം.',
    tags: ['Handcrafted', 'Art', 'Gift', 'Cultural'],
    inStock: true,
    featured: false,
    bestseller: false,
    origin: 'Thrissur, Kerala',
    originMl: 'തൃശ്ശൂർ, കേരളം',
  },
  {
    id: 'banana-chips',
    name: 'Nenthran Banana Chips – Coconut Oil',
    nameMl: 'നേന്ത്രക്ക ചിപ്സ് – തേങ്ങ എണ്ണ',
    brand: 'Calicut Snacks',
    brandMl: 'കോഴിക്കോട് സ്നാക്ക്സ്',
    category: 'Food & Grocery',
    categoryMl: 'ഭക്ഷണം & ഗ്രോസറി',
    price: 22,
    rating: 4.9,
    reviews: 892,
    image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=600&q=80&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=600&q=80'],
    description: 'Crispy traditional Kerala banana chips fried in pure coconut oil. Lightly salted, no preservatives.',
    descriptionMl: 'ശുദ്ധ തേങ്ങ എണ്ണയിൽ വറുത്ത പരമ്പരാഗത കേരള കേഴ്വണ്ണ ചിപ്സ്.',
    tags: ['Snacks', 'Kerala', 'No Preservatives', 'Coconut Oil'],
    inStock: true,
    featured: false,
    bestseller: true,
    origin: 'Kozhikode, Kerala',
    originMl: 'കോഴിക്കോട്, കേരളം',
  },
  {
    id: 'rosewood-elephant',
    name: 'Rosewood Elephant Figurine',
    nameMl: 'റോസ്‌വുഡ് ആനപ്രതിമ',
    brand: 'Kerala Woodcraft',
    brandMl: 'കേരള വുഡ്ക്രാഫ്റ്റ്',
    category: 'Art & Handicrafts',
    categoryMl: 'കല & കരകൗശലം',
    price: 185,
    originalPrice: 220,
    rating: 4.8,
    reviews: 145,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80'],
    description: 'Beautifully carved rosewood elephant figurine. Handcrafted by master artisans in Thrissur.',
    descriptionMl: 'തൃശ്ശൂർ മാസ്റ്റർ കലാകാരന്മാർ കൈ കൊണ്ട് കൊത്തിയ റോസ്‌വുഡ് ആന.',
    tags: ['Woodcraft', 'Elephant', 'Decor', 'Gift'],
    inStock: true,
    featured: false,
    bestseller: false,
    origin: 'Thrissur, Kerala',
    originMl: 'തൃശ്ശൂർ, കേരളം',
  },
  {
    id: 'kerala-ayurvedic-kit',
    name: 'Ayurvedic Wellness Kit',
    nameMl: 'ആയുർവേദ ആരോഗ്യ കിറ്റ്',
    brand: 'Kottakkal Arya Vaidya',
    brandMl: 'കോട്ടക്കൽ ആര്യ വൈദ്യ',
    category: 'Wellness & Beauty',
    categoryMl: 'ആരോഗ്യം & സൗന്ദര്യം',
    price: 175,
    originalPrice: 210,
    rating: 4.7,
    reviews: 312,
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&q=80&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&q=80'],
    description: 'Complete Ayurvedic wellness kit including Chyavanprash, Triphala, Ashwagandha, and medicated oils.',
    descriptionMl: 'ചവ്യനപ്രാശം, ത്രിഫല, അശ്വഗന്ധ, ഔഷധ എണ്ണകൾ ഉൾപ്പെടുന്ന സമ്പൂർണ്ണ ആയുർവേദ കിറ്റ്.',
    tags: ['Ayurveda', 'Wellness', 'Herbal', 'Certified'],
    inStock: true,
    featured: true,
    bestseller: false,
    origin: 'Kottakkal, Kerala',
    originMl: 'കോട്ടക്കൽ, കേരളം',
  },
  {
    id: 'kerala-coffee',
    name: 'Wayanad Estate Coffee Beans',
    nameMl: 'വയനാട് എസ്റ്റേറ്റ് കാപ്പി',
    brand: 'Wayanad Estates',
    brandMl: 'വയനാട് എസ്റ്റേറ്റ്സ്',
    category: 'Food & Grocery',
    categoryMl: 'ഭക്ഷണം & ഗ്രോസറി',
    price: 68,
    rating: 4.8,
    reviews: 567,
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&q=80&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&q=80'],
    description: 'Single-origin Arabica coffee beans from the lush hills of Wayanad. Medium roast, notes of cardamom and dark chocolate.',
    descriptionMl: 'വയനാട്ടിലെ ഇടതൂർന്ന കുന്നുകളിൽ നിന്നുള്ള ഏക ഉറവിട അറബ്ബിക്ക കാപ്പി.',
    tags: ['Coffee', 'Single Origin', 'Arabica', 'Wayanad'],
    inStock: true,
    featured: false,
    bestseller: true,
    origin: 'Wayanad, Kerala',
    originMl: 'വയനാട്, കേരളം',
  },
]

const categories = [
  { key: 'all', label: 'All Products', labelMl: 'എല്ലാ ഉൽപ്പന്നങ്ങൾ' },
  { key: 'Food & Grocery', label: 'Food & Grocery', labelMl: 'ഭക്ഷണം & ഗ്രോസറി' },
  { key: 'Fashion & Textiles', label: 'Fashion & Textiles', labelMl: 'ഫാഷൻ & വസ്ത്രം' },
  { key: 'Art & Handicrafts', label: 'Art & Handicrafts', labelMl: 'കല & കരകൗശലം' },
  { key: 'Wellness & Beauty', label: 'Wellness & Beauty', labelMl: 'ആരോഗ്യം & സൗന്ദര്യം' },
]

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width="12" height="12" viewBox="0 0 20 20" fill={i <= Math.round(rating) ? '#c8922a' : '#e5e7eb'}>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-xs text-gray-500 ml-1">({count})</span>
    </div>
  )
}

function ProductCard({ product, isMl }: { product: Product; isMl: boolean }) {
  const [liked, setLiked] = useState(false)
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1">
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-gray-50">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.bestseller && (
            <span className="bg-kerala-gold text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
              {isMl ? 'ബെസ്റ്റ് സെല്ലർ' : 'Bestseller'}
            </span>
          )}
          {discount && (
            <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
              -{discount}%
            </span>
          )}
        </div>
        <button
          onClick={() => setLiked(!liked)}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-all ${
            liked ? 'bg-red-50 text-red-500' : 'bg-white/80 text-gray-400 hover:text-red-400'
          }`}
        >
          <Heart size={15} fill={liked ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs text-kerala-green font-semibold mb-0.5">{isMl ? product.brandMl : product.brand}</p>
        <h3 className="font-semibold text-kerala-deep text-sm leading-snug mb-2 line-clamp-2 group-hover:text-kerala-green transition-colors">
          {isMl ? product.nameMl : product.name}
        </h3>

        <StarRating rating={product.rating} count={product.reviews} />

        <div className="flex items-center justify-between mt-3">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-bold text-kerala-deep text-lg">AED {product.price}</span>
              {product.originalPrice && (
                <span className="text-gray-400 text-sm line-through">AED {product.originalPrice}</span>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              {isMl ? `ഉൽഭവം: ${product.originMl}` : `Origin: ${product.origin}`}
            </p>
          </div>
          <button className="flex items-center gap-1.5 bg-kerala-green text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-kerala-green-light transition-all">
            <ShoppingCart size={13} />
            {isMl ? 'ചേർക്കൂ' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ShopPage() {
  const locale = useLocale()
  const isMl = locale === 'ml'
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [priceMax, setPriceMax] = useState<number>(500)
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'rating'>('popular')
  const [showFilters, setShowFilters] = useState(false)

  const featured = useMemo(() => products.filter(p => p.featured), [])
  const filtered = useMemo(() => {
    let list = [...products]
    if (activeCategory !== 'all') list = list.filter(p => p.category === activeCategory)
    if (query) {
      const q = query.toLowerCase()
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      )
    }
    list = list.filter(p => p.price <= priceMax)
    if (sortBy === 'price-asc') list.sort((a, b) => a.price - b.price)
    else if (sortBy === 'price-desc') list.sort((a, b) => b.price - a.price)
    else if (sortBy === 'rating') list.sort((a, b) => b.rating - a.rating)
    else list.sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0))
    return list
  }, [query, activeCategory, priceMax, sortBy])

  return (
    <main className="min-h-screen bg-kerala-cream">
      <Navbar />

      {/* Hero Banner */}
      <div className="bg-kerala-deep pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-white/40 text-xs mb-4">
            <span>{isMl ? 'ഹോം' : 'Home'}</span>
            <span>/</span>
            <span className="text-kerala-gold-light">{isMl ? 'ഷോപ്പ്' : 'Shop'}</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-2">
                {isMl ? 'കേരള ഷോപ്പ്' : 'Kerala Shop'}
              </h1>
              <p className="text-white/60 text-base">
                {isMl
                  ? 'നേരിട്ട് കേരളത്തിൽ നിന്ന്: ഭക്ഷണം, കൈത്തൊഴിൽ, ഫാഷൻ, ആരോഗ്യ ഉൽപ്പന്നങ്ങൾ'
                  : 'Authentic Kerala products shipped directly to the UAE'}
              </p>
            </div>

            {/* Trust badges */}
            <div className="flex gap-5 flex-shrink-0">
              {[
                { icon: Truck, label: isMl ? 'UAE ഡെലിവറി' : 'UAE Delivery' },
                { icon: ShieldCheck, label: isMl ? 'ആധികാരിക' : 'Authentic' },
                { icon: Package, label: isMl ? 'സുരക്ഷിത പാക്കേജ്' : 'Secure Packing' },
              ].map(b => (
                <div key={b.label} className="flex flex-col items-center gap-1 text-center">
                  <b.icon size={20} className="text-kerala-gold-light" />
                  <span className="text-white/50 text-xs whitespace-nowrap">{b.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Search + Sort */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={isMl ? 'ഉൽപ്പന്നം തിരയൂ...' : 'Search products...'}
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 focus:border-kerala-green"
              />
              {query && (
                <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X size={14} className="text-gray-400" />
                </button>
              )}
            </div>

            <div className="relative hidden sm:block">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as typeof sortBy)}
                className="px-3 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none appearance-none cursor-pointer"
              >
                <option value="popular">{isMl ? 'ജനപ്രിയം' : 'Most Popular'}</option>
                <option value="rating">{isMl ? 'ഉയർന്ന റേറ്റിംഗ്' : 'Top Rated'}</option>
                <option value="price-asc">{isMl ? 'വില: കുറവ് – കൂടുതൽ' : 'Price: Low to High'}</option>
                <option value="price-desc">{isMl ? 'വില: കൂടുതൽ – കുറവ്' : 'Price: High to Low'}</option>
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                showFilters ? 'bg-kerala-green text-white border-kerala-green' : 'border-gray-200 text-gray-600 hover:border-kerala-green hover:text-kerala-green'
              }`}
            >
              <Filter size={15} />
              {isMl ? 'ഫിൽട്ടർ' : 'Filters'}
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                {isMl ? `പരമാവധി വില: AED ${priceMax}` : `Max Price: AED ${priceMax}`}
              </p>
              <input
                type="range"
                min={20}
                max={500}
                step={10}
                value={priceMax}
                onChange={e => setPriceMax(Number(e.target.value))}
                className="w-full max-w-xs accent-kerala-green"
              />
            </div>
          )}
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-7 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                activeCategory === cat.key
                  ? 'bg-kerala-green text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-kerala-green hover:text-kerala-green'
              }`}
            >
              {isMl ? cat.labelMl : cat.label}
            </button>
          ))}
        </div>

        {/* Featured Products */}
        {featured.length > 0 && activeCategory === 'all' && !query && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Star size={16} className="text-kerala-gold" fill="currentColor" />
                <h2 className="font-serif text-xl font-bold text-kerala-deep">
                  {isMl ? 'ഫീച്ചേഡ് ഉൽപ്പന്നങ്ങൾ' : 'Featured Products'}
                </h2>
              </div>
              <button className="text-kerala-green text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                {isMl ? 'എല്ലാം കാണൂ' : 'View all'} <ArrowRight size={14} />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {featured.map(p => (
                <ProductCard key={p.id} product={p} isMl={isMl} />
              ))}
            </div>
          </div>
        )}

        {/* Results header */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">
            {isMl ? `${filtered.length} ഉൽപ്പന്നങ്ങൾ` : `${filtered.length} products`}
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Tag size={12} />
            {isMl ? 'UAE-ലേക്ക് ഷിപ്പ് ചെയ്യും' : 'Ships to UAE'}
          </div>
        </div>

        {/* Products Grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white border border-gray-200 flex items-center justify-center mb-4">
              <Package size={28} className="text-gray-300" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-kerala-deep mb-2">
              {isMl ? 'ഉൽപ്പന്നം കണ്ടെത്തിയില്ല' : 'No products found'}
            </h3>
            <button
              onClick={() => { setQuery(''); setActiveCategory('all'); setPriceMax(500) }}
              className="mt-4 bg-kerala-green text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-kerala-green-light"
            >
              {isMl ? 'ഫിൽട്ടർ നീക്കൂ' : 'Clear filters'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map(p => (
              <ProductCard key={p.id} product={p} isMl={isMl} />
            ))}
          </div>
        )}

        {/* Sell on Kerala Shop CTA */}
        <div className="mt-12 rounded-3xl overflow-hidden relative">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80&auto=format&fit=crop"
              alt="Kerala Shop"
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-kerala-deep/80" />
          </div>
          <div className="relative px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-serif text-2xl md:text-3xl font-bold text-white mb-2">
                {isMl ? 'കേരള ഉൽപ്പന്നങ്ങൾ വിൽക്കണോ?' : 'Sell Kerala Products?'}
              </h3>
              <p className="text-white/70 text-sm max-w-md">
                {isMl
                  ? 'നിങ്ങളുടെ ആധികാരിക കേരള ഉൽപ്പന്നങ്ങൾ UAE-ൽ 50,000+ വാങ്ങുന്നവർക്ക് വിൽക്കൂ'
                  : 'List your authentic Kerala products and sell to 50,000+ buyers across UAE'}
              </p>
            </div>
            <button className="flex items-center gap-2 bg-kerala-gold hover:bg-kerala-gold-light text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg whitespace-nowrap">
              <ShoppingCart size={16} />
              {isMl ? 'വിൽക്കാൻ ആരംഭിക്കൂ' : 'Start Selling'}
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
