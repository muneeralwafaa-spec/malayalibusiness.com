'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { supabase } from '@/lib/supabase'
import {
  CalendarDays, Clock, MapPin, Users, Tag,
  ChevronRight, CheckCircle, AlertCircle, Ticket
} from 'lucide-react'

const EMIRATES = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain']

const CATEGORIES = [
  { value: 'cultural',    label: 'Cultural',    labelMl: 'സാംസ്കാരിക',   color: 'border-purple-400 bg-purple-50 text-purple-700' },
  { value: 'networking',  label: 'Networking',  labelMl: 'നെറ്റ്‌വർക്കിംഗ്', color: 'border-blue-400 bg-blue-50 text-blue-700' },
  { value: 'food',        label: 'Food',        labelMl: 'ഭക്ഷണം',         color: 'border-orange-400 bg-orange-50 text-orange-700' },
  { value: 'business',    label: 'Business',    labelMl: 'ബിസിനസ്',        color: 'border-green-400 bg-green-50 text-green-700' },
  { value: 'sports',      label: 'Sports',      labelMl: 'കായിക',          color: 'border-red-400 bg-red-50 text-red-700' },
  { value: 'education',   label: 'Education',   labelMl: 'വിദ്യാഭ്യാസം',   color: 'border-teal-400 bg-teal-50 text-teal-700' },
]

export default function NewEventPage() {
  const locale = useLocale()
  const isMl = locale === 'ml'
  const router = useRouter()

  const [form, setForm] = useState({
    title: '',
    title_ml: '',
    description: '',
    category: '',
    event_date: '',
    event_time: '',
    end_time: '',
    emirate: '',
    venue: '',
    price: '',
    capacity: '',
    organizer: '',
    tags: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  function set(key: string, value: string) {
    setForm(f => ({ ...f, [key]: value }))
    setErrors(e => { const n = { ...e }; delete n[key]; return n })
  }

  function validate() {
    const e: Record<string, string> = {}
    if (!form.title.trim())       e.title       = isMl ? 'ശീർഷകം നൽകൂ' : 'Event title is required'
    if (!form.description.trim()) e.description = isMl ? 'വിവരണം നൽകൂ' : 'Description is required'
    if (!form.category)           e.category    = isMl ? 'വർഗ്ഗം തിരഞ്ഞെടുക്കൂ' : 'Select a category'
    if (!form.event_date)         e.event_date  = isMl ? 'തീയതി നൽകൂ' : 'Event date is required'
    if (!form.emirate)            e.emirate     = isMl ? 'എമിറേറ്റ് തിരഞ്ഞെടുക്കൂ' : 'Select an emirate'
    if (!form.organizer.trim())   e.organizer   = isMl ? 'സംഘടകൻ്റെ പേർ നൽകൂ' : 'Organizer name is required'
    return e
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setSubmitting(true)

    // Get logged-in user if available
    const { data: { user } } = await supabase.auth.getUser()

    const priceVal = form.price.trim() === '' || form.price.trim().toLowerCase() === 'free'
      ? null
      : Number(form.price.replace(/[^0-9.]/g, '')) || null

    const capacityVal = form.capacity.trim() === ''
      ? null
      : parseInt(form.capacity) || null

    const tagsArr = form.tags.trim()
      ? form.tags.split(',').map(t => t.trim()).filter(Boolean)
      : []

    const { error } = await supabase.from('events').insert({
      title:        form.title.trim(),
      title_ml:     form.title_ml.trim() || null,
      description:  form.description.trim(),
      category:     form.category,
      event_date:   form.event_date,
      event_time:   form.event_time || null,
      end_time:     form.end_time || null,
      emirate:      form.emirate,
      venue:        form.venue.trim() || null,
      price:        priceVal,
      capacity:     capacityVal,
      registered:   0,
      organizer:    form.organizer.trim(),
      organizer_id: user?.id ?? null,
      tags:         tagsArr,
      featured:     false,
      status:       'active',
    })

    setSubmitting(false)

    if (error) {
      console.error('[NewEvent]', error.message)
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
              {isMl ? 'ഇവൻ്റ് പ്രസിദ്ധീകരിച്ചു!' : 'Event Posted!'}
            </h2>
            <p className="text-gray-500 mb-8">
              {isMl
                ? 'നിങ്ങളുടെ ഇവൻ്റ് വിജയകരമായി ചേർക്കപ്പെട്ടു. ഉടൻ ലിസ്റ്റിൽ ദൃശ്യമാകും.'
                : 'Your event has been successfully submitted and will appear in the listing shortly.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href={`/${locale}/events`}
                className="px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors">
                {isMl ? 'എല്ലാ ഇവൻ്റുകളും' : 'View All Events'}
              </Link>
              <button
                onClick={() => { setSubmitted(false); setForm({ title: '', title_ml: '', description: '', category: '', event_date: '', event_time: '', end_time: '', emirate: '', venue: '', price: '', capacity: '', organizer: '', tags: '' }) }}
                className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                {isMl ? 'മറ്റൊരു ഇവൻ്റ് ചേർക്കൂ' : 'Post Another Event'}
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
            <Link href={`/${locale}/events`} className="hover:text-gray-700 transition-colors">Events</Link>
            <ChevronRight size={14} />
            <span className="text-gray-700">{isMl ? 'പുതിയ ഇവൻ്റ്' : 'Post Event'}</span>
          </nav>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <CalendarDays size={20} className="text-purple-600" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold text-gray-900">
                {isMl ? 'ഇവൻ്റ് പ്രസിദ്ധീകരിക്കൂ' : 'Post an Event'}
              </h1>
              <p className="text-sm text-gray-500">
                {isMl ? 'UAE മലയാളി കമ്മ്യൂണിറ്റിക്ക് നിങ്ങളുടെ ഇവൻ്റ് അറിയിക്കൂ' : 'Share your event with the UAE Malayali community'}
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

          {/* Category */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-4">
              {isMl ? 'ഇവൻ്റ് വർഗ്ഗം' : 'Event Category'} <span className="text-red-500">*</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => set('category', cat.value)}
                  className={`px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all text-left ${
                    form.category === cat.value
                      ? cat.color + ' ring-2 ring-offset-1'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {isMl ? cat.labelMl : cat.label}
                </button>
              ))}
            </div>
            {errors.category && <p className="text-red-500 text-xs mt-2 flex items-center gap-1"><AlertCircle size={12} />{errors.category}</p>}
          </div>

          {/* Event Details */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-5">
            <h2 className="font-semibold text-gray-900">
              {isMl ? 'ഇവൻ്റ് വിവരങ്ങൾ' : 'Event Details'}
            </h2>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {isMl ? 'ഇവൻ്റ് ശീർഷകം (English)' : 'Event Title (English)'} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={e => set('title', e.target.value)}
                placeholder="e.g. Kerala Cultural Night 2025"
                className={`w-full rounded-xl border ${errors.title ? 'border-red-300 bg-red-50' : 'border-gray-200'} px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500`}
              />
              {errors.title && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.title}</p>}
            </div>

            {/* Title ML */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {isMl ? 'ശീർഷകം (Malayalam — ഐച്ഛിക)' : 'Title in Malayalam (Optional)'}
              </label>
              <input
                type="text"
                value={form.title_ml}
                onChange={e => set('title_ml', e.target.value)}
                placeholder="ഉദാ: കേരള കൾചറൽ നൈറ്റ് 2025"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 font-malayalam"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {isMl ? 'വിവരണം' : 'Description'} <span className="text-red-500">*</span>
              </label>
              <textarea
                value={form.description}
                onChange={e => set('description', e.target.value)}
                rows={4}
                placeholder={isMl ? 'ഇവൻ്റിനെ കുറിച്ച് വിശദമായി പറയൂ...' : 'Describe your event in detail...'}
                className={`w-full rounded-xl border ${errors.description ? 'border-red-300 bg-red-50' : 'border-gray-200'} px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none`}
              />
              {errors.description && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.description}</p>}
            </div>

            {/* Organizer */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Users size={14} />
                  {isMl ? 'സംഘടകൻ / ഓർഗനൈസർ' : 'Organizer / Host'} <span className="text-red-500">*</span>
                </span>
              </label>
              <input
                type="text"
                value={form.organizer}
                onChange={e => set('organizer', e.target.value)}
                placeholder={isMl ? 'ഓർഗനൈസറുടെ പേർ' : 'e.g. Kerala Association Dubai'}
                className={`w-full rounded-xl border ${errors.organizer ? 'border-red-300 bg-red-50' : 'border-gray-200'} px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500`}
              />
              {errors.organizer && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.organizer}</p>}
            </div>
          </div>

          {/* Date & Time */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-5">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Clock size={16} className="text-gray-400" />
              {isMl ? 'തീയതിയും സമയവും' : 'Date & Time'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {isMl ? 'ഇവൻ്റ് തീയതി' : 'Event Date'} <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={form.event_date}
                  onChange={e => set('event_date', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full rounded-xl border ${errors.event_date ? 'border-red-300 bg-red-50' : 'border-gray-200'} px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500`}
                />
                {errors.event_date && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.event_date}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {isMl ? 'ആരംഭ സമയം' : 'Start Time'}
                </label>
                <input
                  type="time"
                  value={form.event_time}
                  onChange={e => set('event_time', e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {isMl ? 'അവസാന സമയം' : 'End Time'}
                </label>
                <input
                  type="time"
                  value={form.end_time}
                  onChange={e => set('end_time', e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-5">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <MapPin size={16} className="text-gray-400" />
              {isMl ? 'സ്ഥലം' : 'Location'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {isMl ? 'എമിറേറ്റ്' : 'Emirate'} <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.emirate}
                  onChange={e => set('emirate', e.target.value)}
                  className={`w-full rounded-xl border ${errors.emirate ? 'border-red-300 bg-red-50' : 'border-gray-200'} px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white`}
                >
                  <option value="">{isMl ? 'തിരഞ്ഞെടുക്കൂ' : 'Select Emirate'}</option>
                  {EMIRATES.map(em => <option key={em} value={em}>{em}</option>)}
                </select>
                {errors.emirate && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.emirate}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {isMl ? 'വേദി / വേന്യൂ' : 'Venue / Location'} <span className="text-gray-400 font-normal text-xs ml-1">(optional)</span>
                </label>
                <input
                  type="text"
                  value={form.venue}
                  onChange={e => set('venue', e.target.value)}
                  placeholder={isMl ? 'ഉദാ: Dubai World Trade Centre' : 'e.g. Dubai World Trade Centre'}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Tickets & Capacity */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-5">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Ticket size={16} className="text-gray-400" />
              {isMl ? 'ടിക്കറ്റ് & ശേഷി' : 'Tickets & Capacity'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {isMl ? 'ടിക്കറ്റ് വില (AED)' : 'Ticket Price (AED)'}
                  <span className="text-gray-400 font-normal text-xs ml-1">
                    {isMl ? '— ഒഴിഞ്ഞിട്ടാൽ സൗജന്യം' : '— leave blank for Free'}
                  </span>
                </label>
                <input
                  type="text"
                  value={form.price}
                  onChange={e => set('price', e.target.value)}
                  placeholder={isMl ? 'ഉദാ: 50 അല്ലെങ്കിൽ ഒഴിഞ്ഞിടൂ' : 'e.g. 50 or leave blank for free'}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {isMl ? 'പരമാവധി സ്ഥലം' : 'Max Capacity'}
                  <span className="text-gray-400 font-normal text-xs ml-1">(optional)</span>
                </label>
                <input
                  type="number"
                  value={form.capacity}
                  onChange={e => set('capacity', e.target.value)}
                  min={1}
                  placeholder={isMl ? 'ഉദാ: 200' : 'e.g. 200'}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <Tag size={16} className="text-gray-400" />
              {isMl ? 'ടാഗുകൾ' : 'Tags'}
              <span className="text-gray-400 font-normal text-xs ml-1">(optional)</span>
            </h2>
            <input
              type="text"
              value={form.tags}
              onChange={e => set('tags', e.target.value)}
              placeholder={isMl ? 'ഉദാ: onam, kerala, cultural, dubai (comma separated)' : 'e.g. onam, kerala, cultural, dubai (comma separated)'}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <p className="text-xs text-gray-400 mt-2">{isMl ? 'കോമ ഉപയോഗിച്ച് ടാഗ് വേർതിരിക്കൂ' : 'Separate tags with commas'}</p>
          </div>

          {/* Submit */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white font-semibold py-4 px-8 rounded-xl transition-colors flex items-center justify-center gap-2"
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
                  <CalendarDays size={18} />
                  {isMl ? 'ഇവൻ്റ് പ്രസിദ്ധീകരിക്കൂ' : 'Post Event'}
                </>
              )}
            </button>
            <Link
              href={`/${locale}/events`}
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
