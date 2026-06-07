'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { CheckCircle, Upload, ArrowRight, ArrowLeft, Loader2, BadgeCheck } from 'lucide-react'
import { MEDIA_TYPE_META } from '@/lib/media'
import type { MediaType } from '@/lib/media'

const STEPS = ['Basic Info', 'Type & Location', 'About & Reach', 'Links & Contact', 'Review']
const EMIRATES = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain', 'Pan-UAE']
const MEDIA_TYPES: MediaType[] = ['tv', 'radio', 'digital', 'newspaper', 'magazine', 'podcast']

export default function MediaRegisterPage() {
  const locale = useLocale()
  const isMl = locale === 'ml'
  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const [form, setForm] = useState({
    name: '', media_type: '' as MediaType | '', emirate: '', description: '',
    reach: '', founded_year: '', website: '', youtube_url: '',
    facebook_url: '', instagram_url: '', contact_email: '', contact_phone: '',
    logo: null as File | null,
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
          <h1 className="font-serif text-3xl font-bold text-kerala-deep mb-3">{isMl ? 'സ്വാഗതം!' : 'Submission Received!'}</h1>
          <p className="text-gray-500 mb-6">
            {isMl ? 'ടീം 24–48 മണിക്കൂറിനകം പരിശോധിക്കും.' : 'Our team will review your media outlet listing within 24–48 hours.'}
          </p>
          <div className="flex flex-col gap-3">
            <Link href={`/${locale}/media`} className="w-full bg-kerala-green text-white font-semibold py-3 rounded-xl hover:bg-kerala-deep transition-colors text-center">
              {isMl ? 'മീഡിയ ഡയറക്ടറി' : 'Browse Media Directory'}
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

      <div className="bg-kerala-deep pt-24 pb-10 px-4">
        <div className="max-w-3xl mx-auto">
          <Link href={`/${locale}/media`} className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-4">
            <ArrowLeft size={14} /> {isMl ? 'തിരിച്ചു' : 'Back'}
          </Link>
          <h1 className="font-serif text-3xl font-bold text-white mb-2">
            {isMl ? 'മീഡിയ ഔട്ട്‌ലെറ്റ് ലിസ്റ്റ് ചെയ്യൂ' : 'List Your Media Outlet'}
          </h1>
          <p className="text-white/70">
            {isMl ? 'TV, റേഡിയോ, ഡിജിറ്റൽ — UAE മലയാളി കമ്മ്യൂണിറ്റിക്ക് കാണിക്കൂ' : 'TV, Radio, Digital, Print — get discovered by 500K+ Malayalis across UAE'}
          </p>

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

            {step === 0 && (
              <div className="space-y-5">
                <h2 className="font-serif text-2xl font-bold text-kerala-deep">{isMl ? 'അടിസ്ഥാന വിവരങ്ങൾ' : 'Basic Information'}</h2>
                <div className="flex flex-col items-center py-6 border-2 border-dashed border-gray-200 rounded-2xl hover:border-kerala-green transition-colors cursor-pointer" onClick={() => document.getElementById('logo-upload')?.click()}>
                  <Upload size={28} className="text-gray-400 mb-2" />
                  <p className="text-sm font-medium text-gray-600">{isMl ? 'ലോഗോ അപ്‌ലോഡ്' : 'Upload Logo / Icon'}</p>
                  <p className="text-xs text-gray-400">{form.logo ? form.logo.name : 'PNG, SVG — recommended 400×400px'}</p>
                  <input id="logo-upload" type="file" accept="image/*" className="hidden" onChange={e => setForm(f => ({ ...f, logo: e.target.files?.[0] ?? null }))} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1">{isMl ? 'ചാനൽ / സ്റ്റേഷൻ പേര് *' : 'Channel / Station Name *'}</label>
                  <input required value={form.name} onChange={e => set('name', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-kerala-green" placeholder="e.g. Asianet UAE, Radio Asia, Gulf Madhyamam" />
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <h2 className="font-serif text-2xl font-bold text-kerala-deep">{isMl ? 'തരവും സ്ഥലവും' : 'Media Type & Location'}</h2>
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-2">{isMl ? 'മീഡിയ തരം *' : 'Media Type *'}</label>
                  <div className="grid grid-cols-2 gap-3">
                    {MEDIA_TYPES.map(type => {
                      const m = MEDIA_TYPE_META[type]
                      return (
                        <button key={type} type="button" onClick={() => set('media_type', type)}
                          className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${form.media_type === type ? 'border-kerala-green bg-kerala-green/10 text-kerala-green' : 'border-gray-200 text-gray-600 hover:border-kerala-green'}`}>
                          <span className="text-lg">{m.emoji}</span>
                          <span>{isMl ? m.labelMl : m.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-2">{isMl ? 'ആസ്ഥാനം *' : 'Base Location *'}</label>
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

            {step === 2 && (
              <div className="space-y-5">
                <h2 className="font-serif text-2xl font-bold text-kerala-deep">{isMl ? 'കുറിച്ച് & റീച്ച്' : 'About & Reach'}</h2>
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1">{isMl ? 'വിവരണം *' : 'Description *'}</label>
                  <textarea required rows={4} value={form.description} onChange={e => set('description', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-kerala-green resize-none"
                    placeholder={isMl ? 'നിങ്ങളുടെ മീഡിയ ഔട്ട്‌ലെറ്റ് കുറിച്ച്...' : 'Describe your media outlet, audience, content type, programming...'} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1">{isMl ? 'ഓഡിയൻസ് / റീച്ച്' : 'Audience Reach'}</label>
                    <input value={form.reach} onChange={e => set('reach', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-kerala-green" placeholder="e.g. 500K+" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1">{isMl ? 'സ്ഥാപിത വർഷം' : 'Founded Year'}</label>
                    <input value={form.founded_year} onChange={e => set('founded_year', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-kerala-green" placeholder="e.g. 2010" />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h2 className="font-serif text-2xl font-bold text-kerala-deep">{isMl ? 'ലിങ്കുകൾ & ബന്ധപ്പെടൽ' : 'Links & Contact'}</h2>
                {[
                  { key: 'website',       label: 'Website',          placeholder: 'https://yourwebsite.com' },
                  { key: 'youtube_url',   label: 'YouTube Channel',  placeholder: 'https://youtube.com/c/yourchannel' },
                  { key: 'facebook_url',  label: 'Facebook Page',    placeholder: 'https://facebook.com/yourpage' },
                  { key: 'instagram_url', label: 'Instagram',        placeholder: '@yourhandle' },
                  { key: 'contact_email', label: 'Contact Email *',  placeholder: 'contact@yourmedia.com' },
                  { key: 'contact_phone', label: 'Contact Phone',    placeholder: '+971 XX XXX XXXX' },
                ].map(field => (
                  <div key={field.key}>
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1">{field.label}</label>
                    <input value={(form as unknown as Record<string,string>)[field.key] ?? ''} onChange={e => set(field.key as keyof typeof form, e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-kerala-green" placeholder={field.placeholder} />
                  </div>
                ))}
              </div>
            )}

            {step === 4 && (
              <div className="space-y-5">
                <h2 className="font-serif text-2xl font-bold text-kerala-deep">{isMl ? 'സ്ഥിരീകരണം' : 'Review & Submit'}</h2>
                <div className="bg-kerala-cream rounded-2xl p-5 space-y-3 text-sm">
                  {[
                    { label: isMl ? 'പേര്' : 'Name',              value: form.name },
                    { label: isMl ? 'തരം' : 'Type',                value: form.media_type ? MEDIA_TYPE_META[form.media_type as MediaType]?.label : '' },
                    { label: isMl ? 'സ്ഥലം' : 'Location',          value: form.emirate },
                    { label: isMl ? 'ഇമെയിൽ' : 'Contact Email',   value: form.contact_email },
                    { label: isMl ? 'വെബ്' : 'Website',             value: form.website },
                  ].map(row => row.value ? (
                    <div key={row.label} className="flex justify-between">
                      <span className="text-gray-500">{row.label}</span>
                      <span className="font-medium text-kerala-deep truncate max-w-[200px]">{row.value}</span>
                    </div>
                  ) : null)}
                </div>
                <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl p-4">
                  <BadgeCheck size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-700">
                    {isMl ? 'ടീം 24–48 മണിക്കൂറിനകം പ്രൊഫൈൽ പരിശോധിക്കും.' : 'Our team reviews all listings within 24–48 hours. You\'ll get a confirmation email once live.'}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
              {step > 0 ? (
                <button type="button" onClick={() => setStep(s => s - 1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 font-medium text-sm">
                  <ArrowLeft size={15} /> {isMl ? 'തിരിച്ചു' : 'Back'}
                </button>
              ) : <div />}

              {step < STEPS.length - 1 ? (
                <button type="button" onClick={() => setStep(s => s + 1)}
                  disabled={(step === 0 && !form.name) || (step === 1 && (!form.media_type || !form.emirate))}
                  className="flex items-center gap-2 bg-kerala-green text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-kerala-deep disabled:opacity-50 transition-colors text-sm">
                  {isMl ? 'തുടരൂ' : 'Continue'} <ArrowRight size={15} />
                </button>
              ) : (
                <button type="submit" disabled={submitting} className="flex items-center gap-2 bg-kerala-gold text-white font-bold px-8 py-3 rounded-xl hover:bg-kerala-gold-light transition-colors">
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
                  {submitting ? (isMl ? 'സമർപ്പിക്കുന്നു...' : 'Submitting...') : (isMl ? 'സമർപ്പിക്കൂ' : 'Submit Listing')}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </main>
  )
}
