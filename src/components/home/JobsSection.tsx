'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { Briefcase, MapPin, Clock, ArrowRight, Building } from 'lucide-react'

const jobs = [
  {
    id: 1,
    title: 'Senior Accountant (Malayalam Speaking)',
    titleMl: 'സീനിയർ അക്കൗണ്ടന്റ് (മലയാളം)',
    company: 'Al Wafaa Group',
    companyMl: 'അൽ വഫ ഗ്രൂപ്പ്',
    location: 'Dubai, UAE',
    salary: 'AED 8,000 - 12,000',
    type: 'Full Time',
    typeMl: 'ഫുൾ ടൈം',
    posted: '1 day ago',
    postedMl: '1 ദിവസം മുൻപ്',
    logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=80&q=80',
    category: 'Finance',
    urgent: true,
  },
  {
    id: 2,
    title: 'Head Chef — Kerala & Malabar Cuisine',
    titleMl: 'ഹെഡ് ഷെഫ് — കേരള & മലബാർ ഭക്ഷണം',
    company: 'Keraleeyam Restaurant',
    companyMl: 'കേരളീയം റസ്റ്റോറന്റ്',
    location: 'Abu Dhabi, UAE',
    salary: 'AED 5,500 - 7,500',
    type: 'Full Time',
    typeMl: 'ഫുൾ ടൈം',
    posted: '3 hours ago',
    postedMl: '3 മണിക്കൂർ മുൻപ്',
    logo: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=80&q=80',
    category: 'Hospitality',
    urgent: false,
  },
  {
    id: 3,
    title: 'Real Estate Agent — Residential',
    titleMl: 'റിയൽ എസ്റ്റേറ്റ് ഏജന്റ്',
    company: 'Kerala Properties',
    companyMl: 'കേരള പ്രോപ്പർടീസ്',
    location: 'Dubai, UAE',
    salary: 'Commission Based',
    type: 'Full Time',
    typeMl: 'ഫുൾ ടൈം',
    posted: '2 days ago',
    postedMl: '2 ദിവസം മുൻപ്',
    logo: 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=80&q=80',
    category: 'Real Estate',
    urgent: false,
  },
  {
    id: 4,
    title: 'General Practitioner — Malayalam Clinic',
    titleMl: 'ജനറൽ പ്രാക്ടീഷണർ — മലയാളം ക്ലിനിക്',
    company: 'Malabar Medical Centre',
    companyMl: 'മലബാർ മെഡിക്കൽ സെന്റർ',
    location: 'Sharjah, UAE',
    salary: 'AED 18,000 - 25,000',
    type: 'Full Time',
    typeMl: 'ഫുൾ ടൈം',
    posted: '1 day ago',
    postedMl: '1 ദിവസം മുൻപ്',
    logo: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=80&q=80',
    category: 'Healthcare',
    urgent: true,
  },
  {
    id: 5,
    title: 'Software Engineer — React / Node.js',
    titleMl: 'സോഫ്റ്റ്‌വെയർ എഞ്ചിനിയർ',
    company: 'Trivandrum Tech',
    companyMl: 'തിരുവനന്തപുരം ടെക്',
    location: 'Dubai, UAE',
    salary: 'AED 12,000 - 18,000',
    type: 'Hybrid',
    typeMl: 'ഹൈബ്രിഡ്',
    posted: '5 hours ago',
    postedMl: '5 മണിക്കൂർ മുൻപ്',
    logo: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=80&q=80',
    category: 'Technology',
    urgent: false,
  },
  {
    id: 6,
    title: 'Customer Service — Malayalam & English',
    titleMl: 'ഉപഭോക്തൃ സേവനം — മലയാളം & ഇംഗ്ലീഷ്',
    company: 'Gulf Remit',
    companyMl: 'ഗൾഫ് റെമിറ്റ്',
    location: 'Dubai, UAE',
    salary: 'AED 3,500 - 4,500',
    type: 'Full Time',
    typeMl: 'ഫുൾ ടൈം',
    posted: '4 hours ago',
    postedMl: '4 മണിക്കൂർ മുൻപ്',
    logo: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=80&q=80',
    category: 'Finance',
    urgent: false,
  },
]

const categoryColors: Record<string, string> = {
  Finance: 'bg-blue-100 text-blue-700',
  Hospitality: 'bg-orange-100 text-orange-700',
  'Real Estate': 'bg-green-100 text-green-700',
  Healthcare: 'bg-red-100 text-red-700',
  Technology: 'bg-purple-100 text-purple-700',
}

export default function JobsSection() {
  const locale = useLocale()
  const isMl = locale === 'ml'

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
              {/* Company Logo */}
              <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border border-gray-200 bg-white">
                <Image
                  src={job.logo}
                  alt={job.company}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-semibold text-kerala-deep text-sm leading-snug group-hover:text-kerala-green transition-colors line-clamp-2">
                    {isMl ? job.titleMl : job.title}
                  </h3>
                  {job.urgent && (
                    <span className="bg-kerala-red text-white text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0">
                      {isMl ? 'അർജന്റ്' : 'Urgent'}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-gray-600 text-xs font-medium mb-2">
                  <Building size={11} />
                  {isMl ? job.companyMl : job.company}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${categoryColors[job.category] || 'bg-gray-100 text-gray-700'}`}>
                    {job.category}
                  </span>
                  <span className="flex items-center gap-1 text-gray-400 text-xs">
                    <MapPin size={10} />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1 text-gray-400 text-xs">
                    <Briefcase size={10} />
                    {isMl ? job.typeMl : job.type}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-kerala-green font-semibold text-sm">{job.salary}</span>
                  <span className="flex items-center gap-1 text-gray-400 text-xs">
                    <Clock size={10} />
                    {isMl ? job.postedMl : job.posted}
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
            href={`/${locale}/jobs/post`}
            className="flex-shrink-0 bg-kerala-gold hover:bg-kerala-gold-light text-white font-bold px-6 py-3 rounded-xl transition-all"
          >
            {isMl ? 'ജോലി പോസ്റ്റ് ചെയ്യൂ' : 'Post a Job'}
          </Link>
        </div>
      </div>
    </section>
  )
}
