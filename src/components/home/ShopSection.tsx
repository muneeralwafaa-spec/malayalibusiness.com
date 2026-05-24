'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { ShoppingCart, Star, ArrowRight, Truck, Shield, RefreshCw, MessageCircle, Calendar, FileText, Zap, BadgeCheck } from 'lucide-react'
import { getMarketplaceListings, LISTING_TYPE_META, type MarketplaceListing } from '@/lib/shop'

const badges = [
  { icon: Truck,     text: 'Free delivery above AED 100', textMl: 'AED 100 വരെ സൗജന്യ ഡെലിവറി' },
  { icon: Shield,    text: 'Verified Malayali businesses', textMl: 'പരിശോധിച്ച മലയാളി ബിസിനസ്സുകൾ' },
  { icon: RefreshCw, text: 'Products & services in one place', textMl: 'ഒരിടത്ത് ഉൽപ്പന്നങ്ങളും സേവനങ്ങളും' },
]

export default function ShopSection() {
  const locale = useLocale()
  const isMl = locale === 'ml'

  const [listings, setListings] = useState<MarketplaceListing[]>([])

  useEffect(() => {
    getMarketplaceListings({ featured: true, limit: 8 }).then(setListings)
  }, [])

  if (listings.length === 0) return null

  return (
    <section className="bg-kerala-cream py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <p className="text-kerala-orange font-semibold text-sm uppercase tracking-widest mb-2">
              {isMl ? 'മൾട്ടി-വെൻഡർ ഷോപ്പ്' : 'Multi-Vendor Shop'}
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-semibold text-kerala-deep">
              {isMl ? 'മലയാളി ഉൽപ്പന്നങ്ങളും സേവനങ്ങളും' : 'Malayali Products & Services'}
            </h2>
            <p className="text-gray-500 mt-2">
              {isMl ? 'UAE-ലെ മലയാളി കമ്പനികളിൽ നിന്ന് നേരിട്ട് ഷോപ്പ് ചെയ്യൂ' : 'Shop directly from verified Malayali businesses across UAE'}
            </p>
          </div>
          <Link
            href={`/${locale}/shop`}
            className="flex items-center gap-2 bg-kerala-green text-white font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-kerala-deep transition-all whitespace-nowrap"
          >
            {isMl ? 'എല്ലാം കാണൂ' : 'Shop All'}
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {badges.map((b, i) => (
            <div key={i} className="flex items-center gap-2.5 bg-white rounded-xl p-3 shadow-sm">
              <b.icon size={18} className="text-kerala-green flex-shrink-0" />
              <span className="text-xs text-gray-600 font-medium">{isMl ? b.textMl : b.text}</span>
            </div>
          ))}
        </div>

        {/* Products & Services Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {listings.map((listing) => {
            const meta = LISTING_TYPE_META[listing.listing_type]
            const discount = listing.original_price ? Math.round((1 - listing.price / listing.original_price) * 100) : 0

            return (
              <div
                key={listing.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-gray-100 hover:border-kerala-green/20 transition-all flex flex-col"
              >
                {/* Image */}
                <Link href={`/${locale}/company/${listing.vendor_slug}/shop/${listing.id}`} className="relative h-44 overflow-hidden bg-gray-50 block">
                  {listing.image_url && (
                    <Image
                      src={listing.image_url}
                      alt={listing.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  )}
                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${meta.color}`}>
                      {meta.label}
                    </span>
                    {discount > 0 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500 text-white">-{discount}%</span>
                    )}
                    {listing.is_bestseller && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-kerala-gold text-white">🔥</span>
                    )}
                  </div>
                </Link>

                {/* Content */}
                <div className="p-3 flex flex-col flex-1">
                  {/* Vendor */}
                  <Link href={`/${locale}/company/${listing.vendor_slug}`} className="flex items-center gap-1.5 mb-1.5 group/v">
                    <div className="relative w-5 h-5 rounded-full overflow-hidden flex-shrink-0 bg-gray-100">
                      {listing.vendor_logo_url && (
                        <Image src={listing.vendor_logo_url} alt="" fill className="object-cover" />
                      )}
                    </div>
                    <span className="text-[10px] text-gray-400 group-hover/v:text-kerala-green transition-colors flex items-center gap-0.5 truncate">
                      {listing.vendor_name}
                      {listing.vendor_verified && <BadgeCheck size={10} className="text-kerala-green flex-shrink-0" />}
                    </span>
                  </Link>

                  <h3 className="font-medium text-kerala-deep text-xs leading-snug group-hover:text-kerala-green transition-colors mb-1.5 line-clamp-2 flex-1">
                    {isMl ? (listing.name_ml ?? listing.name) : listing.name}
                  </h3>

                  <div className="flex items-center gap-1 mb-1.5">
                    <div className="flex">
                      {[1,2,3,4,5].map((i) => (
                        <Star key={i} size={10} className={i <= Math.floor(listing.rating_avg) ? 'text-kerala-gold fill-kerala-gold' : 'text-gray-300'} />
                      ))}
                    </div>
                    <span className="text-gray-400 text-[10px]">({listing.review_count})</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-1.5 mb-2">
                    {listing.price > 0 ? (
                      <>
                        <span className="text-kerala-green font-bold text-sm">AED {listing.price}</span>
                        {listing.original_price && (
                          <span className="text-gray-300 text-xs line-through">AED {listing.original_price}</span>
                        )}
                      </>
                    ) : (
                      <span className="font-semibold text-orange-500 text-xs">
                        {isMl ? 'ക്വോട്ട് ലഭിക്കും' : 'Custom Quote'}
                      </span>
                    )}
                  </div>

                  {/* Action button */}
                  {listing.listing_type === 'contact_only' ? (
                    <a
                      href={`https://wa.me/${(listing.vendor_whatsapp ?? '').replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-[#25D366] text-white text-[11px] font-semibold py-2 rounded-xl text-center flex items-center justify-center gap-1.5 hover:bg-[#20bd5a] transition-colors"
                    >
                      <MessageCircle size={11} /> WhatsApp
                    </a>
                  ) : listing.listing_type === 'appointment' ? (
                    <Link
                      href={`/${locale}/company/${listing.vendor_slug}/shop/${listing.id}`}
                      className="w-full bg-blue-500 text-white text-[11px] font-semibold py-2 rounded-xl text-center flex items-center justify-center gap-1.5 hover:bg-blue-600 transition-colors"
                    >
                      <Calendar size={11} /> {isMl ? 'ബുക്ക് ചെയ്യൂ' : 'Book Slot'}
                    </Link>
                  ) : listing.listing_type === 'quote' ? (
                    <Link
                      href={`/${locale}/company/${listing.vendor_slug}/shop/${listing.id}`}
                      className="w-full bg-orange-500 text-white text-[11px] font-semibold py-2 rounded-xl text-center flex items-center justify-center gap-1.5 hover:bg-orange-600 transition-colors"
                    >
                      <FileText size={11} /> {isMl ? 'ക്വോട്ട്' : 'Get Quote'}
                    </Link>
                  ) : listing.listing_type === 'direct_service' ? (
                    <Link
                      href={`/${locale}/company/${listing.vendor_slug}/shop/${listing.id}`}
                      className="w-full bg-purple-500 text-white text-[11px] font-semibold py-2 rounded-xl text-center flex items-center justify-center gap-1.5 hover:bg-purple-600 transition-colors"
                    >
                      <Zap size={11} /> {isMl ? 'ഉടൻ വാങ്ങൂ' : 'Buy Now'}
                    </Link>
                  ) : (
                    <Link
                      href={`/${locale}/company/${listing.vendor_slug}/shop/${listing.id}`}
                      className="w-full bg-kerala-green text-white text-[11px] font-semibold py-2 rounded-xl text-center flex items-center justify-center gap-1.5 hover:bg-kerala-deep transition-colors"
                    >
                      <ShoppingCart size={11} /> {isMl ? 'കാർട്ടിൽ' : 'Add to Cart'}
                    </Link>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* View all CTA */}
        <div className="mt-8 text-center">
          <Link
            href={`/${locale}/shop`}
            className="inline-flex items-center gap-2 bg-kerala-deep text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-kerala-green transition-colors"
          >
            {isMl ? 'എല്ലാ ഉൽപ്പന്നങ്ങളും കാണൂ' : 'View All Products & Services'}
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}
