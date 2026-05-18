'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { ShoppingCart, Star, ArrowRight, Truck, Shield, RefreshCw } from 'lucide-react'

const products = [
  {
    id: 1,
    name: 'Malabar Gold Coconut Oil (1L)',
    nameMl: 'മലബാർ ഗോൾഡ് വെളിച്ചെണ്ണ (1 ലിറ്റർ)',
    price: 'AED 28',
    originalPrice: 'AED 35',
    rating: 4.8,
    reviews: 234,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80&auto=format&fit=crop',
    badge: 'Best Seller',
    badgeMl: 'ബെസ്റ്റ് സെല്ലർ',
    freeDelivery: true,
  },
  {
    id: 2,
    name: 'Kerala Banana Chips (500g)',
    nameMl: 'കേരള ബനാന ചിപ്സ് (500g)',
    price: 'AED 18',
    originalPrice: null,
    rating: 4.9,
    reviews: 189,
    image: 'https://images.unsplash.com/photo-1621447504864-d8686e12698c?w=400&q=80&auto=format&fit=crop',
    badge: 'Authentic',
    badgeMl: 'ആധികാരിക',
    freeDelivery: true,
  },
  {
    id: 3,
    name: 'Kasavu Saree — Traditional Kerala',
    nameMl: 'കസവ് സാരി — പരമ്പരാഗത കേരളം',
    price: 'AED 185',
    originalPrice: 'AED 240',
    rating: 4.7,
    reviews: 96,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=80&auto=format&fit=crop',
    badge: 'Handloom',
    badgeMl: 'ഹൻഡ്‌ലൂം',
    freeDelivery: false,
  },
  {
    id: 4,
    name: 'Kerala Spice Box Set',
    nameMl: 'കേരള മസാല സെറ്റ്',
    price: 'AED 45',
    originalPrice: 'AED 60',
    rating: 4.9,
    reviews: 312,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80&auto=format&fit=crop',
    badge: 'Gift Set',
    badgeMl: 'ഗിഫ്റ്റ് സെറ്റ്',
    freeDelivery: true,
  },
  {
    id: 5,
    name: 'Kalady Rose Water (200ml)',
    nameMl: 'കാലടി റോസ് വാട്ടർ (200ml)',
    price: 'AED 22',
    originalPrice: null,
    rating: 4.6,
    reviews: 145,
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&q=80&auto=format&fit=crop',
    badge: 'Organic',
    badgeMl: 'ഓർഗാനിക്',
    freeDelivery: false,
  },
  {
    id: 6,
    name: 'Thrissur Handmade Brass Lamp',
    nameMl: 'തൃശ്ശൂർ ഹൻഡ്‌മെയ്ഡ് ഓടു വിളക്ക്',
    price: 'AED 95',
    originalPrice: 'AED 120',
    rating: 4.8,
    reviews: 78,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80&auto=format&fit=crop',
    badge: 'Handcrafted',
    badgeMl: 'ഹൻഡ്‌ക്രാഫ്റ്റഡ്',
    freeDelivery: false,
  },
  {
    id: 7,
    name: 'Kerala Payasam Mix (3-pack)',
    nameMl: 'കേരള പായസം മിക്സ് (3-പായ്ക്ക്)',
    price: 'AED 35',
    originalPrice: null,
    rating: 4.7,
    reviews: 203,
    image: 'https://images.unsplash.com/photo-1606471191009-63994c53433b?w=400&q=80&auto=format&fit=crop',
    badge: 'Popular',
    badgeMl: 'ജനപ്രിയം',
    freeDelivery: true,
  },
  {
    id: 8,
    name: 'Mundu — Pure Cotton',
    nameMl: 'മുണ്ട് — ശുദ്ധ കോട്ടൺ',
    price: 'AED 55',
    originalPrice: 'AED 70',
    rating: 4.6,
    reviews: 134,
    image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=400&q=80&auto=format&fit=crop',
    badge: 'Traditional',
    badgeMl: 'പരമ്പരാഗതം',
    freeDelivery: false,
  },
]

const badges = [
  { icon: Truck, text: 'Free delivery above AED 100', textMl: 'AED 100 വരെ സൗജന്യ ഡെലിവറി' },
  { icon: Shield, text: 'Authentic Kerala products', textMl: 'ആധികാരിക കേരള ഉൽപ്പന്നങ്ങൾ' },
  { icon: RefreshCw, text: 'Easy 30-day returns', textMl: '30 ദിവസം റിട്ടേൺ' },
]

export default function ShopSection() {
  const locale = useLocale()
  const isMl = locale === 'ml'

  return (
    <section className="bg-kerala-cream py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <p className="text-kerala-orange font-semibold text-sm uppercase tracking-widest mb-2">
              {isMl ? 'ഷോപ്പ്' : 'Shop'}
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-semibold text-kerala-deep">
              {isMl ? 'കേരള പ്രൊഡക്ടുകൾ' : 'Kerala Products Shop'}
            </h2>
            <p className="text-gray-500 mt-2">
              {isMl ? 'ആധികാരിക കേരള ഉൽപ്പന്നങ്ങൾ നിങ്ങളുടെ യുഎഇ വീട്ടിൽ' : 'Authentic Kerala products delivered to your UAE doorstep'}
            </p>
          </div>
          <Link
            href={`/${locale}/shop`}
            className="flex items-center gap-2 bg-kerala-green text-white font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-kerala-green-light transition-all whitespace-nowrap"
          >
            {isMl ? 'എല്ലാ ഉൽപ്പന്നങ്ങളും' : 'Shop All Products'}
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

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/${locale}/shop/${product.id}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg card-hover border border-gray-100"
            >
              {/* Image */}
              <div className="relative h-44 overflow-hidden bg-gray-50">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  <span className="bg-kerala-green text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {isMl ? product.badgeMl : product.badge}
                  </span>
                  {product.freeDelivery && (
                    <span className="bg-kerala-gold text-white text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Truck size={10} />
                      {isMl ? 'സൗജന്യ ഡെലിവറി' : 'Free Delivery'}
                    </span>
                  )}
                </div>
                {/* Cart button on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                  <button className="bg-white text-kerala-green font-semibold text-xs px-3 py-2 rounded-xl shadow-lg flex items-center gap-1.5 hover:bg-kerala-green hover:text-white transition-colors">
                    <ShoppingCart size={14} />
                    {isMl ? 'കാർട്ടിൽ' : 'Add to Cart'}
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-3">
                <h3 className="font-medium text-kerala-deep text-xs leading-snug group-hover:text-kerala-green transition-colors mb-1.5 line-clamp-2">
                  {isMl ? product.nameMl : product.name}
                </h3>
                <div className="flex items-center gap-1 mb-1.5">
                  <div className="flex">
                    {[1,2,3,4,5].map((i) => (
                      <Star key={i} size={10} className={i <= Math.floor(product.rating) ? 'text-kerala-gold fill-kerala-gold' : 'text-gray-300'} />
                    ))}
                  </div>
                  <span className="text-gray-400 text-xs">({product.reviews})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-kerala-green font-bold text-sm">{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-gray-400 text-xs line-through">{product.originalPrice}</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
