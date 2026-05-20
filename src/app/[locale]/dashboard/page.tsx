'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import {
  LayoutDashboard, Building2, ShoppingBag, ShoppingCart, MessageSquare,
  BarChart2, Briefcase, CreditCard, Settings, Plus, Bell,
  Eye, TrendingUp, Star, ArrowUpRight, ArrowDownRight, Edit3, Trash2,
  CheckCircle, MapPin, Menu, X, LogOut, Users,
  Zap, Download, Mail, Tag, AlertTriangle, Loader2
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { getMyListings } from '@/lib/auth'
import { getServices, getTeamMembers, getShopListings, getReviews } from '@/lib/listings'
import { supabase } from '@/lib/supabase'

// ── Types ──────────────────────────────────────────────────────────────────
type NavSection =
  | 'overview'
  | 'listings'
  | 'shop'
  | 'orders'
  | 'enquiries'
  | 'analytics'
  | 'jobs'
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

const mockProducts = [
  { id: 1, name: 'Malabar Biryani Kit', nameMl: 'മലബാർ ബിരിയാണി കിറ്റ്', price: 85, stock: 24, orders: 312, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=120&q=80' },
  { id: 2, name: 'Kerala Pickle Set', nameMl: 'കേരള അച്ചാർ സെറ്റ്', price: 45, stock: 3, orders: 187, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=120&q=80' },
  { id: 3, name: 'Coconut Oil 1L', nameMl: 'വെളിച്ചെണ്ണ 1L', price: 38, stock: 60, orders: 540, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=120&q=80' },
  { id: 4, name: 'Puttu Maker Set', nameMl: 'പുട്ടുകുറ്റി സെറ്റ്', price: 120, stock: 0, orders: 98, image: 'https://images.unsplash.com/photo-1585155784229-aff921ccfa34?w=120&q=80' },
]

const mockOrders = [
  { id: '#1042', customer: 'Mohammed Al Farsi', product: 'Malabar Biryani Kit', amount: 85, status: 'Delivered', date: '18 May 2026' },
  { id: '#1041', customer: 'Priya Krishnan', product: 'Kerala Pickle Set', amount: 90, status: 'Processing', date: '17 May 2026' },
  { id: '#1040', customer: 'James Thompson', product: 'Coconut Oil 1L', amount: 76, status: 'Pending', date: '17 May 2026' },
  { id: '#1039', customer: 'Noora Al Mansoori', product: 'Puttu Maker Set', amount: 120, status: 'Delivered', date: '16 May 2026' },
  { id: '#1038', customer: 'Srinivas Rao', product: 'Malabar Biryani Kit', amount: 170, status: 'Delivered', date: '15 May 2026' },
]

const mockEnquiries = [
  { id: 1, name: 'Ahmed Al Rashidi', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&q=80', msg: 'Do you offer catering for corporate events? We need service for 200 guests in Business Bay next month.', business: 'Al Barakah Restaurant', time: '10 min ago', unread: true, replied: false },
  { id: 2, name: 'Fatima Al Zahra', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=60&q=80', msg: 'What are your delivery charges for Sharjah? Also do you have vegetarian options?', business: 'Al Barakah Restaurant', time: '1 hr ago', unread: true, replied: false },
  { id: 3, name: 'Srinivas Rao', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&q=80', msg: 'I would like to book a private dining experience for my wife\'s birthday. Party of 10.', business: 'Al Barakah Restaurant', time: '3 hr ago', unread: false, replied: true },
  { id: 4, name: 'Noora Al Mansoori', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&q=80', msg: 'Are you open during Eid holidays? Planning a family gathering.', business: 'Al Barakah Restaurant', time: '1 day ago', unread: false, replied: false },
  { id: 5, name: 'Ravi Varma', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=60&q=80', msg: 'Looking for Kerala meals delivery on a weekly subscription basis. Interested?', business: 'Al Barakah Restaurant', time: '2 days ago', unread: false, replied: true },
  { id: 6, name: 'Aisha Mohammed', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=60&q=80', msg: 'Do you provide halal certified food? Please share certificate if available.', business: 'Kerala Properties Dubai', time: '3 days ago', unread: false, replied: false },
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

const mockJobs = [
  { id: 1, title: 'Head Waiter', titleMl: 'ഹെഡ് വെയ്‌ററ്റർ', applications: 18, posted: '10 May 2026', status: 'Active' },
  { id: 2, title: 'Kitchen Assistant', titleMl: 'കിച്ചൻ അസിസ്റ്റന്റ്', applications: 34, posted: '5 May 2026', status: 'Active' },
  { id: 3, title: 'Cashier', titleMl: 'ക്യാഷ്യർ', applications: 9, posted: '1 May 2026', status: 'Closed' },
]

const jobApplicants = [
  { name: 'Rajan Thomas', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&q=80', date: '12 May 2026' },
  { name: 'Suresh Pillai', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&q=80', date: '11 May 2026' },
  { name: 'Anvar K', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=60&q=80', date: '10 May 2026' },
]

const mockInvoices = [
  { id: 'INV-2026-04', date: '1 Apr 2026', amount: 299, status: 'Paid' },
  { id: 'INV-2026-03', date: '1 Mar 2026', amount: 299, status: 'Paid' },
  { id: 'INV-2026-02', date: '1 Feb 2026', amount: 299, status: 'Paid' },
  { id: 'INV-2026-01', date: '1 Jan 2026', amount: 299, status: 'Overdue' },
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

function OverviewSection({ isMl, listings }: { isMl: boolean; listings: any[] }) {
  const totalViews   = listings.reduce((s, l) => s + (l.views_count   || 0), 0)
  const totalReviews = listings.reduce((s, l) => s + (l.review_count  || 0), 0)
  const avgRating    = listings.length
    ? (listings.reduce((s, l) => s + Number(l.rating_avg || 0), 0) / listings.length).toFixed(1)
    : '—'
  const today = new Date().toLocaleDateString(isMl ? 'ml-IN' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="space-y-6">
      <SectionHeader
        title={isMl ? 'ഓവർവ്യൂ' : 'Overview'}
        subtitle={today}
      />

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Building2} label={isMl ? 'ലിസ്റ്റിംഗ്' : 'My Listings'} value={String(listings.length)} />
        <StatCard icon={Eye} label={isMl ? 'മൊത്തം കാഴ്ചകൾ' : 'Total Views'} value={totalViews.toLocaleString()} />
        <StatCard icon={Star} label={isMl ? 'മൊത്തം റിവ്യൂ' : 'Total Reviews'} value={String(totalReviews)} accent />
        <StatCard icon={TrendingUp} label={isMl ? 'ശരാശരി റേറ്റിംഗ്' : 'Avg Rating'} value={`${avgRating}/5`} />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: Plus, label: isMl ? 'ലിസ്റ്റിംഗ് ചേർക്കൂ' : 'Add Listing', color: 'bg-kerala-green text-white' },
          { icon: Briefcase, label: isMl ? 'ജോലി പോസ്റ്റ് ചെയ്യൂ' : 'Post Job', color: 'bg-kerala-deep text-white' },
          { icon: BarChart2, label: isMl ? 'അനലിറ്റിക്സ്' : 'View Analytics', color: 'bg-kerala-gold text-white' },
          { icon: Zap, label: isMl ? 'പ്ലാൻ അപ്‌ഗ്രേഡ്' : 'Upgrade Plan', color: 'bg-purple-600 text-white' },
        ].map(a => (
          <button key={a.label} className={`${a.color} rounded-2xl p-4 flex flex-col items-start gap-3 hover:opacity-90 transition-opacity`}>
            <a.icon size={20} />
            <span className="font-semibold text-sm text-left leading-tight">{a.label}</span>
          </button>
        ))}
      </div>

      {/* Bar chart + activity */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Pure CSS bar chart */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-serif font-bold text-kerala-deep">{isMl ? 'ആഴ്ചയിലെ പ്രൊഫൈൽ കാഴ്ചകൾ' : 'Profile Views – Last 7 Days'}</h3>
            <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">12,483 {isMl ? 'മൊത്തം' : 'total'}</span>
          </div>
          <div className="flex items-end gap-2" style={{ height: '120px' }}>
            {weeklyViews.map(d => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full relative" style={{ height: '96px' }}>
                  <div
                    className="absolute bottom-0 w-full bg-kerala-green/80 rounded-t-lg hover:bg-kerala-green transition-colors"
                    style={{ height: `${Math.round((d.views / maxWeeklyViews) * 96)}px` }}
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

        {/* Recent activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-serif font-bold text-kerala-deep mb-4">{isMl ? 'സമീപ പ്രവർത്തനം' : 'Recent Activity'}</h3>
          <div className="space-y-3 overflow-y-auto" style={{ maxHeight: '260px' }}>
            {recentActivity.map(item => (
              <div key={item.id} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
                  <item.icon size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-700 leading-snug">{isMl ? item.textMl : item.text}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ListingsSection({ isMl, listings, loading }: { isMl: boolean; listings: any[]; loading: boolean }) {
  const locale = isMl ? 'ml' : 'en'
  const [filter, setFilter] = useState<'all' | 'active' | 'pending'>('all')
  const statuses = ['all', 'active', 'pending'] as const
  const statusLabels: Record<typeof statuses[number], string> = {
    all: isMl ? 'എല്ലാം' : 'All',
    active: isMl ? 'ആക്ടീവ്' : 'Active',
    pending: isMl ? 'കാത്തിരിക്കുന്നു' : 'Pending',
  }

  const filtered = filter === 'all' ? listings : listings.filter(b => b.status === filter)

  return (
    <div className="space-y-5">
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
        <button className="flex items-center gap-2 bg-kerala-green text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity">
          <Plus size={15} />
          {isMl ? 'ലിസ്റ്റിംഗ് ചേർക്കൂ' : 'Add New Listing'}
        </button>
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
                <Link href={`/${locale}/company/${biz.slug}`}
                  className="text-xs font-semibold text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 text-center whitespace-nowrap">
                  {isMl ? 'കാണൂ' : 'View'}
                </Link>
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
  const [shopItems, setShopItems] = useState<any[]>([])
  const [shopLoading, setShopLoading] = useState(false)

  useEffect(() => {
    if (!selectedListingId) return
    setShopLoading(true)
    getShopListings(selectedListingId).then(items => { setShopItems(items); setShopLoading(false) })
  }, [selectedListingId])

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
        {mockProducts.map(p => (
          <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-4 items-center">
            <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
              <Image src={p.image} alt={p.name} fill className="object-cover" sizes="56px" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-kerala-deep text-sm">{isMl ? p.nameMl : p.name}</h4>
              <div className="flex flex-wrap gap-3 text-xs text-gray-500 mt-1">
                <span className="text-kerala-gold font-bold">AED {p.price}</span>
                <span className={`font-semibold ${p.stock === 0 ? 'text-red-500' : p.stock <= 5 ? 'text-amber-500' : 'text-gray-500'}`}>
                  {isMl ? 'സ്റ്റോക്ക്:' : 'Stock:'} {p.stock === 0 ? (isMl ? 'ഇല്ല' : 'Out') : p.stock}
                </span>
                <span>{isMl ? 'ഓർഡർ:' : 'Orders:'} {p.orders}</span>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button className="text-xs text-blue-600 border border-blue-100 px-3 py-1.5 rounded-lg hover:bg-blue-50">
                <Edit3 size={12} className="inline mr-1" />{isMl ? 'എഡിറ്റ്' : 'Edit'}
              </button>
              <button className="text-xs text-red-500 border border-red-100 px-3 py-1.5 rounded-lg hover:bg-red-50">
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
              {[
                { label: isMl ? 'ഉൽപ്പന്ന നാമം (EN)' : 'Product Name (EN)', type: 'text', placeholder: 'e.g. Malabar Biryani Kit' },
                { label: isMl ? 'ഉൽപ്പന്ന നാമം (ML)' : 'Product Name (ML)', type: 'text', placeholder: 'ഉദാ. മലബാർ ബിരിയാണി കിറ്റ്' },
                { label: isMl ? 'വില (AED)' : 'Price (AED)', type: 'number', placeholder: '0.00' },
                { label: isMl ? 'സ്റ്റോക്ക്' : 'Stock Quantity', type: 'number', placeholder: '0' },
              ].map(f => (
                <div key={f.label}>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{f.label}</label>
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 focus:border-kerala-green bg-gray-50"
                  />
                </div>
              ))}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  {isMl ? 'റദ്ദാക്കൂ' : 'Cancel'}
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2.5 bg-kerala-green text-white rounded-xl text-sm font-semibold hover:opacity-90"
                >
                  {isMl ? 'ചേർക്കൂ' : 'Add Product'}
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
  const statusColors: Record<string, string> = {
    Delivered: 'bg-green-100 text-green-700',
    Processing: 'bg-blue-100 text-blue-700',
    Pending: 'bg-amber-100 text-amber-600',
  }
  const statusMl: Record<string, string> = {
    Delivered: 'ഡെലിവർ ചെയ്തു',
    Processing: 'പ്രോസസ്സിംഗ്',
    Pending: 'കാത്തിരിക്കുന്നു',
  }

  return (
    <div className="space-y-5">
      <SectionHeader title={isMl ? 'ഓർഡറുകൾ' : 'Orders'} />

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
          <div className="font-serif font-bold text-2xl text-kerala-deep">45</div>
          <div className="text-xs text-gray-500 mt-1">{isMl ? 'മൊത്തം ഓർഡർ' : 'Total Orders'}</div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
          <div className="font-serif font-bold text-2xl text-amber-600">3</div>
          <div className="text-xs text-gray-500 mt-1">{isMl ? 'കാത്തിരിക്കുന്നു' : 'Pending'}</div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
          <div className="font-serif font-bold text-xl text-kerala-green">AED 4,120</div>
          <div className="text-xs text-gray-500 mt-1">{isMl ? 'ഈ മാസം' : 'This Month'}</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {[isMl ? 'ഓർഡർ ID' : 'Order ID', isMl ? 'ഉപഭോക്താവ്' : 'Customer', isMl ? 'ഉൽപ്പന്നം' : 'Product', isMl ? 'തുക' : 'Amount', isMl ? 'സ്ഥിതി' : 'Status', isMl ? 'തീയതി' : 'Date', ''].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {mockOrders.map(o => (
                <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-gray-700">{o.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{o.customer}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{o.product}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-kerala-deep">AED {o.amount}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[o.status]}`}>
                      {isMl ? statusMl[o.status] : o.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">{o.date}</td>
                  <td className="px-4 py-3">
                    <button className="text-xs text-kerala-green font-semibold hover:underline">{isMl ? 'കാണൂ' : 'View Details'}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function EnquiriesSection({ isMl }: { isMl: boolean }) {
  const [filter, setFilter] = useState<'all' | 'unread' | 'replied'>('all')
  const [expanded, setExpanded] = useState<number | null>(null)
  const [replyText, setReplyText] = useState('')

  const filterLabels = {
    all: isMl ? 'എല്ലാം' : 'All',
    unread: isMl ? 'വായിക്കാത്തത്' : 'Unread',
    replied: isMl ? 'മറുപടി' : 'Replied',
  }

  const filtered = mockEnquiries.filter(e =>
    filter === 'all' ? true : filter === 'unread' ? e.unread : e.replied
  )

  return (
    <div className="space-y-5">
      <SectionHeader title={isMl ? 'അന്വേഷണങ്ങൾ' : 'Enquiries'} />

      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {(['all', 'unread', 'replied'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              filter === f ? 'bg-white text-kerala-deep shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {filterLabels[f]}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(e => (
          <div key={e.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <button
              className="w-full flex items-start gap-4 p-4 text-left hover:bg-gray-50 transition-colors"
              onClick={() => setExpanded(expanded === e.id ? null : e.id)}
            >
              <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                <Image src={e.avatar} alt={e.name} fill className="object-cover" sizes="40px" />
                {e.unread && <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className={`font-semibold text-sm ${e.unread ? 'text-kerala-deep' : 'text-gray-700'}`}>{e.name}</span>
                  <span className="text-xs text-gray-400 flex-shrink-0">{e.time}</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5 truncate">{e.msg}</p>
                <p className="text-xs text-kerala-green mt-0.5">{e.business}</p>
              </div>
            </button>
            {expanded === e.id && (
              <div className="border-t border-gray-100 p-4 bg-gray-50 space-y-3">
                <p className="text-sm text-gray-700 leading-relaxed">{e.msg}</p>
                <textarea
                  value={replyText}
                  onChange={ev => setReplyText(ev.target.value)}
                  placeholder={isMl ? 'മറുപടി ടൈപ്പ് ചെയ്യൂ...' : 'Type your reply...'}
                  rows={3}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 focus:border-kerala-green bg-white resize-none"
                />
                <div className="flex justify-end">
                  <button
                    onClick={() => { setReplyText(''); setExpanded(null) }}
                    className="flex items-center gap-2 bg-kerala-green text-white text-sm font-semibold px-4 py-2 rounded-xl hover:opacity-90"
                  >
                    <Mail size={14} />
                    {isMl ? 'അയക്കൂ' : 'Send Reply'}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
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
          <div className="flex items-end gap-3" style={{ height: '100px' }}>
            {analyticsWeeks.map(d => (
              <div key={d.week} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full relative" style={{ height: '80px' }}>
                  <div
                    className="absolute bottom-0 w-full bg-kerala-green rounded-t-lg"
                    style={{ height: `${Math.round((d.views / maxAnalyticsViews) * 80)}px` }}
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
          <div className="flex items-end gap-3" style={{ height: '100px' }}>
            {analyticsWeeks.map(d => (
              <div key={d.week} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full relative" style={{ height: '80px' }}>
                  <div
                    className="absolute bottom-0 w-full bg-kerala-gold rounded-t-lg"
                    style={{ height: `${Math.round((d.enquiries / maxAnalyticsEnquiries) * 80)}px` }}
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
              { label: isMl ? 'ടോപ് ലിസ്റ്റിംഗ്' : 'Top Performing Listing', value: isMl ? 'അൽ ബറക്ക' : 'Al Barakah Restaurant' },
              { label: isMl ? 'ക്ലിക്ക്-ത്രൂ നിരക്ക്' : 'Click-Through Rate', value: '8.4%' },
              { label: isMl ? 'WhatsApp ക്ലിക്ക്' : 'WhatsApp Clicks', value: '1,240' },
              { label: isMl ? 'ഫോൺ ക്ലിക്ക്' : 'Phone Clicks', value: '890' },
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

function JobsSection({ isMl }: { isMl: boolean }) {
  const [expandedJob, setExpandedJob] = useState<number | null>(null)

  return (
    <div className="space-y-5">
      <SectionHeader title={isMl ? 'പോസ്റ്റ് ചെയ്ത ജോലി' : 'Jobs Posted'} />

      <div className="flex justify-end">
        <button className="flex items-center gap-2 bg-kerala-green text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity">
          <Plus size={15} />
          {isMl ? 'ജോലി പോസ്റ്റ് ചെയ്യൂ' : 'Post New Job'}
        </button>
      </div>

      <div className="space-y-3">
        {mockJobs.map(job => (
          <div key={job.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-kerala-green/10 flex items-center justify-center flex-shrink-0">
                <Briefcase size={18} className="text-kerala-green" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-kerala-deep text-sm">{isMl ? job.titleMl : job.title}</h4>
                <div className="flex flex-wrap gap-3 text-xs text-gray-500 mt-1">
                  <span>{isMl ? 'അപേക്ഷ:' : 'Applications:'} <strong className="text-kerala-deep">{job.applications}</strong></span>
                  <span>{isMl ? 'പോസ്റ്റ്:' : 'Posted:'} {job.posted}</span>
                  <span className={`font-semibold ${job.status === 'Active' ? 'text-green-600' : 'text-gray-400'}`}>
                    {job.status === 'Active' ? (isMl ? 'ആക്ടീവ്' : 'Active') : (isMl ? 'അടഞ്ഞു' : 'Closed')}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                className="text-xs font-semibold text-kerala-green border border-kerala-green/30 px-3 py-1.5 rounded-lg hover:bg-kerala-green/5 flex-shrink-0"
              >
                {isMl ? 'അപേക്ഷ കാണൂ' : 'View Applications'}
              </button>
            </div>
            {expandedJob === job.id && (
              <div className="border-t border-gray-100 p-4 bg-gray-50 space-y-3">
                <p className="text-xs font-semibold text-gray-500 mb-2">{isMl ? 'അപേക്ഷകർ' : 'Applicants'}</p>
                {jobApplicants.map(ap => (
                  <div key={ap.name} className="flex items-center gap-3">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                      <Image src={ap.avatar} alt={ap.name} fill className="object-cover" sizes="32px" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-kerala-deep">{ap.name}</p>
                      <p className="text-xs text-gray-400">{isMl ? 'അപേക്ഷ:' : 'Applied:'} {ap.date}</p>
                    </div>
                    <button className="text-xs text-blue-600 border border-blue-100 px-2.5 py-1 rounded-lg hover:bg-blue-50">
                      {isMl ? 'കാണൂ' : 'View'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function BillingSection({ isMl }: { isMl: boolean }) {
  const statusColors: Record<string, string> = {
    Paid: 'bg-green-100 text-green-700',
    Overdue: 'bg-red-100 text-red-600',
  }

  return (
    <div className="space-y-5">
      <SectionHeader title={isMl ? 'ബില്ലിംഗ്' : 'Billing'} />

      {/* Current plan */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-serif font-bold text-kerala-deep">{isMl ? 'സ്റ്റാൻഡേർഡ് പ്ലാൻ' : 'Standard Plan'}</h3>
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-0.5 rounded-full">{isMl ? 'നിലവിൽ ആക്ടീവ്' : 'Active'}</span>
            </div>
            <p className="text-2xl font-serif font-bold text-kerala-deep">AED 299<span className="text-sm font-normal text-gray-400">/month</span></p>
          </div>
          <button className="flex items-center gap-2 bg-kerala-gold text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:opacity-90">
            <Zap size={14} />
            {isMl ? 'പ്രീമിയം ആക്കൂ' : 'Upgrade to Premium'}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            isMl ? '3 ലിസ്റ്റിംഗ്' : '3 Business Listings',
            isMl ? 'അൺലിമിറ്റഡ് ഫോട്ടോ' : 'Unlimited Photos',
            isMl ? 'WhatsApp ബട്ടൺ' : 'WhatsApp Button',
            isMl ? 'അനലിറ്റിക്സ്' : 'Basic Analytics',
            isMl ? 'ഷോപ്പ് ഫീച്ചർ' : 'Shop Feature',
            isMl ? 'ജോബ് പോസ്റ്റ്' : 'Job Postings',
          ].map(f => (
            <div key={f} className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle size={14} className="text-kerala-green flex-shrink-0" />
              {f}
            </div>
          ))}
        </div>
      </div>

      {/* Invoices */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-serif font-bold text-kerala-deep">{isMl ? 'ഇൻവോയ്സ്' : 'Invoices'}</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {mockInvoices.map(inv => (
            <div key={inv.id} className="flex items-center gap-4 px-4 py-3">
              <div className="flex-1 min-w-0">
                <p className="font-mono text-sm font-semibold text-kerala-deep">{inv.id}</p>
                <p className="text-xs text-gray-400">{inv.date}</p>
              </div>
              <span className="font-semibold text-sm text-kerala-deep">AED {inv.amount}</span>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[inv.status]}`}>
                {inv.status === 'Paid' ? (isMl ? 'അടച്ചു' : 'Paid') : (isMl ? 'കുടിശ്ശിക' : 'Overdue')}
              </span>
              <button className="text-gray-400 hover:text-kerala-green transition-colors">
                <Download size={15} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Payment method */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif font-bold text-kerala-deep">{isMl ? 'പേമെന്റ് രീതി' : 'Payment Method'}</h3>
          <button className="text-xs font-semibold text-kerala-green border border-kerala-green/30 px-3 py-1.5 rounded-lg hover:bg-kerala-green/5">
            {isMl ? 'അപ്ഡേറ്റ്' : 'Update'}
          </button>
        </div>
        <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-4">
          <div className="w-10 h-7 bg-blue-600 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">VISA</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-kerala-deep">•••• •••• •••• 4242</p>
            <p className="text-xs text-gray-400">{isMl ? 'കാലഹരണം:' : 'Expires:'} 09/2028</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function SettingsSection({ isMl, user, profile }: { isMl: boolean; user: any; profile: any }) {
  const [subTab, setSubTab] = useState<'personal' | 'business'>('personal')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [phone, setPhone] = useState(profile?.phone || '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const saveProfile = async () => {
    setSaving(true)
    await supabase.from('profiles').update({ full_name: fullName, phone }).eq('id', user?.id)
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const avatarPreview = profile?.avatar_url || null

  return (
    <div className="space-y-5 max-w-2xl">
      <SectionHeader title={isMl ? 'ക്രമീകരണം' : 'Settings'} />

      {/* Sub-tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {(['personal', 'business'] as const).map(t => (
          <button
            key={t}
            onClick={() => setSubTab(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
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
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 focus:border-kerala-green bg-gray-50" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">{isMl ? 'ഇ-മെയിൽ' : 'Email'}</label>
              <input type="email" value={user?.email || ''} disabled
                className="w-full px-3 py-2.5 border border-gray-100 rounded-xl text-sm bg-gray-100 text-gray-400 cursor-not-allowed" />
            </div>
          </div>

          <button onClick={saveProfile} disabled={saving}
            className="bg-kerala-green text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-60">
            {saving ? <><Loader2 size={14} className="animate-spin"/>{isMl ? 'സേവ് ചെയ്യുന്നു...' : 'Saving...'}</> : saved ? (isMl ? '✓ സേവ് ചെയ്തു' : '✓ Saved!') : (isMl ? 'സേവ് ചെയ്യൂ' : 'Save Changes')}
          </button>
        </div>
      )}

      {subTab === 'business' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: isMl ? 'ബിസിനസ് നാമം (EN)' : 'Business Name (EN)', value: 'Al Barakah Kerala Restaurant', type: 'text' },
              { label: isMl ? 'ബിസിനസ് നാമം (ML)' : 'Business Name (ML)', value: 'അൽ ബറക്ക കേരള റസ്റ്റോറന്റ്', type: 'text' },
              { label: isMl ? 'വെബ്‌സൈറ്റ്' : 'Website', value: 'https://albarakah.ae', type: 'url' },
            ].map(f => (
              <div key={f.label} className={f.label.includes('Website') ? 'sm:col-span-2' : ''}>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">{f.label}</label>
                <input
                  type={f.type}
                  defaultValue={f.value}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 focus:border-kerala-green bg-gray-50"
                />
              </div>
            ))}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">{isMl ? 'വിഭാഗം' : 'Category'}</label>
            <select className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 focus:border-kerala-green bg-gray-50">
              <option>Restaurants &amp; Food</option>
              <option>Real Estate</option>
              <option>Healthcare</option>
              <option>Retail &amp; Shopping</option>
              <option>Services</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">{isMl ? 'വിവരണം (EN)' : 'Description (EN)'}</label>
            <textarea
              defaultValue="Authentic Kerala cuisine in the heart of Dubai."
              rows={3}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 focus:border-kerala-green bg-gray-50 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">{isMl ? 'വിവരണം (ML)' : 'Description (ML)'}</label>
            <textarea
              defaultValue="ദുബായ് ഹൃദയത്തിൽ ആധികാരിക കേരള ഭക്ഷണം."
              rows={3}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 focus:border-kerala-green bg-gray-50 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">{isMl ? 'ടാഗ്' : 'Tags'}</label>
            <div className="flex flex-wrap gap-2 p-3 border border-gray-200 rounded-xl bg-gray-50 min-h-[44px]">
              {['Biryani', 'Seafood', 'Kerala Sadya', 'Halal', 'Delivery'].map(tag => (
                <span key={tag} className="flex items-center gap-1 bg-kerala-green/10 text-kerala-green text-xs font-semibold px-2.5 py-1 rounded-full">
                  <Tag size={10} />
                  {tag}
                  <button className="text-kerala-green/50 hover:text-kerala-green ml-0.5">
                    <X size={10} />
                  </button>
                </span>
              ))}
              <input
                type="text"
                placeholder={isMl ? 'ടാഗ് ചേർക്കൂ...' : 'Add tag...'}
                className="bg-transparent text-xs focus:outline-none min-w-[80px]"
              />
            </div>
          </div>

          <button className="bg-kerala-green text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity">
            {isMl ? 'ബിസിനസ് സേവ് ചെയ്യൂ' : 'Save Business Info'}
          </button>
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

// ── Nav config ──────────────────────────────────────────────────────────────
const navItems: {
  key: NavSection
  icon: React.ElementType
  label: string
  labelMl: string
}[] = [
  { key: 'overview', icon: LayoutDashboard, label: 'Overview', labelMl: 'ഓവർവ്യൂ' },
  { key: 'listings', icon: Building2, label: 'My Listings', labelMl: 'ലിസ്റ്റിംഗ്' },
  { key: 'shop', icon: ShoppingBag, label: 'Shop Manager', labelMl: 'ഷോപ്പ്' },
  { key: 'orders', icon: ShoppingCart, label: 'Orders', labelMl: 'ഓർഡർ' },
  { key: 'enquiries', icon: MessageSquare, label: 'Enquiries', labelMl: 'അന്വേഷണം' },
  { key: 'analytics', icon: BarChart2, label: 'Analytics', labelMl: 'അനലിറ്റിക്സ്' },
  { key: 'jobs', icon: Briefcase, label: 'Jobs Posted', labelMl: 'ജോലി' },
  { key: 'billing', icon: CreditCard, label: 'Billing', labelMl: 'ബില്ലിംഗ്' },
  { key: 'settings', icon: Settings, label: 'Settings', labelMl: 'ക്രമീകരണം' },
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

  // Auth guard
  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/${locale}/auth`)
    }
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
    router.push(`/${locale}/auth`)
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
            <p className="text-xs text-white/50 truncate">{isMl ? 'ബിസിനസ് ഉടമ' : 'Business Owner'}</p>
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

      {/* Upgrade card */}
      <div className="p-4">
        <div className="bg-kerala-gold/10 border border-kerala-gold/20 rounded-2xl p-4">
          <Zap size={16} className="text-kerala-gold mb-2" />
          <p className="font-semibold text-white text-sm mb-0.5">{isMl ? 'പ്രീമിയം ആക്കൂ' : 'Go Premium'}</p>
          <p className="text-white/50 text-xs mb-3">{isMl ? 'കൂടുതൽ ലീഡ്സ്, ഫീച്ചർഡ്' : 'More leads, featured listing'}</p>
          <button className="w-full bg-kerala-gold text-white text-xs font-bold py-2 rounded-lg hover:opacity-90 transition-opacity">
            {isMl ? 'AED 499/മാസം' : 'AED 499/month'}
          </button>
        </div>
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
                <p className="text-gray-400 text-xs">{isMl ? 'ഇന്ന്, 18 മേയ് 2026' : 'Today, 18 May 2026'}</p>
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
            {activeSection === 'overview'  && <OverviewSection isMl={isMl} listings={myListings} />}
            {activeSection === 'listings'  && <ListingsSection isMl={isMl} listings={myListings} loading={listingsLoading} />}
            {activeSection === 'shop'      && <ShopManagerSection isMl={isMl} listings={myListings} />}
            {activeSection === 'orders'    && <OrdersSection isMl={isMl} />}
            {activeSection === 'enquiries' && <EnquiriesSection isMl={isMl} />}
            {activeSection === 'analytics' && <AnalyticsSection isMl={isMl} listings={myListings} />}
            {activeSection === 'jobs'      && <JobsSection isMl={isMl} />}
            {activeSection === 'billing'   && <BillingSection isMl={isMl} />}
            {activeSection === 'settings'  && <SettingsSection isMl={isMl} user={user} profile={profile} />}
          </div>
        </main>
      </div>

      <div className="lg:ml-64">
        <Footer />
      </div>
    </div>
  )
}
