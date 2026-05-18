'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import {
  Search, MapPin, Calendar, Clock, Users, Filter, ChevronDown,
  Star, Ticket, ArrowRight, X, Tag
} from 'lucide-react'

type EventCategory = 'all' | 'cultural' | 'networking' | 'food' | 'business' | 'sports' | 'education'

interface MalayaliEvent {
  id: string
  title: string
  titleMl: string
  description: string
  descriptionMl: string
  category: Exclude<EventCategory, 'all'>
  date: string
  time: string
  endTime: string
  emirate: string
  emirateMl: string
  venue: string
  venueMl: string
  price: number | 'free'
  capacity: number
  registered: number
  image: string
  organizer: string
  featured: boolean
  tags: string[]
}

const events: MalayaliEvent[] = [
  {
    id: 'onam-2025',
    title: 'Grand Onam Celebration 2025',
    titleMl: 'ഓണം ആഘോഷം 2025',
    description: 'Join thousands of Malayalis for the biggest Onam celebration in Dubai. Traditional Pookalam competition, Vallam Kali, Onasadya, cultural performances, and much more.',
    descriptionMl: 'ദുബായിലെ ഏറ്റവും വലിയ ഓണം ആഘോഷത്തിൽ ആയിരക്കണക്കിന് മലയാളികളോടൊപ്പം പങ്കുചേരൂ. പൂക്കളം, വള്ളം കളി, ഓണസദ്യ, സാംസ്കാരിക പ്രകടനങ്ങൾ.',
    category: 'cultural',
    date: '2025-09-06',
    time: '10:00 AM',
    endTime: '10:00 PM',
    emirate: 'Dubai',
    emirateMl: 'ദുബായ്',
    venue: 'Dubai World Trade Centre',
    venueMl: 'ദുബായ് വേൾഡ് ട്രേഡ് സെന്റർ',
    price: 'free',
    capacity: 5000,
    registered: 3847,
    image: 'https://images.unsplash.com/photo-1602491453631-e2a5ad90a131?w=1200&q=80&auto=format&fit=crop',
    organizer: 'Dubai Malayali Association',
    featured: true,
    tags: ['Onam', 'Cultural', 'Family', 'Free Entry'],
  },
  {
    id: 'kerala-business-summit',
    title: 'Kerala Business Summit 2025',
    titleMl: 'കേരള ബിസിനസ് സമ്മിറ്റ് 2025',
    description: 'Connect with 500+ Malayali entrepreneurs, investors, and business leaders. Keynote speeches, panel discussions, and networking dinner.',
    descriptionMl: '500-ലധികം മലയാളി സംരംഭകർ, നിക്ഷേപകർ, ബിസിനസ് നേതാക്കൾ. കീനോട്ട്, പാനൽ ചർച്ചകൾ.',
    category: 'business',
    date: '2025-10-15',
    time: '9:00 AM',
    endTime: '8:00 PM',
    emirate: 'Abu Dhabi',
    emirateMl: 'അബൂദബി',
    venue: 'ADNEC Convention Centre',
    venueMl: 'ADNEC കൺവെൻഷൻ സെന്റർ',
    price: 150,
    capacity: 500,
    registered: 312,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80&auto=format&fit=crop',
    organizer: 'Malayali Business Council UAE',
    featured: true,
    tags: ['Business', 'Networking', 'Investment', 'Leadership'],
  },
  {
    id: 'kerala-food-festival',
    title: 'Kerala Food Festival',
    titleMl: 'കേരള ഫുഡ് ഫെസ്റ്റിവൽ',
    description: 'A 3-day celebration of authentic Kerala cuisine featuring 50+ stalls, cooking competitions, chef masterclasses, and food photography contest.',
    descriptionMl: '50-ലധികം സ്റ്റോളുകളോടെ 3 ദിവസത്തെ കേരള ഭക്ഷണ ഉത്സവം. പാചക മത്സരം, ഫോട്ടോഗ്രഫി.',
    category: 'food',
    date: '2025-11-07',
    time: '12:00 PM',
    endTime: '11:00 PM',
    emirate: 'Sharjah',
    emirateMl: 'ഷാർജ',
    venue: 'Expo Centre Sharjah',
    venueMl: 'എക്സ്പോ സെന്റർ ഷാർജ',
    price: 25,
    capacity: 2000,
    registered: 1456,
    image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=1200&q=80&auto=format&fit=crop',
    organizer: 'Kerala Cuisine Society',
    featured: false,
    tags: ['Food', 'Culture', 'Family', 'Competition'],
  },
  {
    id: 'malayali-networking-night',
    title: 'Malayali Professionals Networking Night',
    titleMl: 'മലയാളി പ്രൊഫഷണൽസ് നെറ്റ്വർക്കിംഗ്',
    description: 'Monthly networking event for Malayali professionals in tech, finance, healthcare, and engineering. Speed networking, elevator pitches, and cocktail dinner.',
    descriptionMl: 'ടെക്, ഫിനാൻസ്, ഹെൽത്ത്കെയർ, എഞ്ചിനീയറിംഗ് മേഖലകളിലെ മലയാളി പ്രൊഫഷണലുകൾ.',
    category: 'networking',
    date: '2025-09-19',
    time: '7:00 PM',
    endTime: '10:30 PM',
    emirate: 'Dubai',
    emirateMl: 'ദുബായ്',
    venue: 'La Ville Hotel & Suites',
    venueMl: 'ലാ വില്ലെ ഹോട്ടൽ',
    price: 75,
    capacity: 150,
    registered: 98,
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&q=80&auto=format&fit=crop',
    organizer: 'Malayali Professionals UAE',
    featured: false,
    tags: ['Networking', 'Professional', 'Tech', 'Finance'],
  },
  {
    id: 'vishu-celebrations',
    title: 'Vishu Celebrations & Cultural Night',
    titleMl: 'വിഷു ആഘോഷവും സാംസ്കാരിക രാത്രിയും',
    description: 'Traditional Vishu celebrations with Vishukkani, cultural performances by renowned Kerala artists, Vishu Sadya, and family entertainment.',
    descriptionMl: 'വിഷുക്കണി, കേരള കലാകാരന്മാരുടെ സാംസ്കാരിക പ്രകടനങ്ങൾ, വിഷുസദ്യ.',
    category: 'cultural',
    date: '2026-04-14',
    time: '5:00 PM',
    endTime: '11:00 PM',
    emirate: 'Dubai',
    emirateMl: 'ദുബായ്',
    venue: 'Madinat Jumeirah',
    venueMl: 'മദീനത്ത് ജുമൈറ',
    price: 50,
    capacity: 800,
    registered: 423,
    image: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?w=1200&q=80&auto=format&fit=crop',
    organizer: 'Kerala Cultural Association Dubai',
    featured: false,
    tags: ['Vishu', 'Cultural', 'Family', 'Traditional'],
  },
  {
    id: 'malayali-startup-pitch',
    title: 'Malayali Startup Pitch Night',
    titleMl: 'മലയാളി സ്റ്റാർട്ടപ്പ് പിച്ച് നൈറ്റ്',
    description: 'Top 10 Malayali startups pitch to a panel of investors. AED 100,000 in funding up for grabs. Open for public viewing.',
    descriptionMl: '10 മലയാളി സ്റ്റാർട്ടപ്പുകൾ നിക്ഷേപകർക്ക് മുന്നിൽ. 1 ലക്ഷം ദിർഹം ഫണ്ടിംഗ്.',
    category: 'business',
    date: '2025-10-28',
    time: '6:00 PM',
    endTime: '10:00 PM',
    emirate: 'Dubai',
    emirateMl: 'ദുബായ്',
    venue: 'In5 Tech Innovation Centre',
    venueMl: 'In5 ടെക് ഇന്നൊവേഷൻ സെന്റർ',
    price: 'free',
    capacity: 300,
    registered: 287,
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200&q=80&auto=format&fit=crop',
    organizer: 'Startup Malayali',
    featured: false,
    tags: ['Startup', 'Investment', 'Innovation', 'Tech'],
  },
  {
    id: 'kerala-arts-exhibition',
    title: 'Kerala Arts & Crafts Exhibition',
    titleMl: 'കേരള കലാ & കരകൗശല പ്രദർശനം',
    description: 'A 5-day exhibition showcasing traditional Kerala arts including Kathakali, Mohiniyattam paintings, Theyyam masks, and handloomed textiles.',
    descriptionMl: 'കഥകളി, മോഹിനിയാട്ടം, തെയ്യം, കൈത്തറി തുടങ്ങിയ കലകൾ.',
    category: 'cultural',
    date: '2025-12-10',
    time: '10:00 AM',
    endTime: '9:00 PM',
    emirate: 'Abu Dhabi',
    emirateMl: 'അബൂദബി',
    venue: 'Louvre Abu Dhabi Grounds',
    venueMl: 'ലൂവ്‌ർ അബൂദബി',
    price: 30,
    capacity: 1000,
    registered: 234,
    image: 'https://images.unsplash.com/photo-1578301978018-3005759f48f7?w=1200&q=80&auto=format&fit=crop',
    organizer: 'Kerala Cultural Foundation',
    featured: false,
    tags: ['Art', 'Culture', 'Exhibition', 'Handicrafts'],
  },
  {
    id: 'malayali-cricket-tournament',
    title: 'Malayali Premier League Cricket',
    titleMl: 'മലയാളി പ്രീമിയർ ലീഗ് ക്രിക്കറ്റ്',
    description: '16-team cricket tournament for Malayali expats. Day & night matches, trophy presentation, after-match dinner.',
    descriptionMl: 'മലയാളി പ്രവാസികൾക്കായി 16 ടീം ക്രിക്കറ്റ് ടൂർണമെന്റ്.',
    category: 'sports',
    date: '2025-10-03',
    time: '7:00 AM',
    endTime: '8:00 PM',
    emirate: 'Dubai',
    emirateMl: 'ദുബായ്',
    venue: 'ICC Cricket Academy',
    venueMl: 'ICC ക്രിക്കറ്റ് അക്കാദമി',
    price: 'free',
    capacity: 2000,
    registered: 1234,
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1200&q=80&auto=format&fit=crop',
    organizer: 'Malayali Sports Club UAE',
    featured: false,
    tags: ['Cricket', 'Sports', 'Tournament', 'Family'],
  },
  {
    id: 'kerala-education-fair',
    title: 'Kerala Education & Study Abroad Fair',
    titleMl: 'കേരള വിദ്യാഭ്യാസ & വിദേശ പഠന മേള',
    description: 'Connect with 40+ top Indian and international universities. Scholarship information, visa guidance, and direct admissions. Free counselling.',
    descriptionMl: '40-ലധികം ഇന്ത്യൻ, അന്തർദ്ദേശീയ സർവ്വകലാശാലകൾ. സ്കോളർഷിപ്പ്, വിസ മാർഗ്ഗനിർദ്ദേശം.',
    category: 'education',
    date: '2025-09-27',
    time: '10:00 AM',
    endTime: '6:00 PM',
    emirate: 'Dubai',
    emirateMl: 'ദുബായ്',
    venue: 'Dubai International Convention Centre',
    venueMl: 'ദുബായ് ഇന്റർനാഷണൽ കൺവെൻഷൻ സെന്റർ',
    price: 'free',
    capacity: 3000,
    registered: 1876,
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80&auto=format&fit=crop',
    organizer: 'Kerala Education Council',
    featured: false,
    tags: ['Education', 'Universities', 'Scholarship', 'Students'],
  },
]

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
  const daysUntil = getDaysUntil(event.date)
  const isFull = event.registered >= event.capacity

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1 flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 backdrop-blur-sm text-kerala-deep text-xs font-semibold px-3 py-1 rounded-full capitalize">
            {categoryTabs.find(c => c.key === event.category)?.[isMl ? 'labelMl' : 'label']}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          {event.price === 'free' ? (
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
          {isMl ? event.titleMl : event.title}
        </h3>

        <div className="space-y-1.5 mb-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar size={13} className="text-kerala-green flex-shrink-0" />
            <span>{formatDate(event.date, isMl)}</span>
            <span className="text-gray-300">·</span>
            <Clock size={13} className="text-kerala-green flex-shrink-0" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MapPin size={13} className="text-kerala-green flex-shrink-0" />
            <span className="truncate">{isMl ? event.venueMl : event.venue}, {isMl ? event.emirateMl : event.emirate}</span>
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
          <SeatsBar registered={event.registered} capacity={event.capacity} />
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
                : event.price === 'free'
                  ? (isMl ? 'രജിസ്റ്റർ ചെയ്യൂ' : 'Register Free')
                  : (isMl ? 'ടിക്കറ്റ് വാങ്ങൂ' : 'Get Tickets')}
            </button>
            <Link
              href={`/en/events/${event.id}`}
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
  const daysUntil = getDaysUntil(event.date)
  const spotsLeft = event.capacity - event.registered

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-8">
      <div className="relative h-[420px] md:h-[480px]">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-kerala-deep/90 via-kerala-deep/60 to-transparent" />
      </div>

      <div className="absolute inset-0 flex items-center">
        <div className="px-8 md:px-12 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-kerala-gold text-white text-xs font-bold px-3 py-1.5 rounded-full mb-4">
            <Star size={12} fill="white" />
            {isMl ? 'ഫീച്ചേഡ് ഇവന്റ്' : 'Featured Event'}
          </div>

          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
            {isMl ? event.titleMl : event.title}
          </h2>
          <p className="text-white/75 text-sm md:text-base leading-relaxed mb-5 max-w-lg line-clamp-2">
            {isMl ? event.descriptionMl : event.description}
          </p>

          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <Calendar size={15} className="text-kerala-gold-light" />
              <span>{formatDate(event.date, isMl)}</span>
            </div>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <Clock size={15} className="text-kerala-gold-light" />
              <span>{event.time} – {event.endTime}</span>
            </div>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <MapPin size={15} className="text-kerala-gold-light" />
              <span>{isMl ? event.venueMl : event.venue}</span>
            </div>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <Users size={15} className="text-kerala-gold-light" />
              <span>{spotsLeft.toLocaleString()} {isMl ? 'സ്ഥലം ബാക്കി' : 'spots left'}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-kerala-gold hover:bg-kerala-gold-light text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg">
              <Ticket size={16} />
              {event.price === 'free'
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

export default function EventsPage() {
  const locale = useLocale()
  const isMl = locale === 'ml'
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [selectedEmirate, setSelectedEmirate] = useState('All Emirates')
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid'>('all')
  const [showFilters, setShowFilters] = useState(false)

  const featured = useMemo(() => events.find(e => e.featured) ?? events[0], [])

  const isDefaultView = activeCategory === 'all' && !query && selectedEmirate === 'All Emirates' && priceFilter === 'all'

  const filtered = useMemo(() => {
    let list = [...events]

    if (activeCategory !== 'all') {
      list = list.filter(e => e.category === activeCategory)
    }
    if (query) {
      const q = query.toLowerCase()
      list = list.filter(e =>
        e.title.toLowerCase().includes(q) ||
        e.titleMl.includes(q) ||
        e.tags.some(t => t.toLowerCase().includes(q)) ||
        e.venue.toLowerCase().includes(q)
      )
    }
    if (selectedEmirate !== 'All Emirates') {
      list = list.filter(e => e.emirate === selectedEmirate)
    }
    if (priceFilter === 'free') list = list.filter(e => e.price === 'free')
    else if (priceFilter === 'paid') list = list.filter(e => e.price !== 'free')

    return list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [query, activeCategory, selectedEmirate, priceFilter])

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
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-2">
                {isMl ? 'ഇവന്റുകൾ' : 'Events'}
              </h1>
              <p className="text-white/60 text-base">
                {isMl
                  ? 'യുഎഇ മുഴുവൻ മലയാളി ഇവന്റുകൾ കണ്ടെത്തൂ'
                  : 'Discover Malayali events across the UAE'}
              </p>
            </div>
            <button className="self-start sm:self-auto flex items-center gap-2 bg-kerala-gold text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-kerala-gold-light transition-all text-sm">
              <Calendar size={16} />
              {isMl ? 'ഇവന്റ് ചേർക്കൂ' : 'Submit Event'}
            </button>
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
        {isDefaultView && <FeaturedEventBanner event={featured} isMl={isMl} />}

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
        {filtered.length === 0 ? (
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
            <div className="flex items-center gap-3 flex-shrink-0">
              <button className="flex items-center gap-2 bg-kerala-gold hover:bg-kerala-gold-light text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg whitespace-nowrap">
                <Calendar size={16} />
                {isMl ? 'ഇവന്റ് ചേർക്കൂ' : 'Submit Your Event'}
              </button>
              <button className="flex items-center gap-2 border border-white/30 text-white px-5 py-3 rounded-xl text-sm font-medium hover:bg-white/10 transition-all whitespace-nowrap">
                {isMl ? 'കൂടുതൽ അറിയൂ' : 'Learn More'}
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
