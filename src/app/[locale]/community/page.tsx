'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import {
  Search, Clock, Eye, MessageCircle, Heart,
  BookOpen, TrendingUp, Users, Star, Tag, ChevronRight
} from 'lucide-react'

interface Article {
  id: string
  title: string
  titleMl: string
  excerpt: string
  excerptMl: string
  category: string
  categoryMl: string
  author: string
  authorMl: string
  authorAvatar: string
  authorRole: string
  authorRoleMl: string
  date: string
  readTime: number
  image: string
  views: number
  likes: number
  comments: number
  featured: boolean
  trending: boolean
  tags: string[]
}

const articles: Article[] = [
  {
    id: 'uae-business-setup-guide',
    title: 'Complete Guide to Starting a Business in UAE as a Malayali',
    titleMl: 'UAE-ൽ ഒരു മലയാളി ബിസിനസ് ആരംഭിക്കുന്നതിനുള്ള പൂർണ്ണ ഗൈഡ്',
    excerpt: 'From free zone vs mainland to visa sponsorship — everything a Malayali entrepreneur needs to know before incorporating in the UAE.',
    excerptMl: 'ഫ്രീ സോൺ vs മെയിൻലാൻഡ് മുതൽ വിസ സ്പോൺസർഷിപ്പ് വരെ — UAE-ൽ ബിസിനസ് ആരംഭിക്കുന്നതിന് ഒരു മലയാളി സംരംഭകൻ അറിഞ്ഞിരിക്കേണ്ട എല്ലാം.',
    category: 'Business',
    categoryMl: 'ബിസിനസ്',
    author: 'Rajan Nair',
    authorMl: 'രാജൻ നായർ',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
    authorRole: 'Business Consultant',
    authorRoleMl: 'ബിസിനസ് കൺസൾട്ടന്റ്',
    date: '2025-05-10',
    readTime: 8,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80&auto=format&fit=crop',
    views: 12450,
    likes: 342,
    comments: 47,
    featured: true,
    trending: true,
    tags: ['Business Setup', 'Freezone', 'Visa', 'Entrepreneur'],
  },
  {
    id: 'nri-investment-kerala',
    title: 'Smart Investment Options for UAE-Based Malayalis Back in Kerala',
    titleMl: 'UAE-ൽ ഉള്ള മലയാളികൾക്ക് കേരളത്തിൽ ബുദ്ധിമുട്ടില്ലാത്ത നിക്ഷേപ ഓപ്ഷനുകൾ',
    excerpt: 'Real estate, mutual funds, NRE accounts, and government bonds — a financial advisor\'s guide to growing your wealth back home.',
    excerptMl: 'റിയൽ എസ്റ്റേറ്റ്, മ്യൂച്ചൽ ഫണ്ടുകൾ, NRE അക്കൗണ്ടുകൾ, സർക്കാർ ബോണ്ടുകൾ — നാട്ടിൽ സമ്പത്ത് വളർത്താനുള്ള ഗൈഡ്.',
    category: 'Finance',
    categoryMl: 'ഫിനാൻസ്',
    author: 'Priya Menon',
    authorMl: 'പ്രിയ മേനോൻ',
    authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
    authorRole: 'Financial Advisor',
    authorRoleMl: 'ഫിനാൻഷ്യൽ അഡ്വൈസർ',
    date: '2025-05-08',
    readTime: 10,
    image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=1200&q=80&auto=format&fit=crop',
    views: 8920,
    likes: 218,
    comments: 34,
    featured: true,
    trending: false,
    tags: ['Investment', 'NRI', 'Real Estate', 'Finance'],
  },
  {
    id: 'onam-recipes-uae',
    title: 'Authentic Onam Sadya Recipes You Can Make in Dubai',
    titleMl: 'ദുബായിൽ ഉണ്ടാക്കാൻ കഴിയുന്ന ആധികാരിക ഓണസദ്യ റെസിപ്പികൾ',
    excerpt: 'All 26 dishes of the traditional Onam feast with modern adaptations for UAE kitchens. Where to find authentic Kerala ingredients in Dubai.',
    excerptMl: 'UAE അടുക്കളകൾക്ക് ആധുനിക അഡാപ്‌റ്റേഷനുകളോടെ പരമ്പരാഗത ഓണ സദ്യയുടെ 26 വിഭവങ്ങൾ.',
    category: 'Food & Culture',
    categoryMl: 'ഭക്ഷണം & സംസ്കാരം',
    author: 'Lakshmi Krishnan',
    authorMl: 'ലക്ഷ്മി കൃഷ്ണൻ',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80',
    authorRole: 'Food Blogger',
    authorRoleMl: 'ഫുഡ് ബ്ലോഗർ',
    date: '2025-05-05',
    readTime: 12,
    image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=1200&q=80&auto=format&fit=crop',
    views: 21300,
    likes: 567,
    comments: 89,
    featured: false,
    trending: true,
    tags: ['Onam', 'Sadya', 'Recipes', 'Kerala Food'],
  },
  {
    id: 'remote-work-tips',
    title: 'Working Remotely from UAE While Managing a Kerala Business',
    titleMl: 'UAE-ൽ ഇരുന്ന് കേരള ബിസിനസ് നടത്തൽ: ടിപ്സ് & ട്രിക്സ്',
    excerpt: 'Digital tools, banking strategies, and legal considerations for Malayali entrepreneurs managing businesses in both UAE and India simultaneously.',
    excerptMl: 'UAE-ലും ഇന്ത്യയിലും ഒരേ സമയം ബിസിനസ് നടത്തുന്ന മലയാളി സംരംഭകർക്കുള്ള ഡിജിറ്റൽ ടൂളുകൾ.',
    category: 'Business',
    categoryMl: 'ബിസിനസ്',
    author: 'Suresh Pillai',
    authorMl: 'സുരേഷ് പിള്ള',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
    authorRole: 'Serial Entrepreneur',
    authorRoleMl: 'സീരിയൽ സംരംഭകൻ',
    date: '2025-05-01',
    readTime: 7,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&q=80&auto=format&fit=crop',
    views: 6780,
    likes: 198,
    comments: 28,
    featured: false,
    trending: false,
    tags: ['Remote Work', 'Entrepreneur', 'Digital Tools', 'Cross-border'],
  },
  {
    id: 'malayali-community-dubai',
    title: 'The Malayali Community in Dubai: A 50-Year Story',
    titleMl: 'ദുബായിലെ മലയാളി സമൂഹം: 50 വർഷത്തെ കഥ',
    excerpt: 'From the early oil boom migrants to tech executives — how the Malayali community shaped the UAE\'s economy and culture over five decades.',
    excerptMl: 'ആദ്യകാല എണ്ണ ബൂം കുടിയേറ്റക്കാർ മുതൽ ടെക് എക്‌സിക്യൂട്ടീവുകൾ വരെ — മലയാളി സമൂഹം UAE ൻ്റെ സമ്പദ്‌വ്യവസ്ഥ രൂപപ്പെടുത്തിയ കഥ.',
    category: 'Community',
    categoryMl: 'കമ്മ്യൂണിറ്റി',
    author: 'Dr. Thomas Varghese',
    authorMl: 'ഡോ. തോമസ് വർഗ്ഗീസ്',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    authorRole: 'Historian & Author',
    authorRoleMl: 'ചരിത്രകാരൻ & എഴുത്തുകാരൻ',
    date: '2025-04-28',
    readTime: 15,
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80&auto=format&fit=crop',
    views: 15600,
    likes: 412,
    comments: 63,
    featured: false,
    trending: true,
    tags: ['Community', 'History', 'Dubai', 'Migration'],
  },
  {
    id: 'uae-healthcare-guide',
    title: 'Navigating UAE Healthcare: A Guide for Malayali Expats',
    titleMl: 'UAE ആരോഗ്യ സംരക്ഷണം: മലയാളി പ്രവാസികൾക്കുള്ള ഗൈഡ്',
    excerpt: 'DHA vs HAAD insurance, finding Malayalam-speaking doctors, and the best Ayurvedic clinics in the UAE.',
    excerptMl: 'DHA vs HAAD ഇൻഷുറൻസ്, മലയാളം സംസാരിക്കുന്ന ഡോക്ടർമാരെ കണ്ടെത്തൽ, UAE-ൽ മികച്ച ആയുർവേദ ക്ലിനിക്കുകൾ.',
    category: 'Health',
    categoryMl: 'ആരോഗ്യം',
    author: 'Dr. Anitha Nambiar',
    authorMl: 'ഡോ. അനിത നമ്പ്യാർ',
    authorAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&q=80',
    authorRole: 'GP Physician, Dubai',
    authorRoleMl: 'GP ഫിസിഷ്യൻ, ദുബായ്',
    date: '2025-04-25',
    readTime: 9,
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1200&q=80&auto=format&fit=crop',
    views: 9240,
    likes: 245,
    comments: 41,
    featured: false,
    trending: false,
    tags: ['Healthcare', 'Insurance', 'Ayurveda', 'Expat'],
  },
]

const articleCategories = [
  { key: 'all', label: 'All', labelMl: 'എല്ലാം' },
  { key: 'Business', label: 'Business', labelMl: 'ബിസിനസ്' },
  { key: 'Finance', label: 'Finance', labelMl: 'ഫിനാൻസ്' },
  { key: 'Food & Culture', label: 'Food & Culture', labelMl: 'ഭക്ഷണം & സംസ്കാരം' },
  { key: 'Community', label: 'Community', labelMl: 'കമ്മ്യൂണിറ്റി' },
  { key: 'Health', label: 'Health', labelMl: 'ആരോഗ്യം' },
]

function timeAgo(dateStr: string, isMl: boolean) {
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24))
  if (days === 0) return isMl ? 'ഇന്ന്' : 'Today'
  if (days < 7) return isMl ? `${days} ദിവസം മുൻപ്` : `${days}d ago`
  if (days < 30) return isMl ? `${Math.floor(days / 7)} ആഴ്ച` : `${Math.floor(days / 7)}w ago`
  return isMl ? `${Math.floor(days / 30)} മാസം` : `${Math.floor(days / 30)}mo ago`
}

function FeaturedCard({ article, isMl }: { article: Article; isMl: boolean }) {
  return (
    <Link href={`/en/community/${article.id}`} className="group block">
      <div className="relative rounded-2xl overflow-hidden h-72 mb-4">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <span className="bg-kerala-gold text-white text-xs font-bold px-2.5 py-1 rounded-full mb-2 inline-block">
            {isMl ? article.categoryMl : article.category}
          </span>
          <h3 className="font-serif font-bold text-white text-lg leading-snug line-clamp-2 group-hover:text-kerala-gold-light transition-colors">
            {isMl ? article.titleMl : article.title}
          </h3>
        </div>
        {article.trending && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            <TrendingUp size={11} />
            {isMl ? 'ട്രെൻഡിംഗ്' : 'Trending'}
          </div>
        )}
      </div>
      <p className="text-gray-600 text-sm line-clamp-2 mb-3">{isMl ? article.excerptMl : article.excerpt}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative w-7 h-7 rounded-full overflow-hidden">
            <Image src={article.authorAvatar} alt={article.author} fill className="object-cover" sizes="28px" />
          </div>
          <div>
            <p className="text-xs font-semibold text-kerala-deep">{isMl ? article.authorMl : article.author}</p>
            <p className="text-xs text-gray-400">{isMl ? article.authorRoleMl : article.authorRole}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1"><Clock size={11} /> {article.readTime}m</span>
          <span className="flex items-center gap-1"><Eye size={11} /> {(article.views / 1000).toFixed(1)}K</span>
        </div>
      </div>
    </Link>
  )
}

function ArticleCard({ article, isMl, horizontal }: { article: Article; isMl: boolean; horizontal?: boolean }) {
  const [liked, setLiked] = useState(false)

  if (horizontal) {
    return (
      <Link href={`/en/community/${article.id}`} className="group flex gap-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-4">
        <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
          <Image src={article.image} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="96px" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-xs font-semibold text-kerala-green">{isMl ? article.categoryMl : article.category}</span>
          <h4 className="font-serif font-semibold text-kerala-deep text-sm leading-snug mt-0.5 mb-1 line-clamp-2 group-hover:text-kerala-green transition-colors">
            {isMl ? article.titleMl : article.title}
          </h4>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span>{timeAgo(article.date, isMl)}</span>
            <span className="flex items-center gap-1"><Clock size={10} /> {article.readTime}m</span>
            <span className="flex items-center gap-1"><Eye size={10} /> {article.views.toLocaleString()}</span>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
      <Link href={`/en/community/${article.id}`} className="block">
        <div className="relative h-44 overflow-hidden">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute top-3 left-3">
            <span className="bg-white/90 backdrop-blur-sm text-kerala-deep text-xs font-semibold px-2.5 py-1 rounded-full">
              {isMl ? article.categoryMl : article.category}
            </span>
          </div>
          {article.trending && (
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              <TrendingUp size={10} />
              {isMl ? 'ട്രെൻഡിംഗ്' : 'Hot'}
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/en/community/${article.id}`}>
          <h3 className="font-serif font-semibold text-kerala-deep text-base leading-snug mb-2 line-clamp-2 group-hover:text-kerala-green transition-colors">
            {isMl ? article.titleMl : article.title}
          </h3>
        </Link>
        <p className="text-gray-500 text-xs line-clamp-2 mb-3">{isMl ? article.excerptMl : article.excerpt}</p>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {article.tags.slice(0, 3).map(tag => (
            <span key={tag} className="bg-kerala-cream text-kerala-deep text-xs px-2 py-0.5 rounded-full">{tag}</span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <div className="flex items-center gap-2">
            <div className="relative w-6 h-6 rounded-full overflow-hidden">
              <Image src={article.authorAvatar} alt={article.author} fill className="object-cover" sizes="24px" />
            </div>
            <span className="text-xs text-gray-600 font-medium truncate max-w-[100px]">{isMl ? article.authorMl : article.author}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1"><Clock size={10} /> {article.readTime}m</span>
            <button
              onClick={() => setLiked(!liked)}
              className={`flex items-center gap-1 transition-colors ${liked ? 'text-red-500' : 'hover:text-red-400'}`}
            >
              <Heart size={11} fill={liked ? 'currentColor' : 'none'} />
              {article.likes + (liked ? 1 : 0)}
            </button>
            <span className="flex items-center gap-1"><MessageCircle size={10} /> {article.comments}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CommunityPage() {
  const locale = useLocale()
  const isMl = locale === 'ml'
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  const featured = useMemo(() => articles.filter(a => a.featured), [])
  const trending = useMemo(() => articles.filter(a => a.trending).slice(0, 4), [])

  const filtered = useMemo(() => {
    let list = [...articles]
    if (activeCategory !== 'all') list = list.filter(a => a.category === activeCategory)
    if (query) {
      const q = query.toLowerCase()
      list = list.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.titleMl.includes(q) ||
        a.tags.some(t => t.toLowerCase().includes(q))
      )
    }
    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [query, activeCategory])

  return (
    <main className="min-h-screen bg-kerala-cream">
      <Navbar />

      {/* Header */}
      <div className="bg-kerala-deep pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-white/40 text-xs mb-4">
            <span>{isMl ? 'ഹോം' : 'Home'}</span>
            <span>/</span>
            <span className="text-kerala-gold-light">{isMl ? 'കമ്മ്യൂണിറ്റി' : 'Community'}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-2">
                {isMl ? 'കമ്മ്യൂണിറ്റി & ബ്ലോഗ്' : 'Community & Blog'}
              </h1>
              <p className="text-white/60 text-base">
                {isMl
                  ? 'UAE മലയാളി കമ്മ്യൂണിറ്റിക്കായുള്ള ലേഖനങ്ങളും ഗൈഡുകളും'
                  : 'Stories, guides, and insights for the UAE Malayali community'}
              </p>
            </div>
            <button className="self-start sm:self-auto flex items-center gap-2 bg-kerala-gold text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-kerala-gold-light transition-all text-sm">
              <BookOpen size={15} />
              {isMl ? 'ലേഖനം എഴുതൂ' : 'Write Article'}
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-6 mt-6">
            {[
              { icon: BookOpen, val: '500+', label: isMl ? 'ലേഖനങ്ങൾ' : 'Articles' },
              { icon: Users, val: '12K+', label: isMl ? 'വായനക്കാർ' : 'Readers/mo' },
              { icon: Star, val: '4.8', label: isMl ? 'ശരാശരി റേറ്റിംഗ്' : 'Avg. Rating' },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-2">
                <s.icon size={16} className="text-kerala-gold-light" />
                <div>
                  <div className="font-serif font-bold text-kerala-gold-light text-lg leading-none">{s.val}</div>
                  <div className="text-white/50 text-xs">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Search */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="relative max-w-lg">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={isMl ? 'ലേഖനം തിരയൂ...' : 'Search articles...'}
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 focus:border-kerala-green"
            />
            {query && (
              <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                <Tag size={14} className="text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-7 scrollbar-hide">
          {articleCategories.map(cat => (
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

        <div className="flex gap-8">
          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Featured (only on default view) */}
            {featured.length > 0 && activeCategory === 'all' && !query && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-serif text-xl font-bold text-kerala-deep">
                    {isMl ? 'ഫീച്ചേഡ് ലേഖനങ്ങൾ' : 'Featured Articles'}
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {featured.map(a => (
                    <FeaturedCard key={a.id} article={a} isMl={isMl} />
                  ))}
                </div>
                <div className="border-t border-gray-200 my-8" />
              </div>
            )}

            {/* All/Filtered articles */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-lg font-bold text-kerala-deep">
                {activeCategory === 'all' && !query
                  ? (isMl ? 'ഏറ്റവും പുതിയ ലേഖനങ്ങൾ' : 'Latest Articles')
                  : (isMl ? `${filtered.length} ലേഖനങ്ങൾ` : `${filtered.length} articles`)}
              </h2>
            </div>

            {filtered.length === 0 ? (
              <div className="py-16 text-center">
                <BookOpen size={36} className="text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500">{isMl ? 'ലേഖനം കണ്ടെത്തിയില്ല' : 'No articles found'}</p>
                <button onClick={() => { setQuery(''); setActiveCategory('all') }} className="mt-3 text-kerala-green text-sm font-semibold">
                  {isMl ? 'ക്ലിയർ ചെയ്യൂ' : 'Clear search'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map(a => (
                  <ArticleCard key={a.id} article={a} isMl={isMl} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-72 flex-shrink-0 hidden lg:block">
            {/* Trending */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={15} className="text-red-500" />
                <h3 className="font-serif font-bold text-kerala-deep text-base">
                  {isMl ? 'ട്രെൻഡിംഗ്' : 'Trending Now'}
                </h3>
              </div>
              <div className="space-y-4">
                {trending.map((a, i) => (
                  <Link key={a.id} href={`/en/community/${a.id}`} className="flex gap-3 group">
                    <span className="font-serif font-bold text-2xl text-gray-200 leading-none w-6 flex-shrink-0">{i + 1}</span>
                    <div>
                      <p className="text-xs font-semibold text-kerala-green mb-0.5">{isMl ? a.categoryMl : a.category}</p>
                      <p className="text-sm font-medium text-kerala-deep leading-snug line-clamp-2 group-hover:text-kerala-green transition-colors">
                        {isMl ? a.titleMl : a.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        <Eye size={10} /> {a.views.toLocaleString()}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="bg-gradient-to-br from-kerala-deep to-kerala-green rounded-2xl p-5 mb-5 text-white">
              <BookOpen size={24} className="text-kerala-gold-light mb-2" />
              <h3 className="font-serif font-bold text-lg mb-1">
                {isMl ? 'ന്യൂസ്‌ലെറ്റർ' : 'Newsletter'}
              </h3>
              <p className="text-white/70 text-xs mb-4">
                {isMl
                  ? 'ആഴ്ചതോറുമുള്ള ഗൈഡുകളും ഉൾക്കാഴ്ചകളും ഇൻബോക്സിൽ ലഭിക്കൂ'
                  : 'Get weekly guides and insights in your inbox'}
              </p>
              <input
                type="email"
                placeholder={isMl ? 'ഇമെയിൽ വിലാസം' : 'Your email'}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-white/40 mb-2 focus:outline-none focus:border-white/50"
              />
              <button className="w-full bg-kerala-gold hover:bg-kerala-gold-light text-white font-semibold py-2 rounded-lg text-sm transition-all">
                {isMl ? 'സബ്‌സ്ക്രൈബ് ചെയ്യൂ' : 'Subscribe'}
              </button>
            </div>

            {/* Popular Tags */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-serif font-bold text-kerala-deep text-base mb-3">
                {isMl ? 'ജനപ്രിയ ടാഗുകൾ' : 'Popular Tags'}
              </h3>
              <div className="flex flex-wrap gap-2">
                {['Business Setup', 'Investment', 'Onam', 'Healthcare', 'NRI', 'Dubai', 'Remote Work', 'Community', 'Visa', 'Finance'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="bg-kerala-cream text-kerala-deep text-xs font-medium px-3 py-1.5 rounded-full hover:bg-kerala-green hover:text-white transition-all"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Write for Us CTA */}
        <div className="mt-12 bg-white rounded-3xl border border-gray-100 shadow-sm p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-serif text-2xl font-bold text-kerala-deep mb-2">
              {isMl ? 'ഒരു ലേഖകൻ/ലേഖിക ആകൂ' : 'Write for the Community'}
            </h3>
            <p className="text-gray-500 text-sm max-w-md">
              {isMl
                ? 'നിങ്ങളുടെ വൈദഗ്ദ്ധ്യം 50,000+ മലയാളി വായനക്കാരുമായി പങ്കിടൂ. ബിസിനസ്, ഫിനാൻസ്, ഭക്ഷണം, കമ്മ്യൂണിറ്റി — ഏത് മേഖലയിലും.'
                : 'Share your expertise with 50,000+ Malayali readers. Business, finance, food, culture — any topic that matters to the community.'}
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <button className="flex items-center gap-2 bg-kerala-green hover:bg-kerala-green-light text-white font-semibold px-6 py-3 rounded-xl transition-all">
              <BookOpen size={16} />
              {isMl ? 'ലേഖനം അയക്കൂ' : 'Submit Article'}
            </button>
            <button className="flex items-center gap-2 border border-gray-200 text-gray-600 hover:border-kerala-green hover:text-kerala-green px-5 py-3 rounded-xl text-sm font-medium transition-all">
              {isMl ? 'ഗൈഡ്‌ലൈൻ' : 'Guidelines'} <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
