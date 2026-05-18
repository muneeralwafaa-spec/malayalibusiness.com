'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { useParams } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import {
  MapPin, Calendar, Clock, Users, Tag, Copy,
  CheckCircle, Ticket, Building2, Globe,
  MessageCircle, User, ArrowLeft, ExternalLink
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Speaker {
  name: string
  nameMl: string
  role: string
  roleMl: string
  photo: string
}

interface AgendaItem {
  time: string
  title: string
  titleMl: string
  speaker: string
}

interface EventItem {
  id: string
  title: string
  titleMl: string
  date: string
  endDate: string
  location: string
  locationMl: string
  venue: string
  venueMl: string
  emirate: string
  category: string
  categoryMl: string
  price: number
  free: boolean
  capacity: number
  registered: number
  image: string
  description: string
  descriptionMl: string
  organizer: string
  organizerLogo: string
  speakers: Speaker[]
  agenda: AgendaItem[]
  tags: string[]
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockEvents: EventItem[] = [
  {
    id: 'kerala-business-summit-2025',
    title: 'Kerala Business Summit UAE 2025',
    titleMl: 'കേരള ബിസിനസ് സമ്മിറ്റ് യുഎഇ 2025',
    date: '2025-09-15T09:00:00',
    endDate: '2025-09-15T18:00:00',
    location: 'Dubai, UAE',
    locationMl: 'ദുബായ്, യുഎഇ',
    venue: 'Dubai World Trade Centre, Hall 7',
    venueMl: 'ദുബായ് വേൾഡ് ട്രേഡ് സെന്റർ, ഹാൾ 7',
    emirate: 'Dubai',
    category: 'Business',
    categoryMl: 'ബിസിനസ്',
    price: 150,
    free: false,
    capacity: 500,
    registered: 342,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1400&q=80',
    description: 'The Kerala Business Summit UAE 2025 is the most anticipated annual gathering of Malayali entrepreneurs, investors, and business leaders across the UAE. This landmark event brings together over 500 visionaries to forge connections, share insights, and celebrate the remarkable achievements of the Malayali business community.\n\nThis year\'s summit focuses on the theme "New Horizons: Building Tomorrow\'s Enterprises Today." Attendees will gain access to exclusive panel discussions, one-on-one networking sessions, and inspiring keynote addresses from industry titans who have built successful ventures from Dubai to Silicon Valley.\n\nThe event features dedicated segments for startups seeking funding, established businesses exploring expansion, and professionals looking to elevate their careers. Whether you are a seasoned entrepreneur or just beginning your business journey, the Kerala Business Summit offers unparalleled opportunities to grow, learn, and connect with the who\'s who of the UAE Malayali business world.',
    descriptionMl: 'കേരള ബിസിനസ് സമ്മിറ്റ് യുഎഇ 2025 - യുഎഇയിലെ മലയാളി സംരംഭകർ, നിക്ഷേപകർ, ബിസിനസ് നേതാക്കൾ എന്നിവരുടെ ഏറ്റവും പ്രതീക്ഷിക്കപ്പെടുന്ന വാർഷിക സംഗമം. ഈ ചരിത്രപ്രധാനമായ ഇവന്റ് 500-ലധികം ദർശകരെ ഒരുമിപ്പിക്കുന്നു - ബന്ധങ്ങൾ ഉണ്ടാക്കാനും, ഉൾക്കാഴ്ചകൾ പങ്കിടാനും, മലയാളി ബിസിനസ് സമൂഹത്തിന്റെ അസാധാരണ നേട്ടങ്ങൾ ആഘോഷിക്കാനും.\n\nഈ വർഷത്തെ സമ്മിറ്റ് "പുതിയ ചക്രവാളങ്ങൾ: ഇന്ന് നാളത്തെ സംരംഭങ്ങൾ കെട്ടിപ്പടുക്കൽ" എന്ന വിഷയത്തിൽ ശ്രദ്ധ കേന്ദ്രീകരിക്കുന്നു. പങ്കെടുക്കുന്നവർക്ക് എക്‌സ്‌ക്ലൂസിവ് പാനൽ ചർച്ചകൾ, നെറ്റ്‌വർക്കിംഗ് സെഷനുകൾ, പ്രചോദനാത്മക കീനോട്ട് പ്രഭാഷണങ്ങൾ എന്നിവ ലഭ്യമാകും.\n\nഇവന്റ് ഫണ്ടിംഗ് തേടുന്ന സ്റ്റാർട്ടപ്പുകൾക്ക്, വിപുലീകരണം പരിശോധിക്കുന്ന സ്ഥാപിത ബിസിനസുകൾക്ക്, കരിയർ ഉയർത്താൻ ആഗ്രഹിക്കുന്ന പ്രൊഫഷണലുകൾക്ക് സമർപ്പിത വിഭാഗങ്ങൾ ഉൾക്കൊള്ളുന്നു.',
    organizer: 'Kerala Business Council UAE',
    organizerLogo: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=100&q=80',
    speakers: [
      {
        name: 'Rajan Mathew',
        nameMl: 'രാജൻ മാത്യു',
        role: 'CEO, Gulf Ventures Group',
        roleMl: 'സിഇഒ, ഗൾഫ് വെഞ്ചേഴ്‌സ് ഗ്രൂപ്പ്',
        photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&q=80',
      },
      {
        name: 'Priya Nair',
        nameMl: 'പ്രിയ നായർ',
        role: 'Founder, TechKerala Innovations',
        roleMl: 'സ്ഥാപകൻ, ടെക്കേരള ഇന്നൊവേഷൻസ്',
        photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&q=80',
      },
      {
        name: 'Suresh Menon',
        nameMl: 'സുരേഷ് മേനോൻ',
        role: 'Managing Director, Emirates Trade Corp',
        roleMl: 'മാനേജിംഗ് ഡയറക്ടർ, എമിറേറ്റ്‌സ് ട്രേഡ് കോർപ്',
        photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&q=80',
      },
      {
        name: 'Aneeta Krishnan',
        nameMl: 'അനീത കൃഷ്ണൻ',
        role: 'Partner, Keralam Capital',
        roleMl: 'പാർട്ണർ, കേരളം കാപിറ്റൽ',
        photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&q=80',
      },
    ],
    agenda: [
      { time: '09:00', title: 'Registration & Networking Breakfast', titleMl: 'രജിസ്ട്രേഷൻ & നെറ്റ്‌വർക്കിംഗ് പ്രഭാതഭക്ഷണം', speaker: '' },
      { time: '10:00', title: 'Opening Ceremony & Welcome Address', titleMl: 'ഉദ്ഘാടന ചടങ്ങ് & സ്വാഗത പ്രഭാഷണം', speaker: 'Rajan Mathew' },
      { time: '10:45', title: 'Keynote: The Future of Malayali Business in the UAE', titleMl: 'കീനോട്ട്: യുഎഇയിൽ മലയാളി ബിസിനസിന്റെ ഭാവി', speaker: 'Priya Nair' },
      { time: '12:00', title: 'Panel Discussion: Scaling Startups in the Gulf', titleMl: 'പാനൽ ചർച്ച: ഗൾഫിൽ സ്റ്റാർട്ടപ്പുകൾ വളർത്തൽ', speaker: 'All Speakers' },
      { time: '13:30', title: 'Networking Lunch', titleMl: 'നെറ്റ്‌വർക്കിംഗ് ഉച്ചഭക്ഷണം', speaker: '' },
      { time: '14:30', title: 'Breakout Session: Investment Opportunities', titleMl: 'ബ്രേക്ക്ഔട്ട് സെഷൻ: നിക്ഷേപ അവസരങ്ങൾ', speaker: 'Aneeta Krishnan' },
      { time: '16:00', title: 'Startup Pitch Competition Finals', titleMl: 'സ്റ്റാർട്ടപ്പ് പിച്ച് മത്സരം ഫൈനൽ', speaker: 'Suresh Menon' },
      { time: '17:30', title: 'Awards Ceremony & Closing Remarks', titleMl: 'അവാർഡ് ദാനവും സമാപന പ്രഭാഷണവും', speaker: 'Rajan Mathew' },
    ],
    tags: ['Business', 'Networking', 'Entrepreneurship', 'Investment', 'UAE', 'Kerala'],
  },
  {
    id: 'onam-festival-dubai-2025',
    title: 'Grand Onam Celebration Dubai 2025',
    titleMl: 'ഗ്രാൻഡ് ഓണം ആഘോഷം ദുബായ് 2025',
    date: '2025-09-05T17:00:00',
    endDate: '2025-09-05T23:00:00',
    location: 'Dubai, UAE',
    locationMl: 'ദുബായ്, യുഎഇ',
    venue: 'Zabeel Park Amphitheatre',
    venueMl: 'സബീൽ പാർക്ക് ആംഫിതിയേറ്റർ',
    emirate: 'Dubai',
    category: 'Cultural',
    categoryMl: 'സാംസ്കാരിക',
    price: 0,
    free: true,
    capacity: 2000,
    registered: 1456,
    image: 'https://images.unsplash.com/photo-1574482620826-40685ca5ebd2?w=1400&q=80',
    description: 'Join thousands of Malayalis across Dubai for the most spectacular Onam celebration outside Kerala! The Grand Onam Celebration 2025 at Zabeel Park promises an unforgettable evening of culture, tradition, and community joy.\n\nExperience the magic of Kerala through live Kathakali and Mohiniyattam performances, the rhythmic beats of Chenda Melam, and the visual splendor of Pookalam competitions. The evening culminates with a grand Onasadya — the traditional Kerala feast — prepared by master chefs from Kerala.\n\nBring your family and immerse yourself in the authentic sights, sounds, and flavors of Onam. Free entry for all. Children\'s activities, cultural games, and traditional attire competitions make this the perfect family outing.',
    descriptionMl: 'ദുബായിൽ ആയിരക്കണക്കിന് മലയാളികൾ ഒത്തുചേർന്ന് കേരളത്തിന് പുറത്ത് ഏറ്റവും ഗംഭീരമായ ഓണം ആഘോഷിക്കൂ! സബീൽ പാർക്കിലെ ഗ്രാൻഡ് ഓണം ആഘോഷം 2025 സംസ്കാരം, പാരമ്പര്യം, സമൂഹ സന്തോഷം എന്നിവയുടെ അവിസ്മരണീയ സന്ധ്യ വാഗ്ദാനം ചെയ്യുന്നു.\n\nലൈവ് കഥകളി, മോഹിനിയാട്ടം, ചെണ്ടമേളം, പൂക്കള മത്സരങ്ങൾ എന്നിവയിലൂടെ കേരളത്തിന്റെ മാജിക് അനുഭവിക്കൂ. കേരളത്തിൽ നിന്നുള്ള മാസ്റ്റർ ഷഫ്‌സ് തയ്യാറാക്കിയ ഓണസദ്യയോടെ സന്ധ്യ പരിസമാപ്തിയാകും.\n\nനിങ്ങളുടെ കുടുംബത്തെ കൊണ്ടുവരൂ, ഓണത്തിന്റെ യഥാർത്ഥ കാഴ്ചകളിൽ, ശബ്ദങ്ങളിൽ, രുചികളിൽ ലയിക്കൂ. എല്ലാവർക്കും സൗജന്യ പ്രവേശനം.',
    organizer: 'Dubai Malayali Association',
    organizerLogo: 'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=100&q=80',
    speakers: [
      {
        name: 'Jayachandran Pillai',
        nameMl: 'ജയചന്ദ്രൻ പിള്ള',
        role: 'President, Dubai Malayali Association',
        roleMl: 'പ്രസിഡന്റ്, ദുബായ് മലയാളി അസോസിയേഷൻ',
        photo: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=300&q=80',
      },
      {
        name: 'Revathi Nambiar',
        nameMl: 'രേവതി നമ്പ്യാർ',
        role: 'Classical Dance Performer',
        roleMl: 'ക്ലാസിക്കൽ നൃത്ത കലാകാരി',
        photo: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=300&q=80',
      },
      {
        name: 'Mohan Das',
        nameMl: 'മോഹൻ ദാസ്',
        role: 'Chief Guest, Kerala Tourism',
        roleMl: 'മുഖ്യ അതിഥി, കേരള ടൂറിസം',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80',
      },
    ],
    agenda: [
      { time: '17:00', title: 'Pookalam Competition', titleMl: 'പൂക്കള മത്സരം', speaker: '' },
      { time: '18:00', title: 'Welcome Address & Lamp Lighting', titleMl: 'സ്വാഗത പ്രഭാഷണം & ദീപ്തപ്രകാശനം', speaker: 'Jayachandran Pillai' },
      { time: '18:30', title: 'Kathakali Performance', titleMl: 'കഥകളി അവതരണം', speaker: '' },
      { time: '19:30', title: 'Mohiniyattam Recital', titleMl: 'മോഹിനിയാട്ടം', speaker: 'Revathi Nambiar' },
      { time: '20:30', title: 'Grand Onasadya', titleMl: 'ഗ്രാൻഡ് ഓണസദ്യ', speaker: '' },
      { time: '22:00', title: 'Closing Cultural Programme', titleMl: 'സമാപന സാംസ്കാരിക പരിപാടി', speaker: '' },
    ],
    tags: ['Onam', 'Cultural', 'Festival', 'Kerala', 'Family', 'Free'],
  },
  {
    id: 'malayali-tech-meetup-abudhabi',
    title: 'Malayali Tech Professionals Meetup',
    titleMl: 'മലയാളി ടെക് പ്രൊഫഷണൽ മീറ്റ്',
    date: '2025-10-10T18:30:00',
    endDate: '2025-10-10T21:30:00',
    location: 'Abu Dhabi, UAE',
    locationMl: 'അബുദാബി, യുഎഇ',
    venue: 'Hub71, ADGM Square',
    venueMl: 'ഹബ്71, എഡിജിഎം സ്ക്വയർ',
    emirate: 'Abu Dhabi',
    category: 'Technology',
    categoryMl: 'സാങ്കേതികവിദ്യ',
    price: 50,
    free: false,
    capacity: 150,
    registered: 87,
    image: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=1400&q=80',
    description: 'A premier networking and knowledge-sharing event for Malayali technology professionals across the UAE. Connect with engineers, developers, data scientists, and tech leaders who are shaping the digital future of the region.\n\nThis meetup features lightning talks from senior engineers working at FAANG companies, startups, and government tech initiatives. Topics span AI/ML, cloud architecture, fintech innovations, and cybersecurity — all through the lens of real-world UAE implementations.\n\nBeyond the talks, the structured networking format ensures every attendee makes at least five meaningful connections. Bring your business cards and come ready to share your experience with fellow Malayali tech innovators.',
    descriptionMl: 'യുഎഇ മലയാളി ടെക് പ്രൊഫഷണലുകൾക്കുള്ള പ്രീമിയർ നെറ്റ്‌വർക്കിംഗ്, നോളേജ് ഷെയറിംഗ് ഇവന്റ്. ഈ മേഖലയുടെ ഡിജിറ്റൽ ഭാവി രൂപപ്പെടുത്തുന്ന എഞ്ചിനീയർമാർ, ഡെവലപ്പർമാർ, ഡാറ്റ സയന്റിസ്റ്റുകൾ, ടെക് നേതാക്കൾ എന്നിവരുമായി ബന്ധപ്പെടൂ.\n\nഈ മീറ്റ്‌അപ്പ് FAANG കമ്പനികളിൽ, സ്റ്റാർട്ടപ്പുകളിൽ, ഗവൺമെന്റ് ടെക് സംരംഭങ്ങളിൽ പ്രവർത്തിക്കുന്ന മുതിർന്ന എഞ്ചിനീയർമാരുടെ ലൈറ്റ്‌നിംഗ് ടോക്കുകൾ അവതരിപ്പിക്കുന്നു.',
    organizer: 'UAE Malayali Tech Network',
    organizerLogo: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&q=80',
    speakers: [
      {
        name: 'Anil Kumar',
        nameMl: 'അനിൽ കുമാർ',
        role: 'Senior Engineer, Google',
        roleMl: 'സീനിയർ എഞ്ചിനീയർ, ഗൂഗിൾ',
        photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80',
      },
      {
        name: 'Divya Raj',
        nameMl: 'ദിവ്യ രാജ്',
        role: 'AI Lead, Emirates NBD',
        roleMl: 'എഐ ലീഡ്, എമിറേറ്റ്‌സ് എൻബിഡി',
        photo: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&q=80',
      },
      {
        name: 'Vishnu Prasad',
        nameMl: 'വിഷ്ണു പ്രസാദ്',
        role: 'CTO, Fintech Startup Dubai',
        roleMl: 'സിടിഒ, ഫിൻടെക് സ്റ്റാർട്ടപ്പ് ദുബായ്',
        photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80',
      },
    ],
    agenda: [
      { time: '18:30', title: 'Registration & Networking', titleMl: 'രജിസ്ട്രേഷൻ & നെറ്റ്‌വർക്കിംഗ്', speaker: '' },
      { time: '19:00', title: 'Keynote: AI in UAE Finance', titleMl: 'കീനോട്ട്: യുഎഇ ഫിനാൻസിൽ എഐ', speaker: 'Divya Raj' },
      { time: '19:30', title: 'Lightning Talk: Cloud Architecture Patterns', titleMl: 'ലൈറ്റ്‌നിംഗ് ടോക്ക്: ക്ലൗഡ് ആർകിടെക്ചർ', speaker: 'Anil Kumar' },
      { time: '20:00', title: 'Panel: Building Startups in the UAE', titleMl: 'പാനൽ: യുഎഇയിൽ സ്റ്റാർട്ടപ്പ് കെട്ടിപ്പടുക്കൽ', speaker: 'All Speakers' },
      { time: '20:45', title: 'Open Networking & Refreshments', titleMl: 'ഓപ്പൺ നെറ്റ്‌വർക്കിംഗ് & ലഘുഭക്ഷണം', speaker: '' },
    ],
    tags: ['Technology', 'AI', 'Networking', 'Startups', 'Engineering'],
  },
  {
    id: 'kerala-food-festival-sharjah',
    title: 'Kerala Food & Culture Festival Sharjah',
    titleMl: 'കേരള ഭക്ഷണ & സംസ്കാര മേള ഷാർജ',
    date: '2025-11-22T11:00:00',
    endDate: '2025-11-22T22:00:00',
    location: 'Sharjah, UAE',
    locationMl: 'ഷാർജ, യുഎഇ',
    venue: 'Al Majaz Waterfront',
    venueMl: 'അൽ മജാസ് വാട്ടർഫ്രണ്ട്',
    emirate: 'Sharjah',
    category: 'Food & Culture',
    categoryMl: 'ഭക്ഷണം & സംസ്കാരം',
    price: 0,
    free: true,
    capacity: 3000,
    registered: 1234,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1400&q=80',
    description: 'A vibrant celebration of Kerala\'s rich culinary heritage and cultural diversity at the stunning Al Majaz Waterfront. Sample authentic Kerala dishes from over 30 food stalls, watch live cooking demonstrations by award-winning chefs, and enjoy cultural performances throughout the day.\n\nFrom the spicy flavors of Malabar fish curry to the delicate sweetness of palada payasam, the festival showcases the full spectrum of Kerala\'s incredible cuisine. Local artisans will display traditional crafts, handloom textiles, and Kasavu sarees.\n\nLive music performances featuring traditional Kerala instruments, modern fusion concerts, and a dedicated children\'s zone make this a perfect day out for the whole family.',
    descriptionMl: 'ആൽ മജാസ് വാട്ടർഫ്രണ്ടിൽ കേരളത്തിന്റെ സമ്പന്നമായ പാചക പൈതൃകത്തിന്റെയും സാംസ്കാരിക വൈവിധ്യത്തിന്റെയും ഉജ്ജ്വലമായ ആഘോഷം. 30-ലധികം ഭക്ഷണ സ്റ്റാളുകളിൽ നിന്ന് ആധികാരിക കേരള ഭക്ഷണം രുചിക്കൂ, ലൈവ് കുക്കിംഗ് ഡെമോകൾ കാണൂ, ദിവസം മുഴുവൻ സാംസ്കാരിക പ്രകടനങ്ങൾ ആസ്വദിക്കൂ.',
    organizer: 'Sharjah Keralites Forum',
    organizerLogo: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=100&q=80',
    speakers: [
      { name: 'Chef Biju Menon', nameMl: 'ഷെഫ് ബിജു മേനോൻ', role: 'Award-winning Kerala Chef', roleMl: 'പുരസ്കൃത കേരള ഷെഫ്', photo: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=300&q=80' },
      { name: 'Latha Suresh', nameMl: 'ലത സുരേഷ്', role: 'Cultural Programme Director', roleMl: 'സാംസ്കാരിക പരിപാടി ഡയറക്ടർ', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=80' },
    ],
    agenda: [
      { time: '11:00', title: 'Festival Opens', titleMl: 'മേള ആരംഭം', speaker: '' },
      { time: '12:00', title: 'Live Cooking Demo: Malabar Biryani', titleMl: 'ലൈവ് കുക്കിംഗ് ഡെമോ: മലബാർ ബിരിയാണി', speaker: 'Chef Biju Menon' },
      { time: '14:00', title: 'Cultural Performances Begin', titleMl: 'സാംസ്കാരിക പ്രദർശനം ആരംഭം', speaker: 'Latha Suresh' },
      { time: '19:00', title: 'Evening Concert', titleMl: 'സന്ധ്യാ കച്ചേരി', speaker: '' },
      { time: '21:00', title: 'Fireworks & Closing', titleMl: 'വടക്കൻ & സമാപ്തി', speaker: '' },
    ],
    tags: ['Food', 'Culture', 'Kerala', 'Festival', 'Family', 'Free'],
  },
  {
    id: 'malayali-womens-empowerment-forum',
    title: 'Malayali Women\'s Empowerment Forum UAE',
    titleMl: 'മലയാളി വനിതാ ശാക്തീകരണ ഫോറം യുഎഇ',
    date: '2025-08-28T09:00:00',
    endDate: '2025-08-28T17:00:00',
    location: 'Dubai, UAE',
    locationMl: 'ദുബായ്, യുഎഇ',
    venue: 'Intercontinental Dubai Festival City',
    venueMl: 'ഇന്റർകോണ്ടിനെന്റൽ ദുബായ് ഫെസ്റ്റിവൽ സിറ്റി',
    emirate: 'Dubai',
    category: 'Empowerment',
    categoryMl: 'ശാക്തീകരണം',
    price: 75,
    free: false,
    capacity: 200,
    registered: 178,
    image: 'https://images.unsplash.com/photo-1591522811280-a8758970b03f?w=1400&q=80',
    description: 'A transformative one-day forum dedicated to celebrating and empowering Malayali women across the UAE. Hear powerful stories of resilience, leadership, and innovation from women who have broken barriers in business, technology, healthcare, and the arts.\n\nThe forum features panel discussions on work-life balance in the Gulf, entrepreneurship for women, navigating cultural expectations while building careers, and mental health in the expatriate community. Workshop sessions offer practical tools for salary negotiation, building personal brands, and accessing funding for women-led businesses.\n\nThis is more than an event — it is a movement. Join 200 inspiring Malayali women and leave with a stronger network, fresh perspectives, and renewed purpose.',
    descriptionMl: 'യുഎഇയിലെ മലയാളി സ്ത്രീകളെ ആഘോഷിക്കാനും ശക്തിപ്പെടുത്താനുമുള്ള ഒരു ദിവസത്തെ ഫോറം. ബിസിനസ്, ടെക്‌നോളജി, ആരോഗ്യ സംരക്ഷണം, കലകൾ എന്നിവയിൽ തടസ്സങ്ങൾ തകർത്ത സ്ത്രീകളിൽ നിന്ന് ശക്തിയുടെ, നേതൃത്വത്തിന്റെ, നവീകരണത്തിന്റെ ശക്തമായ കഥകൾ കേൾക്കൂ.',
    organizer: 'Malayali Women Network UAE',
    organizerLogo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
    speakers: [
      { name: 'Dr. Meera Joseph', nameMl: 'ഡോ. മീര ജോസഫ്', role: 'Surgeon & Entrepreneur', roleMl: 'സർജൻ & സംരംഭക', photo: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=300&q=80' },
      { name: 'Nisha Thomas', nameMl: 'നിഷ തോമസ്', role: 'COO, Emaar Properties', roleMl: 'സിഒഒ, എമ്മാർ പ്രോപ്പർട്ടീസ്', photo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=300&q=80' },
      { name: 'Remya Vijayan', nameMl: 'രേമ്യ വിജയൻ', role: 'Founder, WomenTech Arabia', roleMl: 'സ്ഥാപക, വിമൻടെക്ക് അറേബ്യ', photo: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=300&q=80' },
    ],
    agenda: [
      { time: '09:00', title: 'Registration & Breakfast Networking', titleMl: 'രജിസ്ട്രേഷൻ & പ്രഭാത നെറ്റ്‌വർക്കിംഗ്', speaker: '' },
      { time: '10:00', title: 'Opening Keynote: Breaking Barriers', titleMl: 'ഓപ്പണിംഗ് കീനോട്ട്: തടസ്സങ്ങൾ തകർക്കൽ', speaker: 'Dr. Meera Joseph' },
      { time: '11:30', title: 'Panel: Women in Leadership', titleMl: 'പാനൽ: നേതൃത്വത്തിൽ സ്ത്രീകൾ', speaker: 'Nisha Thomas' },
      { time: '14:00', title: 'Workshop: Building Your Personal Brand', titleMl: 'വർക്ക്ഷോപ്പ്: നിങ്ങളുടെ പ്രൊഫഷണൽ ബ്രാൻഡ്', speaker: 'Remya Vijayan' },
      { time: '16:00', title: 'Closing Ceremony & Awards', titleMl: 'സമാപന ചടങ്ങ് & അവാർഡുകൾ', speaker: '' },
    ],
    tags: ['Women', 'Empowerment', 'Leadership', 'Business', 'Networking'],
  },
  {
    id: 'malayali-cricket-tournament-2025',
    title: 'UAE Malayali Premier Cricket League 2025',
    titleMl: 'യുഎഇ മലയാളി പ്രീമിയർ ക്രിക്കറ്റ് ലീഗ് 2025',
    date: '2025-10-25T07:00:00',
    endDate: '2025-10-25T20:00:00',
    location: 'Sharjah, UAE',
    locationMl: 'ഷാർജ, യുഎഇ',
    venue: 'Sharjah Cricket Stadium',
    venueMl: 'ഷാർജ ക്രിക്കറ്റ് സ്റ്റേഡിയം',
    emirate: 'Sharjah',
    category: 'Sports',
    categoryMl: 'കായിക',
    price: 25,
    free: false,
    capacity: 1000,
    registered: 456,
    image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1400&q=80',
    description: 'The biggest Malayali cricket tournament in the UAE returns! 16 teams from across the seven emirates compete in a thrilling T20 format tournament at the iconic Sharjah Cricket Stadium.\n\nThis annual sporting extravaganza brings the Malayali community together in the spirit of sportsmanship and camaraderie. Teams represent communities from Dubai, Abu Dhabi, Sharjah, Ajman, Ras Al Khaimah, Fujairah, and Umm Al Quwain.\n\nSpectators enjoy a full day of cricket, food stalls serving Kerala snacks, live commentary in both Malayalam and English, and prizes for the top teams. Entry tickets include access to the ground-level viewing areas and complimentary snacks.',
    descriptionMl: 'യുഎഇയിലെ ഏറ്റവും വലിയ മലയാളി ക്രിക്കറ്റ് ടൂർണ്ണമെന്റ് തിരിച്ചെത്തി! ഏഴ് എമിറേറ്റുകളിൽ നിന്നുള്ള 16 ടീമുകൾ ഐതിഹ്യ ഷാർജ ക്രിക്കറ്റ് സ്റ്റേഡിയത്തിൽ ത്രസിപ്പിക്കുന്ന T20 ഫോർമാറ്റ് ടൂർണ്ണമെന്റിൽ മത്സരിക്കുന്നു.',
    organizer: 'UAE Malayali Sports Association',
    organizerLogo: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=100&q=80',
    speakers: [
      { name: 'Manoj Thampi', nameMl: 'മനോജ് തമ്പി', role: 'Tournament Director', roleMl: 'ടൂർണ്ണമെന്റ് ഡയറക്ടർ', photo: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=300&q=80' },
      { name: 'Rajeev Nair', nameMl: 'രാജീവ് നായർ', role: 'Former Kerala Ranji Player', roleMl: 'മുൻ കേരള രഞ്ജി കളിക്കാരൻ', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80' },
    ],
    agenda: [
      { time: '07:00', title: 'Team Registration & Warm-up', titleMl: 'ടീം രജിസ്ട്രേഷൻ & വാം-അപ്പ്', speaker: '' },
      { time: '08:00', title: 'Opening Ceremony', titleMl: 'ഉദ്ഘാടന ചടങ്ങ്', speaker: 'Manoj Thampi' },
      { time: '09:00', title: 'Quarter Final Matches', titleMl: 'ക്വാർട്ടർ ഫൈനൽ മത്സരങ്ങൾ', speaker: '' },
      { time: '14:00', title: 'Semi Finals', titleMl: 'സെമി ഫൈനൽ', speaker: '' },
      { time: '17:00', title: 'Grand Final', titleMl: 'ഗ്രാൻഡ് ഫൈനൽ', speaker: '' },
      { time: '19:30', title: 'Awards Ceremony', titleMl: 'അവാർഡ് ദാനം', speaker: 'Rajeev Nair' },
    ],
    tags: ['Cricket', 'Sports', 'Tournament', 'T20', 'Kerala'],
  },
  {
    id: 'malayali-health-wellness-expo',
    title: 'Malayali Health & Wellness Expo',
    titleMl: 'മലയാളി ആരോഗ്യ & ക്ഷേമ എക്‌സ്‌പോ',
    date: '2025-12-05T09:00:00',
    endDate: '2025-12-05T20:00:00',
    location: 'Abu Dhabi, UAE',
    locationMl: 'അബുദാബി, യുഎഇ',
    venue: 'ADNEC Convention Centre',
    venueMl: 'എഡിഎൻഇസി കൺവൻഷൻ സെന്റർ',
    emirate: 'Abu Dhabi',
    category: 'Health',
    categoryMl: 'ആരോഗ്യം',
    price: 30,
    free: false,
    capacity: 800,
    registered: 312,
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1400&q=80',
    description: 'A comprehensive health and wellness exhibition bringing together Malayali healthcare professionals, traditional medicine practitioners, nutritionists, and fitness experts under one roof. Discover the best of both modern medicine and Kerala\'s ancient Ayurvedic traditions.\n\nAttend free health screenings, consultations with specialist Malayali doctors, and informative sessions on managing lifestyle diseases prevalent in the Gulf community. Special focus areas include diabetes management, heart health, mental wellness, and Ayurvedic approaches to common ailments.\n\nWellness vendors will showcase Kerala Ayurveda products, herbal medicines, yoga accessories, and health foods. This is your opportunity to take charge of your health journey with guidance from trusted Malayali medical professionals.',
    descriptionMl: 'മലയാളി ആരോഗ്യ പ്രൊഫഷണലുകൾ, പരമ്പരാഗത വൈദ്യ പ്രാക്ടീഷണർമാർ, പോഷകാഹാര വിദഗ്ധർ, ഫിറ്റ്‌നസ് എക്‌സ്‌പർട്ടുകൾ എന്നിവരെ ഒരൊറ്റ മേൽക്കൂരക്കീഴിൽ ഒരുമിപ്പിക്കുന്ന സമഗ്ര ആരോഗ്യ & ക്ഷേമ പ്രദർശനം.',
    organizer: 'Kerala Medical Association UAE',
    organizerLogo: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=100&q=80',
    speakers: [
      { name: 'Dr. Sunil George', nameMl: 'ഡോ. സുനിൽ ജോർജ്', role: 'Cardiologist, Cleveland Clinic AD', roleMl: 'ഹൃദ്രോഗ വിദഗ്ധൻ, ക്ലീവ്‌ലൻഡ് ക്ലിനിക്', photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&q=80' },
      { name: 'Vaidyan Krishnadas', nameMl: 'വൈദ്യൻ കൃഷ്ണദാസ്', role: 'Ayurveda Practitioner', roleMl: 'ആയുർവേദ വൈദ്യൻ', photo: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&q=80' },
    ],
    agenda: [
      { time: '09:00', title: 'Expo Opens & Free Screenings', titleMl: 'എക്‌സ്‌പോ തുറക്കുന്നു & സൗജന്യ സ്ക്രീനിംഗ്', speaker: '' },
      { time: '10:30', title: 'Talk: Heart Health in the Gulf', titleMl: 'ടോക്ക്: ഗൾഫിൽ ഹൃദയ ആരോഗ്യം', speaker: 'Dr. Sunil George' },
      { time: '13:00', title: 'Ayurveda Workshop', titleMl: 'ആയുർവേദ വർക്ക്ഷോപ്പ്', speaker: 'Vaidyan Krishnadas' },
      { time: '16:00', title: 'Panel: Mental Health in Expat Life', titleMl: 'പാനൽ: പ്രവാസ ജീവിതത്തിലെ മാനസികാരോഗ്യം', speaker: '' },
      { time: '19:00', title: 'Closing & Prize Distribution', titleMl: 'സമാപനം & സമ്മാന വിതരണം', speaker: '' },
    ],
    tags: ['Health', 'Wellness', 'Ayurveda', 'Medicine', 'Fitness'],
  },
  {
    id: 'malayali-music-night-rak',
    title: 'Malayali Music Night — Stars from Kerala',
    titleMl: 'മലയാളി സംഗീത രാത്രി — കേരളത്തിൽ നിന്ന് നക്ഷത്രങ്ങൾ',
    date: '2025-11-08T19:00:00',
    endDate: '2025-11-08T23:30:00',
    location: 'Ras Al Khaimah, UAE',
    locationMl: 'റാസ് അൽ ഖൈമ, യുഎഇ',
    venue: 'RAK Convention Centre',
    venueMl: 'റാക് കൺവൻഷൻ സെന്റർ',
    emirate: 'Ras Al Khaimah',
    category: 'Entertainment',
    categoryMl: 'വിനോദം',
    price: 100,
    free: false,
    capacity: 600,
    registered: 289,
    image: 'https://images.unsplash.com/photo-1501612780327-45045538702b?w=1400&q=80',
    description: 'An enchanting evening of live Malayalam music featuring celebrated playback singers and musicians direct from Kerala. This unforgettable concert brings the magic of Malayalam cinema music to the UAE for a one-night-only spectacular performance.\n\nThe setlist spans six decades of Malayalam film music — from timeless classics of the golden era to the latest chart-toppers. A 40-piece live orchestra accompanies the performances, creating an immersive sonic experience unlike any other.\n\nDress in traditional Kerala attire and celebrate the rich musical heritage of God\'s Own Country. This is your chance to relive favorite Malayalam songs live, far from home but never far from Kerala.',
    descriptionMl: 'കേരളത്തിൽ നിന്ന് നേരിട്ട് പ്രശസ്ത പ്ലേബാക്ക് ഗായകരും സംഗീതജ്ഞരും ഉൾക്കൊള്ളുന്ന ലൈവ് മലയാളം സംഗീതത്തിന്റെ മോഹന സന്ധ്യ. ഈ അവിസ്മരണീയ കച്ചേരി ഒരൊറ്റ രാത്രിക്ക് മലയാളം സിനിമ സംഗീതത്തിന്റെ മാജിക് യുഎഇയിലേക്ക് കൊണ്ടുവരുന്നു.',
    organizer: 'RAK Malayali Cultural Society',
    organizerLogo: 'https://images.unsplash.com/photo-1501612780327-45045538702b?w=100&q=80',
    speakers: [
      { name: 'Sujatha Mohan', nameMl: 'സുജാത മോഹൻ', role: 'Playback Singer', roleMl: 'പ്ലേബാക്ക് ഗായിക', photo: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=300&q=80' },
      { name: 'Harisankar', nameMl: 'ഹരിശങ്കർ', role: 'Music Composer', roleMl: 'സംഗീത സംവിധായകൻ', photo: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=300&q=80' },
    ],
    agenda: [
      { time: '19:00', title: 'Doors Open & Seating', titleMl: 'വാതിൽ തുറക്കൽ & ഇരിക്കൽ', speaker: '' },
      { time: '19:30', title: 'Classical Malayalam Medley', titleMl: 'ക്ലാസ്സിക്കൽ മലയാളം മെഡ്‌ലി', speaker: 'Sujatha Mohan' },
      { time: '20:30', title: 'Film Music Extravaganza', titleMl: 'ഫിലിം മ്യൂസിക് മഹോത്സവം', speaker: 'Harisankar' },
      { time: '21:30', title: 'Audience Interaction & Encore', titleMl: 'ഓഡിയൻസ് ഇന്ററാക്ഷൻ & എൻകോർ', speaker: 'All Artists' },
      { time: '23:00', title: 'Grand Finale & Curtain Call', titleMl: 'ഗ്രാൻഡ് ഫിനാലെ', speaker: '' },
    ],
    tags: ['Music', 'Entertainment', 'Malayalam', 'Cinema', 'Cultural'],
  },
]

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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EventDetailPage() {
  const locale = useLocale()
  const params = useParams()
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : ''

  const isMl = locale === 'ml'

  const event = useMemo(
    () => mockEvents.find((e) => e.id === id) ?? mockEvents[0],
    [id],
  )

  const countdown = useCountdown(event.date)

  const [langMl, setLangMl] = useState(isMl)
  const [copied, setCopied] = useState(false)
  const [regForm, setRegForm] = useState<RegForm>({ name: '', email: '', phone: '', tickets: 1 })
  const [regSubmitted, setRegSubmitted] = useState(false)
  const [regLoading, setRegLoading] = useState(false)

  const seatsLeft = event.capacity - event.registered
  const pctFilled = Math.round((event.registered / event.capacity) * 100)

  const dateObj = new Date(event.date)
  const formattedDate = dateObj.toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
  const formattedTime = dateObj.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

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

  const relatedEvents = mockEvents.filter((e) => e.id !== event.id && e.category === event.category).slice(0, 3)
    .concat(mockEvents.filter((e) => e.id !== event.id && e.category !== event.category))
    .slice(0, 3)

  return (
    <main className="min-h-screen bg-kerala-cream">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative h-96 w-full overflow-hidden">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-kerala-deep/90 via-kerala-deep/40 to-transparent" />

        {/* Category badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-kerala-green text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
            {isMl ? event.categoryMl : event.category}
          </span>
        </div>

        {/* Price badge */}
        <div className="absolute top-4 right-4">
          {event.free ? (
            <span className="bg-kerala-gold text-white text-xs font-bold px-3 py-1 rounded-full">FREE</span>
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
            {isMl ? event.titleMl : event.title}
          </h1>
          <div className="flex flex-wrap gap-4 text-white/80 text-sm">
            <span className="flex items-center gap-1"><Calendar size={14} /> {formattedDate}</span>
            <span className="flex items-center gap-1"><Clock size={14} /> {formattedTime}</span>
            <span className="flex items-center gap-1"><MapPin size={14} /> {isMl ? event.locationMl : event.location}</span>
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
                { val: countdown.days, label: isMl ? 'ദിവസം' : 'Days' },
                { val: countdown.hours, label: isMl ? 'മണിക്കൂർ' : 'Hours' },
                { val: countdown.minutes, label: isMl ? 'മിനിറ്റ്' : 'Mins' },
                { val: countdown.seconds, label: isMl ? 'സെക്കൻഡ്' : 'Secs' },
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
                <button
                  onClick={() => setLangMl(!langMl)}
                  className="text-xs bg-kerala-green/10 text-kerala-green border border-kerala-green/30 px-3 py-1.5 rounded-full hover:bg-kerala-green hover:text-white transition-colors font-semibold"
                >
                  {langMl ? 'English' : 'മലയാളം'}
                </button>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                {(langMl ? event.descriptionMl : event.description).split('\n\n').map((para, i) => (
                  <p key={i} className={langMl ? 'font-malayalam' : ''}>{para}</p>
                ))}
              </div>
            </section>

            {/* Speakers */}
            {event.speakers.length > 0 && (
              <section>
                <h2 className="font-serif text-2xl text-kerala-deep font-bold mb-6">
                  {isMl ? 'സ്പീക്കർമാർ' : 'Featured Speakers'}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {event.speakers.map((sp) => (
                    <div
                      key={sp.name}
                      className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                    >
                      <div className="relative w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden ring-2 ring-kerala-gold/30">
                        <Image src={sp.photo} alt={sp.name} fill className="object-cover" />
                      </div>
                      <p className="font-semibold text-kerala-deep text-sm">
                        {isMl ? sp.nameMl : sp.name}
                      </p>
                      <p className="text-gray-500 text-xs mt-1 leading-snug">
                        {isMl ? sp.roleMl : sp.role}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Agenda */}
            <section>
              <h2 className="font-serif text-2xl text-kerala-deep font-bold mb-6">
                {isMl ? 'ഷെഡ്യൂൾ' : 'Event Schedule'}
              </h2>
              <div className="relative">
                <div className="absolute left-16 top-0 bottom-0 w-0.5 bg-kerala-green/20" />
                <div className="space-y-4">
                  {event.agenda.map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-start">
                      <div className="w-14 shrink-0 text-right">
                        <span className="text-xs font-mono text-kerala-gold font-semibold">{item.time}</span>
                      </div>
                      <div className="relative flex-1 bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-kerala-green border-2 border-white shadow" />
                        <p className="font-semibold text-kerala-deep text-sm">
                          {isMl ? item.titleMl : item.title}
                        </p>
                        {item.speaker && (
                          <p className="text-gray-500 text-xs mt-0.5 flex items-center gap-1">
                            <User size={10} /> {item.speaker}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
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
                    <p className="text-kerala-deep font-semibold">{isMl ? event.venueMl : event.venue}</p>
                    <p className="text-gray-500 text-sm">{isMl ? event.locationMl : event.location}</p>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-kerala-deep">{isMl ? event.venueMl : event.venue}</p>
                    <p className="text-gray-500 text-sm">{isMl ? event.locationMl : event.location}</p>
                  </div>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.venue + ' ' + event.location)}`}
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
                  href={`https://wa.me/?text=${encodeURIComponent((isMl ? event.titleMl : event.title) + ' — ' + (typeof window !== 'undefined' ? window.location.href : ''))}`}
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
                    {event.free ? (isMl ? 'സൗജന്യ പ്രവേശനം' : 'Free Entry') : `AED ${event.price}`}
                  </span>
                  {event.free && (
                    <span className="bg-kerala-gold text-white text-xs font-bold px-2 py-1 rounded-full">FREE</span>
                  )}
                </div>
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
                    {!event.free && (
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
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <h3 className="font-semibold text-kerala-deep mb-3 text-sm uppercase tracking-wide">
                {isMl ? 'സംഘാടകൻ' : 'Organizer'}
              </h3>
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-kerala-cream ring-2 ring-kerala-gold/20 shrink-0">
                  <Image src={event.organizerLogo} alt={event.organizer} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-kerala-deep text-sm truncate">{event.organizer}</p>
                  <p className="text-gray-500 text-xs">{isMl ? 'ഓർഗനൈസർ' : 'Event Organizer'}</p>
                </div>
              </div>
              <button className="mt-3 w-full border border-kerala-green text-kerala-green text-sm py-2 rounded-lg hover:bg-kerala-green hover:text-white transition-colors font-semibold">
                {isMl ? 'പ്രൊഫൈൽ കാണൂ' : 'View Profile'}
              </button>
            </div>

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
                        <Image src={e.image} alt={e.title} fill className="object-cover group-hover:scale-105 transition-transform" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-kerala-deep group-hover:text-kerala-green transition-colors line-clamp-2 leading-snug">
                          {isMl ? e.titleMl : e.title}
                        </p>
                        <p className="text-gray-400 text-xs mt-1">
                          {new Date(e.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <h3 className="font-semibold text-kerala-deep mb-3 text-sm uppercase tracking-wide">
                {isMl ? 'ടാഗുകൾ' : 'Tags'}
              </h3>
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 bg-kerala-green/10 text-kerala-green text-xs px-3 py-1 rounded-full"
                  >
                    <Tag size={10} /> {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event info strip */}
      <div className="bg-kerala-deep/5 border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap gap-6 justify-center text-sm text-gray-600">
          <span className="flex items-center gap-2">
            <Building2 size={14} className="text-kerala-green" />
            {isMl ? event.venueMl : event.venue}
          </span>
          <span className="flex items-center gap-2">
            <Users size={14} className="text-kerala-green" />
            {event.capacity} {isMl ? 'ശേഷി' : 'capacity'}
          </span>
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
