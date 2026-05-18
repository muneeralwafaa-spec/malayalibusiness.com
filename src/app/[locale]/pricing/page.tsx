'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import {
  CheckCircle,
  X,
  ChevronDown,
  Star,
  Zap,
  TrendingUp,
  Building2,
  Briefcase,
  BarChart2,
  Globe,
  Award,
  ShoppingBag,
  BadgeCheck,
  Clock,
  Megaphone,
} from 'lucide-react'

// ─── DATA ────────────────────────────────────────────────────────────────────

interface PlanFeature {
  label: string
  labelMl: string
  basic: string | boolean
  standard: string | boolean
  premium: string | boolean
}

const PLAN_FEATURES: PlanFeature[] = [
  { label: 'Listings', labelMl: 'ലിസ്റ്റിംഗ്', basic: '1 listing', standard: '5 listings', premium: 'Unlimited' },
  { label: 'Photos allowed', labelMl: 'ഫോട്ടോ', basic: '3 photos', standard: '15 photos', premium: '50 photos' },
  { label: 'Featured placement', labelMl: 'ഫീച്ചേർഡ്', basic: false, standard: true, premium: true },
  { label: 'WhatsApp button', labelMl: 'WhatsApp ബട്ടൺ', basic: false, standard: true, premium: true },
  { label: 'Analytics dashboard', labelMl: 'അനലിറ്റിക്സ്', basic: false, standard: true, premium: true },
  { label: 'Priority support', labelMl: 'പ്രിയോറിറ്റി സപ്പോർട്ട്', basic: false, standard: false, premium: true },
  { label: 'Shop module', labelMl: 'ഷോപ്പ് മൊഡ്യൂൾ', basic: false, standard: false, premium: true },
  { label: 'Job posts', labelMl: 'ജോബ് പോസ്റ്റ്', basic: false, standard: '2/month', premium: 'Unlimited' },
  { label: 'Ad credits', labelMl: 'പരസ്യ ക്രെഡിറ്റ്', basic: false, standard: 'AED 100', premium: 'AED 500' },
  { label: 'Custom domain', labelMl: 'കസ്റ്റം ഡൊമൈൻ', basic: false, standard: false, premium: true },
  { label: 'Verified badge', labelMl: 'വെരിഫൈഡ് ബാഡ്ജ്', basic: false, standard: true, premium: true },
  { label: 'Response guarantee', labelMl: 'റെസ്‌പോൻസ് ഗ്യാരൻറ്റി', basic: false, standard: false, premium: '24h' },
]

const FAQ_ITEMS = [
  {
    q: 'Can I upgrade later?',
    qMl: 'പിന്നീട് അപ്‌ഗ്രേഡ് ചെയ്യാമോ?',
    a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect from the next billing cycle.',
    aMl: 'അതെ, ഏത് സമയത്തും അപ്‌ഗ്രേഡ് അല്ലെങ്കിൽ ഡൗൺഗ്രേഡ് ചെയ്യാം. മാറ്റങ്ങൾ അടുത്ത ബില്ലിംഗ് ചക്രത്തിൽ നിന്ന് ബാധകമാകും.',
  },
  {
    q: 'Do you offer refunds?',
    qMl: 'റീഫണ്ട് ഉണ്ടോ?',
    a: 'We offer a 7-day money-back guarantee on all paid plans. No questions asked.',
    aMl: 'എല്ലാ പെയ്ഡ് പ്ലാനുകളിലും 7 ദിവസത്തെ മണി-ബാക്ക് ഗ്യാരൻറ്റി ഉണ്ട്.',
  },
  {
    q: 'What payment methods do you accept?',
    qMl: 'ഏതൊക്കെ പേയ്‌മെന്റ് രീതികൾ സ്വീകരിക്കുന്നു?',
    a: 'We accept Visa, Mastercard, Apple Pay, and bank transfers. All transactions are secured with SSL.',
    aMl: 'Visa, Mastercard, Apple Pay, ബാങ്ക് ട്രാൻസ്ഫർ സ്വീകരിക്കുന്നു. എല്ലാ ഇടപാടുകളും SSL-ൽ സുരക്ഷിതം.',
  },
  {
    q: 'How long does verification take?',
    qMl: 'വെരിഫിക്കേഷൻ എടുക്കുന്ന സമയം?',
    a: 'Business verification typically takes 1–3 business days. We verify trade license, Emirates ID, and physical address.',
    aMl: 'ബിസിനസ് വെരിഫിക്കേഷൻ 1–3 ബിസിനസ് ദിവസം എടുക്കും. ട്രേഡ് ലൈസൻസ്, Emirates ID, വിലാസം പരിശോധിക്കും.',
  },
  {
    q: 'Can I list multiple businesses?',
    qMl: 'ഒന്നിലധികം ബിസിനസ് ലിസ്റ്റ് ചെയ്യാമോ?',
    a: 'Yes! Each business requires its own listing. Standard plan allows 5 listings and Premium allows unlimited.',
    aMl: 'അതെ! ഓരോ ബിസിനസിനും സ്വന്തം ലിസ്റ്റിംഗ് വേണം. Standard 5 ലിസ്റ്റിംഗ്, Premium അൺലിമിറ്റഡ്.',
  },
  {
    q: 'Is there a free trial?',
    qMl: 'സൗജന്യ ട്രയൽ ഉണ്ടോ?',
    a: 'The Basic plan is permanently free. Paid plans offer a 7-day free trial — no credit card required to start.',
    aMl: 'Basic പ്ലാൻ സ്ഥിരമായി സൗജന്യം. പെയ്ഡ് പ്ലാനുകൾക്ക് 7 ദിവസം ഫ്രീ ട്രയൽ — ക്രെഡിറ്റ് കാർഡ് ആവശ്യമില്ല.',
  },
  {
    q: 'What is the cancellation policy?',
    qMl: 'ക്യാൻസലേഷൻ നയം?',
    a: 'Cancel anytime before your next renewal date. Your listing remains active until the end of the paid period.',
    aMl: 'അടുത്ത പുതുക്കൽ തീയതിക്ക് മുമ്പ് ഏത് സമയത്തും റദ്ദ് ചെയ്യാം. പണമടച്ച കാലയളവ് അവസാനിക്കും വരെ ലിസ്റ്റിംഗ് സജീവമായിരിക്കും.',
  },
  {
    q: 'How does featured placement work?',
    qMl: 'ഫീച്ചേർഡ് പ്ലേസ്മെന്റ് എങ്ങനെ പ്രവർത്തിക്കുന്നു?',
    a: 'Featured listings appear at the top of search results and category pages. Standard gets 3 featured slots/month, Premium gets unlimited.',
    aMl: 'ഫീച്ചേർഡ് ലിസ്റ്റിംഗ് സേർച്ച് ഫലങ്ങളിൽ മുകളിൽ കാണിക്കും. Standard-ൽ 3 ഫീച്ചേർഡ് സ്ലോട്ടുകൾ/മാസം, Premium-ൽ അൺലിമിറ്റഡ്.',
  },
]

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function FeatureValue({ value }: { value: string | boolean; isMl?: boolean }) {
  if (value === true) return <CheckCircle size={18} className="text-kerala-green mx-auto" />
  if (value === false) return <X size={16} className="text-gray-300 mx-auto" />
  return (
    <span className="text-xs font-semibold text-kerala-deep">
      {typeof value === 'string' && value.startsWith('AED') ? value : value}
    </span>
  )
}

function FaqItem({
  item,
  open,
  onToggle,
  isMl,
}: {
  item: typeof FAQ_ITEMS[0]
  open: boolean
  onToggle: () => void
  isMl: boolean
}) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-kerala-deep text-sm pr-4">
          {isMl ? item.qMl : item.q}
        </span>
        <ChevronDown
          size={18}
          className={`flex-shrink-0 text-gray-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: open ? '200px' : '0px' }}
      >
        <p className="px-6 pb-5 text-sm text-gray-600 leading-relaxed">
          {isMl ? item.aMl : item.a}
        </p>
      </div>
    </div>
  )
}

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────
export default function PricingPage() {
  const locale = useLocale()
  const isMl = locale === 'ml'

  const [yearly, setYearly] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const multiplier = yearly ? 0.8 : 1
  const stdPrice = Math.round(299 * multiplier)
  const premPrice = Math.round(599 * multiplier)

  return (
    <main className="min-h-screen bg-kerala-cream">
      <Navbar />

      {/* ── SECTION 1: HERO ─────────────────────────────────────────────────── */}
      <section className="bg-kerala-deep pt-28 pb-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block bg-kerala-gold/20 text-kerala-gold-light text-xs font-bold px-4 py-1.5 rounded-full tracking-wider uppercase mb-5">
            {isMl ? 'പ്ലാനുകളും വിലനിർണ്ണയവും' : 'Plans & Pricing'}
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-3 leading-tight">
            {isMl
              ? 'ശരിയായ പ്ലാൻ ഉപയോഗിച്ച് നിങ്ങളുടെ ബിസിനസ് വളർത്തൂ'
              : 'Grow Your Business with the Right Plan'}
          </h1>
          <p className="text-white/60 text-base mb-8">
            {isMl
              ? 'UAE-ലെ 50,000+ മലയാളി ഉപഭോക്താക്കളിലേക്ക് എത്തൂ. ഏത് ബജറ്റിനും അനുകൂലമായ പ്ലാൻ.'
              : 'Reach 50,000+ Malayali customers across UAE. A plan for every budget.'}
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-3 bg-white/10 rounded-xl p-1.5 mb-8">
            <button
              onClick={() => setYearly(false)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                !yearly ? 'bg-white text-kerala-deep shadow' : 'text-white/70 hover:text-white'
              }`}
            >
              {isMl ? 'മാസം' : 'Monthly'}
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                yearly ? 'bg-white text-kerala-deep shadow' : 'text-white/70 hover:text-white'
              }`}
            >
              {isMl ? 'വർഷം' : 'Yearly'}
              <span className="bg-kerala-gold text-white text-xs px-2 py-0.5 rounded-full font-bold">
                {isMl ? '20% ഓഫ്' : '20% Off'}
              </span>
            </button>
          </div>

          {/* Trust logos */}
          <div className="flex items-center justify-center gap-6 mt-2">
            <span className="text-white/40 text-xs">{isMl ? 'വിശ്വസിക്കുന്നവർ:' : 'Trusted by:'}</span>
            {['Al Baraka Trading', 'Dubai Spice House', 'Malabar Gold Centre'].map(name => (
              <span key={name} className="text-white/60 text-xs font-semibold">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 2: LISTING PLANS ────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {/* Basic */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-7">
                <div className="flex items-center gap-2 mb-1">
                  <Building2 size={18} className="text-gray-400" />
                  <h3 className="font-bold text-kerala-deep">{isMl ? 'ബേസിക്' : 'Basic'}</h3>
                </div>
                <div className="flex items-baseline gap-1 my-4">
                  <span className="font-serif text-4xl font-bold text-kerala-deep">{isMl ? 'സൗജന്യം' : 'Free'}</span>
                </div>
                <p className="text-xs text-gray-500 mb-5">
                  {isMl ? 'ആരംഭിക്കുന്നവർക്ക് അനുയോജ്യം' : 'Perfect to get started'}
                </p>
                <Link
                  href={`/${locale}/auth`}
                  className="block text-center border-2 border-kerala-green text-kerala-green font-semibold py-3 rounded-xl hover:bg-kerala-green hover:text-white transition-all text-sm"
                >
                  {isMl ? 'സൗജന്യമായി ആരംഭിക്കൂ' : 'Get Started Free'}
                </Link>
              </div>
              <div className="border-t border-gray-100 px-7 py-5 space-y-3">
                {PLAN_FEATURES.map(f => (
                  <div key={f.label} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{isMl ? f.labelMl : f.label}</span>
                    <FeatureValue value={f.basic} isMl={isMl} />
                  </div>
                ))}
              </div>
            </div>

            {/* Standard — Most Popular */}
            <div className="bg-kerala-deep rounded-2xl shadow-xl overflow-hidden ring-2 ring-kerala-gold md:-mt-4">
              <div className="bg-kerala-gold text-white text-xs font-bold text-center py-2 tracking-wider uppercase flex items-center justify-center gap-1">
                <Star size={12} fill="currentColor" />
                {isMl ? 'ഏറ്റവും ജനപ്രിയം' : 'Most Popular'}
              </div>
              <div className="p-7">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp size={18} className="text-kerala-gold-light" />
                  <h3 className="font-bold text-white">{isMl ? 'സ്റ്റാൻഡേർഡ്' : 'Standard'}</h3>
                </div>
                <div className="flex items-baseline gap-1 my-4">
                  <span className="font-serif text-4xl font-bold text-white">AED {stdPrice}</span>
                  <span className="text-white/50 text-sm">/{isMl ? 'മാസം' : 'mo'}</span>
                </div>
                {yearly && (
                  <p className="text-kerala-gold-light text-xs font-semibold mb-1">
                    {isMl ? `AED ${Math.round(stdPrice * 12)}/വർഷം — AED ${Math.round(299 * 12 - stdPrice * 12)} ലാഭം` : `AED ${Math.round(stdPrice * 12)}/yr — Save AED ${Math.round(299 * 12 - stdPrice * 12)}`}
                  </p>
                )}
                <p className="text-xs text-white/50 mb-5">
                  {isMl ? 'വളരുന്ന ബിസിനസുകൾക്ക്' : 'For growing businesses'}
                </p>
                <Link
                  href={`/${locale}/auth`}
                  className="block text-center bg-kerala-gold hover:bg-kerala-gold-light text-white font-bold py-3 rounded-xl transition-all text-sm"
                >
                  {isMl ? 'ഇപ്പോൾ ആരംഭിക്കൂ' : 'Start Now'}
                </Link>
              </div>
              <div className="border-t border-white/10 px-7 py-5 space-y-3">
                {PLAN_FEATURES.map(f => (
                  <div key={f.label} className="flex items-center justify-between text-sm">
                    <span className="text-white/70">{isMl ? f.labelMl : f.label}</span>
                    <div className="text-white">
                      {f.standard === true ? (
                        <CheckCircle size={18} className="text-kerala-gold-light" />
                      ) : f.standard === false ? (
                        <X size={16} className="text-white/20" />
                      ) : (
                        <span className="text-xs font-semibold text-kerala-gold-light">{f.standard}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Premium */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-7">
                <div className="flex items-center gap-2 mb-1">
                  <Award size={18} className="text-kerala-gold" />
                  <h3 className="font-bold text-kerala-deep">{isMl ? 'പ്രീമിയം' : 'Premium'}</h3>
                </div>
                <div className="flex items-baseline gap-1 my-4">
                  <span className="font-serif text-4xl font-bold text-kerala-deep">AED {premPrice}</span>
                  <span className="text-gray-400 text-sm">/{isMl ? 'മാസം' : 'mo'}</span>
                </div>
                {yearly && (
                  <p className="text-kerala-green text-xs font-semibold mb-1">
                    {isMl ? `AED ${Math.round(premPrice * 12)}/വർഷം — AED ${Math.round(599 * 12 - premPrice * 12)} ലാഭം` : `AED ${Math.round(premPrice * 12)}/yr — Save AED ${Math.round(599 * 12 - premPrice * 12)}`}
                  </p>
                )}
                <p className="text-xs text-gray-500 mb-5">
                  {isMl ? 'എസ്റ്റാബ്ലിഷ്ഡ് ബിസിനസുകൾക്ക്' : 'For established businesses'}
                </p>
                <Link
                  href={`/${locale}/auth`}
                  className="block text-center bg-kerala-green hover:bg-kerala-green-light text-white font-bold py-3 rounded-xl transition-all text-sm"
                >
                  {isMl ? 'പ്രീമിയം ആരംഭിക്കൂ' : 'Start Premium'}
                </Link>
              </div>
              <div className="border-t border-gray-100 px-7 py-5 space-y-3">
                {PLAN_FEATURES.map(f => (
                  <div key={f.label} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{isMl ? f.labelMl : f.label}</span>
                    <FeatureValue value={f.premium} isMl={isMl} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: AD PACKAGES ──────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl font-bold text-kerala-deep mb-2">
              {isMl ? 'പരസ്യ പാക്കേജുകൾ' : 'Ad Packages'}
            </h2>
            <p className="text-gray-500 text-sm">
              {isMl ? 'ടിക്കർ, ഹോംപേജ്, കാറ്റഗറി പ്ലേസ്‌മെന്റ്' : 'Ticker, Homepage & Category placements'}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Starter', nameMl: 'സ്റ്റാർട്ടർ',
                price: 500, icon: Zap,
                impressions: '50,000',
                placements: 'Ticker + Category', placementsMl: 'ടിക്കർ + കാറ്റഗറി',
                duration: '30 days', durationMl: '30 ദിവസം',
                color: 'bg-blue-50 border-blue-100',
                iconColor: 'text-blue-500',
              },
              {
                name: 'Growth', nameMl: 'ഗ്രോത്ത്',
                price: 1500, icon: TrendingUp,
                impressions: '200,000',
                placements: 'Ticker + Homepage + Category', placementsMl: 'ടിക്കർ + ഹോംപേജ് + കാറ്റഗറി',
                duration: '45 days', durationMl: '45 ദിവസം',
                color: 'bg-kerala-cream border-kerala-gold/20',
                iconColor: 'text-kerala-gold',
              },
              {
                name: 'Enterprise', nameMl: 'എന്റർപ്രൈസ്',
                price: 4000, icon: Building2,
                impressions: '1,000,000',
                placements: 'All Premium Placements', placementsMl: 'എല്ലാ പ്ലേസ്‌മെന്റ്',
                duration: '90 days', durationMl: '90 ദിവസം',
                color: 'bg-kerala-deep/5 border-kerala-green/20',
                iconColor: 'text-kerala-green',
              },
            ].map(pkg => (
              <div
                key={pkg.name}
                className={`rounded-2xl border p-6 ${pkg.color} flex flex-col gap-4`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm`}>
                    <pkg.icon size={20} className={pkg.iconColor} />
                  </div>
                  <div>
                    <h3 className="font-bold text-kerala-deep">{isMl ? pkg.nameMl : pkg.name}</h3>
                    <p className="font-serif text-xl font-bold text-kerala-deep">AED {pkg.price.toLocaleString()}</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm flex-1">
                  <li className="flex items-center gap-2 text-gray-700">
                    <BarChart2 size={14} className="text-gray-400 flex-shrink-0" />
                    {pkg.impressions} {isMl ? 'ഇംപ്രഷൻ' : 'impressions'}
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <Megaphone size={14} className="text-gray-400 flex-shrink-0" />
                    {isMl ? pkg.placementsMl : pkg.placements}
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <Clock size={14} className="text-gray-400 flex-shrink-0" />
                    {isMl ? pkg.durationMl : pkg.duration}
                  </li>
                </ul>
                <Link
                  href={`/${locale}/auth`}
                  className="block text-center bg-kerala-green hover:bg-kerala-green-light text-white font-semibold py-2.5 rounded-xl transition-all text-sm"
                >
                  {isMl ? 'ഇപ്പോൾ ബുക്ക് ചെയ്യൂ' : 'Book Now'}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 4: JOB POSTING ──────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl font-bold text-kerala-deep mb-2">
              {isMl ? 'ജോബ് പോസ്റ്റ് വിലനിർണ്ണയം' : 'Job Posting Pricing'}
            </h2>
            <p className="text-gray-500 text-sm">
              {isMl ? 'UAE-ലെ Malayali പ്രൊഫഷണലുകളിലേക്ക് എത്തൂ' : 'Reach Malayali professionals across UAE'}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-kerala-deep text-white">
                <tr>
                  <th className="text-left px-6 py-4 font-semibold">{isMl ? 'പ്ലാൻ' : 'Plan'}</th>
                  <th className="text-center px-4 py-4 font-semibold">{isMl ? 'ജോബ് പോസ്റ്റ്' : 'Job Posts'}</th>
                  <th className="text-center px-4 py-4 font-semibold">{isMl ? 'ദൈർഘ്യം' : 'Duration'}</th>
                  <th className="text-right px-6 py-4 font-semibold">{isMl ? 'വില' : 'Price'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { plan: 'Single Job Post', planMl: 'ഒറ്റ ജോബ് പോസ്റ്റ്', posts: '1', duration: '30 days', durationMl: '30 ദിവസം', price: 'AED 150' },
                  { plan: 'Bundle (5 Posts)', planMl: '5 ജോബ് ബണ്ടിൽ', posts: '5', duration: '60 days', durationMl: '60 ദിവസം', price: 'AED 500', savings: 'Save AED 250', savingsMl: 'AED 250 ലാഭം' },
                  { plan: 'Monthly Unlimited', planMl: 'അൺലിമിറ്റഡ് (മാസം)', posts: 'Unlimited', duration: '30 days', durationMl: '30 ദിവസം', price: 'AED 800', highlight: true },
                ].map(row => (
                  <tr key={row.plan} className={row.highlight ? 'bg-kerala-cream' : 'hover:bg-gray-50'}>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-kerala-deep">{isMl ? row.planMl : row.plan}</div>
                      {row.savings && (
                        <span className="text-xs text-kerala-green font-semibold">
                          {isMl ? row.savingsMl : row.savings}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-center text-gray-600">{row.posts}</td>
                    <td className="px-4 py-4 text-center text-gray-600">{isMl ? row.durationMl : row.duration}</td>
                    <td className="px-6 py-4 text-right font-bold text-kerala-deep">{row.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-6 py-4 border-t border-gray-100 text-center">
              <Link
                href={`/${locale}/jobs`}
                className="inline-flex items-center gap-2 bg-kerala-green hover:bg-kerala-green-light text-white font-semibold px-6 py-2.5 rounded-xl transition-all text-sm"
              >
                <Briefcase size={15} />
                {isMl ? 'ജോബ് പോസ്റ്റ് ചെയ്യൂ' : 'Post a Job'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: FAQ ──────────────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl font-bold text-kerala-deep mb-2">
              {isMl ? 'പൊതുവായ ചോദ്യങ്ങൾ' : 'Frequently Asked Questions'}
            </h2>
          </div>
          <div className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <FaqItem
                key={i}
                item={item}
                open={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? null : i)}
                isMl={isMl}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 6: CTA BANNER ───────────────────────────────────────────── */}
      <section className="bg-kerala-deep py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-kerala-gold/20 flex items-center justify-center mx-auto mb-5">
            <ShoppingBag size={26} className="text-kerala-gold-light" />
          </div>
          <h2 className="font-serif text-4xl font-bold text-white mb-3">
            {isMl ? 'ഇന്ന് സൗജന്യമായി ആരംഭിക്കൂ' : 'Start Free Today'}
          </h2>
          <p className="text-white/60 text-sm mb-8">
            {isMl
              ? 'ക്രെഡിറ്റ് കാർഡ് ആവശ്യമില്ല. ഏത് സമയത്തും ഇല്ലാതാക്കാം.'
              : 'No credit card required. Cancel anytime.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={`/${locale}/auth`}
              className="inline-flex items-center justify-center gap-2 bg-kerala-gold hover:bg-kerala-gold-light text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg text-base"
            >
              <BadgeCheck size={18} />
              {isMl ? 'ഇപ്പോൾ രജിസ്റ്റർ ചെയ്യൂ' : 'Register Now — Free'}
            </Link>
            <Link
              href={`/${locale}/directory`}
              className="inline-flex items-center justify-center gap-2 border border-white/30 text-white hover:border-white/60 font-semibold px-8 py-4 rounded-xl transition-all text-base"
            >
              <Globe size={18} />
              {isMl ? 'ഡയറക്ടറി കാണൂ' : 'Browse Directory'}
            </Link>
          </div>
          <p className="mt-6 text-white/30 text-xs">
            {isMl ? '15,000+ ബിസിനസുകൾ ഇതിനകം ലിസ്റ്റ് ചെയ്തിട്ടുണ്ട്' : '15,000+ businesses already listed'}
          </p>
        </div>
      </section>

      <Footer />
    </main>
  )
}
