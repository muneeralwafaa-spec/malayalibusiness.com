'use client'

import Link from 'next/link'
import { useLocale } from 'next-intl'
import { useEffect, useState } from 'react'
import { Calendar, MapPin, Clock, Users, ArrowRight, Loader2 } from 'lucide-react'
import { getEvents } from '@/lib/events'
import type { MalayaliEvent } from '@/lib/events'

const categoryColors: Record<string, string> = {
  cultural:   'bg-pink-100 text-pink-700',
  networking: 'bg-blue-100 text-blue-700',
  food:       'bg-orange-100 text-orange-700',
  business:   'bg-green-100 text-green-700',
  sports:     'bg-cyan-100 text-cyan-700',
  education:  'bg-purple-100 text-purple-700',
}

function fmtDate(iso: string, isMl: boolean) {
  return new Date(iso).toLocaleDateString(isMl ? 'ml-IN' : 'en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

const FALLBACK = 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&q=80'

const EBASE = { description: null, description_ml: null, title_ml: null, emirate_ml: null, venue: null, venue_ml: null, capacity: null, organizer: null, organizer_id: null, tags: [], status: 'active' as const }
const PLACEHOLDER_EVENTS: MalayaliEvent[] = [
  { ...EBASE, id: 'pe1', title: 'Onam Grand Celebration 2025 — Dubai', category: 'cultural', event_date: new Date(Date.now() + 7 * 86400000).toISOString(), event_time: '06:00 PM', end_time: null, emirate: 'Dubai', price: null, registered: 320, image_url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80', featured: true, created_at: new Date().toISOString() },
  { ...EBASE, id: 'pe2', title: 'Malayali Business Networking Night', category: 'networking', event_date: new Date(Date.now() + 14 * 86400000).toISOString(), event_time: '07:00 PM', end_time: null, emirate: 'Dubai', price: 50, registered: 85, image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80', featured: false, created_at: new Date().toISOString() },
  { ...EBASE, id: 'pe3', title: 'Kerala Food Festival — Abu Dhabi', category: 'food', event_date: new Date(Date.now() + 21 * 86400000).toISOString(), event_time: '12:00 PM', end_time: null, emirate: 'Abu Dhabi', price: 30, registered: 150, image_url: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=600&q=80', featured: false, created_at: new Date().toISOString() },
  { ...EBASE, id: 'pe4', title: 'Malayali Entrepreneurs Summit 2025', category: 'business', event_date: new Date(Date.now() + 30 * 86400000).toISOString(), event_time: '09:00 AM', end_time: null, emirate: 'Sharjah', price: 100, registered: 200, image_url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&q=80', featured: false, created_at: new Date().toISOString() },
  { ...EBASE, id: 'pe5', title: 'Malayalam Movie Night — Sharjah', category: 'cultural', event_date: new Date(Date.now() + 5 * 86400000).toISOString(), event_time: '08:00 PM', end_time: null, emirate: 'Sharjah', price: 25, registered: 60, image_url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&q=80', featured: false, created_at: new Date().toISOString() },
]

export default function EventsSection() {
  const locale = useLocale()
  const isMl = locale === 'ml'
  const [events,  setEvents]  = useState<MalayaliEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getEvents({ upcoming: true, limit: 5 }).then(data => {
      if (data.length > 0) { setEvents(data); setLoading(false); return }
      getEvents({ limit: 5 }).then(all => {
        setEvents(all.length > 0 ? all : PLACEHOLDER_EVENTS)
        setLoading(false)
      })
    })
  }, [])

  if (loading) {
    return (
      <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex justify-center py-20">
          <Loader2 size={36} className="animate-spin text-kerala-green" />
        </div>
      </section>
    )
  }

  if (!events.length) return null

  const [main, ...rest] = events

  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-kerala-green font-semibold text-sm uppercase tracking-widest mb-2">
              {isMl ? 'ഇവന്റുകൾ' : 'Events'}
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-semibold text-kerala-deep">
              {isMl ? 'വരാനിരിക്കുന്ന ഇവന്റുകൾ' : 'Upcoming Events'}
            </h2>
            <p className="text-gray-500 mt-2">
              {isMl ? 'കമ്മ്യൂണിറ്റി കൂട്ടായ്മകൾ, സാംസ്കാരിക ആഘോഷങ്ങൾ' : 'Community gatherings, cultural celebrations & networking events'}
            </p>
          </div>
          <Link
            href={`/${locale}/events`}
            className="flex items-center gap-2 border border-kerala-green text-kerala-green hover:bg-kerala-green hover:text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-all whitespace-nowrap"
          >
            {isMl ? 'എല്ലാ ഇവന്റുകളും' : 'View All Events'}
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Featured big card */}
          <Link
            href={`/${locale}/events/${main.id}`}
            className="group lg:col-span-3 relative overflow-hidden rounded-3xl h-72 lg:h-auto card-hover"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={main.image_url || FALLBACK}
              alt={isMl ? (main.title_ml ?? main.title) : main.title}
              onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK }}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            <div className="absolute top-4 left-4 flex gap-2">
              {main.featured && (
                <span className="bg-kerala-red text-white text-xs font-bold px-3 py-1 rounded-full">
                  {isMl ? 'ഫീച്ചർഡ്' : 'Featured'}
                </span>
              )}
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${categoryColors[main.category] ?? 'bg-gray-100 text-gray-700'}`}>
                {main.category}
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-center gap-4 text-white/70 text-sm mb-3">
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-kerala-gold" />
                  {fmtDate(main.event_date, isMl)}
                </span>
                {main.event_time && (
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} className="text-kerala-gold" />
                    {main.event_time}
                  </span>
                )}
              </div>
              <h3 className="font-serif text-3xl font-bold text-white mb-2">
                {isMl ? (main.title_ml ?? main.title) : main.title}
              </h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-white/70 text-sm">
                  <MapPin size={14} />
                  {isMl ? (main.emirate_ml ?? main.emirate) : main.emirate}
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-white/60 text-xs">
                    <Users size={13} />
                    {main.registered}
                  </span>
                  <span className="bg-kerala-gold text-white text-sm font-bold px-4 py-1.5 rounded-full">
                    {main.price == null ? (isMl ? 'സൗജന്യം' : 'Free') : `AED ${main.price}`}
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Side cards */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {rest.slice(0, 4).map((event) => (
              <Link
                key={event.id}
                href={`/${locale}/events/${event.id}`}
                className="group flex gap-4 bg-kerala-cream hover:bg-white rounded-2xl overflow-hidden p-3 card-hover border border-transparent hover:border-gray-100"
              >
                <div className="relative w-24 h-20 rounded-xl overflow-hidden flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={event.image_url || FALLBACK}
                    alt={isMl ? (event.title_ml ?? event.title) : event.title}
                    onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK }}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${categoryColors[event.category] ?? 'bg-gray-100 text-gray-700'}`}>
                      {event.category}
                    </span>
                    <span className="text-xs font-bold text-kerala-gold">
                      {event.price == null ? (isMl ? 'സൗജന്യം' : 'Free') : `AED ${event.price}`}
                    </span>
                  </div>
                  <h4 className="font-semibold text-kerala-deep text-sm leading-snug group-hover:text-kerala-green transition-colors line-clamp-2 mb-1">
                    {isMl ? (event.title_ml ?? event.title) : event.title}
                  </h4>
                  <div className="flex items-center gap-1 text-gray-400 text-xs">
                    <Calendar size={11} />
                    {fmtDate(event.event_date, isMl)}
                    <span className="mx-1">·</span>
                    <MapPin size={11} />
                    <span className="truncate">{isMl ? (event.emirate_ml ?? event.emirate) : event.emirate}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
