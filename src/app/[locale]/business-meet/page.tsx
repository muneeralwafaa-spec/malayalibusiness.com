'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { createClient } from '@supabase/supabase-js'
import {
  CheckCircle2, Users, Utensils, TrendingUp, Wifi, Star,
  Phone, Mail, Building2, MapPin, User, Briefcase, ChevronRight,
  Calendar, Clock, Award, ArrowRight, Sparkles, Shield
} from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const EMIRATES = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain']
const INDUSTRIES = [
  'Real Estate', 'Technology & IT', 'Healthcare', 'Food & Restaurant', 'Retail & Trading',
  'Finance & Accounting', 'Legal & PRO Services', 'Construction & Engineering',
  'Education & Training', 'Media & Marketing', 'Logistics & Transport', 'Travel & Tourism',
  'Beauty & Wellness', 'Consulting', 'Other'
]
const HOW = ['malayalibusiness.com', 'Me2connect', 'WhatsApp', 'Instagram', 'Facebook', 'LinkedIn', 'Friend / Colleague', 'Other']

const BENEFITS = [
  { icon: CheckCircle2, text: 'Entry Access to the Event', color: 'text-kerala-gold' },
  { icon: Users,         text: 'Networking with 100+ Business Connections', color: 'text-kerala-gold' },
  { icon: Star,          text: 'Registration on malayalibusiness.com', color: 'text-kerala-gold' },
  { icon: Utensils,      text: 'Gala Dinner', color: 'text-kerala-gold' },
  { icon: TrendingUp,    text: 'Opportunity to Generate Minimum 3 Business Leads', color: 'text-kerala-gold' },
]

type FormState = {
  full_name: string
  phone: string
  whatsapp: string
  email: string
  company: string
  designation: string
  industry: string
  emirate: string
  how_heard: string
  message: string
}

const EMPTY: FormState = {
  full_name: '', phone: '', whatsapp: '', email: '',
  company: '', designation: '', industry: '', emirate: '',
  how_heard: '', message: '',
}

export default function BusinessMeetPage() {
  const locale = useLocale()
  const [form, setForm] = useState<FormState>(EMPTY)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.full_name || !form.phone || !form.email || !form.company || !form.emirate) {
      setErrorMsg('Please fill in all required fields.')
      return
    }
    setStatus('loading')
    setErrorMsg('')
    try {
      const { error } = await supabase.from('business_meet_registrations').insert([{
        full_name: form.full_name,
        phone: form.phone,
        whatsapp: form.whatsapp || form.phone,
        email: form.email,
        company: form.company,
        designation: form.designation,
        industry: form.industry,
        emirate: form.emirate,
        how_heard: form.how_heard,
        message: form.message,
        event_name: 'UAE Malayali Business Meet',
        pass_type: 'Entry Pass',
        amount: 250,
        currency: 'AED',
        status: 'pending',
      }])
      if (error) throw error
      setStatus('success')
      setForm(EMPTY)
    } catch (err: unknown) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <main className="min-h-screen bg-kerala-deep flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4 py-24">
          <div className="bg-white/5 backdrop-blur-sm border border-kerala-gold/30 rounded-3xl p-10 max-w-md w-full text-center">
            <div className="w-20 h-20 bg-kerala-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} className="text-kerala-gold" />
            </div>
            <h2 className="font-serif text-3xl font-bold text-white mb-3">Registration Received!</h2>
            <p className="text-white/70 mb-2">
              Thank you, <span className="text-kerala-gold font-semibold">{form.full_name || 'you'}</span>!
            </p>
            <p className="text-white/60 text-sm mb-8">
              We&apos;ve received your registration for the <strong className="text-white">UAE Malayali Business Meet</strong>.
              Our team will contact you on WhatsApp/email with payment and event details shortly.
            </p>
            <div className="bg-kerala-gold/10 border border-kerala-gold/20 rounded-xl p-4 mb-8">
              <p className="text-kerala-gold-light font-semibold text-sm mb-1">Entry Pass — AED 250</p>
              <p className="text-white/60 text-xs">Payment details will be shared via WhatsApp</p>
            </div>
            <Link
              href={`/${locale}`}
              className="inline-flex items-center gap-2 bg-kerala-green text-white px-6 py-3 rounded-xl font-semibold hover:bg-kerala-green-light transition-colors"
            >
              Back to Home <ArrowRight size={16} />
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-kerala-deep">
      <Navbar />

      {/* ─── HERO BANNER ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-16">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(45deg, #c8922a 0, #c8922a 1px, transparent 0, transparent 50%)`,
            backgroundSize: '20px 20px'
          }} />
        </div>
        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-kerala-gold/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-kerala-green/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-0">
          {/* Presented by */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px flex-1 max-w-24 bg-kerala-gold/30" />
            <span className="text-kerala-gold/70 text-xs font-semibold uppercase tracking-widest">Brought to you by</span>
            <div className="h-px flex-1 max-w-24 bg-kerala-gold/30" />
          </div>
          <div className="flex items-center justify-center gap-4 sm:gap-8 mb-10">
            <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 sm:px-6 sm:py-3">
              <span className="text-white font-bold text-sm sm:text-base tracking-wide">Me2connect</span>
            </div>
            <span className="text-kerala-gold/50 text-lg">&</span>
            <div className="bg-kerala-gold/10 border border-kerala-gold/20 rounded-xl px-4 py-2 sm:px-6 sm:py-3">
              <span className="text-kerala-gold font-bold text-sm sm:text-base tracking-wide">malayalibusiness.com</span>
            </div>
          </div>

          {/* Event title block */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-kerala-gold/10 border border-kerala-gold/30 rounded-full px-5 py-2 mb-6">
              <Sparkles size={14} className="text-kerala-gold" />
              <span className="text-kerala-gold text-xs font-bold uppercase tracking-widest">Premium Networking Event</span>
            </div>

            <h1 className="font-serif font-bold text-white leading-tight mb-4">
              <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">UAE Malayali</span>
              <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-kerala-gold">Business Meet</span>
            </h1>

            <div className="flex items-center justify-center gap-2 sm:gap-4 mb-8 flex-wrap">
              {['Connect', 'Collaborate', 'Grow'].map((word, i) => (
                <div key={word} className="flex items-center gap-2 sm:gap-4">
                  <span className="text-white/90 font-semibold text-base sm:text-lg md:text-xl tracking-wide">{word}</span>
                  {i < 2 && <span className="text-kerala-gold text-xl">•</span>}
                </div>
              ))}
            </div>

            <p className="text-white/60 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              A premium networking platform bringing together entrepreneurs, business owners,
              professionals &amp; brands across the UAE.
            </p>
          </div>

          {/* Pass card */}
          <div className="flex justify-center mb-0">
            <div className="relative w-full max-w-lg">
              {/* Glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-kerala-gold via-kerala-gold-light to-kerala-gold rounded-2xl blur opacity-30" />
              <div className="relative bg-gradient-to-br from-[#1a1a0a] to-[#0a2b1a] border-2 border-kerala-gold/40 rounded-2xl overflow-hidden">
                {/* Ticket top */}
                <div className="bg-gradient-to-r from-kerala-gold to-kerala-gold-light p-4 sm:p-5 flex items-center justify-between">
                  <div>
                    <p className="text-kerala-deep text-xs font-bold uppercase tracking-widest mb-0.5">Entry Pass</p>
                    <p className="text-kerala-deep font-serif text-2xl sm:text-3xl font-bold">AED 250</p>
                  </div>
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-kerala-deep/20 rounded-full flex items-center justify-center">
                    <Award size={28} className="text-kerala-deep" />
                  </div>
                </div>
                {/* Ticket perforated edge */}
                <div className="flex items-center px-4">
                  <div className="w-5 h-5 bg-kerala-deep rounded-full -ml-7" />
                  <div className="flex-1 border-t-2 border-dashed border-kerala-gold/30 mx-1" />
                  <div className="w-5 h-5 bg-kerala-deep rounded-full -mr-7" />
                </div>
                {/* Benefits list */}
                <div className="p-4 sm:p-6 space-y-3">
                  {BENEFITS.map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-kerala-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle2 size={12} className="text-kerala-gold" />
                      </div>
                      <span className="text-white/85 text-sm leading-snug">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="relative mt-12">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block">
            <path d="M0 60L60 48C120 36 240 12 360 6C480 0 600 12 720 24C840 36 960 48 1080 48C1200 48 1320 36 1380 30L1440 24V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0V60Z" fill="#faf7f2"/>
          </svg>
        </div>
      </section>

      {/* ─── REGISTRATION FORM ────────────────────────────────────── */}
      <section className="bg-kerala-cream py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-kerala-green/10 border border-kerala-green/20 rounded-full px-5 py-2 mb-4">
              <Shield size={14} className="text-kerala-green" />
              <span className="text-kerala-green text-xs font-bold uppercase tracking-widest">Secure Registration</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-kerala-deep mb-2">Reserve Your Seat</h2>
            <p className="text-gray-500 text-sm">Fill in your details below. Payment instructions will be sent via WhatsApp after registration.</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Form header */}
            <div className="bg-kerala-deep px-6 sm:px-8 py-5 flex items-center justify-between">
              <div>
                <p className="text-kerala-gold text-xs font-bold uppercase tracking-widest mb-1">UAE Malayali Business Meet</p>
                <p className="text-white font-semibold">Registration Form</p>
              </div>
              <div className="text-right">
                <p className="text-white/50 text-xs">Entry Pass</p>
                <p className="text-kerala-gold font-serif text-xl font-bold">AED 250</p>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              {/* Personal Info */}
              <div>
                <h3 className="text-kerala-deep font-semibold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                  <User size={15} className="text-kerala-green" /> Personal Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={form.full_name}
                      onChange={set('full_name')}
                      placeholder="Your full name"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-kerala-green focus:ring-2 focus:ring-kerala-green/10 transition-all placeholder-gray-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Phone Number <span className="text-red-500">*</span></label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={set('phone')}
                      placeholder="+971 50 000 0000"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-kerala-green focus:ring-2 focus:ring-kerala-green/10 transition-all placeholder-gray-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">WhatsApp Number</label>
                    <input
                      type="tel"
                      value={form.whatsapp}
                      onChange={set('whatsapp')}
                      placeholder="Same as phone if same"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-kerala-green focus:ring-2 focus:ring-kerala-green/10 transition-all placeholder-gray-300"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email Address <span className="text-red-500">*</span></label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={set('email')}
                      placeholder="your@email.com"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-kerala-green focus:ring-2 focus:ring-kerala-green/10 transition-all placeholder-gray-300"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-kerala-deep font-semibold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Briefcase size={15} className="text-kerala-green" /> Business Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Company / Business Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={form.company}
                      onChange={set('company')}
                      placeholder="Your company or business name"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-kerala-green focus:ring-2 focus:ring-kerala-green/10 transition-all placeholder-gray-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Designation / Role</label>
                    <input
                      type="text"
                      value={form.designation}
                      onChange={set('designation')}
                      placeholder="CEO, Manager, Consultant..."
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-kerala-green focus:ring-2 focus:ring-kerala-green/10 transition-all placeholder-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Industry / Sector</label>
                    <select
                      value={form.industry}
                      onChange={set('industry')}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-kerala-green focus:ring-2 focus:ring-kerala-green/10 transition-all text-gray-700 bg-white"
                    >
                      <option value="">Select your industry</option>
                      {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Emirate <span className="text-red-500">*</span></label>
                    <select
                      value={form.emirate}
                      onChange={set('emirate')}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-kerala-green focus:ring-2 focus:ring-kerala-green/10 transition-all text-gray-700 bg-white"
                      required
                    >
                      <option value="">Select emirate</option>
                      {EMIRATES.map(e => <option key={e} value={e}>{e}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">How did you hear about us?</label>
                    <select
                      value={form.how_heard}
                      onChange={set('how_heard')}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-kerala-green focus:ring-2 focus:ring-kerala-green/10 transition-all text-gray-700 bg-white"
                    >
                      <option value="">Select source</option>
                      {HOW.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Message / Expectations (optional)</label>
                <textarea
                  value={form.message}
                  onChange={set('message')}
                  placeholder="What do you hope to achieve at the event? Any specific connections you're looking for?"
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-kerala-green focus:ring-2 focus:ring-kerala-green/10 transition-all placeholder-gray-300 resize-none"
                />
              </div>

              {/* Price reminder */}
              <div className="bg-kerala-cream border border-kerala-gold/20 rounded-2xl p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-kerala-gold/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Award size={22} className="text-kerala-gold" />
                </div>
                <div className="flex-1">
                  <p className="text-kerala-deep font-bold text-sm">Entry Pass — AED 250 per person</p>
                  <p className="text-gray-500 text-xs mt-0.5">Payment instructions will be sent via WhatsApp after form submission</p>
                </div>
              </div>

              {errorMsg && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-kerala-green text-white py-4 rounded-xl font-bold text-base hover:bg-kerala-green-light disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-kerala-green/20"
              >
                {status === 'loading' ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Register Now <ChevronRight size={18} />
                  </>
                )}
              </button>

              <p className="text-center text-xs text-gray-400">
                By registering, you agree to be contacted by the organizers via WhatsApp/email with event details.
              </p>
            </div>
          </form>

          {/* Trust signals */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            {[
              { icon: Shield, title: 'Secure', sub: 'Your data is safe' },
              { icon: Users,  title: '100+ Attendees', sub: 'Expected' },
              { icon: Award,  title: 'Premium Event', sub: 'Gala Dinner included' },
            ].map(({ icon: Icon, title, sub }) => (
              <div key={title} className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100">
                <Icon size={20} className="text-kerala-green mx-auto mb-2" />
                <p className="text-kerala-deep font-semibold text-xs">{title}</p>
                <p className="text-gray-400 text-xs mt-0.5">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
