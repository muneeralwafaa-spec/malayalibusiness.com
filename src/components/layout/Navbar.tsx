'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { Menu, X, ChevronDown, Globe, User, LayoutDashboard, LogOut, Settings } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

const navLinks = [
  { href: '/directory',   label: 'Directory',  labelMl: 'ഡയറക്ടറി'      },
  { href: '/classifieds', label: 'Classifieds', labelMl: 'ക്ലാസിഫൈഡ്സ്'  },
  { href: '/events',      label: 'Events',      labelMl: 'ഇവന്റുകൾ'       },
  { href: '/jobs',        label: 'Jobs',        labelMl: 'ജോലികൾ'          },
  { href: '/shop',        label: 'Shop',        labelMl: 'ഷോപ്പ്'          },
  { href: '/community',   label: 'Community',   labelMl: 'കമ്മ്യൂണിറ്റി'   },
  { href: '/help',        label: 'Help',        labelMl: 'സഹായം'           },
]

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false)
  const [mobileOpen,  setMobileOpen]  = useState(false)
  const [langOpen,    setLangOpen]    = useState(false)
  const [userOpen,    setUserOpen]    = useState(false)

  const locale    = useLocale()
  const isMl      = locale === 'ml'
  const router    = useRouter()
  const pathname  = usePathname()
  const { user, profile, loading, signOut } = useAuth()

  // Build locale-switch URL that preserves the current path
  const switchLocaleTo = (newLocale: string) => {
    // pathname is like /en/events/123  →  swap first segment
    const parts = pathname.split('/')          // ['', 'en', 'events', '123']
    parts[1] = newLocale                        // ['', 'ml', 'events', '123']
    return parts.join('/') || `/${newLocale}`
  }

  const userDropdownRef = useRef<HTMLDivElement>(null)
  const langDropdownRef = useRef<HTMLDivElement>(null)

  // Scroll listener
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
        setUserOpen(false)
      }
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target as Node)) {
        setLangOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSignOut = async () => {
    setUserOpen(false)
    setMobileOpen(false)
    await signOut()
    router.push(`/${locale}`)
  }

  // Derive display name / initials
  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'User'
  const initials    = displayName.slice(0, 2).toUpperCase()

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

          {/* ── Logo ────────────────────────────────────────────────────── */}
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

          {/* ── Desktop Nav Links ────────────────────────────────────────── */}
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

          {/* ── Desktop Right Actions ────────────────────────────────────── */}
          <div className="hidden lg:flex items-center gap-3">

            {/* Language Toggle */}
            <div className="relative" ref={langDropdownRef}>
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
                    href={switchLocaleTo('en')}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-kerala-cream hover:text-kerala-green"
                    onClick={() => setLangOpen(false)}
                  >
                    English
                  </Link>
                  <Link
                    href={switchLocaleTo('ml')}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-kerala-cream hover:text-kerala-green font-malayalam"
                    onClick={() => setLangOpen(false)}
                  >
                    മലയാളം
                  </Link>
                </div>
              )}
            </div>

            {/* Auth: show skeleton while loading, login when logged-out, avatar when logged-in */}
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-white/20 animate-pulse" />
            ) : user ? (
              /* ── Logged-in: Avatar + Dropdown ── */
              <div className="relative" ref={userDropdownRef}>
                <button
                  onClick={() => setUserOpen(!userOpen)}
                  className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full hover:bg-white/10 transition-all"
                >
                  {profile?.avatar_url ? (
                    <Image
                      src={profile.avatar_url}
                      alt={displayName}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full object-cover border-2 border-kerala-gold"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-kerala-gold flex items-center justify-center text-white text-xs font-bold border-2 border-kerala-gold/60">
                      {initials}
                    </div>
                  )}
                  <span className="text-white text-sm font-medium max-w-[100px] truncate">
                    {displayName}
                  </span>
                  <ChevronDown size={13} className="text-white/70" />
                </button>

                {userOpen && (
                  <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-2xl py-2 min-w-[200px] z-50 border border-gray-100">
                    {/* User info header */}
                    <div className="px-4 py-2 border-b border-gray-100 mb-1">
                      <p className="text-sm font-semibold text-gray-800 truncate">{displayName}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      {profile?.is_admin && (
                        <span className="inline-block mt-1 text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                          Admin
                        </span>
                      )}
                    </div>

                    <Link
                      href={`/${locale}/dashboard`}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-kerala-cream hover:text-kerala-green transition-colors"
                      onClick={() => setUserOpen(false)}
                    >
                      <LayoutDashboard size={15} />
                      {isMl ? 'ഡാഷ്ബോർഡ്' : 'Dashboard'}
                    </Link>

                    {profile?.is_admin && (
                      <Link
                        href={`/${locale}/admin`}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                        onClick={() => setUserOpen(false)}
                      >
                        <Settings size={15} />
                        {isMl ? 'അഡ്മിൻ പാനൽ' : 'Admin Panel'}
                      </Link>
                    )}

                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={15} />
                        {isMl ? 'സൈൻ ഔട്ട്' : 'Sign Out'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* ── Logged-out: Login + CTA ── */
              <>
                <Link
                  href={`/${locale}/auth`}
                  className="text-white/90 hover:text-white text-sm font-medium px-4 py-2 border border-white/30 rounded-lg hover:border-white/60 transition-all"
                >
                  {isMl ? 'ലോഗിൻ' : 'Login'}
                </Link>
                <Link
                  href={`/${locale}/auth?tab=register`}
                  className="bg-kerala-gold hover:bg-kerala-gold-light text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200"
                >
                  {isMl ? 'ബിസിനസ് ലിസ്റ്റ് ചെയ്യൂ' : 'List Your Business'}
                </Link>
              </>
            )}
          </div>

          {/* ── Mobile Toggle ────────────────────────────────────────────── */}
          <button
            className="lg:hidden text-white p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ──────────────────────────────────────────────────── */}
      {mobileOpen && (
        <div className="lg:hidden bg-kerala-deep border-t border-white/10 mt-2 max-h-[calc(100vh-72px)] overflow-y-auto">
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
              {/* Language switcher */}
              <div className="flex gap-2">
                <Link
                  href={switchLocaleTo('en')}
                  className={`flex-1 text-center py-2 text-sm border rounded-lg transition-colors ${locale === 'en' ? 'border-kerala-gold text-kerala-gold' : 'text-white/80 border-white/20 hover:border-kerala-gold'}`}
                  onClick={() => setMobileOpen(false)}
                >
                  English
                </Link>
                <Link
                  href={switchLocaleTo('ml')}
                  className={`flex-1 text-center py-2 text-sm border rounded-lg transition-colors font-malayalam ${locale === 'ml' ? 'border-kerala-gold text-kerala-gold' : 'text-white/80 border-white/20 hover:border-kerala-gold'}`}
                  onClick={() => setMobileOpen(false)}
                >
                  മലയാളം
                </Link>
              </div>

              {/* Auth section */}
              {loading ? (
                <div className="h-10 bg-white/10 rounded-lg animate-pulse" />
              ) : user ? (
                <>
                  {/* User info */}
                  <div className="flex items-center gap-3 px-3 py-2 bg-white/10 rounded-lg">
                    {profile?.avatar_url ? (
                      <Image
                        src={profile.avatar_url}
                        alt={displayName}
                        width={36}
                        height={36}
                        className="w-9 h-9 rounded-full object-cover border-2 border-kerala-gold"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-kerala-gold flex items-center justify-center text-white text-sm font-bold">
                        {initials}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-white text-sm font-medium truncate">{displayName}</p>
                      <p className="text-white/60 text-xs truncate">{user.email}</p>
                    </div>
                  </div>

                  <Link
                    href={`/${locale}/dashboard`}
                    className="flex items-center gap-2 text-white py-2.5 px-3 border border-white/30 rounded-lg text-sm font-medium"
                    onClick={() => setMobileOpen(false)}
                  >
                    <LayoutDashboard size={16} />
                    {isMl ? 'ഡാഷ്ബോർഡ്' : 'Dashboard'}
                  </Link>

                  {profile?.is_admin && (
                    <Link
                      href={`/${locale}/admin`}
                      className="flex items-center gap-2 text-red-400 py-2.5 px-3 border border-red-400/30 rounded-lg text-sm font-medium"
                      onClick={() => setMobileOpen(false)}
                    >
                      <Settings size={16} />
                      {isMl ? 'അഡ്മിൻ' : 'Admin Panel'}
                    </Link>
                  )}

                  <button
                    onClick={handleSignOut}
                    className="flex items-center justify-center gap-2 text-red-400 py-2.5 px-3 border border-red-400/30 rounded-lg text-sm font-medium w-full"
                  >
                    <LogOut size={16} />
                    {isMl ? 'സൈൻ ഔട്ട്' : 'Sign Out'}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href={`/${locale}/auth`}
                    className="text-center text-white py-2.5 border border-white/30 rounded-lg text-sm font-medium"
                    onClick={() => setMobileOpen(false)}
                  >
                    {isMl ? 'ലോഗിൻ' : 'Login'}
                  </Link>
                  <Link
                    href={`/${locale}/auth?tab=register`}
                    className="text-center bg-kerala-gold text-white py-2.5 rounded-lg text-sm font-semibold"
                    onClick={() => setMobileOpen(false)}
                  >
                    {isMl ? 'ബിസിനസ് ലിസ്റ്റ് ചെയ്യൂ' : 'List Your Business'}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
