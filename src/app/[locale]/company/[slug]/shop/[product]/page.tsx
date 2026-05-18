'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { useParams } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useCart } from '@/context/CartContext'
import { vendorListings, LISTING_TYPE_META } from '@/lib/mock-vendor-products'
import {
  Star, MapPin, BadgeCheck, Clock, ChevronRight, MessageCircle,
  Phone, ShoppingCart, Calendar, FileText, Zap, ArrowLeft,
  CheckCircle, Shield, Truck, Share2, Heart, ChevronLeft,
} from 'lucide-react'

export default function ProductDetailPage() {
  const locale = useLocale()
  const isMl = locale === 'ml'
  const params = useParams()
  const productId = params.product as string

  const listing = vendorListings.find(l => l.id === productId)
  const { addItem, openCart } = useCart()

  // UI state
  const [activeImage, setActiveImage] = useState(0)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [saved, setSaved] = useState(false)
  // Appointment state
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedSlot, setSelectedSlot] = useState('')
  const [bookingDone, setBookingDone] = useState(false)
  // Quote state
  const [quoteName, setQuoteName] = useState('')
  const [quotePhone, setQuotePhone] = useState('')
  const [quoteMsg, setQuoteMsg] = useState('')
  const [quoteSent, setQuoteSent] = useState(false)

  if (!listing) {
    return (
      <main className="min-h-screen bg-kerala-cream">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <p className="text-5xl">🔍</p>
          <h1 className="font-serif text-2xl font-bold text-kerala-deep">
            {isMl ? 'ഉൽപ്പന്നം കണ്ടെത്തിയില്ല' : 'Listing not found'}
          </h1>
          <Link href={`/${locale}/shop`} className="bg-kerala-green text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-kerala-deep transition-colors">
            {isMl ? 'ഷോപ്പിലേക്ക്' : 'Back to Shop'}
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  const meta = LISTING_TYPE_META[listing.listingType]
  const discount = listing.originalPrice ? Math.round((1 - listing.price / listing.originalPrice) * 100) : 0
  const images = listing.images?.length ? listing.images : [listing.image]

  // Related listings from same vendor or same category
  const related = vendorListings
    .filter(l => l.id !== listing.id && (l.vendorSlug === listing.vendorSlug || l.category === listing.category))
    .slice(0, 4)

  function handleAddToCart() {
    addItem(listing, { slot: selectedSlot || undefined, date: selectedDate || undefined })
    setAdded(true)
    openCart()
    setTimeout(() => setAdded(false), 2000)
  }

  function handleBooking() {
    if (!selectedDate || !selectedSlot) return
    addItem(listing, { slot: selectedSlot, date: selectedDate })
    setBookingDone(true)
    openCart()
  }

  function handleQuote() {
    if (!quoteName || !quotePhone) return
    const msg = encodeURIComponent(
      `Hi ${listing.vendorName}! I'd like a quote for "${listing.name}".\n\nName: ${quoteName}\nPhone: ${quotePhone}\n\n${quoteMsg || 'Please send me your best price.'}`
    )
    window.open(`https://wa.me/${listing.vendorWhatsapp.replace(/\D/g, '')}?text=${msg}`, '_blank')
    setQuoteSent(true)
  }

  // Generate next 7 days for date picker
  const dates = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i + 1)
    return {
      value: d.toISOString().split('T')[0],
      label: d.toLocaleDateString('en-AE', { weekday: 'short', day: 'numeric', month: 'short' }),
    }
  })

  return (
    <main className="min-h-screen bg-kerala-cream">
      <Navbar />
      <div className="h-1 w-full bg-gradient-to-r from-kerala-green via-kerala-gold to-kerala-green" />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
          <Link href={`/${locale}`} className="hover:text-kerala-green">{isMl ? 'ഹോം' : 'Home'}</Link>
          <ChevronRight size={12} />
          <Link href={`/${locale}/shop`} className="hover:text-kerala-green">{isMl ? 'ഷോപ്പ്' : 'Shop'}</Link>
          <ChevronRight size={12} />
          <Link href={`/${locale}/company/${listing.vendorSlug}`} className="hover:text-kerala-green">{listing.vendorName}</Link>
          <ChevronRight size={12} />
          <span className="text-kerala-deep font-medium truncate max-w-[120px]">{isMl ? listing.nameMl : listing.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* ── LEFT: Images ── */}
          <div>
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-gray-100 mb-3">
              <Image
                src={images[activeImage]}
                alt={listing.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${meta.color}`}>
                  {meta.icon} {meta.label}
                </span>
                {discount > 0 && (
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-500 text-white">-{discount}% OFF</span>
                )}
                {listing.bestseller && (
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-kerala-gold text-white">🔥 Best Seller</span>
                )}
              </div>
              {/* Nav arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImage(i => (i - 1 + images.length) % images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => setActiveImage(i => (i + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                </>
              )}
            </div>
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImage(i)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${activeImage === i ? 'border-kerala-green' : 'border-transparent'}`}>
                    <Image src={img} alt="" fill className="object-cover" sizes="64px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT: Details + Action ── */}
          <div className="space-y-5">
            {/* Vendor pill */}
            <Link href={`/${locale}/company/${listing.vendorSlug}`} className="flex items-center gap-2.5 group w-fit">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-kerala-green/20 flex-shrink-0">
                <Image src={listing.vendorLogo} alt="" fill className="object-cover" />
              </div>
              <div>
                <p className="text-sm font-semibold text-kerala-deep flex items-center gap-1 group-hover:text-kerala-green transition-colors">
                  {listing.vendorName}
                  {listing.vendorVerified && <BadgeCheck size={14} className="text-kerala-green" />}
                </p>
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <MapPin size={10} />{isMl ? listing.vendorEmirati : listing.vendorEmirate}
                </p>
              </div>
            </Link>

            {/* Title */}
            <div>
              <h1 className={`font-serif text-2xl sm:text-3xl font-bold text-kerala-deep leading-tight ${isMl ? 'font-malayalam' : ''}`}>
                {isMl ? listing.nameMl : listing.name}
              </h1>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} size={14} className={i <= Math.floor(listing.rating) ? 'text-kerala-gold fill-kerala-gold' : 'text-gray-300'} />
                  ))}
                  <span className="text-sm font-semibold text-kerala-deep ml-1">{listing.rating}</span>
                </div>
                <span className="text-xs text-gray-400">({listing.reviews} {isMl ? 'റിവ്യൂ' : 'reviews'})</span>
                {listing.duration && (
                  <span className="flex items-center gap-1 text-xs text-gray-400"><Clock size={11} />{listing.duration}</span>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              {listing.price > 0 ? (
                <>
                  <span className="text-3xl font-bold text-kerala-green">AED {listing.price.toLocaleString()}</span>
                  {listing.originalPrice && (
                    <span className="text-lg text-gray-300 line-through">AED {listing.originalPrice}</span>
                  )}
                  {listing.unit && (
                    <span className="text-sm text-gray-400">/ {isMl ? listing.unitMl : listing.unit}</span>
                  )}
                </>
              ) : (
                <span className="text-xl font-bold text-orange-500">
                  {isMl ? 'ക്വോട്ട് ലഭിക്കും' : 'Custom Quote Available'}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm leading-relaxed">
              {isMl ? listing.descriptionMl : listing.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {(isMl ? listing.tagsMl : listing.tags).map(tag => (
                <span key={tag} className="bg-kerala-cream text-kerala-deep text-xs px-3 py-1 rounded-full border border-kerala-green/20">
                  #{tag}
                </span>
              ))}
            </div>

            {/* ── ACTION BLOCK by listing type ── */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">

              {/* PRODUCT — qty + add to cart */}
              {listing.listingType === 'product' && (
                <>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-gray-500">{isMl ? 'അളവ്' : 'Quantity'}</span>
                    <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
                      <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-8 h-8 rounded-lg hover:bg-white flex items-center justify-center transition-colors font-bold text-gray-600 text-lg">−</button>
                      <span className="w-8 text-center font-bold text-kerala-deep">{qty}</span>
                      <button onClick={() => setQty(q => q + 1)} className="w-8 h-8 rounded-lg hover:bg-white flex items-center justify-center transition-colors font-bold text-gray-600 text-lg">+</button>
                    </div>
                    <span className="text-sm text-gray-500">= <span className="font-bold text-kerala-deep">AED {(listing.price * qty).toFixed(2)}</span></span>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleAddToCart}
                      className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all ${added ? 'bg-kerala-green/20 text-kerala-green' : 'bg-kerala-green text-white hover:bg-kerala-deep'}`}
                    >
                      <ShoppingCart size={16} />
                      {added ? (isMl ? '✓ ചേർത്തു!' : '✓ Added!') : (isMl ? 'കാർട്ടിൽ ചേർക്കൂ' : 'Add to Cart')}
                    </button>
                    <a
                      href={`https://wa.me/${listing.vendorWhatsapp.replace(/\D/g, '')}`}
                      target="_blank" rel="noopener noreferrer"
                      className="px-4 py-3.5 rounded-xl bg-[#25D366] text-white hover:bg-[#20bd5a] transition-colors flex items-center justify-center"
                    >
                      <MessageCircle size={18} />
                    </a>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Truck size={12} className="text-kerala-green" />{isMl ? 'ഡെലിവറി ലഭ്യം' : 'Delivery available'}</span>
                    <span className="flex items-center gap-1"><Shield size={12} className="text-kerala-green" />{isMl ? 'വെരിഫൈഡ് വെണ്ടർ' : 'Verified vendor'}</span>
                  </div>
                </>
              )}

              {/* DIRECT SERVICE — buy now */}
              {listing.listingType === 'direct_service' && (
                <>
                  <p className="text-sm text-gray-500">
                    {isMl ? 'ഈ സേവനം ഉടൻ ബുക്ക് ചെയ്യൂ. 24 മണിക്കൂറിനുള്ളിൽ സ്ഥിരീകരിക്കും.' : 'Book this service instantly. We\'ll confirm within 24 hours.'}
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={handleAddToCart}
                      className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all ${added ? 'bg-purple-100 text-purple-700' : 'bg-purple-600 text-white hover:bg-purple-700'}`}
                    >
                      <Zap size={16} />
                      {added ? (isMl ? '✓ ബുക്ക് ചെയ്തു!' : '✓ Booked!') : (isMl ? 'ഇപ്പോൾ ബുക്ക് ചെയ്യൂ' : 'Book Now')}
                    </button>
                    <a
                      href={`https://wa.me/${listing.vendorWhatsapp.replace(/\D/g, '')}`}
                      target="_blank" rel="noopener noreferrer"
                      className="px-4 py-3.5 rounded-xl bg-[#25D366] text-white hover:bg-[#20bd5a] transition-colors flex items-center justify-center"
                    >
                      <MessageCircle size={18} />
                    </a>
                  </div>
                </>
              )}

              {/* APPOINTMENT — date + slot picker */}
              {listing.listingType === 'appointment' && (
                <>
                  {bookingDone ? (
                    <div className="text-center py-4">
                      <CheckCircle size={40} className="text-kerala-green mx-auto mb-2" />
                      <p className="font-bold text-kerala-deep text-lg">
                        {isMl ? 'അപ്പോയ്ന്റ്മെന്റ് ബുക്ക് ചെയ്തു!' : 'Appointment Booked!'}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">{selectedDate} · {selectedSlot}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {isMl ? 'വെണ്ടർ ഉടൻ WhatsApp-ൽ ബന്ധപ്പെടും' : 'Vendor will contact you via WhatsApp shortly'}
                      </p>
                    </div>
                  ) : (
                    <>
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase mb-2">{isMl ? 'തീയതി തിരഞ്ഞെടുക്കൂ' : 'Select Date'}</p>
                        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                          {dates.map(d => (
                            <button
                              key={d.value}
                              onClick={() => setSelectedDate(d.value)}
                              className={`flex-shrink-0 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${selectedDate === d.value ? 'border-kerala-green bg-kerala-green text-white' : 'border-gray-200 text-gray-600 hover:border-kerala-green'}`}
                            >
                              {d.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      {listing.slots && (
                        <div>
                          <p className="text-xs font-semibold text-gray-400 uppercase mb-2">{isMl ? 'സമയം തിരഞ്ഞെടുക്കൂ' : 'Select Time Slot'}</p>
                          <div className="grid grid-cols-3 gap-2">
                            {listing.slots.map(slot => (
                              <button
                                key={slot}
                                onClick={() => setSelectedSlot(slot)}
                                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${selectedSlot === slot ? 'border-kerala-green bg-kerala-green text-white' : 'border-gray-200 text-gray-600 hover:border-kerala-green'}`}
                              >
                                {slot}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      <button
                        onClick={handleBooking}
                        disabled={!selectedDate || !selectedSlot}
                        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 transition-all"
                      >
                        <Calendar size={16} />
                        {isMl ? 'അപ്പോയ്ന്റ്മെന്റ് ബുക്ക് ചെയ്യൂ' : 'Confirm Appointment'}
                      </button>
                    </>
                  )}
                </>
              )}

              {/* QUOTE — request form */}
              {listing.listingType === 'quote' && (
                <>
                  {quoteSent ? (
                    <div className="text-center py-4">
                      <CheckCircle size={40} className="text-kerala-green mx-auto mb-2" />
                      <p className="font-bold text-kerala-deep text-lg">
                        {isMl ? 'ക്വോട്ട് അഭ്യർത്ഥന അയച്ചു!' : 'Quote Request Sent!'}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {isMl ? 'വെണ്ടർ ഉടൻ WhatsApp-ൽ ബന്ധപ്പെടും.' : 'The vendor will contact you shortly on WhatsApp.'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-500">
                        {isMl ? 'ക്വോട്ട് ആവശ്യപ്പെടൂ. WhatsApp വഴി ബന്ധപ്പെടും.' : 'Request a custom quote. Vendor responds via WhatsApp.'}
                      </p>
                      <input
                        type="text" value={quoteName} onChange={e => setQuoteName(e.target.value)}
                        placeholder={isMl ? 'നിങ്ങളുടെ പേര്' : 'Your Name'}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 focus:border-kerala-green"
                      />
                      <input
                        type="tel" value={quotePhone} onChange={e => setQuotePhone(e.target.value)}
                        placeholder={isMl ? 'WhatsApp നമ്പർ' : 'Phone / WhatsApp'}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 focus:border-kerala-green"
                      />
                      <textarea
                        value={quoteMsg} onChange={e => setQuoteMsg(e.target.value)} rows={2}
                        placeholder={isMl ? 'ആവശ്യകതകൾ വിവരിക്കൂ...' : 'Describe your requirements...'}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 focus:border-kerala-green resize-none"
                      />
                      <button
                        onClick={handleQuote}
                        disabled={!quoteName || !quotePhone}
                        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm bg-orange-500 text-white hover:bg-orange-600 disabled:bg-gray-300 transition-all"
                      >
                        <FileText size={16} />
                        {isMl ? 'ക്വോട്ട് ആവശ്യപ്പെടൂ' : 'Request Quote via WhatsApp'}
                      </button>
                    </div>
                  )}
                </>
              )}

              {/* CONTACT ONLY — WhatsApp / Call */}
              {listing.listingType === 'contact_only' && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-500">
                    {isMl ? 'ഈ സേവനത്തിനായി നേരിട്ട് ബന്ധപ്പെടൂ.' : 'Contact the vendor directly for pricing and availability.'}
                  </p>
                  <a
                    href={`https://wa.me/${listing.vendorWhatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi! I'm interested in "${listing.name}". Can you share more details?`)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-sm bg-[#25D366] text-white hover:bg-[#20bd5a] transition-colors"
                  >
                    <MessageCircle size={16} />
                    {isMl ? 'WhatsApp-ൽ ബന്ധപ്പെടൂ' : 'Chat on WhatsApp'}
                  </a>
                  {listing.vendorPhone && (
                    <a
                      href={`tel:${listing.vendorPhone}`}
                      className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-sm border-2 border-kerala-green text-kerala-green hover:bg-kerala-green hover:text-white transition-colors"
                    >
                      <Phone size={16} />
                      {isMl ? 'കോൾ ചെയ്യൂ' : 'Call Vendor'}
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Save & Share */}
            <div className="flex gap-3">
              <button
                onClick={() => setSaved(s => !s)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${saved ? 'border-red-400 text-red-500 bg-red-50' : 'border-gray-200 text-gray-500 hover:border-red-300'}`}
              >
                <Heart size={15} className={saved ? 'fill-red-500 text-red-500' : ''} />
                {saved ? (isMl ? 'സേവ് ചെയ്തു' : 'Saved') : (isMl ? 'സേവ് ചെയ്യൂ' : 'Save')}
              </button>
              <button
                onClick={() => {
                  if (typeof navigator !== 'undefined' && navigator.share) {
                    navigator.share({ title: listing.name, url: window.location.href })
                  }
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-500 hover:border-kerala-green text-sm font-semibold transition-all"
              >
                <Share2 size={15} />
                {isMl ? 'ഷെയർ ചെയ്യൂ' : 'Share'}
              </button>
            </div>

            {/* Trust signals */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { icon: Truck, label: isMl ? 'ഡെലിവറി' : 'Fast Delivery', sub: isMl ? 'UAE-ൽ' : 'Across UAE' },
                { icon: Shield, label: isMl ? 'വെരിഫൈഡ്' : 'Verified', sub: isMl ? 'ആധികാരിക' : 'Authentic vendor' },
                { icon: MessageCircle, label: isMl ? 'സപ്പോർട്ട്' : 'Support', sub: isMl ? 'WhatsApp' : 'via WhatsApp' },
              ].map((t, i) => (
                <div key={i} className="text-center p-3 bg-kerala-cream rounded-xl border border-gray-100">
                  <t.icon size={18} className="text-kerala-green mx-auto mb-1" />
                  <p className="text-xs font-semibold text-kerala-deep">{t.label}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{t.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RELATED LISTINGS ── */}
        {related.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-bold text-kerala-deep">
                {isMl ? 'സമാന ഉൽപ്പന്നങ്ങൾ' : 'You May Also Like'}
              </h2>
              <Link href={`/${locale}/shop`} className="text-sm text-kerala-green font-semibold hover:underline flex items-center gap-1">
                {isMl ? 'എല്ലാം കാണൂ' : 'View All'} <ChevronRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {related.map(rel => {
                const relMeta = LISTING_TYPE_META[rel.listingType]
                return (
                  <Link
                    key={rel.id}
                    href={`/${locale}/company/${rel.vendorSlug}/shop/${rel.id}`}
                    className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg hover:border-kerala-green/20 transition-all"
                  >
                    <div className="relative h-36 overflow-hidden">
                      <Image src={rel.image} alt={rel.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 50vw, 25vw" />
                      <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${relMeta.color}`}>
                        {relMeta.label}
                      </span>
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-semibold text-kerala-deep line-clamp-2 group-hover:text-kerala-green transition-colors">
                        {isMl ? rel.nameMl : rel.name}
                      </p>
                      <p className="text-kerala-green font-bold text-sm mt-1">
                        {rel.price > 0 ? `AED ${rel.price}` : (isMl ? 'ക്വോട്ട്' : 'Quote')}
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* Back to shop */}
        <div className="mt-8">
          <Link href={`/${locale}/shop`} className="flex items-center gap-2 text-sm text-gray-500 hover:text-kerala-green transition-colors font-medium w-fit">
            <ArrowLeft size={16} /> {isMl ? 'ഷോപ്പിലേക്ക് മടങ്ങൂ' : 'Back to Shop'}
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  )
}
