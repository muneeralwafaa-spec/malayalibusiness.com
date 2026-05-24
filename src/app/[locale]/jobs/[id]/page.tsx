'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { useParams } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import {
  MapPin, Briefcase, Clock, DollarSign, Users,
  CheckCircle, X, Upload, Bookmark, ArrowLeft,
  Building2, Calendar, Award, ChevronRight, Copy, Tag, Loader2
} from 'lucide-react'
import { getJob, getJobs } from '@/lib/jobs'
import type { Job } from '@/lib/jobs'

// ─── Salary helper ─────────────────────────────────────────────────────────────

function salaryLabel(job: Job, isMl: boolean): string {
  if (job.salary_min && job.salary_max)
    return `AED ${job.salary_min.toLocaleString()} – ${job.salary_max.toLocaleString()}${isMl ? ' / മാസം' : ' / month'}`
  if (job.salary_min)
    return `AED ${job.salary_min.toLocaleString()}+`
  return isMl ? 'ചർച്ചക്ക് വിധേയം' : 'Negotiable'
}

const LOGO_FALLBACK = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=80&q=80'

// ─── Apply Modal ──────────────────────────────────────────────────────────────

interface ApplyModalProps {
  job: Job
  isMl: boolean
  onClose: () => void
}

function ApplyModal({ job, isMl, onClose }: ApplyModalProps) {
  const [form,      setForm]      = useState({ name: '', email: '', phone: '', cover: '' })
  const [loading,   setLoading]   = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => { setLoading(false); setSubmitted(true) }, 1200)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-kerala-green to-kerala-deep p-5 rounded-t-2xl flex items-center justify-between">
          <div>
            <p className="text-white/70 text-xs">{isMl ? 'അപേക്ഷ' : 'Apply for'}</p>
            <h3 className="text-white font-serif text-lg font-bold">
              {isMl ? (job.title_ml ?? job.title) : job.title}
            </h3>
            <p className="text-kerala-gold text-sm">
              {isMl ? (job.company_ml ?? job.company) : job.company}
            </p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {submitted ? (
            <div className="text-center py-8">
              <CheckCircle size={56} className="text-kerala-green mx-auto mb-3" />
              <h4 className="font-serif text-xl text-kerala-deep font-bold mb-2">
                {isMl ? 'അപേക്ഷ സ്വീകരിച്ചു!' : 'Application Submitted!'}
              </h4>
              <p className="text-gray-500 text-sm">
                {isMl
                  ? 'ടീം 3 ദിവസത്തിനകം ബന്ധപ്പെടും.'
                  : 'Our recruitment team will reach out within 3 business days.'}
              </p>
              <button
                onClick={onClose}
                className="mt-5 bg-kerala-green text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-kerala-green/90 transition-colors"
              >
                {isMl ? 'അടയ്ക്കുക' : 'Close'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">
                  {isMl ? 'പൂർണ്ണ നാമം' : 'Full Name'} *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-kerala-green"
                  placeholder={isMl ? 'നിങ്ങളുടെ പേര്' : 'Your full name'}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">
                  {isMl ? 'ഇമെയിൽ' : 'Email Address'} *
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-kerala-green"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">
                  {isMl ? 'ഫോൺ' : 'Phone Number'} *
                </label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-kerala-green"
                  placeholder="+971 50 000 0000"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">
                  {isMl ? 'കവർ ലെറ്റർ' : 'Cover Letter'}
                </label>
                <textarea
                  rows={4}
                  value={form.cover}
                  onChange={(e) => setForm((f) => ({ ...f, cover: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-kerala-green resize-none"
                  placeholder={isMl ? 'ഈ ജോലി നിങ്ങൾക്ക് അനുയോജ്യമായ കാരണം...' : 'Tell us why you are the right fit for this role...'}
                />
              </div>
              <div>
                <button
                  type="button"
                  className="w-full border-2 border-dashed border-gray-300 rounded-xl px-3 py-4 text-sm text-gray-500 hover:border-kerala-green hover:text-kerala-green transition-colors flex items-center justify-center gap-2"
                >
                  <Upload size={16} />
                  {isMl ? 'CV/Resume അപ്‌ലോഡ് ചെയ്യൂ (PDF/DOC)' : 'Upload CV / Resume (PDF, DOC)'}
                </button>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-kerala-green hover:bg-kerala-green/90 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : null}
                {isMl ? 'അപേക്ഷ സമർപ്പിക്കൂ' : 'Submit Application'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function JobDetailPage() {
  const locale = useLocale()
  const params = useParams()
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : ''

  const isMl = locale === 'ml'

  const [job,         setJob]         = useState<Job | null>(null)
  const [similarJobs, setSimilarJobs] = useState<Job[]>([])
  const [loading,     setLoading]     = useState(true)
  const [notFound,    setNotFound]    = useState(false)
  const [showModal,   setShowModal]   = useState(false)
  const [saved,       setSaved]       = useState(false)
  const [copied,      setCopied]      = useState(false)

  useEffect(() => {
    getJob(id).then(data => {
      if (!data) { setNotFound(true); setLoading(false); return }
      setJob(data)
      setLoading(false)
      // Fetch similar jobs
      getJobs({ category: data.category, limit: 5 }).then(all => {
        setSimilarJobs(all.filter(j => j.id !== data.id).slice(0, 4))
      })
    })
  }, [id])

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-kerala-cream">
        <Navbar />
        <div className="flex justify-center items-center py-40">
          <Loader2 size={36} className="animate-spin text-kerala-green" />
        </div>
        <Footer />
      </main>
    )
  }

  if (notFound || !job) {
    return (
      <main className="min-h-screen bg-kerala-cream">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-32 text-center">
          <h1 className="font-serif text-3xl font-bold text-kerala-deep mb-4">
            {isMl ? 'ജോലി കണ്ടെത്തിയില്ല' : 'Job Not Found'}
          </h1>
          <p className="text-gray-500 mb-8">
            {isMl ? 'ഈ ജോലി നിലവിലില്ല.' : 'This job posting does not exist or has been removed.'}
          </p>
          <Link href={`/${locale}/jobs`} className="inline-flex items-center gap-2 bg-kerala-green text-white px-6 py-3 rounded-xl font-semibold hover:bg-kerala-green/90 transition-colors">
            <ArrowLeft size={16} /> {isMl ? 'ജോലികൾ' : 'All Jobs'}
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  const salary      = salaryLabel(job, isMl)
  const postedAgo   = Math.floor((Date.now() - new Date(job.created_at).getTime()) / 86400000)
  const requirements = isMl
    ? (job.requirements_ml?.length ? job.requirements_ml : job.requirements)
    : job.requirements
  const description  = (isMl ? (job.description_ml ?? job.description) : job.description) ?? ''

  return (
    <main className="min-h-screen bg-kerala-cream pb-20 md:pb-0">
      <Navbar />

      {/* ── Job Header ── */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 pt-6 pb-6">
          {/* Back link */}
          <Link
            href={`/${locale}/jobs`}
            className="inline-flex items-center gap-1 text-gray-500 hover:text-kerala-green text-sm mb-4 transition-colors"
          >
            <ArrowLeft size={14} /> {isMl ? 'ജോലികൾ' : 'All Jobs'}
          </Link>

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              {/* Logo */}
              <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm flex-shrink-0">
                <Image
                  src={job.logo_url || LOGO_FALLBACK}
                  alt={job.company}
                  fill
                  className="object-cover"
                  sizes="64px"
                  onError={(e) => { (e.target as HTMLImageElement).src = LOGO_FALLBACK }}
                />
              </div>
              <div>
                <h1 className="font-serif text-2xl md:text-3xl text-kerala-deep font-bold">
                  {isMl ? (job.title_ml ?? job.title) : job.title}
                </h1>
                <p className="text-kerala-green font-semibold mt-1">
                  {isMl ? (job.company_ml ?? job.company) : job.company}
                </p>
                <div className="flex flex-wrap gap-3 mt-3 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <MapPin size={14} />
                    {isMl ? (job.emirate_ml ?? job.emirate) : job.emirate}
                    {job.location && ` — ${isMl ? (job.location_ml ?? job.location) : job.location}`}
                  </span>
                  <span className="flex items-center gap-1"><DollarSign size={14} /> {salary}</span>
                  <span className="flex items-center gap-1"><Briefcase size={14} /> {job.job_type}</span>
                  <span className="flex items-center gap-1"><Clock size={14} /> {job.experience}</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {[job.job_type, job.category].map((chip) => (
                    <span key={chip} className="bg-kerala-green/10 text-kerala-green text-xs px-3 py-1 rounded-full font-semibold">
                      {chip}
                    </span>
                  ))}
                  {job.urgent && (
                    <span className="bg-kerala-red text-white text-xs font-bold px-3 py-1 rounded-full">
                      {isMl ? 'അർജന്റ്' : 'Urgent'}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="hidden md:flex gap-2">
              <button
                onClick={() => setSaved(!saved)}
                className={`p-2.5 rounded-xl border transition-colors ${saved ? 'bg-kerala-gold/10 border-kerala-gold text-kerala-gold' : 'border-gray-200 text-gray-400 hover:border-kerala-gold hover:text-kerala-gold'}`}
              >
                <Bookmark size={18} className={saved ? 'fill-kerala-gold' : ''} />
              </button>
              <button
                onClick={handleCopy}
                className="p-2.5 rounded-xl border border-gray-200 text-gray-400 hover:border-kerala-green hover:text-kerala-green transition-colors"
              >
                {copied ? <CheckCircle size={18} className="text-kerala-green" /> : <Copy size={18} />}
              </button>
              <button
                onClick={() => setShowModal(true)}
                className="bg-kerala-green text-white px-6 py-2.5 rounded-xl font-bold hover:bg-kerala-green/90 transition-colors"
              >
                {isMl ? 'ഇപ്പോൾ അപേക്ഷിക്കൂ' : 'Apply Now'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">

            {/* Job Description */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-serif text-xl text-kerala-deep font-bold mb-4">
                {isMl ? 'ജോലി വിവരണം' : 'Job Description'}
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed text-sm">
                {description.split('\n\n').map((para, i) => (
                  <p key={i} className={isMl ? 'font-malayalam' : ''}>{para}</p>
                ))}
              </div>
            </section>

            {/* Requirements */}
            {requirements.length > 0 && (
              <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="font-serif text-xl text-kerala-deep font-bold mb-4">
                  {isMl ? 'ആവശ്യകതകൾ' : 'Requirements'}
                </h2>
                <ul className="space-y-2">
                  {requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                      <CheckCircle size={15} className="text-kerala-green mt-0.5 shrink-0" />
                      <span className={isMl ? 'font-malayalam' : ''}>{req}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Share & Save */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-serif text-lg text-kerala-deep font-bold mb-4">
                {isMl ? 'ഈ ജോലി പങ്കിടൂ' : 'Share This Job'}
              </h2>
              <div className="flex flex-wrap gap-3">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    (isMl ? (job.title_ml ?? job.title) : job.title) +
                    ' at ' + (isMl ? (job.company_ml ?? job.company) : job.company) +
                    ' — ' + (typeof window !== 'undefined' ? window.location.href : '')
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  WhatsApp
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#0A66C2] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  LinkedIn
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

          {/* Sidebar */}
          <div className="space-y-6">

            {/* Job Summary Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-4">
              <h3 className="font-semibold text-kerala-deep mb-4 uppercase text-xs tracking-wide">
                {isMl ? 'ജോലി സംഗ്രഹം' : 'Job Summary'}
              </h3>
              <dl className="space-y-3 text-sm">
                {[
                  { icon: <DollarSign size={14} />, label: isMl ? 'ശമ്പളം' : 'Salary',     value: salary },
                  { icon: <Briefcase   size={14} />, label: isMl ? 'തരം'     : 'Job Type',  value: job.job_type },
                  { icon: <Award       size={14} />, label: isMl ? 'അനുഭവം'  : 'Experience',value: job.experience },
                  { icon: <Building2   size={14} />, label: isMl ? 'വ്യവസായം': 'Category',  value: job.category },
                  { icon: <Calendar    size={14} />, label: isMl ? 'പ്രസിദ്ധീകരിച്ചത്' : 'Posted', value: `${postedAgo}d ${isMl ? 'മുമ്പ്' : 'ago'}` },
                  ...(job.deadline ? [{
                    icon: <Clock size={14} />,
                    label: isMl ? 'അവസാന തീയതി' : 'Deadline',
                    value: new Date(job.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
                  }] : []),
                  { icon: <Users size={14} />, label: isMl ? 'അപേക്ഷകർ' : 'Applicants', value: `${job.applicants}+` },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="flex items-start gap-2.5">
                    <span className="text-kerala-green mt-0.5">{icon}</span>
                    <div>
                      <span className="text-gray-400 text-xs">{label}</span>
                      <p className="font-semibold text-kerala-deep">{value}</p>
                    </div>
                  </div>
                ))}
              </dl>

              <button
                onClick={() => setShowModal(true)}
                className="mt-5 w-full bg-kerala-green hover:bg-kerala-green/90 text-white font-bold py-3.5 rounded-xl transition-colors text-sm"
              >
                {isMl ? 'ഇപ്പോൾ അപേക്ഷിക്കൂ' : 'Apply Now'}
              </button>
              <button
                onClick={() => setSaved(!saved)}
                className={`mt-2 w-full border font-semibold py-2.5 rounded-xl transition-colors text-sm flex items-center justify-center gap-2 ${saved ? 'border-kerala-gold text-kerala-gold bg-kerala-gold/5' : 'border-gray-200 text-gray-600 hover:border-kerala-gold hover:text-kerala-gold'}`}
              >
                <Bookmark size={14} className={saved ? 'fill-kerala-gold' : ''} />
                {saved ? (isMl ? 'സംരക്ഷിച്ചു' : 'Saved') : (isMl ? 'ജോലി സംരക്ഷിക്കൂ' : 'Save Job')}
              </button>
            </div>

            {/* Similar Jobs */}
            {similarJobs.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-semibold text-kerala-deep mb-4 uppercase text-xs tracking-wide">
                  {isMl ? 'സമാന ജോലികൾ' : 'Similar Jobs'}
                </h3>
                <div className="space-y-3">
                  {similarJobs.map((sj) => (
                    <Link
                      key={sj.id}
                      href={`/${locale}/jobs/${sj.id}`}
                      className="flex gap-3 group p-2 rounded-xl hover:bg-kerala-cream transition-colors"
                    >
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-gray-100 shrink-0 bg-white">
                        <Image
                          src={sj.logo_url || LOGO_FALLBACK}
                          alt={sj.company}
                          fill
                          className="object-cover"
                          sizes="40px"
                          onError={(e) => { (e.target as HTMLImageElement).src = LOGO_FALLBACK }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-kerala-deep group-hover:text-kerala-green transition-colors line-clamp-1">
                          {isMl ? (sj.title_ml ?? sj.title) : sj.title}
                        </p>
                        <p className="text-gray-400 text-xs mt-0.5 truncate">
                          {isMl ? (sj.company_ml ?? sj.company) : sj.company}
                        </p>
                        <p className="text-kerala-gold text-xs font-semibold mt-0.5">
                          {salaryLabel(sj, false)}
                        </p>
                      </div>
                      <ChevronRight size={14} className="text-gray-300 group-hover:text-kerala-green shrink-0 mt-1 transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-semibold text-kerala-deep mb-3 uppercase text-xs tracking-wide">
                {isMl ? 'ടാഗുകൾ' : 'Tags'}
              </h3>
              <div className="flex flex-wrap gap-2">
                {[job.category, job.job_type, job.emirate].filter(Boolean).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 bg-kerala-green/10 text-kerala-green text-xs px-3 py-1.5 rounded-full"
                  >
                    <Tag size={10} /> {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Apply bar — mobile only */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 flex gap-3 md:hidden z-40 shadow-lg">
        <button
          onClick={() => setSaved(!saved)}
          className={`p-3 rounded-xl border transition-colors shrink-0 ${saved ? 'border-kerala-gold text-kerala-gold bg-kerala-gold/5' : 'border-gray-200 text-gray-400'}`}
        >
          <Bookmark size={18} className={saved ? 'fill-kerala-gold' : ''} />
        </button>
        <button
          onClick={() => setShowModal(true)}
          className="flex-1 bg-kerala-green text-white font-bold py-3 rounded-xl hover:bg-kerala-green/90 transition-colors text-sm"
        >
          {isMl ? 'ഇപ്പോൾ അപേക്ഷിക്കൂ' : 'Apply Now'}
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <ApplyModal job={job} isMl={isMl} onClose={() => setShowModal(false)} />
      )}

      <Footer />
    </main>
  )
}
