'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { useParams } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { getClassified, getClassifieds } from '@/lib/classifieds'
import type { Classified } from '@/lib/classifieds'
import {
  MapPin, Clock, Eye, Heart, Share2, ChevronRight,
  Phone, MessageCircle, Flag, Tag, ArrowLeft,
  CheckCircle, AlertTriangle, RefreshCw
} from 'lucide-react'

const TYPE_LABELS: Record<string, { en: string; ml: string; color: string }> = {
  sale:    { en: 'For Sale',  ml: 'വിൽക്കാനുണ്ട്', color: 'bg-green-100 text-green-700' },
  rent:    { en: 'For Rent',  ml: 'വാടകയ്ക്ക്',    color: 'bg-blue-100 text-blue-700' },
  wanted:  { en: 'Wanted',    ml: 'വേണം',           color: 'bg-orange-100 text-orange-700' },
  service: { en: 'Service',   ml: 'സർവ്വീസ്',       color: 'bg-purple-100 text-purple-700' },
}

const CONDITION_LABELS: Record<string, { en: string; ml: string; color: string }> = {
  'new':      { en: 'Brand New',   ml: 'പുതിയത്',         color: 'bg-emerald-100 text-emerald-700' },
  'like-new': { en: 'Like New',    ml: 'ഏതാണ്ട് പുതിയത്', color: 'bg-teal-100 text-teal-700' },
  'good':     { en: 'Good',        ml: 'നല്ല അവസ്ഥ',      color: 'bg-yellow-100 text-yellow-700' },
  'fair':     { en: 'Fair',        ml: 'സാധാരണ',          color: 'bg-gray-100 text-gray-600' },
}

function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export default function ClassifiedDetailPage() {
  const locale = useLocale()
  const params = useParams()
  const isMl = locale === 'ml'
  const id = Number(params.id)

  const [item, setItem] = useState<Classified | null | undefined>(undefined)
  const [related, setRelated] = useState<Classified[]>([])
  const [activeImg, setActiveImg] = useState(0)
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    async function load() {
      const c = await getClassified(id)
      setItem(c)
      if (c) {
        const rel = await getClassifieds({ category: c.category, limit: 4 })
        setRelated(rel.filter(r => r.id !== c.id).slice(0, 3))
      }
    }
    load()
  }, [id])

  function handleShare() {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Loading state
  if (item === undefined) {
    return (
      <main className="min-h-screen bg-kerala-cream">
        <Navbar />
        <div className="h-1 w-full bg-gradient-to-r from-kerala-green via-kerala-gold to-kerala-green mt-16" />
        <div className="max-w-6xl mx-auto px-4 pt-10 pb-6 animate-pulse space-y-4">
          <div className="h-6 bg-gray-100 rounded w-64" />
          <div className="h-96 bg-gray-100 rounded-2xl" />
          <div className="h-32 bg-gray-100 rounded-2xl" />
        </div>
        <Footer />
      </main>
    )
  }

  // Not found
  if (!item) {
    return (
      <main className="min-h-screen bg-kerala-cream">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 text-center px-4">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="font-serif text-2xl font-bold text-kerala-deep mb-2">Ad Not Found</h1>
          <p className="text-gray-500 mb-6">This classified may have been removed or expired.</p>
          <Link href={`/${locale}/classifieds`} className="bg-kerala-green text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-kerala-green-light transition-colors">
            Browse Classifieds
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  const typeInfo = TYPE_LABELS[item.type]
  const conditionInfo = item.condition ? CONDITION_LABELS[item.condition] : null

  return (
    <main className="min-h-screen bg-kerala-cream">
      <Navbar />

      {/* Top bar */}
      <div className="h-1 w-full bg-gradient-to-r from-kerala-green via-kerala-gold to-kerala-green mt-16" />

      <div className="max-w-6xl mx-auto px-4 pt-6 pb-6">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-5 flex-wrap">
          <Link href={`/${locale}`} className="hover:text-kerala-green">Home</Link>
          <ChevronRight size={12} />
          <Link href={`/${locale}/classifieds`} className="hover:text-kerala-green">Classifieds</Link>
          <ChevronRight size={12} />
          <Link href={`/${locale}/classifieds?cat=${item.category}`} className="hover:text-kerala-green">{item.category}</Link>
          <ChevronRight size={12} />
          <span className="text-kerala-deep font-medium truncate max-w-[180px]">
            {isMl ? (item.title_ml ?? item.title) : item.title}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── LEFT: images + details ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Image gallery */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <div className="relative">
                <div className="relative h-72 sm:h-96 w-full bg-gray-100">
                  {item.images[activeImg] ? (
                    <Image
                      src={item.images[activeImg]}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Tag size={48} className="text-gray-200" />
                    </div>
                  )}
                  {item.urgent && (
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                      <AlertTriangle size={11} /> URGENT
                    </span>
                  )}
                  {item.featured && (
                    <span className="absolute top-3 right-3 bg-kerala-gold text-white text-xs font-bold px-2.5 py-1 rounded-full">
                      ⭐ FEATURED
                    </span>
                  )}
                </div>

                {/* Thumbnails */}
                {item.images.length > 1 && (
                  <div className="flex gap-2 p-3 border-t border-gray-100 bg-gray-50">
                    {item.images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImg(i)}
                        className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${activeImg === i ? 'border-kerala-green' : 'border-transparent'}`}
                      >
                        <Image src={img} alt="" fill className="object-cover" sizes="64px" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Title & price */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${typeInfo.color}`}>
                  {isMl ? typeInfo.ml : typeInfo.en}
                </span>
                {conditionInfo && (
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${conditionInfo.color}`}>
                    {isMl ? conditionInfo.ml : conditionInfo.en}
                  </span>
                )}
                <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Tag size={10} /> {isMl ? (item.category_ml ?? item.category) : item.category}
                </span>
              </div>

              <h1 className={`font-bold text-kerala-deep mb-1 leading-snug ${isMl ? 'font-malayalam text-xl' : 'text-2xl'}`}>
                {isMl ? (item.title_ml ?? item.title) : item.title}
              </h1>
              <p className="text-gray-400 text-xs mb-4 flex items-center gap-3 flex-wrap">
                {item.location && <span className="flex items-center gap-1"><MapPin size={11} />{isMl ? (item.location_ml ?? item.location) : item.location}</span>}
                <span className="flex items-center gap-1"><Clock size={11} />{timeAgo(item.created_at)}</span>
                <span className="flex items-center gap-1"><Eye size={11} />{item.views} views</span>
              </p>

              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="text-3xl font-bold text-kerala-green">{item.price ?? 'Free'}</p>
                  {item.negotiable && (
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                      <RefreshCw size={10} /> {isMl ? 'വില ചർച്ചചെയ്യാം' : 'Price negotiable'}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSaved(!saved)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${saved ? 'bg-red-50 border-red-200 text-red-500' : 'bg-white border-gray-200 text-gray-500 hover:border-kerala-green hover:text-kerala-green'}`}
                  >
                    <Heart size={15} className={saved ? 'fill-current' : ''} />
                    {saved ? (isMl ? 'സേവ് ചെയ്തു' : 'Saved') : (isMl ? 'സേവ്' : 'Save')}
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border border-gray-200 text-gray-500 hover:border-kerala-green hover:text-kerala-green transition-all bg-white"
                  >
                    <Share2 size={15} />
                    {copied ? (isMl ? 'കോപ്പി ചെയ്തു!' : 'Copied!') : (isMl ? 'ഷെയർ' : 'Share')}
                  </button>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h2 className="font-serif text-lg font-bold text-kerala-deep mb-3">
                {isMl ? 'വിവരണം' : 'Description'}
              </h2>
              <p className={`text-gray-600 leading-relaxed whitespace-pre-line ${isMl ? 'font-malayalam' : ''}`}>
                {isMl ? (item.description_ml ?? item.description) : item.description}
              </p>
            </div>

            {/* Details table */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h2 className="font-serif text-lg font-bold text-kerala-deep mb-4">
                {isMl ? 'വിശദാംശങ്ങൾ' : 'Ad Details'}
              </h2>
              <div className="grid grid-cols-2 gap-y-3 text-sm">
                {[
                  { label: isMl ? 'വിഭാഗം' : 'Category',   value: isMl ? (item.category_ml ?? item.category) : item.category },
                  { label: isMl ? 'തരം' : 'Type',           value: isMl ? typeInfo.ml : typeInfo.en },
                  { label: isMl ? 'എമിറേറ്റ്' : 'Emirate', value: item.emirate },
                  { label: isMl ? 'സ്ഥലം' : 'Location',     value: isMl ? (item.location_ml ?? item.location ?? '') : (item.location ?? '') },
                  ...(item.condition ? [{ label: isMl ? 'അവസ്ഥ' : 'Condition', value: isMl ? (conditionInfo?.ml ?? '') : (conditionInfo?.en ?? '') }] : []),
                  { label: isMl ? 'കാണലുകൾ' : 'Views',     value: String(item.views) },
                ].map(row => (
                  <div key={row.label} className="contents">
                    <span className="text-gray-400 font-medium">{row.label}</span>
                    <span className="text-kerala-deep font-semibold">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Related */}
            {related.length > 0 && (
              <div>
                <h2 className="font-serif text-xl font-bold text-kerala-deep mb-4">
                  {isMl ? 'സമാന പരസ്യങ്ങൾ' : 'Similar Ads'}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {related.map(r => (
                    <Link key={r.id} href={`/${locale}/classifieds/${r.id}`}
                      className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-md hover:border-kerala-green/30 transition-all group">
                      <div className="relative h-36 bg-gray-100">
                        {r.images[0] && (
                          <Image src={r.images[0]} alt={r.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 640px) 100vw, 33vw" />
                        )}
                      </div>
                      <div className="p-3">
                        <p className="text-kerala-green font-bold text-sm">{r.price ?? 'Free'}</p>
                        <p className="text-kerala-deep text-xs font-semibold line-clamp-2 mt-0.5">{isMl ? (r.title_ml ?? r.title) : r.title}</p>
                        {r.location && <p className="text-gray-400 text-xs mt-1 flex items-center gap-1"><MapPin size={9} />{isMl ? (r.location_ml ?? r.location) : r.location}</p>}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT: seller card + contact ── */}
          <div className="space-y-4">

            {/* Contact card */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 sticky top-4">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-kerala-cream">
                  {item.seller_avatar ? (
                    <Image src={item.seller_avatar} alt={item.seller_name ?? ''} fill className="object-cover" sizes="48px" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-kerala-green font-bold text-lg">
                      {(item.seller_name ?? 'A')[0]}
                    </div>
                  )}
                </div>
                <div>
                  <p className={`font-bold text-kerala-deep text-sm ${isMl ? 'font-malayalam' : ''}`}>
                    {isMl ? (item.seller_name_ml ?? item.seller_name) : item.seller_name}
                  </p>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <CheckCircle size={11} className="text-kerala-green" />
                    {isMl ? 'പരിശോധിച്ചത്' : 'Verified Member'}
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                {item.whatsapp && (
                  <a
                    href={`https://wa.me/${item.whatsapp.replace(/\D/g,'')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#20bd5a] transition-colors"
                  >
                    <MessageCircle size={16} />
                    {isMl ? 'WhatsApp-ൽ ബന്ധപ്പെടൂ' : 'Chat on WhatsApp'}
                  </a>
                )}
                {item.phone && (
                  <a
                    href={`tel:${item.phone}`}
                    className="flex items-center justify-center gap-2 w-full bg-kerala-green text-white py-3 rounded-xl font-semibold text-sm hover:bg-kerala-green-light transition-colors"
                  >
                    <Phone size={16} />
                    {isMl ? 'വിളിക്കൂ' : 'Call Seller'}
                  </a>
                )}
              </div>

              <p className="text-xs text-gray-400 text-center mt-3">
                {isMl ? 'സേഫ് ആയി മീറ്റ് ചെയ്ത് ഡീൽ ചെയ്യൂ' : 'Meet safely in person to complete the deal'}
              </p>
            </div>

            {/* Safety tips */}
            <div className="bg-kerala-gold/10 rounded-2xl p-4 border border-kerala-gold/20">
              <p className="font-semibold text-kerala-deep text-sm mb-2 flex items-center gap-1.5">
                <CheckCircle size={14} className="text-kerala-gold" />
                {isMl ? 'സേഫ്റ്റി ടിപ്സ്' : 'Safety Tips'}
              </p>
              <ul className="text-xs text-gray-500 space-y-1.5">
                {(isMl ? [
                  'പൊതു സ്ഥലത്ത് കണ്ടുമുട്ടൂ',
                  'ഡെലിവറിക്ക് മുൻപ് പണം അടക്കരുത്',
                  'ഇടപാട് ഉടൻ ബന്ധുക്കളെ അറിയിക്കൂ',
                  'ആധിപത്യ വസ്‌തുക്കൾ പരിശോധിക്കൂ',
                ] : [
                  'Meet in a safe, public place',
                  'Don\'t pay before receiving the item',
                  'Tell someone about the transaction',
                  'Verify documents for high-value items',
                ]).map((tip, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-kerala-gold mt-0.5">•</span> {tip}
                  </li>
                ))}
              </ul>
            </div>

            {/* Report */}
            <button className="flex items-center gap-2 text-xs text-gray-400 hover:text-red-400 transition-colors mx-auto">
              <Flag size={12} />
              {isMl ? 'ഈ പരസ്യം റിപ്പോർട്ട് ചെയ്യൂ' : 'Report this ad'}
            </button>

            {/* Back link */}
            <Link href={`/${locale}/classifieds`}
              className="flex items-center gap-2 text-sm text-kerala-green hover:text-kerala-green-light font-semibold transition-colors">
              <ArrowLeft size={14} />
              {isMl ? 'എല്ലാ പരസ്യങ്ങളിലേക്ക്' : 'Back to Classifieds'}
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
