'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useLocale } from 'next-intl'
import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { getCategoryCounts } from '@/lib/listings'

const categories = [
  { slug: 'restaurants-food',       name: 'Restaurants & Food',        nameMl: 'റസ്റ്റോറന്റ് & ഭക്ഷണം',        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80&auto=format&fit=crop' },
  { slug: 'catering-bakery',        name: 'Catering & Bakery',         nameMl: 'കേറ്ററിംഗ് & ബേക്കറി',         image: 'https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?w=600&q=80&auto=format&fit=crop' },
  { slug: 'grocery-supermarket',    name: 'Grocery & Supermarket',     nameMl: 'ഗ്രോസറി & സൂപ്പർമാർക്കറ്റ്',  image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80&auto=format&fit=crop' },
  { slug: 'healthcare-medical',     name: 'Clinics & Healthcare',      nameMl: 'ക്ലിനിക്ക് & ആരോഗ്യം',         image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=600&q=80&auto=format&fit=crop' },
  { slug: 'pharmacy',               name: 'Pharmacy',                  nameMl: 'ഫാർമസി',                        image: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=600&q=80&auto=format&fit=crop' },
  { slug: 'real-estate',            name: 'Real Estate',               nameMl: 'റിയൽ എസ്റ്റേറ്റ്',             image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80&auto=format&fit=crop' },
  { slug: 'business-setup',         name: 'Business Setup & PRO',      nameMl: 'ബിസിനസ് സെറ്റപ്പ്',            image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80&auto=format&fit=crop' },
  { slug: 'audit-accounting',       name: 'Audit & Accounting',        nameMl: 'ഓഡിറ്റ് & അക്കൗണ്ടിംഗ്',     image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80&auto=format&fit=crop' },
  { slug: 'legal-finance',          name: 'Legal & Finance',           nameMl: 'നിയമം & ഫിനാൻസ്',              image: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=600&q=80&auto=format&fit=crop' },
  { slug: 'money-exchange',         name: 'Money Exchange',            nameMl: 'മണി എക്സ്ചേഞ്ച്',             image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=600&q=80&auto=format&fit=crop' },
  { slug: 'manpower-recruitment',   name: 'Manpower & Recruitment',    nameMl: 'മാൻപവർ & റിക്രൂട്ട്മെന്റ്',  image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&q=80&auto=format&fit=crop' },
  { slug: 'events-entertainment',   name: 'Events & Entertainment',    nameMl: 'ഇവന്റ്സ് & എന്റർടൈൻമെന്റ്',  image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80&auto=format&fit=crop' },
  { slug: 'beauty-wellness',        name: 'Beauty & Wellness',         nameMl: 'സൗന്ദര്യം & ആരോഗ്യം',         image: 'https://images.unsplash.com/photo-1607008829749-c0f284a49fc4?w=600&q=80&auto=format&fit=crop' },
  { slug: 'cleaning-services',      name: 'Cleaning Services',         nameMl: 'ക്ലീനിംഗ് സർവ്വീസസ്',         image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80&auto=format&fit=crop' },
  { slug: 'technical-services',     name: 'Technical Services',        nameMl: 'ടെക്നിക്കൽ സർവ്വീസസ്',        image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&q=80&auto=format&fit=crop' },
  { slug: 'construction-interiors', name: 'Construction & Interiors',  nameMl: 'നിർമ്മാണം & ഇന്റീരിയർ',       image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80&auto=format&fit=crop' },
  { slug: 'technology-it',          name: 'Technology & IT',           nameMl: 'ടെക്നോളജി & ഐടി',              image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80&auto=format&fit=crop' },
  { slug: 'education-training',     name: 'Education & Training',      nameMl: 'വിദ്യാഭ്യാസം & പരിശീലനം',     image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80&auto=format&fit=crop' },
  { slug: 'travel-tourism',         name: 'Travel & Tourism',          nameMl: 'ടൂറിസം & യാത്ര',               image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=80&auto=format&fit=crop' },
  { slug: 'cargo-logistics',        name: 'Cargo & Logistics',         nameMl: 'കാർഗോ & ലോജിസ്റ്റിക്സ്',      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&q=80&auto=format&fit=crop' },
  { slug: 'automotive',             name: 'Automotive',                nameMl: 'ഓട്ടോമോട്ടീവ്',                image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&q=80&auto=format&fit=crop' },
  { slug: 'retail-fashion',         name: 'Retail & Fashion',          nameMl: 'റീടെയ്ൽ & ഫാഷൻ',               image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&q=80&auto=format&fit=crop' },
]

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace('.0', '')}k+`
  if (n > 0) return `${n}+`
  return ''
}

export default function CategoryGrid() {
  const locale = useLocale()
  const isMl = locale === 'ml'
  const [counts, setCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    getCategoryCounts().then(setCounts)
  }, [])

  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-kerala-green font-semibold text-sm uppercase tracking-widest mb-2">
              {isMl ? 'വിഭാഗങ്ങൾ' : 'Categories'}
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-kerala-deep">
              {isMl ? 'വിഭാഗങ്ങൾ പര്യവേക്ഷണം ചെയ്യൂ' : 'Explore Categories'}
            </h2>
            <p className="text-gray-500 mt-2">
              {isMl
                ? 'എല്ലാ വിഭാഗങ്ങളിലെ ബിസിനസുകളും കണ്ടെത്തൂ'
                : 'Discover businesses and services across all categories'}
            </p>
          </div>
          <Link
            href={`/directory`}
            className="flex items-center gap-2 text-kerala-green hover:text-kerala-green-light font-semibold text-sm border border-kerala-green/30 hover:border-kerala-green px-4 py-2 rounded-lg transition-all whitespace-nowrap"
          >
            {isMl ? 'എല്ലാ വിഭാഗങ്ങളും' : 'All Categories'}
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {categories.map((cat) => {
            const count = counts[cat.slug]
            const countLabel = count != null ? formatCount(count) : ''
            return (
              <Link
                key={cat.slug}
                href={`/directory?category=${cat.slug}`}
                className="group relative overflow-hidden rounded-2xl aspect-square card-hover"
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h3 className="text-white font-semibold text-sm leading-tight mb-0.5">
                    {isMl ? cat.nameMl : cat.name}
                  </h3>
                  {countLabel && (
                    <span className="text-white/60 text-xs">{countLabel}</span>
                  )}
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-kerala-green/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
