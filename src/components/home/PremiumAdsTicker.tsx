'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useLocale } from 'next-intl'
import { Megaphone } from 'lucide-react'

const ads = [
  {
    id: 1,
    title: 'Al Noor Medical Centre — Free Blood Sugar Test This Weekend',
    titleMl: 'അൽ നൂർ മെഡിക്കൽ — ഈ വാരാന്ത്യം സൗജന്യ ബ്ലഡ് ഷുഗർ ടെസ്റ്റ്',
    logo: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=80&q=80',
    href: '#',
    tag: 'HEALTH',
  },
  {
    id: 2,
    title: 'Kerala Kitchen — Grand Opening Sale 30% Off All Dishes',
    titleMl: 'കേരള കിച്ചൺ — ഗ്രാൻഡ് ഓപ്പണിംഗ് 30% ഓഫ്',
    logo: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=80&q=80',
    href: '#',
    tag: 'FOOD',
  },
  {
    id: 3,
    title: 'Gulf Malayali Finance — 0% Commission on Money Transfer to Kerala',
    titleMl: 'ഗൾഫ് മലയാളി ഫിനാൻസ് — കേരളത്തിലേക്ക് പണം അയക്കൂ 0% കമ്മീഷൻ',
    logo: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=80&q=80',
    href: '#',
    tag: 'FINANCE',
  },
  {
    id: 4,
    title: 'Kozhikode Sarees — New Arrivals: Kasavu and Kanjivaram Collections',
    titleMl: 'കോഴിക്കോട് സാരീസ് — കസവ്, കാഞ്ചിവരം ന്യൂ കലക്ഷൻ',
    logo: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=80&q=80',
    href: '#',
    tag: 'FASHION',
  },
  {
    id: 5,
    title: 'Trivandrum Tutors — CBSE & ICSE Home Tutors Across UAE',
    titleMl: 'തിരുവനന്തപുരം ടുട്ടേഴ്സ് — യുഎഇ മുഴുവൻ ഹോം ട്യൂഷൻ',
    logo: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=80&q=80',
    href: '#',
    tag: 'EDUCATION',
  },
  {
    id: 6,
    title: 'MK Builders — Turnkey Villa Construction in Kerala Starting AED 85,000',
    titleMl: 'എംകെ ബിൽഡേഴ്സ് — കേരളത്തിൽ വില്ല നിർമ്മാണം AED 85,000 മുതൽ',
    logo: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=80&q=80',
    href: '#',
    tag: 'REAL ESTATE',
  },
]

const tagColors: Record<string, string> = {
  HEALTH: 'bg-red-100 text-red-700',
  FOOD: 'bg-orange-100 text-orange-700',
  FINANCE: 'bg-blue-100 text-blue-700',
  FASHION: 'bg-pink-100 text-pink-700',
  EDUCATION: 'bg-purple-100 text-purple-700',
  'REAL ESTATE': 'bg-green-100 text-green-700',
}

export default function PremiumAdsTicker() {
  const locale = useLocale()
  const isMl = locale === 'ml'

  // Duplicate ads for infinite scroll
  const doubled = [...ads, ...ads]

  return (
    <section className="bg-kerala-deep py-8 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-4 flex items-center gap-3">
        <div className="flex items-center gap-2 bg-kerala-gold text-white text-xs font-bold px-3 py-1.5 rounded-full flex-shrink-0">
          <Megaphone size={13} />
          {isMl ? 'പ്രീമിയം പരസ്യങ്ങൾ' : 'PREMIUM ADS'}
        </div>
        <div className="h-px bg-white/10 flex-1" />
        <Link
          href={`/${locale}/dashboard`}
          className="text-kerala-gold-light hover:text-kerala-gold text-xs font-medium flex-shrink-0 transition-colors"
        >
          {isMl ? 'ഇവിടെ പരസ്യം ചെയ്യൂ →' : 'Advertise Here →'}
        </Link>
      </div>

      {/* Ticker */}
      <div className="ticker-wrapper">
        <div className="ticker-content flex items-center gap-6 px-4">
          {doubled.map((ad, i) => (
            <Link
              key={`${ad.id}-${i}`}
              href={ad.href}
              className="flex-shrink-0 flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-3 transition-all group min-w-[320px] max-w-sm"
            >
              <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={ad.logo}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${tagColors[ad.tag] || 'bg-gray-100 text-gray-600'} inline-block mb-1`}>
                  {ad.tag}
                </span>
                <p className="text-white/80 text-xs leading-snug line-clamp-2 group-hover:text-white transition-colors">
                  {isMl ? ad.titleMl : ad.title}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
