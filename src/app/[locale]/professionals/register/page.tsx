'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { CheckCircle, Upload, ArrowRight, ArrowLeft, Loader2, BadgeCheck, Star } from 'lucide-react'
import { PROFESSIONAL_CATEGORIES } from '@/lib/professionals'

const STEPS = ['Basic Info', 'Category & Location', 'Bio & Skills', 'Contact & Social', 'Review']

const EMIRATES = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain']

export default function ProfessionalRegisterPage() {
  const locale = useLocale()
  const isMl = locale === 'ml'
  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const [form, setForm] = useState({
    name: '', profession: '', category: '', emirate: '',
    bio: '', skills: '', phone: '', whatsapp: '', email: '',
    website: '', instagram: '', linkedin: '',
    photo: null as File | null,
  })

  const set = (key: keyof typeof form, val: string) => setForm(f => ({ ...f, [key]: val }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setTimeout(() => { setSubmitting(false); setSubmitted(true) }, 1500)
  }

  if (submitted) return (
    <main className="min-h-screen bg-kerala-cream">
      <Navbar />
      <div className="max-w-xl mx-auto px-4 py-32 text-center">
        <div className="bg-white rounded-3xl shadow-xl p-10">
          <CheckCircle size={64} className="text-kerala-green mx-auto mb-4" />
          <h1 className="font-serif text-3xl font-bold text-kerala-deep mb-3">
            {isMl ? 'സ്വാഗതം!' : 'Profile Submitted!'}
          </h1>
          <p className="text-gray-500 mb-6">
            {isMl
              ? 'നിങ്ങളുടെ പ്രൊഫൈൽ ടീം പരിശോധിക്കും. 24–48 മണിക്കൂറിനകം ലൈവ് ആകും.'
              : 'Our team will review your profile within 24–48 hours. You\'ll receive a confirmation email once it goes live.'}
          </p>
          <div className="flex flex-col gap-3">
            <Link href={`/${locale}/professionals`} className="w-full bg-kerala-green text-white font-semibold py-3 rounded-xl hover:bg-kerala-deep transition-colors text-center">
              {isMl ? 'ഡയറക്ടറി കാണൂ' : 'Browse Directory'}
            </Link>
            <Link href={`/${locale}/dashboard`} className="w-full border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors text-center text-sm">
              {isMl ? 'ഡാഷ്ബോർഡ്' : 'Go to Dashboard'}
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )

  return (
    <main className="min-h-screen bg-kerala-cream">
      <Navbar />

      {/* Header */}
      <div className="bg-kerala-deep pt-24 pb-10 px-4">
        <div className="max-w-3xl mx-auto">
          <Link href={`/${locale}/professionals`} className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-4">
            <ArrowLeft size={14} /> {isMl ? 'തിരിച്ചു' : 'Back'}
          </Link>
          <h1 className="font-serif text-3xl font-bold text-white mb-2">
            {isMl ? 'പ്രൊഫൈൽ ചേർക്കൂ' : 'Register as a Professional'}
          </h1>
          <p className="text-white/70">
            {isMl ? 'UAE-ലെ മലയാളി കമ്മ്യൂണിറ്റിയിൽ നിങ്ങളെ കാണിക്കൂ — സൗജന്യം' : 'Get discovered by thousands of Malayalis across UAE — it\'s completely free'}
          </p>

          {/* Progress */}
          <div className="flex items-center gap-2 mt-6">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${i < step ? 'bg-kerala-gold text-white' : i === step ? 'bg-white text-kerala-deep' : 'bg-white/20 text-white/50'}`}>
                  {i < step ? '✓' : i + 1}
                </div>
                {i < STEPS.length - 1 && <div className={`h-0.5 w-6 ${i < step ? 'bg-kerala-gold' : 'bg-white/20'}`} />}
              </div>
            ))}
            <span className="text-white/60 text-xs ml-2">{STEPS[step]}</span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-3xl shadow-sm p-8">

            {/* Step 0: Basic Info */}
            {step === 0 && (
              <div className="space-y-5">
                <h2 className="font-serif text-2xl font-bold text-kerala-deep">{isMl ? 'അടിസ്ഥാന വിവരങ്ങൾ' : 'Basic Information'}</h2>

                {/* Photo upload */}
                <div className="flex flex-col items-center py-6 border-2 border-dashed border-gray-200 rounded-2xl hover:border-kerala-green transition-colors cursor-pointer" onClick={() => document.getElementById('photo-upload')?.click()}>
                  <Upload size={28} className="text-gray-400 mb-2" />
                  <p className="text-sm font-medium text-gray-600">{isMl ? 'ഫോട്ടോ അപ്‌ലോഡ്' : 'Upload Profile Photo'}</p>
                  <p className="text-xs text-gray-400">{form.photo ? form.photo.name : (isMl ? 'JPG, PNG — 5MB വരെ' : 'JPG, PNG up to 5MB')}</p>
                  <input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={e => setForm(f => ({ ...f, photo: e.target.files?.[0] ?? null }))} />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1">{isMl ? 'പൂർണ്ണ നാമം *' : 'Full Name *'}</label>
                  <input required value={form.name} onChange={e => set('name', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-kerala-green" placeholder="Dr. / Adv. / CA / Your name" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1">{isMl ? 'തൊഴിൽ/പദവി *' : 'Profession / Title *'}</label>
                  <input required value={form.profession} onChange={e => set('profession', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-kerala-green" placeholder="e.g. Cardiologist, Criminal Advocate, Fitness Coach" />
                </div>
              </div>
            )}

            {/* Step 1: Category & Location */}
            {step === 1 && (
              <div className="space-y-5">
                <h2 className="font-serif text-2xl font-bold text-kerala-deep">{isMl ? 'വിഭാഗവും സ്ഥലവും' : 'Category & Location'}</h2>
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-2">{isMl ? 'വിഭാഗം *' : 'Category *'}</label>
                  <div className="grid grid-cols-2 gap-2">
                    {PROFESSIONAL_CATEGORIES.map(cat => (
                      <button key={cat.slug} type="button" onClick={() => set('category', cat.slug)}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all text-left ${form.category === cat.slug ? 'border-kerala-green bg-kerala-green/10 text-kerala-green' : 'border-gray-200 text-gray-600 hover:border-kerala-green'}`}>
                        <span>{cat.emoji}</span> {isMl ? cat.nameMl : cat.name.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-2">{isMl ? 'എമിറേറ്റ് *' : 'Emirates *'}</label>
                  <div className="grid grid-cols-2 gap-2">
                    {EMIRATES.map(e => (
                      <button key={e} type="button" onClick={() => set('emirate', e)}
                        className={`px-3 py-2 rounded-xl border text-sm font-medium transition-all ${form.emirate === e ? 'border-kerala-green bg-kerala-green/10 text-kerala-green' : 'border-gray-200 text-gray-600 hover:border-kerala-green'}`}>
                        {e}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Bio & Skills */}
            {step === 2 && (
              <div className="space-y-5">
                <h2 className="font-serif text-2xl font-bold text-kerala-deep">{isMl ? 'ബയോ & കഴിവുകൾ' : 'Bio & Skills'}</h2>
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1">{isMl ? 'നിങ്ങളെ കുറിച്ച് *' : 'About You *'}</label>
                  <textarea required rows={5} value={form.bio} onChange={e => set('bio', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-kerala-green resize-none"
                    placeholder={isMl ? 'നിങ്ങളുടെ അനുഭവം, വൈദഗ്ധ്യം, നേട്ടങ്ങൾ...' : 'Describe your experience, qualifications, achievements, and what makes you stand out...'} />
                  <p className="text-xs text-gray-400 mt-1">{form.bio.length}/500 {isMl ? 'അക്ഷരങ്ങൾ' : 'characters'}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1">{isMl ? 'സ്പെഷ്യൽറ്റി / ടാഗ്സ്' : 'Specializations / Tags'}</label>
                  <input value={form.skills} onChange={e => set('skills', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-kerala-green"
                    placeholder={isMl ? 'കോമ്മ കൊണ്ട് വേർതിരിക്കൂ: Cardiology, Interventional...' : 'Comma separated: Cardiology, Interventional, Heart Surgery'} />
                </div>
              </div>
            )}

            {/* Step 3: Contact & Social */}
            {step === 3 && (
              <div className="space-y-5">
                <h2 className="font-serif text-2xl font-bold text-kerala-deep">{isMl ? 'ബന്ധപ്പെടൽ' : 'Contact & Social'}</h2>
                {[
                  { key: 'phone',     label: 'Phone Number',   labelMl: 'ഫോൺ നമ്പർ',    placeholder: '+971 50 XXX XXXX' },
                  { key: 'whatsapp',  label: 'WhatsApp',       labelMl: 'WhatsApp',       placeholder: '+971 50 XXX XXXX' },
                  { key: 'email',     label: 'Email Address',  labelMl: 'ഇമെയിൽ',        placeholder: 'your@email.com' },
                  { key: 'website',   label: 'Website',        labelMl: 'വെബ്‌സൈറ്റ്',    placeholder: 'https://yourwebsite.com' },
                  { key: 'instagram', label: 'Instagram',      labelMl: 'ഇൻസ്റ്റഗ്രാം',   placeholder: '@yourhandle' },
                  { key: 'linkedin',  label: 'LinkedIn',       labelMl: 'LinkedIn',       placeholder: 'linkedin.com/in/yourprofile' },
                ].map(field => (
                  <div key={field.key}>
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1">{isMl ? field.labelMl : field.label}</label>
                    <input value={(form as unknown as Record<string,string>)[field.key] ?? ''} onChange={e => set(field.key as keyof typeof form, e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-kerala-green" placeholder={field.placeholder} />
                  </div>
                ))}
              </div>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
              <div className="space-y-5">
                <h2 className="font-serif text-2xl font-bold text-kerala-deep">{isMl ? 'സ്ഥിരീകരണം' : 'Review & Submit'}</h2>
                <div className="bg-kerala-cream rounded-2xl p-5 space-y-3 text-sm">
                  {[
                    { label: isMl ? 'പേര്' : 'Name',          value: form.name },
                    { label: isMl ? 'തൊഴിൽ' : 'Profession',   value: form.profession },
                    { label: isMl ? 'വിഭാഗം' : 'Category',    value: PROFESSIONAL_CATEGORIES.find(c => c.slug === form.category)?.name ?? '' },
                    { label: isMl ? 'എമിറേറ്റ്' : 'Emirate',  value: form.emirate },
                    { label: isMl ? 'ഫോൺ' : 'Phone',          value: form.phone },
                    { label: isMl ? 'ഇമെയിൽ' : 'Email',       value: form.email },
                  ].map(row => row.value ? (
                    <div key={row.label} className="flex justify-between">
                      <span className="text-gray-500">{row.label}</span>
                      <span className="font-medium text-kerala-deep">{row.value}</span>
                    </div>
                  ) : null)}
                </div>
                <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl p-4">
                  <BadgeCheck size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-700">
                    {isMl
                      ? 'ടീം 24–48 മണിക്കൂറിനകം പ്രൊഫൈൽ പരിശോധിക്കും. ആവശ്യമെങ്കിൽ ബന്ധപ്പെടും.'
                      : 'Our team reviews all profiles within 24–48 hours. We may reach out for verification documents.'}
                  </p>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
              {step > 0 ? (
                <button type="button" onClick={() => setStep(s => s - 1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 font-medium text-sm">
                  <ArrowLeft size={15} /> {isMl ? 'തിരിച്ചു' : 'Back'}
                </button>
              ) : <div />}

              {step < STEPS.length - 1 ? (
                <button type="button" onClick={() => setStep(s => s + 1)}
                  disabled={
                    (step === 0 && (!form.name || !form.profession)) ||
                    (step === 1 && (!form.category || !form.emirate))
                  }
                  className="flex items-center gap-2 bg-kerala-green text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-kerala-deep disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm">
                  {isMl ? 'തുടരൂ' : 'Continue'} <ArrowRight size={15} />
                </button>
              ) : (
                <button type="submit" disabled={submitting} className="flex items-center gap-2 bg-kerala-gold text-white font-bold px-8 py-3 rounded-xl hover:bg-kerala-gold-light transition-colors">
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : <Star size={16} />}
                  {submitting ? (isMl ? 'സമർപ്പിക്കുന്നു...' : 'Submitting...') : (isMl ? 'പ്രൊഫൈൽ സമർപ്പിക്കൂ' : 'Submit Profile')}
                </button>
              )}
            </div>
          </div>
        </form>

        {/* Benefits */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          {[
            { emoji: '🆓', title: isMl ? 'സൗജന്യം' : '100% Free', desc: isMl ? 'ലിസ്റ്റ് ചെയ്യൂ' : 'Always free to list' },
            { emoji: '🔒', title: isMl ? 'സേഫ്' : 'Verified', desc: isMl ? 'ടീം പരിശോധിക്കും' : 'Team-reviewed profiles' },
            { emoji: '🌟', title: isMl ? 'കമ്മ്യൂണിറ്റി' : 'Community', desc: isMl ? '500K+ കാഴ്ചക്കാർ' : '500K+ monthly visitors' },
          ].map(b => (
            <div key={b.title} className="bg-white rounded-2xl p-4 text-center shadow-sm">
              <div className="text-2xl mb-1">{b.emoji}</div>
              <div className="font-semibold text-kerala-deep text-xs">{b.title}</div>
              <div className="text-gray-400 text-xs">{b.desc}</div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  )
}
