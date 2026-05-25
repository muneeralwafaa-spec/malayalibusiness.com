'use client'

import { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { getJobs } from '@/lib/jobs'
import type { Job, JobType, ExperienceLevel } from '@/lib/jobs'
import {
  Search, MapPin, Briefcase, Clock, DollarSign, Filter, ChevronDown,
  Building2, Star, ArrowRight, X, BookmarkPlus, Share2, CheckCircle
} from 'lucide-react'

// ─── Mock jobs removed — data now comes from Supabase via useEffect ──────────

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
  const typeInfo = jobTypeLabels[job.job_type]
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
            {job.logo_url && <Image src={job.logo_url} alt={job.company} fill className="object-cover" sizes="48px" />}
          </div>
          <div>
            <h3 className="font-serif font-bold text-kerala-deep text-base leading-snug group-hover:text-kerala-green transition-colors">
              {isMl ? (job.title_ml ?? job.title) : job.title}
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-sm text-gray-500">{isMl ? (job.company_ml ?? job.company) : job.company}</span>
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
          <span className="truncate">{isMl ? (job.location_ml ?? job.location) : job.location}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Briefcase size={12} className="text-kerala-green" />
          <span>{isMl ? (job.category_ml ?? job.category) : job.category}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <DollarSign size={12} className="text-kerala-green" />
          <span>{job.salary_min && job.salary_max ? `AED ${job.salary_min.toLocaleString()}–${job.salary_max.toLocaleString()}` : 'Negotiable'}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Clock size={12} className="text-kerala-green" />
          <span>{timeAgo(job.created_at, isMl)}</span>
        </div>
      </div>

      {/* Requirements chips */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {(isMl ? job.requirements_ml : job.requirements).slice(0, 4).map((req) => (
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
  const [allJobs, setAllJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getJobs({ limit: 100 }).then(items => { setAllJobs(items); setLoading(false) })
  }, [])

  const featuredJobs = useMemo(() => allJobs.filter(j => j.featured), [allJobs])
  const filtered = useMemo(() => {
    let list = [...allJobs]
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
    if (jobTypeFilter !== 'all') list = list.filter(j => j.job_type === jobTypeFilter)
    if (salaryFilter === '5k') list = list.filter(j => (j.salary_min ?? 0) >= 5000)
    else if (salaryFilter === '10k') list = list.filter(j => (j.salary_min ?? 0) >= 10000)
    else if (salaryFilter === '20k') list = list.filter(j => (j.salary_min ?? 0) >= 20000)
    return list
  }, [allJobs, query, activeCategory, selectedEmirate, jobTypeFilter, salaryFilter])

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
              <Link href={`/${locale}/jobs/new`} className="flex items-center gap-2 bg-kerala-gold text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-kerala-gold-light transition-all text-sm">
                <Briefcase size={15} />
                {isMl ? 'ജോലി പോസ്റ്റ് ചെയ്യൂ' : 'Post a Job'}
              </Link>
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
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl p-5 animate-pulse space-y-3 border border-gray-100">
                    <div className="flex gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-100 rounded w-3/4" />
                        <div className="h-3 bg-gray-100 rounded w-1/2" />
                      </div>
                    </div>
                    <div className="h-3 bg-gray-100 rounded w-full" />
                    <div className="h-3 bg-gray-100 rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
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
              <Link href={`/${locale}/jobs/new`} className="block w-full bg-kerala-gold hover:bg-kerala-gold-light text-white font-semibold py-2.5 rounded-xl text-sm transition-all text-center">
                {isMl ? 'ജോലി പോസ്റ്റ് ചെയ്യൂ' : 'Post a Job'}
              </Link>
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
                {allJobs.slice(0, 5).map(j => (
                  <div key={j.id} className="flex items-center gap-3">
                    <div className="relative w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100 bg-gray-100">
                      {j.logo_url && <Image src={j.logo_url} alt={j.company} fill className="object-cover" sizes="32px" />}
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
