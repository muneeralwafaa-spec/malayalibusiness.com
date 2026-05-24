'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { useEffect, useState } from 'react'
import { Clock, ArrowRight, User, Loader2 } from 'lucide-react'
import { getPosts } from '@/lib/community'
import type { CommunityPost } from '@/lib/community'

const categoryColors: Record<string, string> = {
  Business:        'bg-blue-100 text-blue-700',
  Finance:         'bg-green-100 text-green-700',
  'Food & Culture':'bg-orange-100 text-orange-700',
  Culture:         'bg-pink-100 text-pink-700',
  Community:       'bg-purple-100 text-purple-700',
  Health:          'bg-red-100 text-red-700',
}

const FALLBACK = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80'

export default function BlogSection() {
  const locale = useLocale()
  const isMl = locale === 'ml'
  const [posts,   setPosts]   = useState<CommunityPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPosts({ featured: true, limit: 4 }).then(data => {
      // If fewer than 4 featured, fall back to latest
      if (data.length < 4) {
        getPosts({ limit: 4 }).then(all => {
          setPosts(all)
          setLoading(false)
        })
      } else {
        setPosts(data)
        setLoading(false)
      }
    })
  }, [])

  if (loading) {
    return (
      <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex justify-center py-20">
          <Loader2 size={36} className="animate-spin text-kerala-green" />
        </div>
      </section>
    )
  }

  if (!posts.length) return null

  const [featured, ...others] = posts

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

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Featured large post */}
          <Link
            href={`/${locale}/community/${featured.slug}`}
            className="group lg:col-span-3 relative overflow-hidden rounded-3xl h-72 lg:h-auto card-hover min-h-[380px]"
          >
            <Image
              src={featured.image_url || FALLBACK}
              alt={isMl ? (featured.title_ml ?? featured.title) : featured.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 60vw"
              onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            <div className="absolute top-4 left-4">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${categoryColors[featured.category] ?? 'bg-gray-100 text-gray-700'}`}>
                {isMl ? (featured.category_ml ?? featured.category) : featured.category}
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="font-serif text-2xl md:text-3xl font-bold text-white mb-3 line-clamp-3 group-hover:text-kerala-gold-light transition-colors">
                {isMl ? (featured.title_ml ?? featured.title) : featured.title}
              </h3>
              {featured.excerpt && (
                <p className="text-white/70 text-sm line-clamp-2 mb-4">
                  {isMl ? (featured.excerpt_ml ?? featured.excerpt) : featured.excerpt}
                </p>
              )}
              <div className="flex items-center gap-4 text-white/60 text-xs">
                <span className="flex items-center gap-1.5">
                  <User size={12} />
                  {isMl ? (featured.author_name_ml ?? featured.author_name) : featured.author_name}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={12} />
                  {featured.read_time} {isMl ? 'മിനിറ്റ്' : 'min read'}
                </span>
              </div>
            </div>
          </Link>

          {/* Other posts */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {others.slice(0, 3).map((post) => (
              <Link
                key={post.id}
                href={`/${locale}/community/${post.slug}`}
                className="group flex gap-4 card-hover"
              >
                <div className="relative w-28 h-24 rounded-xl overflow-hidden flex-shrink-0">
                  <Image
                    src={post.image_url || FALLBACK}
                    alt={isMl ? (post.title_ml ?? post.title) : post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="112px"
                    onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${categoryColors[post.category] ?? 'bg-gray-100 text-gray-700'} mb-1.5`}>
                    {isMl ? (post.category_ml ?? post.category) : post.category}
                  </span>
                  <h4 className="font-semibold text-kerala-deep text-sm leading-snug group-hover:text-kerala-green transition-colors mb-1.5 line-clamp-3">
                    {isMl ? (post.title_ml ?? post.title) : post.title}
                  </h4>
                  <div className="flex items-center gap-3 text-gray-400 text-xs">
                    <span className="flex items-center gap-1">
                      <Clock size={10} />
                      {post.read_time} min
                    </span>
                    <span>{isMl ? (post.author_name_ml ?? post.author_name) : post.author_name}</span>
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
