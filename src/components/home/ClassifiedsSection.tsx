'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { Clock, MapPin, ArrowRight, Plus } from 'lucide-react'

const classifieds = [
  {
    id: 1,
    title: '2021 Toyota Camry — Excellent Condition',
    titleMl: '2021 ടൊയോട്ട കാമ്രി — മികച്ച അവസ്ഥ',
    category: 'For Sale',
    categoryMl: 'വിൽക്കാനുണ്ട്',
    price: 'AED 58,000',
    location: 'Dubai',
    posted: '2 hours ago',
    postedMl: '2 മണിക്കൂർ മുൻപ്',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400&q=80&auto=format&fit=crop',
    catColor: 'bg-blue-100 text-blue-700',
  },
  {
    id: 2,
    title: '2BHK Apartment for Rent — Al Nahda',
    titleMl: '2BHK ഫ്ലാറ്റ് വാടകയ്ക്ക് — അൽ നഹ്ദ',
    category: 'For Rent',
    categoryMl: 'വാടകയ്ക്ക്',
    price: 'AED 42,000/yr',
    location: 'Sharjah',
    posted: '5 hours ago',
    postedMl: '5 മണിക്കൂർ മുൻപ്',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&q=80&auto=format&fit=crop',
    catColor: 'bg-green-100 text-green-700',
  },
  {
    id: 3,
    title: 'iPhone 15 Pro Max 256GB — Barely Used',
    titleMl: 'iPhone 15 Pro Max 256GB — ഏറ്റവും കുറഞ്ഞ ഉപയോഗം',
    category: 'For Sale',
    categoryMl: 'വിൽക്കാനുണ്ട്',
    price: 'AED 3,800',
    location: 'Abu Dhabi',
    posted: '1 day ago',
    postedMl: '1 ദിവസം മുൻപ്',
    image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=400&q=80&auto=format&fit=crop',
    catColor: 'bg-blue-100 text-blue-700',
  },
  {
    id: 4,
    title: 'Looking for Malayalam-Speaking Nanny',
    titleMl: 'മലയാളം സംസാരിക്കുന്ന ആയ ആവശ്യമുണ്ട്',
    category: 'Wanted',
    categoryMl: 'ആവശ്യമുണ്ട്',
    price: 'AED 2,500/mo',
    location: 'Dubai',
    posted: '3 hours ago',
    postedMl: '3 മണിക്കൂർ മുൻപ്',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80&auto=format&fit=crop',
    catColor: 'bg-yellow-100 text-yellow-700',
  },
  {
    id: 5,
    title: 'Kerala Homemade Pickles & Pappadam — Bulk Orders',
    titleMl: 'കേരള ഹോം മെയ്ഡ് അച്ചാർ & പപ്പടം — ബൾക്ക് ഓർഡർ',
    category: 'For Sale',
    categoryMl: 'വിൽക്കാനുണ്ട്',
    price: 'Negotiable',
    location: 'Ajman',
    posted: '6 hours ago',
    postedMl: '6 മണിക്കൂർ മുൻപ്',
    image: 'https://images.unsplash.com/photo-1564894809611-1742fc40ed80?w=400&q=80&auto=format&fit=crop',
    catColor: 'bg-blue-100 text-blue-700',
  },
  {
    id: 6,
    title: 'Office Space Available in Business Bay',
    titleMl: 'ബിസിനസ് ബേയിൽ ഓഫീസ് സ്ഥലം ലഭ്യം',
    category: 'For Rent',
    categoryMl: 'വാടകയ്ക്ക്',
    price: 'AED 6,500/mo',
    location: 'Dubai',
    posted: '12 hours ago',
    postedMl: '12 മണിക്കൂർ മുൻപ്',
    image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&q=80&auto=format&fit=crop',
    catColor: 'bg-green-100 text-green-700',
  },
]

export default function ClassifiedsSection() {
  const locale = useLocale()
  const isMl = locale === 'ml'

  return (
    <section className="bg-kerala-cream py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-kerala-orange font-semibold text-sm uppercase tracking-widest mb-2">
              {isMl ? 'ക്ലാസിഫൈഡ്സ്' : 'Classifieds'}
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-semibold text-kerala-deep">
              {isMl ? 'ഏറ്റവും പുതിയ ക്ലാസിഫൈഡ്സ്' : 'Latest Classifieds'}
            </h2>
            <p className="text-gray-500 mt-2">
              {isMl ? 'മലയാളി കമ്മ്യൂണിറ്റിക്കുള്ളിൽ വാങ്ങൂ, വിൽക്കൂ' : 'Buy, sell, rent within the Malayali community'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/${locale}/classifieds/new`}
              className="flex items-center gap-2 bg-kerala-orange text-white font-semibold text-sm px-4 py-2.5 rounded-lg hover:opacity-90 transition-all whitespace-nowrap"
            >
              <Plus size={16} />
              {isMl ? 'പരസ്യം ഇടൂ' : 'Post Ad'}
            </Link>
            <Link
              href={`/${locale}/classifieds`}
              className="flex items-center gap-2 border border-gray-300 text-gray-700 hover:border-kerala-green hover:text-kerala-green font-semibold text-sm px-4 py-2.5 rounded-lg transition-all whitespace-nowrap"
            >
              {isMl ? 'എല്ലാം കാണൂ' : 'View All'}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Classifieds Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {classifieds.map((item) => (
            <Link
              key={item.id}
              href={`/${locale}/classifieds/${item.id}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg card-hover border border-gray-100"
            >
              {/* Image */}
              <div className="relative h-44 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute top-3 left-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${item.catColor}`}>
                    {isMl ? item.categoryMl : item.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-kerala-deep text-sm leading-snug group-hover:text-kerala-green transition-colors mb-2 line-clamp-2">
                  {isMl ? item.titleMl : item.title}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-kerala-green font-bold text-base">{item.price}</span>
                </div>
                <div className="flex items-center gap-3 mt-2 text-gray-400 text-xs">
                  <span className="flex items-center gap-1">
                    <MapPin size={11} />
                    {item.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={11} />
                    {isMl ? item.postedMl : item.posted}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
