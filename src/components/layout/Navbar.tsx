'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { Menu, X, ChevronDown, Globe } from 'lucide-react'

const navLinks = [
  { href: '/directory', label: 'Business Directory', labelMl: 'ഡയറക്ടറി' },
  { href: '/classifieds', label: 'Classifieds', labelMl: 'ക്ലാസിഫൈഡ്സ്' },
  { href: '/events', label: 'Events', labelMl: 'ഇവന്റുകൾ' },
  { href: '/jobs', label: 'Jobs', labelMl: 'ജോലികൾ' },
  { href: '/shop', label: 'Shop', labelMl: 'ഷോപ്പ്' },
  { href: '/community', label: 'Community', labelMl: 'കമ്മ്യൂണിറ്റി' },
  { href: '/help', label: 'Help', labelMl: 'സഹായം' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const locale = useLocale()
  const isMl = locale === 'ml'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-kerala-deep shadow-lg py-2'
          : 'bg-gradient-to-b from-black/60 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center group">
            <div className="bg-white rounded-xl px-3 py-1.5 shadow-sm">
              <Image
                src="/logo.png"
                alt="MalayaliBusiness UAE"
                width={160}
                height={44}
                className="h-9 w-auto"
                priority
              />
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={`/${locale}${link.href}`}
                className="text-white/90 hover:text-kerala-gold-light text-sm font-medium px-3 py-2 rounded-md hover:bg-white/10 transition-all duration-200"
              >
                {isMl ? link.labelMl : link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Language Toggle */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 text-white/80 hover:text-white text-sm px-3 py-1.5 rounded-md hover:bg-white/10 transition-all"
              >
                <Globe size={15} />
                <span>{locale.toUpperCase()}</span>
                <ChevronDown size={13} />
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-xl py-1 min-w-[100px] z-50">
                  <Link
                    href="/en"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-kerala-cream hover:text-kerala-green"
                    onClick={() => setLangOpen(false)}
                  >
                    English
                  </Link>
                  <Link
                    href="/ml"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-kerala-cream hover:text-kerala-green font-malayalam"
                    onClick={() => setLangOpen(false)}
                  >
                    മലയാളം
                  </Link>
                </div>
              )}
            </div>

            <Link
              href={`/${locale}/auth`}
              className="text-white/90 hover:text-white text-sm font-medium px-4 py-2 border border-white/30 rounded-lg hover:border-white/60 transition-all"
            >
              {isMl ? 'ലോഗിൻ' : 'Login'}
            </Link>
            <Link
              href={`/${locale}/dashboard`}
              className="bg-kerala-gold hover:bg-kerala-gold-light text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200"
            >
              {isMl ? 'ബിസിനസ് ലിസ്റ്റ് ചെയ്യൂ' : 'List Your Business'}
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden text-white p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-kerala-deep border-t border-white/10 mt-2">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={`/${locale}${link.href}`}
                className="block text-white/90 hover:text-kerala-gold py-2.5 px-3 rounded-lg hover:bg-white/10 text-sm font-medium transition-all"
                onClick={() => setMobileOpen(false)}
              >
                {isMl ? link.labelMl : link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
              <div className="flex gap-2">
                <Link
                  href="/en"
                  className="flex-1 text-center py-2 text-sm text-white/80 border border-white/20 rounded-lg hover:border-kerala-gold"
                >
                  English
                </Link>
                <Link
                  href="/ml"
                  className="flex-1 text-center py-2 text-sm text-white/80 border border-white/20 rounded-lg hover:border-kerala-gold font-malayalam"
                >
                  മലയാളം
                </Link>
              </div>
              <Link
                href={`/${locale}/auth`}
                className="text-center text-white py-2.5 border border-white/30 rounded-lg text-sm font-medium"
                onClick={() => setMobileOpen(false)}
              >
                {isMl ? 'ലോഗിൻ' : 'Login'}
              </Link>
              <Link
                href={`/${locale}/dashboard`}
                className="text-center bg-kerala-gold text-white py-2.5 rounded-lg text-sm font-semibold"
                onClick={() => setMobileOpen(false)}
              >
                {isMl ? 'ബിസിനസ് ലിസ്റ്റ് ചെയ്യൂ' : 'List Your Business'}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
