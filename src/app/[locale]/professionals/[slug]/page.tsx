'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { useParams } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import {
  MapPin, BadgeCheck, Star, Phone, Mail, Globe, MessageCircle,
  Share2, Flag, ArrowLeft, Award, Calendar, Users, Loader2,
  CheckCircle, ExternalLink
} from 'lucide-react'
import FavouriteButton from '@/components/ui/FavouriteButton'
import ReviewsBlock from '@/components/ui/ReviewsBlock'
import { getProfessional, PROFESSIONAL_CATEGORIES } from '@/lib/professionals'
import { getProfessionalReviews } from '@/lib/listings'
import type { ReviewRow } from '@/lib/supabase'
import type { Professional } from '@/lib/professionals'

const AVATAR_FALLBACK = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80'

// Placeholder for when slug not in DB yet
const B = { name_ml: null, profession_ml: null, category_ml: null, emirate_ml: null, phone: null, whatsapp: null, email: null, website: null, bio_ml: null, verified: true, featured: false, followers: null, tags: [], status: 'active' as const }
const PLACEHOLDER_MAP: Record<string, Professional> = {
  'dr-rajan-nair':           { ...B, id: 'pp1',  slug: 'dr-rajan-nair',           name: 'Dr. Rajan Nair',          profession: 'Cardiologist',                   category: 'medical',       emirate: 'Dubai',     photo_url: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&q=80', bio: 'Experienced Cardiologist with 18+ years in Dubai. MBBS, MD (Cardiology) AIIMS, Fellowship in Interventional Cardiology from UK. 2000+ cardiac procedures.', rating_avg: 4.9, review_count: 87, created_at: new Date().toISOString() },
  'dr-sheena-jacob':          { ...B, id: 'pp2',  slug: 'dr-sheena-jacob',          name: 'Dr. Sheena Jacob',         profession: 'Dentist & Orthodontist',          category: 'medical',       emirate: 'Abu Dhabi', photo_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80', bio: 'Specialist Dentist & Orthodontist based in Abu Dhabi. Expert in braces, aligners and cosmetic dentistry for the UAE Malayali community.', rating_avg: 4.8, review_count: 54, created_at: new Date().toISOString() },
  'adv-priya-krishnan':       { ...B, id: 'pp3',  slug: 'adv-priya-krishnan',       name: 'Adv. Priya Krishnan',      profession: 'Criminal Advocate',               category: 'legal',         emirate: 'Dubai',     photo_url: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400&q=80', bio: 'Criminal and Civil Advocate with 12+ years of experience in UAE courts. Specialises in labour disputes, visa issues and criminal defence.', rating_avg: 4.8, review_count: 45, created_at: new Date().toISOString() },
  'pro-ajith-services':       { ...B, id: 'pp4',  slug: 'pro-ajith-services',       name: 'Ajith PRO Services',       profession: 'PRO & Visa Consultant',           category: 'legal',         emirate: 'Dubai',     photo_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80', bio: 'Trusted PRO and Visa Consultant in Dubai for 10+ years. Handles visa, Emirates ID, business setup, labour card, and all government PRO services.', rating_avg: 4.7, review_count: 91, created_at: new Date().toISOString() },
  'ca-suresh-menon':           { ...B, id: 'pp5',  slug: 'ca-suresh-menon',           name: 'CA Suresh Menon',          profession: 'Chartered Accountant',            category: 'finance',       emirate: 'Abu Dhabi', photo_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80', bio: 'Chartered Accountant and VAT consultant with Big 4 experience. Specialises in UAE corporate tax, VAT, audit, and financial advisory for SMEs.', rating_avg: 4.7, review_count: 33, created_at: new Date().toISOString() },
  'anjali-yoga-fitness':       { ...B, id: 'pp6',  slug: 'anjali-yoga-fitness',       name: 'Anjali Thomas',            profession: 'Fitness & Yoga Coach',            category: 'fitness',       emirate: 'Dubai',     photo_url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80', bio: 'Certified Yoga and Fitness Coach with 28K followers. Offers personal training, group yoga classes, and wellness coaching across Dubai.', rating_avg: 5.0, review_count: 62, followers: 28000, created_at: new Date().toISOString() },
  'coach-arun-sports':         { ...B, id: 'pp7',  slug: 'coach-arun-sports',         name: 'Arun Krishnan',            profession: 'Cricket & Sports Coach',          category: 'fitness',       emirate: 'Sharjah',   photo_url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&q=80', bio: 'Professional cricket coach with state-level experience from Kerala. Coaches youth and adult teams across Sharjah and UAE cricket leagues.', rating_avg: 4.9, review_count: 28, created_at: new Date().toISOString() },
  'nithya-classical-dancer':   { ...B, id: 'pp8',  slug: 'nithya-classical-dancer',   name: 'Nithya Pillai',            profession: 'Classical Dancer & Choreographer', category: 'entertainment', emirate: 'Sharjah',   photo_url: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=400&q=80', bio: 'Bharatanatyam and Mohiniyattam dancer with 15+ years of training. Performs at cultural events, teaches dance, and choreographs for UAE stage productions.', rating_avg: 4.9, review_count: 18, created_at: new Date().toISOString() },
  'singer-vineeth':            { ...B, id: 'pp9',  slug: 'singer-vineeth',            name: 'Vineeth Sreedharan',       profession: 'Playback Singer & Musician',      category: 'entertainment', emirate: 'Abu Dhabi', photo_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80', bio: 'Playback singer, musician and live performer with 85K followers. Has performed at 500+ events across UAE and is available for weddings and corporate events.', rating_avg: 5.0, review_count: 53, followers: 85000, created_at: new Date().toISOString() },
  'rj-anoop-dubai':            { ...B, id: 'pp10', slug: 'rj-anoop-dubai',            name: 'RJ Anoop',                 profession: 'Radio Jockey & MC',               category: 'media',         emirate: 'Dubai',     photo_url: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&q=80', bio: 'Popular RJ and Event MC with 55K followers. Hosts live shows, corporate events, weddings and cultural programmes across UAE.', rating_avg: 4.9, review_count: 41, followers: 55000, created_at: new Date().toISOString() },
  'meera-lifestyle-influencer': { ...B, id: 'pp11', slug: 'meera-lifestyle-influencer', name: 'Meera Das',                profession: 'Lifestyle Influencer',            category: 'influencer',    emirate: 'Dubai',     photo_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b977?w=400&q=80', bio: 'Lifestyle and fashion influencer with 120K followers across Instagram and YouTube. Partners with UAE brands for authentic Malayalam community content.', rating_avg: 4.8, review_count: 29, followers: 120000, created_at: new Date().toISOString() },
  'sanjay-food-creator':        { ...B, id: 'pp12', slug: 'sanjay-food-creator',        name: 'Sanjay Foodie',            profession: 'Food Content Creator',            category: 'influencer',    emirate: 'Dubai',     photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80', bio: 'Food blogger and content creator with 67K followers. Reviews Malayali and Indian restaurants across UAE, creates recipe videos and food guides.', rating_avg: 4.7, review_count: 36, followers: 67000, created_at: new Date().toISOString() },
}

export default function ProfessionalDetailPage() {
  const locale = useLocale()
  const isMl = locale === 'ml'
  const params = useParams<{ slug: string }>()
  const slug = params.slug

  const [pro, setPro] = useState<Professional | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const [reviews, setReviews] = useState<ReviewRow[]>([])

  useEffect(() => {
    getProfessional(slug).then(data => {
      const found = data ?? PLACEHOLDER_MAP[slug] ?? null
      setPro(found)
      if (found) {
        getProfessionalReviews(found.id).then(setReviews)
      }
      setLoading(false)
    })
  }, [slug])

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleContact = (e: React.FormEvent) => {
    e.preventDefault()
    setTimeout(() => setSent(true), 800)
  }

  const catMeta = pro ? PROFESSIONAL_CATEGORIES.find(c => c.slug === pro.category) : null

  if (loading) return (
    <main className="min-h-screen bg-kerala-cream">
      <Navbar />
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 size={40} className="animate-spin text-kerala-green" />
      </div>
      <Footer />
    </main>
  )

  if (!pro) return (
    <main className="min-h-screen bg-kerala-cream">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-40 text-center">
        <p className="text-4xl mb-4">😕</p>
        <h1 className="font-serif text-2xl font-bold text-kerala-deep mb-2">{isMl ? 'കണ്ടെത്തിയില്ല' : 'Profile Not Found'}</h1>
        <Link href={`/${locale}/professionals`} className="text-kerala-green hover:underline">{isMl ? 'തിരിച്ചു പോകൂ' : '← Back to Professionals'}</Link>
      </div>
      <Footer />
    </main>
  )

  return (
    <main className="min-h-screen bg-kerala-cream">
      <Navbar />

      {/* Hero Banner */}
      <div className="bg-kerala-deep h-52 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-kerala-deep via-kerala-green/30 to-kerala-deep opacity-80" />
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,193,7,0.15) 0%, transparent 60%)' }} />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 pb-16 relative z-10">

        {/* Back */}
        <Link href={`/${locale}/professionals`} className="inline-flex items-center gap-1.5 text-white/80 hover:text-white text-sm mb-6 transition-colors">
          <ArrowLeft size={15} /> {isMl ? 'തിരിച്ചു' : 'Back to Professionals'}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT: Profile card */}
          <div className="lg:col-span-1 space-y-4">
            {/* Main card */}
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
              {/* Avatar */}
              <div className="flex flex-col items-center pt-8 pb-6 px-6 text-center">
                <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-xl mb-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={pro.photo_url || AVATAR_FALLBACK}
                    alt={pro.name}
                    onError={(e) => { (e.target as HTMLImageElement).src = AVATAR_FALLBACK }}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {pro.verified && (
                    <div className="absolute bottom-1 right-1 bg-white rounded-full p-0.5 shadow">
                      <BadgeCheck size={16} className="text-kerala-green" />
                    </div>
                  )}
                </div>

                {catMeta && (
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-kerala-green/10 text-kerala-green mb-2">
                    {catMeta.emoji} {isMl ? catMeta.nameMl : catMeta.name}
                  </span>
                )}

                <h1 className="font-serif text-2xl font-bold text-kerala-deep mb-1">{pro.name}</h1>
                <p className="text-gray-500 text-sm mb-2">{isMl ? (pro.profession_ml ?? pro.profession) : pro.profession}</p>

                <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-4">
                  <MapPin size={12} />
                  <span>{isMl ? (pro.emirate_ml ?? pro.emirate) : pro.emirate}, UAE</span>
                </div>

                {/* Rating */}
                {!pro.followers && (
                  <div className="flex items-center gap-1.5 mb-4">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} size={14} className={i <= Math.floor(pro.rating_avg) ? 'text-kerala-gold fill-kerala-gold' : 'text-gray-200'} />
                    ))}
                    <span className="text-sm font-semibold text-gray-700 ml-1">{pro.rating_avg.toFixed(1)}</span>
                    <span className="text-gray-400 text-xs">({pro.review_count})</span>
                  </div>
                )}

                {pro.followers && (
                  <div className="bg-kerala-gold/10 border border-kerala-gold/20 rounded-full px-4 py-1 mb-4">
                    <span className="text-kerala-gold font-bold text-sm">
                      {pro.followers >= 1000 ? `${(pro.followers/1000).toFixed(0)}K` : pro.followers} {isMl ? 'ഫോളോവേഴ്സ്' : 'Followers'}
                    </span>
                  </div>
                )}

                {/* Action buttons */}
                <div className="w-full space-y-2">
                  {pro.whatsapp && (
                    <a
                      href={`https://wa.me/${pro.whatsapp.replace(/\D/g,'')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
                    >
                      <MessageCircle size={16} /> WhatsApp
                    </a>
                  )}
                  {pro.phone && (
                    <a href={`tel:${pro.phone}`} className="w-full flex items-center justify-center gap-2 bg-kerala-green hover:bg-kerala-deep text-white font-semibold py-2.5 rounded-xl transition-colors text-sm">
                      <Phone size={16} /> {isMl ? 'വിളിക്കൂ' : 'Call'}
                    </a>
                  )}
                  <button
                    onClick={() => setContactOpen(true)}
                    className="w-full flex items-center justify-center gap-2 border border-kerala-green text-kerala-green hover:bg-kerala-green hover:text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
                  >
                    <Mail size={16} /> {isMl ? 'സന്ദേശം' : 'Send Message'}
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-100 px-6 py-4 space-y-3">
                {pro.email && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Mail size={13} className="text-gray-400" />
                    <span className="truncate">{pro.email}</span>
                  </div>
                )}
                {pro.website && (
                  <a href={pro.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-kerala-green hover:underline">
                    <Globe size={13} /> {pro.website.replace(/^https?:\/\//, '')}
                  </a>
                )}
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Calendar size={13} /> {isMl ? 'ചേർന്നത്' : 'Member since'} {new Date(pro.created_at).getFullYear()}
                </div>
              </div>

              {/* Share / Save / Report */}
              <div className="border-t border-gray-100 px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button onClick={handleShare} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-kerala-green transition-colors">
                    <Share2 size={13} />
                    {copied ? (isMl ? 'കോപ്പി ചെയ്തു!' : 'Copied!') : (isMl ? 'ഷെയർ' : 'Share')}
                  </button>
                  <FavouriteButton itemType="professional" itemId={pro.id} size="sm" />
                </div>
                <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors">
                  <Flag size={12} /> {isMl ? 'റിപ്പോർട്ട്' : 'Report'}
                </button>
              </div>
            </div>

            {/* Tags */}
            {pro.tags?.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-5">
                <h3 className="font-semibold text-kerala-deep text-sm mb-3">{isMl ? 'സ്പെഷ്യൽറ്റികൾ' : 'Specializations'}</h3>
                <div className="flex flex-wrap gap-2">
                  {pro.tags.map(tag => (
                    <span key={tag} className="text-xs bg-kerala-cream text-gray-600 px-3 py-1 rounded-full border border-gray-200">{tag}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Details */}
          <div className="lg:col-span-2 space-y-5">

            {/* About */}
            {pro.bio && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="font-serif text-xl font-bold text-kerala-deep mb-4 flex items-center gap-2">
                  <Users size={18} className="text-kerala-green" />
                  {isMl ? 'എന്നെ കുറിച്ച്' : 'About'}
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {isMl ? (pro.bio_ml ?? pro.bio) : pro.bio}
                </p>
              </div>
            )}

            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Star, value: pro.rating_avg.toFixed(1), label: isMl ? 'റേറ്റിംഗ്' : 'Rating', color: 'text-kerala-gold' },
                { icon: Users, value: pro.review_count, label: isMl ? 'റിവ്യൂകൾ' : 'Reviews', color: 'text-blue-500' },
                { icon: Award, value: pro.verified ? (isMl ? 'ഉണ്ട്' : 'Yes') : 'No', label: isMl ? 'വെരിഫൈഡ്' : 'Verified', color: 'text-kerala-green' },
              ].map(stat => (
                <div key={stat.label} className="bg-white rounded-2xl shadow-sm p-4 text-center">
                  <stat.icon size={20} className={`${stat.color} mx-auto mb-2`} />
                  <div className="font-bold text-kerala-deep text-lg">{stat.value}</div>
                  <div className="text-gray-400 text-xs">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Verified badge info */}
            {pro.verified && (
              <div className="bg-gradient-to-r from-kerala-green/10 to-kerala-deep/5 border border-kerala-green/20 rounded-2xl p-5 flex items-start gap-4">
                <BadgeCheck size={28} className="text-kerala-green flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-kerala-deep text-sm mb-1">{isMl ? 'വെരിഫൈഡ് പ്രൊഫഷണൽ' : 'Verified Professional'}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    {isMl
                      ? 'ഈ പ്രൊഫഷണൽ MalayaliBusiness.com ടീം സ്ഥിരീകരിച്ചിട്ടുണ്ട്. യോഗ്യത, ലൈസൻസ്, ഐഡന്റിറ്റി എന്നിവ പരിശോധിച്ചിരിക്കുന്നു.'
                      : 'This professional has been verified by the MalayaliBusiness.com team. Qualifications, license, and identity have been reviewed.'}
                  </p>
                </div>
              </div>
            )}

            {/* Contact form modal */}
            {contactOpen && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="font-serif text-xl font-bold text-kerala-deep mb-4">{isMl ? 'സന്ദേശം അയക്കൂ' : 'Send a Message'}</h2>
                {sent ? (
                  <div className="text-center py-8">
                    <CheckCircle size={48} className="text-kerala-green mx-auto mb-3" />
                    <h3 className="font-semibold text-kerala-deep mb-1">{isMl ? 'അയച്ചു!' : 'Message Sent!'}</h3>
                    <p className="text-gray-500 text-sm">{isMl ? '24 മണിക്കൂറിനകം മറുപടി ലഭിക്കും' : 'You\'ll get a reply within 24 hours'}</p>
                    <button onClick={() => { setSent(false); setContactOpen(false) }} className="mt-4 text-kerala-green text-sm hover:underline">{isMl ? 'അടക്കൂ' : 'Close'}</button>
                  </div>
                ) : (
                  <form onSubmit={handleContact} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-gray-600 block mb-1">{isMl ? 'പേര്' : 'Your Name'}</label>
                        <input required value={contactForm.name} onChange={e => setContactForm({...contactForm, name: e.target.value})} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-kerala-green" placeholder="Full name" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-600 block mb-1">{isMl ? 'ഇമെയിൽ' : 'Email'}</label>
                        <input required type="email" value={contactForm.email} onChange={e => setContactForm({...contactForm, email: e.target.value})} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-kerala-green" placeholder="you@example.com" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600 block mb-1">{isMl ? 'സന്ദേശം' : 'Message'}</label>
                      <textarea required rows={4} value={contactForm.message} onChange={e => setContactForm({...contactForm, message: e.target.value})} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-kerala-green resize-none" placeholder={isMl ? 'നിങ്ങളുടെ സന്ദേശം...' : 'Your message...'} />
                    </div>
                    <div className="flex gap-3">
                      <button type="submit" className="flex-1 bg-kerala-green text-white font-semibold py-2.5 rounded-xl text-sm hover:bg-kerala-deep transition-colors">
                        {isMl ? 'അയക്കൂ' : 'Send Message'}
                      </button>
                      <button type="button" onClick={() => setContactOpen(false)} className="px-4 border border-gray-200 rounded-xl text-sm text-gray-500 hover:bg-gray-50">
                        {isMl ? 'റദ്ദാക്കൂ' : 'Cancel'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Reviews */}
            <ReviewsBlock
              reviews={reviews}
              avgRating={pro.rating_avg ?? 0}
              isMl={isMl}
              professionalId={pro.id}
              onReviewAdded={r => setReviews(prev => [r, ...prev])}
            />

            {/* Back CTA */}
            <div className="bg-kerala-deep rounded-2xl p-6 flex items-center justify-between">
              <div>
                <p className="text-white font-semibold">{isMl ? 'കൂടുതൽ പ്രൊഫഷണൽസ്' : 'Discover More Professionals'}</p>
                <p className="text-white/60 text-xs mt-0.5">{isMl ? 'UAE-ലെ മലയാളി വിദഗ്ദ്ധർ' : 'Browse all Malayali experts across UAE'}</p>
              </div>
              <Link href={`/${locale}/professionals`} className="bg-kerala-gold text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-kerala-gold-light transition-colors whitespace-nowrap">
                {isMl ? 'കാണൂ' : 'Browse All'}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
