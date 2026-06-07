'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { ShoppingCart, Star, ArrowRight, Truck, Shield, RefreshCw, MessageCircle, Calendar, FileText, Zap, BadgeCheck } from 'lucide-react'
import { getMarketplaceListings, LISTING_TYPE_META, type MarketplaceListing } from '@/lib/shop'

const badges = [
  { icon: Truck,     text: 'Free delivery above AED 100', textMl: 'AED 100 വരെ സൗജന്യ ഡെലിവറി' },
  { icon: Shield,    text: 'Verified Malayali businesses', textMl: 'പരിശോധിച്ച മലയാളി ബിസിനസ്സുകൾ' },
  { icon: RefreshCw, text: 'Products & services in one place', textMl: 'ഒരിടത്ത് ഉൽപ്പന്നങ്ങളും സേവനങ്ങളും' },
]

const SBASE = { listing_id: null, vendor_name_ml: null, vendor_logo_url: null, vendor_emirate_ml: null, vendor_verified: true, vendor_whatsapp: null, vendor_phone: null, name_ml: null, description: null, description_ml: null, category_ml: null, original_price: null, currency: 'AED', unit: null, unit_ml: null, images: [], rating_avg: 4.5, review_count: 12, is_active: true, is_featured: true, is_bestseller: false, duration: null, slots: [], tags: [], tags_ml: [], sort_order: 0, created_at: new Date().toISOString() }
const PLACEHOLDER_SHOP: MarketplaceListing[] = [
  { ...SBASE, id: 'ps1', vendor_slug: 'kerala-kitchen', vendor_name: 'Kerala Kitchen', vendor_emirate: 'Dubai', listing_type: 'product', name: 'Kerala Sadya Meal Box', category: 'Food', price: 45, image_url: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=600&q=80' },
  { ...SBASE, id: 'ps2', vendor_slug: 'glow-beauty', vendor_name: 'Glow Beauty', vendor_emirate: 'Dubai', listing_type: 'appointment', name: 'Bridal Makeup Package', category: 'Beauty', price: 350, original_price: 500, image_url: 'https://images.unsplash.com/photo-1560066984-138daaa7b78a?w=600&q=80', is_bestseller: true },
  { ...SBASE, id: 'ps3', vendor_slug: 'gulf-travels', vendor_name: 'Gulf Travels', vendor_emirate: 'Abu Dhabi', listing_type: 'product', name: 'Kerala Tour Package 7 Days', category: 'Travel', price: 1200, image_url: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=80' },
  { ...SBASE, id: 'ps4', vendor_slug: 'techfix-uae', vendor_name: 'TechFix UAE', vendor_emirate: 'Sharjah', listing_type: 'direct_service', name: 'Laptop/Phone Repair Service', category: 'Technology', price: 99, image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80' },
  { ...SBASE, id: 'ps5', vendor_slug: 'mallu-bakery', vendor_name: 'Mallu Bakery', vendor_emirate: 'Dubai', listing_type: 'product', name: 'Kerala Banana Chips 500g', category: 'Food', price: 18, image_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80', is_bestseller: true },
  { ...SBASE, id: 'ps6', vendor_slug: 'ayur-wellness', vendor_name: 'Ayur Wellness', vendor_emirate: 'Dubai', listing_type: 'appointment', name: 'Ayurvedic Full Body Massage', category: 'Healthcare', price: 180, original_price: 250, image_url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80' },
  { ...SBASE, id: 'ps7', vendor_slug: 'kerala-textiles', vendor_name: 'Kerala Textiles', vendor_emirate: 'Ajman', listing_type: 'product', name: 'Handloom Kasavu Saree', category: 'Fashion', price: 220, image_url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80' },
  { ...SBASE, id: 'ps8', vendor_slug: 'home-repairs-uae', vendor_name: 'Home Repairs UAE', vendor_emirate: 'Dubai', listing_type: 'quote', name: 'AC Service & Maintenance', category: 'Home Services', price: 120, image_url: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&q=80' },
]

export default function ShopSection() {
  const locale = useLocale()
  const isMl = locale === 'ml'

  const [listings, setListings] = useState<MarketplaceListing[]>([])

  useEffect(() => {
    getMarketplaceListings({ featured: true, limit: 8 }).then(data => {
      setListings(data.length > 0 ? data : PLACEHOLDER_SHOP)
    })
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
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={listing.image_url}
                      alt={listing.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={listing.vendor_logo_url} alt="" className="absolute inset-0 w-full h-full object-cover" />
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
