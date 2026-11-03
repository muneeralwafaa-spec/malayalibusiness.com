'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import UAEPhoneInput from '@/components/ui/UAEPhoneInput'
import AIListingWriter from '@/components/ai/AIListingWriter'
import Footer from '@/components/layout/Footer'
import {
  LayoutDashboard, Building2, ShoppingBag, ShoppingCart, MessageSquare,
  BarChart2, Briefcase, CreditCard, Settings, Plus, Bell,
  Eye, TrendingUp, Star, ArrowUpRight, ArrowDownRight, Edit3, Trash2,
  CheckCircle, CheckCircle2, MapPin, Menu, X, LogOut, Users,
  Zap, Download, Mail, Tag, AlertTriangle, Loader2, Shield,
  Stethoscope, Tv, ArrowRight, Heart, Upload, Camera
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { getMyListings } from '@/lib/auth'
import { getMyClassifieds, createClassified, classifiedCategories } from '@/lib/classifieds'
import type { Classified } from '@/lib/classifieds'
import { getShopListings } from '@/lib/listings'
import { getFavourites, toggleFavourite } from '@/lib/favourites'
import type { Favourite } from '@/lib/favourites'
import { supabase } from '@/lib/supabase'
import type { ShopListingRow } from '@/lib/supabase'
import type { Job } from '@/lib/jobs'

// ── Types ──────────────────────────────────────────────────────────────────
type NavSection =
  | 'overview'
  | 'listings'
  | 'classifieds'
  | 'shop'
  | 'orders'
  | 'enquiries'
  | 'analytics'
  | 'jobs'
  | 'professional'
  | 'media'
  | 'favourites'
  | 'reviews'
  | 'billing'
  | 'settings'

// ── Static Mock Data ────────────────────────────────────────────────────────
const weeklyViews = [
  { day: 'Mon', dayMl: 'തി', views: 1420 },
  { day: 'Tue', dayMl: 'ചൊ', views: 1875 },
  { day: 'Wed', dayMl: 'ബ', views: 1340 },
  { day: 'Thu', dayMl: 'വ്യ', views: 2210 },
  { day: 'Fri', dayMl: 'വെ', views: 2650 },
  { day: 'Sat', dayMl: 'ശ', views: 1988 },
  { day: 'Sun', dayMl: 'ഞ', views: 1000 },
]
const maxWeeklyViews = Math.max(...weeklyViews.map(d => d.views))

const recentActivity = [
  { id: 1, icon: Star, color: 'text-amber-500 bg-amber-50', text: 'New 5-star review from Ahmed Al Rashidi', textMl: 'അഹ്‌മദ് അൽ റാഷിദിയിൽ നിന്ന് 5 നക്ഷത്ര അവലോകനം', time: '10 min ago' },
  { id: 2, icon: MessageSquare, color: 'text-blue-500 bg-blue-50', text: 'New enquiry: "Do you deliver to Abu Dhabi?"', textMl: 'പുതിയ അന്വേഷണം: "അബുദാബിയിൽ ഡെലിവറി ഉണ്ടോ?"', time: '25 min ago' },
  { id: 3, icon: CheckCircle, color: 'text-green-500 bg-green-50', text: 'Listing "Al Barakah Restaurant" approved', textMl: 'ലിസ്റ്റിംഗ് അംഗീകരിക്കപ്പെട്ടു', time: '1 hr ago' },
  { id: 4, icon: ShoppingCart, color: 'text-purple-500 bg-purple-50', text: 'New order #1042 received – AED 120', textMl: 'പുതിയ ഓർഡർ #1042 ലഭിച്ചു', time: '2 hr ago' },
  { id: 5, icon: Eye, color: 'text-teal-500 bg-teal-50', text: 'Profile viewed 340 times today', textMl: 'ഇന്ന് 340 തവണ കണ്ടു', time: '3 hr ago' },
  { id: 6, icon: Briefcase, color: 'text-indigo-500 bg-indigo-50', text: 'Job post "Waiter" received 12 applications', textMl: '"വെയ് റ്റർ" ജോബ് 12 അപേക്ഷ ലഭിച്ചു', time: '5 hr ago' },
  { id: 7, icon: Star, color: 'text-amber-500 bg-amber-50', text: 'New 4-star review from Priya Krishnan', textMl: 'പ്രിയ കൃഷ്ണനിൽ നിന്ന് 4 നക്ഷത്ര അവലോകനം', time: '8 hr ago' },
  { id: 8, icon: CreditCard, color: 'text-rose-500 bg-rose-50', text: 'Invoice #INV-2024-04 paid – AED 299', textMl: 'ഇൻവോയ്‌സ് അടച്ചു', time: '1 day ago' },
]


const analyticsWeeks = [
  { week: 'W1', views: 8200, enquiries: 34 },
  { week: 'W2', views: 9100, enquiries: 41 },
  { week: 'W3', views: 7600, enquiries: 28 },
  { week: 'W4', views: 11400, enquiries: 52 },
]
const maxAnalyticsViews = Math.max(...analyticsWeeks.map(d => d.views))
const maxAnalyticsEnquiries = Math.max(...analyticsWeeks.map(d => d.enquiries))

const topKeywords = [
  { kw: 'Kerala restaurant Dubai', kwMl: 'കേരള റസ്റ്റോറന്റ് ദുബായ്', count: 1240 },
  { kw: 'Malabar biryani near me', kwMl: 'മലബാർ ബിരിയാണി', count: 980 },
  { kw: 'Malayali food UAE', kwMl: 'മലയാളി ഭക്ഷണം UAE', count: 760 },
  { kw: 'Kerala catering Dubai', kwMl: 'കേരള കേറ്ററിംഗ്', count: 540 },
  { kw: 'Kerala sadya Dubai', kwMl: 'കേരള സദ്യ ദുബായ്', count: 390 },
]

const emirateBreakdown = [
  { name: 'Dubai', pct: 58 },
  { name: 'Sharjah', pct: 22 },
  { name: 'Abu Dhabi', pct: 13 },
  { name: 'Others', pct: 7 },
]


// ── Sub-components ──────────────────────────────────────────────────────────
function StatCard({
  icon: Icon,
  label,
  value,
  change,
  positive,
  accent = false,
}: {
  icon: React.ElementType
  label: string
  value: string
  change?: string
  positive?: boolean
  accent?: boolean
}) {
  return (
    <div className={`rounded-2xl border shadow-sm p-5 ${accent ? 'bg-kerala-deep text-white border-kerala-deep' : 'bg-white border-gray-100'}`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accent ? 'bg-white/10' : 'bg-kerala-green/10'}`}>
          <Icon size={18} className={accent ? 'text-kerala-gold' : 'text-kerala-green'} />
        </div>
        {change && (
          <div className={`flex items-center gap-0.5 text-xs font-semibold ${positive ? 'text-green-500' : 'text-red-400'}`}>
            {positive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
            {change}
          </div>
        )}
      </div>
      <div className={`font-serif font-bold text-2xl leading-none mb-0.5 ${accent ? 'text-white' : 'text-kerala-deep'}`}>{value}</div>
      <div className={`text-xs ${accent ? 'text-white/60' : 'text-gray-500'}`}>{label}</div>
    </div>
  )
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width="12" height="12" viewBox="0 0 20 20" fill={i <= Math.round(rating) ? '#c8922a' : '#e5e7eb'}>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h2 className="font-serif font-bold text-2xl text-kerala-deep">{title}</h2>
      {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
    </div>
  )
}

// ── Section Components ──────────────────────────────────────────────────────

function OverviewSection({ isMl, listings, onAddListing, onSection }: { isMl: boolean; listings: any[]; onAddListing: () => void; onSection: (s: string) => void }) {
  const totalViews   = listings.reduce((s, l) => s + (l.views_count   || 0), 0)
  const totalReviews = listings.reduce((s, l) => s + (l.review_count  || 0), 0)
  const avgRating    = listings.length
    ? (listings.reduce((s, l) => s + Number(l.rating_avg || 0), 0) / listings.length).toFixed(1)
    : '—'
  const today = new Date().toLocaleDateString(isMl ? 'ml-IN' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

  const [recentReviews, setRecentReviews] = useState<any[]>([])
  useEffect(() => {
    if (!listings.length) return
    const ids = listings.map((l: any) => l.id)
    supabase.from('reviews').select('id,reviewer_name,rating,body,created_at,listing_id')
      .in('listing_id', ids)
      .order('created_at', { ascending: false })
      .limit(6)
      .then(({ data }) => setRecentReviews(data ?? []))
  }, [listings.length])

  function timeAgo(d: string) {
    const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000)
    if (s < 3600)  return `${Math.floor(s/60)}m ago`
    if (s < 86400) return `${Math.floor(s/3600)}h ago`
    return `${Math.floor(s/86400)}d ago`
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title={isMl ? 'ഓവർവ്യൂ' : 'Overview'}
        subtitle={today}
      />

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Building2} label={isMl ? 'ലിസ്റ്റിംഗ്' : 'My Listings'} value={String(listings.length)} />
        <StatCard icon={Eye} label={isMl ? 'മൊത്തം കാഴ്ചകൾ' : 'Total Views'} value={totalViews.toLocaleString()} />
        <StatCard icon={Star} label={isMl ? 'മൊത്തം റിവ്യൂ' : 'Total Reviews'} value={String(totalReviews)} accent />
        <StatCard icon={TrendingUp} label={isMl ? 'ശരാശരി റേറ്റിംഗ്' : 'Avg Rating'} value={`${avgRating}/5`} />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <button onClick={onAddListing} className="bg-kerala-green text-white rounded-2xl p-4 flex flex-col items-start gap-3 hover:opacity-90 transition-opacity">
          <Plus size={20} />
          <span className="font-semibold text-sm text-left leading-tight">{isMl ? 'ലിസ്റ്റിംഗ് ചേർക്കൂ' : 'Add Listing'}</span>
        </button>
        <button onClick={() => onSection('analytics')} className="bg-kerala-gold text-white rounded-2xl p-4 flex flex-col items-start gap-3 hover:opacity-90 transition-opacity">
          <BarChart2 size={20} />
          <span className="font-semibold text-sm text-left leading-tight">{isMl ? 'അനലിറ്റിക്സ്' : 'View Analytics'}</span>
        </button>
        <button onClick={() => onSection('settings')} className="bg-kerala-deep text-white rounded-2xl p-4 flex flex-col items-start gap-3 hover:opacity-90 transition-opacity">
          <Settings size={20} />
          <span className="font-semibold text-sm text-left leading-tight">{isMl ? 'ക്രമീകരണം' : 'Settings'}</span>
        </button>
        {/* Phase 2: Post Job, Shop Manager */}
      </div>

      {/* Bar chart + activity */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Pure CSS bar chart */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-serif font-bold text-kerala-deep">{isMl ? 'ആഴ്ചയിലെ പ്രൊഫൈൽ കാഴ്ചകൾ' : 'Profile Views – Last 7 Days'}</h3>
            <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">12,483 {isMl ? 'മൊത്തം' : 'total'}</span>
          </div>
          <div className="flex items-end gap-2 h-24 sm:h-32">
            {weeklyViews.map(d => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1 h-full">
                <div className="w-full relative flex-1">
                  <div
                    className="absolute bottom-0 w-full bg-kerala-green/80 rounded-t-lg hover:bg-kerala-green transition-colors"
                    style={{ height: `${Math.round((d.views / maxWeeklyViews) * 100)}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400">{isMl ? d.dayMl : d.day}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-kerala-green/80" />
            <span className="text-xs text-gray-500">{isMl ? 'പ്രൊഫൈൽ കാഴ്ചകൾ' : 'Profile Views'}</span>
          </div>
        </div>

        {/* Recent activity — real reviews */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-serif font-bold text-kerala-deep mb-4">{isMl ? 'സമീപ അവലോകനങ്ങൾ' : 'Recent Reviews'}</h3>
          <div className="space-y-3 overflow-y-auto" style={{ maxHeight: '260px' }}>
            {recentReviews.length === 0 ? (
              <div className="text-center py-6">
                <Star size={24} className="mx-auto mb-2 text-gray-200" />
                <p className="text-xs text-gray-400">{isMl ? 'ഇതുവരെ റിവ്യൂ ഇല്ല' : 'No reviews yet'}</p>
              </div>
            ) : recentReviews.map(r => (
              <div key={r.id} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 bg-amber-50 text-amber-500">
                  <Star size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-xs font-semibold text-kerala-deep">{r.reviewer_name}</span>
                    <span className="text-xs text-kerala-gold font-bold">{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</span>
                  </div>
                  {r.body && <p className="text-xs text-gray-500 truncate">{r.body}</p>}
                  <p className="text-xs text-gray-400 mt-0.5">{timeAgo(r.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const LISTING_CATEGORIES = [
  'Restaurants & Food', 'Real Estate', 'Healthcare', 'Education', 'Finance & Banking',
  'Beauty & Wellness', 'Travel & Tourism', 'Technology & IT', 'Legal & PRO Services',
  'Construction & Engineering', 'Retail & Trading', 'Logistics & Transport',
  'Media & Marketing', 'Automotive', 'Grocery & Supermarket', 'Other',
]
const EMIRATES_LIST = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain']
const EMIRATE_ENUM: Record<string, string> = {
  'Dubai': 'dubai',
  'Abu Dhabi': 'abu_dhabi',
  'Sharjah': 'sharjah',
  'Ajman': 'ajman',
  'Ras Al Khaimah': 'ras_al_khaimah',
  'Fujairah': 'fujairah',
  'Umm Al Quwain': 'umm_al_quwain',
}

function AddListingModal({ isMl, onClose, onSuccess, userId, userEmail, ownerName }: { isMl: boolean; onClose: () => void; onSuccess?: () => void; userId: string; userEmail?: string; ownerName?: string }) {
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string|null>(null)
  const [dbCategories, setDbCategories] = useState<{id: string; name: string}[]>([])
  const [form, setForm] = useState({
    name: '', category: '', emirate: '', area: '', address: '',
    phone: '', whatsapp: '', email: '', website: '',
    description: '', tagline: '',
  })
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  useEffect(() => {
    supabase.from('categories').select('id, name').eq('is_active', true).order('name')
      .then(({ data }) => setDbCategories(data ?? []))
  }, [])

  async function handleSave() {
    if (!form.name || !form.category || !form.emirate || !form.phone) return
    setSaving(true)
    setSubmitError(null)
    const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now()
    const emirateEnum = EMIRATE_ENUM[form.emirate] || form.emirate.toLowerCase().replace(/\s+/g, '_')
    const categoryRow = dbCategories.find(c => c.name === form.category)
    const { error } = await supabase.from('listings').insert([{
      owner_id: userId,
      slug,
      name: form.name,
      tagline: form.tagline || null,
      description: form.description || null,
      emirate: emirateEnum,
      area: form.area || null,
      address: form.address || null,
      phone: form.phone,
      whatsapp: form.whatsapp || form.phone,
      email: form.email || null,
      website: form.website || null,
      plan: 'free',
      status: 'pending',
      is_featured: false,
      is_verified: false,
      category_id: categoryRow?.id ?? null,
    }])
    if (error) {
      setSubmitError(error.message)
      setSaving(false)
      return
    }
    if (!error) {
      // Send confirmation email to owner + admin notification
      const ownerEmail = form.email || userEmail
      if (ownerEmail) {
        fetch('/api/email/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'listing_submitted',
            to: ownerEmail,
            ownerName: ownerName,
            businessName: form.name,
            listingSlug: slug,
            emirate: form.emirate,
            category: form.category,
            ownerEmail,
          }),
        }).catch(console.error)
      }
      // WhatsApp admin notification
      fetch('/api/whatsapp/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `🆕 New Listing Submitted!\n\nBusiness: ${form.name}\nCategory: ${form.category}\nEmirate: ${form.emirate}\nPhone: ${form.phone}\n\nReview at: https://www.malayalibusiness.com/admin`,
        }),
      }).catch(console.error)
      setSuccess(true)
    }
    setSaving(false)
  }

  if (success) return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
        <div className="w-16 h-16 bg-kerala-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={32} className="text-kerala-green" />
        </div>
        <h3 className="font-serif text-xl font-bold text-kerala-deep mb-2">Listing Submitted!</h3>
        <p className="text-gray-500 text-sm mb-6">Your listing is under review and will go live within 24 hours.</p>
        <button onClick={() => { onSuccess?.(); onClose() }} className="w-full bg-kerala-green text-white py-3 rounded-xl font-semibold">Done</button>
      </div>
    </div>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 px-0 sm:px-4">
      <div className="bg-white w-full sm:max-w-2xl rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 className="font-serif font-bold text-kerala-deep text-lg">Add New Listing</h2>
            <p className="text-gray-400 text-xs mt-0.5">Your listing will be reviewed before going live</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <X size={18} className="text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
          {/* Business name + tagline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Business Name <span className="text-red-500">*</span></label>
              <input value={form.name} onChange={set('name')} placeholder="e.g. Kerala Kitchen Dubai"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-kerala-green focus:ring-2 focus:ring-kerala-green/10 transition-all placeholder-gray-300" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Tagline <span className="text-gray-400 font-normal">(optional)</span></label>
              <input value={form.tagline} onChange={set('tagline')} placeholder="e.g. Authentic Kerala food in the heart of Dubai"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-kerala-green focus:ring-2 focus:ring-kerala-green/10 transition-all placeholder-gray-300" />
            </div>
          </div>

          {/* Category + Emirate */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Category <span className="text-red-500">*</span></label>
              <select value={form.category} onChange={set('category')}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-kerala-green focus:ring-2 focus:ring-kerala-green/10 transition-all text-gray-700 bg-white">
                <option value="">Select category</option>
                {dbCategories.length > 0
                  ? dbCategories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)
                  : LISTING_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Emirate <span className="text-red-500">*</span></label>
              <select value={form.emirate} onChange={set('emirate')}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-kerala-green focus:ring-2 focus:ring-kerala-green/10 transition-all text-gray-700 bg-white">
                <option value="">Select emirate</option>
                {EMIRATES_LIST.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
          </div>

          {/* Area + Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Area / Neighbourhood</label>
              <input value={form.area} onChange={set('area')} placeholder="e.g. Deira, JLT, Al Nahda"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-kerala-green focus:ring-2 focus:ring-kerala-green/10 transition-all placeholder-gray-300" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Full Address</label>
              <input value={form.address} onChange={set('address')} placeholder="Building, street, area"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-kerala-green focus:ring-2 focus:ring-kerala-green/10 transition-all placeholder-gray-300" />
            </div>
          </div>

          {/* Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Phone <span className="text-red-500">*</span></label>
              <UAEPhoneInput value={form.phone} onChange={v => { const e = { target: { value: v } } as any; set('phone')(e) }} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">WhatsApp</label>
              <UAEPhoneInput value={form.whatsapp} onChange={v => { const e = { target: { value: v } } as any; set('whatsapp')(e) }} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Email</label>
              <input value={form.email} onChange={set('email')} placeholder="business@email.com" type="email"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-kerala-green focus:ring-2 focus:ring-kerala-green/10 transition-all placeholder-gray-300" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Website</label>
              <input value={form.website} onChange={set('website')} placeholder="https://yourwebsite.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-kerala-green focus:ring-2 focus:ring-kerala-green/10 transition-all placeholder-gray-300" />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Business Description</label>
            <AIListingWriter
              businessName={form.name}
              category={form.category}
              location={form.emirate}
              services={form.description}
              onGenerated={(data) => {
                setForm(f => ({
                  ...f,
                  description: data.description,
                  tagline: data.tagline || f.tagline,
                }))
              }}
            />
            <textarea value={form.description} onChange={set('description')} rows={4}
              placeholder="Tell customers about your business, what you offer, your specialities... or click AI Write above!"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-kerala-green focus:ring-2 focus:ring-kerala-green/10 transition-all placeholder-gray-300 resize-none" />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex-shrink-0 space-y-3">
          {submitError && (
            <div className="bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3 rounded-xl">
              {submitError}
            </div>
          )}
          <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !form.name || !form.category || !form.emirate || !form.phone}
            className="flex-2 flex-1 bg-kerala-green text-white py-3 rounded-xl font-semibold text-sm hover:bg-kerala-green-light disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {saving ? <><Loader2 size={15} className="animate-spin" /> Submitting…</> : 'Submit Listing'}
          </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function EditListingModal({ listing, onClose, onSaved }: { listing: any; onClose: () => void; onSaved: (updated: any) => void }) {
  const [tab, setTab] = useState<'details'|'services'|'hours'|'map'>('details')
  const [form, setForm] = useState({
    name: listing.name || '',
    tagline: listing.tagline || '',
    description: listing.description || '',
    phone: listing.phone || '',
    whatsapp: listing.whatsapp || '',
    email: listing.email || '',
    website: listing.website || '',
    area: listing.area || '',
    address: listing.address || '',
    google_map_url: listing.google_map_url || '',
    emirate: EMIRATES_LIST.find(e => EMIRATE_ENUM[e] === listing.emirate) || listing.emirate || '',
  })
  const [services, setServices] = useState<string[]>(listing.services ?? [])
  const [newService, setNewService] = useState('')
  const [richServices, setRichServices] = useState<any[]>([])
  const [newSvc, setNewSvc] = useState({ name: '', description: '', price: '', price_unit: 'AED' })
  const [addingSvc, setAddingSvc] = useState(false)
  const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
  const [hours, setHours] = useState<Record<string, { open: string; close: string; closed: boolean }>>(
    listing.working_hours ?? Object.fromEntries(DAYS.map(d => [d, { open: '09:00', close: '18:00', closed: false }]))
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string|null>(null)

  useEffect(() => {
    supabase.from('services').select('*').eq('listing_id', listing.id).order('sort_order')
      .then(({ data }) => setRichServices(data ?? []))
  }, [listing.id])

  async function addRichService() {
    if (!newSvc.name) return
    const { data, error } = await supabase.from('services').insert([{
      listing_id: listing.id,
      name: newSvc.name,
      description: newSvc.description || null,
      price: newSvc.price ? Number(newSvc.price) : null,
      price_unit: newSvc.price_unit,
      is_active: true,
      sort_order: richServices.length,
    }]).select().single()
    if (error) { alert('Error: ' + error.message); return }
    if (data) setRichServices(prev => [...prev, data])
    setNewSvc({ name: '', description: '', price: '', price_unit: 'AED' })
    setAddingSvc(false)
  }

  async function deleteRichService(id: string) {
    await supabase.from('services').delete().eq('id', id)
    setRichServices(prev => prev.filter(s => s.id !== id))
  }

  async function saveHours() {
    setSaving(true)
    await supabase.from('listings').update({ working_hours: hours }).eq('id', listing.id)
    setSaving(false)
  }
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  function addService() {
    const s = newService.trim()
    if (!s || services.includes(s)) return
    setServices(prev => [...prev, s])
    setNewService('')
  }

  async function handleSave() {
    setSaving(true); setError(null)
    const emirateEnum = EMIRATE_ENUM[form.emirate] || form.emirate.toLowerCase().replace(/\s+/g, '_')
    const { data, error: err } = await supabase.from('listings').update({
      name: form.name,
      tagline: form.tagline || null,
      description: form.description || null,
      phone: form.phone,
      whatsapp: form.whatsapp || form.phone,
      email: form.email || null,
      website: form.website || null,
      area: form.area || null,
      address: form.address || null,
      google_map_url: form.google_map_url || null,
      emirate: emirateEnum || null,
      services,
    }).eq('id', listing.id).select().single()
    setSaving(false)
    if (err) { setError(err.message); return }
    onSaved(data)
    onClose()
  }

  const tabs = [
    { key: 'details',  label: '📋 Details'  },
    { key: 'services', label: '⚡ Services'  },
    { key: 'hours',    label: '🕐 Hours'     },
    { key: 'map',      label: '📍 Map'       },
  ] as const

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 px-0 sm:px-4">
      <div className="bg-white w-full sm:max-w-2xl rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <h2 className="font-serif font-bold text-kerala-deep text-lg">Edit Listing</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100"><X size={18} className="text-gray-400"/></button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 pt-4 flex-shrink-0">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${tab === t.key ? 'bg-kerala-green text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
          {/* Details tab */}
          {tab === 'details' && <>
            {[
              { label: 'Business Name', key: 'name', required: true },
              { label: 'Tagline', key: 'tagline' },
              { label: 'Phone', key: 'phone', required: true },
              { label: 'WhatsApp', key: 'whatsapp' },
              { label: 'Email', key: 'email' },
              { label: 'Website', key: 'website' },
              { label: 'Area', key: 'area' },
              { label: 'Address', key: 'address' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">{f.label}{f.required && <span className="text-red-500 ml-0.5">*</span>}</label>
                <input value={(form as any)[f.key]} onChange={set(f.key)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-kerala-green focus:ring-2 focus:ring-kerala-green/10"/>
              </div>
            ))}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Emirate <span className="text-red-500">*</span></label>
              <select value={form.emirate} onChange={e => setForm(f => ({ ...f, emirate: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-kerala-green focus:ring-2 focus:ring-kerala-green/10 text-gray-700 bg-white">
                <option value="">Select emirate</option>
                {EMIRATES_LIST.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Description</label>
              <textarea value={form.description} onChange={set('description')} rows={4}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-kerala-green focus:ring-2 focus:ring-kerala-green/10 resize-none"/>
            </div>
          </>}

          {/* Services tab */}
          {tab === 'services' && <>
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-400">Rich service cards shown on the Services tab of your listing page.</p>
              <button onClick={() => setAddingSvc(true)} className="flex items-center gap-1 bg-kerala-green text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:opacity-90">
                <Plus size={13}/> Add Service
              </button>
            </div>

            {addingSvc && (
              <div className="bg-gray-50 rounded-xl p-4 space-y-3 border border-gray-200">
                <p className="text-xs font-semibold text-gray-600">New Service</p>
                <input value={newSvc.name} onChange={e => setNewSvc(p => ({...p, name: e.target.value}))}
                  placeholder="Service name *" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-kerala-green"/>
                <textarea value={newSvc.description} onChange={e => setNewSvc(p => ({...p, description: e.target.value}))}
                  placeholder="Short description (optional)" rows={2}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-kerala-green resize-none"/>
                <div className="flex gap-2">
                  <input value={newSvc.price} onChange={e => setNewSvc(p => ({...p, price: e.target.value}))}
                    placeholder="Price (optional)" type="number"
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-kerala-green"/>
                  <select value={newSvc.price_unit} onChange={e => setNewSvc(p => ({...p, price_unit: e.target.value}))}
                    className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-kerala-green bg-white">
                    {['AED','USD','OMR','SAR','KWD'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="flex gap-2">
                  <button onClick={addRichService} className="flex-1 bg-kerala-green text-white py-2 rounded-xl text-sm font-semibold hover:opacity-90">Save</button>
                  <button onClick={() => setAddingSvc(false)} className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-xl text-sm font-semibold">Cancel</button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {richServices.length === 0 && !addingSvc && <p className="text-sm text-gray-400 text-center py-4">No services added yet</p>}
              {richServices.map(s => (
                <div key={s.id} className="flex items-start justify-between bg-white border border-gray-100 rounded-xl p-3 gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-kerala-deep">{s.name}</p>
                    {s.description && <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{s.description}</p>}
                    {s.price != null && <p className="text-xs font-bold text-kerala-gold mt-0.5">{s.price_unit} {s.price}</p>}
                  </div>
                  <button onClick={() => deleteRichService(s.id)} className="text-red-400 hover:text-red-600 flex-shrink-0 mt-0.5">
                    <Trash2 size={14}/>
                  </button>
                </div>
              ))}
            </div>
          </>}

          {/* Hours tab */}
          {tab === 'hours' && <>
            <p className="text-xs text-gray-400 mb-2">Set your working hours for each day. These show on your listing's Contact tab.</p>
            <div className="space-y-2">
              {DAYS.map(day => (
                <div key={day} className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-gray-600 w-24 shrink-0">{day}</span>
                  <input type="time" value={hours[day].open} disabled={hours[day].closed}
                    onChange={e => setHours(h => ({...h, [day]: {...h[day], open: e.target.value}}))}
                    className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-kerala-green disabled:opacity-40 disabled:bg-gray-50"/>
                  <span className="text-xs text-gray-400">to</span>
                  <input type="time" value={hours[day].close} disabled={hours[day].closed}
                    onChange={e => setHours(h => ({...h, [day]: {...h[day], close: e.target.value}}))}
                    className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-kerala-green disabled:opacity-40 disabled:bg-gray-50"/>
                  <label className="flex items-center gap-1.5 ml-auto cursor-pointer">
                    <input type="checkbox" checked={hours[day].closed}
                      onChange={e => setHours(h => ({...h, [day]: {...h[day], closed: e.target.checked}}))}
                      className="w-3.5 h-3.5 accent-red-500"/>
                    <span className="text-xs text-gray-500">Closed</span>
                  </label>
                </div>
              ))}
            </div>
            <button onClick={saveHours} disabled={saving}
              className="w-full bg-kerala-green text-white py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2 mt-2">
              {saving ? <><Loader2 size={14} className="animate-spin"/>Saving…</> : 'Save Hours'}
            </button>
          </>}

          {/* Map tab */}
          {tab === 'map' && <>
            <p className="text-xs text-gray-400">Paste your Google Maps link so customers can find your exact location.</p>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Google Maps URL</label>
              <input value={form.google_map_url} onChange={set('google_map_url')}
                placeholder="https://maps.google.com/?q=..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-kerala-green focus:ring-2 focus:ring-kerala-green/10"/>
              <p className="text-xs text-gray-400 mt-2">
                Go to Google Maps → find your business → click Share → Copy Link → paste here
              </p>
            </div>
            {form.google_map_url && (
              <a href={form.google_map_url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-kerala-green font-semibold hover:underline">
                <MapPin size={15}/> Preview on Google Maps
              </a>
            )}
          </>}

          {error && <div className="bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex gap-3 flex-shrink-0">
          <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50">Cancel</button>
          <button onClick={handleSave} disabled={saving || !form.name || !form.phone}
            className="flex-1 bg-kerala-green text-white py-3 rounded-xl font-semibold text-sm hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2">
            {saving ? <><Loader2 size={15} className="animate-spin"/>Saving…</> : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

function GalleryModal({ listing, onClose }: { listing: any; onClose: () => void }) {
  const [images, setImages] = useState<any[]>([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string|null>(null)
  const [primaryUrl, setPrimaryUrl] = useState<string>(listing.logo_url ?? '')
  const [coverUrl, setCoverUrl] = useState<string>(listing.cover_url ?? '')

  useEffect(() => {
    supabase.from('listing_images').select('*').eq('listing_id', listing.id).order('created_at')
      .then(({ data }) => setImages(data ?? []))
  }, [listing.id])

  async function syncGalleryUrls(imgs: any[]) {
    const urls = imgs.map((i: any) => i.url)
    await supabase.from('listings').update({ gallery_urls: urls }).eq('id', listing.id)
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true); setError(null)
    const ext = file.name.split('.').pop()
    const path = `listings/${listing.id}/${Date.now()}.${ext}`
    const { error: upErr } = await supabase.storage.from('listing-images').upload(path, file)
    if (upErr) { setError(upErr.message); setUploading(false); return }
    const { data: { publicUrl } } = supabase.storage.from('listing-images').getPublicUrl(path)
    const { data: row, error: dbErr } = await supabase.from('listing_images').insert([{ listing_id: listing.id, url: publicUrl, path }]).select().single()
    if (dbErr) { setError(dbErr.message); setUploading(false); return }
    if (row) {
      const next = [...images, row]
      setImages(next)
      await syncGalleryUrls(next)
    }
    setUploading(false)
  }

  async function handleDelete(img: any) {
    await supabase.storage.from('listing-images').remove([img.path])
    await supabase.from('listing_images').delete().eq('id', img.id)
    const next = images.filter(i => i.id !== img.id)
    setImages(next)
    await syncGalleryUrls(next)
    if (primaryUrl === img.url) { setPrimaryUrl(''); await supabase.from('listings').update({ logo_url: null }).eq('id', listing.id) }
    if (coverUrl === img.url) { setCoverUrl(''); await supabase.from('listings').update({ cover_url: null }).eq('id', listing.id) }
  }

  async function setPrimary(url: string) {
    setPrimaryUrl(url)
    await supabase.from('listings').update({ logo_url: url }).eq('id', listing.id)
  }

  async function setCover(url: string) {
    setCoverUrl(url)
    await supabase.from('listings').update({ cover_url: url }).eq('id', listing.id)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 px-0 sm:px-4">
      <div className="bg-white w-full sm:max-w-2xl rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 className="font-serif font-bold text-kerala-deep text-lg">Photo Gallery</h2>
            <p className="text-xs text-gray-400 mt-0.5">{listing.name}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100"><X size={18} className="text-gray-400"/></button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-5">
          {error && <div className="bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}
          {images.length > 0 && (
            <div className="flex gap-4 mb-4 text-xs text-gray-500 bg-gray-50 rounded-xl px-4 py-3">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-kerala-green inline-block"/>= Profile photo</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-kerala-gold inline-block"/>= Cover photo</span>
              <span className="text-gray-400">Hover an image to set</span>
            </div>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
            {images.map(img => {
              const isPrimary = primaryUrl === img.url
              const isCover = coverUrl === img.url
              return (
                <div key={img.id} className={`relative group aspect-square rounded-xl overflow-hidden bg-gray-100 ring-2 ${isPrimary ? 'ring-kerala-green' : isCover ? 'ring-kerala-gold' : 'ring-transparent'}`}>
                  <Image src={img.url} alt="" fill className="object-cover"/>
                  {/* Badges */}
                  {isPrimary && <span className="absolute top-1 left-1 bg-kerala-green text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">Profile</span>}
                  {isCover && <span className="absolute top-1 left-1 bg-kerala-gold text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">Cover</span>}
                  {/* Hover actions */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-2">
                    {!isPrimary && (
                      <button onClick={() => setPrimary(img.url)} className="w-full bg-kerala-green text-white text-[10px] font-semibold py-1 rounded-lg">
                        Set as Profile
                      </button>
                    )}
                    {!isCover && (
                      <button onClick={() => setCover(img.url)} className="w-full bg-kerala-gold text-white text-[10px] font-semibold py-1 rounded-lg">
                        Set as Cover
                      </button>
                    )}
                    <button onClick={() => handleDelete(img)} className="w-full bg-red-500 text-white text-[10px] font-semibold py-1 rounded-lg">
                      Delete
                    </button>
                  </div>
                </div>
              )
            })}
            <label className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-kerala-green hover:bg-kerala-green/5 transition-colors">
              {uploading ? <Loader2 size={24} className="animate-spin text-kerala-green"/> : <>
                <Upload size={24} className="text-gray-400 mb-2"/>
                <span className="text-xs text-gray-400 font-medium">Add Photo</span>
              </>}
              <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading}/>
            </label>
          </div>
          <p className="text-xs text-gray-400 text-center">Photos help customers find and trust your business</p>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex-shrink-0">
          <button onClick={onClose} className="w-full bg-kerala-green text-white py-3 rounded-xl font-semibold text-sm hover:opacity-90">Done</button>
        </div>
      </div>
    </div>
  )
}

const PLAN_LISTING_LIMITS: Record<string, number> = { free: 1, basic: 3, premium: 10, elite: 999 }

function ListingsSection({ isMl, listings, loading, userId, userEmail, ownerName }: { isMl: boolean; listings: any[]; loading: boolean; userId: string; userEmail?: string; ownerName?: string }) {
  const locale = isMl ? 'ml' : 'en'
  const [filter, setFilter] = useState<'all' | 'active' | 'pending'>('all')
  const [showModal, setShowModal] = useState(false)
  const [editListing, setEditListing] = useState<any|null>(null)
  const [galleryListing, setGalleryListing] = useState<any|null>(null)
  const [listingData, setListingData] = useState<any[]>(listings)

  useEffect(() => { setListingData(listings) }, [listings])
  const statuses = ['all', 'active', 'pending'] as const
  const statusLabels: Record<typeof statuses[number], string> = {
    all: isMl ? 'എല്ലാം' : 'All',
    active: isMl ? 'ആക്ടീവ്' : 'Active',
    pending: isMl ? 'കാത്തിരിക്കുന്നു' : 'Pending',
  }

  const filtered = filter === 'all' ? listingData : listingData.filter(b => b.status === filter)

  // Determine user's best plan from their listings
  const topPlan = listingData.reduce((best, l) => {
    const order = ['free','basic','premium','elite']
    return order.indexOf(l.plan) > order.indexOf(best) ? l.plan : best
  }, 'free')
  const listingLimit = PLAN_LISTING_LIMITS[topPlan] ?? 1
  const atLimit = listingData.length >= listingLimit

  return (
    <div className="space-y-5">
      {showModal && <AddListingModal isMl={isMl} onClose={() => setShowModal(false)} onSuccess={() => { supabase.from('listings').select('id,slug,name,name_ml,tagline,description,logo_url,cover_url,emirate,area,address,phone,whatsapp,website,email,plan,status,is_featured,is_verified,rating_avg,review_count,views_count,category_id,created_at,services,google_map_url,categories(name,name_ml,slug)').eq('owner_id',userId).order('created_at',{ascending:false}).then(({data})=>setListingData(data??[])) }} userId={userId} userEmail={userEmail} ownerName={ownerName} />}
      {editListing && <EditListingModal listing={editListing} onClose={() => setEditListing(null)} onSaved={updated => setListingData(prev => prev.map(l => l.id === updated.id ? updated : l))} />}
      {galleryListing && <GalleryModal listing={galleryListing} onClose={() => setGalleryListing(null)} />}
      <SectionHeader title={isMl ? 'എന്റെ ലിസ്റ്റിംഗ്' : 'My Listings'} />

      <div className="flex flex-wrap items-center gap-3 justify-between">
        {/* Status filter */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
          {statuses.map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                filter === s ? 'bg-white text-kerala-deep shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {statusLabels[s]}
            </button>
          ))}
        </div>
        {atLimit ? (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold px-4 py-2.5 rounded-xl">
            <Shield size={13}/>
            {topPlan === 'free' ? 'Free plan: 1 listing max — upgrade for more' : `${topPlan} plan: ${listingLimit} listings max`}
          </div>
        ) : (
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-kerala-green text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity">
            <Plus size={15} />
            {isMl ? 'ലിസ്റ്റിംഗ് ചേർക്കൂ' : 'Add New Listing'}
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 size={28} className="animate-spin text-kerala-green"/></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
          <Building2 size={36} className="mx-auto mb-3 text-gray-300"/>
          <p className="font-semibold text-kerala-deep">{isMl ? 'ലിസ്റ്റിംഗ് ഒന്നും ഇല്ല' : 'No listings yet'}</p>
          <p className="text-sm text-gray-400 mt-1 mb-4">{isMl ? 'ആദ്യ ലിസ്റ്റിംഗ് ചേർക്കൂ' : 'Add your first business listing'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((biz: any) => (
            <div key={biz.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-4">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                {(biz.logo_url || biz.cover_url) && (
                  <Image src={biz.logo_url || biz.cover_url} alt={biz.name} fill className="object-cover" sizes="64px"/>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="font-serif font-semibold text-kerala-deep text-sm">{isMl && biz.name_ml ? biz.name_ml : biz.name}</h3>
                  {biz.is_verified && <CheckCircle size={13} className="text-kerala-green flex-shrink-0"/>}
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                    biz.plan === 'elite' || biz.plan === 'premium' ? 'bg-kerala-gold/15 text-kerala-gold'
                    : biz.plan === 'basic' ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-500'
                  }`}>{biz.plan}</span>
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-2">
                  <span className="flex items-center gap-1"><MapPin size={11}/>{[biz.area, biz.emirate].filter(Boolean).join(', ')}</span>
                  <span className="flex items-center gap-1"><Eye size={11}/>{(biz.views_count || 0).toLocaleString()} {isMl ? 'കാഴ്ച' : 'views'}</span>
                  <span className="flex items-center gap-1"><Star size={11}/>{Number(biz.rating_avg || 0).toFixed(1)} ({biz.review_count || 0})</span>
                </div>
                <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                  biz.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-600'
                }`}>
                  {biz.status === 'active' ? (isMl ? 'ആക്ടീവ്' : 'Active') : (isMl ? 'കാത്തിരിക്കുന്നു' : biz.status)}
                </span>
              </div>
              <div className="flex flex-col gap-2 flex-shrink-0">
                <Link href={`/company/${biz.slug}`}
                  className="text-xs font-semibold text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 text-center whitespace-nowrap">
                  {isMl ? 'കാണൂ' : 'View'}
                </Link>
                <button onClick={() => setEditListing(biz)}
                  className="text-xs font-semibold text-kerala-green border border-kerala-green/30 px-3 py-1.5 rounded-lg hover:bg-kerala-green/5 text-center whitespace-nowrap flex items-center justify-center gap-1">
                  <Edit3 size={11}/> Edit
                </button>
                <button onClick={() => setGalleryListing(biz)}
                  className="text-xs font-semibold text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 text-center whitespace-nowrap flex items-center justify-center gap-1">
                  <Upload size={11}/> Gallery
                </button>
                <button onClick={async () => {
                  if (!confirm('Delete this listing? This cannot be undone.')) return
                  await supabase.from('listings').delete().eq('id', biz.id)
                  setListingData(prev => prev.filter(l => l.id !== biz.id))
                }}
                  className="text-xs font-semibold text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 text-center whitespace-nowrap flex items-center justify-center gap-1">
                  <Trash2 size={11}/> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ShopManagerSection({ isMl, listings }: { isMl: boolean; listings: any[] }) {
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedListingId, setSelectedListingId] = useState(listings[0]?.id || '')
  const [shopItems, setShopItems] = useState<ShopListingRow[]>([])
  const [shopLoading, setShopLoading] = useState(false)
  const [addForm, setAddForm] = useState({ name: '', name_ml: '', price: '', description: '' })
  const [addSaving, setAddSaving] = useState(false)

  useEffect(() => {
    if (!selectedListingId) return
    setShopLoading(true)
    getShopListings(selectedListingId).then(items => { setShopItems(items); setShopLoading(false) })
  }, [selectedListingId])

  const refreshShop = () => {
    if (!selectedListingId) return
    getShopListings(selectedListingId).then(setShopItems)
  }

  const handleAddProduct = async () => {
    if (!addForm.name || !addForm.price || !selectedListingId) return
    setAddSaving(true)
    await supabase.from('shop_listings').insert({
      listing_id:   selectedListingId,
      name:         addForm.name,
      name_ml:      addForm.name_ml || null,
      description:  addForm.description || null,
      price:        Number(addForm.price),
      listing_type: 'product',
      stock_status: 'in_stock',
      is_active:    true,
    })
    setAddSaving(false)
    setShowAddModal(false)
    setAddForm({ name: '', name_ml: '', price: '', description: '' })
    refreshShop()
  }

  const handleDelete = async (id: string) => {
    await supabase.from('shop_listings').delete().eq('id', id)
    setShopItems(prev => prev.filter(p => p.id !== id))
  }

  const lowStock = shopItems.some(p => p.stock_status === 'out_of_stock')

  return (
    <div className="space-y-5">
      <SectionHeader title={isMl ? 'ഷോപ്പ് മാനേജർ' : 'Shop Manager'} />

      {lowStock && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl p-4">
          <AlertTriangle size={18} className="flex-shrink-0 text-amber-500" />
          <p className="text-sm font-medium">
            {isMl ? 'ചില ഉൽപ്പന്നങ്ങൾക്ക് സ്റ്റോക്ക് കുറഞ്ഞു. ഉടൻ നിരക്ക് പുതുക്കൂ.' : 'Some products have low stock. Please restock soon.'}
          </p>
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-kerala-green text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
        >
          <Plus size={15} />
          {isMl ? 'ഉൽപ്പന്നം ചേർക്കൂ' : 'Add Product'}
        </button>
      </div>

      <div className="space-y-3">
        {shopLoading ? (
          <div className="flex justify-center py-12"><Loader2 size={28} className="animate-spin text-kerala-green"/></div>
        ) : shopItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
            <ShoppingBag size={36} className="mx-auto mb-3 text-gray-300"/>
            <p className="font-semibold text-kerala-deep">{isMl ? 'ഉൽപ്പന്നം ഒന്നും ഇല്ല' : 'No products yet'}</p>
            <p className="text-sm text-gray-400 mt-1 mb-4">{isMl ? 'ആദ്യ ഉൽപ്പന്നം ചേർക്കൂ' : 'Add your first product to start selling'}</p>
            <button onClick={() => setShowAddModal(true)} className="bg-kerala-green text-white text-sm font-semibold px-4 py-2 rounded-xl hover:opacity-90">
              {isMl ? 'ഉൽപ്പന്നം ചേർക്കൂ' : 'Add Product'}
            </button>
          </div>
        ) : shopItems.map(p => (
          <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-4 items-center">
            <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center">
              {p.image_url
                ? <Image src={p.image_url} alt={p.name} fill className="object-cover" sizes="56px" />
                : <ShoppingBag size={20} className="text-gray-300" />
              }
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-kerala-deep text-sm">{isMl && p.name_ml ? p.name_ml : p.name}</h4>
              <div className="flex flex-wrap gap-3 text-xs text-gray-500 mt-1">
                <span className="text-kerala-gold font-bold">AED {p.price}</span>
                <span className={`font-semibold ${
                  p.stock_status === 'out_of_stock' ? 'text-red-500'
                  : p.stock_status === 'pre_order' ? 'text-amber-500'
                  : 'text-green-600'
                }`}>
                  {p.stock_status === 'out_of_stock' ? (isMl ? 'സ്റ്റോക്ക് ഇല്ല' : 'Out of stock')
                   : p.stock_status === 'pre_order' ? (isMl ? 'പ്രീ-ഓർഡർ' : 'Pre-order')
                   : (isMl ? 'സ്റ്റോക്ക് ഉണ്ട്' : 'In stock')}
                </span>
                <span className="capitalize text-gray-400">{p.listing_type}</span>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => handleDelete(p.id)}
                className="text-xs text-red-500 border border-red-100 px-3 py-1.5 rounded-lg hover:bg-red-50"
              >
                <Trash2 size={12} className="inline mr-1" />{isMl ? 'ഡിലീറ്റ്' : 'Delete'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-serif font-bold text-kerala-deep text-lg">{isMl ? 'ഉൽപ്പന്നം ചേർക്കൂ' : 'Add New Product'}</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{isMl ? 'ഉൽപ്പന്ന നാമം (EN)' : 'Product Name (EN)'}</label>
                <input type="text" value={addForm.name} onChange={e => setAddForm(f => ({...f, name: e.target.value}))}
                  placeholder="e.g. Malabar Biryani Kit"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 focus:border-kerala-green bg-gray-50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{isMl ? 'ഉൽപ്പന്ന നാമം (ML)' : 'Product Name (ML)'}</label>
                <input type="text" value={addForm.name_ml} onChange={e => setAddForm(f => ({...f, name_ml: e.target.value}))}
                  placeholder="ഉദാ. മലബാർ ബിരിയാണി കിറ്റ്"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 focus:border-kerala-green bg-gray-50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{isMl ? 'വില (AED)' : 'Price (AED)'}</label>
                <input type="number" value={addForm.price} onChange={e => setAddForm(f => ({...f, price: e.target.value}))}
                  placeholder="0.00"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 focus:border-kerala-green bg-gray-50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{isMl ? 'വിവരണം' : 'Description'}</label>
                <textarea value={addForm.description} onChange={e => setAddForm(f => ({...f, description: e.target.value}))}
                  placeholder={isMl ? 'ഉൽപ്പന്ന വിവരണം...' : 'Brief product description...'}
                  rows={2}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 focus:border-kerala-green bg-gray-50 resize-none" />
              </div>
              <div className="flex gap-3 pt-1">
                <button onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">
                  {isMl ? 'റദ്ദാക്കൂ' : 'Cancel'}
                </button>
                <button onClick={handleAddProduct} disabled={addSaving || !addForm.name || !addForm.price}
                  className="flex-1 px-4 py-2.5 bg-kerala-green text-white rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2">
                  {addSaving ? <><Loader2 size={14} className="animate-spin"/>{isMl ? 'ചേർക്കുന്നു...' : 'Saving...'}</> : (isMl ? 'ചേർക്കൂ' : 'Add Product')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Classifieds Section ──────────────────────────────────────────────────────
const EMIRATES = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain']
const CLASSIFIED_TYPES = ['sale', 'rent', 'wanted', 'service'] as const

function ClassifiedsSection({ isMl, userId }: { isMl: boolean; userId: string }) {
  const [items, setItems]           = useState<Classified[]>([])
  const [loading, setLoading]       = useState(true)
  const [showAdd, setShowAdd]       = useState(false)
  const [saving, setSaving]         = useState(false)
  const [saveError, setSaveError]   = useState('')
  const [form, setForm] = useState({
    title: '', description: '', category: classifiedCategories[0].slug,
    type: 'sale' as typeof CLASSIFIED_TYPES[number],
    price: '', emirate: 'Dubai', phone: '', whatsapp: '',
  })

  const refresh = () => getMyClassifieds(userId).then(d => { setItems(d); setLoading(false) })
  useEffect(() => { refresh() }, [userId])

  const handleAdd = async () => {
    if (!form.title || !form.emirate) return
    setSaving(true); setSaveError('')
    const result = await createClassified({
      title: form.title, title_ml: null,
      description: form.description || null, description_ml: null,
      category: form.category, category_ml: null, subcategory: null,
      price: form.price || null, price_numeric: form.price ? Number(form.price) : null,
      negotiable: false, type: form.type, condition: null,
      emirate: form.emirate, location: null, location_ml: null,
      images: [], featured: false, urgent: false,
      phone: form.phone || null, whatsapp: form.whatsapp || null,
      seller_name: null, seller_name_ml: null, seller_avatar: null,
      owner_id: userId,
    })
    setSaving(false)
    if (!result) { setSaveError('Failed to post classified. Please try again.'); return }
    setShowAdd(false)
    setForm({ title: '', description: '', category: classifiedCategories[0].slug, type: 'sale', price: '', emirate: 'Dubai', phone: '', whatsapp: '' })
    refresh()
  }

  const handleDelete = async (id: number) => {
    await supabase.from('classifieds').delete().eq('id', id)
    setItems(prev => prev.filter(c => c.id !== id))
  }

  return (
    <div className="space-y-5">
      <SectionHeader title={isMl ? 'ക്ലാസിഫൈഡ്സ്' : 'Classifieds'} />
      <div className="flex justify-end">
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 bg-kerala-green text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:opacity-90">
          <Plus size={15} />{isMl ? 'ക്ലാസിഫൈഡ് ചേർക്കൂ' : 'Post Classified'}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 size={28} className="animate-spin text-kerala-green"/></div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
          <Tag size={36} className="mx-auto mb-3 text-gray-300"/>
          <p className="font-semibold text-kerala-deep">{isMl ? 'ക്ലാസിഫൈഡ് ഒന്നും ഇല്ല' : 'No classifieds yet'}</p>
          <p className="text-sm text-gray-400 mt-1 mb-4">{isMl ? 'ആദ്യ ക്ലാസിഫൈഡ് ചേർക്കൂ' : 'Post your first classified ad'}</p>
          <button onClick={() => setShowAdd(true)} className="bg-kerala-green text-white text-sm font-semibold px-4 py-2 rounded-xl hover:opacity-90">
            {isMl ? 'ക്ലാസിഫൈഡ് ചേർക്കൂ' : 'Post Classified'}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(c => (
            <div key={c.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-4 items-start">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-semibold text-kerala-deep text-sm">{c.title}</h4>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${c.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{c.status}</span>
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-gray-500 mt-1">
                  <span>{c.category}</span>
                  <span className="capitalize">{c.type}</span>
                  <span>{c.emirate}</span>
                  {c.price && <span className="text-kerala-gold font-bold">AED {c.price}</span>}
                </div>
                {c.description && <p className="text-xs text-gray-400 mt-1 line-clamp-2">{c.description}</p>}
              </div>
              <button onClick={() => handleDelete(c.id)} className="text-xs text-red-500 border border-red-100 px-3 py-1.5 rounded-lg hover:bg-red-50 flex-shrink-0">
                <Trash2 size={12} className="inline mr-1"/>Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-serif font-bold text-kerala-deep text-lg">{isMl ? 'ക്ലാസിഫൈഡ് ചേർക്കൂ' : 'Post Classified'}</h3>
              <button onClick={() => setShowAdd(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{isMl ? 'തലക്കെട്ട്' : 'Title'} *</label>
                <input type="text" value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} placeholder="e.g. iPhone 14 for sale" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 focus:border-kerala-green bg-gray-50" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{isMl ? 'വിഭാഗം' : 'Category'}</label>
                  <select value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 focus:border-kerala-green bg-gray-50">
                    {classifiedCategories.map(c => <option key={c.slug} value={c.slug}>{c.icon} {c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{isMl ? 'തരം' : 'Type'}</label>
                  <select value={form.type} onChange={e => setForm(f => ({...f, type: e.target.value as typeof CLASSIFIED_TYPES[number]}))} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 focus:border-kerala-green bg-gray-50">
                    {CLASSIFIED_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{isMl ? 'വില (AED)' : 'Price (AED)'}</label>
                  <input type="number" value={form.price} onChange={e => setForm(f => ({...f, price: e.target.value}))} placeholder="Optional" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 focus:border-kerala-green bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{isMl ? 'എമിറേറ്റ്' : 'Emirate'}</label>
                  <select value={form.emirate} onChange={e => setForm(f => ({...f, emirate: e.target.value}))} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 focus:border-kerala-green bg-gray-50">
                    {EMIRATES.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{isMl ? 'വിവരണം' : 'Description'}</label>
                <textarea value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} rows={3} placeholder={isMl ? 'വിശദാംശങ്ങൾ...' : 'Details about your ad...'} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 focus:border-kerala-green bg-gray-50 resize-none"/>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{isMl ? 'ഫോൺ' : 'Phone'}</label>
                  <input type="tel" value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} placeholder="+971..." className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 focus:border-kerala-green bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">WhatsApp</label>
                  <input type="tel" value={form.whatsapp} onChange={e => setForm(f => ({...f, whatsapp: e.target.value}))} placeholder="+971..." className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 focus:border-kerala-green bg-gray-50" />
                </div>
              </div>
              {saveError && <p className="text-red-500 text-xs">{saveError}</p>}
              <div className="flex gap-3 pt-1">
                <button onClick={() => setShowAdd(false)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">{isMl ? 'റദ്ദാക്കൂ' : 'Cancel'}</button>
                <button onClick={handleAdd} disabled={saving || !form.title} className="flex-1 px-4 py-2.5 bg-kerala-green text-white rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2">
                  {saving ? <><Loader2 size={14} className="animate-spin"/>{isMl ? 'ചേർക്കുന്നു...' : 'Posting...'}</> : (isMl ? 'ചേർക്കൂ' : 'Post Ad')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function OrdersSection({ isMl }: { isMl: boolean }) {
  return (
    <div className="space-y-5">
      <SectionHeader title={isMl ? 'ഓർഡറുകൾ' : 'Orders'} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
          <div className="font-serif font-bold text-2xl text-kerala-deep">0</div>
          <div className="text-xs text-gray-500 mt-1">{isMl ? 'മൊത്തം ഓർഡർ' : 'Total Orders'}</div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
          <div className="font-serif font-bold text-2xl text-amber-600">0</div>
          <div className="text-xs text-gray-500 mt-1">{isMl ? 'കാത്തിരിക്കുന്നു' : 'Pending'}</div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
          <div className="font-serif font-bold text-xl text-kerala-green">AED 0</div>
          <div className="text-xs text-gray-500 mt-1">{isMl ? 'ഈ മാസം' : 'This Month'}</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center">
        <ShoppingCart size={40} className="mx-auto mb-4 text-gray-200" />
        <p className="font-semibold text-kerala-deep mb-1">
          {isMl ? 'ഓർഡർ ഒന്നും ഇല്ല' : 'No orders yet'}
        </p>
        <p className="text-sm text-gray-400 max-w-sm mx-auto">
          {isMl
            ? 'ഉപഭോക്താക്കൾ ഷോപ്പ് വഴി ഓർഡർ ചെയ്യുമ്പോൾ ഇവിടെ കാണാം'
            : 'Orders placed by customers through your shop will appear here'}
        </p>
      </div>
    </div>
  )
}

function EnquiriesSection({ isMl }: { isMl: boolean }) {
  return (
    <div className="space-y-5">
      <SectionHeader title={isMl ? 'അന്വേഷണങ്ങൾ' : 'Enquiries'} />

      <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center">
        <MessageSquare size={40} className="mx-auto mb-4 text-gray-200" />
        <p className="font-semibold text-kerala-deep mb-1">
          {isMl ? 'അന്വേഷണം ഒന്നും ഇല്ല' : 'No enquiries yet'}
        </p>
        <p className="text-sm text-gray-400 max-w-sm mx-auto">
          {isMl
            ? 'ഉപഭോക്താക്കൾ WhatsApp അല്ലെങ്കിൽ ഫോൺ വഴി ബന്ധപ്പെടുന്നതാണ്. ഇൻ-ആപ്പ് മെസ്സേജിംഗ് ഉടൻ ലഭ്യമാകും.'
            : 'Customers currently reach you via WhatsApp or phone. In-app messaging is coming soon.'}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-4 py-2.5">
            <CheckCircle size={15} className="text-green-500" />
            <span className="text-xs font-medium text-green-700">{isMl ? 'WhatsApp ആക്ടീവ്' : 'WhatsApp Active'}</span>
          </div>
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5">
            <CheckCircle size={15} className="text-blue-500" />
            <span className="text-xs font-medium text-blue-700">{isMl ? 'ഫോൺ ആക്ടീവ്' : 'Phone Active'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function AnalyticsSection({ isMl, listings }: { isMl: boolean; listings: any[] }) {
  const totalViews   = listings.reduce((s, l) => s + (l.views_count  || 0), 0)
  const totalReviews = listings.reduce((s, l) => s + (l.review_count || 0), 0)
  const [range, setRange] = useState<'7d' | '30d' | '3m'>('7d')
  const rangeLabels = {
    '7d': isMl ? 'കഴിഞ്ഞ 7 ദിവസം' : 'Last 7 Days',
    '30d': isMl ? '30 ദിവസം' : '30 Days',
    '3m': isMl ? '3 മാസം' : '3 Months',
  }

  return (
    <div className="space-y-6">
      <SectionHeader title={isMl ? 'അനലിറ്റിക്സ്' : 'Analytics'} />

      {/* Date range */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {(['7d', '30d', '3m'] as const).map(r => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              range === r ? 'bg-white text-kerala-deep shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {rangeLabels[r]}
          </button>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Profile Views chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-serif font-bold text-kerala-deep mb-4">{isMl ? 'ആഴ്ചതോറുമുള്ള കാഴ്ചകൾ' : 'Profile Views by Week'}</h3>
          <div className="flex items-end gap-3 h-24 sm:h-32">
            {analyticsWeeks.map(d => (
              <div key={d.week} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full relative h-20 sm:h-28">
                  <div
                    className="absolute bottom-0 w-full bg-kerala-green rounded-t-lg"
                    style={{ height: `${Math.round((d.views / maxAnalyticsViews) * 100)}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400">{d.week}</span>
                <span className="text-xs font-semibold text-kerala-deep">{(d.views / 1000).toFixed(1)}k</span>
              </div>
            ))}
          </div>
        </div>

        {/* Enquiries chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-serif font-bold text-kerala-deep mb-4">{isMl ? 'ആഴ്ചതോറുമുള്ള അന്വേഷണം' : 'Enquiries by Week'}</h3>
          <div className="flex items-end gap-3 h-24 sm:h-32">
            {analyticsWeeks.map(d => (
              <div key={d.week} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full relative h-20 sm:h-28">
                  <div
                    className="absolute bottom-0 w-full bg-kerala-gold rounded-t-lg"
                    style={{ height: `${Math.round((d.enquiries / maxAnalyticsEnquiries) * 100)}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400">{d.week}</span>
                <span className="text-xs font-semibold text-kerala-deep">{d.enquiries}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Top keywords */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-serif font-bold text-kerala-deep mb-4">{isMl ? 'ടോപ് കീവേഡ്' : 'Top Search Keywords'}</h3>
          <div className="space-y-3">
            {topKeywords.map((k, i) => (
              <div key={k.kw} className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-kerala-cream text-kerala-green text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-700 truncate">{isMl ? k.kwMl : k.kw}</p>
                </div>
                <span className="text-xs font-semibold text-gray-500 flex-shrink-0">{k.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Metrics */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-serif font-bold text-kerala-deep mb-4">{isMl ? 'മെട്രിക്സ്' : 'Key Metrics'}</h3>
          <div className="space-y-4">
            {[
              { label: isMl ? 'ടോപ് ലിസ്റ്റിംഗ്' : 'Top Performing Listing', value: listings.length ? (listings.reduce((a, b) => (b.views_count||0) > (a.views_count||0) ? b : a)).name : '—' },
              { label: isMl ? 'മൊത്തം കാഴ്ചകൾ' : 'Total Views', value: listings.reduce((s, l) => s + (l.views_count||0), 0).toLocaleString() },
              { label: isMl ? 'മൊത്തം റിവ്യൂ' : 'Total Reviews', value: String(listings.reduce((s, l) => s + (l.review_count||0), 0)) },
              { label: isMl ? 'ശരാശരി റേറ്റിംഗ്' : 'Avg Rating', value: listings.length ? `${(listings.reduce((s,l)=>s+Number(l.rating_avg||0),0)/listings.length).toFixed(1)}/5` : '—' },
            ].map(m => (
              <div key={m.label} className="flex justify-between items-center">
                <span className="text-xs text-gray-500">{m.label}</span>
                <span className="text-xs font-bold text-kerala-deep">{m.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Emirate breakdown */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-serif font-bold text-kerala-deep mb-4">{isMl ? 'എമിറേറ്റ് ബ്രേക്ക്ഡൗൺ' : 'Visitors by Emirate'}</h3>
          <div className="space-y-3">
            {emirateBreakdown.map(e => (
              <div key={e.name}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600">{e.name}</span>
                  <span className="font-semibold text-kerala-deep">{e.pct}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-kerala-green rounded-full transition-all" style={{ width: `${e.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function JobsSection({ isMl, userId, locale }: { isMl: boolean; userId: string; locale: string }) {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return
    setLoading(true)
    supabase
      .from('jobs')
      .select('*')
      .eq('poster_id', userId)
      .order('created_at', { ascending: false })
      .then(({ data }) => { setJobs((data ?? []) as Job[]); setLoading(false) })
  }, [userId])

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div className="space-y-5">
      <SectionHeader title={isMl ? 'പോസ്റ്റ് ചെയ്ത ജോലി' : 'Jobs Posted'} />

      <div className="flex justify-end">
        <Link href={`/jobs`}
          className="flex items-center gap-2 bg-kerala-green text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity">
          <Plus size={15} />
          {isMl ? 'ജോലി പോസ്റ്റ് ചെയ്യൂ' : 'Post New Job'}
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 size={28} className="animate-spin text-kerala-green"/></div>
      ) : jobs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center">
          <Briefcase size={40} className="mx-auto mb-4 text-gray-200" />
          <p className="font-semibold text-kerala-deep mb-1">
            {isMl ? 'ജോലി ഒന്നും പോസ്റ്റ് ചെയ്തിട്ടില്ല' : 'No jobs posted yet'}
          </p>
          <p className="text-sm text-gray-400 max-w-sm mx-auto">
            {isMl ? 'ജോലി ഒഴിവ് പോസ്റ്റ് ചെയ്ത് യോഗ്യരായ ഉദ്യോഗാർഥികളെ കണ്ടെത്തൂ' : 'Post a job opening to find qualified candidates from our community'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map(job => (
            <div key={job.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-kerala-green/10 flex items-center justify-center flex-shrink-0">
                <Briefcase size={18} className="text-kerala-green" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-kerala-deep text-sm">{isMl && job.title_ml ? job.title_ml : job.title}</h4>
                <div className="flex flex-wrap gap-3 text-xs text-gray-500 mt-1">
                  <span>{isMl ? 'അപേക്ഷ:' : 'Applications:'} <strong className="text-kerala-deep">{job.applicants}</strong></span>
                  <span>{isMl ? 'പോസ്റ്റ്:' : 'Posted:'} {formatDate(job.created_at)}</span>
                  <span className={`font-semibold capitalize ${job.status === 'active' ? 'text-green-600' : 'text-gray-400'}`}>
                    {job.status === 'active' ? (isMl ? 'ആക്ടീവ്' : 'Active') : (isMl ? 'അടഞ്ഞു' : 'Closed')}
                  </span>
                  <span className="capitalize text-gray-400">{job.job_type?.replace('-', ' ')}</span>
                </div>
              </div>
              <Link href={`/jobs/${job.id}`}
                className="text-xs font-semibold text-kerala-green border border-kerala-green/30 px-3 py-1.5 rounded-lg hover:bg-kerala-green/5 flex-shrink-0">
                {isMl ? 'കാണൂ' : 'View'}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function BillingSection({ isMl, listings, locale }: { isMl: boolean; listings: any[]; locale: string }) {
  const topPlan = listings.length > 0
    ? listings.reduce((best, l) => {
        const order = ['elite', 'premium', 'basic', 'free']
        return order.indexOf(l.plan) < order.indexOf(best) ? l.plan : best
      }, listings[0]?.plan ?? 'free')
    : 'free'

  const planDetails: Record<string, { name: string; nameMl: string; price: string; color: string; features: string[] }> = {
    elite:   { name: 'Elite Plan',   nameMl: 'എലൈറ്റ് പ്ലാൻ',   price: 'AED 999', color: 'bg-purple-100 text-purple-700', features: ['Unlimited Listings', 'Featured Placement', 'Shop + Orders', 'Priority Support', 'Analytics', 'Job Postings'] },
    premium: { name: 'Premium Plan', nameMl: 'പ്രീമിയം പ്ലാൻ', price: 'AED 499', color: 'bg-kerala-gold/15 text-kerala-gold', features: ['5 Listings', 'Featured Placement', 'Shop Feature', 'WhatsApp Button', 'Analytics', 'Job Postings'] },
    basic:   { name: 'Basic Plan',   nameMl: 'ബേസിക് പ്ലാൻ',   price: 'AED 299', color: 'bg-blue-100 text-blue-700',   features: ['3 Listings', 'Unlimited Photos', 'WhatsApp Button', 'Basic Analytics', 'Shop Feature', 'Job Postings'] },
    free:    { name: 'Free Plan',    nameMl: 'ഫ്രീ പ്ലാൻ',    price: 'Free',     color: 'bg-gray-100 text-gray-600',   features: ['1 Listing', 'Basic Profile', 'WhatsApp Button'] },
  }

  const plan = planDetails[topPlan] ?? planDetails.free
  const isUpgradeable = topPlan !== 'elite'

  return (
    <div className="space-y-5">
      <SectionHeader title={isMl ? 'ബില്ലിംഗ്' : 'Billing'} />

      {/* Current plan */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-serif font-bold text-kerala-deep">{isMl ? plan.nameMl : plan.name}</h3>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${plan.color}`}>{isMl ? 'ആക്ടീവ്' : 'Active'}</span>
            </div>
            <p className="text-2xl font-serif font-bold text-kerala-deep">{plan.price}<span className="text-sm font-normal text-gray-400">{topPlan !== 'free' ? '/month' : ''}</span></p>
          </div>
          {isUpgradeable && (
            <Link href={`/pricing`}
              className="flex items-center gap-2 bg-kerala-gold text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:opacity-90">
              <Zap size={14} />
              {isMl ? 'അപ്ഗ്രേഡ്' : 'Upgrade Plan'}
            </Link>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {plan.features.map(f => (
            <div key={f} className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle size={14} className="text-kerala-green flex-shrink-0" />
              {f}
            </div>
          ))}
        </div>
      </div>

      {/* Invoices — coming soon */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-serif font-bold text-kerala-deep">{isMl ? 'ഇൻവോയ്സ്' : 'Invoices'}</h3>
        </div>
        <div className="p-8 text-center">
          <Download size={28} className="mx-auto mb-3 text-gray-200" />
          <p className="text-sm text-gray-400">{isMl ? 'ഇൻവോയ്സ് ഇല്ല. ഭാവിയിൽ ഇവിടെ കാണാം.' : 'No invoices yet. Billing history will appear here.'}</p>
        </div>
      </div>
    </div>
  )
}

function SettingsSection({ isMl, user, profile, listings }: { isMl: boolean; user: any; profile: any; listings: any[] }) {
  const [subTab, setSubTab] = useState<'personal' | 'business'>('personal')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [phone, setPhone] = useState(profile?.phone || '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Business info — editable state pre-seeded from first listing
  const firstListing = listings[0]
  const [bizName, setBizName] = useState(firstListing?.name || '')
  const [bizNameMl, setBizNameMl] = useState(firstListing?.name_ml || '')
  const [bizWebsite, setBizWebsite] = useState(firstListing?.website || '')
  const [bizDesc, setBizDesc] = useState(firstListing?.description || '')
  const [bizPhone, setBizPhone] = useState(firstListing?.phone || '')
  const [bizWhatsapp, setBizWhatsapp] = useState(firstListing?.whatsapp || '')
  const [bizSaving, setBizSaving] = useState(false)
  const [bizSaved, setBizSaved] = useState(false)

  const [saveError, setSaveError] = useState('')
  const saveProfile = async () => {
    setSaving(true); setSaveError('')
    const { error } = await supabase.from('profiles').update({ full_name: fullName, phone: phone || null }).eq('id', user?.id)
    setSaving(false)
    if (error) { setSaveError(error.message); return }
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const saveBusiness = async () => {
    if (!firstListing?.id) return
    setBizSaving(true)
    await supabase.from('listings').update({
      name: bizName, name_ml: bizNameMl || null,
      website: bizWebsite || null,
      description: bizDesc || null,
      phone: bizPhone || null,
      whatsapp: bizWhatsapp || null,
    }).eq('id', firstListing.id)
    setBizSaving(false); setBizSaved(true)
    setTimeout(() => setBizSaved(false), 3000)
  }

  const avatarPreview = profile?.avatar_url || null

  return (
    <div className="space-y-5 max-w-2xl">
      <SectionHeader title={isMl ? 'ക്രമീകരണം' : 'Settings'} />

      {/* Sub-tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit overflow-x-auto">
        {(['personal', 'business'] as const).map(t => (
          <button
            key={t}
            onClick={() => setSubTab(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              subTab === t ? 'bg-white text-kerala-deep shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t === 'personal' ? (isMl ? 'വ്യക്തിഗത' : 'Personal Info') : (isMl ? 'ബിസിനസ്' : 'Business Info')}
          </button>
        ))}
      </div>

      {subTab === 'personal' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-gray-200 bg-kerala-cream flex items-center justify-center">
              {avatarPreview
                ? <Image src={avatarPreview} alt="Avatar" fill className="object-cover" sizes="64px" />
                : <span className="text-2xl font-bold text-kerala-green">{(profile?.full_name || user?.email || 'U').charAt(0).toUpperCase()}</span>
              }
            </div>
            <div>
              <p className="font-semibold text-sm text-kerala-deep mb-1">{isMl ? 'പ്രൊഫൈൽ ഫോട്ടോ' : 'Profile Photo'}</p>
              <button className="text-xs font-semibold text-kerala-green border border-kerala-green/30 px-3 py-1.5 rounded-lg hover:bg-kerala-green/5">
                {isMl ? 'ഫോട്ടോ മാറ്റൂ' : 'Change Photo'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">{isMl ? 'പേര്' : 'Full Name'}</label>
              <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 focus:border-kerala-green bg-gray-50" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">{isMl ? 'ഫോൺ' : 'Phone'}</label>
              <UAEPhoneInput value={phone} onChange={setPhone} className="bg-gray-50" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">{isMl ? 'ഇ-മെയിൽ' : 'Email'}</label>
              <input type="email" value={user?.email || ''} disabled
                className="w-full px-3 py-2.5 border border-gray-100 rounded-xl text-sm bg-gray-100 text-gray-400 cursor-not-allowed" />
            </div>
          </div>

          {saveError && <p className="text-red-500 text-xs">{saveError}</p>}
          <button onClick={saveProfile} disabled={saving}
            className="bg-kerala-green text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-60">
            {saving ? <><Loader2 size={14} className="animate-spin"/>{isMl ? 'സേവ് ചെയ്യുന്നു...' : 'Saving...'}</> : saved ? (isMl ? '✓ സേവ് ചെയ്തു' : '✓ Saved!') : (isMl ? 'സേവ് ചെയ്യൂ' : 'Save Changes')}
          </button>
        </div>
      )}

      {subTab === 'business' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          {!firstListing ? (
            <div className="text-center py-8 text-gray-400 text-sm">
              {isMl ? 'ലിസ്റ്റിംഗ് ഒന്നും ഇല്ല. ആദ്യം ഒരു ലിസ്റ്റിംഗ് ചേർക്കൂ.' : 'No listings found. Add a listing first to edit business info.'}
            </div>
          ) : (
            <>
              {listings.length > 1 && (
                <div className="text-xs text-gray-400 bg-kerala-cream px-3 py-2 rounded-xl">
                  {isMl ? 'ആദ്യ ലിസ്റ്റിംഗ് കാണിക്കുന്നു:' : 'Showing first listing:'} <strong>{firstListing.name}</strong>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">{isMl ? 'ബിസിനസ് നാമം (EN)' : 'Business Name (EN)'}</label>
                  <input type="text" value={bizName} onChange={e => setBizName(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 focus:border-kerala-green bg-gray-50" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">{isMl ? 'ബിസിനസ് നാമം (ML)' : 'Business Name (ML)'}</label>
                  <input type="text" value={bizNameMl} onChange={e => setBizNameMl(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 focus:border-kerala-green bg-gray-50" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">{isMl ? 'ഫോൺ' : 'Phone'}</label>
                  <UAEPhoneInput value={bizPhone} onChange={setBizPhone} className="bg-gray-50" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">{isMl ? 'WhatsApp' : 'WhatsApp'}</label>
                  <UAEPhoneInput value={bizWhatsapp} onChange={setBizWhatsapp} className="bg-gray-50" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">{isMl ? 'വെബ്‌സൈറ്റ്' : 'Website'}</label>
                  <input type="url" value={bizWebsite} onChange={e => setBizWebsite(e.target.value)}
                    placeholder="https://"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 focus:border-kerala-green bg-gray-50" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">{isMl ? 'വിവരണം' : 'Description'}</label>
                <textarea value={bizDesc} onChange={e => setBizDesc(e.target.value)} rows={3}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 focus:border-kerala-green bg-gray-50 resize-none" />
              </div>
              <button onClick={saveBusiness} disabled={bizSaving}
                className="bg-kerala-green text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-60">
                {bizSaving ? <><Loader2 size={14} className="animate-spin"/>{isMl ? 'സേവ് ചെയ്യുന്നു...' : 'Saving...'}</> : bizSaved ? (isMl ? '✓ സേവ് ചെയ്തു' : '✓ Saved!') : (isMl ? 'ബിസിനസ് സേവ് ചെയ്യൂ' : 'Save Business Info')}
              </button>
            </>
          )}
        </div>
      )}

      {/* Danger zone */}
      <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-5">
        <h3 className="font-serif font-bold text-red-600 mb-2">{isMl ? 'അപകടകരമായ മേഖല' : 'Danger Zone'}</h3>
        <p className="text-sm text-gray-500 mb-4">{isMl ? 'ഈ നടപടി പഴയപടിയാക്കാൻ സാധ്യമല്ല.' : 'This action cannot be undone. All data will be permanently deleted.'}</p>
        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="bg-red-500 text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-red-600 transition-colors"
          >
            {isMl ? 'അക്കൗണ്ട് ഡിലീറ്റ് ചെയ്യൂ' : 'Delete Account'}
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              {isMl ? 'റദ്ദാക്കൂ' : 'Cancel'}
            </button>
            <button className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition-colors">
              {isMl ? 'ഉറപ്പ്, ഡിലീറ്റ് ചെയ്യൂ' : 'Yes, Delete My Account'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function ProfessionalDashSection({ isMl, locale }: { isMl: boolean; locale: string }) {
  return (
    <div className="space-y-5">
      <SectionHeader
        title={isMl ? 'എന്റെ പ്രൊഫഷണൽ പ്രൊഫൈൽ' : 'My Professional Profile'}
        subtitle={isMl ? 'UAE മലയാളി കമ്മ്യൂണിറ്റിക്ക് നിങ്ങളുടെ സേവനം കാണിക്കൂ' : 'Show your services to the UAE Malayali community'}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
          <Stethoscope size={24} className="text-kerala-green mx-auto mb-2" />
          <div className="font-serif font-bold text-2xl text-kerala-deep">—</div>
          <div className="text-xs text-gray-500 mt-1">{isMl ? 'പ്രൊഫൈൽ കാഴ്ചകൾ' : 'Profile Views'}</div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
          <Star size={24} className="text-kerala-gold mx-auto mb-2" />
          <div className="font-serif font-bold text-2xl text-kerala-deep">—</div>
          <div className="text-xs text-gray-500 mt-1">{isMl ? 'റേറ്റിംഗ്' : 'Rating'}</div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
          <Users size={24} className="text-blue-500 mx-auto mb-2" />
          <div className="font-serif font-bold text-2xl text-kerala-deep">—</div>
          <div className="text-xs text-gray-500 mt-1">{isMl ? 'ഫോളോവേഴ്‌സ്' : 'Followers'}</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-10 text-center">
        <Stethoscope size={40} className="mx-auto mb-4 text-gray-200" />
        <p className="font-semibold text-kerala-deep mb-2">
          {isMl ? 'പ്രൊഫഷണൽ പ്രൊഫൈൽ ഉണ്ടാക്കൂ' : 'Create your Professional Profile'}
        </p>
        <p className="text-sm text-gray-400 max-w-sm mx-auto mb-5">
          {isMl
            ? 'ഡോക്ടർ, അഡ്വക്കേറ്റ്, CA, ഫിറ്റ്നസ് കോച്ച്, ആർട്ടിസ്റ്റ്... — ആയിരങ്ങൾ നിങ്ങളെ കണ്ടെത്തും'
            : 'Doctor, Advocate, CA, Coach, Artist... — thousands of Malayalis will find you'}
        </p>
        <Link href={`/professionals/register`}
          className="inline-flex items-center gap-2 bg-kerala-green text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity text-sm">
          <Plus size={15} />
          {isMl ? 'പ്രൊഫൈൽ ഉണ്ടാക്കൂ' : 'Create Profile'}
        </Link>
      </div>

      <div className="bg-kerala-cream rounded-2xl p-5 flex items-start gap-4">
        <ArrowRight size={20} className="text-kerala-green mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-semibold text-kerala-deep text-sm">{isMl ? 'പ്രൊഫഷണൽ ഡയറക്ടറി' : 'Browse Professionals Directory'}</p>
          <p className="text-xs text-gray-500 mt-1">{isMl ? 'UAE-ലെ മലയാളി പ്രൊഫഷണലുകളെ കണ്ടെത്തൂ' : 'Find other Malayali professionals in UAE'}</p>
          <Link href={`/professionals`} className="text-kerala-green text-xs font-semibold hover:underline mt-1 block">
            {isMl ? 'ഡയറക്ടറി കാണൂ →' : 'View Directory →'}
          </Link>
        </div>
      </div>
    </div>
  )
}

function MediaDashSection({ isMl, locale }: { isMl: boolean; locale: string }) {
  return (
    <div className="space-y-5">
      <SectionHeader
        title={isMl ? 'എന്റെ മീഡിയ ലിസ്റ്റിംഗ്' : 'My Media Listing'}
        subtitle={isMl ? 'TV, റേഡിയോ, ഡിജിറ്റൽ — UAE മലയാളി കമ്മ്യൂണിറ്റിക്ക് കാണിക്കൂ' : 'TV, Radio, Digital — reach 500K+ UAE Malayalis'}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
          <Tv size={24} className="text-purple-500 mx-auto mb-2" />
          <div className="font-serif font-bold text-2xl text-kerala-deep">—</div>
          <div className="text-xs text-gray-500 mt-1">{isMl ? 'പ്രൊഫൈൽ കാഴ്ചകൾ' : 'Profile Views'}</div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
          <Users size={24} className="text-blue-500 mx-auto mb-2" />
          <div className="font-serif font-bold text-2xl text-kerala-deep">—</div>
          <div className="text-xs text-gray-500 mt-1">{isMl ? 'റീച്ച്' : 'Reach'}</div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
          <CheckCircle size={24} className="text-kerala-green mx-auto mb-2" />
          <div className="font-serif font-bold text-2xl text-kerala-deep">—</div>
          <div className="text-xs text-gray-500 mt-1">{isMl ? 'സ്റ്റാറ്റസ്' : 'Status'}</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-10 text-center">
        <Tv size={40} className="mx-auto mb-4 text-gray-200" />
        <p className="font-semibold text-kerala-deep mb-2">
          {isMl ? 'മീഡിയ ഔട്ട്‌ലെറ്റ് ലിസ്റ്റ് ചെയ്യൂ' : 'List Your Media Outlet'}
        </p>
        <p className="text-sm text-gray-400 max-w-sm mx-auto mb-5">
          {isMl
            ? 'TV, റേഡിയോ, ഡിജിറ്റൽ, ന്യൂസ്‌പേപ്പർ — UAE മലയാളി ഡയറക്ടറിയിൽ ഇടം നേടൂ'
            : 'TV, Radio, Digital, Newspaper — get discovered in the UAE Malayali directory'}
        </p>
        <Link href={`/media/register`}
          className="inline-flex items-center gap-2 bg-kerala-green text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity text-sm">
          <Plus size={15} />
          {isMl ? 'ലിസ്റ്റ് ചെയ്യൂ' : 'List Your Media'}
        </Link>
      </div>

      <div className="bg-kerala-cream rounded-2xl p-5 flex items-start gap-4">
        <ArrowRight size={20} className="text-kerala-green mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-semibold text-kerala-deep text-sm">{isMl ? 'മീഡിയ ഡയറക്ടറി' : 'Browse Media Directory'}</p>
          <p className="text-xs text-gray-500 mt-1">{isMl ? 'UAE-ലെ മലയാളി മീഡിയ ഹൗസുകൾ' : 'All Malayali media houses in UAE'}</p>
          <Link href={`/media`} className="text-kerala-green text-xs font-semibold hover:underline mt-1 block">
            {isMl ? 'ഡയറക്ടറി കാണൂ →' : 'View Directory →'}
          </Link>
        </div>
      </div>
    </div>
  )
}

function ReviewsDashSection({ isMl, listings }: { isMl: boolean; listings: any[] }) {
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | '5' | '4' | '3' | '1-2'>('all')

  useEffect(() => {
    if (!listings.length) { setLoading(false); return }
    const ids = listings.map(l => l.id)
    supabase
      .from('reviews')
      .select('*')
      .in('listing_id', ids)
      .order('created_at', { ascending: false })
      .limit(100)
      .then(({ data }) => { setReviews(data ?? []); setLoading(false) })
  }, [listings.length])

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : '—'

  const filtered = filter === 'all' ? reviews
    : filter === '1-2' ? reviews.filter(r => r.rating <= 2)
    : reviews.filter(r => r.rating === Number(filter))

  function timeAgo(d: string) {
    const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000)
    if (s < 3600)  return `${Math.floor(s / 60)}m ago`
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`
    return `${Math.floor(s / 86400)}d ago`
  }

  return (
    <div className="space-y-5">
      <SectionHeader
        title={isMl ? 'റിവ്യൂകൾ' : 'Reviews Received'}
        subtitle={isMl ? 'നിങ്ങളുടെ ബിസിനസുകൾക്ക് ലഭിച്ച അഭിപ്രായങ്ങൾ' : 'All reviews across your listings'}
      />

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard icon={Star}     label={isMl ? 'ആകെ റിവ്യൂ' : 'Total Reviews'} value={String(reviews.length)} accent />
        <StatCard icon={TrendingUp} label={isMl ? 'ശരാശരി' : 'Avg Rating'}    value={`${avgRating}/5`} />
        <StatCard icon={Users}    label={isMl ? '5 ★ റിവ്യൂ' : '5★ Reviews'}  value={String(reviews.filter(r => r.rating === 5).length)} />
        <StatCard icon={AlertTriangle} label={isMl ? '1-2 ★ നെഗറ്റീവ്' : 'Negative'} value={String(reviews.filter(r => r.rating <= 2).length)} />
      </div>

      {/* Filter tabs */}
      {reviews.length > 0 && (
        <div className="flex gap-1 flex-wrap">
          {([['all', isMl ? 'എല്ലാം' : 'All'], ['5', '★★★★★'], ['4', '★★★★'], ['3', '★★★'], ['1-2', isMl ? 'നെഗറ്റീവ്' : 'Negative']] as const).map(([k, l]) => (
            <button key={k} onClick={() => setFilter(k)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${filter === k ? 'bg-kerala-deep text-white border-kerala-deep' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}>
              {l}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 size={28} className="animate-spin text-kerala-green" /></div>
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center">
          <Star size={36} className="mx-auto mb-3 text-gray-200" />
          <p className="font-semibold text-kerala-deep">{isMl ? 'ഇതുവരെ റിവ്യൂ ഇല്ല' : 'No reviews yet'}</p>
          <p className="text-sm text-gray-400 mt-1">{isMl ? 'ഉപഭോക്താക്കൾ ഒരു റിവ്യൂ ഇടുമ്പോൾ ഇവിടെ കാണാം' : 'Customer reviews will appear here once received'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(r => (
            <div key={r.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-kerala-green/10 text-kerala-green font-bold flex items-center justify-center flex-shrink-0 font-serif text-lg">
                {(r.reviewer_name || 'A')[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-semibold text-kerala-deep text-sm">{r.reviewer_name || 'Anonymous'}</span>
                  <span className="text-kerala-gold text-sm">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                  <span className="text-gray-400 text-xs ml-auto">{timeAgo(r.created_at)}</span>
                </div>
                {r.body && <p className="text-gray-500 text-sm line-clamp-2">{r.body}</p>}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-sm text-gray-400 py-8">{isMl ? 'ഈ ഫിൽട്ടറിൽ റിവ്യൂ ഇല്ല' : 'No reviews match this filter'}</p>
          )}
        </div>
      )}
    </div>
  )
}

function FavouritesSection({ isMl, userId, locale }: { isMl: boolean; userId: string; locale: string }) {
  const [favs, setFavs] = useState<Favourite[]>([])
  const [loading, setLoading] = useState(true)
  const [activeType, setActiveType] = useState<'all' | Favourite['item_type']>('all')

  useEffect(() => {
    if (!userId) return
    setLoading(true)
    getFavourites(userId).then(data => { setFavs(data); setLoading(false) })
  }, [userId])

  const handleRemove = async (fav: Favourite) => {
    await toggleFavourite(userId, fav.item_type, fav.item_id)
    setFavs(prev => prev.filter(f => f.id !== fav.id))
  }

  const typeLabels: Record<string, string> = {
    all:          isMl ? 'എല്ലാം'        : 'All',
    listing:      isMl ? 'ബിസിനസ്'      : 'Businesses',
    professional: isMl ? 'പ്രൊഫഷണൽ'    : 'Professionals',
    media:        isMl ? 'മീഡിയ'         : 'Media',
    job:          isMl ? 'ജോലി'          : 'Jobs',
    event:        isMl ? 'ഇവന്റ്'         : 'Events',
    classified:   isMl ? 'ക്ലാസിഫൈഡ്'   : 'Classifieds',
  }

  const linkFor = (fav: Favourite) => {
    if (fav.item_type === 'listing')      return `/company/${fav.item_id}`
    if (fav.item_type === 'professional') return `/professionals/${fav.item_id}`
    if (fav.item_type === 'media')        return `/media/${fav.item_id}`
    if (fav.item_type === 'job')          return `/jobs/${fav.item_id}`
    if (fav.item_type === 'event')        return `/events/${fav.item_id}`
    return '#'
  }

  const typeEmoji: Record<string, string> = {
    listing: '🏢', professional: '👨‍⚕️', media: '📺', job: '💼', event: '🎉', classified: '📋',
  }

  const types = ['all', ...Array.from(new Set(favs.map(f => f.item_type)))] as const
  const filtered = activeType === 'all' ? favs : favs.filter(f => f.item_type === activeType)

  return (
    <div className="space-y-5">
      <SectionHeader
        title={isMl ? 'എന്റെ വിഷ്‌ലിസ്റ്റ്' : 'My Wishlist'}
        subtitle={isMl ? 'നിങ്ങൾ സേവ് ചെയ്ത ബിസിനസ്, പ്രൊഫഷണലുകൾ, മീഡിയ' : 'Businesses, professionals, and media you saved'}
      />

      {/* Type filter tabs */}
      {favs.length > 0 && (
        <div className="flex gap-1 flex-wrap">
          {types.map(t => (
            <button
              key={t}
              onClick={() => setActiveType(t as typeof activeType)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                activeType === t
                  ? 'bg-kerala-deep text-white border-kerala-deep'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
              }`}
            >
              {typeLabels[t]} {t !== 'all' && `(${favs.filter(f => f.item_type === t).length})`}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 size={28} className="animate-spin text-kerala-green" /></div>
      ) : favs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-14 text-center">
          <Heart size={40} className="mx-auto mb-4 text-gray-200" />
          <p className="font-semibold text-kerala-deep mb-2">
            {isMl ? 'വിഷ്‌ലിസ്റ്റ് ഒഴിഞ്ഞിരിക്കുന്നു' : 'Your wishlist is empty'}
          </p>
          <p className="text-sm text-gray-400 max-w-sm mx-auto mb-5">
            {isMl
              ? 'ഡയറക്ടറിയിൽ ❤️ ബട്ടൺ ക്ലിക്ക് ചെയ്ത് ബിസിനസ്, പ്രൊഫഷണലുകൾ, മീഡിയ ഇവ സേവ് ചെയ്യൂ'
              : 'Tap the ❤️ button on any business, professional, or media to save it here'}
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link href={`/directory`} className="text-xs font-semibold text-kerala-green border border-kerala-green/30 px-4 py-2 rounded-xl hover:bg-kerala-green/5">
              {isMl ? 'ഡയറക്ടറി' : 'Browse Directory'}
            </Link>
            <Link href={`/professionals`} className="text-xs font-semibold text-kerala-green border border-kerala-green/30 px-4 py-2 rounded-xl hover:bg-kerala-green/5">
              {isMl ? 'പ്രൊഫഷണൽസ്' : 'Browse Professionals'}
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(fav => (
            <div key={fav.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-3 group">
              {/* Type icon */}
              <div className="w-11 h-11 rounded-xl bg-kerala-cream flex items-center justify-center flex-shrink-0 text-xl">
                {typeEmoji[fav.item_type] ?? '⭐'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">
                  {typeLabels[fav.item_type]}
                </p>
                <p className="font-semibold text-kerala-deep text-sm truncate mb-1">
                  {fav.item_id.replace(/-/g, ' ')}
                </p>
                <p className="text-xs text-gray-400">
                  {isMl ? 'സേവ് ചെയ്ത്:' : 'Saved'} {new Date(fav.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </p>
              </div>
              <div className="flex flex-col gap-1.5 flex-shrink-0">
                <Link href={linkFor(fav)}
                  className="text-xs font-semibold text-kerala-green border border-kerala-green/30 px-2.5 py-1 rounded-lg hover:bg-kerala-green/5 text-center">
                  {isMl ? 'കാണൂ' : 'View'}
                </Link>
                <button
                  onClick={() => handleRemove(fav)}
                  className="text-xs text-red-400 border border-red-100 px-2.5 py-1 rounded-lg hover:bg-red-50 text-center"
                >
                  {isMl ? 'നീക്കൂ' : 'Remove'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Nav config ──────────────────────────────────────────────────────────────
const BASE_NAV_ITEMS: { key: NavSection; icon: React.ElementType; label: string; labelMl: string; roleGate?: string }[] = [
  { key: 'overview',     icon: LayoutDashboard, label: 'Overview',       labelMl: 'ഓവർവ്യൂ' },
  { key: 'listings',     icon: Building2,       label: 'My Listings',    labelMl: 'ലിസ്റ്റിംഗ്' },
  { key: 'analytics',    icon: BarChart2,       label: 'Analytics',      labelMl: 'അനലിറ്റിക്സ്' },
  { key: 'professional', icon: Stethoscope,     label: 'My Profile',     labelMl: 'പ്രൊഫൈൽ',    roleGate: 'is_professional' },
  { key: 'media',        icon: Tv,              label: 'My Media',       labelMl: 'മീഡിയ',       roleGate: 'is_media' },
  { key: 'reviews',      icon: Star,            label: 'Reviews',        labelMl: 'റിവ്യൂ' },
  { key: 'billing',      icon: CreditCard,      label: 'Billing',        labelMl: 'ബില്ലിംഗ്' },
  { key: 'settings',     icon: Settings,        label: 'Settings',       labelMl: 'ക്രമീകരണം' },
  // Phase 2 (hidden): classifieds, shop, orders, enquiries, jobs, favourites
]

// ── Main Component ──────────────────────────────────────────────────────────
export default function DashboardPage() {
  const locale = useLocale()
  const isMl = locale === 'ml'
  const router = useRouter()
  const { user, profile, loading: authLoading, signOut } = useAuth()
  const [activeSection, setActiveSection] = useState<NavSection>('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [myListings, setMyListings] = useState<Awaited<ReturnType<typeof getMyListings>>>([])
  const [listingsLoading, setListingsLoading] = useState(true)

  // Filter nav items based on profile roles — professional/media shown only if user has that role
  const navItems = BASE_NAV_ITEMS.filter(item => {
    if (!item.roleGate) return true
    if (item.roleGate === 'is_professional') return profile?.is_professional ?? false
    if (item.roleGate === 'is_media') return profile?.is_media ?? false
    return true
  })

  // Auth guard
  useEffect(() => {
    if (!authLoading && !user) router.push(`/auth`)
  }, [authLoading, user, locale, router])

  // Fetch owner's listings
  useEffect(() => {
    if (!user) return
    setListingsLoading(true)
    getMyListings(user.id).then(data => {
      setMyListings(data)
      setListingsLoading(false)
    })
  }, [user])

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 size={36} className="animate-spin text-kerala-green" />
      </div>
    )
  }

  if (!user) return null

  function handleNavClick(key: NavSection) {
    setActiveSection(key)
    setSidebarOpen(false)
  }

  const handleSignOut = async () => {
    await signOut()
    router.push(`/auth`)
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Profile */}
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-xl overflow-hidden border-2 border-kerala-gold/30 flex-shrink-0 bg-kerala-green/20 flex items-center justify-center">
            {profile?.avatar_url ? (
              <Image src={profile.avatar_url} alt="Owner" fill className="object-cover" sizes="44px"/>
            ) : (
              <span className="font-bold text-kerala-gold text-lg">
                {(profile?.full_name || user.email || 'U').charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-white text-sm truncate">{profile?.full_name || user.email}</p>
            <p className="text-xs text-white/50 truncate">
              {profile?.is_professional && profile?.is_media
                ? (isMl ? 'ബിസിനസ് • പ്രൊഫഷണൽ • മീഡിയ' : 'Business · Professional · Media')
                : profile?.is_professional
                ? (isMl ? 'ബിസിനസ് • പ്രൊഫഷണൽ' : 'Business · Professional')
                : profile?.is_media
                ? (isMl ? 'ബിസിനസ് • മീഡിയ' : 'Business · Media')
                : (isMl ? 'ബിസിനസ് ഉടമ' : 'Business Owner')}
            </p>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 p-3 overflow-y-auto">
        <div className="space-y-0.5">
          {navItems.map(item => (
            <button
              key={item.key}
              onClick={() => handleNavClick(item.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeSection === item.key
                  ? 'bg-kerala-gold/15 text-kerala-gold border border-kerala-gold/20'
                  : 'text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              <item.icon size={16} />
              {isMl ? item.labelMl : item.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Bottom bar */}
      <div className="p-4">
        <div className="bg-kerala-green/10 border border-kerala-green/20 rounded-2xl p-4">
          <Building2 size={16} className="text-kerala-green mb-2" />
          <p className="font-semibold text-white text-sm mb-0.5">{isMl ? 'ലിസ്റ്റിംഗ് ചേർക്കൂ' : 'All Features Free'}</p>
          <p className="text-white/50 text-xs">{isMl ? 'എല്ലാ സേവനങ്ങളും സൗജന്യം' : 'List your business at no cost'}</p>
        </div>
        {/* Admin Panel link — shown only for admins */}
        {profile?.is_admin && (
          <Link href={`/admin`}
            className="flex items-center gap-2 text-kerala-gold hover:text-kerala-gold-light text-xs font-semibold px-3 py-2 rounded-lg hover:bg-white/5 transition-all w-full mt-1">
            <Shield size={14}/> Admin Panel
          </Link>
        )}
        {/* Sign out */}
        <button onClick={handleSignOut}
          className="flex items-center gap-2 text-white/40 hover:text-white text-xs font-medium px-3 py-2 rounded-lg hover:bg-white/5 transition-all w-full mt-1">
          <LogOut size={14}/>{isMl ? 'സൈൻ ഔട്ട്' : 'Sign Out'}
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-16 flex">
        {/* Desktop sidebar */}
        <aside className="hidden lg:flex flex-col w-64 min-h-[calc(100vh-4rem)] bg-kerala-deep fixed top-16 left-0 bottom-0 overflow-hidden">
          {sidebarContent}
        </aside>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-40 flex">
            <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <div className="relative z-50 w-72 bg-kerala-deep h-full overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <span className="font-serif font-bold text-white">{isMl ? 'ഡാഷ്ബോർഡ്' : 'Dashboard'}</span>
                <button onClick={() => setSidebarOpen(false)} className="text-white/50 hover:text-white">
                  <X size={20} />
                </button>
              </div>
              {sidebarContent}
            </div>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 lg:ml-64 min-h-[calc(100vh-4rem)]">
          {/* Top bar */}
          <div className="sticky top-16 z-10 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                className="lg:hidden p-2 rounded-xl border border-gray-200 text-gray-500 hover:text-kerala-green"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu size={18} />
              </button>
              <div>
                <h1 className="font-serif font-bold text-lg text-kerala-deep leading-none">
                  {navItems.find(n => n.key === activeSection)?.[isMl ? 'labelMl' : 'label']}
                </h1>
                <p className="text-gray-400 text-xs">{new Date().toLocaleDateString(isMl ? 'ml-IN' : 'en-GB', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="relative p-2.5 rounded-xl border border-gray-200 bg-white text-gray-500 hover:text-kerala-green transition-colors">
                <Bell size={17} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <button
                className="hidden sm:flex items-center gap-2 bg-kerala-green text-white text-sm font-semibold px-4 py-2 rounded-xl hover:opacity-90 transition-opacity"
                onClick={() => handleNavClick('listings')}
              >
                <Plus size={14} />
                {isMl ? 'ചേർക്കൂ' : 'Add Listing'}
              </button>
            </div>
          </div>

          {/* Section content */}
          <div className="p-4 sm:p-6 lg:p-8">
            {activeSection === 'overview'      && <OverviewSection isMl={isMl} listings={myListings} onAddListing={() => setActiveSection('listings')} onSection={(s) => setActiveSection(s as NavSection)} />}
            {activeSection === 'listings'      && <ListingsSection isMl={isMl} listings={myListings} loading={listingsLoading} userId={user.id} userEmail={user.email ?? undefined} ownerName={profile?.full_name ?? undefined} />}
            {activeSection === 'classifieds'   && <ClassifiedsSection isMl={isMl} userId={user.id} />}
            {activeSection === 'shop'          && <ShopManagerSection isMl={isMl} listings={myListings} />}
            {activeSection === 'orders'        && <OrdersSection isMl={isMl} />}
            {activeSection === 'enquiries'     && <EnquiriesSection isMl={isMl} />}
            {activeSection === 'analytics'     && <AnalyticsSection isMl={isMl} listings={myListings} />}
            {activeSection === 'jobs'          && <JobsSection isMl={isMl} userId={user.id} locale={locale} />}
            {activeSection === 'professional'  && <ProfessionalDashSection isMl={isMl} locale={locale} />}
            {activeSection === 'media'         && <MediaDashSection isMl={isMl} locale={locale} />}
            {activeSection === 'reviews'        && <ReviewsDashSection isMl={isMl} listings={myListings} />}
            {activeSection === 'favourites'    && <FavouritesSection isMl={isMl} userId={user.id} locale={locale} />}
            {activeSection === 'billing'       && <BillingSection isMl={isMl} listings={myListings} locale={locale} />}
            {activeSection === 'settings'      && <SettingsSection isMl={isMl} user={user} profile={profile} listings={myListings} />}
          </div>
        </main>
      </div>

      <div className="lg:ml-64">
        <Footer />
      </div>
    </div>
  )
}
