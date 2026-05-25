'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { supabase } from '@/lib/supabase'
import {
  Briefcase, MapPin, DollarSign, Clock,
  ChevronRight, CheckCircle, AlertCircle, Plus, X
} from 'lucide-react'

const EMIRATES = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain']

const JOB_TYPES = [
  { value: 'full-time',   label: 'Full Time',   labelMl: 'ഫുൾ ടൈം',   color: 'border-green-400 bg-green-50 text-green-700' },
  { value: 'part-time',   label: 'Part Time',   labelMl: 'പാർട്ട് ടൈം', color: 'border-blue-400 bg-blue-50 text-blue-700' },
  { value: 'contract',    label: 'Contract',    labelMl: 'കോൺട്രാക്ട്', color: 'border-orange-400 bg-orange-50 text-orange-700' },
  { value: 'freelance',   label: 'Freelance',   labelMl: 'ഫ്രീലാൻസ്',  color: 'border-purple-400 bg-purple-50 text-purple-700' },
  { value: 'internship',  label: 'Internship',  labelMl: 'ഇൻ്റേൺഷിപ്പ്', color: 'border-teal-400 bg-teal-50 text-teal-700' },
]

const EXPERIENCE_LEVELS = [
  { value: 'entry',     label: 'Entry Level',     labelMl: 'തുടക്കക്കാർ',    sub: '0-2 years' },
  { value: 'mid',       label: 'Mid Level',       labelMl: 'മധ്യ തലം',       sub: '2-5 years' },
  { value: 'senior',    label: 'Senior',          labelMl: 'സീനിയർ',         sub: '5-10 years' },
  { value: 'lead',      label: 'Lead / Manager',  labelMl: 'ലീഡ് / മാനേജർ', sub: '8+ years' },
  { value: 'executive', label: 'Executive',       labelMl: 'എക്സിക്യൂട്ടീവ്', sub: 'C-level' },
]

const JOB_CATEGORIES = [
  'Technology & IT', 'Sales & Marketing', 'Finance & Accounting', 'Healthcare',
  'Construction & Engineering', 'Hospitality & Tourism', 'Education & Training',
  'Administration', 'Retail & Customer Service', 'Logistics & Supply Chain',
  'Human Resources', 'Legal', 'Design & Creative', 'Real Estate', 'Other'
]

export default function NewJobPage() {
  const locale = useLocale()
  const isMl = locale === 'ml'

  const [form, setForm] = useState({
    title: '',
    title_ml: '',
    company: '',
    job_type: '',
    experience: '',
    emirate: '',
    location: '',
    salary_min: '',
    salary_max: '',
    category: '',
    description: '',
    deadline: '',
  })
  const [requirements, setRequirements] = useState<string[]>([''])
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  function set(key: string, value: string) {
    setForm(f => ({ ...f, [key]: value }))
    setErrors(e => { const n = { ...e }; delete n[key]; return n })
  }

  function addRequirement() {
    setRequirements(r => [...r, ''])
  }

  function removeRequirement(index: number) {
    setRequirements(r => r.filter((_, i) => i !== index))
  }

  function setRequirement(index: number, value: string) {
    setRequirements(r => r.map((v, i) => i === index ? value : v))
  }

  function validate() {
    const e: Record<string, string> = {}
    if (!form.title.trim())   e.title      = isMl ? 'തൊഴിൽ ശീർഷകം നൽകൂ' : 'Job title is required'
    if (!form.company.trim()) e.company    = isMl ? 'കമ്പനി പേർ നൽകൂ' : 'Company name is required'
    if (!form.job_type)       e.job_type   = isMl ? 'തൊഴിൽ തരം തിരഞ്ഞെടുക്കൂ' : 'Select job type'
    if (!form.experience)     e.experience = isMl ? 'അനുഭവ തലം തിരഞ്ഞെടുക്കൂ' : 'Select experience level'
    if (!form.emirate)        e.emirate    = isMl ? 'എമിറേറ്റ് തിരഞ്ഞെടുക്കൂ' : 'Select an emirate'
    if (!form.category)       e.category   = isMl ? 'വർഗ്ഗം തിരഞ്ഞെടുക്കൂ' : 'Select a category'
    if (!form.description.trim()) e.description = isMl ? 'തൊഴിൽ വിവരണം നൽകൂ' : 'Job description is required'
    return e
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setSubmitting(true)

    const { data: { user } } = await supabase.auth.getUser()

    const reqArr = requirements.map(r => r.trim()).filter(Boolean)

    const { error } = await supabase.from('jobs').insert({
      title:        form.title.trim(),
      title_ml:     form.title_ml.trim() || null,
      company:      form.company.trim(),
      job_type:     form.job_type,
      experience:   form.experience,
      emirate:      form.emirate,
      location:     form.location.trim() || null,
      salary_min:   form.salary_min ? parseInt(form.salary_min) || null : null,
      salary_max:   form.salary_max ? parseInt(form.salary_max) || null : null,
      category:     form.category,
      description:  form.description.trim(),
      requirements: reqArr,
      requirements_ml: [],
      deadline:     form.deadline || null,
      applicants:   0,
      featured:     false,
      urgent:       false,
      verified:     false,
      poster_id:    user?.id ?? null,
      status:       'active',
    })

    setSubmitting(false)

    if (error) {
      console.error('[NewJob]', error.message)
      setErrors({ _global: 'Something went wrong. Please try again.' })
      return
    }

    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-kerala-cream">
        <Navbar />
        <div className="max-w-xl mx-auto px-4 py-24 text-center">
          <div className="bg-white rounded-3xl shadow-lg p-10">
            <CheckCircle size={56} className="mx-auto mb-5 text-green-500" />
            <h2 className="font-serif text-2xl font-bold text-gray-900 mb-3">
              {isMl ? 'തൊഴിൽ പ്രസിദ്ധീകരിച്ചു!' : 'Job Posted!'}
            </h2>
            <p className="text-gray-500 mb-8">
              {isMl
                ? 'നിങ്ങളുടെ തൊഴിൽ ഒഴിവ് വിജയകരമായി ചേർക്കപ്പെട്ടു. UAE മലയാളികൾക്ക് ഇപ്പോൾ ദൃശ്യമാകും.'
                : 'Your job listing has been submitted successfully and is now visible to UAE Malayalis.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href={`/${locale}/jobs`}
                className="px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors">
                {isMl ? 'എല്ലാ ജോലികളും' : 'View All Jobs'}
              </Link>
              <button
                onClick={() => {
                  setSubmitted(false)
                  setForm({ title: '', title_ml: '', company: '', job_type: '', experience: '', emirate: '', location: '', salary_min: '', salary_max: '', category: '', description: '', deadline: '' })
                  setRequirements([''])
                }}
                className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                {isMl ? 'മറ്റൊരു ജോലി ചേർക്കൂ' : 'Post Another Job'}
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-kerala-cream">
      <Navbar />

      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <Link href={`/${locale}`} className="hover:text-gray-700 transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link href={`/${locale}/jobs`} className="hover:text-gray-700 transition-colors">Jobs</Link>
            <ChevronRight size={14} />
            <span className="text-gray-700">{isMl ? 'ജോലി ചേർക്കൂ' : 'Post Job'}</span>
          </nav>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Briefcase size={20} className="text-blue-600" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold text-gray-900">
                {isMl ? 'ജോലി ഒഴിവ് പ്രസിദ്ധീകരിക്കൂ' : 'Post a Job'}
              </h1>
              <p className="text-sm text-gray-500">
                {isMl ? 'UAE മലയാളി ജോലിക്കാരെ കണ്ടെത്തൂ' : 'Find talented Malayali professionals in UAE'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-4 py-10">
        <form onSubmit={handleSubmit} noValidate className="space-y-8">

          {errors._global && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
              <AlertCircle size={18} className="shrink-0" />
              <span className="text-sm">{errors._global}</span>
            </div>
          )}

          {/* Job Type */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-4">
              {isMl ? 'തൊഴിൽ തരം' : 'Job Type'} <span className="text-red-500">*</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {JOB_TYPES.map(jt => (
                <button
                  key={jt.value}
                  type="button"
                  onClick={() => set('job_type', jt.value)}
                  className={`px-3 py-3 rounded-xl border-2 text-xs font-medium transition-all text-center ${
                    form.job_type === jt.value
                      ? jt.color + ' ring-2 ring-offset-1'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {isMl ? jt.labelMl : jt.label}
                </button>
              ))}
            </div>
            {errors.job_type && <p className="text-red-500 text-xs mt-2 flex items-center gap-1"><AlertCircle size={12} />{errors.job_type}</p>}
          </div>

          {/* Basic Info */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-5">
            <h2 className="font-semibold text-gray-900">
              {isMl ? 'തൊഴിൽ വിവരങ്ങൾ' : 'Job Details'}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {isMl ? 'ജോലി ശീർഷകം (English)' : 'Job Title (English)'} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => set('title', e.target.value)}
                  placeholder="e.g. Senior Software Engineer"
                  className={`w-full rounded-xl border ${errors.title ? 'border-red-300 bg-red-50' : 'border-gray-200'} px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.title && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.title}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {isMl ? 'ജോലി ശീർഷകം (Malayalam — ഐച്ഛിക)' : 'Job Title in Malayalam (Optional)'}
                </label>
                <input
                  type="text"
                  value={form.title_ml}
                  onChange={e => set('title_ml', e.target.value)}
                  placeholder="ഉദാ: സോഫ്റ്റ്‌വെയർ എഞ്ചിനീയർ"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-malayalam"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {isMl ? 'കമ്പനി / ബിസിനസ്' : 'Company / Business'} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.company}
                onChange={e => set('company', e.target.value)}
                placeholder={isMl ? 'കമ്പനിയുടെ പേർ' : 'e.g. Al Barakah Trading LLC'}
                className={`w-full rounded-xl border ${errors.company ? 'border-red-300 bg-red-50' : 'border-gray-200'} px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.company && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.company}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {isMl ? 'വർഗ്ഗം' : 'Job Category'} <span className="text-red-500">*</span>
              </label>
              <select
                value={form.category}
                onChange={e => set('category', e.target.value)}
                className={`w-full rounded-xl border ${errors.category ? 'border-red-300 bg-red-50' : 'border-gray-200'} px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white`}
              >
                <option value="">{isMl ? 'വർഗ്ഗം തിരഞ്ഞെടുക്കൂ' : 'Select Category'}</option>
                {JOB_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              {errors.category && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.category}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {isMl ? 'ജോലി വിവരണം' : 'Job Description'} <span className="text-red-500">*</span>
              </label>
              <textarea
                value={form.description}
                onChange={e => set('description', e.target.value)}
                rows={5}
                placeholder={isMl
                  ? 'ജോലിയെ കുറിച്ച് വിശദമായി പറയൂ — ഉത്തരവാദിത്വങ്ങൾ, ആനുകൂല്യങ്ങൾ, ടീം...'
                  : 'Describe the role in detail — responsibilities, benefits, team culture...'}
                className={`w-full rounded-xl border ${errors.description ? 'border-red-300 bg-red-50' : 'border-gray-200'} px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none`}
              />
              {errors.description && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.description}</p>}
            </div>
          </div>

          {/* Experience Level */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-4">
              {isMl ? 'അനുഭവ തലം' : 'Experience Level'} <span className="text-red-500">*</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {EXPERIENCE_LEVELS.map(exp => (
                <button
                  key={exp.value}
                  type="button"
                  onClick={() => set('experience', exp.value)}
                  className={`px-3 py-3 rounded-xl border-2 text-xs font-medium transition-all text-center ${
                    form.experience === exp.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-200 ring-offset-1'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <div>{isMl ? exp.labelMl : exp.label}</div>
                  <div className="text-gray-400 font-normal mt-0.5">{exp.sub}</div>
                </button>
              ))}
            </div>
            {errors.experience && <p className="text-red-500 text-xs mt-2 flex items-center gap-1"><AlertCircle size={12} />{errors.experience}</p>}
          </div>

          {/* Location & Salary */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-5">
            <h2 className="font-semibold text-gray-900">
              {isMl ? 'സ്ഥലവും ശമ്പളവും' : 'Location & Salary'}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} />
                    {isMl ? 'എമിറേറ്റ്' : 'Emirate'} <span className="text-red-500">*</span>
                  </span>
                </label>
                <select
                  value={form.emirate}
                  onChange={e => set('emirate', e.target.value)}
                  className={`w-full rounded-xl border ${errors.emirate ? 'border-red-300 bg-red-50' : 'border-gray-200'} px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white`}
                >
                  <option value="">{isMl ? 'തിരഞ്ഞെടുക്കൂ' : 'Select Emirate'}</option>
                  {EMIRATES.map(em => <option key={em} value={em}>{em}</option>)}
                </select>
                {errors.emirate && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.emirate}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {isMl ? 'പ്രദേശം / ഏരിയ' : 'Area / Location'}
                  <span className="text-gray-400 font-normal text-xs ml-1">(optional)</span>
                </label>
                <input
                  type="text"
                  value={form.location}
                  onChange={e => set('location', e.target.value)}
                  placeholder={isMl ? 'ഉദാ: Business Bay, Dubai' : 'e.g. Business Bay, Dubai'}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <DollarSign size={14} />
                    {isMl ? 'ഏറ്റവും കുറഞ്ഞ ശമ്പളം (AED/month)' : 'Min Salary (AED/month)'}
                    <span className="text-gray-400 font-normal text-xs">(optional)</span>
                  </span>
                </label>
                <input
                  type="number"
                  value={form.salary_min}
                  onChange={e => set('salary_min', e.target.value)}
                  min={0}
                  placeholder="e.g. 5000"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {isMl ? 'ഏറ്റവും കൂടിയ ശമ്പളം (AED/month)' : 'Max Salary (AED/month)'}
                  <span className="text-gray-400 font-normal text-xs ml-1">(optional)</span>
                </label>
                <input
                  type="number"
                  value={form.salary_max}
                  onChange={e => set('salary_max', e.target.value)}
                  min={0}
                  placeholder="e.g. 10000"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Clock size={14} />
                  {isMl ? 'അവസാന തീയതി' : 'Application Deadline'}
                  <span className="text-gray-400 font-normal text-xs">(optional)</span>
                </span>
              </label>
              <input
                type="date"
                value={form.deadline}
                onChange={e => set('deadline', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full sm:w-64 rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-4">
              {isMl ? 'ആവശ്യകതകൾ' : 'Requirements'}
              <span className="text-gray-400 font-normal text-xs ml-2">(optional)</span>
            </h2>
            <div className="space-y-3">
              {requirements.map((req, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold shrink-0">
                    {i + 1}
                  </div>
                  <input
                    type="text"
                    value={req}
                    onChange={e => setRequirement(i, e.target.value)}
                    placeholder={isMl ? `ആവശ്യകത ${i + 1}` : `Requirement ${i + 1}`}
                    className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {requirements.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRequirement(i)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addRequirement}
              className="mt-3 flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              <Plus size={16} />
              {isMl ? 'ആവശ്യകത ചേർക്കൂ' : 'Add Requirement'}
            </button>
          </div>

          {/* Submit */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-4 px-8 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  {isMl ? 'പ്രസിദ്ധീകരിക്കുന്നു...' : 'Posting...'}
                </span>
              ) : (
                <>
                  <Briefcase size={18} />
                  {isMl ? 'ജോലി ഒഴിവ് പ്രസിദ്ധീകരിക്കൂ' : 'Post Job'}
                </>
              )}
            </button>
            <Link
              href={`/${locale}/jobs`}
              className="px-6 py-4 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors text-center"
            >
              {isMl ? 'റദ്ദ് ചെയ്യൂ' : 'Cancel'}
            </Link>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  )
}
