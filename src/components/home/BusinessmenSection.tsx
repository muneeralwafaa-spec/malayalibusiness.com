'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { BadgeCheck, MapPin, ArrowRight, Award, Building2, Users } from 'lucide-react'

const FEATURED_BUSINESSMEN = [
  {
    username: 'rajannair',
    name: 'Rajan Nair',
    nameMl: 'രാജൻ നായർ',
    title: 'Chairman & Founder',
    titleMl: 'ചെയർമാൻ & സ്ഥാപകൻ',
    company: 'Nair Group of Companies',
    companyMl: 'നായർ ഗ്രൂപ്പ്',
    industry: 'Real Estate',
    industryMl: 'റിയൽ എസ്റ്റേറ്റ്',
    emirate: 'Dubai',
    emirateMl: 'ദുബായ്',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80&auto=format&fit=crop&crop=faces',
    cover: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80&auto=format&fit=crop',
    stats: { businesses: 6, employees: '500+', years: 22 },
    badge: 'Forbes ME Top 50',
    badgeMl: 'ഫോർബ്സ് ME ടോപ് 50',
    verified: true,
    featured: true,
  },
  {
    username: 'sureshmenon',
    name: 'Suresh Menon',
    nameMl: 'സുരേഷ് മേനോൻ',
    title: 'Managing Director',
    titleMl: 'മാനേജിംഗ് ഡയറക്ടർ',
    company: 'Menon Healthcare Group',
    companyMl: 'മേനോൻ ഹെൽത്ത്കെയർ',
    industry: 'Healthcare',
    industryMl: 'ആരോഗ്യം',
    emirate: 'Abu Dhabi',
    emirateMl: 'അബുദാബി',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80&auto=format&fit=crop&crop=faces',
    cover: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80&auto=format&fit=crop',
    stats: { businesses: 8, employees: '1,200+', years: 18 },
    badge: 'UAE Healthcare Award',
    badgeMl: 'UAE ഹെൽത്ത് അവാർഡ്',
    verified: true,
    featured: true,
  },
  {
    username: 'priyakrishna',
    name: 'Priya Krishna',
    nameMl: 'പ്രിയ കൃഷ്ണ',
    title: 'CEO & Co-Founder',
    titleMl: 'CEO & സഹ-സ്ഥാപക',
    company: 'TechVista Solutions',
    companyMl: 'ടെക്‌വിസ്റ്റ സൊലൂഷൻസ്',
    industry: 'Technology',
    industryMl: 'ടെക്നോളജി',
    emirate: 'Dubai',
    emirateMl: 'ദുബായ്',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80&auto=format&fit=crop&crop=faces',
    cover: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80&auto=format&fit=crop',
    stats: { businesses: 3, employees: '350+', years: 12 },
    badge: 'Gulf Women in Tech',
    badgeMl: 'ഗൾഫ് വിമൻ ഇൻ ടെക്',
    verified: true,
    featured: true,
  },
  {
    username: 'abrahampillai',
    name: 'Abraham Pillai',
    nameMl: 'എബ്രഹാം പിള്ള',
    title: 'Group Chairman',
    titleMl: 'ഗ്രൂപ്പ് ചെയർമാൻ',
    company: 'Pillai Trading Corporation',
    companyMl: 'പിള്ള ട്രേഡിംഗ്',
    industry: 'Finance & Trade',
    industryMl: 'ധനകാര്യം',
    emirate: 'Sharjah',
    emirateMl: 'ഷാർജ',
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80&auto=format&fit=crop&crop=faces',
    cover: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80&auto=format&fit=crop',
    stats: { businesses: 12, employees: '2,000+', years: 28 },
    badge: 'Pravasi Ratna Award',
    badgeMl: 'പ്രവാസി രത്ന അവാർഡ്',
    verified: true,
    featured: false,
  },
]

export default function BusinessmenSection() {
  const locale = useLocale()
  const isMl = locale === 'ml'

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-kerala-gold/10 border border-kerala-gold/20 text-kerala-gold text-xs font-semibold px-3 py-1.5 rounded-full mb-3">
              <Award size={12} />
              {isMl ? 'മലയാളി ബിസിനസ് നേതാക്കൾ' : 'Malayali Business Leaders'}
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-kerala-deep">
              {isMl ? 'പ്രമുഖ സംരംഭകർ' : 'Prominent Entrepreneurs'}
            </h2>
            <p className="text-gray-500 mt-2 text-sm max-w-lg">
              {isMl
                ? 'UAE-ൽ കേരളത്തിന്റെ അഭിമാനം ഉയർത്തിപ്പിടിക്കുന്ന ബിസിനസ് ഐക്കണുകൾ'
                : 'Business icons who carry Kerala\'s pride across the UAE and beyond'}
            </p>
          </div>
          <Link
            href={`/${locale}/businessmen`}
            className="flex items-center gap-2 text-kerala-green hover:text-kerala-green-light font-semibold text-sm transition-colors group"
          >
            {isMl ? 'എല്ലാവരെയും കാണൂ' : 'View All Leaders'}
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURED_BUSINESSMEN.map((person) => (
            <Link
              key={person.username}
              href={`/${locale}/owner/${person.username}`}
              className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-kerala-green/20 transition-all duration-300"
            >
              {/* Cover image */}
              <div className="relative h-24 overflow-hidden">
                <Image
                  src={person.cover}
                  alt=""
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/50" />
                {/* Award badge */}
                <div className="absolute top-2 left-2 bg-kerala-gold/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Award size={9} />
                  {isMl ? person.badgeMl : person.badge}
                </div>
              </div>

              {/* Profile photo */}
              <div className="relative px-4 pb-4">
                <div className="relative -mt-8 mb-3">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-3 border-white shadow-lg ring-2 ring-kerala-green/20">
                    <Image
                      src={person.photo}
                      alt={person.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {person.verified && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-kerala-green rounded-full flex items-center justify-center shadow">
                      <BadgeCheck size={12} className="text-white" />
                    </div>
                  )}
                </div>

                {/* Name & title */}
                <h3 className={`font-bold text-kerala-deep leading-tight mb-0.5 group-hover:text-kerala-green transition-colors ${isMl ? 'font-malayalam text-base' : 'text-base'}`}>
                  {isMl ? person.nameMl : person.name}
                </h3>
                <p className={`text-xs text-gray-400 mb-1 ${isMl ? 'font-malayalam' : ''}`}>
                  {isMl ? person.titleMl : person.title}
                </p>
                <p className="text-xs font-semibold text-kerala-green mb-3 flex items-center gap-1">
                  <Building2 size={10} />
                  {isMl ? person.companyMl : person.company}
                </p>

                {/* Location & industry */}
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className="text-[10px] text-gray-400 flex items-center gap-1">
                    <MapPin size={9} /> {isMl ? person.emirateMl : person.emirate}
                  </span>
                  <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                    {isMl ? person.industryMl : person.industry}
                  </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-1 pt-3 border-t border-gray-100">
                  <div className="text-center">
                    <p className="font-bold text-kerala-deep text-sm">{person.stats.businesses}</p>
                    <p className="text-[10px] text-gray-400">{isMl ? 'ബിസിനസ്' : 'Biz'}</p>
                  </div>
                  <div className="text-center border-x border-gray-100">
                    <p className="font-bold text-kerala-deep text-sm">{person.stats.employees}</p>
                    <p className="text-[10px] text-gray-400">{isMl ? 'ജീവനക്കാർ' : 'Staff'}</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-kerala-deep text-sm">{person.stats.years}yr</p>
                    <p className="text-[10px] text-gray-400">{isMl ? 'വർഷം' : 'Exp'}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA strip */}
        <div className="mt-10 bg-gradient-to-r from-kerala-green/5 via-kerala-gold/5 to-kerala-green/5 border border-kerala-green/10 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Stacked photos */}
            <div className="flex -space-x-2">
              {FEATURED_BUSINESSMEN.slice(0, 4).map((p, i) => (
                <div key={i} className="relative w-9 h-9 rounded-full border-2 border-white overflow-hidden shadow">
                  <Image src={p.photo} alt="" fill className="object-cover" />
                </div>
              ))}
            </div>
            <div>
              <p className="font-semibold text-kerala-deep text-sm">
                {isMl ? '500+ മലയാളി ബിസിനസ് ലീഡർമാർ' : '500+ Malayali Business Leaders'}
              </p>
              <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                <Users size={10} />
                {isMl ? 'UAE-ലുടനീളം' : 'Across all UAE emirates'}
              </p>
            </div>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link
              href={`/${locale}/businessmen`}
              className="bg-kerala-green text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-kerala-green-light transition-colors"
            >
              {isMl ? 'എല്ലാ ലീഡർമാർ' : 'Browse All Leaders'}
            </Link>
            <Link
              href={`/${locale}/auth`}
              className="border border-kerala-green text-kerala-green px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-kerala-green/5 transition-colors"
            >
              {isMl ? 'നിങ്ങളുടെ പ്രൊഫൈൽ ചേർക്കൂ' : 'Add Your Profile'}
            </Link>
          </div>
        </div>

      </div>
    </section>
  )
}
