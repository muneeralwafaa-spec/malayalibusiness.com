'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { Calendar, MapPin, Clock, Users, ArrowRight } from 'lucide-react'

const events = [
  {
    id: 1,
    title: 'Onam Celebration 2025',
    titleMl: 'ഓണം ആഘോഷം 2025',
    date: 'Sep 5, 2025',
    dateMl: 'സെപ്തംബർ 5, 2025',
    time: '6:00 PM',
    location: 'Dubai World Trade Centre',
    locationMl: 'ദുബായ് ലോക വ്യാപാര കേന്ദ്രം',
    category: 'Cultural',
    categoryMl: 'സാംസ്കാരിക',
    free: false,
    price: 'AED 50',
    attendees: 1200,
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&q=80&auto=format&fit=crop',
    featured: true,
  },
  {
    id: 2,
    title: 'Malayali Business Networking Night',
    titleMl: 'മലയാളി ബിസിനസ് നെറ്റ്‌വർക്കിംഗ് നൈറ്റ്',
    date: 'Aug 22, 2025',
    dateMl: 'ഓഗസ്റ്റ് 22, 2025',
    time: '7:30 PM',
    location: 'Jumeirah Beach Hotel',
    locationMl: 'ജുമൈറ ബീച്ച് ഹോട്ടൽ',
    category: 'Networking',
    categoryMl: 'നെറ്റ്‌വർക്കിംഗ്',
    free: false,
    price: 'AED 75',
    attendees: 350,
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&q=80&auto=format&fit=crop',
    featured: false,
  },
  {
    id: 3,
    title: 'Kerala Food Festival',
    titleMl: 'കേരള ഫുഡ് ഫെസ്റ്റിവൽ',
    date: 'Aug 30, 2025',
    dateMl: 'ഓഗസ്റ്റ് 30, 2025',
    time: '5:00 PM',
    location: 'Sharjah Expo Centre',
    locationMl: 'ഷാർജ എക്സ്പോ സെന്റർ',
    category: 'Food',
    categoryMl: 'ഭക്ഷണം',
    free: true,
    price: 'Free',
    attendees: 800,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&q=80&auto=format&fit=crop',
    featured: false,
  },
  {
    id: 4,
    title: 'Malayali Entrepreneurs Summit',
    titleMl: 'മലയാളി സംരംഭക ഉച്ചകോടി',
    date: 'Sep 15, 2025',
    dateMl: 'സെപ്തംബർ 15, 2025',
    time: '9:00 AM',
    location: 'Museum of the Future, Dubai',
    locationMl: 'മ്യൂസിയം ഓഫ് ദ ഫ്യൂച്ചർ, ദുബായ്',
    category: 'Business',
    categoryMl: 'ബിസിനസ്',
    free: false,
    price: 'AED 120',
    attendees: 500,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80&auto=format&fit=crop',
    featured: true,
  },
  {
    id: 5,
    title: 'Thiruvathira & Traditional Arts Night',
    titleMl: 'തിരുവാതിര & പരമ്പരാഗത കലകൾ',
    date: 'Sep 28, 2025',
    dateMl: 'സെപ്തംബർ 28, 2025',
    time: '8:00 PM',
    location: 'Indian Community Centre, Abu Dhabi',
    locationMl: 'ഇന്ത്യൻ കമ്മ്യൂണിറ്റി സെന്റർ, അബുദാബി',
    category: 'Cultural',
    categoryMl: 'സാംസ്കാരിക',
    free: false,
    price: 'AED 40',
    attendees: 420,
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&q=80&auto=format&fit=crop',
    featured: false,
  },
]

const categoryColors: Record<string, string> = {
  Cultural: 'bg-pink-100 text-pink-700',
  Networking: 'bg-blue-100 text-blue-700',
  Food: 'bg-orange-100 text-orange-700',
  Business: 'bg-green-100 text-green-700',
}

export default function EventsSection() {
  const locale = useLocale()
  const isMl = locale === 'ml'

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

        {/* Events Grid — big card + grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Big Feature Event */}
          <Link
            href={`/${locale}/events/${events[0].id}`}
            className="group lg:col-span-3 relative overflow-hidden rounded-3xl h-72 lg:h-auto card-hover"
          >
            <Image
              src={events[0].image}
              alt={events[0].title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="bg-kerala-red text-white text-xs font-bold px-3 py-1 rounded-full">
                {isMl ? 'ഫീച്ചർഡ്' : 'Featured'}
              </span>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${categoryColors[events[0].category] || 'bg-gray-100 text-gray-700'}`}>
                {isMl ? events[0].categoryMl : events[0].category}
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-center gap-4 text-white/70 text-sm mb-3">
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-kerala-gold" />
                  {isMl ? events[0].dateMl : events[0].date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={14} className="text-kerala-gold" />
                  {events[0].time}
                </span>
              </div>
              <h3 className="font-serif text-3xl font-bold text-white mb-2">
                {isMl ? events[0].titleMl : events[0].title}
              </h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-white/70 text-sm">
                  <MapPin size={14} />
                  {isMl ? events[0].locationMl : events[0].location}
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-white/60 text-xs">
                    <Users size={13} />
                    {events[0].attendees.toLocaleString()}
                  </span>
                  <span className="bg-kerala-gold text-white text-sm font-bold px-4 py-1.5 rounded-full">
                    {events[0].free ? (isMl ? 'സൗജന്യം' : 'Free') : events[0].price}
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Right Sidebar Events */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {events.slice(1, 5).map((event) => (
              <Link
                key={event.id}
                href={`/${locale}/events/${event.id}`}
                className="group flex gap-4 bg-kerala-cream hover:bg-white rounded-2xl overflow-hidden p-3 card-hover border border-transparent hover:border-gray-100"
              >
                <div className="relative w-24 h-20 rounded-xl overflow-hidden flex-shrink-0">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="96px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${categoryColors[event.category] || 'bg-gray-100 text-gray-700'}`}>
                      {isMl ? event.categoryMl : event.category}
                    </span>
                    {event.free ? (
                      <span className="text-xs font-bold text-kerala-green">
                        {isMl ? 'സൗജന്യം' : 'Free'}
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-kerala-gold">{event.price}</span>
                    )}
                  </div>
                  <h4 className="font-semibold text-kerala-deep text-sm leading-snug group-hover:text-kerala-green transition-colors line-clamp-2 mb-1">
                    {isMl ? event.titleMl : event.title}
                  </h4>
                  <div className="flex items-center gap-1 text-gray-400 text-xs">
                    <Calendar size={11} />
                    {isMl ? event.dateMl : event.date}
                    <span className="mx-1">·</span>
                    <MapPin size={11} />
                    <span className="truncate">{isMl ? event.locationMl : event.location}</span>
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
