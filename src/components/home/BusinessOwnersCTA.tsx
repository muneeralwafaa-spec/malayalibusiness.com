'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { ArrowRight, Building2, TrendingUp, Bell, Star } from 'lucide-react'

const features = [
  {
    icon: Building2,
    text: 'Get discovered by 3.5M+ Malayalis',
    textMl: '35 ലക്ഷം+ മലയാളികൾ കണ്ടെത്തും',
  },
  {
    icon: Bell,
    text: 'Manage bookings & inquiries',
    textMl: 'ബുക്കിംഗ് & അന്വേഷണങ്ങൾ മാനേജ് ചെയ്യൂ',
  },
  {
    icon: TrendingUp,
    text: 'Run targeted promotions',
    textMl: 'ടാർഗറ്റഡ് പ്രമോഷനുകൾ നടത്തൂ',
  },
  {
    icon: Star,
    text: 'Build your brand reputation',
    textMl: 'ബ്രാൻഡ് പ്രശസ്തി കെട്ടിപ്പടുക്കൂ',
  },
]

const ownerPhotos = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
]

export default function BusinessOwnersCTA() {
  const locale = useLocale()
  const isMl = locale === 'ml'

  return (
    <section className="bg-kerala-deep py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-kerala-gold rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-kerala-green rounded-full translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text content */}
          <div>
            <div className="inline-flex items-center gap-2 bg-kerala-gold/20 border border-kerala-gold/30 text-kerala-gold-light text-sm px-4 py-1.5 rounded-full mb-6">
              <Building2 size={14} />
              {isMl ? 'ബിസിനസ് ഉടമകൾക്ക്' : 'For Business Owners'}
            </div>

            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
              {isMl ? (
                <>ഞങ്ങളോടൊപ്പം നിങ്ങളുടെ <span className="text-kerala-gold-light">ബിസിനസ്</span> വളർത്തൂ</>
              ) : (
                <>Grow Your <span className="text-kerala-gold-light">Business</span> With Us</>
              )}
            </h2>

            <p className="text-white/60 text-lg mb-8">
              {isMl
                ? 'MalayaliBusiness UAE വിശ്വസിക്കുന്ന ആയിരക്കണക്കിന് മലയാളി സംരംഭകരോടൊപ്പം ചേരൂ'
                : 'Join thousands of Malayali entrepreneurs who trust MalayaliBusiness UAE to grow their business'}
            </p>

            {/* Features List */}
            <ul className="space-y-4 mb-10">
              {features.map((f, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-kerala-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <f.icon size={16} className="text-kerala-gold-light" />
                  </div>
                  <span className="text-white/80 text-base">
                    {isMl ? f.textMl : f.text}
                  </span>
                </li>
              ))}
            </ul>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={`/${locale}/dashboard`}
                className="flex items-center justify-center gap-2 bg-kerala-gold hover:bg-kerala-gold-light text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 text-base"
              >
                {isMl ? 'സൗജന്യമായി ലിസ്റ്റ് ചെയ്യൂ' : 'List Your Business Free'}
                <ArrowRight size={18} />
              </Link>
              <Link
                href={`/${locale}/auth`}
                className="flex items-center justify-center gap-2 border border-white/30 hover:border-white/60 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 text-base"
              >
                {isMl ? 'ബിസിനസ് ഓണർ ലോഗിൻ' : 'Business Owner Login'}
              </Link>
            </div>

            {/* Social proof */}
            <div className="mt-8 flex items-center gap-4">
              <div className="flex -space-x-2">
                {ownerPhotos.map((photo, i) => (
                  <div key={i} className="relative w-10 h-10 rounded-full border-2 border-kerala-deep overflow-hidden">
                    <Image src={photo} alt="" fill className="object-cover" sizes="40px" />
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 mb-0.5">
                  {[1,2,3,4,5].map(i => <Star key={i} size={12} className="text-kerala-gold fill-kerala-gold" />)}
                </div>
                <p className="text-white/60 text-sm">
                  {isMl ? '10,000+ ബിസിനസ് ഉടമകൾ ഞങ്ങളെ വിശ്വസിക്കുന്നു' : '10,000+ business owners trust us'}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Dashboard mockup / image */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80&auto=format&fit=crop"
                alt="Business owner"
                width={600}
                height={500}
                className="w-full h-80 lg:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-kerala-deep/60 to-transparent" />
            </div>

            {/* Floating stat cards */}
            <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 min-w-[160px]">
              <div className="text-kerala-green font-bold text-2xl font-serif">+342%</div>
              <div className="text-gray-500 text-xs mt-1">Avg. monthly views increase</div>
            </div>

            <div className="absolute -bottom-4 -left-4 bg-kerala-gold rounded-2xl shadow-xl p-4 min-w-[160px]">
              <div className="text-white font-bold text-2xl font-serif">AED 0</div>
              <div className="text-white/80 text-xs mt-1">To list your business</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
