'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { useLocale } from 'next-intl'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import {
  Search, MapPin, Briefcase, Clock, DollarSign, Filter, ChevronDown,
  Building2, Star, ArrowRight, X, BookmarkPlus, Share2, CheckCircle
} from 'lucide-react'

type JobType = 'full-time' | 'part-time' | 'contract' | 'freelance' | 'internship'
type ExperienceLevel = 'entry' | 'mid' | 'senior' | 'lead' | 'executive'

interface Job {
  id: string
  title: string
  titleMl: string
  company: string
  companyMl: string
  logo: string
  emirate: string
  emirateMl: string
  location: string
  locationMl: string
  type: JobType
  experience: ExperienceLevel
  salaryMin: number
  salaryMax: number
  category: string
  categoryMl: string
  description: string
  descriptionMl: string
  requirements: string[]
  requirementsMl: string[]
  posted: string
  deadline: string
  featured: boolean
  urgent: boolean
  verified: boolean
  applicants: number
}

const jobs: Job[] = [
  {
    id: 'sr-software-engineer-dubizzle',
    title: 'Senior Software Engineer',
    titleMl: 'സീനിയർ സോഫ്റ്റ്‌വെയർ എഞ്ചിനീയർ',
    company: 'TechVentures MENA',
    companyMl: 'ടെക്‌വെഞ്ചേഴ്‌സ് MENA',
    logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&q=80',
    emirate: 'Dubai',
    emirateMl: 'ദുബായ്',
    location: 'Dubai Internet City',
    locationMl: 'ദുബായ് ഇന്റർനെറ്റ് സിറ്റി',
    type: 'full-time',
    experience: 'senior',
    salaryMin: 20000,
    salaryMax: 30000,
    category: 'Technology',
    categoryMl: 'ടെക്നോളജി',
    description: 'We are looking for an experienced Senior Software Engineer to join our growing fintech team. You will design and build scalable backend services using Node.js, Go, and cloud-native technologies.',
    descriptionMl: 'ഞങ്ങളുടെ ഫിൻടെക് ടീമിൽ ചേരാൻ ഒരു പരിചയസമ്പന്നനായ സീനിയർ സോഫ്റ്റ്‌വെയർ എഞ്ചിനീയറെ ആവശ്യമുണ്ട്.',
    requirements: ['5+ years experience', 'Node.js / Go', 'AWS / GCP', 'System Design', 'Microservices'],
    requirementsMl: ['5+ വർഷം പരിചയം', 'Node.js / Go', 'AWS / GCP', 'സിസ്റ്റം ഡിസൈൻ', 'മൈക്രോസർവീസസ്'],
    posted: '2025-05-14',
    deadline: '2025-06-14',
    featured: true,
    urgent: false,
    verified: true,
    applicants: 47,
  },
  {
    id: 'account-manager-bank',
    title: 'Relationship Manager – NRI Banking',
    titleMl: 'റിലേഷൻഷിപ്പ് മാനേജർ – NRI ബാങ്കിംഗ്',
    company: 'Emirates National Bank',
    companyMl: 'എമിറേറ്റ്‌സ് നാഷനൽ ബാങ്ക്',
    logo: 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?w=100&q=80',
    emirate: 'Abu Dhabi',
    emirateMl: 'അബൂദബി',
    location: 'Abu Dhabi City Centre',
    locationMl: 'അബൂദബി സിറ്റി സെന്റർ',
    type: 'full-time',
    experience: 'mid',
    salaryMin: 14000,
    salaryMax: 20000,
    category: 'Finance',
    categoryMl: 'ഫിനാൻസ്',
    description: 'Drive NRI banking business through acquiring and managing HNI clients. Malayalam language skills are a strong advantage for serving the Kerala NRI community.',
    descriptionMl: 'NRI ബാങ്കിംഗ് ബിസിനസ് വളർത്തുക. കേരള NRI കമ്മ്യൂണിറ്റിയെ സേവിക്കാൻ മലയാളം ഭാഷ ഒരു വലിയ മേൽക്കൈ.',
    requirements: ['3+ years banking', 'Malayalam speaking', 'Investment products', 'CRM tools', 'Regulatory compliance'],
    requirementsMl: ['3+ വർഷം ബാങ്കിംഗ്', 'മലയാളം സംസാരം', 'നിക്ഷേപ ഉൽപ്പന്നങ്ങൾ'],
    posted: '2025-05-12',
    deadline: '2025-06-10',
    featured: true,
    urgent: true,
    verified: true,
    applicants: 89,
  },
  {
    id: 'general-surgeon',
    title: 'General Practitioner / Family Doctor',
    titleMl: 'ജനറൽ പ്രാക്ടീഷണർ / ഫാമിലി ഡോക്ടർ',
    company: 'Aster DM Healthcare',
    companyMl: 'ആസ്റ്റർ DM ഹെൽത്ത്കെയർ',
    logo: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=100&q=80',
    emirate: 'Dubai',
    emirateMl: 'ദുബായ്',
    location: 'Multiple Locations',
    locationMl: 'ഒന്നിലധികം ലൊക്കേഷനുകൾ',
    type: 'full-time',
    experience: 'mid',
    salaryMin: 25000,
    salaryMax: 40000,
    category: 'Healthcare',
    categoryMl: 'ഹെൽത്ത്കെയർ',
    description: 'Join Aster\'s growing network of clinics across the UAE. Provide primary care to a diverse patient population including the Malayali community. DHA/MOH license required.',
    descriptionMl: 'യുഎഇ ഉടനീളം ആസ്റ്ററിന്റെ ക്ലിനിക്കുകളിൽ ചേരൂ. DHA/MOH ലൈസൻസ് ആവശ്യമുണ്ട്.',
    requirements: ['MBBS + PG preferred', 'DHA/MOH License', '3+ years experience', 'Malayalam/English'],
    requirementsMl: ['MBBS + PG', 'DHA/MOH ലൈസൻസ്', '3+ വർഷം', 'മലയാളം/ഇംഗ്ലീഷ്'],
    posted: '2025-05-10',
    deadline: '2025-07-01',
    featured: false,
    urgent: false,
    verified: true,
    applicants: 34,
  },
  {
    id: 'civil-engineer-adnoc',
    title: 'Civil Engineer – Infrastructure Projects',
    titleMl: 'സിവിൽ എഞ്ചിനീയർ – ഇൻഫ്രാസ്ട്രക്ചർ',
    company: 'Archirodon Construction',
    companyMl: 'ആർക്കിറോഡൻ കൺസ്ട്രക്ഷൻ',
    logo: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=100&q=80',
    emirate: 'Abu Dhabi',
    emirateMl: 'അബൂദബി',
    location: 'Abu Dhabi – Ruwais',
    locationMl: 'അബൂദബി – റുവൈസ്',
    type: 'full-time',
    experience: 'senior',
    salaryMin: 16000,
    salaryMax: 24000,
    category: 'Engineering',
    categoryMl: 'എഞ്ചിനീയറിംഗ്',
    description: 'Lead civil engineering works on large-scale oil & gas infrastructure projects. Site supervision, QA/QC, and subcontractor management.',
    descriptionMl: 'വലിയ ഓയിൽ & ഗ്യാസ് ഇൻഫ്രാ പ്രൊജക്ടുകളിൽ സിവിൽ എഞ്ചിനീയറിംഗ് ജോലികൾ നയിക്കൂ.',
    requirements: ['B.E. Civil', '7+ years', 'Oil & Gas sector', 'AutoCAD / Primavera', 'QA/QC'],
    requirementsMl: ['B.E. സിവിൽ', '7+ വർഷം', 'ഓയിൽ & ഗ്യാസ്', 'AutoCAD'],
    posted: '2025-05-08',
    deadline: '2025-06-30',
    featured: false,
    urgent: true,
    verified: true,
    applicants: 112,
  },
  {
    id: 'marketing-manager',
    title: 'Digital Marketing Manager',
    titleMl: 'ഡിജിറ്റൽ മാർക്കറ്റിംഗ് മാനേജർ',
    company: 'Lulu Hypermarket',
    companyMl: 'ലുലു ഹൈപ്പർമാർക്കറ്റ്',
    logo: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=100&q=80',
    emirate: 'Dubai',
    emirateMl: 'ദുബായ്',
    location: 'Dubai – Al Barsha',
    locationMl: 'ദുബായ് – അൽ ബർഷ',
    type: 'full-time',
    experience: 'mid',
    salaryMin: 12000,
    salaryMax: 18000,
    category: 'Marketing',
    categoryMl: 'മാർക്കറ്റിംഗ്',
    description: 'Drive digital marketing strategy across social media, SEO, and paid channels. Experience with South Asian market segments and Malayalam content creation preferred.',
    descriptionMl: 'സോഷ്യൽ മീഡിയ, SEO, പെയ്ഡ് ചാനലുകളിൽ ഡിജിറ്റൽ മാർക്കറ്റിംഗ് തന്ത്രം നടപ്പിലാക്കൂ.',
    requirements: ['5+ years marketing', 'Google Ads / Meta', 'Malayalam content', 'Analytics', 'E-commerce'],
    requirementsMl: ['5+ വർഷം', 'Google Ads / Meta', 'മലയാളം കോൺടെന്റ്', 'Analytics'],
    posted: '2025-05-15',
    deadline: '2025-06-15',
    featured: false,
    urgent: false,
    verified: true,
    applicants: 67,
  },
  {
    id: 'accountant-audit',
    title: 'Senior Accountant / Audit Manager',
    titleMl: 'സീനിയർ അക്കൗണ്ടന്റ് / ഓഡിറ്റ് മാനേജർ',
    company: 'PricewaterhouseCoopers UAE',
    companyMl: 'PricewaterhouseCoopers UAE',
    logo: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=100&q=80',
    emirate: 'Dubai',
    emirateMl: 'ദുബായ്',
    location: 'Dubai DIFC',
    locationMl: 'ദുബായ് DIFC',
    type: 'full-time',
    experience: 'senior',
    salaryMin: 18000,
    salaryMax: 28000,
    category: 'Finance',
    categoryMl: 'ഫിനാൻസ്',
    description: 'Lead audit engagements for multinational clients across the MENA region. CA/CPA qualified candidates preferred. Big 4 experience is a plus.',
    descriptionMl: 'MENA മേഖലയിലെ ബഹുരാഷ്ട്ര കമ്പനികൾക്കായി ഓഡിറ്റ് ജോലികൾ നയിക്കൂ. CA/CPA യോഗ്യതയുള്ളവർ.',
    requirements: ['CA / CPA / ACCA', '6+ years audit', 'IFRS', 'Big 4 preferred', 'Arabic a plus'],
    requirementsMl: ['CA / CPA / ACCA', '6+ വർഷം', 'IFRS', 'Big 4 അനുഭവം'],
    posted: '2025-05-13',
    deadline: '2025-06-20',
    featured: false,
    urgent: false,
    verified: true,
    applicants: 55,
  },
  {
    id: 'teacher-cbse',
    title: 'CBSE Math / Science Teacher',
    titleMl: 'CBSE ഗണിതം / ശാസ്ത്രം അധ്യാപകൻ',
    company: 'Our Own English High School',
    companyMl: 'ഔർ ഓൺ ഇംഗ്ലീഷ് ഹൈ സ്കൂൾ',
    logo: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=100&q=80',
    emirate: 'Sharjah',
    emirateMl: 'ഷാർജ',
    location: 'Sharjah',
    locationMl: 'ഷാർജ',
    type: 'full-time',
    experience: 'mid',
    salaryMin: 7000,
    salaryMax: 11000,
    category: 'Education',
    categoryMl: 'വിദ്യാഭ്യാസം',
    description: 'Seeking passionate CBSE teachers for Math and Science for Grades 9-12. Experience with Indian curriculum and knowledge of Kerala education system preferred.',
    descriptionMl: 'ഗ്രേഡ് 9-12 ലേക്ക് ഗണിതം, ശാസ്ത്രം അധ്യാപകരെ ആവശ്യമുണ്ട്.',
    requirements: ['B.Sc + B.Ed', 'CBSE experience', 'Grades 9-12', 'Malayalam preferred', 'KV / Navodaya exp.'],
    requirementsMl: ['B.Sc + B.Ed', 'CBSE', 'ഗ്രേഡ് 9-12', 'മലയാളം'],
    posted: '2025-05-07',
    deadline: '2025-07-31',
    featured: false,
    urgent: false,
    verified: true,
    applicants: 28,
  },
  {
    id: 'chef-restaurant',
    title: 'Head Chef – Kerala Cuisine',
    titleMl: 'ഹെഡ് ഷെഫ് – കേരള ഭക്ഷണം',
    company: 'Thalassery Restaurant Group',
    companyMl: 'തലശ്ശേരി റസ്റ്റോറന്റ് ഗ്രൂപ്പ്',
    logo: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=100&q=80',
    emirate: 'Dubai',
    emirateMl: 'ദുബായ്',
    location: 'Dubai – Bur Dubai',
    locationMl: 'ദുബായ് – ബർദുബായ്',
    type: 'full-time',
    experience: 'senior',
    salaryMin: 8000,
    salaryMax: 14000,
    category: 'Hospitality',
    categoryMl: 'ഹോസ്പിറ്റാലിറ്റി',
    description: 'Lead our kitchen team specialising in authentic Kerala and North Kerala (Malabar) cuisine. Menu development, cost control, and training junior chefs.',
    descriptionMl: 'ആധികാരിക കേരള, മലബാർ ഭക്ഷണ വൈദഗ്ദ്ധ്യമുള്ള ഹെഡ് ഷെഫ് ആവശ്യമുണ്ട്.',
    requirements: ['10+ years culinary', 'Kerala cuisine expert', 'Menu development', 'Team management', 'HACCP'],
    requirementsMl: ['10+ വർഷം', 'കേരള ഭക്ഷണ വൈദഗ്ദ്ധ്യം', 'മെനു ഡെവലപ്‌മെന്റ്'],
    posted: '2025-05-11',
    deadline: '2025-06-30',
    featured: false,
    urgent: true,
    verified: false,
    applicants: 19,
  },
]

const jobCategories = [
  { key: 'all', label: 'All Jobs', labelMl: 'എല്ലാ ജോലികൾ' },
  { key: 'Technology', label: 'Technology', labelMl: 'ടെക്നോളജി' },
  { key: 'Finance', label: 'Finance', labelMl: 'ഫിനാൻസ്' },
  { key: 'Healthcare', label: 'Healthcare', labelMl: 'ഹെൽത്ത്കെയർ' },
  { key: 'Engineering', label: 'Engineering', labelMl: 'എഞ്ചിനീയറിംഗ്' },
  { key: 'Marketing', label: 'Marketing', labelMl: 'മാർക്കറ്റിംഗ്' },
  { key: 'Education', label: 'Education', labelMl: 'വിദ്യാഭ്യാസം' },
  { key: 'Hospitality', label: 'Hospitality', labelMl: 'ഹോസ്പിറ്റാലിറ്റി' },
]

const emirates = ['All Emirates', 'Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Fujairah', 'Ras Al Khaimah']
const emiratesMl = ['എല്ലാ എമിറേറ്റ്', 'ദുബായ്', 'അബൂദബി', 'ഷാർജ', 'അജ്മാൻ', 'ഫുജൈറ', 'റാസൽ ഖൈമ']

const jobTypeLabels: Record<JobType, { en: string; ml: string; color: string }> = {
  'full-time': { en: 'Full Time', ml: 'പൂർണ്ണ സമയം', color: 'bg-blue-100 text-blue-700' },
  'part-time': { en: 'Part Time', ml: 'ഭാഗിക സമയം', color: 'bg-purple-100 text-purple-700' },
  'contract': { en: 'Contract', ml: 'കോൺട്രാക്ട്', color: 'bg-amber-100 text-amber-700' },
  'freelance': { en: 'Freelance', ml: 'ഫ്രീലാൻസ്', color: 'bg-teal-100 text-teal-700' },
  'internship': { en: 'Internship', ml: 'ഇന്റേൺഷിപ്പ്', color: 'bg-pink-100 text-pink-700' },
}

const expLabels: Record<ExperienceLevel, { en: string; ml: string }> = {
  entry: { en: 'Entry Level', ml: 'പ്രാരംഭ തലം' },
  mid: { en: 'Mid Level', ml: 'മദ്ധ്യ തലം' },
  senior: { en: 'Senior', ml: 'സീനിയർ' },
  lead: { en: 'Lead', ml: 'ലീഡ്' },
  executive: { en: 'Executive', ml: 'എക്‌സിക്യൂട്ടീവ്' },
}

function timeAgo(dateStr: string, isMl: boolean) {
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24))
  if (days === 0) return isMl ? 'ഇന്ന്' : 'Today'
  if (days === 1) return isMl ? '1 ദിവസം മുൻപ്' : '1 day ago'
  if (days < 7) return isMl ? `${days} ദിവസം മുൻപ്` : `${days} days ago`
  if (days < 30) return isMl ? `${Math.floor(days / 7)} ആഴ്ച മുൻപ്` : `${Math.floor(days / 7)}w ago`
  return isMl ? `${Math.floor(days / 30)} മാസം മുൻപ്` : `${Math.floor(days / 30)}mo ago`
}

function JobCard({ job, isMl, featured }: { job: Job; isMl: boolean; featured?: boolean }) {
  const typeInfo = jobTypeLabels[job.type]
  const [saved, setSaved] = useState(false)

  return (
    <div className={`group bg-white rounded-2xl border transition-all duration-300 hover:shadow-lg ${
      featured
        ? 'border-kerala-gold/40 shadow-md ring-1 ring-kerala-gold/20'
        : 'border-gray-100 shadow-sm hover:-translate-y-0.5'
    } p-5`}>
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-start gap-3">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0 bg-gray-50">
            <Image src={job.logo} alt={job.company} fill className="object-cover" sizes="48px" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-kerala-deep text-base leading-snug group-hover:text-kerala-green transition-colors">
              {isMl ? job.titleMl : job.title}
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-sm text-gray-500">{isMl ? job.companyMl : job.company}</span>
              {job.verified && <CheckCircle size={13} className="text-kerala-green flex-shrink-0" />}
            </div>
          </div>
        </div>
        <button
          onClick={() => setSaved(!saved)}
          className={`p-1.5 rounded-lg transition-colors flex-shrink-0 ${saved ? 'text-kerala-green' : 'text-gray-300 hover:text-gray-500'}`}
        >
          <BookmarkPlus size={18} />
        </button>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-3">
        {job.urgent && (
          <span className="bg-red-50 text-red-600 text-xs font-bold px-2.5 py-0.5 rounded-full border border-red-100">
            {isMl ? 'അടിയന്തിരം' : 'Urgent'}
          </span>
        )}
        {featured && (
          <span className="bg-kerala-gold/10 text-kerala-gold text-xs font-bold px-2.5 py-0.5 rounded-full border border-kerala-gold/20 flex items-center gap-1">
            <Star size={10} fill="currentColor" /> {isMl ? 'ഫീച്ചേഡ്' : 'Featured'}
          </span>
        )}
        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${typeInfo.color}`}>
          {isMl ? typeInfo.ml : typeInfo.en}
        </span>
        <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-0.5 rounded-full">
          {isMl ? expLabels[job.experience].ml : expLabels[job.experience].en}
        </span>
      </div>

      {/* Meta */}
      <div className="grid grid-cols-2 gap-1.5 mb-4">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <MapPin size={12} className="text-kerala-green" />
          <span className="truncate">{isMl ? job.locationMl : job.location}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Briefcase size={12} className="text-kerala-green" />
          <span>{isMl ? job.categoryMl : job.category}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <DollarSign size={12} className="text-kerala-green" />
          <span>AED {job.salaryMin.toLocaleString()}–{job.salaryMax.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Clock size={12} className="text-kerala-green" />
          <span>{timeAgo(job.posted, isMl)}</span>
        </div>
      </div>

      {/* Requirements chips */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {(isMl ? job.requirementsMl : job.requirements).slice(0, 4).map((req) => (
          <span key={req} className="bg-kerala-cream text-kerala-deep text-xs px-2 py-0.5 rounded-lg">
            {req}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-50">
        <span className="text-xs text-gray-400">
          {job.applicants} {isMl ? 'അപേക്ഷകർ' : 'applicants'}
        </span>
        <div className="flex items-center gap-2">
          <button className="p-1.5 text-gray-300 hover:text-gray-500 transition-colors">
            <Share2 size={14} />
          </button>
          <button className="bg-kerala-green text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-kerala-green-light transition-all">
            {isMl ? 'അപേക്ഷിക്കൂ' : 'Apply Now'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function JobsPage() {
  const locale = useLocale()
  const isMl = locale === 'ml'
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedEmirate, setSelectedEmirate] = useState('All Emirates')
  const [jobTypeFilter, setJobTypeFilter] = useState<JobType | 'all'>('all')
  const [salaryFilter, setSalaryFilter] = useState<'all' | '5k' | '10k' | '20k'>('all')
  const [showFilters, setShowFilters] = useState(false)

  const featuredJobs = useMemo(() => jobs.filter(j => j.featured), [])
  const filtered = useMemo(() => {
    let list = [...jobs]
    if (activeCategory !== 'all') list = list.filter(j => j.category === activeCategory)
    if (query) {
      const q = query.toLowerCase()
      list = list.filter(j =>
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.requirements.some(r => r.toLowerCase().includes(q))
      )
    }
    if (selectedEmirate !== 'All Emirates') list = list.filter(j => j.emirate === selectedEmirate)
    if (jobTypeFilter !== 'all') list = list.filter(j => j.type === jobTypeFilter)
    if (salaryFilter === '5k') list = list.filter(j => j.salaryMin >= 5000)
    else if (salaryFilter === '10k') list = list.filter(j => j.salaryMin >= 10000)
    else if (salaryFilter === '20k') list = list.filter(j => j.salaryMin >= 20000)
    return list
  }, [query, activeCategory, selectedEmirate, jobTypeFilter, salaryFilter])

  return (
    <main className="min-h-screen bg-kerala-cream">
      <Navbar />

      {/* Header */}
      <div className="bg-kerala-deep pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-white/40 text-xs mb-4">
            <span>{isMl ? 'ഹോം' : 'Home'}</span>
            <span>/</span>
            <span className="text-kerala-gold-light">{isMl ? 'ജോലികൾ' : 'Jobs'}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-2">
                {isMl ? 'ജോലി അവസരങ്ങൾ' : 'Job Opportunities'}
              </h1>
              <p className="text-white/60 text-base">
                {isMl
                  ? 'മലയാളി കമ്മ്യൂണിറ്റിക്കായുള്ള ഏറ്റവും നല്ല ജോലി അവസരങ്ങൾ'
                  : 'Top job opportunities for the Malayali community across UAE'}
              </p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 bg-kerala-gold text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-kerala-gold-light transition-all text-sm">
                <Briefcase size={15} />
                {isMl ? 'ജോലി പോസ്റ്റ് ചെയ്യൂ' : 'Post a Job'}
              </button>
            </div>
          </div>

          {/* Quick stats */}
          <div className="flex gap-6 mt-6">
            {[
              { val: '2,400+', label: isMl ? 'ജോലി ഒഴിവുകൾ' : 'Open positions' },
              { val: '850+', label: isMl ? 'കമ്പനികൾ' : 'Companies hiring' },
              { val: '48h', label: isMl ? 'ശരാശരി പ്രതികരണ സമയം' : 'Avg. response time' },
            ].map(s => (
              <div key={s.label}>
                <div className="font-serif font-bold text-kerala-gold-light text-xl">{s.val}</div>
                <div className="text-white/50 text-xs">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={isMl ? 'ജോലി, കമ്പനി, അല്ലെങ്കിൽ കഴിവ് തിരയൂ...' : 'Search jobs, companies, or skills...'}
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
            <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-6">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{isMl ? 'ജോലി തരം' : 'Job Type'}</p>
                <div className="flex flex-wrap gap-2">
                  {(['all', 'full-time', 'part-time', 'contract', 'freelance'] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => setJobTypeFilter(t)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        jobTypeFilter === t ? 'bg-kerala-green text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {t === 'all' ? (isMl ? 'എല്ലാം' : 'All') : (isMl ? jobTypeLabels[t].ml : jobTypeLabels[t].en)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{isMl ? 'ശമ്പളം (AED)' : 'Salary (AED)'}</p>
                <div className="flex flex-wrap gap-2">
                  {([['all', isMl ? 'എല്ലാം' : 'Any'], ['5k', '5K+'], ['10k', '10K+'], ['20k', '20K+']] as const).map(([v, l]) => (
                    <button
                      key={v}
                      onClick={() => setSalaryFilter(v)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        salaryFilter === v ? 'bg-kerala-green text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {jobCategories.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                activeCategory === cat.key
                  ? 'bg-kerala-green text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-kerala-green hover:text-kerala-green'
              }`}
            >
              {isMl ? cat.labelMl : cat.label}
            </button>
          ))}
        </div>

        <div className="flex gap-7">
          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Featured Jobs */}
            {featuredJobs.length > 0 && activeCategory === 'all' && !query && (
              <div className="mb-7">
                <div className="flex items-center gap-2 mb-4">
                  <Star size={15} className="text-kerala-gold" fill="currentColor" />
                  <h2 className="font-serif text-lg font-bold text-kerala-deep">
                    {isMl ? 'ഫീച്ചേഡ് ജോലികൾ' : 'Featured Jobs'}
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {featuredJobs.map(job => (
                    <JobCard key={job.id} job={job} isMl={isMl} featured />
                  ))}
                </div>
              </div>
            )}

            {/* Results header */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500 font-medium">
                {isMl ? `${filtered.length} ജോലി ഒഴിവുകൾ` : `${filtered.length} jobs found`}
              </p>
            </div>

            {/* All Jobs */}
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-2xl bg-white border border-gray-200 flex items-center justify-center mb-4">
                  <Briefcase size={28} className="text-gray-300" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-kerala-deep mb-2">
                  {isMl ? 'ജോലി കണ്ടെത്തിയില്ല' : 'No jobs found'}
                </h3>
                <p className="text-gray-500 text-sm mb-5">{isMl ? 'ഫിൽട്ടറുകൾ മാറ്റി ശ്രമിക്കൂ' : 'Try adjusting your search'}</p>
                <button
                  onClick={() => { setQuery(''); setActiveCategory('all'); setSelectedEmirate('All Emirates'); setJobTypeFilter('all'); setSalaryFilter('all') }}
                  className="bg-kerala-green text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-kerala-green-light"
                >
                  {isMl ? 'ഫിൽട്ടർ നീക്കൂ' : 'Clear filters'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map(job => (
                  <JobCard key={job.id} job={job} isMl={isMl} />
                ))}
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div className="w-72 flex-shrink-0 hidden lg:block">
            {/* Post a job card */}
            <div className="bg-gradient-to-br from-kerala-deep to-kerala-green rounded-2xl p-5 mb-5 text-white">
              <Building2 size={28} className="text-kerala-gold-light mb-3" />
              <h3 className="font-serif font-bold text-lg mb-2">
                {isMl ? 'ജോലി ഒഴിവ് ഉണ്ടോ?' : 'Hiring Malayalis?'}
              </h3>
              <p className="text-white/70 text-xs mb-4">
                {isMl
                  ? '50,000+ മലയാളി പ്രൊഫഷണലുകളിലേക്ക് നിങ്ങളുടെ ജോലി ഒഴിവ് പോസ്റ്റ് ചെയ്യൂ'
                  : 'Post your job to 50,000+ Malayali professionals in the UAE'}
              </p>
              <button className="w-full bg-kerala-gold hover:bg-kerala-gold-light text-white font-semibold py-2.5 rounded-xl text-sm transition-all">
                {isMl ? 'ജോലി പോസ്റ്റ് ചെയ്യൂ' : 'Post a Job'}
              </button>
            </div>

            {/* Job alert card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
              <h3 className="font-serif font-bold text-kerala-deep text-base mb-1">
                {isMl ? 'ജോലി അലർട്ട്' : 'Job Alerts'}
              </h3>
              <p className="text-gray-500 text-xs mb-3">
                {isMl ? 'പുതിയ ജോലികൾ ഇമെയിലിൽ ലഭിക്കൂ' : 'Get new jobs via email instantly'}
              </p>
              <input
                type="email"
                placeholder={isMl ? 'ഇമെയിൽ വിലാസം' : 'Your email address'}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-kerala-green/30"
              />
              <button className="w-full bg-kerala-green text-white font-semibold py-2 rounded-lg text-sm hover:bg-kerala-green-light transition-all">
                {isMl ? 'അലർട്ട് സജ്ജമാക്കൂ' : 'Set Alert'}
              </button>
            </div>

            {/* Top companies */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-serif font-bold text-kerala-deep text-base mb-3">
                {isMl ? 'ടോപ്പ് കമ്പനികൾ' : 'Top Hiring Companies'}
              </h3>
              <div className="space-y-3">
                {jobs.slice(0, 5).map(j => (
                  <div key={j.id} className="flex items-center gap-3">
                    <div className="relative w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                      <Image src={j.logo} alt={j.company} fill className="object-cover" sizes="32px" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-kerala-deep truncate">{j.company}</p>
                      <p className="text-xs text-gray-400">{j.emirate}</p>
                    </div>
                    <ArrowRight size={13} className="text-gray-300 ml-auto flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
