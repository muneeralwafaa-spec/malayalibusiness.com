'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { Clock, ArrowRight, User } from 'lucide-react'

const posts = [
  {
    id: 1,
    title: 'How Malayali Entrepreneurs Are Reshaping Dubai\'s F&B Landscape',
    titleMl: 'ദുബായ് F&B രംഗം മാറ്റുന്ന മലയാളി സംരംഭകർ',
    excerpt: 'From hole-in-the-wall biryani joints to fine dining, Kerala-origin entrepreneurs now run over 2,400 food establishments across UAE.',
    excerptMl: 'ചെറിയ ബിരിയാണി കടകൾ മുതൽ ഫൈൻ ഡൈനിംഗ് വരെ, കേരള ഉത്ഭവ സംരംഭകർ ഇന്ന് 2,400+ ഭക്ഷണ ശാലകൾ നടത്തുന്നു.',
    category: 'Business',
    categoryMl: 'ബിസിനസ്',
    author: 'Arun Krishnan',
    date: 'Aug 12, 2025',
    dateMl: 'ഓഗസ്റ്റ് 12, 2025',
    readTime: '5',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80&auto=format&fit=crop',
    featured: true,
  },
  {
    id: 2,
    title: 'NRI Investment Guide: Buying Property in Kerala from UAE',
    titleMl: 'NRI നിക്ഷേപ ഗൈഡ്: യുഎഇ-യിൽ നിന്ന് കേരളത്തിൽ വസ്തു വാങ്ങൽ',
    excerpt: 'Everything you need to know about documentation, taxation and legal procedures for NRIs investing in Kerala real estate.',
    excerptMl: 'NRI-കൾ കേരള റിയൽ എസ്റ്റേറ്റിൽ നിക്ഷേപം നടത്തുന്നതിനുള്ള രേഖകൾ, നികുതി, നിയമ നടപടികൾ.',
    category: 'Finance',
    categoryMl: 'ധനകാര്യം',
    author: 'Priya Nair',
    date: 'Aug 10, 2025',
    dateMl: 'ഓഗസ്റ്റ് 10, 2025',
    readTime: '8',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80&auto=format&fit=crop',
    featured: false,
  },
  {
    id: 3,
    title: 'Onam 2025: The Biggest Kerala Celebrations in UAE',
    titleMl: 'ഓണം 2025: യുഎഇയിലെ ഏറ്റവും വലിയ ആഘോഷങ്ങൾ',
    excerpt: 'A complete guide to Onam events, sadya restaurants and cultural programs happening across all seven emirates this September.',
    excerptMl: 'ഈ സെപ്തംബർ 7 എമിറേറ്റുകളിലും നടക്കുന്ന ഓണം ഇവന്റ്, സദ്യ, സാംസ്കാരിക പരിപാടികൾ.',
    category: 'Culture',
    categoryMl: 'സംസ്കാരം',
    author: 'Meera Menon',
    date: 'Aug 8, 2025',
    dateMl: 'ഓഗസ്റ്റ് 8, 2025',
    readTime: '4',
    image: 'https://images.unsplash.com/photo-1605745341112-85968b19335a?w=600&q=80&auto=format&fit=crop',
    featured: false,
  },
  {
    id: 4,
    title: 'Top 10 Kerala Restaurants in Dubai 2025 — Readers\' Choice',
    titleMl: 'ദുബായ് 2025-ലെ ടോപ് 10 കേരള റസ്റ്റോറന്റ്',
    excerpt: 'Our annual readers\' vote is in. Here are the most-loved Malayali restaurants in Dubai this year, as voted by 50,000+ readers.',
    excerptMl: 'ഞങ്ങളുടെ വാർഷിക വോട്ടെടുപ്പ് ഫലം. 50,000+ വായനക്കാർ തിരഞ്ഞെടുത്ത ദുബായ് മലയാളി റസ്റ്റോറന്റ്.',
    category: 'Food',
    categoryMl: 'ഭക്ഷണം',
    author: 'Siddharth Pillai',
    date: 'Aug 5, 2025',
    dateMl: 'ഓഗസ്റ്റ് 5, 2025',
    readTime: '6',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80&auto=format&fit=crop',
    featured: false,
  },
]

const categoryColors: Record<string, string> = {
  Business: 'bg-blue-100 text-blue-700',
  Finance: 'bg-green-100 text-green-700',
  Culture: 'bg-pink-100 text-pink-700',
  Food: 'bg-orange-100 text-orange-700',
}

export default function BlogSection() {
  const locale = useLocale()
  const isMl = locale === 'ml'
  const featured = posts[0]
  const others = posts.slice(1)

  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-kerala-red font-semibold text-sm uppercase tracking-widest mb-2">
              {isMl ? 'ബ്ലോഗ്' : 'Community Stories'}
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-semibold text-kerala-deep">
              {isMl ? 'കമ്മ്യൂണിറ്റി സ്റ്റോറികൾ' : 'Community Stories'}
            </h2>
            <p className="text-gray-500 mt-2">
              {isMl ? 'മലയാളി ബിസിനസ് കമ്മ്യൂണിറ്റിയിൽ നിന്നുള്ള വാർത്തകൾ' : 'News, insights and stories from the Malayali business community'}
            </p>
          </div>
          <Link
            href={`/${locale}/community`}
            className="flex items-center gap-2 border border-gray-300 text-gray-700 hover:border-kerala-red hover:text-kerala-red font-semibold text-sm px-5 py-2.5 rounded-lg transition-all whitespace-nowrap"
          >
            {isMl ? 'എല്ലാ ലേഖനങ്ങളും' : 'Read All Articles'}
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Editorial Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Featured large post */}
          <Link
            href={`/${locale}/community/${featured.id}`}
            className="group lg:col-span-3 relative overflow-hidden rounded-3xl h-72 lg:h-auto card-hover min-h-[380px]"
          >
            <Image
              src={featured.image}
              alt={featured.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            <div className="absolute top-4 left-4">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${categoryColors[featured.category] || 'bg-gray-100 text-gray-700'}`}>
                {isMl ? featured.categoryMl : featured.category}
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="font-serif text-2xl md:text-3xl font-bold text-white mb-3 line-clamp-3 group-hover:text-kerala-gold-light transition-colors">
                {isMl ? featured.titleMl : featured.title}
              </h3>
              <p className="text-white/70 text-sm line-clamp-2 mb-4">
                {isMl ? featured.excerptMl : featured.excerpt}
              </p>
              <div className="flex items-center gap-4 text-white/60 text-xs">
                <span className="flex items-center gap-1.5">
                  <User size={12} />
                  {featured.author}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={12} />
                  {featured.readTime} {isMl ? 'മിനിറ്റ്' : 'min read'}
                </span>
                <span>{isMl ? featured.dateMl : featured.date}</span>
              </div>
            </div>
          </Link>

          {/* Other posts */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {others.map((post) => (
              <Link
                key={post.id}
                href={`/${locale}/community/${post.id}`}
                className="group flex gap-4 card-hover"
              >
                <div className="relative w-28 h-24 rounded-xl overflow-hidden flex-shrink-0">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="112px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${categoryColors[post.category] || 'bg-gray-100 text-gray-700'} mb-1.5`}>
                    {isMl ? post.categoryMl : post.category}
                  </span>
                  <h4 className="font-semibold text-kerala-deep text-sm leading-snug group-hover:text-kerala-green transition-colors mb-1.5 line-clamp-3">
                    {isMl ? post.titleMl : post.title}
                  </h4>
                  <div className="flex items-center gap-3 text-gray-400 text-xs">
                    <span className="flex items-center gap-1">
                      <Clock size={10} />
                      {post.readTime} {isMl ? 'min' : 'min'}
                    </span>
                    <span>{isMl ? post.dateMl : post.date}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
