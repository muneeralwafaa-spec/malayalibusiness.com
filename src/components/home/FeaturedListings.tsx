'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { useEffect, useState } from 'react'
import { Star, MapPin, ArrowRight, BadgeCheck, Loader2 } from 'lucide-react'
import { getFeaturedListings, adaptListing } from '@/lib/listings'

type Listing = ReturnType<typeof adaptListing>

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={12}
          className={i <= Math.floor(rating) ? 'text-kerala-gold fill-kerala-gold' : 'text-gray-300 fill-gray-200'}
        />
      ))}
    </div>
  )
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80&auto=format&fit=crop'

export default function FeaturedListings() {
  const locale = useLocale()
  const isMl = locale === 'ml'
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getFeaturedListings(6).then((rows) => {
      setListings(rows.map(adaptListing))
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <section className="bg-kerala-cream py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex justify-center py-20">
          <Loader2 size={36} className="animate-spin text-kerala-green" />
        </div>
      </section>
    )
  }

  if (!listings.length) return null

  const mainFeatured = listings.filter((b) => b.featured)
  const others       = listings.filter((b) => !b.featured)
  const hero         = mainFeatured[0] ?? listings[0]
  const sideCards    = [...mainFeatured.slice(1), ...others].slice(0, 4)

  return (
    <section className="bg-kerala-cream py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-kerala-gold font-semibold text-sm uppercase tracking-widest mb-2">
              {isMl ? 'ഫീച്ചർ ചെയ്തവ' : 'Featured'}
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-semibold text-kerala-deep">
              {isMl ? 'ഫീച്ചർ ചെയ്ത ബിസിനസുകൾ' : 'Featured Businesses'}
            </h2>
            <p className="text-gray-500 mt-2">
              {isMl
                ? 'മലയാളി കമ്മ്യൂണിറ്റി വിശ്വസിക്കുന്ന പ്രീമിയം ബിസിനസുകൾ'
                : 'Handpicked premium businesses trusted by the Malayali community'}
            </p>
          </div>
          <Link
            href={`/${locale}/directory`}
            className="flex items-center gap-2 bg-kerala-green text-white font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-kerala-green-light transition-all whitespace-nowrap"
          >
            {isMl ? 'എല്ലാ ബിസിനസുകളും' : 'View All Businesses'}
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Magazine Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Large Hero Card */}
          <div className="lg:col-span-2 lg:row-span-2">
            <Link
              href={`/${locale}/company/${hero.slug}`}
              className="group block relative overflow-hidden rounded-3xl h-80 lg:h-full min-h-[400px] card-hover"
            >
              <Image
                src={hero.image || FALLBACK_IMAGE}
                alt={hero.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 66vw"
                onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              {hero.featured && (
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="bg-kerala-gold text-white text-xs font-bold px-3 py-1 rounded-full">
                    {isMl ? 'ഫീച്ചർഡ്' : 'Featured'}
                  </span>
                  {hero.verified && (
                    <span className="bg-white/20 backdrop-blur text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <BadgeCheck size={11} /> {isMl ? 'വെരിഫൈഡ്' : 'Verified'}
                    </span>
                  )}
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="text-kerala-gold-light text-xs font-semibold uppercase tracking-wider mb-2">
                  {isMl ? hero.categoryMl : hero.category}
                </div>
                <h3 className="font-serif text-3xl font-bold text-white mb-2">
                  {isMl ? hero.nameMl : hero.name}
                </h3>
                <p className="text-white/70 text-sm mb-3 line-clamp-2">
                  {hero.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <StarRating rating={hero.rating} />
                    <span className="text-white text-sm font-semibold">{hero.rating.toFixed(1)}</span>
                    <span className="text-white/50 text-xs">({hero.reviewCount})</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-white/70 text-xs">
                    <MapPin size={12} />
                    {hero.location}
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Side Cards */}
          {sideCards.map((biz) => (
            <Link
              key={biz.id}
              href={`/${locale}/company/${biz.slug}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg card-hover flex flex-col sm:flex-row lg:flex-row gap-0"
            >
              <div className="relative w-full sm:w-32 lg:w-28 h-40 sm:h-auto flex-shrink-0">
                <Image
                  src={biz.image || FALLBACK_IMAGE}
                  alt={biz.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="128px"
                  onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE }}
                />
                {biz.premium && (
                  <div className="absolute top-2 left-2">
                    <span className="bg-kerala-green text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {isMl ? 'പ്രീമിയം' : 'Premium'}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-4 flex flex-col justify-center flex-1">
                <p className="text-kerala-green text-xs font-semibold uppercase tracking-wider mb-1">
                  {isMl ? biz.categoryMl : biz.category}
                </p>
                <h3 className="font-serif text-lg font-bold text-kerala-deep group-hover:text-kerala-green transition-colors leading-snug mb-1">
                  {isMl ? biz.nameMl : biz.name}
                </h3>
                <p className="text-gray-500 text-xs line-clamp-2 mb-2">
                  {biz.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <StarRating rating={biz.rating} />
                    <span className="text-gray-700 text-xs font-semibold">{biz.rating.toFixed(1)}</span>
                    <span className="text-gray-400 text-xs">({biz.reviewCount})</span>
                  </div>
                  {biz.verified && <BadgeCheck size={14} className="text-kerala-green" />}
                </div>
                <div className="flex items-center gap-1 text-gray-400 text-xs mt-1">
                  <MapPin size={10} />
                  {biz.location}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
