'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useLocale } from 'next-intl'
import { MapPin, Phone, Mail, ArrowRight } from 'lucide-react'

const quickLinks = [
  { href: '/directory', label: 'Business Directory', labelMl: 'ബിസിനസ് ഡയറക്ടറി' },
  { href: '/classifieds', label: 'Classifieds', labelMl: 'ക്ലാസിഫൈഡ്സ്' },
  { href: '/events', label: 'Events', labelMl: 'ഇവന്റുകൾ' },
  { href: '/jobs', label: 'Jobs', labelMl: 'ജോലികൾ' },
  { href: '/shop', label: 'Shop', labelMl: 'ഷോപ്പ്' },
  { href: '/community', label: 'Community Blog', labelMl: 'ബ്ലോഗ്' },
]

const categories = [
  { href: '/directory?category=restaurants', label: 'Restaurants', labelMl: 'റസ്റ്റോറന്റ്' },
  { href: '/directory?category=real-estate', label: 'Real Estate', labelMl: 'റിയൽ എസ്റ്റേറ്റ്' },
  { href: '/directory?category=healthcare', label: 'Healthcare', labelMl: 'ആരോഗ്യ സേവനം' },
  { href: '/directory?category=education', label: 'Education', labelMl: 'വിദ്യാഭ്യാസം' },
  { href: '/directory?category=finance', label: 'Finance', labelMl: 'ധനകാര്യം' },
  { href: '/directory?category=technology', label: 'Technology', labelMl: 'ടെക്നോളജി' },
]

const support = [
  { href: '/help',    label: 'Help Centre',   labelMl: 'ഹെൽപ് സെന്റർ' },
  { href: '/pricing', label: 'Advertise',     labelMl: 'പരസ്യം ചെയ്യൂ' },
  { href: '/dashboard', label: 'Add Business', labelMl: 'ബിസിനസ് ചേർക്കൂ' },
  { href: '/help',    label: 'Contact Us',    labelMl: 'ബന്ധപ്പെടൂ' },
  { href: '/about',   label: 'About Us',      labelMl: 'ഞങ്ങളെ കുറിച്ച്' },
  { href: '/help',    label: 'Privacy & Terms', labelMl: 'നിബന്ധനകൾ' },
]

const socials = [
  {
    href: '#', label: 'Facebook',
    svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>,
  },
  {
    href: '#', label: 'Instagram',
    svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>,
  },
  {
    href: '#', label: 'Twitter/X',
    svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
  },
  {
    href: '#', label: 'YouTube',
    svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12z"/></svg>,
  },
  {
    href: '#', label: 'LinkedIn',
    svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>,
  },
]

const emirates = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain']

export default function Footer() {
  const locale = useLocale()
  const isMl = locale === 'ml'

  return (
    <footer className="bg-kerala-deep text-white">
      {/* Newsletter Strip */}
      <div className="border-b border-white/10 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-serif text-xl font-bold text-white">
              {isMl ? 'ഞങ്ങളുടെ ന്യൂസ്‌ലെറ്ററിൽ ചേരൂ' : 'Stay Updated with the Community'}
            </h3>
            <p className="text-white/50 text-sm mt-1">
              {isMl ? 'ഏറ്റവും പുതിയ ബിസിനസ് വാർത്തകൾ, ഇവന്റുകൾ' : 'Latest business news, events and opportunities in your inbox'}
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <input
              type="email"
              placeholder={isMl ? 'നിങ്ങളുടെ ഇ-മെയിൽ' : 'Your email address'}
              className="flex-1 sm:w-64 bg-white/10 border border-white/20 text-white placeholder-white/40 px-4 py-2.5 rounded-xl text-sm outline-none focus:border-kerala-gold transition-colors"
            />
            <button className="bg-kerala-gold hover:bg-kerala-gold-light text-white font-semibold px-5 py-2.5 rounded-xl transition-all text-sm flex items-center gap-1.5 whitespace-nowrap">
              {isMl ? 'ചേരൂ' : 'Subscribe'}
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href={`/${locale}`} className="inline-flex mb-4">
              <div className="bg-white rounded-xl px-3 py-1.5 shadow-sm">
                <Image
                  src="/logo.png"
                  alt="MalayaliBusiness UAE"
                  width={140}
                  height={40}
                  className="h-8 w-auto"
                />
              </div>
            </Link>
            <p className="text-white/50 text-sm mb-6 max-w-xs leading-relaxed">
              {isMl
                ? 'വിശ്വസ്തമായ ബിസിനസുകൾ, ഇവന്റുകൾ, അവസരങ്ങൾ എന്നിവയിലൂടെ ഏഴ് എമിറേറ്റുകളിലെ മലയാളി കമ്മ്യൂണിറ്റിയെ ബന്ധിപ്പിക്കുന്നു.'
                : 'Connecting the Malayali community across all seven emirates with trusted businesses, events, and opportunities.'}
            </p>

            {/* Contact */}
            <div className="space-y-2.5 mb-6">
              <a href="mailto:hello@malayalibusiness.ae" className="flex items-center gap-2.5 text-white/50 hover:text-kerala-gold-light text-sm transition-colors">
                <Mail size={14} />
                hello@malayalibusiness.ae
              </a>
              <a href="tel:+971501234567" className="flex items-center gap-2.5 text-white/50 hover:text-kerala-gold-light text-sm transition-colors">
                <Phone size={14} />
                +971 50 123 4567
              </a>
              <div className="flex items-center gap-2.5 text-white/50 text-sm">
                <MapPin size={14} />
                Dubai, United Arab Emirates
              </div>
            </div>

            {/* Socials */}
            <div className="flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-kerala-gold flex items-center justify-center transition-colors"
                >
                  {s.svg}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white text-sm uppercase tracking-wider mb-4">
              {isMl ? 'ദ്രുത ലിങ്കുകൾ' : 'Quick Links'}
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={`/${locale}${link.href}`}
                    className="text-white/50 hover:text-kerala-gold-light text-sm transition-colors"
                  >
                    {isMl ? link.labelMl : link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-white text-sm uppercase tracking-wider mb-4">
              {isMl ? 'വിഭാഗങ്ങൾ' : 'Categories'}
            </h4>
            <ul className="space-y-2.5">
              {categories.map((cat) => (
                <li key={cat.href}>
                  <Link
                    href={`/${locale}${cat.href}`}
                    className="text-white/50 hover:text-kerala-gold-light text-sm transition-colors"
                  >
                    {isMl ? cat.labelMl : cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-white text-sm uppercase tracking-wider mb-4">
              {isMl ? 'സഹായം' : 'Support'}
            </h4>
            <ul className="space-y-2.5">
              {support.map((item) => (
                <li key={item.href}>
                  <Link
                    href={`/${locale}${item.href}`}
                    className="text-white/50 hover:text-kerala-gold-light text-sm transition-colors"
                  >
                    {isMl ? item.labelMl : item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Emirates Tags */}
        <div className="max-w-7xl mx-auto mt-10 pt-8 border-t border-white/10">
          <p className="text-white/30 text-xs mb-3 uppercase tracking-widest">
            {isMl ? 'ഞങ്ങൾ ഇവിടെ ഉണ്ട്' : 'Serving all UAE Emirates'}
          </p>
          <div className="flex flex-wrap gap-2">
            {emirates.map((e) => (
              <Link
                key={e}
                href={`/${locale}/directory?location=${e.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-xs text-white/40 hover:text-kerala-gold bg-white/5 hover:bg-white/10 px-3 py-1 rounded-full border border-white/10 transition-all"
              >
                {e}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/30 text-xs text-center sm:text-left">
            © {new Date().getFullYear()} MalayaliBusiness UAE. {isMl ? 'എല്ലാ അവകാശങ്ങളും നിക്ഷിപ്തം.' : 'All rights reserved.'}
          </p>
          <div className="flex items-center gap-4 text-white/30 text-xs">
            <Link href={`/${locale}/help`} className="hover:text-kerala-gold-light transition-colors">
              {isMl ? 'സ്വകാര്യതാ നയം' : 'Privacy Policy'}
            </Link>
            <span>·</span>
            <Link href={`/${locale}/help`} className="hover:text-kerala-gold-light transition-colors">
              {isMl ? 'നിബന്ധനകൾ' : 'Terms'}
            </Link>
            <span>·</span>
            <Link href={`/${locale}/about`} className="hover:text-kerala-gold-light transition-colors">
              {isMl ? 'ഞങ്ങളെ കുറിച്ച്' : 'About Us'}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
