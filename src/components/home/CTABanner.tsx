'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function CTABanner() {
  const locale = useLocale()
  const isMl = locale === 'ml'

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&q=70&auto=format&fit=crop"
          alt="Dubai"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-kerala-deep/95 via-kerala-deep/80 to-kerala-green/70" />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-kerala-gold/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-kerala-green/20 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-kerala-gold/20 border border-kerala-gold/40 text-kerala-gold-light text-sm px-4 py-1.5 rounded-full mb-6">
          <Sparkles size={14} />
          {isMl ? 'ഇന്ന് തന്നെ ആരംഭിക്കൂ' : 'Get Started Today'}
        </div>

        <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
          {isMl ? (
            <>
              35 ലക്ഷം <span className="text-kerala-gold-light">മലയാളികളുമായി</span>
              <br />ബന്ധപ്പെടാൻ തയ്യാറോ?
            </>
          ) : (
            <>
              Ready to Connect with
              <br />
              <span className="text-kerala-gold-light">3.5 Million Malayalis?</span>
            </>
          )}
        </h2>

        <p className="text-white/70 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
          {isMl
            ? 'ഇന്ന് തന്നെ നിങ്ങളുടെ ബിസിനസ് ലിസ്റ്റ് ചെയ്ത് യുഎഇയിലെ ഏറ്റവും വലിയ മലയാളി നെറ്റ്‌വർക്കിൽ ഇടം നേടൂ'
            : 'List your business today and reach the largest Malayali network in the UAE. Free to join, thousands of customers waiting.'}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href={`/${locale}/dashboard`}
            className="group flex items-center gap-3 bg-kerala-gold hover:bg-kerala-gold-light text-white font-bold px-8 py-4 rounded-2xl transition-all duration-200 text-lg shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
          >
            {isMl ? 'സൗജന്യമായി ലിസ്റ്റ് ചെയ്യൂ' : 'List Your Business Free'}
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href={`/${locale}/directory`}
            className="flex items-center gap-2 border-2 border-white/40 hover:border-white/70 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-200 text-lg hover:bg-white/10"
          >
            {isMl ? 'ഡയറക്ടറി കാണൂ' : 'Explore Directory'}
          </Link>
        </div>

        {/* Trust indicators */}
        <div className="flex flex-wrap justify-center gap-6 mt-12 text-white/50 text-sm">
          <span>✓ {isMl ? 'ക്രെഡിറ്റ് കാർഡ് ആവശ്യമില്ല' : 'No credit card required'}</span>
          <span>✓ {isMl ? 'ഒരു മിനിറ്റ് സെറ്റ്അപ്പ്' : '1-minute setup'}</span>
          <span>✓ {isMl ? 'എന്നും സൗജന്യം' : 'Free forever'}</span>
        </div>
      </div>
    </section>
  )
}
