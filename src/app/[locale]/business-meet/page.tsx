'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { createClient } from '@supabase/supabase-js'
import {
  CheckCircle2, Users, Utensils, TrendingUp, Star,
  MapPin, User, Briefcase, ChevronRight,
  Calendar, Clock, Award, ArrowRight, Sparkles, Shield, Timer
} from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// ─── Event Details ────────────────────────────────────────────────────────────
const EVENT_DATE  = new Date('2026-06-27T16:00:00')   // 27 Jun 2026, 4 PM GST
const EVENT_DATE_LABEL  = 'Saturday, 27th June 2026'
const EVENT_TIME_LABEL  = '4:00 PM Onwards'
const EVENT_VENUE_SHORT = 'Ramee Hotel, Business Bay'
const EVENT_VENUE_FULL  = 'Ramee Hotel, Business Bay, Dubai'

// ─── Countdown hook ───────────────────────────────────────────────────────────
function useCountdown(target: Date) {
  const calc = () => {
    const diff = target.getTime() - Date.now()
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    return {
      days:    Math.floor(diff / 86400000),
      hours:   Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000)  / 60000),
      seconds: Math.floor((diff % 60000)    / 1000),
    }
  }
  const [t, setT] = useState(calc)
  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000)
    return () => clearInterval(id)
  })
  return t
}

// ─── Static data ──────────────────────────────────────────────────────────────
const EMIRATES   = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain']
const INDUSTRIES = [
  'Real Estate', 'Technology & IT', 'Healthcare', 'Food & Restaurant', 'Retail & Trading',
  'Finance & Accounting', 'Legal & PRO Services', 'Construction & Engineering',
  'Education & Training', 'Media & Marketing', 'Logistics & Transport', 'Travel & Tourism',
  'Beauty & Wellness', 'Consulting', 'Other',
]
const HOW = ['malayalibusiness.com', 'Me2connect', 'WhatsApp', 'Instagram', 'Facebook', 'LinkedIn', 'Friend / Colleague', 'Other']

const BENEFITS = [
  { icon: CheckCircle2, text: 'Entry Access to the Event' },
  { icon: Users,        text: 'Networking with 100+ Business Connections' },
  { icon: Star,         text: 'Registration on malayalibusiness.com' },
  { icon: Utensils,     text: 'Gala Dinner' },
  { icon: TrendingUp,   text: 'Opportunity to Generate Minimum 3 Business Leads' },
]

// ─── Form types ───────────────────────────────────────────────────────────────
type FormState = {
  full_name: string; phone: string; whatsapp: string; email: string
  company: string; designation: string; industry: string; emirate: string
  how_heard: string; message: string
}
const EMPTY: FormState = {
  full_name: '', phone: '', whatsapp: '', email: '',
  company: '', designation: '', industry: '', emirate: '',
  how_heard: '', message: '',
}

// ─── Countdown block ─────────────────────────────────────────────────────────
function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-white/10 border border-white/20 rounded-xl w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center mb-1.5">
        <span className="font-serif text-xl sm:text-2xl font-bold text-white tabular-nums">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="text-white/50 text-[10px] uppercase tracking-widest">{label}</span>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function BusinessMeetPage() {
  const locale   = useLocale()
  const countdown = useCountdown(EVENT_DATE)
  const [form, setForm]       = useState<FormState>(EMPTY)
  const [registeredName, setRegisteredName] = useState('')
  const [status, setStatus]   = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const set = (k: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.full_name || !form.phone || !form.email || !form.company || !form.emirate) {
      setErrorMsg('Please fill in all required fields marked with *')
      return
    }
    setStatus('loading')
    setErrorMsg('')
    try {
      const { error } = await supabase.from('business_meet_registrations').insert([{
        full_name:   form.full_name,
        phone:       form.phone,
        whatsapp:    form.whatsapp || form.phone,
        email:       form.email,
        company:     form.company,
        designation: form.designation,
        industry:    form.industry,
        emirate:     form.emirate,
        how_heard:   form.how_heard,
        message:     form.message,
        event_name:  'UAE Malayali Business Meet',
        pass_type:   'Entry Pass',
        amount:      250,
        currency:    'AED',
        status:      'pending',
      }])
      if (error) throw error
      setRegisteredName(form.full_name)
      setStatus('success')
      setForm(EMPTY)
    } catch (err: unknown) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  // ── Success screen ──────────────────────────────────────────────────────────
  if (status === 'success') {
    return (
      <main className="min-h-screen bg-kerala-deep flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4 py-24">
          <div className="bg-white/5 backdrop-blur-sm border border-kerala-gold/30 rounded-3xl p-8 sm:p-12 max-w-lg w-full text-center">
            {/* Animated checkmark */}
            <div className="w-20 h-20 bg-kerala-gold/20 rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ring-kerala-gold/10">
              <CheckCircle2 size={40} className="text-kerala-gold" />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2">
              You&apos;re Registered! 🎉
            </h2>
            <p className="text-kerala-gold font-semibold mb-4">{registeredName}</p>
            <p className="text-white/60 text-sm leading-relaxed mb-8">
              Thank you for registering for the <strong className="text-white">UAE Malayali Business Meet</strong>.
              Our team will reach you on WhatsApp with payment confirmation and event details.
            </p>

            {/* Event details recap */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-8 space-y-3 text-left">
              <div className="flex items-center gap-3">
                <Calendar size={16} className="text-kerala-gold flex-shrink-0" />
                <span className="text-white text-sm">{EVENT_DATE_LABEL}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={16} className="text-kerala-gold flex-shrink-0" />
                <span className="text-white text-sm">{EVENT_TIME_LABEL}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-kerala-gold flex-shrink-0" />
                <span className="text-white text-sm">{EVENT_VENUE_FULL}</span>
              </div>
            </div>

            <div className="bg-kerala-gold/10 border border-kerala-gold/20 rounded-xl p-4 mb-8">
              <p className="text-kerala-gold-light font-bold text-sm">Entry Pass — AED 250</p>
              <p className="text-white/50 text-xs mt-1">Payment link will be shared via WhatsApp</p>
            </div>

            <Link
              href={`/${locale}`}
              className="inline-flex items-center gap-2 bg-kerala-green text-white px-8 py-3 rounded-xl font-semibold hover:bg-kerala-green-light transition-colors"
            >
              Back to Home <ArrowRight size={16} />
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  // ── Main page ───────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-kerala-deep">
      <Navbar />

      {/* ══════════════════════════════════════════════════════
          HERO BANNER
      ══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden pt-16">

        {/* Diagonal gold grid pattern */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, #c8922a 0, #c8922a 1px, transparent 0, transparent 50%)`,
            backgroundSize: '24px 24px',
          }}
        />
        {/* Glow orbs */}
        <div className="absolute top-20 left-1/3 w-[500px] h-[500px] bg-kerala-gold/8 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-kerala-green/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-0">

          {/* ── Presented by ─────────────────────────────────── */}
          <div className="flex items-center justify-center gap-3 mb-7">
            <div className="h-px flex-1 max-w-20 bg-kerala-gold/25" />
            <span className="text-kerala-gold/60 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em]">
              Brought to you by
            </span>
            <div className="h-px flex-1 max-w-20 bg-kerala-gold/25" />
          </div>
          <div className="flex items-center justify-center gap-3 sm:gap-6 mb-10">
            <div className="bg-white/6 border border-white/12 rounded-xl px-4 py-2.5 sm:px-6 sm:py-3">
              <span className="text-white font-bold text-sm sm:text-base tracking-wide">Me2connect</span>
            </div>
            <span className="text-kerala-gold/40 text-xl font-thin">&amp;</span>
            <div className="bg-kerala-gold/10 border border-kerala-gold/25 rounded-xl px-4 py-2.5 sm:px-6 sm:py-3">
              <span className="text-kerala-gold font-bold text-sm sm:text-base tracking-wide">
                malayalibusiness.com
              </span>
            </div>
          </div>

          {/* ── Title ────────────────────────────────────────── */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-kerala-gold/10 border border-kerala-gold/25 rounded-full px-5 py-2 mb-6">
              <Sparkles size={13} className="text-kerala-gold" />
              <span className="text-kerala-gold text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em]">
                Premium Networking Event
              </span>
            </div>

            <h1 className="font-serif font-bold text-white leading-[1.1] mb-5">
              <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl">UAE Malayali</span>
              <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-kerala-gold via-kerala-gold-light to-kerala-gold bg-clip-text text-transparent">
                Business Meet
              </span>
            </h1>

            <div className="flex items-center justify-center gap-3 sm:gap-5 mb-7 flex-wrap">
              {['Connect', 'Collaborate', 'Grow'].map((word, i) => (
                <div key={word} className="flex items-center gap-3 sm:gap-5">
                  <span className="text-white/80 font-semibold text-base sm:text-lg tracking-wide">{word}</span>
                  {i < 2 && <span className="text-kerala-gold/60 text-lg">•</span>}
                </div>
              ))}
            </div>

            <p className="text-white/55 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              A premium networking platform bringing together entrepreneurs, business owners,
              professionals &amp; brands across the UAE.
            </p>
          </div>

          {/* ── Event details strip ───────────────────────────── */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-0 mb-10">
            <div className="flex items-center gap-3 px-5 py-3 sm:border-r border-kerala-gold/20">
              <div className="w-9 h-9 rounded-xl bg-kerala-gold/15 flex items-center justify-center flex-shrink-0">
                <Calendar size={16} className="text-kerala-gold" />
              </div>
              <div>
                <p className="text-white/40 text-[10px] uppercase tracking-widest">Date</p>
                <p className="text-white font-semibold text-sm">27th June 2026</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-5 py-3 sm:border-r border-kerala-gold/20">
              <div className="w-9 h-9 rounded-xl bg-kerala-gold/15 flex items-center justify-center flex-shrink-0">
                <Clock size={16} className="text-kerala-gold" />
              </div>
              <div>
                <p className="text-white/40 text-[10px] uppercase tracking-widest">Time</p>
                <p className="text-white font-semibold text-sm">4:00 PM Onwards</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-5 py-3">
              <div className="w-9 h-9 rounded-xl bg-kerala-gold/15 flex items-center justify-center flex-shrink-0">
                <MapPin size={16} className="text-kerala-gold" />
              </div>
              <div>
                <p className="text-white/40 text-[10px] uppercase tracking-widest">Venue</p>
                <p className="text-white font-semibold text-sm">Ramee Hotel, Business Bay, Dubai</p>
              </div>
            </div>
          </div>

          {/* ── Countdown timer ──────────────────────────────── */}
          <div className="flex flex-col items-center mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Timer size={14} className="text-kerala-gold/60" />
              <span className="text-white/40 text-xs uppercase tracking-widest">Event starts in</span>
            </div>
            <div className="flex items-center gap-3 sm:gap-5">
              <CountdownUnit value={countdown.days}    label="Days"    />
              <span className="text-kerala-gold/50 text-2xl font-thin mb-5">:</span>
              <CountdownUnit value={countdown.hours}   label="Hours"   />
              <span className="text-kerala-gold/50 text-2xl font-thin mb-5">:</span>
              <CountdownUnit value={countdown.minutes} label="Min"     />
              <span className="text-kerala-gold/50 text-2xl font-thin mb-5">:</span>
              <CountdownUnit value={countdown.seconds} label="Sec"     />
            </div>
          </div>

          {/* ── Pass card ────────────────────────────────────── */}
          <div className="flex justify-center mb-0">
            <div className="relative w-full max-w-md">
              {/* Outer glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-kerala-gold via-kerala-gold-light to-kerala-gold rounded-2xl blur-md opacity-25" />

              <div className="relative bg-gradient-to-br from-[#1c1a0c] to-[#071d0e] border border-kerala-gold/35 rounded-2xl overflow-hidden">

                {/* Ticket header */}
                <div className="bg-gradient-to-r from-kerala-gold to-kerala-gold-light px-5 py-4 sm:px-6 sm:py-5 flex items-center justify-between">
                  <div>
                    <p className="text-kerala-deep text-[10px] font-black uppercase tracking-[0.15em] mb-0.5">
                      Entry Pass
                    </p>
                    <p className="text-kerala-deep font-serif text-2xl sm:text-3xl font-bold leading-none">
                      AED 250
                    </p>
                    <p className="text-kerala-deep/60 text-xs mt-1">per person</p>
                  </div>
                  <div className="text-right">
                    <div className="w-14 h-14 bg-kerala-deep/15 rounded-2xl flex items-center justify-center mb-1">
                      <Award size={26} className="text-kerala-deep" />
                    </div>
                  </div>
                </div>

                {/* Perforated edge */}
                <div className="relative flex items-center">
                  <div className="w-4 h-4 bg-kerala-deep rounded-full -ml-2 border border-kerala-gold/10" />
                  <div className="flex-1 border-t border-dashed border-kerala-gold/25 mx-2" />
                  <div className="w-4 h-4 bg-kerala-deep rounded-full -mr-2 border border-kerala-gold/10" />
                </div>

                {/* Benefits */}
                <div className="px-5 py-5 sm:px-6 sm:py-6 space-y-3.5">
                  {BENEFITS.map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-kerala-gold/20 flex items-center justify-center flex-shrink-0">
                        <Icon size={11} className="text-kerala-gold" />
                      </div>
                      <span className="text-white/80 text-sm">{text}</span>
                    </div>
                  ))}
                </div>

                {/* Venue reminder inside ticket */}
                <div className="mx-5 mb-5 sm:mx-6 sm:mb-6 bg-white/5 rounded-xl px-4 py-3 flex items-center gap-3">
                  <MapPin size={14} className="text-kerala-gold flex-shrink-0" />
                  <div>
                    <p className="text-kerala-gold text-xs font-semibold">{EVENT_VENUE_SHORT}</p>
                    <p className="text-white/40 text-[10px]">{EVENT_DATE_LABEL} · {EVENT_TIME_LABEL}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="relative mt-12">
          <svg viewBox="0 0 1440 70" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block">
            <path d="M0 70L60 56C120 42 240 14 360 7C480 0 600 14 720 28C840 42 960 56 1080 56C1200 56 1320 42 1380 35L1440 28V70H0Z" fill="#faf7f2"/>
          </svg>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          REGISTRATION FORM
      ══════════════════════════════════════════════════════ */}
      <section className="bg-kerala-cream py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">

          {/* Section heading */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-kerala-green/10 border border-kerala-green/20 rounded-full px-5 py-2 mb-4">
              <Shield size={14} className="text-kerala-green" />
              <span className="text-kerala-green text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                Secure Registration
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-kerala-deep mb-2">
              Reserve Your Seat
            </h2>
            <p className="text-gray-500 text-sm">
              Fill in your details below. Payment instructions will be sent via WhatsApp after registration.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">

            {/* Form header bar */}
            <div className="bg-kerala-deep px-6 sm:px-8 py-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-kerala-gold text-[10px] font-bold uppercase tracking-[0.15em] mb-1">
                    UAE Malayali Business Meet
                  </p>
                  <p className="text-white font-bold text-lg leading-tight">Registration Form</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                    <span className="flex items-center gap-1.5 text-white/50 text-xs">
                      <Calendar size={11} /> {EVENT_DATE_LABEL}
                    </span>
                    <span className="flex items-center gap-1.5 text-white/50 text-xs">
                      <Clock size={11} /> {EVENT_TIME_LABEL}
                    </span>
                    <span className="flex items-center gap-1.5 text-white/50 text-xs">
                      <MapPin size={11} /> {EVENT_VENUE_SHORT}
                    </span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-white/40 text-[10px] uppercase tracking-widest">Entry Pass</p>
                  <p className="text-kerala-gold font-serif text-2xl font-bold">AED 250</p>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-7">

              {/* ── Personal Info ─────────────────────────────── */}
              <div>
                <h3 className="flex items-center gap-2 text-kerala-deep font-bold text-xs uppercase tracking-wider mb-4">
                  <div className="w-6 h-6 bg-kerala-green/10 rounded-lg flex items-center justify-center">
                    <User size={13} className="text-kerala-green" />
                  </div>
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text" value={form.full_name} onChange={set('full_name')}
                      placeholder="Your full name"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-kerala-green focus:ring-2 focus:ring-kerala-green/10 transition-all placeholder-gray-300"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel" value={form.phone} onChange={set('phone')}
                      placeholder="+971 50 000 0000"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-kerala-green focus:ring-2 focus:ring-kerala-green/10 transition-all placeholder-gray-300"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                      WhatsApp Number
                      <span className="text-gray-400 font-normal ml-1">(if different)</span>
                    </label>
                    <input
                      type="tel" value={form.whatsapp} onChange={set('whatsapp')}
                      placeholder="Leave blank if same as phone"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-kerala-green focus:ring-2 focus:ring-kerala-green/10 transition-all placeholder-gray-300"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email" value={form.email} onChange={set('email')}
                      placeholder="your@email.com"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-kerala-green focus:ring-2 focus:ring-kerala-green/10 transition-all placeholder-gray-300"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* ── Business Details ──────────────────────────── */}
              <div className="border-t border-gray-100 pt-7">
                <h3 className="flex items-center gap-2 text-kerala-deep font-bold text-xs uppercase tracking-wider mb-4">
                  <div className="w-6 h-6 bg-kerala-green/10 rounded-lg flex items-center justify-center">
                    <Briefcase size={13} className="text-kerala-green" />
                  </div>
                  Business Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                      Company / Business Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text" value={form.company} onChange={set('company')}
                      placeholder="Your company or business name"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-kerala-green focus:ring-2 focus:ring-kerala-green/10 transition-all placeholder-gray-300"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                      Designation / Role
                    </label>
                    <input
                      type="text" value={form.designation} onChange={set('designation')}
                      placeholder="CEO, Manager, Consultant…"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-kerala-green focus:ring-2 focus:ring-kerala-green/10 transition-all placeholder-gray-300"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                      Industry / Sector
                    </label>
                    <select
                      value={form.industry} onChange={set('industry')}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-kerala-green focus:ring-2 focus:ring-kerala-green/10 transition-all text-gray-700 bg-white"
                    >
                      <option value="">Select your industry</option>
                      {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                      Emirate <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={form.emirate} onChange={set('emirate')}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-kerala-green focus:ring-2 focus:ring-kerala-green/10 transition-all text-gray-700 bg-white"
                      required
                    >
                      <option value="">Select emirate</option>
                      {EMIRATES.map(e => <option key={e} value={e}>{e}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                      How did you hear about us?
                    </label>
                    <select
                      value={form.how_heard} onChange={set('how_heard')}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-kerala-green focus:ring-2 focus:ring-kerala-green/10 transition-all text-gray-700 bg-white"
                    >
                      <option value="">Select source</option>
                      {HOW.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* ── Message ──────────────────────────────────── */}
              <div className="border-t border-gray-100 pt-7">
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                  Message / Expectations
                  <span className="text-gray-400 font-normal ml-1">(optional)</span>
                </label>
                <textarea
                  value={form.message} onChange={set('message')}
                  placeholder="What do you hope to achieve at the event? Any specific connections you're looking for?"
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-kerala-green focus:ring-2 focus:ring-kerala-green/10 transition-all placeholder-gray-300 resize-none"
                />
              </div>

              {/* ── Price box ────────────────────────────────── */}
              <div className="bg-amber-50 border border-kerala-gold/25 rounded-2xl p-4 flex items-center gap-4">
                <div className="w-11 h-11 bg-kerala-gold/15 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Award size={20} className="text-kerala-gold" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-kerala-deep font-bold text-sm">Entry Pass — AED 250 per person</p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    📍 {EVENT_VENUE_FULL} &nbsp;·&nbsp; 📅 {EVENT_DATE_LABEL}
                  </p>
                </div>
              </div>

              {/* Error */}
              {errorMsg && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm">
                  {errorMsg}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-kerala-green text-white py-4 rounded-xl font-bold text-base hover:bg-kerala-green-light disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-kerala-green/20"
              >
                {status === 'loading' ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting Registration…
                  </>
                ) : (
                  <>
                    Register Now — AED 250 <ChevronRight size={18} />
                  </>
                )}
              </button>

              <p className="text-center text-xs text-gray-400 leading-relaxed">
                By registering you agree to be contacted by the organizers via WhatsApp / email
                with payment and event details.
              </p>
            </div>
          </form>

          {/* Trust strip */}
          <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-4">
            {[
              { icon: Shield, title: 'Secure Form',     sub: 'Your data is safe' },
              { icon: Users,  title: '100+ Attendees',  sub: 'Expected at the event' },
              { icon: Award,  title: 'Gala Dinner',     sub: 'Included in your pass' },
            ].map(({ icon: Icon, title, sub }) => (
              <div key={title} className="bg-white rounded-2xl p-3 sm:p-4 text-center shadow-sm border border-gray-100">
                <Icon size={18} className="text-kerala-green mx-auto mb-1.5" />
                <p className="text-kerala-deep font-semibold text-xs">{title}</p>
                <p className="text-gray-400 text-[10px] mt-0.5">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
