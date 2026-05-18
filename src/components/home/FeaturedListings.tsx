'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { Star, MapPin, ArrowRight, BadgeCheck } from 'lucide-react'

const featured = [
  {
    id: 1,
    name: 'Al Barakah Restaurant',
    nameMl: 'അൽ ബറക്ക റസ്റ്റോറന്റ്',
    category: 'Restaurant',
    categoryMl: 'റസ്റ്റോറന്റ്',
    location: 'Deira, Dubai',
    rating: 4.8,
    reviews: 342,
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80&auto=format&fit=crop',
    logo: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=100&q=80',
    featured: true,
    verified: true,
    tag: 'Top Rated',
    tagMl: 'ടോപ് റേറ്റഡ്',
    description: 'Authentic Kerala cuisine in the heart of Dubai. Famous for Malabar biryani and seafood.',
    descriptionMl: 'ദുബായ് ഹൃദയത്തിൽ ആധികാരിക കേരള ഭക്ഷണം. മലബാർ ബിരിയാണിക്കും കടൽ ഭക്ഷണത്തിനും പ്രശസ്തം.',
  },
  {
    id: 2,
    name: 'Kerala Properties Dubai',
    nameMl: 'കേരള പ്രോപ്പർടീസ് ദുബായ്',
    category: 'Real Estate',
    categoryMl: 'റിയൽ എസ്റ്റേറ്റ്',
    location: 'Business Bay, Dubai',
    rating: 4.9,
    reviews: 186,
    image: 'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=800&q=80&auto=format&fit=crop',
    logo: 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=100&q=80',
    featured: true,
    verified: true,
    tag: 'Premium',
    tagMl: 'പ്രീമിയം',
    description: 'Trusted real estate consultancy for NRIs investing in Kerala and UAE properties.',
    descriptionMl: 'കേരളത്തിലും യുഎഇയിലും നിക്ഷേപം നടത്തുന്ന എൻആർഐകൾക്ക് വിശ്വസ്ത റിയൽ എസ്റ്റേറ്റ് കൺസൽറ്റൻസി.',
  },
  {
    id: 3,
    name: 'Malabar Medical Centre',
    nameMl: 'മലബാർ മെഡിക്കൽ സെന്റർ',
    category: 'Healthcare',
    categoryMl: 'ആരോഗ്യ സേവനം',
    location: 'Al Nahda, Sharjah',
    rating: 4.7,
    reviews: 521,
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80&auto=format&fit=crop',
    logo: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=100&q=80',
    featured: false,
    verified: true,
    tag: 'Verified',
    tagMl: 'വെരിഫൈഡ്',
    description: 'Comprehensive medical care with Malayalam-speaking doctors available 24/7.',
    descriptionMl: 'മലയാളം സംസാരിക്കുന്ന ഡോക്ടർമാർ 24/7 ലഭ്യമായ സമഗ്ര വൈദ്യ സേവനം.',
  },
  {
    id: 4,
    name: 'Keraleeyam Sweets & Bakery',
    nameMl: 'കേരളീയം സ്വീറ്റ്സ് & ബേക്കറി',
    category: 'Food & Bakery',
    categoryMl: 'ഭക്ഷണം & ബേക്കറി',
    location: 'Al Qusais, Dubai',
    rating: 4.6,
    reviews: 278,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80&auto=format&fit=crop',
    logo: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=100&q=80',
    featured: false,
    verified: true,
    tag: 'New',
    tagMl: 'പുതിയത്',
    description: 'Traditional Kerala sweets, halwa, and baked goods. Special orders for events.',
    descriptionMl: 'പരമ്പരാഗത കേരള മധുരങ്ങൾ, ഹൽവ, ബേക്ക്ഡ് ഗുഡ്സ്. ഇവന്റുകൾക്ക് സ്പെഷ്യൽ ഓർഡറുകൾ.',
  },
  {
    id: 5,
    name: 'Gulf Malayali Finance',
    nameMl: 'ഗൾഫ് മലയാളി ഫിനാൻസ്',
    category: 'Finance',
    categoryMl: 'ധനകാര്യം',
    location: 'DIFC, Dubai',
    rating: 4.8,
    reviews: 142,
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80&auto=format&fit=crop',
    logo: 'https://images.unsplash.com/photo-1589519160732-576fc045d8e4?w=100&q=80',
    featured: true,
    verified: true,
    tag: 'Trusted',
    tagMl: 'വിശ്വസ്തം',
    description: 'NRI banking, remittance, insurance and investment advisory services.',
    descriptionMl: 'എൻആർഐ ബാങ്കിംഗ്, റെമിറ്റൻസ്, ഇൻഷുറൻസ്, നിക്ഷേപ ഉപദേശ സേവനങ്ങൾ.',
  },
  {
    id: 6,
    name: 'Trivandrum Tech Solutions',
    nameMl: 'തിരുവനന്തപുരം ടെക് സൊലൂഷൻസ്',
    category: 'Technology',
    categoryMl: 'ടെക്നോളജി',
    location: 'Internet City, Dubai',
    rating: 4.7,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80&auto=format&fit=crop',
    logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&q=80',
    featured: false,
    verified: true,
    tag: 'Verified',
    tagMl: 'വെരിഫൈഡ്',
    description: 'Web development, mobile apps and IT solutions by Malayali engineers.',
    descriptionMl: 'മലയാളി എഞ്ചിനിയർമാർ ചെയ്യുന്ന വെബ് ഡെവലപ്മെന്റ്, മൊബൈൽ ആപ്പ്, ഐടി സൊലൂഷൻ.',
  },
]

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

export default function FeaturedListings() {
  const locale = useLocale()
  const isMl = locale === 'ml'
  const mainFeatured = featured.filter((f) => f.featured)
  const others = featured.filter((f) => !f.featured)

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
              {isMl ? 'മലയാളി കമ്മ്യൂണിറ്റി വിശ്വസിക്കുന്ന പ്രീമിയം ബിസിനസുകൾ' : 'Handpicked premium businesses trusted by the Malayali community'}
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
          {/* Large Feature Card */}
          <div className="lg:col-span-2 lg:row-span-2">
            {mainFeatured[0] && (
              <Link
                href={`/${locale}/company/${mainFeatured[0].id}`}
                className="group block relative overflow-hidden rounded-3xl h-80 lg:h-full min-h-[400px] card-hover"
              >
                <Image
                  src={mainFeatured[0].image}
                  alt={mainFeatured[0].name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="bg-kerala-gold text-white text-xs font-bold px-3 py-1 rounded-full">
                    {isMl ? mainFeatured[0].tagMl : mainFeatured[0].tag}
                  </span>
                  {mainFeatured[0].verified && (
                    <span className="bg-white/20 backdrop-blur text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <BadgeCheck size={11} /> {isMl ? 'വെരിഫൈഡ്' : 'Verified'}
                    </span>
                  )}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="text-kerala-gold-light text-xs font-semibold uppercase tracking-wider mb-2">
                    {isMl ? mainFeatured[0].categoryMl : mainFeatured[0].category}
                  </div>
                  <h3 className="font-serif text-3xl font-bold text-white mb-2">
                    {isMl ? mainFeatured[0].nameMl : mainFeatured[0].name}
                  </h3>
                  <p className="text-white/70 text-sm mb-3 line-clamp-2">
                    {isMl ? mainFeatured[0].descriptionMl : mainFeatured[0].description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <StarRating rating={mainFeatured[0].rating} />
                        <span className="text-white text-sm font-semibold">{mainFeatured[0].rating}</span>
                        <span className="text-white/50 text-xs">({mainFeatured[0].reviews})</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-white/70 text-xs">
                      <MapPin size={12} />
                      {mainFeatured[0].location}
                    </div>
                  </div>
                </div>
              </Link>
            )}
          </div>

          {/* Side Cards */}
          {mainFeatured.slice(1).concat(others).slice(0, 4).map((biz) => (
            <Link
              key={biz.id}
              href={`/${locale}/company/${biz.id}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg card-hover flex flex-col sm:flex-row lg:flex-row gap-0"
            >
              <div className="relative w-full sm:w-32 lg:w-28 h-40 sm:h-auto lg:h-auto flex-shrink-0">
                <Image
                  src={biz.image}
                  alt={biz.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 128px"
                />
                <div className="absolute top-2 left-2">
                  <span className="bg-kerala-green text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {isMl ? biz.tagMl : biz.tag}
                  </span>
                </div>
              </div>
              <div className="p-4 flex flex-col justify-center flex-1">
                <p className="text-kerala-green text-xs font-semibold uppercase tracking-wider mb-1">
                  {isMl ? biz.categoryMl : biz.category}
                </p>
                <h3 className="font-serif text-lg font-bold text-kerala-deep group-hover:text-kerala-green transition-colors leading-snug mb-1">
                  {isMl ? biz.nameMl : biz.name}
                </h3>
                <p className="text-gray-500 text-xs line-clamp-2 mb-2">
                  {isMl ? biz.descriptionMl : biz.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <StarRating rating={biz.rating} />
                    <span className="text-gray-700 text-xs font-semibold">{biz.rating}</span>
                    <span className="text-gray-400 text-xs">({biz.reviews})</span>
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
