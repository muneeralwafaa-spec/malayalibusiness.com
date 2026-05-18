'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { useParams } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { mockBusinesses } from '@/lib/mock-businesses'
import {
  ShoppingCart, Heart, Share2, MapPin, ChevronRight, Star,
  Truck, RotateCcw, ShieldCheck, CheckCircle, Plus, Minus,
  ZoomIn, BadgeCheck
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Product {
  id: string
  name: string
  nameMl: string
  price: number
  originalPrice: number
  description: string
  descriptionMl: string
  specs: string
  specsMl: string
  shipping: string
  shippingMl: string
  stock: 'In Stock' | 'Low Stock' | 'Out of Stock'
  stockMl: string
  photos: string[]
  category: string
  categoryMl: string
}

interface CustomerReview {
  id: number
  name: string
  nameMl: string
  avatar: string
  rating: number
  date: string
  text: string
  textMl: string
  verified: boolean
}

// ─── Mock products (same set as shop tab) ────────────────────────────────────

const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Premium Gift Hamper',
    nameMl: 'പ്രീമിയം ഗിഫ്റ്റ് ഹാംപർ',
    price: 299,
    originalPrice: 374,
    description: 'A luxurious curated gift hamper featuring handpicked Kerala specialities — artisan coconut oil, organic spices, traditional sweets, and more. Presented in an elegant handwoven basket, perfect for Onam, Eid, Diwali, or any celebration.',
    descriptionMl: 'കൈത്തറി ബാസ്കറ്റിൽ ഒരുക്കിയ ആഡംബര ഹാംപർ — ഓർഗാനിക് കേരള സ്പെഷ്യൽറ്റികൾ. ഓണം, ഈദ്, ദീപാവലി ഗിഫ്റ്റ്‌സ് ഏറ്റവും ഉചിതം.',
    specs: 'Contents: Coconut oil (250ml), Spice set (5 varieties), Kerala halwa (250g), Banana chips (200g), Handwoven basket. Net weight: 1.2kg. Shelf life: 6 months.',
    specsMl: 'ഉൾക്കൊള്ളുന്നവ: നാളികേര എണ്ണ (250ml), മസാല സെറ്റ് (5 ഇനം), കേരള ഹൽവ (250g), ചിപ്സ് (200g), കൈത്തറി ബാസ്കറ്റ്. ഭാരം: 1.2kg.',
    shipping: 'Free delivery within UAE (2–3 working days). Same-day delivery available in Dubai (order before 12PM). International shipping to India: AED 35 extra. Fragile packaging — handle with care.',
    shippingMl: 'UAE-ൽ ഉൾൽ സൗജന്യ ഡെലിവറി (2-3 ദിവസം). ദുബായ് സേം-ഡേ (12PM മുൻപ് ഓർഡർ). ഇന്ത്യ ഷിപ്പ്: AED 35 അധിക.',
    stock: 'In Stock',
    stockMl: 'സ്റ്റോക്കുണ്ട്',
    photos: [
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&q=80&auto=format&fit=crop',
    ],
    category: 'Gift Sets',
    categoryMl: 'ഗിഫ്റ്റ് സെറ്റ്',
  },
  {
    id: 'p2',
    name: 'Kerala Spice Collection',
    nameMl: 'കേരള മസാല ശേഖരം',
    price: 149,
    originalPrice: 186,
    description: 'Authentic Kerala spice collection sourced directly from Wayanad and Idukki — the spice capitals of India. Includes cardamom, pepper, cloves, cinnamon, nutmeg, and turmeric. Perfect for gifting or home use.',
    descriptionMl: 'വയനാട്, ഇടുക്കി തേയില ഫാമുകളിൽ നിന്ന് നേരിട്ട് — ഏലം, കുരുമുളക്, ഗ്രാമ്പൂ, ദാൽചിനി, ജാതിക്ക, മഞ്ഞൾ.',
    specs: 'Pack includes: Black Pepper (100g), Cardamom (50g), Cloves (50g), Cinnamon sticks (50g), Turmeric powder (100g), Nutmeg (30g). All organic certified.',
    specsMl: 'കറുത്ത കുരുമുളക് (100g), ഏലം (50g), ഗ്രാമ്പൂ (50g), ദാൽചിനി (50g), മഞ്ഞൾ (100g), ജാതിക്ക (30g). ഓർഗാനിക് സർട്ടിഫൈഡ്.',
    shipping: 'Standard delivery 2–4 working days. Free shipping on orders above AED 100.',
    shippingMl: 'സ്റ്റാൻഡേർഡ് ഡെലിവറി 2-4 ദിവസം. AED 100-ന് മുകളിൽ ഫ്രീ ഷിപ്പ്.',
    stock: 'In Stock',
    stockMl: 'സ്റ്റോക്കുണ്ട്',
    photos: [
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=600&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=600&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1574226516831-e1dff420e562?w=600&q=80&auto=format&fit=crop',
    ],
    category: 'Spices',
    categoryMl: 'മസാലകൾ',
  },
  {
    id: 'p3',
    name: 'Handwoven Kasavu Saree',
    nameMl: 'കൈത്തറി കസവ് സാരി',
    price: 1200,
    originalPrice: 1500,
    description: 'Traditional Kerala Kasavu saree handwoven by master weavers in Balaramapuram. Pure cotton with authentic golden zari border. Perfect for Onam, weddings, and traditional celebrations.',
    descriptionMl: 'ബലരാമപുരം മാസ്റ്റർ നെയ്ത്തുകാർ ഉണ്ടാക്കിയ ആധികാരിക കേരള കസവ് സാരി. ശുദ്ധ കോട്ടൺ, സ്വർണ്ണ നൂൽ ബോർഡർ.',
    specs: 'Material: 100% Pure Cotton. Length: 6.3m. Zari: Genuine golden zari. Width: 44 inches. Care: Dry clean recommended. Available in: Off-white, Cream.',
    specsMl: 'ശുദ്ധ കോട്ടൺ. നീളം: 6.3m. ഗോൾഡൻ സരി. വീതി: 44 ഇഞ്ച്. ഡ്രൈ ക്ലീൻ ശുപാർശ.',
    shipping: 'Carefully packed and dispatched within 2 days. Delivery in 3–5 working days.',
    shippingMl: '2 ദിവസത്തിനുള്ളിൽ ഡിസ്പാച്ച്. 3-5 ദിവസം ഡെലിവറി.',
    stock: 'Low Stock',
    stockMl: 'കുറഞ്ഞ സ്റ്റോക്ക്',
    photos: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=600&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583391733981-8498408ee4b6?w=600&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1594938298603-c8148c4b4463?w=600&q=80&auto=format&fit=crop',
    ],
    category: 'Clothing',
    categoryMl: 'വസ്ത്രം',
  },
  {
    id: 'p4',
    name: 'Coconut Oil 2L Premium',
    nameMl: 'നാളികേര എണ്ണ 2L പ്രീമിയം',
    price: 89,
    originalPrice: 111,
    description: 'Cold-pressed virgin coconut oil from Kerala\'s finest coconut groves. Rich in medium-chain fatty acids, perfect for cooking, hair care, and skin nourishment. No preservatives, 100% natural.',
    descriptionMl: 'കേരള തേങ്ങ ഫാമുകളിൽ നിന്ന് കോൾഡ്-പ്രസ്സ്ഡ് വർജ്ജിൻ കൊകോനട്ട് ഓയിൽ. 100% ശുദ്ധം, പ്രിസർവേറ്റീവ് ഇല്ല.',
    specs: 'Volume: 2 Liters. Type: Cold-pressed virgin. Smoke point: 177°C. Extraction: Traditional cold-press. Certified organic. Shelf life: 24 months.',
    specsMl: 'ശേഷി: 2 ലിറ്റർ. ടൈപ്പ്: കോൾഡ്-പ്രസ്സ്ഡ് വർജ്ജിൻ. ഓർഗാനിക് സർട്ടിഫൈഡ്. ഷെൽഫ്: 24 മാസം.',
    shipping: 'Standard UAE delivery: 2–3 days. Carefully sealed bottle.',
    shippingMl: 'UAE ഡെലിവറി: 2-3 ദിവസം. സ്ഥിരമായ സീൽഡ് ബോട്ടിൽ.',
    stock: 'In Stock',
    stockMl: 'സ്റ്റോക്കുണ്ട്',
    photos: [
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&q=80&auto=format&fit=crop',
    ],
    category: 'Food & Grocery',
    categoryMl: 'ഭക്ഷണം & ഗ്രോസറി',
  },
  {
    id: 'p5',
    name: 'Brass Lamp (Nilavilakku)',
    nameMl: 'നിലവിളക്ക് (പിച്ചള)',
    price: 550,
    originalPrice: 688,
    description: 'Traditional Kerala Nilavilakku (standing oil lamp) crafted from pure brass by Aranmula artisans. An auspicious symbol in every Kerala home, temple, and celebration. Height: 24 inches.',
    descriptionMl: 'ആരൺമുള കലാകാരന്മാർ ഉണ്ടാക്കിയ ശുദ്ധ പിച്ചള നിലവിളക്ക്. ഉയരം: 24 ഇഞ്ച്.',
    specs: 'Material: Pure brass (96% copper alloy). Height: 60cm (24 inches). Weight: 2.1kg. Finish: Hand-polished. Fuel: Coconut oil / sesame oil. Wicks: 5.',
    specsMl: 'ശുദ്ധ പിച്ചള. ഉയരം: 60cm. ഭാരം: 2.1kg. ഹാൻഡ്-പോളിഷ്. ഇന്ധനം: കൊകോ/എള്ളെണ്ണ. തിരി: 5.',
    shipping: 'Packed in foam-lined box. Express delivery available (AED 25 extra). Standard: 3–5 days.',
    shippingMl: 'ഫോം-ലൈൻഡ് ബോക്സ്. എക്സ്പ്രസ് ഡെലിവറി ലഭ്യം. സ്റ്റാൻഡേർഡ്: 3-5 ദിവസം.',
    stock: 'In Stock',
    stockMl: 'സ്റ്റോക്കുണ്ട്',
    photos: [
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=600&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=600&q=80&auto=format&fit=crop',
    ],
    category: 'Home & Decor',
    categoryMl: 'വീട് & ഡെക്കോർ',
  },
  {
    id: 'p6',
    name: 'Ayurvedic Face Pack',
    nameMl: 'ആയുർവേദ ഫേസ് പായ്ക്ക്',
    price: 75,
    originalPrice: 94,
    description: 'Traditional Kerala Ayurvedic face pack formulated from Multani mitti, turmeric, sandalwood, rose petals, and neem. Brightens skin, reduces blemishes, and leaves a natural glow. Suitable for all skin types.',
    descriptionMl: 'മൾട്ടാനി മട്ടി, മഞ്ഞൾ, ചന്ദനം, റോസ്, നീം ചേർന്ന ആയുർവേദ ഫേസ് പായ്ക്ക്. ഗ്ലോ, ബ്ലെമിഷ് കുറക്കൽ.',
    specs: 'Weight: 200g. Key ingredients: Multani mitti, Turmeric, Sandalwood powder, Rose petal extract, Neem. Usage: Apply 15 min, wash off. Paraben-free.',
    specsMl: 'ഭാരം: 200g. പ്രധാന ചേരുവ: മൾട്ടാനി, മഞ്ഞൾ, ചന്ദനം, റോസ്, നീം. ഉപയോഗം: 15 മിനിറ്റ്.',
    shipping: 'Ships in 2 days. Sealed airtight packaging. Free standard delivery in UAE.',
    shippingMl: '2 ദിവസത്തിൽ ഷിപ്പ്. UAE ഉൾൽ ഫ്രീ ഡെലിവറി.',
    stock: 'In Stock',
    stockMl: 'സ്റ്റോക്കുണ്ട്',
    photos: [
      'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1607008829749-c0f284a49fc4?w=600&q=80&auto=format&fit=crop',
    ],
    category: 'Beauty & Wellness',
    categoryMl: 'സൗന്ദര്യം & ആരോഗ്യം',
  },
  {
    id: 'p7',
    name: 'Kerala Banana Chips 500g',
    nameMl: 'കേരള കായ ചിപ്സ് 500g',
    price: 45,
    originalPrice: 56,
    description: 'Crispy, golden banana chips made from raw Nendran bananas using traditional Kerala coconut oil frying method. Lightly salted, no artificial flavours. A beloved Kerala snack loved worldwide.',
    descriptionMl: 'നേൻദ്രൻ ബനാന ഉപയോഗിച്ച് കൊകോ ഓയിലിൽ കരുകരുത്ത കായ ചിപ്സ്. ഉപ്പ് മാത്രം, ആർട്ടിഫിഷ്യൽ ഇല്ല.',
    specs: 'Weight: 500g. Ingredients: Nendran banana, Coconut oil, Salt. Allergens: None. Shelf life: 3 months. Storage: Cool dry place.',
    specsMl: 'ഭാരം: 500g. ചേരുവ: നേൻദ്രൻ, കൊകോ ഓയിൽ, ഉപ്പ്. ഷെൽഫ്: 3 മാസം.',
    shipping: 'Vacuum sealed for freshness. Delivery 2–3 days. Bundle discounts available.',
    shippingMl: 'വാക്വം സീൽഡ്. ഡെലിവറി 2-3 ദിവസം.',
    stock: 'In Stock',
    stockMl: 'സ്റ്റോക്കുണ്ട്',
    photos: [
      'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=600&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=600&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&q=80&auto=format&fit=crop',
    ],
    category: 'Food & Snacks',
    categoryMl: 'ഭക്ഷണം & സ്നാക്ക്',
  },
  {
    id: 'p8',
    name: 'Traditional Mundu (Men)',
    nameMl: 'പരമ്പരാഗത മുണ്ട്',
    price: 320,
    originalPrice: 400,
    description: 'Authentic Kerala Mundu for men, handwoven from fine cotton at Balaramapuram handloom clusters. Double-knit weave with traditional kasavu border. Comfortable, breathable, and elegant for all occasions.',
    descriptionMl: 'ബലരാമപുരം ഹാൻഡ്‌ലൂം ക്ലസ്റ്ററിൽ നെയ്ത ഫൈൻ കോട്ടൺ മുണ്ട്. ഡബിൾ-നിറ്, കസവ് ബോർഡർ.',
    specs: 'Material: Fine cotton (80s count). Length: 4.5m. Border: Kasavu (golden zari). Available sizes: 72, 74, 76, 78, 80, 82, 84 (waist in cm). Care: Hand wash, dry in shade.',
    specsMl: 'ഫൈൻ കോട്ടൺ. നീളം: 4.5m. കസവ് ബോർഡർ. ഹാൻഡ് വാഷ് ശുപാർശ.',
    shipping: 'Packed in traditional gift box. Delivery in UAE: 3–4 days.',
    shippingMl: 'ഗിഫ്റ്റ് ബോക്സ് പ്യാക്കിംഗ്. UAE ഡെലിവറി: 3-4 ദിവസം.',
    stock: 'Low Stock',
    stockMl: 'കുറഞ്ഞ സ്റ്റോക്ക്',
    photos: [
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=600&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583391733981-8498408ee4b6?w=600&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1594938298603-c8148c4b4463?w=600&q=80&auto=format&fit=crop',
    ],
    category: 'Clothing',
    categoryMl: 'വസ്ത്രം',
  },
]

const CUSTOMER_REVIEWS: CustomerReview[] = [
  {
    id: 1,
    name: 'Sreejith Varma',
    nameMl: 'ശ്രീജിത്ത് വർമ്മ',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&q=80',
    rating: 5,
    date: 'Oct 2025',
    text: 'Excellent quality product! Exactly as described. Packaging was superb and delivery was on time. My family in Kerala are already asking me to order more.',
    textMl: 'ഉൽകൃഷ്ട ഗുണനിലവാരം! വിവരണം പോലെ തന്നെ. പ്യാക്കേജ് വളരെ നല്ലത്, ഡെലിവറി സമയത്ത്. കേരളത്തിലെ കുടുംബം വീണ്ടും ഓർഡർ ചെയ്യാൻ ആവശ്യപ്പെടുന്നു.',
    verified: true,
  },
  {
    id: 2,
    name: 'Divya Krishnan',
    nameMl: 'ദിവ്യ കൃഷ്ണൻ',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&q=80',
    rating: 5,
    date: 'Sep 2025',
    text: 'Authentic Kerala product. The quality is genuine and you can feel the difference from supermarket brands. Will definitely re-order.',
    textMl: 'ആധികാരിക കേരള ഉൽപ്പന്നം. സൂപ്പർമാർക്കറ്റ് ബ്രാൻഡുകളിൽ നിന്ന് വ്യത്യാസം അനുഭവപ്പെടും. തീർച്ചയായും വീണ്ടും ഓർഡർ.',
    verified: true,
  },
  {
    id: 3,
    name: 'Anoop Nambiar',
    nameMl: 'അനൂപ് നമ്പ്യാർ',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&q=80',
    rating: 4,
    date: 'Sep 2025',
    text: 'Good product overall. Delivery was slightly delayed but customer service team was very helpful. Product quality is good value for money.',
    textMl: 'ആകെ നല്ല ഉൽപ്പന്നം. ഡെലിവറി ചെറുതായി വൈകി, പക്ഷേ കസ്റ്റമർ സർവ്വീസ് വളരെ സഹായകം. ഗുണനിലവാരം നല്ലത്.',
    verified: false,
  },
  {
    id: 4,
    name: 'Preethi Suresh',
    nameMl: 'പ്രീതി സുരേഷ്',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&q=80',
    rating: 5,
    date: 'Aug 2025',
    text: 'Gifted this to my parents for their anniversary. They absolutely loved it — said it reminded them of home. Beautiful packaging, will order again for every occasion.',
    textMl: 'അമ്മൂമ്മ-അപ്പൂപ്പന്മാർക്ക് വാർഷിക ദിന ഗിഫ്റ്റ്. ഇഷ്ടമായെന്ന് പറഞ്ഞു — വീടിനെ ഓർമ്മിപ്പിച്ചെന്ന്. ഓരോ ആഘോഷത്തിനും ഓർഡർ ചെയ്യും.',
    verified: true,
  },
]

// ─── Helper components ────────────────────────────────────────────────────────

function Stars({ r, size = 14 }: { r: number; size?: number }) {
  return (
    <span className="flex">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} style={{ width: size, height: size }}
          className={i <= Math.floor(r) ? 'fill-kerala-gold text-kerala-gold' : 'fill-gray-200 text-gray-200'}
          viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </span>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ProductPage() {
  const locale = useLocale()
  const isMl = locale === 'ml'
  const { slug, product: productId } = useParams<{ slug: string; product: string }>()

  const business = mockBusinesses.find(b => b.slug === slug || String(b.id) === slug) || mockBusinesses[0]
  const product = PRODUCTS.find(p => p.id === productId) || PRODUCTS[0]
  const relatedProducts = PRODUCTS.filter(p => p.id !== product.id).slice(0, 4)

  const [activePhoto, setActivePhoto] = useState(0)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [saved, setSaved] = useState(false)
  const [cartAdded, setCartAdded] = useState(false)
  const [activeDescTab, setActiveDescTab] = useState<'details' | 'specs' | 'shipping'>('details')
  const [zoomOpen, setZoomOpen] = useState(false)

  const SIZES = ['S', 'M', 'L']
  const COLORS = [
    { label: isMl ? 'സ്വർണ്ണ' : 'Gold', hex: '#c8922a' },
    { label: isMl ? 'പച്ച' : 'Green', hex: '#1a7a4a' },
  ]

  const discountPct = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)

  function handleAddToCart() {
    setCartAdded(true)
    setTimeout(() => setCartAdded(false), 2000)
  }

  const stockColor = product.stock === 'In Stock'
    ? 'text-emerald-600 bg-emerald-50'
    : product.stock === 'Low Stock'
      ? 'text-orange-600 bg-orange-50'
      : 'text-red-600 bg-red-50'

  const stockLabel = isMl ? product.stockMl : product.stock

  return (
    <main className="min-h-screen bg-kerala-cream">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-8 flex-wrap">
          <Link href={`/${locale}`} className="hover:text-kerala-green transition-colors">
            {isMl ? 'ഹോം' : 'Home'}
          </Link>
          <ChevronRight size={12} />
          <Link href={`/${locale}/directory`} className="hover:text-kerala-green transition-colors">
            {isMl ? 'ഡയറക്ടറി' : 'Directory'}
          </Link>
          <ChevronRight size={12} />
          <Link href={`/${locale}/company/${business.slug}`} className="hover:text-kerala-green transition-colors">
            {isMl ? business.nameMl : business.name}
          </Link>
          <ChevronRight size={12} />
          <Link href={`/${locale}/company/${business.slug}?tab=shop`} className="hover:text-kerala-green transition-colors">
            {isMl ? 'ഷോപ്പ്' : 'Shop'}
          </Link>
          <ChevronRight size={12} />
          <span className="text-kerala-deep font-medium line-clamp-1">{isMl ? product.nameMl : product.name}</span>
        </nav>

        {/* Main product grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">

          {/* ── Left: Photo section ─── */}
          <div>
            {/* Main photo */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm mb-3 cursor-zoom-in group"
              onClick={() => setZoomOpen(true)}>
              <Image
                src={product.photos[activePhoto]}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              <div className="absolute top-4 right-4 w-9 h-9 bg-white/80 backdrop-blur rounded-xl flex items-center justify-center shadow text-gray-600 hover:text-kerala-green transition-colors">
                <ZoomIn size={18} />
              </div>
              {product.stock !== 'In Stock' && (
                <div className={`absolute top-4 left-4 text-xs font-bold px-2.5 py-1 rounded-full ${stockColor}`}>
                  {stockLabel}
                </div>
              )}
            </div>

            {/* Thumbnail strip */}
            <div className="grid grid-cols-4 gap-2">
              {product.photos.map((photo, i) => (
                <button key={i} onClick={() => setActivePhoto(i)}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${activePhoto === i ? 'border-kerala-green shadow-md' : 'border-transparent hover:border-gray-300'}`}>
                  <Image src={photo} alt="" fill className="object-cover" sizes="100px" />
                </button>
              ))}
            </div>
          </div>

          {/* ── Right: Product info ─── */}
          <div className="flex flex-col">
            {/* Category chip + verified */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="text-xs font-semibold text-kerala-green uppercase tracking-wider">{isMl ? product.categoryMl : product.category}</span>
              {business.verified && (
                <span className="inline-flex items-center gap-1 text-xs text-kerala-green font-semibold">
                  <BadgeCheck size={13} />{isMl ? 'വെരിഫൈഡ് വിൽപ്പനക്കാർ' : 'Verified Seller'}
                </span>
              )}
            </div>

            {/* Name */}
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-kerala-deep mb-1">
              {isMl ? product.nameMl : product.name}
            </h1>
            {isMl && (
              <p className="text-sm text-gray-500 font-malayalam mb-3">{product.name}</p>
            )}

            {/* Rating row */}
            <div className="flex items-center gap-3 mb-4">
              <Stars r={4.8} size={15} />
              <span className="text-sm font-semibold text-kerala-deep">4.8</span>
              <span className="text-sm text-gray-400">({CUSTOMER_REVIEWS.length} {isMl ? 'റിവ്യൂ' : 'reviews'})</span>
            </div>

            {/* Price block */}
            <div className="flex items-end gap-3 mb-2">
              <span className="font-serif text-4xl font-bold text-kerala-deep">AED {product.price}</span>
              <span className="text-xl text-gray-400 line-through mb-1">AED {product.originalPrice}</span>
              <span className="mb-1 bg-red-500 text-white text-sm font-bold px-2.5 py-0.5 rounded-full">
                {discountPct}% OFF
              </span>
            </div>

            {/* Stock badge */}
            <div className="mb-5">
              <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${stockColor}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${product.stock === 'In Stock' ? 'bg-emerald-500' : product.stock === 'Low Stock' ? 'bg-orange-500' : 'bg-red-500'}`} />
                {stockLabel}
              </span>
            </div>

            {/* Variant selectors */}
            <div className="space-y-4 mb-6">
              {/* Size */}
              <div>
                <label className="text-sm font-semibold text-kerala-deep mb-2 block">
                  {isMl ? 'സൈസ്' : 'Size'}{selectedSize && <span className="text-kerala-green ml-2">: {selectedSize}</span>}
                </label>
                <div className="flex gap-2">
                  {SIZES.map(s => (
                    <button key={s} onClick={() => setSelectedSize(selectedSize === s ? null : s)}
                      className={`w-12 h-12 rounded-xl border-2 font-bold text-sm transition-all ${selectedSize === s ? 'border-kerala-green bg-kerala-green text-white' : 'border-gray-200 text-gray-600 hover:border-kerala-green hover:text-kerala-green'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div>
                <label className="text-sm font-semibold text-kerala-deep mb-2 block">
                  {isMl ? 'നിറം' : 'Color'}{selectedColor && <span className="text-kerala-green ml-2">: {selectedColor}</span>}
                </label>
                <div className="flex gap-2">
                  {COLORS.map(c => (
                    <button key={c.label} onClick={() => setSelectedColor(selectedColor === c.label ? null : c.label)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 font-medium text-sm transition-all ${selectedColor === c.label ? 'border-kerala-green bg-kerala-green/5' : 'border-gray-200 hover:border-kerala-green'}`}>
                      <span className="w-4 h-4 rounded-full flex-shrink-0 shadow-sm" style={{ backgroundColor: c.hex }} />
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quantity stepper */}
            <div className="flex items-center gap-4 mb-6">
              <label className="text-sm font-semibold text-kerala-deep">{isMl ? 'എണ്ണം' : 'Quantity'}</label>
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-11 h-11 flex items-center justify-center text-gray-600 hover:bg-kerala-green hover:text-white transition-colors">
                  <Minus size={15} />
                </button>
                <span className="w-12 text-center font-bold text-kerala-deep text-sm">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)}
                  className="w-11 h-11 flex items-center justify-center text-gray-600 hover:bg-kerala-green hover:text-white transition-colors">
                  <Plus size={15} />
                </button>
              </div>
              <span className="text-sm text-gray-500">
                {isMl ? 'ആകെ:' : 'Total:'} <span className="font-bold text-kerala-deep">AED {(product.price * quantity).toLocaleString()}</span>
              </span>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col gap-3 mb-6">
              <button onClick={handleAddToCart}
                className={`w-full flex items-center justify-center gap-2 font-bold py-4 rounded-xl transition-all text-base ${cartAdded ? 'bg-emerald-500 text-white' : 'bg-kerala-green hover:bg-kerala-green-light text-white'}`}>
                {cartAdded ? <CheckCircle size={20} /> : <ShoppingCart size={20} />}
                {cartAdded ? (isMl ? 'ചേർത്തു!' : 'Added to Cart!') : (isMl ? 'കാർട്ടിൽ ചേർക്കൂ' : 'Add to Cart')}
              </button>
              <button className="w-full flex items-center justify-center gap-2 bg-kerala-gold hover:bg-kerala-gold-light text-white font-bold py-4 rounded-xl transition-all text-base">
                {isMl ? 'ഇപ്പോൾ വാങ്ങൂ' : 'Buy Now'}
              </button>
            </div>

            {/* Save + Share */}
            <div className="flex gap-3 mb-6">
              <button onClick={() => setSaved(!saved)}
                className={`flex-1 flex items-center justify-center gap-2 border rounded-xl py-2.5 text-sm font-semibold transition-all ${saved ? 'border-kerala-red bg-kerala-red/5 text-kerala-red' : 'border-gray-200 text-gray-500 hover:border-kerala-red hover:text-kerala-red'}`}>
                <Heart size={16} className={saved ? 'fill-kerala-red' : ''} />
                {saved ? (isMl ? 'സേവ്ഡ്' : 'Saved') : (isMl ? 'സേവ് ചെയ്യൂ' : 'Save')}
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 border border-gray-200 text-gray-500 hover:border-kerala-green hover:text-kerala-green rounded-xl py-2.5 text-sm font-semibold transition-all">
                <Share2 size={16} />{isMl ? 'ഷെയർ' : 'Share'}
              </button>
            </div>

            {/* Sold by */}
            <div className="border border-gray-100 rounded-2xl p-4 bg-white">
              <p className="text-xs text-gray-500 mb-2">{isMl ? 'വിൽക്കുന്നത്:' : 'Sold by:'}</p>
              <Link href={`/${locale}/company/${business.slug}`} className="flex items-center gap-3 group">
                {business.logo ? (
                  <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-gray-200 flex-shrink-0">
                    <Image src={business.logo} alt="" fill className="object-cover" sizes="40px" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-kerala-green flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">{business.name.charAt(0)}</span>
                  </div>
                )}
                <div>
                  <p className="font-semibold text-kerala-deep text-sm group-hover:text-kerala-green transition-colors flex items-center gap-1">
                    {isMl ? business.nameMl : business.name}
                    {business.verified && <BadgeCheck size={13} className="text-kerala-green" />}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <MapPin size={10} />{isMl ? business.locationMl : business.location}
                  </p>
                </div>
                <ChevronRight size={16} className="text-gray-300 ml-auto group-hover:text-kerala-green transition-colors" />
              </Link>
            </div>

            {/* Trust signals */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              {[
                { icon: <Truck size={18} />, label: isMl ? 'ഫ്രീ ഡെലിവറി' : 'Free Delivery', sub: isMl ? 'UAE-ൽ ഉൾൽ' : 'Within UAE' },
                { icon: <RotateCcw size={18} />, label: isMl ? '7-ദിവസ റിട്ടേൺ' : '7-Day Return', sub: isMl ? 'ആശ്വസ ഗ്യാരന്റി' : 'Easy returns' },
                { icon: <ShieldCheck size={18} />, label: isMl ? 'സുരക്ഷ' : 'Secure', sub: isMl ? 'സേഫ് പേമെന്റ്' : 'Safe payment' },
              ].map((t, i) => (
                <div key={i} className="text-center p-3 bg-kerala-cream rounded-xl border border-gray-100">
                  <div className="text-kerala-green mb-1 flex justify-center">{t.icon}</div>
                  <p className="text-xs font-semibold text-kerala-deep leading-tight">{t.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5 leading-tight">{t.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Description tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-10">
          <div className="flex border-b border-gray-100">
            {(
              [
                { id: 'details' as const, label: isMl ? 'വിശദാംശങ്ങൾ' : 'Details' },
                { id: 'specs' as const, label: isMl ? 'സ്പെസ്' : 'Specs / Ingredients' },
                { id: 'shipping' as const, label: isMl ? 'ഡെലിവറി & റിട്ടേൺ' : 'Shipping & Returns' },
              ] as const
            ).map(tab => (
              <button key={tab.id} onClick={() => setActiveDescTab(tab.id)}
                className={`flex-1 py-4 text-sm font-semibold border-b-2 transition-all ${activeDescTab === tab.id ? 'border-kerala-green text-kerala-green' : 'border-transparent text-gray-500 hover:text-kerala-deep'}`}>
                {tab.label}
              </button>
            ))}
          </div>
          <div className="p-6">
            {activeDescTab === 'details' && (
              <p className="text-gray-600 leading-relaxed">{isMl ? product.descriptionMl : product.description}</p>
            )}
            {activeDescTab === 'specs' && (
              <p className="text-gray-600 leading-relaxed">{isMl ? product.specsMl : product.specs}</p>
            )}
            {activeDescTab === 'shipping' && (
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">{isMl ? product.shippingMl : product.shipping}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div className="flex items-start gap-3 p-4 bg-kerala-cream rounded-xl">
                    <Truck size={20} className="text-kerala-green flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-kerala-deep text-sm">{isMl ? 'ഡെലിവറി' : 'Delivery'}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{isMl ? 'UAE-ൽ 2-3 ദിവസം' : '2–3 working days in UAE'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-kerala-cream rounded-xl">
                    <RotateCcw size={20} className="text-kerala-green flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-kerala-deep text-sm">{isMl ? 'റിട്ടേൺ' : 'Returns'}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{isMl ? '7 ദിവസത്തിനുള്ളിൽ' : 'Within 7 days of delivery'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reviews section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-10">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-kerala-deep">{isMl ? 'ഉപഭോക്തൃ അഭിപ്രായങ്ങൾ' : 'Customer Reviews'}</h2>
            <div className="flex items-center gap-2">
              <Stars r={4.8} size={16} />
              <span className="font-bold text-kerala-deep">4.8</span>
              <span className="text-gray-400 text-sm">/ 5</span>
            </div>
          </div>
          <div className="divide-y divide-gray-50">
            {CUSTOMER_REVIEWS.map(r => (
              <div key={r.id} className="flex gap-4 p-6">
                <div className="relative w-11 h-11 rounded-full overflow-hidden flex-shrink-0 border-2 border-gray-100">
                  <Image src={r.avatar} alt={r.name} fill className="object-cover" sizes="44px" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-kerala-deep text-sm">{isMl ? r.nameMl : r.name}</span>
                      {r.verified && (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                          <CheckCircle size={10} />{isMl ? 'സ്ഥിരീകരിച്ച വാങ്ങൽ' : 'Verified Purchase'}
                        </span>
                      )}
                    </div>
                    <span className="text-gray-400 text-xs">{r.date}</span>
                  </div>
                  <div className="mb-2"><Stars r={r.rating} size={13} /></div>
                  <p className="text-gray-600 text-sm leading-relaxed">{isMl ? r.textMl : r.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related products */}
        <div>
          <h2 className="font-serif text-2xl font-bold text-kerala-deep mb-5">{isMl ? 'സമാന ഉൽപ്പന്നങ്ങൾ' : 'Related Products'}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {relatedProducts.map(p => (
              <Link key={p.id} href={`/${locale}/company/${business.slug}/shop/${p.id}`}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md hover:border-kerala-green/20 transition-all group">
                <div className="relative aspect-square overflow-hidden">
                  <Image src={p.photos[0]} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="300px" />
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                    {Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)}% OFF
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-kerala-deep text-xs line-clamp-2 mb-1.5 leading-tight">
                    {isMl ? p.nameMl : p.name}
                  </h3>
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-kerala-green font-bold text-sm">AED {p.price}</span>
                    <span className="text-gray-400 text-xs line-through">AED {p.originalPrice}</span>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    <Stars r={4.7} size={11} />
                    <span className="text-xs text-gray-400">4.7</span>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${p.stock === 'In Stock' ? 'text-emerald-600 bg-emerald-50' : 'text-orange-600 bg-orange-50'}`}>
                    {isMl ? p.stockMl : p.stock}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Photo zoom modal */}
      {zoomOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setZoomOpen(false)}>
          <button className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors">
            <Star size={32} className="hidden" />
            <svg viewBox="0 0 24 24" className="w-8 h-8 fill-none stroke-current stroke-2 text-white" onClick={() => setZoomOpen(false)}>
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <div className="relative max-w-3xl max-h-[90vh] w-full h-full" onClick={e => e.stopPropagation()}>
            <Image src={product.photos[activePhoto]} alt={product.name} fill className="object-contain" sizes="90vw" />
          </div>
          <div className="absolute bottom-6 flex gap-2">
            {product.photos.map((_, i) => (
              <button key={i} onClick={e => { e.stopPropagation(); setActivePhoto(i) }}
                className={`w-2.5 h-2.5 rounded-full transition-all ${activePhoto === i ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/70'}`} />
            ))}
          </div>
        </div>
      )}

      {/* WhatsApp floating */}
      {business.whatsapp && (
        <a href={`https://wa.me/${business.whatsapp.replace(/\D/g, '')}`}
          className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110"
          aria-label="WhatsApp">
          <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M11.999 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.978-1.306A9.963 9.963 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 11.999 2zm.001 18c-1.717 0-3.318-.468-4.693-1.283l-.337-.2-3.496.917.934-3.41-.22-.35A7.948 7.948 0 0 1 4 12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8z" />
          </svg>
        </a>
      )}

      <Footer />
    </main>
  )
}
