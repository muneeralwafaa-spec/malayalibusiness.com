'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useLocale } from 'next-intl'
import { MapPin } from 'lucide-react'

const emirates = [
  {
    name: 'Dubai',
    nameMl: 'ദുബായ്',
    count: '8,200+',
    slug: 'dubai',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&q=80&auto=format&fit=crop',
    color: 'from-blue-900/80',
  },
  {
    name: 'Abu Dhabi',
    nameMl: 'അബുദാബി',
    count: '3,100+',
    slug: 'abu-dhabi',
    image: 'https://images.unsplash.com/photo-1579820010410-c10411aaaa88?w=400&q=80&auto=format&fit=crop',
    color: 'from-emerald-900/80',
  },
  {
    name: 'Sharjah',
    nameMl: 'ഷാർജ',
    count: '2,400+',
    slug: 'sharjah',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&q=80&auto=format&fit=crop',
    color: 'from-purple-900/80',
  },
  {
    name: 'Ajman',
    nameMl: 'അജ്മാൻ',
    count: '640+',
    slug: 'ajman',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80&auto=format&fit=crop',
    color: 'from-orange-900/80',
  },
  {
    name: 'Ras Al Khaimah',
    nameMl: 'റാസ് അൽ ഖൈമ',
    count: '420+',
    slug: 'ras-al-khaimah',
    image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&q=80&auto=format&fit=crop',
    color: 'from-red-900/80',
  },
  {
    name: 'Fujairah',
    nameMl: 'ഫുജൈറ',
    count: '280+',
    slug: 'fujairah',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80&auto=format&fit=crop',
    color: 'from-teal-900/80',
  },
  {
    name: 'Umm Al Quwain',
    nameMl: 'ഉം അൽ ഖുവൈൻ',
    count: '120+',
    slug: 'umm-al-quwain',
    image: 'https://images.unsplash.com/photo-1561501900-3701fa6a0864?w=400&q=80&auto=format&fit=crop',
    color: 'from-indigo-900/80',
  },
]

export default function LocationStrip() {
  const locale = useLocale()
  const isMl = locale === 'ml'

  return (
    <section className="bg-kerala-cream py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-kerala-deep">
              {isMl ? 'എമിറേറ്റ് അനുസരിച്ച് തിരയൂ' : 'Browse by Emirate'}
            </h2>
            <p className="text-gray-500 text-sm mt-1 font-malayalam">
              {isMl ? 'എല്ലാ 7 എമിറേറ്റുകളിലും ബിസിനസുകൾ' : 'ഏഴ് എമിറേറ്റുകളിലും ബിസിനസുകൾ'}
            </p>
          </div>
          <Link
            href={`/${locale}/directory`}
            className="text-kerala-green hover:text-kerala-green-light text-sm font-semibold flex items-center gap-1"
          >
            {isMl ? 'എല്ലാം കാണൂ' : 'View All'} →
          </Link>
        </div>

        {/* Emirates Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {emirates.map((emirate) => (
            <Link
              key={emirate.slug}
              href={`/${locale}/directory?location=${emirate.slug}`}
              className="group relative overflow-hidden rounded-xl aspect-[3/4] sm:aspect-square card-hover"
            >
              <Image
                src={emirate.image}
                alt={emirate.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 14vw"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${emirate.color} to-transparent`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <div className="flex items-center gap-1 mb-0.5">
                  <MapPin size={11} className="text-kerala-gold flex-shrink-0" />
                  <span className="text-white font-semibold text-xs leading-tight">
                    {isMl ? emirate.nameMl : emirate.name}
                  </span>
                </div>
                <span className="text-white/70 text-xs">{emirate.count}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
