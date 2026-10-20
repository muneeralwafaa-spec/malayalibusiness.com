'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useLocale } from 'next-intl'
import { MapPin, Phone, Mail, ArrowRight, CheckCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const quickLinks = [
  { href: '/directory',    label: 'Business Directory', labelMl: 'ബിസിനസ് ഡയറക്ടറി' },
  { href: '/professionals',label: 'Professionals',      labelMl: 'പ്രൊഫഷണൽസ്' },
  { href: '/media',        label: 'Media',              labelMl: 'മീഡിയ' },
  { href: '/dashboard',    label: 'Add Your Business',  labelMl: 'ബിസിനസ് ചേർക്കൂ' },
  { href: '/help',         label: 'Help & Support',     labelMl: 'സഹായം' },
  // Phase 2: Classifieds, Events, Jobs, Shop, Community
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
    href: 'https://www.facebook.com/malayalibusiness.com5/', label: 'Facebook',
    svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>,
  },
  {
    href: 'https://www.instagram.com/malayalibusiness/', label: 'Instagram',
    svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>,
  },
  {
    href: 'https://www.youtube.com/channel/UCjE0BIJlFupRNq64dB7Cimg', label: 'YouTube',
    svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12z"/></svg>,
  },
  {
    href: 'https://www.linkedin.com/company/malayalibusiness', label: 'LinkedIn',
    svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>,
  },
]

const emirates = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain']

export default function Footer() {
  const locale = useLocale()
  const isMl = locale === 'ml'
  const [email, setEmail] = useState('')
  const [subStatus, setSubStatus] = useState<'idle'|'loading'|'done'|'error'>('idle')

  async function handleSubscribe() {
    if (!email || !email.includes('@')) return
    setSubStatus('loading')
    const { error } = await supabase.from('newsletter_subscribers').insert([{ email, locale }])
    if (error && !error.message.includes('duplicate')) { setSubStatus('error'); return }
    await fetch('/api/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'welcome', to: email, ownerName: '' }),
    }).catch(() => {})
    setSubStatus('done')
  }

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
          <div className="flex flex-col gap-1.5 w-full sm:w-auto">
            {subStatus === 'done' ? (
              <div className="flex items-center gap-2 text-green-300 text-sm font-semibold">
                <CheckCircle size={18} /> {isMl ? 'നന്ദി! സബ്സ്ക്രൈബ് ചെയ്തു.' : 'Thank you for subscribing!'}
              </div>
            ) : (
              <>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder={isMl ? 'നിങ്ങളുടെ ഇ-മെയിൽ' : 'Your email address'}
                    className="flex-1 sm:w-64 bg-white/10 border border-white/20 text-white placeholder-white/40 px-4 py-2.5 rounded-xl text-sm outline-none focus:border-kerala-gold transition-colors"
                    onKeyDown={e => e.key === 'Enter' && handleSubscribe()}
                  />
                  <button
                    onClick={handleSubscribe}
                    disabled={subStatus === 'loading'}
                    className="bg-kerala-gold hover:bg-kerala-gold-light disabled:opacity-60 text-white font-semibold px-5 py-3 rounded-xl transition-all text-sm flex items-center gap-1.5 whitespace-nowrap"
                  >
                    {subStatus === 'loading' ? '...' : (isMl ? 'ചേരൂ' : 'Subscribe')}
                    {subStatus !== 'loading' && <ArrowRight size={15} />}
                  </button>
                </div>
                {subStatus === 'error' && <p className="text-red-300 text-xs">Something went wrong. Try again.</p>}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="md:col-span-2 lg:col-span-2">
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
              <a href="mailto:info@alwafaagroup.com" className="flex items-center gap-2.5 text-white/50 hover:text-kerala-gold-light text-sm transition-colors">
                <Mail size={14} />
                info@alwafaagroup.com
              </a>
              <a href="tel:+97142636936" className="flex items-center gap-2.5 text-white/50 hover:text-kerala-gold-light text-sm transition-colors">
                <Phone size={14} />
                +971 4 2636936
              </a>
              <div className="flex items-start gap-2.5 text-white/50 text-sm">
                <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                Mezzanine Floor, Attrium Building, 28th Street, Abu Hail, Deira, Dubai, UAE
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
                href={`/directory?location=${e.toLowerCase().replace(/\s+/g, '-')}`}
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
            <Link href={`/help`} className="hover:text-kerala-gold-light transition-colors">
              {isMl ? 'സ്വകാര്യതാ നയം' : 'Privacy Policy'}
            </Link>
            <span>·</span>
            <Link href={`/help`} className="hover:text-kerala-gold-light transition-colors">
              {isMl ? 'നിബന്ധനകൾ' : 'Terms'}
            </Link>
            <span>·</span>
            <Link href={`/about`} className="hover:text-kerala-gold-light transition-colors">
              {isMl ? 'ഞങ്ങളെ കുറിച്ച്' : 'About Us'}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
