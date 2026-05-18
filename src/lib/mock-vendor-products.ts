export type ListingType = 'product' | 'appointment' | 'quote' | 'direct_service' | 'contact_only'
export type PaymentType = 'stripe' | 'whatsapp_cod' | 'both'

export interface VendorListing {
  id: string
  vendorSlug: string
  vendorName: string
  vendorNameMl: string
  vendorLogo: string
  vendorEmirate: string
  vendorEmirati: string
  vendorVerified: boolean
  vendorWhatsapp: string
  vendorPhone: string

  listingType: ListingType
  paymentType: PaymentType

  name: string
  nameMl: string
  description: string
  descriptionMl: string
  category: string
  categoryMl: string
  price: number
  originalPrice?: number
  currency: string
  unit?: string        // e.g. 'per session', 'per kg', 'per hour'
  unitMl?: string

  image: string
  images: string[]

  rating: number
  reviews: number
  inStock: boolean
  featured: boolean
  bestseller: boolean

  // appointment-specific
  duration?: string    // e.g. '60 min'
  slots?: string[]     // available time slots

  // service tags
  tags: string[]
  tagsMl: string[]
}

const VENDORS = {
  keralakitchen: {
    vendorSlug: 'kerala-kitchen-dubai',
    vendorName: 'Kerala Kitchen Dubai',
    vendorNameMl: 'കേരള കിച്ചൺ ദുബായ്',
    vendorLogo: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=100&q=80',
    vendorEmirate: 'Dubai',
    vendorEmirati: 'ദുബായ്',
    vendorVerified: true,
    vendorWhatsapp: '+971501234567',
    vendorPhone: '+971501234567',
  },
  menonhealth: {
    vendorSlug: 'menon-health-clinic-sharjah',
    vendorName: 'Menon Health Clinic',
    vendorNameMl: 'മേനോൻ ഹെൽത്ത് ക്ലിനിക്',
    vendorLogo: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=100&q=80',
    vendorEmirate: 'Sharjah',
    vendorEmirati: 'ഷാർജ',
    vendorVerified: true,
    vendorWhatsapp: '+971555678901',
    vendorPhone: '+971555678901',
  },
  ashabeauty: {
    vendorSlug: 'asha-beauty-salon-ajman',
    vendorName: 'Asha Beauty Salon',
    vendorNameMl: 'ആശ ബ്യൂട്ടി സലോൺ',
    vendorLogo: 'https://images.unsplash.com/photo-1560066984-138daaa0c1c0?w=100&q=80',
    vendorEmirate: 'Ajman',
    vendorEmirati: 'അജ്മാൻ',
    vendorVerified: true,
    vendorWhatsapp: '+971506789012',
    vendorPhone: '+971506789012',
  },
  techmalayali: {
    vendorSlug: 'techmalayali-it-solutions',
    vendorName: 'TechMalayali IT Solutions',
    vendorNameMl: 'ടെക് മലയാളി ഐടി',
    vendorLogo: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d4?w=100&q=80',
    vendorEmirate: 'Dubai',
    vendorEmirati: 'ദുബായ്',
    vendorVerified: true,
    vendorWhatsapp: '+971521234599',
    vendorPhone: '+971521234599',
  },
  nairlegal: {
    vendorSlug: 'nair-associates-legal',
    vendorName: 'Nair & Associates Legal',
    vendorNameMl: 'നായർ & അസോസിയേറ്റ്സ്',
    vendorLogo: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=100&q=80',
    vendorEmirate: 'Abu Dhabi',
    vendorEmirati: 'അബുദാബി',
    vendorVerified: true,
    vendorWhatsapp: '+971554567890',
    vendorPhone: '+971044567890',
  },
}

export const vendorListings: VendorListing[] = [
  // ── Kerala Kitchen — Products (buy directly) ────────────────────────────────
  {
    id: 'kk-biryani-pack',
    ...VENDORS.keralakitchen,
    listingType: 'product',
    paymentType: 'both',
    name: 'Malabar Biryani Meal Pack (2 pax)',
    nameMl: 'മലബാർ ബിരിയാണി മീൽ പാക്ക് (2 പേർക്ക്)',
    description: 'Authentic Malabar-style chicken biryani with raita, pickle and pappadam. Flash-frozen, ready to heat. Serves 2.',
    descriptionMl: 'ആധികാരിക മലബാർ ചിക്കൻ ബിരിയാണി, റൈത്ത, അച്ചാർ, പപ്പടം സഹിതം. 2 പേർക്ക്.',
    category: 'Food & Grocery',
    categoryMl: 'ഭക്ഷണം',
    price: 55,
    originalPrice: 68,
    currency: 'AED',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=80'],
    rating: 4.9, reviews: 312, inStock: true, featured: true, bestseller: true,
    tags: ['Biryani', 'Frozen', 'Ready to Heat'], tagsMl: ['ബിരിയാണി', 'ഫ്രോസൺ'],
  },
  {
    id: 'kk-sadya-pack',
    ...VENDORS.keralakitchen,
    listingType: 'product',
    paymentType: 'both',
    name: 'Kerala Sadya Box (10 items)',
    nameMl: 'കേരള സദ്യ ബോക്സ് (10 ഇനം)',
    description: 'Full Kerala Sadya: rice, sambar, rasam, avial, olan, thoran, payasam and more. Perfect for Onam or any celebration.',
    descriptionMl: 'ചോറ്, സാമ്പാർ, രസം, അവിയൽ, ഓലൻ, തോരൻ, പായസം ഉൾപ്പെടെ 10 ഇനം. ഓണത്തിന് ഏറ്റവും അനുയോജ്യം.',
    category: 'Food & Grocery',
    categoryMl: 'ഭക്ഷണം',
    price: 120,
    currency: 'AED',
    image: 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=600&q=80&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1567337710282-00832b415979?w=600&q=80'],
    rating: 4.8, reviews: 189, inStock: true, featured: true, bestseller: false,
    tags: ['Sadya', 'Onam', 'Traditional'], tagsMl: ['സദ്യ', 'ഓണം'],
  },
  {
    id: 'kk-catering',
    ...VENDORS.keralakitchen,
    listingType: 'quote',
    paymentType: 'whatsapp_cod',
    name: 'Event Catering Package',
    nameMl: 'ഇവന്റ് കാറ്ററിംഗ് പാക്കേജ്',
    description: 'Full Kerala catering for weddings, corporate events, and celebrations. Menu customization available. Serves 20–500+ guests.',
    descriptionMl: 'വിവാഹം, കോർപ്പറേറ്റ് ഇവന്റ്, ആഘോഷങ്ങൾക്ക്. 20–500+ പേർക്ക് കേരള കാറ്ററിംഗ്.',
    category: 'Services',
    categoryMl: 'സേവനം',
    price: 0,
    currency: 'AED',
    unit: 'Custom quote',
    unitMl: 'ക്വോട്ട് ലഭിക്കും',
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=600&q=80&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1555244162-803834f70033?w=600&q=80'],
    rating: 4.7, reviews: 56, inStock: true, featured: false, bestseller: false,
    tags: ['Catering', 'Events', 'Wedding'], tagsMl: ['കാറ്ററിംഗ്', 'വിവാഹം'],
  },

  // ── Menon Health Clinic — Appointments ──────────────────────────────────────
  {
    id: 'mh-gp-consult',
    ...VENDORS.menonhealth,
    listingType: 'appointment',
    paymentType: 'both',
    name: 'GP Consultation',
    nameMl: 'GP കൺസൾട്ടേഷൻ',
    description: 'General physician consultation with Malayalam-speaking doctor. Includes basic health check and prescription.',
    descriptionMl: 'മലയാളം സംസാരിക്കുന്ന ഡോക്ടറുമായി GP കൺസൾട്ടേഷൻ. അടിസ്ഥാന ഹെൽത്ത് ചെക്ക്, പ്രെസ്ക്രിപ്ഷൻ.',
    category: 'Healthcare',
    categoryMl: 'ആരോഗ്യം',
    price: 120,
    currency: 'AED',
    unit: 'per session',
    unitMl: 'ഒരു സെഷൻ',
    duration: '30 min',
    slots: ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'],
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=80&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=80'],
    rating: 4.9, reviews: 428, inStock: true, featured: true, bestseller: true,
    tags: ['Doctor', 'GP', 'Consultation', 'Malayalam'], tagsMl: ['ഡോക്ടർ', 'GP'],
  },
  {
    id: 'mh-dental',
    ...VENDORS.menonhealth,
    listingType: 'appointment',
    paymentType: 'both',
    name: 'Dental Checkup & Cleaning',
    nameMl: 'ഡെന്റൽ ചെക്കപ്പ് & ക്ലീനിംഗ്',
    description: 'Full dental examination with professional scaling and cleaning. X-ray included.',
    descriptionMl: 'ദന്ത പരിശോധന, ക്ലീനിംഗ്, X-ray ഉൾപ്പെടെ.',
    category: 'Healthcare',
    categoryMl: 'ആരോഗ്യം',
    price: 250,
    currency: 'AED',
    unit: 'per session',
    unitMl: 'ഒരു സെഷൻ',
    duration: '45 min',
    slots: ['9:30 AM', '11:00 AM', '2:30 PM', '4:00 PM'],
    image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600&q=80&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600&q=80'],
    rating: 4.7, reviews: 203, inStock: true, featured: false, bestseller: false,
    tags: ['Dental', 'Teeth', 'Cleaning'], tagsMl: ['ദന്തം', 'ക്ലീനിംഗ്'],
  },
  {
    id: 'mh-health-package',
    ...VENDORS.menonhealth,
    listingType: 'direct_service',
    paymentType: 'both',
    name: 'Annual Family Health Package',
    nameMl: 'വാർഷിക ഫാമിലി ഹെൽത്ത് പാക്കേജ്',
    description: 'Comprehensive health package for 4 family members: blood tests, ECG, X-ray, doctor consultation, and health report.',
    descriptionMl: '4 കുടുംബാംഗങ്ങൾക്ക്: ബ്ലഡ് ടെസ്റ്റ്, ECG, X-ray, ഡോക്ടർ കൺസൾട്ടേഷൻ.',
    category: 'Healthcare',
    categoryMl: 'ആരോഗ്യം',
    price: 799,
    originalPrice: 1200,
    currency: 'AED',
    image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=600&q=80&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=600&q=80'],
    rating: 4.8, reviews: 87, inStock: true, featured: true, bestseller: true,
    tags: ['Health Package', 'Family', 'Checkup'], tagsMl: ['ഹെൽത്ത് പാക്കേജ്', 'ഫാമിലി'],
  },

  // ── Asha Beauty Salon — Appointments ────────────────────────────────────────
  {
    id: 'ab-bridal',
    ...VENDORS.ashabeauty,
    listingType: 'appointment',
    paymentType: 'both',
    name: 'Kerala Bridal Package',
    nameMl: 'കേരള ബ്രൈഡൽ പാക്കേജ്',
    description: 'Full bridal makeover: Kerala Ayurvedic facial, silk saree draping, bridal mehendi, hair styling, and makeup.',
    descriptionMl: 'കേരള ആയുർവേദ ഫേഷ്യൽ, സാരി ഉടുപ്പ്, മെഹന്തി, ഹെയർ & മേക്കപ്പ് ഉൾപ്പെടെ.',
    category: 'Beauty & Wellness',
    categoryMl: 'സൗന്ദര്യം',
    price: 850,
    originalPrice: 1100,
    currency: 'AED',
    unit: 'full day',
    unitMl: 'ഒരു ദിവസം',
    duration: '5–6 hours',
    slots: ['8:00 AM', '9:00 AM'],
    image: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=600&q=80&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=600&q=80', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80'],
    rating: 5.0, reviews: 94, inStock: true, featured: true, bestseller: true,
    tags: ['Bridal', 'Mehendi', 'Makeup', 'Kerala'], tagsMl: ['ബ്രൈഡൽ', 'മെഹന്തി'],
  },
  {
    id: 'ab-facial',
    ...VENDORS.ashabeauty,
    listingType: 'appointment',
    paymentType: 'both',
    name: 'Kerala Ayurvedic Facial',
    nameMl: 'കേരള ആയുർവേദ ഫേഷ്യൽ',
    description: 'Rejuvenating Ayurvedic facial using natural herbal ingredients from Kerala. Suitable for all skin types.',
    descriptionMl: 'കേരള ആയുർവേദ ഹെർബൽ ഘടകങ്ങൾ ഉപയോഗിച്ചുള്ള ഫേഷ്യൽ. എല്ലാ ത്വക്ക് തരത്തിനും.',
    category: 'Beauty & Wellness',
    categoryMl: 'സൗന്ദര്യം',
    price: 180,
    currency: 'AED',
    unit: 'per session',
    unitMl: 'ഒരു സെഷൻ',
    duration: '60 min',
    slots: ['10:00 AM', '11:30 AM', '1:00 PM', '3:00 PM', '5:00 PM'],
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80'],
    rating: 4.8, reviews: 167, inStock: true, featured: false, bestseller: true,
    tags: ['Facial', 'Ayurvedic', 'Skincare'], tagsMl: ['ഫേഷ്യൽ', 'ആയുർവേദ'],
  },
  {
    id: 'ab-mehendi',
    ...VENDORS.ashabeauty,
    listingType: 'contact_only',
    paymentType: 'whatsapp_cod',
    name: 'Custom Mehendi Design',
    nameMl: 'കസ്റ്റം മെഹന്തി ഡിസൈൻ',
    description: 'Traditional and Arabic mehendi designs for hands and feet. Home visits available for bridal parties.',
    descriptionMl: 'ട്രഡീഷണൽ, അറബി മെഹന്തി ഡിസൈൻ. ബ്രൈഡൽ ഗ്രൂപ്പിന് ഹോം വിസിറ്റ്.',
    category: 'Beauty & Wellness',
    categoryMl: 'സൗന്ദര്യം',
    price: 120,
    currency: 'AED',
    unit: 'from',
    unitMl: 'മുതൽ',
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80'],
    rating: 4.9, reviews: 78, inStock: true, featured: false, bestseller: false,
    tags: ['Mehendi', 'Henna', 'Bridal'], tagsMl: ['മെഹന്തി', 'ഹെന്ന'],
  },

  // ── TechMalayali — Services ──────────────────────────────────────────────────
  {
    id: 'tm-website',
    ...VENDORS.techmalayali,
    listingType: 'quote',
    paymentType: 'both',
    name: 'Business Website Development',
    nameMl: 'ബിസിനസ് വെബ്സൈറ്റ് ഡെവലപ്മെന്റ്',
    description: '5-page professional website with mobile optimization, SEO setup, contact form, WhatsApp integration. Delivered in 2 weeks.',
    descriptionMl: '5-പേജ് പ്രൊഫഷണൽ വെബ്സൈറ്റ്, മൊബൈൽ, SEO, WhatsApp. 2 ആഴ്ചയ്ക്കുള്ളിൽ.',
    category: 'Technology',
    categoryMl: 'ടെക്നോളജി',
    price: 2500,
    currency: 'AED',
    unit: 'from',
    unitMl: 'മുതൽ',
    image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&q=80&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&q=80'],
    rating: 4.9, reviews: 43, inStock: true, featured: true, bestseller: true,
    tags: ['Website', 'Web Dev', 'SEO'], tagsMl: ['വെബ്സൈറ്റ്', 'SEO'],
  },
  {
    id: 'tm-app',
    ...VENDORS.techmalayali,
    listingType: 'quote',
    paymentType: 'both',
    name: 'Mobile App Development',
    nameMl: 'മൊബൈൽ ആപ്പ് ഡെവലപ്മെന്റ്',
    description: 'iOS & Android app development for your business. UI/UX design, API integration, app store submission included.',
    descriptionMl: 'iOS & Android ആപ്പ്. UI/UX ഡിസൈൻ, API, ആപ്പ് സ്റ്റോർ സബ്മിഷൻ.',
    category: 'Technology',
    categoryMl: 'ടെക്നോളജി',
    price: 8000,
    currency: 'AED',
    unit: 'from',
    unitMl: 'മുതൽ',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80'],
    rating: 4.8, reviews: 28, inStock: true, featured: false, bestseller: false,
    tags: ['App', 'iOS', 'Android'], tagsMl: ['ആപ്പ്', 'iOS'],
  },
  {
    id: 'tm-seo',
    ...VENDORS.techmalayali,
    listingType: 'direct_service',
    paymentType: 'both',
    name: 'Monthly SEO & Social Media Package',
    nameMl: 'മാസ SEO & സോഷ്യൽ മീഡിയ പാക്കേജ്',
    description: 'Monthly SEO optimization, Google My Business management, Instagram + Facebook content (12 posts/month), monthly report.',
    descriptionMl: 'SEO, Google My Business, Instagram + Facebook (12 പോസ്റ്റ്/മാസം), റിപ്പോർട്ട്.',
    category: 'Technology',
    categoryMl: 'ടെക്നോളജി',
    price: 1200,
    currency: 'AED',
    unit: 'per month',
    unitMl: 'പ്രതിമാസം',
    image: 'https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=600&q=80&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=600&q=80'],
    rating: 4.7, reviews: 61, inStock: true, featured: true, bestseller: false,
    tags: ['SEO', 'Social Media', 'Marketing'], tagsMl: ['SEO', 'സോഷ്യൽ മീഡിയ'],
  },

  // ── Nair Legal — Services ────────────────────────────────────────────────────
  {
    id: 'nl-visa',
    ...VENDORS.nairlegal,
    listingType: 'appointment',
    paymentType: 'both',
    name: 'Visa Consultation (Golden Visa / Employment)',
    nameMl: 'വിസ കൺസൾട്ടേഷൻ (ഗോൾഡൻ വിസ / എംപ്ലോയ്‌മെന്റ്)',
    description: '1-hour consultation with experienced UAE visa specialist. Covers Golden Visa eligibility, family visa, and employment visa.',
    descriptionMl: 'UAE വിസ സ്പെഷ്യലിസ്റ്റുമായി 1 മണിക്കൂർ കൺസൾട്ടേഷൻ. ഗോൾഡൻ വിസ, ഫാമിലി, എംപ്ലോയ്‌മെന്റ്.',
    category: 'Legal & Finance',
    categoryMl: 'നിയമം & ഫിനാൻസ്',
    price: 350,
    currency: 'AED',
    unit: 'per consultation',
    unitMl: 'ഒരു കൺസൾട്ടേഷൻ',
    duration: '60 min',
    slots: ['10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'],
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&q=80&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&q=80'],
    rating: 4.9, reviews: 156, inStock: true, featured: true, bestseller: true,
    tags: ['Visa', 'Golden Visa', 'Legal'], tagsMl: ['വിസ', 'ഗോൾഡൻ വിസ'],
  },
  {
    id: 'nl-company',
    ...VENDORS.nairlegal,
    listingType: 'quote',
    paymentType: 'both',
    name: 'Company Formation in UAE',
    nameMl: 'UAE-ൽ കമ്പനി രൂപീകരണം',
    description: 'Complete company setup: LLC, Freezone, or Mainland. Includes trade license, MOA, bank account opening assistance.',
    descriptionMl: 'LLC, Freezone, Mainland — ട്രേഡ് ലൈസൻസ്, MOA, ബാങ്ക് അക്കൗണ്ട്.',
    category: 'Legal & Finance',
    categoryMl: 'നിയമം & ഫിനാൻസ്',
    price: 3500,
    currency: 'AED',
    unit: 'from',
    unitMl: 'മുതൽ',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80'],
    rating: 4.8, reviews: 72, inStock: true, featured: true, bestseller: false,
    tags: ['Company', 'Freezone', 'LLC', 'Business Setup'], tagsMl: ['കമ്പനി', 'ഫ്രീസോൺ'],
  },
]

export const LISTING_TYPE_META: Record<ListingType, { label: string; labelMl: string; color: string; icon: string; actionLabel: string; actionLabelMl: string }> = {
  product:        { label: 'Product',          labelMl: 'ഉൽപ്പന്നം',      color: 'bg-blue-100 text-blue-700',    icon: '📦', actionLabel: 'Add to Cart',       actionLabelMl: 'കാർട്ടിൽ ചേർക്കൂ' },
  appointment:    { label: 'Book Appointment', labelMl: 'അപ്പോയ്ന്റ്മെന്റ്', color: 'bg-green-100 text-green-700',  icon: '📅', actionLabel: 'Book Now',          actionLabelMl: 'ബുക്ക് ചെയ്യൂ' },
  quote:          { label: 'Get Quote',        labelMl: 'ക്വോട്ട് ലഭിക്കൂ', color: 'bg-orange-100 text-orange-700', icon: '💬', actionLabel: 'Request Quote',     actionLabelMl: 'ക്വോട്ട് ചോദിക്കൂ' },
  direct_service: { label: 'Service',          labelMl: 'സർവ്വീസ്',        color: 'bg-purple-100 text-purple-700', icon: '⚡', actionLabel: 'Buy Now',           actionLabelMl: 'ഇപ്പോൾ വാങ്ങൂ' },
  contact_only:   { label: 'Enquire',          labelMl: 'അന്വേഷിക്കൂ',    color: 'bg-gray-100 text-gray-600',    icon: '📞', actionLabel: 'Contact Vendor',    actionLabelMl: 'ബന്ധപ്പെടൂ' },
}
