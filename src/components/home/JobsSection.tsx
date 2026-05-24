'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { useEffect, useState } from 'react'
import { Briefcase, MapPin, Clock, ArrowRight, Building, Loader2 } from 'lucide-react'
import { getJobs } from '@/lib/jobs'
import type { Job } from '@/lib/jobs'

const categoryColors: Record<string, string> = {
  Finance:     'bg-blue-100 text-blue-700',
  Hospitality: 'bg-orange-100 text-orange-700',
  'Real Estate': 'bg-green-100 text-green-700',
  Healthcare:  'bg-red-100 text-red-700',
  Technology:  'bg-purple-100 text-purple-700',
  Engineering: 'bg-yellow-100 text-yellow-700',
  Marketing:   'bg-pink-100 text-pink-700',
  Education:   'bg-cyan-100 text-cyan-700',
}

function salaryLabel(job: Job) {
  if (job.salary_min && job.salary_max) return `AED ${job.salary_min.toLocaleString()} – ${job.salary_max.toLocaleString()}`
  if (job.salary_min) return `AED ${job.salary_min.toLocaleString()}+`
  return 'Negotiable'
}

function timeAgo(iso: string, isMl: boolean) {
  const h = Math.floor((Date.now() - new Date(iso).getTime()) / 3600000)
  if (h < 24) return isMl ? `${h} മണിക്കൂർ മുൻപ്` : `${h}h ago`
  const d = Math.floor(h / 24)
  return isMl ? `${d} ദിവസം മുൻപ്` : `${d}d ago`
}

const LOGO_FALLBACK = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=80&q=80'

export default function JobsSection() {
  const locale = useLocale()
  const isMl = locale === 'ml'
  const [jobs,    setJobs]    = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getJobs({ limit: 6 }).then(data => {
      setJobs(data)
      setLoading(false)
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

  if (!jobs.length) return null

  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-kerala-green font-semibold text-sm uppercase tracking-widest mb-2">
              {isMl ? 'കരിയർ' : 'Careers'}
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-semibold text-kerala-deep">
              {isMl ? 'ജോലി അവസരങ്ങൾ' : 'Job Opportunities'}
            </h2>
            <p className="text-gray-500 mt-2">
              {isMl ? 'മലയാളി ബിസിനസ് നെറ്റ്‌വർക്കിൽ നിങ്ങളുടെ അടുത്ത കരിയർ' : 'Find your next career move within the Malayali business network'}
            </p>
          </div>
          <Link
            href={`/${locale}/jobs`}
            className="flex items-center gap-2 border border-kerala-green text-kerala-green hover:bg-kerala-green hover:text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-all whitespace-nowrap"
          >
            {isMl ? 'എല്ലാ ജോലികളും' : 'View All Jobs'}
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <Link
              key={job.id}
              href={`/${locale}/jobs/${job.id}`}
              className="group bg-kerala-cream hover:bg-white border border-transparent hover:border-gray-200 rounded-2xl p-5 card-hover flex items-start gap-4"
            >
              <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border border-gray-200 bg-white">
                <Image
                  src={job.logo_url || LOGO_FALLBACK}
                  alt={job.company}
                  fill
                  className="object-cover"
                  sizes="56px"
                  onError={(e) => { (e.target as HTMLImageElement).src = LOGO_FALLBACK }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-semibold text-kerala-deep text-sm leading-snug group-hover:text-kerala-green transition-colors line-clamp-2">
                    {isMl ? (job.title_ml ?? job.title) : job.title}
                  </h3>
                  {job.urgent && (
                    <span className="bg-kerala-red text-white text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0">
                      {isMl ? 'അർജന്റ്' : 'Urgent'}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-gray-600 text-xs font-medium mb-2">
                  <Building size={11} />
                  {isMl ? (job.company_ml ?? job.company) : job.company}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${categoryColors[job.category] ?? 'bg-gray-100 text-gray-700'}`}>
                    {job.category}
                  </span>
                  <span className="flex items-center gap-1 text-gray-400 text-xs">
                    <MapPin size={10} />
                    {isMl ? (job.emirate_ml ?? job.emirate) : job.emirate}
                  </span>
                  <span className="flex items-center gap-1 text-gray-400 text-xs">
                    <Briefcase size={10} />
                    {job.job_type}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-kerala-green font-semibold text-sm">{salaryLabel(job)}</span>
                  <span className="flex items-center gap-1 text-gray-400 text-xs">
                    <Clock size={10} />
                    {timeAgo(job.created_at, isMl)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Post a Job CTA */}
        <div className="mt-8 bg-gradient-to-r from-kerala-deep to-kerala-green rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-serif text-xl font-bold text-white">
              {isMl ? 'ജോലി ഒഴിവ് ഉണ്ടോ?' : 'Hiring Malayali talent?'}
            </h3>
            <p className="text-white/70 text-sm mt-1">
              {isMl ? 'ഞങ്ങളുടെ ജോബ് ബോർഡിൽ ഒരു ജോലി പോസ്റ്റ് ചെയ്യൂ' : 'Post a job on our board and reach 3.5M+ Malayalis'}
            </p>
          </div>
          <Link
            href={`/${locale}/jobs`}
            className="flex-shrink-0 bg-kerala-gold hover:bg-kerala-gold-light text-white font-bold px-6 py-3 rounded-xl transition-all"
          >
            {isMl ? 'ജോലി പോസ്റ്റ് ചെയ്യൂ' : 'Post a Job'}
          </Link>
        </div>
      </div>
    </section>
  )
}
