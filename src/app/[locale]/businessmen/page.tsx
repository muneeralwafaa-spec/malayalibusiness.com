'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import {
  Search, MapPin, BadgeCheck, Briefcase, Filter, ChevronDown,
  Star, ArrowRight, Award, Users, Building2, TrendingUp, X, Plus
} from 'lucide-react'

interface Businessman {
  id: number
  username: string
  name: string
  nameMl: string
  title: string
  titleMl: string
  photo: string
  businessName: string
  businessNameMl: string
  industry: string
  industryMl: string
  emirate: string
  emirateMl: string
  yearsInBusiness: number
  verified: boolean
  featured: boolean
  employees: string
  businessCount: number
  countries: number
  turnover: string
  bio: string
  bioMl: string
  achievements: string[]
  achievementsMl: string[]
  tags: string[]
}

const businessmen: Businessman[] = [
  {
    id: 1,
    username: 'rajannair',
    name: 'Rajan Nair',
    nameMl: 'രാജൻ നായർ',
    title: 'Chairman & Founder',
    titleMl: 'ചെയർമാൻ & സ്ഥാപകൻ',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80&auto=format&fit=crop&crop=faces',
    businessName: 'Nair Group of Companies',
    businessNameMl: 'നായർ ഗ്രൂപ്പ് ഓഫ് കമ്പനീസ്',
    industry: 'Real Estate',
    industryMl: 'റിയൽ എസ്റ്റേറ്റ്',
    emirate: 'Dubai',
    emirateMl: 'ദുബായ്',
    yearsInBusiness: 22,
    verified: true,
    featured: true,
    employees: '500+',
    businessCount: 6,
    countries: 4,
    turnover: 'AED 180M+',
    bio: 'Pioneer Malayali entrepreneur in UAE real estate. Built a diversified portfolio spanning property development, hospitality, and construction across 4 countries.',
    bioMl: 'UAE റിയൽ എസ്റ്റേറ്റിലെ മുൻനിര മലയാളി സംരംഭകൻ. 4 രാജ്യങ്ങളിൽ പ്രോപ്പർടി, ഹോസ്പിറ്റാലിറ്റി, നിർമ്മാണ ബിസിനസുകൾ.',
    achievements: ['CNBC Arabia Business Leader 2022', 'Forbes Middle East Top 50', 'Pravasi Bharatiya Samman Award'],
    achievementsMl: ['CNBC അറേബ്യ ബിസിനസ് ലീഡർ 2022', 'ഫോർബ്സ് മിഡിൽ ഈസ്റ്റ് ടോപ് 50', 'പ്രവാസി ഭാരതീയ സമ്മാൻ'],
    tags: ['Real Estate', 'Construction', 'Hospitality'],
  },
  {
    id: 2,
    username: 'sureshmenon',
    name: 'Suresh Menon',
    nameMl: 'സുരേഷ് മേനോൻ',
    title: 'Managing Director',
    titleMl: 'മാനേജിംഗ് ഡയറക്ടർ',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80&auto=format&fit=crop&crop=faces',
    businessName: 'Menon Healthcare Group',
    businessNameMl: 'മേനോൻ ഹെൽത്ത്കെയർ ഗ്രൂപ്പ്',
    industry: 'Healthcare',
    industryMl: 'ആരോഗ്യ സേവനം',
    emirate: 'Abu Dhabi',
    emirateMl: 'അബുദാബി',
    yearsInBusiness: 18,
    verified: true,
    featured: true,
    employees: '1,200+',
    businessCount: 8,
    countries: 3,
    turnover: 'AED 320M+',
    bio: 'Visionary leader who transformed healthcare access for the Indian community in UAE. Operates 8 clinics and 2 hospitals across the Emirates.',
    bioMl: 'UAE-ൽ ഇന്ത്യൻ കമ്മ്യൂണിറ്റിക്ക് ആരോഗ്യ സേവനം ലഭ്യമാക്കിയ ദൂരദർശി. 8 ക്ലിനിക്കുകൾ, 2 ആശുപത്രികൾ.',
    achievements: ['UAE Healthcare Excellence Award 2023', 'Keralites Global Icon Award', 'ISO 9001 Certified Group'],
    achievementsMl: ['UAE ഹെൽത്ത്കെയർ Excellence Award 2023', 'കേരളൈറ്റ്സ് ഗ്ലോബൽ ഐക്കൺ', 'ISO 9001'],
    tags: ['Healthcare', 'Hospitals', 'Clinics'],
  },
  {
    id: 3,
    username: 'priyakrishna',
    name: 'Priya Krishna',
    nameMl: 'പ്രിയ കൃഷ്ണ',
    title: 'CEO & Co-Founder',
    titleMl: 'CEO & സഹ-സ്ഥാപക',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80&auto=format&fit=crop&crop=faces',
    businessName: 'TechVista Solutions',
    businessNameMl: 'ടെക്‌വിസ്റ്റ സൊലൂഷൻസ്',
    industry: 'Technology',
    industryMl: 'ടെക്നോളജി',
    emirate: 'Dubai',
    emirateMl: 'ദുബായ്',
    yearsInBusiness: 12,
    verified: true,
    featured: true,
    employees: '350+',
    businessCount: 3,
    countries: 5,
    turnover: 'AED 95M+',
    bio: 'Named among UAE\'s top 40 women in tech. Leads a pan-Gulf software firm delivering AI and enterprise solutions to Fortune 500 clients.',
    bioMl: 'UAE-ൽ ടെക്കിലെ ടോപ് 40 വനിതകളിൽ ഒരാൾ. AI, എന്റർപ്രൈസ് സൊലൂഷൻസ് Fortune 500 ക്ലൈന്റുകൾക്ക്.',
    achievements: ['Gulf Business Woman of the Year 2023', 'Dubai 10X Finalist', 'IIT Alumni Entrepreneur Award'],
    achievementsMl: ['ഗൾഫ് ബിസിനസ് വുമൻ ഓഫ് ദ ഇയർ 2023', 'ദുബായ് 10X ഫൈനലിസ്റ്റ്'],
    tags: ['Technology', 'AI', 'Software'],
  },
  {
    id: 4,
    username: 'abrahampillai',
    name: 'Abraham Pillai',
    nameMl: 'എബ്രഹാം പിള്ള',
    title: 'Group Chairman',
    titleMl: 'ഗ്രൂപ്പ് ചെയർമാൻ',
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80&auto=format&fit=crop&crop=faces',
    businessName: 'Pillai Trading Corporation',
    businessNameMl: 'പിള്ള ട്രേഡിംഗ് കോർപ്പറേഷൻ',
    industry: 'Finance',
    industryMl: 'ധനകാര്യം',
    emirate: 'Sharjah',
    emirateMl: 'ഷാർജ',
    yearsInBusiness: 28,
    verified: true,
    featured: false,
    employees: '800+',
    businessCount: 12,
    countries: 7,
    turnover: 'AED 500M+',
    bio: 'One of the UAE\'s longest-serving Malayali business leaders. Diversified portfolio spanning commodity trading, financial services, and logistics.',
    bioMl: 'UAE-ൽ ഏറ്റവും കൂടുതൽ കാലം സേവനം ചെയ്ത മലയാളി ബിസിനസ് ലീഡർ. കൊമ്മോഡിറ്റി, ഫിനാൻസ്, ലോജിസ്റ്റിക്സ്.',
    achievements: ['Sharjah Business Excellence Award', 'NRI of the Year – Mathrubhumi', 'CICI Lifetime Achievement Award'],
    achievementsMl: ['ഷാർജ ബിസിനസ് Excellence Award', 'NRI of the Year – മാതൃഭൂമി'],
    tags: ['Finance', 'Trading', 'Logistics'],
  },
  {
    id: 5,
    username: 'divyathomas',
    name: 'Divya Thomas',
    nameMl: 'ദിവ്യ തോമസ്',
    title: 'Founder & Director',
    titleMl: 'സ്ഥാപക & ഡയറക്ടർ',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80&auto=format&fit=crop&crop=faces',
    businessName: 'EduBridge Institute',
    businessNameMl: 'എഡ്യൂബ്രിഡ്ജ് ഇൻസ്റ്റിറ്റ്യൂട്ട്',
    industry: 'Education',
    industryMl: 'വിദ്യാഭ്യാസം',
    emirate: 'Dubai',
    emirateMl: 'ദുബായ്',
    yearsInBusiness: 10,
    verified: true,
    featured: false,
    employees: '250+',
    businessCount: 4,
    countries: 2,
    turnover: 'AED 45M+',
    bio: 'Pioneered Malayalam-medium supplementary education in UAE, serving 10,000+ students annually. Expanding to 15 UAE centres by 2026.',
    bioMl: 'UAE-ൽ മലയാളം-മീഡിയം സപ്ലിമെൻററി എഡ്യൂക്കേഷൻ. വാർഷികം 10,000+ വിദ്യാർത്ഥികൾ.',
    achievements: ['KHDA Outstanding Education Award 2022', 'Social Entrepreneur of the Year – Gulf News', 'Teach for India Fellow'],
    achievementsMl: ['KHDA Outstanding Education Award 2022', 'ഗൾഫ് ന്യൂസ് Social Entrepreneur'],
    tags: ['Education', 'Schools', 'EdTech'],
  },
  {
    id: 6,
    username: 'georgevarghese',
    name: 'George Varghese',
    nameMl: 'ജോർജ് വർഗ്ഗീസ്',
    title: 'Executive Chairman',
    titleMl: 'എക്സിക്യൂട്ടീവ് ചെയർമാൻ',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80&auto=format&fit=crop&crop=faces',
    businessName: 'Varghese Construction LLC',
    businessNameMl: 'വർഗ്ഗീസ് കൺസ്ട്രക്ഷൻ LLC',
    industry: 'Construction',
    industryMl: 'നിർമ്മാണം',
    emirate: 'Abu Dhabi',
    emirateMl: 'അബുദാബി',
    yearsInBusiness: 25,
    verified: true,
    featured: true,
    employees: '2,000+',
    businessCount: 5,
    countries: 3,
    turnover: 'AED 750M+',
    bio: 'Built some of Abu Dhabi\'s most iconic infrastructure. Known for delivering landmark projects across Abu Dhabi, including major government contracts.',
    bioMl: 'അബുദാബിയിലെ ഐക്കോണിക് ഇൻഫ്രാസ്ട്രക്ചർ. സർക്കാർ കരാർ ഉൾപ്പെടെ ലാൻഡ്മാർക്ക് പ്രൊജക്ടുകൾ.',
    achievements: ['Abu Dhabi Projects Excellence Award', 'UAE Contractor of the Year 2021', 'Knights of Columbus Award'],
    achievementsMl: ['അബുദാബി Projects Excellence Award', 'UAE Contractor of the Year 2021'],
    tags: ['Construction', 'Infrastructure', 'Engineering'],
  },
  {
    id: 7,
    username: 'moidinkutty',
    name: 'Moideen Kutty',
    nameMl: 'മൊയ്തീൻ കുട്ടി',
    title: 'Founder & CEO',
    titleMl: 'സ്ഥാപകൻ & CEO',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80&auto=format&fit=crop&crop=faces',
    businessName: 'Gulf Halal Foods',
    businessNameMl: 'ഗൾഫ് ഹലാൽ ഫുഡ്സ്',
    industry: 'Food & Beverage',
    industryMl: 'ഭക്ഷണം & പാനീയം',
    emirate: 'Dubai',
    emirateMl: 'ദുബായ്',
    yearsInBusiness: 20,
    verified: true,
    featured: false,
    employees: '600+',
    businessCount: 4,
    countries: 6,
    turnover: 'AED 220M+',
    bio: 'Transformed a single restaurant in Karama into a 6-country food empire. Gulf Halal Foods supplies to over 200 hotels and restaurants across the Middle East.',
    bioMl: 'കരാമയിലെ ഒരു റസ്റ്റോറന്റ് 6 രാജ്യ ഫുഡ് എംപയറായി. 200+ ഹോട്ടലുകൾ, റസ്റ്റോറന്റുകൾക്ക് സപ്ലൈ.',
    achievements: ['Gulf Food Excellence Award 2022', 'Dubai SME 100 – Ranked #12', 'Best Halal Brand ME 2023'],
    achievementsMl: ['ഗൾഫ് ഫുഡ് Excellence Award 2022', 'ദുബായ് SME 100 – #12'],
    tags: ['Food', 'Restaurants', 'Export'],
  },
  {
    id: 8,
    username: 'anjumohan',
    name: 'Anju Mohan',
    nameMl: 'അഞ്ജു മോഹൻ',
    title: 'Managing Partner',
    titleMl: 'മാനേജിംഗ് പാർട്ണർ',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80&auto=format&fit=crop&crop=faces',
    businessName: 'Anju Legal & Advisory',
    businessNameMl: 'അഞ്ജു ലീഗൽ & അഡ്വൈസറി',
    industry: 'Legal',
    industryMl: 'നിയമ സേവനം',
    emirate: 'Dubai',
    emirateMl: 'ദുബായ്',
    yearsInBusiness: 15,
    verified: true,
    featured: false,
    employees: '80+',
    businessCount: 2,
    countries: 2,
    turnover: 'AED 28M+',
    bio: 'Senior legal counsel with expertise in UAE corporate law, NRI property rights, and cross-border business disputes. Regular speaker at DIFC legal forums.',
    bioMl: 'UAE കോർപ്പറേറ്റ് ലോ, NRI പ്രോപ്പർടി, ബിസിനസ് ഡിസ്പ്യൂട്ടുകളിൽ സീനിയർ ലീഗൽ കൺസൽ.',
    achievements: ['DIFC Distinguished Counsel Award', 'Top 50 Lawyers UAE – ALB', 'Kerala Bar Council Excellence'],
    achievementsMl: ['DIFC Distinguished Counsel Award', 'Top 50 Lawyers UAE – ALB'],
    tags: ['Legal', 'Corporate Law', 'NRI Advisory'],
  },
  {
    id: 9,
    username: 'balachandran',
    name: 'K.R. Balachandran',
    nameMl: 'K.R. ബാലചന്ദ്രൻ',
    title: 'Group CEO',
    titleMl: 'ഗ്രൂപ്പ് CEO',
    photo: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=400&q=80&auto=format&fit=crop&crop=faces',
    businessName: 'KRB Hospitality Group',
    businessNameMl: 'KRB ഹോസ്പിറ്റാലിറ്റി ഗ്രൂപ്പ്',
    industry: 'Hospitality',
    industryMl: 'ഹോസ്പിറ്റാലിറ്റി',
    emirate: 'Dubai',
    emirateMl: 'ദുബായ്',
    yearsInBusiness: 16,
    verified: true,
    featured: true,
    employees: '900+',
    businessCount: 7,
    countries: 4,
    turnover: 'AED 290M+',
    bio: 'Built the UAE\'s leading Malayali hospitality brand — 7 hotels and 14 restaurants across the Gulf, with a vision to bring Kerala\'s unique hospitality to the world.',
    bioMl: 'UAE-ലെ മുൻനിര മലയാളി ഹോസ്പിറ്റാലിറ്റി ബ്രാൻഡ്. 7 ഹോട്ടലുകൾ, 14 റസ്റ്റോറന്റുകൾ.',
    achievements: ['Time Out Dubai Best Hotel Group 2023', 'Arabian Hospitality Excellence', 'Kerala Tourism Ambassador'],
    achievementsMl: ['Time Out Dubai Best Hotel Group 2023', 'Kerala Tourism Ambassador'],
    tags: ['Hotels', 'Restaurants', 'Tourism'],
  },
  {
    id: 10,
    username: 'sreekumarvp',
    name: 'Sreekumar V.P.',
    nameMl: 'ശ്രീകുമാർ V.P.',
    title: 'Founder & Chairman',
    titleMl: 'സ്ഥാപകൻ & ചെയർമാൻ',
    photo: 'https://images.unsplash.com/photo-1560250097-0dc05a4f3ca3?w=400&q=80&auto=format&fit=crop&crop=faces',
    businessName: 'Sreekumar Logistics',
    businessNameMl: 'ശ്രീകുമാർ ലോജിസ്റ്റിക്സ്',
    industry: 'Logistics',
    industryMl: 'ലോജിസ്റ്റിക്സ്',
    emirate: 'Sharjah',
    emirateMl: 'ഷാർജ',
    yearsInBusiness: 21,
    verified: true,
    featured: false,
    employees: '700+',
    businessCount: 3,
    countries: 8,
    turnover: 'AED 160M+',
    bio: 'Connects Malayali exporters and traders across 8 countries via a comprehensive freight, customs, and last-mile delivery network.',
    bioMl: '8 രാജ്യങ്ങളിൽ ഫ്രൈറ്റ്, കസ്റ്റംസ്, ഡെലിവറി നെറ്റ്‌വർക്ക് വഴി മലയാളി ട്രേഡർമാരെ ബന്ധിപ്പിക്കുന്നു.',
    achievements: ['Sharjah Logistics Award 2022', 'FIATA Accredited Freight Forwarder', 'Top Exporter – Kerala Govt.'],
    achievementsMl: ['ഷാർജ ലോജിസ്റ്റിക്സ് Award 2022', 'FIATA Accredited', 'Kerala Govt. Top Exporter'],
    tags: ['Logistics', 'Freight', 'Customs'],
  },
  {
    id: 11,
    username: 'anilkumarps',
    name: 'Anil Kumar P.S.',
    nameMl: 'അനിൽ കുമാർ P.S.',
    title: 'Director',
    titleMl: 'ഡയറക്ടർ',
    photo: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&q=80&auto=format&fit=crop&crop=faces',
    businessName: 'Anil Motors & Auto',
    businessNameMl: 'അനിൽ മോട്ടോഴ്സ് & ഓട്ടോ',
    industry: 'Automotive',
    industryMl: 'ഓട്ടോമോട്ടീവ്',
    emirate: 'Ras Al Khaimah',
    emirateMl: 'റാസ് അൽ ഖൈമ',
    yearsInBusiness: 14,
    verified: true,
    featured: false,
    employees: '120+',
    businessCount: 3,
    countries: 2,
    turnover: 'AED 65M+',
    bio: 'Leading automotive dealer and workshop owner in Northern Emirates. Expanded from a single garage to a multi-brand showroom and authorized service network.',
    bioMl: 'നോർദേൺ എമിറേറ്റ്സിലെ മുൻനിര ഓട്ടോ ഡീലർ. ഒരു ഗരേജിൽ നിന്ന് മൾട്ടി-ബ്രാൻഡ് ഷോറൂം.',
    achievements: ['RAK Business Excellence Award 2022', 'Authorized Toyota Service Partner', 'Best Employer – North Emirates'],
    achievementsMl: ['RAK Business Excellence Award 2022', 'Authorized Toyota Service Partner'],
    tags: ['Automotive', 'Dealership', 'Service'],
  },
  {
    id: 12,
    username: 'leenamathai',
    name: 'Leena Mathai',
    nameMl: 'ലീന മാത്തായ്',
    title: 'Founder & CEO',
    titleMl: 'സ്ഥാപക & CEO',
    photo: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400&q=80&auto=format&fit=crop&crop=faces',
    businessName: 'Leena Wellness & Beauty',
    businessNameMl: 'ലീന വെൽനസ് & ബ്യൂട്ടി',
    industry: 'Beauty & Wellness',
    industryMl: 'സൗന്ദര്യം & ആരോഗ്യം',
    emirate: 'Dubai',
    emirateMl: 'ദുബായ്',
    yearsInBusiness: 11,
    verified: true,
    featured: false,
    employees: '180+',
    businessCount: 5,
    countries: 2,
    turnover: 'AED 40M+',
    bio: 'Built UAE\'s most trusted Ayurvedic wellness brand from a single salon. Pioneered authentic Kerala Panchakarma treatments in Dubai\'s luxury spa market.',
    bioMl: 'ഒരു സലൂണിൽ നിന്ന് UAE-ൽ ഏറ്റവും വിശ്വസ്ത ആയുർവേദ ബ്രാൻഡ്. ദുബായ് ലക്ഷ്വറി സ്പ മാർക്കറ്റിൽ Kerala Panchakarma.',
    achievements: ['Dubai Wellness Innovation Award 2023', 'Vogue Arabia Best Spa Brand', 'Ayush Ministry Certified'],
    achievementsMl: ['ദുബായ് Wellness Innovation Award 2023', 'Vogue Arabia Best Spa Brand'],
    tags: ['Wellness', 'Beauty', 'Ayurveda'],
  },
]

const INDUSTRIES = ['All Industries', 'Real Estate', 'Healthcare', 'Technology', 'Finance', 'Education', 'Construction', 'Food & Beverage', 'Legal', 'Hospitality', 'Logistics', 'Automotive', 'Beauty & Wellness']
const EMIRATES = ['All Emirates', 'Dubai', 'Abu Dhabi', 'Sharjah', 'Ras Al Khaimah', 'Ajman', 'Fujairah', 'Umm Al Quwain']
const YEARS_OPTIONS = ['Any Experience', '5–10 years', '10–15 years', '15–20 years', '20+ years']

function yearRange(opt: string): [number, number] {
  if (opt === '5–10 years') return [5, 10]
  if (opt === '10–15 years') return [10, 15]
  if (opt === '15–20 years') return [15, 20]
  if (opt === '20+ years') return [20, 100]
  return [0, 100]
}

function BusinessmanCard({ bm, locale, isMl }: { bm: Businessman; locale: string; isMl: boolean }) {
  return (
    <Link
      href={`/${locale}/owner/${bm.username}`}
      className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 hover:border-kerala-green/20 transition-all duration-300 flex flex-col"
    >
      {/* Photo */}
      <div className="relative h-56 overflow-hidden">
        <Image
          src={bm.photo}
          alt={bm.name}
          fill
          className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-kerala-deep/80 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {bm.featured && (
            <span className="bg-kerala-gold text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
              {isMl ? 'ഫീച്ചർഡ്' : 'Featured'}
            </span>
          )}
          {bm.verified && (
            <span className="bg-white/90 backdrop-blur text-kerala-green text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow">
              <BadgeCheck size={11} /> {isMl ? 'Verified' : 'Verified'}
            </span>
          )}
        </div>

        {/* Years */}
        <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full">
          {bm.yearsInBusiness} {isMl ? 'വർഷം' : 'yrs exp'}
        </div>

        {/* Name overlay */}
        <div className="absolute bottom-3 left-3">
          <h3 className="font-serif text-xl font-bold text-white leading-tight">
            {isMl ? bm.nameMl : bm.name}
          </h3>
          <p className="text-white/75 text-xs mt-0.5">{isMl ? bm.titleMl : bm.title}</p>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Business */}
        <div className="flex items-start gap-2 mb-3">
          <Building2 size={14} className="text-kerala-green mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-kerala-deep text-sm leading-snug">
              {isMl ? bm.businessNameMl : bm.businessName}
            </p>
            <p className="text-xs text-kerala-green font-medium mt-0.5">{isMl ? bm.industryMl : bm.industry}</p>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-3">
          <MapPin size={12} />
          <span>{isMl ? bm.emirateMl : bm.emirate}, UAE</span>
          <span className="mx-1">·</span>
          <Briefcase size={11} />
          <span>{bm.businessCount} {isMl ? 'ബിസിനസ്' : 'businesses'}</span>
        </div>

        {/* Bio */}
        <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-4 flex-1">
          {isMl ? bm.bioMl : bm.bio}
        </p>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mb-4 pt-3 border-t border-gray-100">
          {[
            { val: bm.employees, label: isMl ? 'ജീവനക്കാർ' : 'Employees' },
            { val: `${bm.countries}`, label: isMl ? 'രാജ്യങ്ങൾ' : 'Countries' },
            { val: bm.turnover, label: isMl ? 'ടേൺഓവർ' : 'Turnover' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="font-serif font-bold text-kerala-deep text-sm">{s.val}</div>
              <div className="text-gray-400 text-xs">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {bm.tags.slice(0, 3).map(tag => (
            <span key={tag} className="bg-kerala-cream text-kerala-green text-xs font-medium px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div className="flex items-center justify-between">
          <span className="text-kerala-green text-xs font-semibold group-hover:underline flex items-center gap-1 transition-all">
            {isMl ? 'പ്രൊഫൈൽ കാണൂ' : 'View Profile'} <ArrowRight size={13} />
          </span>
          {bm.achievements.length > 0 && (
            <span className="flex items-center gap-1 text-kerala-gold text-xs font-medium">
              <Award size={12} /> {bm.achievements.length} {isMl ? 'അവാർഡ്' : 'awards'}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

export default function BusinessmenPage() {
  const locale = useLocale()
  const isMl = locale === 'ml'

  const [search, setSearch] = useState('')
  const [industry, setIndustry] = useState('All Industries')
  const [emirate, setEmirate] = useState('All Emirates')
  const [yearsOpt, setYearsOpt] = useState('Any Experience')
  const [showFilters, setShowFilters] = useState(false)
  const [featuredOnly, setFeaturedOnly] = useState(false)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    const [yMin, yMax] = yearRange(yearsOpt)
    return businessmen.filter(bm => {
      if (q && !bm.name.toLowerCase().includes(q) && !bm.nameMl.includes(q) && !bm.businessName.toLowerCase().includes(q)) return false
      if (industry !== 'All Industries' && bm.industry !== industry) return false
      if (emirate !== 'All Emirates' && bm.emirate !== emirate) return false
      if (bm.yearsInBusiness < yMin || bm.yearsInBusiness > yMax) return false
      if (featuredOnly && !bm.featured) return false
      return true
    })
  }, [search, industry, emirate, yearsOpt, featuredOnly])

  const featuredBm = businessmen.filter(b => b.featured)

  const activeFiltersCount = [
    industry !== 'All Industries',
    emirate !== 'All Emirates',
    yearsOpt !== 'Any Experience',
    featuredOnly,
  ].filter(Boolean).length

  return (
    <main className="min-h-screen bg-kerala-cream">
      <Navbar />

      {/* Hero */}
      <section className="relative h-72 md:h-80 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&q=85&auto=format&fit=crop"
          alt="Dubai skyline"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-kerala-deep/90 via-kerala-deep/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-kerala-deep/60 to-transparent" />

        <div className="relative z-10 h-full flex flex-col justify-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-kerala-gold/20 border border-kerala-gold/40 text-kerala-gold-light text-xs font-semibold px-3 py-1 rounded-full">
              {isMl ? 'കമ്മ്യൂണിറ്റി' : 'COMMUNITY'}
            </span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white max-w-2xl leading-tight mb-3">
            {isMl ? (
              <>UAE-യിലെ <span className="text-kerala-gold-light">പ്രമുഖ</span> മലയാളി ബിസിനസ്മാൻ</>
            ) : (
              <>Prominent Malayali <span className="text-kerala-gold-light">Business Leaders</span> in UAE</>
            )}
          </h1>
          <p className="text-white/70 text-base md:text-lg max-w-xl">
            {isMl
              ? 'UAE-ൽ ബിസിനസ് ലോകം നയിക്കുന്ന മലയാളി സംരംഭകരുടെ ഡയറക്ടറി'
              : 'Celebrating Malayali entrepreneurs who are shaping business across the Emirates'}
          </p>

          {/* Hero stats */}
          <div className="flex flex-wrap gap-6 mt-6">
            {[
              { val: '500+', label: isMl ? 'ലിസ്റ്റ് ചെയ്ത നേതാക്കൾ' : 'Listed Leaders' },
              { val: '7', label: isMl ? 'എമിറേറ്റുകൾ' : 'Emirates' },
              { val: '40+', label: isMl ? 'ഇൻഡസ്ട്രികൾ' : 'Industries' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="font-serif text-2xl font-bold text-kerala-gold-light">{s.val}</div>
                <div className="text-white/60 text-xs">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Search + Filters */}
      <section className="bg-white border-b border-gray-100 sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={isMl ? 'പേര് അല്ലെങ്കിൽ ബിസിനസ് തിരയൂ...' : 'Search by name or business...'}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-kerala-green focus:ring-1 focus:ring-kerala-green bg-gray-50"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                showFilters || activeFiltersCount > 0
                  ? 'bg-kerala-green text-white border-kerala-green'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-kerala-green'
              }`}
            >
              <Filter size={15} />
              {isMl ? 'ഫിൽട്ടർ' : 'Filters'}
              {activeFiltersCount > 0 && (
                <span className="bg-white text-kerala-green text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Featured toggle */}
            <button
              onClick={() => setFeaturedOnly(!featuredOnly)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                featuredOnly ? 'bg-kerala-gold text-white border-kerala-gold' : 'bg-white text-gray-600 border-gray-200 hover:border-kerala-gold'
              }`}
            >
              <Star size={15} />
              {isMl ? 'ഫീച്ചർഡ്' : 'Featured Only'}
            </button>
          </div>

          {/* Expanded filters */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-100">
              {[
                { label: isMl ? 'ഇൻഡസ്ട്രി' : 'Industry', val: industry, set: setIndustry, opts: INDUSTRIES },
                { label: isMl ? 'എമിറേറ്റ്' : 'Emirate', val: emirate, set: setEmirate, opts: EMIRATES },
                { label: isMl ? 'അനുഭവം' : 'Experience', val: yearsOpt, set: setYearsOpt, opts: YEARS_OPTIONS },
              ].map(f => (
                <div key={f.label}>
                  <label className="text-xs text-gray-500 font-medium mb-1.5 block">{f.label}</label>
                  <div className="relative">
                    <select
                      value={f.val}
                      onChange={e => f.set(e.target.value)}
                      className="w-full appearance-none border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:border-kerala-green pr-8"
                    >
                      {f.opts.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Featured Spotlight */}
        {!search && industry === 'All Industries' && emirate === 'All Emirates' && yearsOpt === 'Any Experience' && !featuredOnly && (
          <div className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <Star size={18} className="text-kerala-gold" />
              <h2 className="font-serif text-2xl font-bold text-kerala-deep">
                {isMl ? 'ഫീച്ചർഡ് ലീഡർമാർ' : 'Featured Leaders'}
              </h2>
              <div className="h-px bg-gray-200 flex-1" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {featuredBm.slice(0, 4).map(bm => (
                <Link
                  key={bm.id}
                  href={`/${locale}/owner/${bm.username}`}
                  className="group relative overflow-hidden rounded-3xl h-72 shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <Image
                    src={bm.photo}
                    alt={bm.name}
                    fill
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="bg-kerala-gold text-white text-xs font-bold px-2.5 py-1 rounded-full">
                      {isMl ? 'ഫീച്ചർഡ്' : 'Featured'}
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-serif text-lg font-bold text-white">{isMl ? bm.nameMl : bm.name}</h3>
                    <p className="text-white/70 text-xs mb-1">{isMl ? bm.titleMl : bm.title}</p>
                    <p className="text-kerala-gold-light text-xs font-medium">{isMl ? bm.businessNameMl : bm.businessName}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="bg-white/15 text-white text-xs px-2 py-0.5 rounded-full">
                        {isMl ? bm.emirateMl : bm.emirate}
                      </span>
                      <span className="bg-white/15 text-white text-xs px-2 py-0.5 rounded-full">
                        {bm.yearsInBusiness} {isMl ? 'വർഷം' : 'yrs'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* All Results */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-serif text-2xl font-bold text-kerala-deep">
              {search || activeFiltersCount > 0
                ? (isMl ? 'ഫലങ്ങൾ' : 'Results')
                : (isMl ? 'എല്ലാ ബിസിനസ്മാൻ' : 'All Business Leaders')}
            </h2>
            <p className="text-gray-500 text-sm mt-0.5">
              {filtered.length} {isMl ? 'പ്രൊഫൈലുകൾ കണ്ടെത്തി' : 'profiles found'}
            </p>
          </div>

          {activeFiltersCount > 0 && (
            <button
              onClick={() => { setIndustry('All Industries'); setEmirate('All Emirates'); setYearsOpt('Any Experience'); setFeaturedOnly(false) }}
              className="text-sm text-kerala-green hover:underline flex items-center gap-1"
            >
              <X size={14} /> {isMl ? 'ക്ലിയർ ഫിൽട്ടർ' : 'Clear filters'}
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <Users size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">{isMl ? 'ഫലം കണ്ടെത്തിയില്ല' : 'No results found'}</p>
            <p className="text-gray-400 text-sm mt-1">{isMl ? 'ഫിൽട്ടർ മാറ്റി നോക്കൂ' : 'Try adjusting your filters'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(bm => (
              <BusinessmanCard key={bm.id} bm={bm} locale={locale} isMl={isMl} />
            ))}
          </div>
        )}

        {/* Nominate CTA */}
        <div className="mt-16 relative overflow-hidden rounded-3xl bg-kerala-deep px-8 py-12 text-center">
          <Image
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80&auto=format&fit=crop"
            alt=""
            fill
            className="object-cover opacity-10"
            sizes="100vw"
          />
          <div className="relative z-10">
            <span className="inline-block bg-kerala-gold/20 border border-kerala-gold/30 text-kerala-gold-light text-xs font-bold px-3 py-1 rounded-full mb-4">
              {isMl ? 'നോമിനേഷൻ' : 'NOMINATIONS OPEN'}
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3 max-w-xl mx-auto">
              {isMl
                ? 'ഒരു മലയാളി ബിസിനസ്മാനെ നോമിനേറ്റ് ചെയ്യൂ'
                : 'Nominate a Prominent Malayali Businessman'}
            </h2>
            <p className="text-white/65 text-base mb-8 max-w-lg mx-auto">
              {isMl
                ? 'നിങ്ങൾ അറിയുന്ന ഒരു മലയാളി ബിസിനസ് ലീഡർ ഇവിടെ ഫീച്ചർ ചെയ്യപ്പെടേണ്ടവരാണോ? നോമിനേറ്റ് ചെയ്യൂ!'
                : 'Know a Malayali business leader who deserves recognition? Nominate them for the directory.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href={`/${locale}/dashboard`}
                className="inline-flex items-center gap-2 bg-kerala-gold hover:bg-kerala-gold-light text-white font-semibold px-8 py-3 rounded-xl transition-all"
              >
                <Plus size={18} />
                {isMl ? 'ഇപ്പോൾ നോമിനേറ്റ് ചെയ്യൂ' : 'Nominate Now'}
              </Link>
              <Link
                href={`/${locale}/directory`}
                className="inline-flex items-center gap-2 border border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-3 rounded-xl transition-all"
              >
                {isMl ? 'ബിസിനസ് ഡയറക്ടറി' : 'Business Directory'}
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
