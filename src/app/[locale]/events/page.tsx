'use client'

import { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { getEvents } from '@/lib/events'
import type { MalayaliEvent } from '@/lib/events'
import { supabase } from '@/lib/supabase'
import {
  Search, MapPin, Calendar, Clock, Users, Filter, ChevronDown,
  Star, Ticket, ArrowRight, X, Tag, CheckCircle, Loader2
} from 'lucide-react'

// ─── Mock events removed — data now comes from Supabase via useEffect ───────

const categoryTabs = [
  { key: 'all', label: 'All Events', labelMl: 'എല്ലാം', emoji: '🎉' },
  { key: 'cultural', label: 'Cultural', labelMl: 'സാംസ്കാരിക', emoji: '🎭' },
  { key: 'business', label: 'Business', labelMl: 'ബിസിനസ്', emoji: '💼' },
  { key: 'networking', label: 'Networking', labelMl: 'നെറ്റ്വർക്കിംഗ്', emoji: '🤝' },
  { key: 'food', label: 'Food & Drink', labelMl: 'ഭക്ഷണം', emoji: '🍛' },
  { key: 'sports', label: 'Sports', labelMl: 'കായിക', emoji: '🏏' },
  { key: 'education', label: 'Education', labelMl: 'വിദ്യാഭ്യാസം', emoji: '📚' },
]

const emirates = ['All Emirates', 'Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Fujairah', 'Ras Al Khaimah', 'Umm Al Quwain']
const emiratesMl = ['എല്ലാ എമിറേറ്റ്', 'ദുബായ്', 'അബൂദബി', 'ഷാർജ', 'അജ്മാൻ', 'ഫുജൈറ', 'റാസൽ ഖൈമ', 'ഉം അൽ ഖൈവൈൻ']

function formatDate(dateStr: string, ml: boolean) {
  const d = new Date(dateStr)
  if (ml) return d.toLocaleDateString('ml-IN', { day: 'numeric', month: 'long', year: 'numeric' })
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function getDaysUntil(dateStr: string) {
  const today = new Date()
  const event = new Date(dateStr)
  return Math.ceil((event.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

function SeatsBar({ registered, capacity }: { registered: number; capacity: number }) {
  const pct = Math.min(100, Math.round((registered / capacity) * 100))
  const color = pct >= 90 ? 'bg-red-500' : pct >= 70 ? 'bg-amber-500' : 'bg-kerala-green'
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>{registered.toLocaleString()} registered</span>
        <span>{capacity.toLocaleString()} capacity</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function EventCard({ event, isMl }: { event: MalayaliEvent; isMl: boolean }) {
  const locale = useLocale()
  const daysUntil = getDaysUntil(event.event_date)
  const isFull = event.registered >= (event.capacity ?? 9999)

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1 flex flex-col">
      <div className="relative h-48 overflow-hidden">
        {event.image_url && (
          <Image
            src={event.image_url}
            alt={event.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          />
        )}
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 backdrop-blur-sm text-kerala-deep text-xs font-semibold px-3 py-1 rounded-full capitalize">
            {categoryTabs.find(c => c.key === event.category)?.[isMl ? 'labelMl' : 'label']}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          {event.price === null ? (
            <span className="bg-kerala-green text-white text-xs font-bold px-3 py-1 rounded-full">
              {isMl ? 'സൗജന്യം' : 'FREE'}
            </span>
          ) : (
            <span className="bg-kerala-deep/80 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full">
              AED {event.price}
            </span>
          )}
        </div>
        {daysUntil > 0 && daysUntil <= 30 && (
          <div className="absolute bottom-3 left-3 bg-kerala-gold/90 text-white text-xs font-bold px-3 py-1 rounded-full">
            {isMl ? `${daysUntil} ദിവസം ബാക്കി` : `${daysUntil} days away`}
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-serif font-bold text-kerala-deep text-lg leading-tight mb-2 group-hover:text-kerala-green transition-colors">
          {isMl ? (event.title_ml ?? event.title) : event.title}
        </h3>

        <div className="space-y-1.5 mb-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar size={13} className="text-kerala-green flex-shrink-0" />
            <span>{formatDate(event.event_date, isMl)}</span>
            <span className="text-gray-300">·</span>
            <Clock size={13} className="text-kerala-green flex-shrink-0" />
            <span>{event.event_time}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MapPin size={13} className="text-kerala-green flex-shrink-0" />
            <span className="truncate">{isMl ? (event.venue_ml ?? event.venue) : event.venue}, {isMl ? (event.emirate_ml ?? event.emirate) : event.emirate}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {event.tags.slice(0, 3).map(tag => (
            <span key={tag} className="bg-kerala-cream text-kerala-deep text-xs px-2.5 py-0.5 rounded-full font-medium">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto space-y-3">
          {event.capacity && <SeatsBar registered={event.registered} capacity={event.capacity} />}
          <div className="flex items-center gap-3">
            <button
              disabled={isFull}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isFull
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-kerala-green text-white hover:bg-kerala-green-light'
              }`}
            >
              {isFull
                ? (isMl ? 'സ്ഥലം നിറഞ്ഞു' : 'Fully Booked')
                : event.price === null
                  ? (isMl ? 'രജിസ്റ്റർ ചെയ്യൂ' : 'Register Free')
                  : (isMl ? 'ടിക്കറ്റ് വാങ്ങൂ' : 'Get Tickets')}
            </button>
            <Link
              href={`/events/${event.id}`}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:border-kerala-green hover:text-kerala-green transition-all"
            >
              {isMl ? 'വിവരം' : 'Details'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function FeaturedEventBanner({ event, isMl }: { event: MalayaliEvent; isMl: boolean }) {
  const locale = useLocale()
  const daysUntil = getDaysUntil(event.event_date)
  const spotsLeft = (event.capacity ?? 0) - event.registered

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-8">
      <div className="relative h-[280px] sm:h-[360px] md:h-[420px]">
        {event.image_url && (
          <Image
            src={event.image_url}
            alt={event.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-kerala-deep/90 via-kerala-deep/60 to-transparent" />
      </div>

      <div className="absolute inset-0 flex items-center">
        <div className="px-4 sm:px-8 md:px-12 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-kerala-gold text-white text-xs font-bold px-3 py-1.5 rounded-full mb-4">
            <Star size={12} fill="white" />
            {isMl ? 'ഫീച്ചേഡ് ഇവന്റ്' : 'Featured Event'}
          </div>

          <h2 className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
            {isMl ? (event.title_ml ?? event.title) : event.title}
          </h2>
          <p className="text-white/75 text-sm md:text-base leading-relaxed mb-5 max-w-lg line-clamp-2">
            {isMl ? (event.description_ml ?? event.description) : event.description}
          </p>

          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <Calendar size={15} className="text-kerala-gold-light" />
              <span>{formatDate(event.event_date, isMl)}</span>
            </div>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <Clock size={15} className="text-kerala-gold-light" />
              <span>{event.event_time} – {event.end_time}</span>
            </div>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <MapPin size={15} className="text-kerala-gold-light" />
              <span>{isMl ? (event.venue_ml ?? event.venue) : event.venue}</span>
            </div>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <Users size={15} className="text-kerala-gold-light" />
              <span>{spotsLeft.toLocaleString()} {isMl ? 'സ്ഥലം ബാക്കി' : 'spots left'}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-kerala-gold hover:bg-kerala-gold-light text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg">
              <Ticket size={16} />
              {event.price === null
                ? (isMl ? 'സൗജന്യ രജിസ്ട്രേഷൻ' : 'Register Free')
                : `${isMl ? 'ടിക്കറ്റ്' : 'Tickets from'} AED ${event.price}`}
            </button>
            {daysUntil > 0 && (
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 text-white text-center px-4 py-2.5 rounded-xl">
                <div className="font-serif font-bold text-xl leading-none">{daysUntil}</div>
                <div className="text-xs text-white/60 mt-0.5">{isMl ? 'ദിവസം' : 'days'}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const EMIRATE_LIST = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain']
const EVENT_CATS = ['cultural', 'networking', 'food', 'business', 'sports', 'education']

function SubmitEventModal({ isMl, onClose }: { isMl: boolean; onClose: () => void }) {
  const [form, setForm] = useState({
    title: '', organizer: '', contact_email: '', contact_phone: '',
    event_date: '', event_time: '', venue: '', emirate: 'Dubai',
    category: 'cultural', price: '', capacity: '', description: '',
  })
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)
  const [err, setErr] = useState('')

  const handleSubmit = async () => {
    if (!form.title || !form.event_date || !form.emirate || !form.contact_email) {
      setErr('Please fill Title, Date, Emirate and Contact Email.'); return
    }
    setSaving(true); setErr('')
    const { error } = await supabase.from('event_submissions').insert({
      title: form.title,
      organizer: form.organizer || null,
      contact_email: form.contact_email,
      contact_phone: form.contact_phone || null,
      event_date: form.event_date,
      event_time: form.event_time || null,
      venue: form.venue || null,
      emirate: form.emirate,
      category: form.category,
      price: form.price ? Number(form.price) : null,
      capacity: form.capacity ? Number(form.capacity) : null,
      description: form.description || null,
      status: 'pending',
    })
    setSaving(false)
    if (error) { setErr('Submission failed: ' + error.message); return }
    setDone(true)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 pb-0">
          <h3 className="font-serif font-bold text-kerala-deep text-xl">{isMl ? 'ഇവന്റ് ചേർക്കൂ' : 'Submit Your Event'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={22}/></button>
        </div>
        {done ? (
          <div className="p-8 text-center">
            <CheckCircle size={48} className="text-kerala-green mx-auto mb-3"/>
            <p className="font-bold text-kerala-deep text-lg mb-1">{isMl ? 'നന്ദി!' : 'Submitted Successfully!'}</p>
            <p className="text-gray-500 text-sm mb-4">{isMl ? 'ഞങ്ങൾ ഉടൻ നിങ്ങളെ ബന്ധപ്പെടും.' : 'Our team will review and contact you shortly.'}</p>
            <button onClick={onClose} className="bg-kerala-green text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90">{isMl ? 'അടയ്ക്കൂ' : 'Close'}</button>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">{isMl ? 'ഇവന്റ് തലക്കെട്ട്' : 'Event Title'} *</label>
              <input type="text" value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} placeholder="e.g. Kerala Business Summit 2026" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 focus:border-kerala-green bg-gray-50"/>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">{isMl ? 'സംഘടകൻ' : 'Organizer'}</label>
                <input type="text" value={form.organizer} onChange={e => setForm(f => ({...f, organizer: e.target.value}))} placeholder="Organization name" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 focus:border-kerala-green bg-gray-50"/>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">{isMl ? 'വിഭാഗം' : 'Category'}</label>
                <select value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 focus:border-kerala-green bg-gray-50 capitalize">
                  {EVENT_CATS.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">{isMl ? 'തീയതി' : 'Event Date'} *</label>
                <input type="date" value={form.event_date} onChange={e => setForm(f => ({...f, event_date: e.target.value}))} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 focus:border-kerala-green bg-gray-50"/>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">{isMl ? 'സമയം' : 'Start Time'}</label>
                <input type="time" value={form.event_time} onChange={e => setForm(f => ({...f, event_time: e.target.value}))} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 focus:border-kerala-green bg-gray-50"/>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">{isMl ? 'എമിറേറ്റ്' : 'Emirate'} *</label>
                <select value={form.emirate} onChange={e => setForm(f => ({...f, emirate: e.target.value}))} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 focus:border-kerala-green bg-gray-50">
                  {EMIRATE_LIST.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">{isMl ? 'സ്ഥലം' : 'Venue'}</label>
                <input type="text" value={form.venue} onChange={e => setForm(f => ({...f, venue: e.target.value}))} placeholder="Hall / Building name" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 focus:border-kerala-green bg-gray-50"/>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">{isMl ? 'ടിക്കറ്റ് വില (AED)' : 'Ticket Price (AED)'}</label>
                <input type="number" value={form.price} onChange={e => setForm(f => ({...f, price: e.target.value}))} placeholder="0 = Free" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 focus:border-kerala-green bg-gray-50"/>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">{isMl ? 'ഇടം' : 'Capacity'}</label>
                <input type="number" value={form.capacity} onChange={e => setForm(f => ({...f, capacity: e.target.value}))} placeholder="Max attendees" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 focus:border-kerala-green bg-gray-50"/>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">{isMl ? 'കോൺടാക്ട് ഇ-മെയിൽ' : 'Contact Email'} *</label>
              <input type="email" value={form.contact_email} onChange={e => setForm(f => ({...f, contact_email: e.target.value}))} placeholder="your@email.com" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 focus:border-kerala-green bg-gray-50"/>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">{isMl ? 'ഫോൺ' : 'Contact Phone'}</label>
              <input type="tel" value={form.contact_phone} onChange={e => setForm(f => ({...f, contact_phone: e.target.value}))} placeholder="+971..." className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 focus:border-kerala-green bg-gray-50"/>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">{isMl ? 'ഇവന്റ് വിവരണം' : 'Description'}</label>
              <textarea value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} rows={3} placeholder={isMl ? 'ഇവന്റ് കുറിച്ച് വിവരിക്കൂ...' : 'Tell us about your event...'} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 focus:border-kerala-green bg-gray-50 resize-none"/>
            </div>
            {err && <p className="text-red-500 text-xs">{err}</p>}
            <div className="flex gap-3 pt-1">
              <button onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">{isMl ? 'റദ്ദാക്കൂ' : 'Cancel'}</button>
              <button onClick={handleSubmit} disabled={saving} className="flex-1 px-4 py-2.5 bg-kerala-gold text-white rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2">
                {saving ? <><Loader2 size={14} className="animate-spin"/>{isMl ? 'അയക്കുന്നു...' : 'Submitting...'}</> : (isMl ? 'ഇവന്റ് ചേർക്കൂ' : 'Submit Event')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function EventsPage() {
  const locale = useLocale()
  const isMl = locale === 'ml'
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [selectedEmirate, setSelectedEmirate] = useState('All Emirates')
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid'>('all')
  const [showFilters, setShowFilters] = useState(false)
  const [allEvents, setAllEvents] = useState<MalayaliEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [showSubmit, setShowSubmit] = useState(false)

  useEffect(() => {
    getEvents({ limit: 100 }).then(items => { setAllEvents(items); setLoading(false) })
  }, [])

  const featured = useMemo(() => allEvents.find(e => e.featured) ?? allEvents[0], [allEvents])

  const isDefaultView = activeCategory === 'all' && !query && selectedEmirate === 'All Emirates' && priceFilter === 'all'

  const filtered = useMemo(() => {
    let list = [...allEvents]

    if (activeCategory !== 'all') {
      list = list.filter(e => e.category === activeCategory)
    }
    if (query) {
      const q = query.toLowerCase()
      list = list.filter(e =>
        e.title.toLowerCase().includes(q) ||
        (e.title_ml ?? '').includes(q) ||
        e.tags.some(t => t.toLowerCase().includes(q)) ||
        (e.venue ?? '').toLowerCase().includes(q)
      )
    }
    if (selectedEmirate !== 'All Emirates') {
      list = list.filter(e => e.emirate === selectedEmirate)
    }
    if (priceFilter === 'free') list = list.filter(e => e.price === null)
    else if (priceFilter === 'paid') list = list.filter(e => e.price !== null)

    return list.sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())
  }, [allEvents, query, activeCategory, selectedEmirate, priceFilter])

  return (
    <main className="min-h-screen bg-kerala-cream">
      <Navbar />

      {/* Page Header */}
      <div className="bg-kerala-deep pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-white/40 text-xs mb-4">
            <span>{isMl ? 'ഹോം' : 'Home'}</span>
            <span>/</span>
            <span className="text-kerala-gold-light">{isMl ? 'ഇവന്റുകൾ' : 'Events'}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
                {isMl ? 'ഇവന്റുകൾ' : 'Events'}
              </h1>
              <p className="text-white/60 text-base">
                {isMl
                  ? 'യുഎഇ മുഴുവൻ മലയാളി ഇവന്റുകൾ കണ്ടെത്തൂ'
                  : 'Discover Malayali events across the UAE'}
              </p>
            </div>
            <Link href={`/events/new`} className="self-start sm:self-auto flex items-center gap-2 bg-kerala-gold text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-kerala-gold-light transition-all text-sm">
              <Calendar size={16} />
              {isMl ? 'ഇവന്റ് ചേർക്കൂ' : 'Submit Event'}
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Search + Filter Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={isMl ? 'ഇവന്റ് തിരയൂ...' : 'Search events...'}
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 focus:border-kerala-green"
              />
              {query && (
                <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="relative hidden sm:block">
              <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <select
                value={selectedEmirate}
                onChange={e => setSelectedEmirate(e.target.value)}
                className="pl-8 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-kerala-green/30 appearance-none cursor-pointer"
              >
                {emirates.map((em, i) => (
                  <option key={em} value={em}>{isMl ? emiratesMl[i] : em}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                showFilters ? 'bg-kerala-green text-white border-kerala-green' : 'border-gray-200 text-gray-600 hover:border-kerala-green hover:text-kerala-green'
              }`}
            >
              <Filter size={15} />
              {isMl ? 'ഫിൽട്ടർ' : 'Filters'}
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-3">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{isMl ? 'വില' : 'Price'}</p>
                <div className="flex gap-2">
                  {(['all', 'free', 'paid'] as const).map(p => (
                    <button
                      key={p}
                      onClick={() => setPriceFilter(p)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        priceFilter === p
                          ? 'bg-kerala-green text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {p === 'all' ? (isMl ? 'എല്ലാം' : 'All') : p === 'free' ? (isMl ? 'സൗജന്യം' : 'Free') : (isMl ? 'പണം നൽകണം' : 'Paid')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {categoryTabs.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                activeCategory === cat.key
                  ? 'bg-kerala-green text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-kerala-green hover:text-kerala-green'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{isMl ? cat.labelMl : cat.label}</span>
            </button>
          ))}
        </div>

        {/* Featured Event Banner */}
        {isDefaultView && featured && <FeaturedEventBanner event={featured} isMl={isMl} />}

        {/* Results header */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-gray-500">
            {isMl
              ? `${filtered.length} ഇവന്റുകൾ`
              : `${filtered.length} event${filtered.length !== 1 ? 's' : ''} found`}
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Tag size={13} />
            {isMl ? 'തീയതി അനുസരിച്ച്' : 'Sorted by date'}
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-100" />
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                  <div className="h-5 bg-gray-100 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white border border-gray-200 flex items-center justify-center mb-4">
              <Calendar size={28} className="text-gray-300" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-kerala-deep mb-2">
              {isMl ? 'ഇവന്റുകൾ കണ്ടെത്തിയില്ല' : 'No events found'}
            </h3>
            <p className="text-gray-500 text-sm mb-5">{isMl ? 'ഫിൽട്ടറുകൾ മാറ്റി ശ്രമിക്കൂ' : 'Try adjusting your filters'}</p>
            <button
              onClick={() => { setQuery(''); setActiveCategory('all'); setSelectedEmirate('All Emirates'); setPriceFilter('all') }}
              className="bg-kerala-green text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-kerala-green-light"
            >
              {isMl ? 'ഫിൽട്ടർ നീക്കൂ' : 'Clear filters'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(event => (
              <EventCard key={event.id} event={event} isMl={isMl} />
            ))}
          </div>
        )}

        {/* Submit Event CTA */}
        <div className="mt-12 rounded-3xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-kerala-deep via-kerala-deep to-kerala-green" />
          <div className="relative px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-serif text-2xl md:text-3xl font-bold text-white mb-2">
                {isMl ? 'ഒരു ഇവന്റ് സംഘടിപ്പിക്കുന്നോ?' : 'Organizing an Event?'}
              </h3>
              <p className="text-white/70 text-sm max-w-md">
                {isMl
                  ? '15,000+ മലയാളി കമ്മ്യൂണിറ്റി അംഗങ്ങളിലേക്ക് നിങ്ങളുടെ ഇവന്റ് പ്രചരിപ്പിക്കൂ'
                  : 'Promote your event to 15,000+ Malayali community members across the UAE'}
              </p>
            </div>
            <button
              onClick={() => setShowSubmit(true)}
              className="flex items-center gap-2 bg-kerala-gold hover:bg-kerala-gold-light text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg whitespace-nowrap flex-shrink-0"
            >
              <Calendar size={16} />
              {isMl ? 'ഇവന്റ് ചേർക്കൂ' : 'Submit Your Event'}
            </button>
          </div>
        </div>

        {/* Submit Event Modal */}
        {showSubmit && <SubmitEventModal isMl={isMl} onClose={() => setShowSubmit(false)} />}
      </div>

      <Footer />
    </main>
  )
}
