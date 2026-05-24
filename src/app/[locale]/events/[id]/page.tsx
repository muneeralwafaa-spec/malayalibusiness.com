'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { useParams } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import {
  MapPin, Calendar, Clock, Users, Tag, Copy,
  CheckCircle, Ticket, Building2, Globe,
  MessageCircle, ArrowLeft, ExternalLink, Loader2
} from 'lucide-react'
import { getEvent, getEvents } from '@/lib/events'
import type { MalayaliEvent } from '@/lib/events'

// ─── Countdown Timer Hook ─────────────────────────────────────────────────────

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
  started: boolean
}

function useCountdown(targetDate: string): TimeLeft {
  const calculate = (): TimeLeft => {
    const diff = new Date(targetDate).getTime() - Date.now()
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, started: true }
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
      started: false,
    }
  }

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculate)

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calculate()), 1000)
    return () => clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetDate])

  return timeLeft
}

// ─── Registration Form ─────────────────────────────────────────────────────────

interface RegForm {
  name: string
  email: string
  phone: string
  tickets: number
}

const FALLBACK = 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1400&q=80'

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EventDetailPage() {
  const locale = useLocale()
  const params = useParams()
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : ''

  const isMl = locale === 'ml'

  const [event,         setEvent]         = useState<MalayaliEvent | null>(null)
  const [relatedEvents, setRelatedEvents] = useState<MalayaliEvent[]>([])
  const [loading,       setLoading]       = useState(true)
  const [notFound,      setNotFound]      = useState(false)
  const [langMl,        setLangMl]        = useState(isMl)
  const [copied,        setCopied]        = useState(false)
  const [regForm,       setRegForm]       = useState<RegForm>({ name: '', email: '', phone: '', tickets: 1 })
  const [regSubmitted,  setRegSubmitted]  = useState(false)
  const [regLoading,    setRegLoading]    = useState(false)

  useEffect(() => {
    getEvent(id).then(data => {
      if (!data) { setNotFound(true); setLoading(false); return }
      setEvent(data)
      setLoading(false)
      // Fetch related events by category
      getEvents({ category: data.category, limit: 4 }).then(all => {
        setRelatedEvents(all.filter(e => e.id !== data.id).slice(0, 3))
      })
    })
  }, [id])

  // Derived: combine event_date + event_time for countdown
  const countdownTarget = event
    ? `${event.event_date}T${event.event_time ?? '09:00'}`
    : new Date(Date.now() + 86400000).toISOString()

  const countdown = useCountdown(countdownTarget)

  if (loading) {
    return (
      <main className="min-h-screen bg-kerala-cream">
        <Navbar />
        <div className="flex justify-center items-center py-40">
          <Loader2 size={36} className="animate-spin text-kerala-green" />
        </div>
        <Footer />
      </main>
    )
  }

  if (notFound || !event) {
    return (
      <main className="min-h-screen bg-kerala-cream">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-32 text-center">
          <h1 className="font-serif text-3xl font-bold text-kerala-deep mb-4">
            {isMl ? 'ഇവന്റ് കണ്ടെത്തിയില്ല' : 'Event Not Found'}
          </h1>
          <p className="text-gray-500 mb-8">
            {isMl ? 'ഈ ഇവന്റ് നിലവിലില്ല.' : 'This event does not exist or has been removed.'}
          </p>
          <Link href={`/${locale}/events`} className="inline-flex items-center gap-2 bg-kerala-green text-white px-6 py-3 rounded-xl font-semibold hover:bg-kerala-green/90 transition-colors">
            <ArrowLeft size={16} /> {isMl ? 'ഇവന്റുകൾ' : 'All Events'}
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  const title      = isMl ? (event.title_ml ?? event.title) : event.title
  const isFree     = event.price == null
  const seatsLeft  = event.capacity ? event.capacity - (event.registered ?? 0) : null
  const pctFilled  = event.capacity && event.registered
    ? Math.round((event.registered / event.capacity) * 100)
    : 0
  const venue      = isMl ? (event.venue_ml ?? event.venue) : event.venue
  const emirate    = isMl ? (event.emirate_ml ?? event.emirate) : event.emirate
  const location   = `${emirate}, UAE`
  const dateObj    = new Date(`${event.event_date}T${event.event_time ?? '00:00'}`)
  const formattedDate = dateObj.toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
  const formattedTime = event.event_time
    ? new Date(`2000-01-01T${event.event_time}`).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    : null

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRegSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setRegLoading(true)
    setTimeout(() => { setRegLoading(false); setRegSubmitted(true) }, 1200)
  }

  const tags: string[] = Array.isArray(event.tags) ? event.tags : []

  return (
    <main className="min-h-screen bg-kerala-cream">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative h-96 w-full overflow-hidden">
        <Image
          src={event.image_url || FALLBACK}
          alt={title}
          fill
          className="object-cover"
          priority
          onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-kerala-deep/90 via-kerala-deep/40 to-transparent" />

        {/* Category badge */}
        <div className="absolute top-4 left-4 flex gap-2">
          {event.featured && (
            <span className="bg-kerala-red text-white text-xs font-bold px-3 py-1 rounded-full">
              {isMl ? 'ഫീച്ചർഡ്' : 'Featured'}
            </span>
          )}
          <span className="bg-kerala-green text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
            {event.category}
          </span>
        </div>

        {/* Price badge */}
        <div className="absolute top-4 right-4">
          {isFree ? (
            <span className="bg-kerala-gold text-white text-xs font-bold px-3 py-1 rounded-full">
              {isMl ? 'സൗജന്യം' : 'FREE'}
            </span>
          ) : (
            <span className="bg-kerala-deep/80 text-kerala-gold text-xs font-bold px-3 py-1 rounded-full border border-kerala-gold">
              AED {event.price}
            </span>
          )}
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <Link href={`/${locale}/events`} className="inline-flex items-center gap-1 text-white/70 hover:text-white text-sm mb-3 transition-colors">
            <ArrowLeft size={14} /> {isMl ? 'ഇവന്റുകൾ' : 'All Events'}
          </Link>
          <h1 className="font-serif text-3xl md:text-4xl text-white font-bold leading-tight mb-2">
            {title}
          </h1>
          <div className="flex flex-wrap gap-4 text-white/80 text-sm">
            <span className="flex items-center gap-1"><Calendar size={14} /> {formattedDate}</span>
            {formattedTime && (
              <span className="flex items-center gap-1"><Clock size={14} /> {formattedTime}</span>
            )}
            <span className="flex items-center gap-1"><MapPin size={14} /> {location}</span>
          </div>
        </div>
      </section>

      {/* ── Countdown ── */}
      <section className="bg-kerala-deep py-6">
        {countdown.started ? (
          <div className="text-center text-kerala-gold font-serif text-xl md:text-2xl py-2">
            {isMl ? 'ഇവന്റ് ആരംഭിച്ചു!' : 'Event has started!'}
          </div>
        ) : (
          <div className="max-w-3xl mx-auto px-4">
            <p className="text-center text-kerala-gold/70 text-xs uppercase tracking-widest mb-3 font-semibold">
              {isMl ? 'ഇവന്റ് ആരംഭിക്കാൻ' : 'Event starts in'}
            </p>
            <div className="flex justify-center gap-4 md:gap-8">
              {[
                { val: countdown.days,    label: isMl ? 'ദിവസം'    : 'Days'  },
                { val: countdown.hours,   label: isMl ? 'മണിക്കൂർ' : 'Hours' },
                { val: countdown.minutes, label: isMl ? 'മിനിറ്റ്'  : 'Mins'  },
                { val: countdown.seconds, label: isMl ? 'സെക്കൻഡ്'  : 'Secs'  },
              ].map(({ val, label }) => (
                <div key={label} className="flex flex-col items-center">
                  <span className="text-kerala-gold font-serif text-4xl md:text-5xl font-bold tabular-nums w-16 text-center">
                    {String(val).padStart(2, '0')}
                  </span>
                  <span className="text-white/60 text-xs mt-1">{label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Left: Main Column ── */}
          <div className="lg:col-span-2 space-y-10">

            {/* About */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-2xl text-kerala-deep font-bold">
                  {isMl ? 'ഇവന്റിനെ കുറിച്ച്' : 'About the Event'}
                </h2>
                {event.description_ml && (
                  <button
                    onClick={() => setLangMl(!langMl)}
                    className="text-xs bg-kerala-green/10 text-kerala-green border border-kerala-green/30 px-3 py-1.5 rounded-full hover:bg-kerala-green hover:text-white transition-colors font-semibold"
                  >
                    {langMl ? 'English' : 'മലയാളം'}
                  </button>
                )}
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                {((langMl && event.description_ml ? event.description_ml : event.description) ?? '')
                  .split('\n\n')
                  .map((para, i) => (
                    <p key={i} className={langMl ? 'font-malayalam' : ''}>{para}</p>
                  ))}
              </div>
            </section>

            {/* Location */}
            <section>
              <h2 className="font-serif text-2xl text-kerala-deep font-bold mb-4">
                {isMl ? 'സ്ഥലം' : 'Location'}
              </h2>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-kerala-green/10 to-kerala-gold/10 flex items-center justify-center relative">
                  <div className="text-center">
                    <MapPin size={40} className="text-kerala-green mx-auto mb-2" />
                    {venue && <p className="text-kerala-deep font-semibold">{venue}</p>}
                    <p className="text-gray-500 text-sm">{location}</p>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div>
                    {venue && <p className="font-semibold text-kerala-deep">{venue}</p>}
                    <p className="text-gray-500 text-sm">{location}</p>
                  </div>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((venue ?? '') + ' ' + location)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-kerala-green text-white text-sm px-4 py-2 rounded-lg hover:bg-kerala-green/90 transition-colors"
                  >
                    <ExternalLink size={14} /> {isMl ? 'ഭൂപടത്തിൽ തുറക്കൂ' : 'Open in Maps'}
                  </a>
                </div>
              </div>
            </section>

            {/* Share */}
            <section>
              <h2 className="font-serif text-xl text-kerala-deep font-bold mb-4">
                {isMl ? 'പങ്കിടൂ' : 'Share This Event'}
              </h2>
              <div className="flex flex-wrap gap-3">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(title + ' — ' + (typeof window !== 'undefined' ? window.location.href : ''))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  {isMl ? 'വാട്ട്‌സ്‌ആപ്പ്' : 'WhatsApp'}
                </a>
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors"
                >
                  {copied ? <CheckCircle size={14} className="text-kerala-green" /> : <Copy size={14} />}
                  {copied ? (isMl ? 'പകർത്തി!' : 'Copied!') : (isMl ? 'ലിങ്ക് പകർത്തൂ' : 'Copy Link')}
                </button>
              </div>
            </section>
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-6">

            {/* Registration Card */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden sticky top-4">
              <div className="bg-gradient-to-r from-kerala-green to-kerala-deep p-4">
                <div className="flex items-center justify-between">
                  <span className="text-white font-serif text-lg font-bold">
                    {isFree
                      ? (isMl ? 'സൗജന്യ പ്രവേശനം' : 'Free Entry')
                      : `AED ${event.price}`}
                  </span>
                  {isFree && (
                    <span className="bg-kerala-gold text-white text-xs font-bold px-2 py-1 rounded-full">FREE</span>
                  )}
                </div>
                {event.capacity != null && (
                  <div className="mt-3">
                    <div className="flex justify-between text-white/70 text-xs mb-1">
                      <span>{isMl ? 'സ്ഥാനങ്ങൾ ശേഷിക്കുന്നു' : 'Seats remaining'}</span>
                      <span>{seatsLeft} / {event.capacity}</span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-kerala-gold rounded-full transition-all"
                        style={{ width: `${pctFilled}%` }}
                      />
                    </div>
                    <p className="text-white/60 text-xs mt-1">{pctFilled}% {isMl ? 'നിറഞ്ഞു' : 'filled'}</p>
                  </div>
                )}
              </div>

              <div className="p-4">
                {regSubmitted ? (
                  <div className="text-center py-4">
                    <CheckCircle size={40} className="text-kerala-green mx-auto mb-2" />
                    <p className="font-semibold text-kerala-deep">{isMl ? 'വിജയകരമായി രജിസ്റ്റർ ചെയ്തു!' : 'Successfully Registered!'}</p>
                    <p className="text-gray-500 text-sm mt-1">{isMl ? 'നിങ്ങളുടെ ഇമെയിൽ പരിശോധിക്കൂ' : 'Check your email for confirmation'}</p>
                  </div>
                ) : (
                  <form onSubmit={handleRegSubmit} className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-600 font-semibold block mb-1">
                        {isMl ? 'പേര്' : 'Full Name'} *
                      </label>
                      <input
                        type="text"
                        required
                        value={regForm.name}
                        onChange={(e) => setRegForm((f) => ({ ...f, name: e.target.value }))}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-kerala-green"
                        placeholder={isMl ? 'നിങ്ങളുടെ പേര്' : 'Your name'}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 font-semibold block mb-1">
                        {isMl ? 'ഇമെയിൽ' : 'Email'} *
                      </label>
                      <input
                        type="email"
                        required
                        value={regForm.email}
                        onChange={(e) => setRegForm((f) => ({ ...f, email: e.target.value }))}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-kerala-green"
                        placeholder="you@example.com"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 font-semibold block mb-1">
                        {isMl ? 'ഫോൺ' : 'Phone'} *
                      </label>
                      <input
                        type="tel"
                        required
                        value={regForm.phone}
                        onChange={(e) => setRegForm((f) => ({ ...f, phone: e.target.value }))}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-kerala-green"
                        placeholder="+971 50 000 0000"
                      />
                    </div>
                    {!isFree && (
                      <div>
                        <label className="text-xs text-gray-600 font-semibold block mb-1">
                          {isMl ? 'ടിക്കറ്റുകളുടെ എണ്ണം' : 'Number of Tickets'}
                        </label>
                        <select
                          value={regForm.tickets}
                          onChange={(e) => setRegForm((f) => ({ ...f, tickets: Number(e.target.value) }))}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-kerala-green"
                        >
                          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                            <option key={n} value={n}>{n}</option>
                          ))}
                        </select>
                      </div>
                    )}
                    {!isFree && event.price != null && (
                      <p className="text-kerala-deep font-bold text-sm">
                        {isMl ? 'ആകെ' : 'Total'}: AED {event.price * regForm.tickets}
                      </p>
                    )}
                    <button
                      type="submit"
                      disabled={regLoading || seatsLeft === 0}
                      className="w-full bg-kerala-gold hover:bg-kerala-gold/90 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      {regLoading ? (
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Ticket size={16} />
                      )}
                      {seatsLeft === 0
                        ? (isMl ? 'പൂർണ്ണം' : 'Sold Out')
                        : (isMl ? 'ഇപ്പോൾ രജിസ്റ്റർ ചെയ്യൂ' : 'Register Now')}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Organizer Card */}
            {event.organizer && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                <h3 className="font-semibold text-kerala-deep mb-3 text-sm uppercase tracking-wide">
                  {isMl ? 'സംഘാടകൻ' : 'Organizer'}
                </h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-kerala-green/10 flex items-center justify-center flex-shrink-0 ring-2 ring-kerala-gold/20">
                    <Building2 size={20} className="text-kerala-green" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-kerala-deep text-sm truncate">{event.organizer}</p>
                    <p className="text-gray-500 text-xs">{isMl ? 'ഓർഗനൈസർ' : 'Event Organizer'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Related Events */}
            {relatedEvents.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                <h3 className="font-semibold text-kerala-deep mb-4 text-sm uppercase tracking-wide">
                  {isMl ? 'അനുബന്ധ ഇവന്റുകൾ' : 'Related Events'}
                </h3>
                <div className="space-y-3">
                  {relatedEvents.map((e) => (
                    <Link
                      key={e.id}
                      href={`/${locale}/events/${e.id}`}
                      className="flex gap-3 group"
                    >
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                        <Image
                          src={e.image_url || FALLBACK}
                          alt={isMl ? (e.title_ml ?? e.title) : e.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                          onError={(ev) => { (ev.target as HTMLImageElement).src = FALLBACK }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-kerala-deep group-hover:text-kerala-green transition-colors line-clamp-2 leading-snug">
                          {isMl ? (e.title_ml ?? e.title) : e.title}
                        </p>
                        <p className="text-gray-400 text-xs mt-1">
                          {new Date(e.event_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {tags.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                <h3 className="font-semibold text-kerala-deep mb-3 text-sm uppercase tracking-wide">
                  {isMl ? 'ടാഗുകൾ' : 'Tags'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 bg-kerala-green/10 text-kerala-green text-xs px-3 py-1 rounded-full"
                    >
                      <Tag size={10} /> {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Event info strip */}
      <div className="bg-kerala-deep/5 border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap gap-6 justify-center text-sm text-gray-600">
          {venue && (
            <span className="flex items-center gap-2">
              <Building2 size={14} className="text-kerala-green" />
              {venue}
            </span>
          )}
          {event.capacity != null && (
            <span className="flex items-center gap-2">
              <Users size={14} className="text-kerala-green" />
              {event.capacity} {isMl ? 'ശേഷി' : 'capacity'}
            </span>
          )}
          <span className="flex items-center gap-2">
            <Globe size={14} className="text-kerala-green" />
            {event.emirate}
          </span>
          <span className="flex items-center gap-2">
            <MessageCircle size={14} className="text-kerala-green" />
            {isMl ? 'ബഹുഭാഷ ഇവന്റ്' : 'Bilingual Event'}
          </span>
        </div>
      </div>

      <Footer />
    </main>
  )
}
