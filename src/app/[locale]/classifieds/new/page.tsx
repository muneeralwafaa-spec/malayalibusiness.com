'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { classifiedCategories } from '@/lib/classifieds'
import {
  ChevronRight, Upload, X, CheckCircle,
  MapPin, Phone, Tag, AlertCircle
} from 'lucide-react'

const EMIRATES = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain']

const AD_TYPES = [
  { value: 'sale',    label: 'For Sale',  labelMl: 'വിൽക്കാനുണ്ട്', color: 'border-green-400 bg-green-50 text-green-700' },
  { value: 'rent',    label: 'For Rent',  labelMl: 'വാടകയ്ക്ക്',    color: 'border-blue-400 bg-blue-50 text-blue-700' },
  { value: 'wanted',  label: 'Wanted',    labelMl: 'വേണം',           color: 'border-orange-400 bg-orange-50 text-orange-700' },
  { value: 'service', label: 'Service',   labelMl: 'സർവ്വീസ്',       color: 'border-purple-400 bg-purple-50 text-purple-700' },
]

const CONDITIONS = [
  { value: 'new',      label: 'Brand New',  labelMl: 'പുതിയത്' },
  { value: 'like-new', label: 'Like New',   labelMl: 'ഏതാണ്ട് പുതിയത്' },
  { value: 'good',     label: 'Good',       labelMl: 'നല്ല അവസ്ഥ' },
  { value: 'fair',     label: 'Fair',       labelMl: 'സാധാരണ' },
]

export default function NewClassifiedPage() {
  const locale = useLocale()
  const isMl = locale === 'ml'

  const [form, setForm] = useState({
    type: 'sale',
    category: '',
    title: '',
    description: '',
    price: '',
    negotiable: false,
    condition: '',
    emirate: '',
    area: '',
    phone: '',
    whatsapp: '',
    name: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  function set(key: string, value: string | boolean) {
    setForm(f => ({ ...f, [key]: value }))
    setErrors(e => { const n = { ...e }; delete n[key]; return n })
  }

  function validate() {
    const e: Record<string, string> = {}
    if (!form.title.trim())       e.title    = 'Title is required'
    if (!form.category)           e.category = 'Select a category'
    if (!form.description.trim()) e.description = 'Description is required'
    if (!form.price.trim())       e.price    = 'Enter a price or write "Free"'
    if (!form.emirate)            e.emirate  = 'Select an emirate'
    if (!form.phone.trim())       e.phone    = 'Phone number is required'
    if (!form.name.trim())        e.name     = 'Your name is required'
    return e
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-kerala-cream">
        <Navbar />
        <div className="h-1 w-full bg-gradient-to-r from-kerala-green via-kerala-gold to-kerala-green" />
        <div className="flex flex-col items-center justify-center py-28 px-4 text-center">
          <div className="w-20 h-20 rounded-full bg-kerala-green/10 flex items-center justify-center mb-5">
            <CheckCircle size={40} className="text-kerala-green" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-kerala-deep mb-2">
            {isMl ? 'പരസ്യം സമർപ്പിച്ചു!' : 'Ad Submitted!'}
          </h1>
          <p className="text-gray-500 max-w-sm mb-8">
            {isMl
              ? 'നിങ്ങളുടെ പരസ്യം അവലോകനത്തിനായി സമർപ്പിച്ചു. 24 മണിക്കൂറിനുള്ളിൽ സജീവമാകും.'
              : 'Your ad has been submitted for review and will go live within 24 hours.'}
          </p>
          <div className="flex gap-3 flex-wrap justify-center">
            <Link href={`/${locale}/classifieds`}
              className="bg-kerala-green text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-kerala-green-light transition-colors">
              {isMl ? 'ക്ലാസിഫൈഡ്സ് കാണൂ' : 'Browse Classifieds'}
            </Link>
            <button onClick={() => setSubmitted(false)}
              className="border border-kerala-green text-kerala-green px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-kerala-green/5 transition-colors">
              {isMl ? 'മറ്റൊരു പരസ്യം' : 'Post Another Ad'}
            </button>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-kerala-cream">
      <Navbar />
      <div className="h-1 w-full bg-gradient-to-r from-kerala-green via-kerala-gold to-kerala-green" />

      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
          <Link href={`/${locale}`} className="hover:text-kerala-green">Home</Link>
          <ChevronRight size={12} />
          <Link href={`/${locale}/classifieds`} className="hover:text-kerala-green">Classifieds</Link>
          <ChevronRight size={12} />
          <span className="text-kerala-deep font-medium">{isMl ? 'പരസ്യം പോസ്റ്റ് ചെയ്യൂ' : 'Post an Ad'}</span>
        </nav>

        <div className="mb-6">
          <h1 className={`font-serif text-3xl font-bold text-kerala-deep mb-1 ${isMl ? 'font-malayalam' : ''}`}>
            {isMl ? 'പരസ്യം പോസ്റ്റ് ചെയ്യൂ' : 'Post a Free Ad'}
          </h1>
          <p className="text-gray-500 text-sm">
            {isMl ? 'UAE-ൽ 3.5 ദശലക്ഷം മലയാളികളിലേക്ക് എത്തൂ' : 'Reach 3.5 million Malayalis across UAE — 100% free'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Ad type */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <label className="block text-sm font-semibold text-kerala-deep mb-3">
              {isMl ? 'പരസ്യ തരം' : 'Ad Type'} <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {AD_TYPES.map(t => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => set('type', t.value)}
                  className={`py-2.5 px-3 rounded-xl text-sm font-semibold border-2 transition-all ${form.type === t.value ? t.color + ' border-opacity-100' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                >
                  {isMl ? t.labelMl : t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category & title */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
            <h2 className="font-semibold text-kerala-deep flex items-center gap-2">
              <Tag size={15} className="text-kerala-green" />
              {isMl ? 'വിഭാഗവും തലക്കെട്ടും' : 'Category & Title'}
            </h2>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                {isMl ? 'വിഭാഗം' : 'Category'} <span className="text-red-400">*</span>
              </label>
              <select
                value={form.category}
                onChange={e => set('category', e.target.value)}
                className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-kerala-green ${errors.category ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
              >
                <option value="">{isMl ? 'വിഭാഗം തിരഞ്ഞെടുക്കൂ' : 'Select a category'}</option>
                {classifiedCategories.map(c => (
                  <option key={c.slug} value={c.slug}>{c.icon} {isMl ? c.nameMl : c.name}</option>
                ))}
              </select>
              {errors.category && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle size={11} />{errors.category}</p>}
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                {isMl ? 'തലക്കെട്ട്' : 'Ad Title'} <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={e => set('title', e.target.value)}
                placeholder={isMl ? 'ഉദാ: 2021 Toyota Camry — Dubai' : 'e.g. 2021 Toyota Camry — Excellent Condition'}
                maxLength={100}
                className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-kerala-green ${errors.title ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
              />
              <div className="flex justify-between mt-1">
                {errors.title ? <p className="text-xs text-red-400 flex items-center gap-1"><AlertCircle size={11} />{errors.title}</p> : <span />}
                <p className="text-xs text-gray-400">{form.title.length}/100</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                {isMl ? 'വിവരണം' : 'Description'} <span className="text-red-400">*</span>
              </label>
              <textarea
                value={form.description}
                onChange={e => set('description', e.target.value)}
                placeholder={isMl ? 'ഉൽപ്പന്നം/സേവനം വിശദമായി വിവരിക്കൂ...' : 'Describe your item or service in detail. Include condition, features, reason for selling...'}
                rows={5}
                maxLength={1000}
                className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-kerala-green resize-none ${errors.description ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
              />
              <div className="flex justify-between mt-1">
                {errors.description ? <p className="text-xs text-red-400 flex items-center gap-1"><AlertCircle size={11} />{errors.description}</p> : <span />}
                <p className="text-xs text-gray-400">{form.description.length}/1000</p>
              </div>
            </div>
          </div>

          {/* Price & condition */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
            <h2 className="font-semibold text-kerala-deep">
              {isMl ? 'വില & അവസ്ഥ' : 'Price & Condition'}
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                  {isMl ? 'വില (AED)' : 'Price (AED)'} <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.price}
                  onChange={e => set('price', e.target.value)}
                  placeholder="e.g. 500 or Free"
                  className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-kerala-green ${errors.price ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                />
                {errors.price && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle size={11} />{errors.price}</p>}
              </div>
              <div className="flex items-end pb-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.negotiable}
                    onChange={e => set('negotiable', e.target.checked)}
                    className="w-4 h-4 accent-kerala-green rounded"
                  />
                  <span className="text-sm text-gray-600">{isMl ? 'വില ചർച്ചചെയ്യാം' : 'Negotiable'}</span>
                </label>
              </div>
            </div>

            {/* Condition — only for sale type */}
            {form.type === 'sale' && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2">
                  {isMl ? 'ഉൽപ്പന്ന അവസ്ഥ' : 'Item Condition'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {CONDITIONS.map(c => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => set('condition', form.condition === c.value ? '' : c.value)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border-2 transition-all ${form.condition === c.value ? 'border-kerala-green bg-kerala-green/10 text-kerala-green' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                    >
                      {isMl ? c.labelMl : c.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Location */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
            <h2 className="font-semibold text-kerala-deep flex items-center gap-2">
              <MapPin size={15} className="text-kerala-green" />
              {isMl ? 'സ്ഥലം' : 'Location'}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                  {isMl ? 'എമിറേറ്റ്' : 'Emirate'} <span className="text-red-400">*</span>
                </label>
                <select
                  value={form.emirate}
                  onChange={e => set('emirate', e.target.value)}
                  className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-kerala-green ${errors.emirate ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                >
                  <option value="">{isMl ? 'തിരഞ്ഞെടുക്കൂ' : 'Select emirate'}</option>
                  {EMIRATES.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
                {errors.emirate && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle size={11} />{errors.emirate}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                  {isMl ? 'പ്രദേശം' : 'Area / Neighbourhood'}
                </label>
                <input
                  type="text"
                  value={form.area}
                  onChange={e => set('area', e.target.value)}
                  placeholder="e.g. Karama, Al Nahda"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-kerala-green"
                />
              </div>
            </div>
          </div>

          {/* Photos */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-kerala-deep mb-3 flex items-center gap-2">
              <Upload size={15} className="text-kerala-green" />
              {isMl ? 'ഫോട്ടോകൾ' : 'Photos'}
              <span className="text-xs font-normal text-gray-400">{isMl ? '(ഓപ്ഷണൽ, പരമാവധി 6)' : '(optional, max 6)'}</span>
            </h2>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-kerala-green/40 transition-colors cursor-pointer">
              <Upload size={28} className="text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-400">{isMl ? 'ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യൂ' : 'Click to upload photos'}</p>
              <p className="text-xs text-gray-300 mt-1">JPG, PNG up to 5MB each</p>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
            <h2 className="font-semibold text-kerala-deep flex items-center gap-2">
              <Phone size={15} className="text-kerala-green" />
              {isMl ? 'ബന്ധപ്പെടൽ വിവരം' : 'Contact Details'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                  {isMl ? 'നിങ്ങളുടെ പേര്' : 'Your Name'} <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => set('name', e.target.value)}
                  placeholder="Full name"
                  className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-kerala-green ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                />
                {errors.name && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle size={11} />{errors.name}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                  {isMl ? 'ഫോൺ നമ്പർ' : 'Phone Number'} <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => set('phone', e.target.value)}
                  placeholder="+971 50 000 0000"
                  className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-kerala-green ${errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                />
                {errors.phone && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle size={11} />{errors.phone}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                  WhatsApp {isMl ? 'നമ്പർ' : 'Number'}
                  <span className="text-gray-300 font-normal ml-1">(optional)</span>
                </label>
                <input
                  type="tel"
                  value={form.whatsapp}
                  onChange={e => set('whatsapp', e.target.value)}
                  placeholder="+971 50 000 0000"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-kerala-green"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-kerala-green text-white py-3.5 rounded-xl font-bold text-sm hover:bg-kerala-green-light transition-colors shadow-lg shadow-kerala-green/20"
            >
              {isMl ? 'പരസ്യം പ്രസിദ്ധീകരിക്കൂ' : 'Post Ad for Free'}
            </button>
            <Link href={`/${locale}/classifieds`}
              className="flex items-center gap-2 px-5 py-3.5 rounded-xl border border-gray-200 text-gray-500 hover:border-kerala-green hover:text-kerala-green transition-colors text-sm font-semibold">
              <X size={15} />
              {isMl ? 'റദ്ദാക്കൂ' : 'Cancel'}
            </Link>
          </div>

          <p className="text-xs text-gray-400 text-center">
            {isMl
              ? 'പോസ്റ്റ് ചെയ്യുന്നതിലൂടെ നിങ്ങൾ ഞങ്ങളുടെ നിബന്ധനകൾ അംഗീകരിക്കുന്നു.'
              : 'By posting, you agree to our Terms of Service and Community Guidelines.'}
          </p>
        </form>
      </div>

      <Footer />
    </main>
  )
}
