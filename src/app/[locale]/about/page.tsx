'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

import { useLocale } from 'next-intl'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import {
  Users,
  ShieldCheck,
  Star,
  Mail,
  MapPin,
  Send,
  Newspaper,
} from 'lucide-react'

// ─── STATS ───────────────────────────────────────────────────────────────────
const STATS = [
  { value: 15000, label: 'Businesses Listed', labelMl: 'ബിസിനസ് ലിസ്റ്റ്', suffix: '+' },
  { value: 3500000, label: 'Malayalis Reached', labelMl: 'മലയാളികൾ', suffix: '+', short: '3.5M' },
  { value: 7, label: 'Emirates Covered', labelMl: 'എമിറേറ്റ്സ്', suffix: '' },
  { value: 50000, label: 'Reviews Posted', labelMl: 'അഭിപ്രായങ്ങൾ', suffix: '+' },
]

function formatStat(value: number, current: number, suffix: string, short?: string): string {
  if (short && value >= 1000000) {
    const pct = current / value
    const num = (3.5 * pct).toFixed(1)
    return `${num}M${suffix}`
  }
  if (value >= 10000) {
    return `${Math.floor(current / 1000)}k${suffix}`
  }
  return `${current}${suffix}`
}

// ─── TEAM ────────────────────────────────────────────────────────────────────
const TEAM = [
  {
    name: 'Anoop Krishnan', nameMl: 'അനൂപ് കൃഷ്ണൻ',
    role: 'Founder & CEO', roleMl: 'ഫൗണ്ടർ & CEO',
    bio: 'Serial entrepreneur with 15 years in UAE. Former tech lead at Noon.',
    bioMl: 'UAE-ൽ 15 വർഷത്തെ അനുഭവം. Noon-ൽ മുൻ ടെക് ലീഡ്.',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80&auto=format&fit=crop&face',
  },
  {
    name: 'Divya Menon', nameMl: 'ദിവ്യ മേനോൻ',
    role: 'Co-Founder & CTO', roleMl: 'കോ-ഫൗണ്ടർ & CTO',
    bio: 'Full-stack engineer. Built scalable products at Amazon and Careem.',
    bioMl: 'Amazon, Careem-ൽ സ്കേലബിൾ പ്രൊഡക്ടുകൾ നിർമ്മിച്ചു.',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80&auto=format&fit=crop&face',
  },
  {
    name: 'Rahul Nair', nameMl: 'രാഹുൽ നായർ',
    role: 'Head of Community', roleMl: 'കമ്മ്യൂണിറ്റി ഹെഡ്',
    bio: 'Community organiser for 10+ UAE Malayali associations.',
    bioMl: '10+ UAE Malayali അസോസിയേഷൻ ഓർഗനൈസർ.',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80&auto=format&fit=crop&face',
  },
  {
    name: 'Sruthi Pillai', nameMl: 'ശ്രുതി പിള്ള',
    role: 'Marketing Director', roleMl: 'മാർക്കറ്റിംഗ് ഡയറക്ടർ',
    bio: 'Digital marketing expert with expertise in Gulf diaspora brands.',
    bioMl: 'Gulf diaspora ബ്രാൻഡുകളിൽ ഡിജിറ്റൽ മാർക്കറ്റിംഗ് വിദഗ്ദ്ധ.',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80&auto=format&fit=crop&face',
  },
  {
    name: 'Jijo Varghese', nameMl: 'ജിജോ വർഗ്ഗീസ്',
    role: 'Business Development', roleMl: 'ബിസിനസ് ഡെവലപ്‌മെന്റ്',
    bio: 'Partnerships lead. Grew network to 15,000+ listed businesses.',
    bioMl: 'പാർട്ണർഷിപ്പ് ലീഡ്. 15,000+ ലിസ്റ്റഡ് ബിസിനസ് നെറ്റ്‌വർക്ക്.',
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80&auto=format&fit=crop&face',
  },
  {
    name: 'Lekha Suresh', nameMl: 'ലേഖ സുരേഷ്',
    role: 'Customer Success', roleMl: 'ഉപഭോക്തൃ വിജയം',
    bio: 'Ensuring every business owner succeeds on our platform.',
    bioMl: 'എല്ലാ ബിസിനസ് ഉടമകളും വിജയിക്കുന്നത് ഉറപ്പ് വരുത്തുന്നു.',
    photo: 'https://images.unsplash.com/photo-1598550874175-4d0ef436c909?w=400&q=80&auto=format&fit=crop&face',
  },
]

const MILESTONES = [
  { year: '2018', event: 'Founded in Dubai', eventMl: 'ദുബായിൽ സ്ഥാപിതം', desc: 'Started as a small WhatsApp directory for Malayali businesses in Dubai.' },
  { year: '2020', event: '1,000 Listings', eventMl: '1,000 ലിസ്റ്റിംഗ്', desc: 'Reached our first major milestone despite the pandemic.' },
  { year: '2022', event: 'Mobile App Launch', eventMl: 'മൊബൈൽ ആപ്പ്', desc: 'Launched iOS and Android apps, doubling monthly active users.' },
  { year: '2023', event: '50,000 Users', eventMl: '50,000 ഉപഭോക്താക്കൾ', desc: 'Community grew to 50,000 registered users across all 7 Emirates.' },
  { year: '2025', event: 'Premium Launch', eventMl: 'പ്രീമിയം ലോഞ്ച്', desc: 'Launched Premium plans, Shop module, and verified business badges.' },
]

const VALUES = [
  {
    icon: Users,
    title: 'Community First',
    titleMl: 'കമ്മ്യൂണിറ്റി ആദ്യം',
    desc: 'Every feature we build starts with a single question: does this help the Malayali community in UAE thrive?',
    descMl: 'UAE-ലെ Malayali കമ്മ്യൂണിറ്റിക്ക് ഇത് ഗുണം ചെയ്യുമോ എന്ന ചോദ്യത്തിൽ നിന്ന്.',
  },
  {
    icon: ShieldCheck,
    title: 'Transparency',
    titleMl: 'സുതാര്യത',
    desc: 'No hidden fees. No fake reviews. Every verified badge is earned, not bought.',
    descMl: 'മറഞ്ഞ ഫീസ് ഇല്ല. വ്യാജ അഭിപ്രായങ്ങൾ ഇല്ല. ഓരോ ബാഡ്ജും അർഹതയിലൂടെ.',
  },
  {
    icon: Star,
    title: 'Excellence',
    titleMl: 'മികവ്',
    desc: 'We hold ourselves and every listed business to the highest standard of quality and service.',
    descMl: 'ഞങ്ങളും ലിസ്റ്റ് ചെയ്ത ഓരോ ബിസിനസും ഏറ്റവും ഉയർന്ന നിലവാരത്തിൽ.',
  },
]

const PRESS = ['Gulf News', 'Khaleej Times', 'Mathrubhumi', 'Malayala Manorama', 'Forbes ME']

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────
export default function AboutPage() {
  const locale = useLocale()
  const isMl = locale === 'ml'

  const [counts, setCounts] = useState<number[]>(STATS.map(() => 0))
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setStarted(true)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!started) return
    const duration = 2000
    const steps = 60
    const interval = duration / steps
    let step = 0

    const id = setInterval(() => {
      step++
      const pct = step / steps
      const eased = 1 - Math.pow(1 - pct, 3)
      setCounts(STATS.map(s => Math.round(s.value * eased)))
      if (step >= steps) clearInterval(id)
    }, interval)

    return () => clearInterval(id)
  }, [started])

  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' })

  return (
    <main className="min-h-screen bg-kerala-cream">
      <Navbar />

      {/* ── SECTION 1: HERO ─────────────────────────────────────────────────── */}
      <section className="bg-kerala-deep pt-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block bg-kerala-gold/20 text-kerala-gold-light text-xs font-bold px-4 py-1.5 rounded-full tracking-wider uppercase mb-5">
              {isMl ? 'ഞങ്ങളെ കുറിച്ച്' : 'About Us'}
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
              {isMl
                ? 'UAE-ൽ #1 Malayali ബിസിനസ് നെറ്റ്‌വർക്കിന്റെ കഥ'
                : "The Story Behind UAE's #1 Malayali Business Network"}
            </h1>
            <p className="text-white/70 text-base leading-relaxed mb-6">
              {isMl
                ? '2018-ൽ Dubai-ൽ ആരംഭിച്ച MalayaliBusiness, UAE-ൽ ഉടനീളം Malayali സംരംഭകരെ ബന്ധിപ്പിക്കുന്ന ഡിജിറ്റൽ ഹോമാണ്. ഞങ്ങളുടെ ദൗത്യം: ഓരോ Malayali ബിസിനസും അർഹമായ ദൃശ്യത നേടുന്നത് ഉറപ്പ് വരുത്തൽ.'
                : 'Founded in Dubai in 2018, MalayaliBusiness is the digital home connecting Malayali entrepreneurs across the UAE. Our mission: ensuring every Malayali business gets the visibility it deserves.'}
            </p>
            <div className="flex items-center gap-2 text-white/50 text-sm">
              <MapPin size={14} className="text-kerala-gold-light flex-shrink-0" />
              {isMl ? 'ദുബായ്, UAE — 2018 മുതൽ' : 'Dubai, UAE — Est. 2018'}
            </div>
          </div>
          <div className="relative h-72 lg:h-96 rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80&auto=format&fit=crop"
              alt="MalayaliBusiness team"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-kerala-deep/60 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <p className="font-semibold text-sm">MalayaliBusiness Team</p>
              <p className="text-white/60 text-xs">{isMl ? 'ദുബായ് ഓഫീസ്, 2024' : 'Dubai HQ, 2024'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: TIMELINE ─────────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-kerala-deep mb-2">
              {isMl ? 'ഞങ്ങളുടെ യാത്ര' : 'Our Journey'}
            </h2>
            <p className="text-gray-500 text-sm">
              {isMl ? '2018 മുതൽ 2025 വരെ — ഒരു WhatsApp ഗ്രൂപ്പ് മുതൽ UAE-ൽ #1 ആകുന്നത് വരെ' : 'From a WhatsApp group to UAE\'s #1 Malayali business platform'}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {MILESTONES.map((m, i) => (
              <div key={m.year} className="relative text-center group">
                {i < MILESTONES.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-1/2 w-full h-0.5 bg-gray-200" />
                )}
                <div className="relative z-10 flex flex-col items-center">
                  <span className="font-serif text-3xl font-bold text-kerala-gold mb-2">{m.year}</span>
                  <div className="w-4 h-4 rounded-full bg-kerala-green border-4 border-white shadow-sm mb-3" />
                  <h3 className="font-bold text-kerala-deep text-sm mb-1">{isMl ? m.eventMl : m.event}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 3: STATS ────────────────────────────────────────────────── */}
      <section className="bg-kerala-deep py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map((stat, i) => (
              <div key={stat.label} className="text-center">
                <div className="font-serif text-4xl md:text-5xl font-bold text-kerala-gold mb-1">
                  {formatStat(stat.value, counts[i], stat.suffix, stat.short)}
                </div>
                <p className="text-white/60 text-sm font-medium">
                  {isMl ? stat.labelMl : stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 4: TEAM ─────────────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-kerala-deep mb-2">
              {isMl ? 'ടീമിനെ കണ്ടുമുട്ടൂ' : 'Meet the Team'}
            </h2>
            <p className="text-gray-500 text-sm">
              {isMl ? 'Malayali കമ്മ്യൂണിറ്റിക്ക് വേണ്ടി പ്രവർത്തിക്കുന്ന ഒരു dedicated ടീം' : 'A dedicated team working for the Malayali community'}
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-6">
            {TEAM.map(member => (
              <div
                key={member.name}
                className="bg-kerala-cream rounded-2xl overflow-hidden group hover:shadow-lg transition-all duration-300"
              >
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={member.photo}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-kerala-deep text-sm">
                    {isMl ? member.nameMl : member.name}
                  </h3>
                  <p className="text-kerala-green text-xs font-semibold mt-0.5 mb-2">
                    {isMl ? member.roleMl : member.role}
                  </p>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    {isMl ? member.bioMl : member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 5: VALUES ───────────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-kerala-deep mb-2">
              {isMl ? 'ഞങ്ങളുടെ മൂല്യങ്ങൾ' : 'Our Values'}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VALUES.map(v => (
              <div
                key={v.title}
                className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100 text-center group hover:border-kerala-green/30 transition-all"
              >
                <div className="w-14 h-14 rounded-2xl bg-kerala-green/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-kerala-green/20 transition-colors">
                  <v.icon size={26} className="text-kerala-green" />
                </div>
                <h3 className="font-serif text-xl font-bold text-kerala-deep mb-2">
                  {isMl ? v.titleMl : v.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {isMl ? v.descMl : v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 6: PRESS ────────────────────────────────────────────────── */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Newspaper size={16} className="text-gray-400" />
            <h2 className="font-semibold text-gray-400 text-sm uppercase tracking-wider">
              {isMl ? 'ഇവ ഞങ്ങളെ ഫീച്ചർ ചെയ്തു:' : 'As featured in:'}
            </h2>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            {PRESS.map(name => (
              <span
                key={name}
                className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm font-semibold hover:border-kerala-green hover:text-kerala-green transition-all cursor-default"
              >
                {name}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Mail size={14} className="text-kerala-green" />
            {isMl ? 'മീഡിയ അന്വേഷണം:' : 'Media enquiries:'}
            <a
              href="mailto:press@malayalibusiness.com"
              className="text-kerala-green font-semibold hover:underline"
            >
              press@malayalibusiness.com
            </a>
          </div>
        </div>
      </section>

      {/* ── SECTION 7: CONTACT CTA ──────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-kerala-cream">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl font-bold text-kerala-deep mb-2">
              {isMl ? 'ഞങ്ങളെ ബന്ധപ്പെടൂ' : 'Get in Touch'}
            </h2>
            <p className="text-gray-500 text-sm">
              {isMl ? 'ചോദ്യങ്ങൾ, പ്രതിക്രിയകൾ, അല്ലെങ്കിൽ സഹകരണ നിർദ്ദേശങ്ങൾ' : 'Questions, feedback, or partnership proposals'}
            </p>
          </div>
          <form
            onSubmit={e => e.preventDefault()}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7 space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  {isMl ? 'പേര്' : 'Name'}
                </label>
                <input
                  type="text"
                  value={contactForm.name}
                  onChange={e => setContactForm(p => ({ ...p, name: e.target.value }))}
                  placeholder={isMl ? 'നിങ്ങളുടെ പേര്' : 'Your name'}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 focus:border-kerala-green bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  {isMl ? 'ഇമെയിൽ' : 'Email'}
                </label>
                <input
                  type="email"
                  value={contactForm.email}
                  onChange={e => setContactForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="you@example.com"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 focus:border-kerala-green bg-gray-50"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                {isMl ? 'വിഷയം' : 'Subject'}
              </label>
              <input
                type="text"
                value={contactForm.subject}
                onChange={e => setContactForm(p => ({ ...p, subject: e.target.value }))}
                placeholder={isMl ? 'വിഷയം' : 'Subject'}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 focus:border-kerala-green bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                {isMl ? 'സന്ദേശം' : 'Message'}
              </label>
              <textarea
                value={contactForm.message}
                onChange={e => setContactForm(p => ({ ...p, message: e.target.value }))}
                placeholder={isMl ? 'നിങ്ങളുടെ സന്ദേശം...' : 'Your message...'}
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 focus:border-kerala-green bg-gray-50 resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-kerala-green hover:bg-kerala-green-light text-white font-bold py-3.5 rounded-xl transition-all"
            >
              <Send size={16} />
              {isMl ? 'അയക്കൂ' : 'Send Message'}
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  )
}
