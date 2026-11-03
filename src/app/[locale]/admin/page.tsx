'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import Navbar from '@/components/layout/Navbar'
import { useAuth } from '@/context/AuthContext'
import { adminGetStats } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import {
  LayoutDashboard, Building2, Users, Megaphone, Flag, Settings,
  TrendingUp, CheckCircle, XCircle, Eye, Menu, X, Shield,
  AlertTriangle, ChevronRight, MapPin, Package, ClipboardCheck, FileSearch,
  ArrowUpRight, Bell, LogOut, Loader2, Tag, Calendar, Briefcase, CreditCard, Gift,
  UserCheck, Tv, BookOpen, Ticket, ShoppingBag, Star, Plus, Trash2, Edit3,
  BarChart2, Upload, Send, Copy, HeadphonesIcon, ScrollText,
  FileText, Search, Lock, PieChart,
} from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────────────
type AdminSection = 'dashboard' | 'listings' | 'approvals' | 'claims' | 'users' | 'categories' | 'locations' | 'packages' | 'payments' | 'offers' | 'leads' | 'bulk-upload' | 'notifications' | 'duplicates' | 'support' | 'audit' | 'blog' | 'seo' | 'roles' | 'reports' | 'reviews' | 'classifieds' | 'events' | 'jobs' | 'shop' | 'businessmen' | 'professionals' | 'media' | 'community' | 'business-meet' | 'ads' | 'settings'

type AdminStats = {
  totalListings:   number
  activeListings:  number
  pendingListings: number
  totalUsers:      number
  totalReviews:    number
  premiumListings: number
} | null

// ── Static Mock Data (ads/reports — no DB tables yet) ─────────────────────

const adSlots = [
  { slot: 'Homepage Banner', advertiser: 'Kerala Gold Jewellers', price: 1200, status: 'Active', impressions: 48200 },
  { slot: 'Ticker Announcements', advertiser: 'Gulf NRI Bank', price: 600, status: 'Active', impressions: 72400 },
  { slot: 'Category Page Banner', advertiser: '—', price: 800, status: 'Available', impressions: 0 },
  { slot: 'Search Results Spotlight', advertiser: 'Malabar Properties', price: 950, status: 'Active', impressions: 31800 },
]

const reportedContent = [
  { id: 1, type: 'Listing', content: 'Gulf Malayali Tours – suspicious reviews', reportedBy: 'Ahmed Al Rashidi', date: '17 May 2026', reason: 'Fake reviews / spam' },
  { id: 2, type: 'Review', content: '"Worst food ever, scammers" on Al Barakah', reportedBy: 'Fatima Al Zahra', date: '16 May 2026', reason: 'Abusive language' },
  { id: 3, type: 'Listing', content: 'Calicut Mobile Repair – wrong category', reportedBy: 'Srinivas Rao', date: '15 May 2026', reason: 'Incorrect category' },
  { id: 4, type: 'Comment', content: 'Community post with offensive content', reportedBy: 'James Thompson', date: '14 May 2026', reason: 'Hate speech' },
  { id: 5, type: 'Listing', content: 'UAE Forex Exchange – unlicensed activity', reportedBy: 'Noora Al Mansoori', date: '13 May 2026', reason: 'Illegal activity' },
]

// ── Helpers ────────────────────────────────────────────────────────────────
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s
}

// ── Sub-components ──────────────────────────────────────────────────────────
function AdminStatCard({
  icon: Icon,
  label,
  value,
  change,
  color = 'text-kerala-green',
  bg = 'bg-kerala-green/10',
}: {
  icon: React.ElementType
  label: string
  value: string
  change?: string
  color?: string
  bg?: string
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${bg}`}>
          <Icon size={20} className={color} />
        </div>
        {change && (
          <div className="flex items-center gap-0.5 text-xs font-semibold text-green-500">
            <ArrowUpRight size={13} />
            {change}
          </div>
        )}
      </div>
      <div className="font-serif font-bold text-3xl text-kerala-deep leading-none mb-1">{value}</div>
      <div className="text-gray-500 text-xs">{label}</div>
    </div>
  )
}

// ── Section: Admin Dashboard ─────────────────────────────────────────────
function AdminDashboardSection({ stats }: { stats: AdminStats }) {
  const v = (n: number | undefined) => (n !== undefined ? n.toLocaleString() : '—')
  const [extraStats, setExtraStats] = useState<Record<string, number>>({})
  const [recentUsers, setRecentUsers] = useState<any[]>([])
  const [liveCategories, setLiveCategories] = useState<any[]>([])

  useEffect(() => {
    // Fetch extra stats
    Promise.all([
      supabase.from('jobs').select('id', { count: 'exact', head: true }),
      supabase.from('classifieds').select('id', { count: 'exact', head: true }),
      supabase.from('events').select('id', { count: 'exact', head: true }),
      supabase.from('shop_listings').select('id', { count: 'exact', head: true }),
    ]).then(([jobs, classifieds, events, shop]) => {
      setExtraStats({
        jobs:       jobs.count      ?? 0,
        classifieds: classifieds.count ?? 0,
        events:     events.count    ?? 0,
        shop:       shop.count      ?? 0,
      })
    })

    // Fetch real recent signups
    supabase.from('profiles').select('id, full_name, email, created_at').order('created_at', { ascending: false }).limit(5)
      .then(({ data }) => setRecentUsers(data ?? []))

    // Fetch top categories by listing count
    supabase.from('listings').select('category_id').then(({ data }) => {
      if (!data) return
      const countMap: Record<string, number> = {}
      data.forEach(l => { if (l.category_id) countMap[l.category_id] = (countMap[l.category_id] ?? 0) + 1 })
      // Get top 6 category IDs
      const topIds = Object.entries(countMap).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([id]) => id)
      supabase.from('categories').select('id, name').in('id', topIds).then(({ data: cats }) => {
        if (!cats) return
        const enriched = cats.map(c => ({ ...c, count: countMap[c.id] ?? 0 })).sort((a, b) => b.count - a.count)
        setLiveCategories(enriched)
      })
    })
  }, [])

  const catMax = liveCategories.length ? Math.max(...liveCategories.map(c => c.count)) : 1

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif font-bold text-2xl text-kerala-deep">Platform Dashboard</h2>
        <p className="text-gray-500 text-sm mt-1">MalayaliBusiness Admin · Live data</p>
      </div>

      {/* Main stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AdminStatCard icon={Building2}     label="Total Listings"    value={v(stats?.totalListings)}   color="text-kerala-green" bg="bg-kerala-green/10" />
        <AdminStatCard icon={Users}         label="Total Users"       value={v(stats?.totalUsers)}      color="text-blue-600"     bg="bg-blue-50" />
        <AdminStatCard icon={TrendingUp}    label="Premium Listings"  value={v(stats?.premiumListings)} color="text-kerala-gold"  bg="bg-kerala-gold/10" />
        <AdminStatCard icon={AlertTriangle} label="Pending Approvals" value={stats ? String(stats.pendingListings) : '—'} color="text-amber-600" bg="bg-amber-50" />
      </div>

      {/* Extra stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AdminStatCard icon={Briefcase}     label="Total Jobs"        value={v(extraStats.jobs)}        color="text-purple-600"   bg="bg-purple-50" />
        <AdminStatCard icon={ShoppingBag}   label="Classifieds"       value={v(extraStats.classifieds)} color="text-pink-600"     bg="bg-pink-50" />
        <AdminStatCard icon={Calendar}      label="Events"            value={v(extraStats.events)}      color="text-indigo-600"   bg="bg-indigo-50" />
        <AdminStatCard icon={Star}          label="Shop Products"     value={v(extraStats.shop)}        color="text-orange-600"   bg="bg-orange-50" />
      </div>

      {/* Top categories */}
      {liveCategories.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-serif font-bold text-kerala-deep mb-4">Top Categories by Listings</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {liveCategories.map(c => (
              <div key={c.id}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600 truncate mr-2">{c.name}</span>
                  <span className="font-semibold text-kerala-deep flex-shrink-0">{c.count.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-kerala-green rounded-full" style={{ width: `${(c.count / catMax) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent signups */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif font-bold text-kerala-deep">Recent Signups</h3>
          <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
            {stats ? `${stats.totalUsers.toLocaleString()} total users` : '—'}
          </span>
        </div>
        {recentUsers.length === 0 ? (
          <div className="flex justify-center py-4"><Loader2 size={20} className="animate-spin text-kerala-green" /></div>
        ) : (
          <div className="space-y-3">
            {recentUsers.map(u => (
              <div key={u.id} className="flex items-center gap-3 py-1">
                <div className="w-9 h-9 rounded-full bg-kerala-green/10 flex items-center justify-center text-sm font-bold text-kerala-green flex-shrink-0">
                  {(u.full_name ?? u.email ?? '?')[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-kerala-deep">{u.full_name || '—'}</p>
                  <p className="text-xs text-gray-400">{u.email}</p>
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0">{fmtDate(u.created_at)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Listing Edit Drawer ───────────────────────────────────────────────────
function ListingDrawer({ listing, onClose, onUpdate }: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listing: any
  onClose: () => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUpdate: (updated: any) => void
}) {
  const [editing, setEditing] = useState(false)
  const [saving,  setSaving]  = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [form, setForm] = useState({
    name:        listing.name        ?? '',
    tagline:     listing.tagline     ?? '',
    description: listing.description ?? '',
    phone:       listing.phone       ?? '',
    whatsapp:    listing.whatsapp    ?? '',
    email:       listing.email       ?? '',
    website:     listing.website     ?? '',
    address:     listing.address     ?? '',
    area:        listing.area        ?? '',
    emirate:     listing.emirate     ?? '',
    status:      listing.status      ?? 'pending',
    plan:        listing.plan        ?? 'free',
    is_featured: listing.is_featured ?? false,
    is_verified: listing.is_verified ?? false,
  })

  async function save() {
    setSaving(true)
    await supabase.from('listings').update(form).eq('id', listing.id)
    onUpdate({ ...listing, ...form })
    setSaving(false)
    setEditing(false)
  }

  async function quickUpdate(patch: Record<string, unknown>) {
    await supabase.from('listings').update(patch).eq('id', listing.id)
    onUpdate({ ...listing, ...patch })
    setForm(f => ({ ...f, ...patch }))
    // Send approval email when status set to active
    if (patch.status === 'active' && listing.email) {
      fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'listing_approved',
          to: listing.email,
          ownerName: listing.owner_name || 'Business Owner',
          businessName: listing.name,
          listingSlug: listing.slug,
        }),
      }).catch(console.error)
    }
  }

  async function deleteListing() {
    if (!confirm(`Delete "${listing.name}"? This cannot be undone.`)) return
    setDeleting(true)
    await supabase.from('listings').delete().eq('id', listing.id)
    onClose()
  }

  const statusColors: Record<string, string> = {
    active:    'bg-green-100 text-green-700',
    pending:   'bg-amber-100 text-amber-600',
    suspended: 'bg-red-100 text-red-600',
    rejected:  'bg-red-100 text-red-600',
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative ml-auto w-full max-w-[95vw] sm:max-w-xl bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="font-bold text-lg text-kerala-deep truncate max-w-xs">{listing.name}</h2>
            <p className="text-xs text-gray-400 font-mono">{listing.id.slice(0,16)}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"><X size={18} /></button>
        </div>

        <div className="p-5 flex-1 space-y-5">
          {/* Quick action buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => quickUpdate({ status: 'active' })}
              className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${form.status === 'active' ? 'bg-green-600 text-white' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}>
              <CheckCircle size={15} /> Approve
            </button>
            <button onClick={() => quickUpdate({ status: 'suspended' })}
              className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${form.status === 'suspended' ? 'bg-red-600 text-white' : 'bg-red-50 text-red-700 hover:bg-red-100'}`}>
              <XCircle size={15} /> Suspend
            </button>
            <button onClick={() => quickUpdate({ is_featured: !form.is_featured })}
              className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${form.is_featured ? 'bg-kerala-gold text-white' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'}`}>
              <TrendingUp size={15} /> {form.is_featured ? 'Unfeature' : 'Feature'}
            </button>
            <button onClick={() => quickUpdate({ is_verified: !form.is_verified })}
              className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${form.is_verified ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}>
              <Shield size={15} /> {form.is_verified ? 'Unverify' : 'Verify'}
            </button>
          </div>

          {/* Status badges */}
          <div className="flex flex-wrap gap-2">
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusColors[form.status] ?? 'bg-gray-100 text-gray-500'}`}>{capitalize(form.status)}</span>
            {form.is_featured && <span className="text-xs font-bold px-3 py-1 rounded-full bg-kerala-gold/20 text-kerala-gold">⭐ Featured</span>}
            {form.is_verified && <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-700">✓ Verified</span>}
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-gray-100 text-gray-600">{capitalize(form.plan)} Plan</span>
          </div>

          {/* View on site */}
          <a href={`/en/directory/${listing.slug}`} target="_blank" rel="noreferrer"
            className="flex items-center gap-2 text-sm text-kerala-green font-semibold hover:underline">
            <Eye size={14} /> View public listing
          </a>

          {/* Info or Edit form */}
          {editing ? (
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-800 text-sm">Edit Listing Details</h3>
              {[
                { label: 'Business Name', key: 'name' },
                { label: 'Tagline', key: 'tagline' },
                { label: 'Phone', key: 'phone' },
                { label: 'WhatsApp', key: 'whatsapp' },
                { label: 'Email', key: 'email' },
                { label: 'Website', key: 'website' },
                { label: 'Emirate', key: 'emirate' },
                { label: 'Area', key: 'area' },
                { label: 'Address', key: 'address' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-medium text-gray-600 mb-1">{f.label}</label>
                  <input
                    value={(form as Record<string, string>)[f.key]}
                    onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                <textarea rows={4} value={form.description}
                  onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Plan</label>
                <select value={form.plan} onChange={e => setForm(prev => ({ ...prev, plan: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30">
                  {['free','basic','standard','premium','elite'].map(p => <option key={p} value={p}>{capitalize(p)}</option>)}
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={save} disabled={saving}
                  className="flex-1 bg-kerala-green text-white py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2">
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />} Save Changes
                </button>
                <button onClick={() => setEditing(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-200">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800 text-sm">Business Details</h3>
                <button onClick={() => setEditing(true)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-kerala-green bg-kerala-green/10 px-3 py-1.5 rounded-lg hover:bg-kerala-green/20">
                  ✏️ Edit
                </button>
              </div>
              {[
                { label: 'Phone',    value: listing.phone },
                { label: 'WhatsApp', value: listing.whatsapp },
                { label: 'Email',    value: listing.email },
                { label: 'Website',  value: listing.website },
                { label: 'Emirate',  value: listing.emirate },
                { label: 'Area',     value: listing.area },
                { label: 'Address',  value: listing.address },
              ].map(f => f.value ? (
                <div key={f.label} className="flex gap-3 text-sm">
                  <span className="text-gray-400 w-20 shrink-0">{f.label}</span>
                  <span className="text-gray-800 font-medium">{f.value}</span>
                </div>
              ) : null)}
              {listing.description && (
                <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-600">{listing.description}</div>
              )}
            </div>
          )}

          {/* Danger zone */}
          <div className="border border-red-100 rounded-xl p-4 bg-red-50">
            <p className="text-xs font-semibold text-red-700 mb-2">Danger Zone</p>
            <button onClick={deleteListing} disabled={deleting}
              className="flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-800 disabled:opacity-60">
              {deleting ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
              Delete this listing permanently
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Section: Listings ─────────────────────────────────────────────────────
function AdminListingsSection() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [allListings, setAllListings]     = useState<any[]>([])
  const [loadingData, setLoadingData]     = useState(true)
  const [listingFilter, setListingFilter] = useState<'all' | 'active' | 'pending' | 'suspended'>('all')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selected, setSelected]           = useState<any | null>(null)
  const [search, setSearch]               = useState('')

  async function load() {
    setLoadingData(true)
    const { data } = await supabase
      .from('listings')
      .select('id, slug, name, plan, status, emirate, area, phone, email, website, address, whatsapp, description, tagline, owner_id, rating_avg, is_featured, is_verified, created_at')
      .order('created_at', { ascending: false })
      .limit(500)
    setAllListings(data ?? [])
    setLoadingData(false)
  }

  useEffect(() => { load() }, [])

  const statusColors: Record<string, string> = {
    active:    'bg-green-100 text-green-700',
    pending:   'bg-amber-100 text-amber-600',
    suspended: 'bg-red-100 text-red-600',
  }

  const filtered = allListings
    .filter(l => listingFilter === 'all' || l.status === listingFilter)
    .filter(l => !search || l.name?.toLowerCase().includes(search.toLowerCase()) || l.emirate?.toLowerCase().includes(search.toLowerCase()))

  const pending = allListings.filter(l => l.status === 'pending')

  if (loadingData) return <div className="flex items-center justify-center py-20"><Loader2 size={28} className="animate-spin text-kerala-green" /></div>

  return (
    <div className="space-y-6">
      {selected && (
        <ListingDrawer
          listing={selected}
          onClose={() => setSelected(null)}
          onUpdate={updated => {
            setAllListings(prev => prev.map(l => l.id === updated.id ? updated : l).filter(l => !(updated.id === l.id && updated._deleted)))
            setSelected(updated)
          }}
        />
      )}

      <div className="flex flex-wrap gap-2 items-center justify-between">
        <h2 className="font-serif font-bold text-2xl text-kerala-deep">Listings Management</h2>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">{allListings.length} total</span>
          <button onClick={() => exportCSV(filtered, 'listings.csv')} className="flex items-center gap-2 text-sm font-semibold bg-gray-100 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-200">↓ CSV</button>
        </div>
      </div>

      {/* Pending banner */}
      {pending.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle size={18} className="text-amber-500 shrink-0" />
          <p className="text-sm text-amber-800 font-medium">{pending.length} listing{pending.length > 1 ? 's' : ''} waiting for approval</p>
          <button onClick={() => setListingFilter('pending')} className="ml-auto text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1.5 rounded-lg hover:bg-amber-200">
            Review now
          </button>
        </div>
      )}

      {/* Filters + search */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
          {(['all', 'active', 'pending', 'suspended'] as const).map(f => (
            <button key={f} onClick={() => setListingFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${listingFilter === f ? 'bg-white text-kerala-deep shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              {f} {f !== 'all' && <span className="ml-1 text-[10px]">({allListings.filter(l => l.status === f).length})</span>}
            </button>
          ))}
        </div>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search listings..."
          className="flex-1 w-full sm:min-w-[200px] px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {filtered.length === 0 ? (
            <div className="p-10 text-center text-gray-400 text-sm">No listings found.</div>
          ) : (
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {['Business Name', 'Emirate', 'Status', 'Plan', 'Featured', 'Verified', 'Rating', 'Date', 'Actions'].map(h => (
                    <th key={h} className={`text-left text-xs font-semibold text-gray-500 px-4 py-3${h === 'Rating' || h === 'Date' ? ' hidden sm:table-cell' : ''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((l) => (
                  <tr key={l.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-sm text-kerala-deep">{l.name}</p>
                      <p className="text-xs text-gray-400 font-mono">{l.id.slice(0,8)}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">{l.emirate ?? '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[l.status] ?? 'bg-gray-100 text-gray-500'}`}>
                        {capitalize(l.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600 capitalize">{l.plan ?? '—'}</td>
                    <td className="px-4 py-3 text-xs">{l.is_featured ? '⭐' : '—'}</td>
                    <td className="px-4 py-3 text-xs">{l.is_verified ? '✓' : '—'}</td>
                    <td className="px-4 py-3 text-xs text-gray-600 hidden sm:table-cell">{l.rating_avg > 0 ? `${Number(l.rating_avg).toFixed(1)} ★` : '—'}</td>
                    <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap hidden sm:table-cell">{fmtDate(l.created_at)}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        <button onClick={() => setSelected(l)}
                          className="text-xs bg-kerala-green/10 text-kerala-green font-semibold px-2.5 py-1.5 rounded-lg hover:bg-kerala-green/20 transition-colors">
                          Manage
                        </button>
                        {l.status === 'pending' && (
                          <button onClick={async () => {
                            await supabase.from('listings').update({ status: 'active' }).eq('id', l.id)
                            setAllListings(prev => prev.map(x => x.id === l.id ? { ...x, status: 'active' } : x))
                            if (l.email) {
                              fetch('/api/email/send', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  type: 'listing_approved',
                                  to: l.email,
                                  ownerName: l.owner_name || 'Business Owner',
                                  businessName: l.name,
                                  listingSlug: l.slug,
                                }),
                              }).catch(console.error)
                            }
                          }} className="text-xs bg-green-100 text-green-700 font-semibold px-2.5 py-1.5 rounded-lg hover:bg-green-200 transition-colors">
                            ✓ Approve
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

// ── CSV Export helper ─────────────────────────────────────────────────────
function exportCSV(rows: any[], filename: string) {
  if (!rows.length) return
  const keys = Object.keys(rows[0])
  const csv  = [keys.join(','), ...rows.map(r => keys.map(k => JSON.stringify(r[k] ?? '')).join(','))].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a'); a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}

// ── User Drawer ───────────────────────────────────────────────────────────
function UserDrawer({ user, onClose, onUpdate }: { user: any; onClose: () => void; onUpdate: (u: any) => void }) {
  const [listings, setListings] = useState<any[]>([])
  const [saving,   setSaving]   = useState(false)

  useEffect(() => {
    supabase.from('listings').select('id, name, status, emirate, created_at').eq('owner_id', user.id).limit(20)
      .then(({ data }) => setListings(data ?? []))
  }, [user.id])

  async function patch(update: Record<string, unknown>) {
    setSaving(true)
    await supabase.from('profiles').update(update).eq('id', user.id)
    onUpdate({ ...user, ...update })
    setSaving(false)
  }

  const roleLabel = user.is_admin ? { label: 'Super Admin', cls: 'bg-red-100 text-red-600' }
    : user.is_business_owner ? { label: 'Business Owner', cls: 'bg-kerala-gold/20 text-kerala-gold' }
    : { label: 'User', cls: 'bg-gray-100 text-gray-500' }

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative ml-auto w-full max-w-[95vw] sm:max-w-md bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-kerala-green/10 flex items-center justify-center font-bold text-kerala-green">
              {(user.full_name ?? user.email ?? '?')[0].toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-kerala-deep">{user.full_name || 'No name'}</p>
              <p className="text-xs text-gray-400">{user.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100"><X size={18} /></button>
        </div>

        <div className="p-5 space-y-5 flex-1">
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${roleLabel.cls}`}>{roleLabel.label}</span>
            {user.is_verified && <span className="text-xs font-bold px-3 py-1 rounded-full bg-green-100 text-green-700">✓ Verified</span>}
            {user.is_blocked  && <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-100 text-red-600">🚫 Blocked</span>}
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => patch({ is_verified: !user.is_verified })} disabled={saving}
              className={`py-2.5 rounded-xl text-sm font-semibold transition-colors ${user.is_verified ? 'bg-green-600 text-white' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}>
              {user.is_verified ? '✓ Verified' : 'Verify User'}
            </button>
            <button onClick={() => patch({ is_blocked: !user.is_blocked })} disabled={saving}
              className={`py-2.5 rounded-xl text-sm font-semibold transition-colors ${user.is_blocked ? 'bg-gray-600 text-white' : 'bg-red-50 text-red-700 hover:bg-red-100'}`}>
              {user.is_blocked ? 'Unblock' : 'Block User'}
            </button>
            <button onClick={() => patch({ is_business_owner: !user.is_business_owner })} disabled={saving}
              className="py-2.5 rounded-xl text-sm font-semibold bg-kerala-gold/10 text-kerala-gold hover:bg-kerala-gold/20 transition-colors">
              {user.is_business_owner ? 'Remove Business' : 'Set as Business'}
            </button>
            <button onClick={() => patch({ is_admin: !user.is_admin })} disabled={saving}
              className={`py-2.5 rounded-xl text-sm font-semibold transition-colors ${user.is_admin ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              {user.is_admin ? 'Remove Admin' : 'Make Admin'}
            </button>
          </div>

          {/* Details */}
          <div className="space-y-2 text-sm">
            {[
              { label: 'Phone',   value: user.phone },
              { label: 'Locale',  value: user.preferred_locale },
              { label: 'Joined',  value: fmtDate(user.created_at) },
            ].map(f => f.value ? (
              <div key={f.label} className="flex gap-3">
                <span className="text-gray-400 w-20 shrink-0">{f.label}</span>
                <span className="text-gray-700 font-medium">{f.value}</span>
              </div>
            ) : null)}
          </div>

          {/* Their listings */}
          <div>
            <p className="font-semibold text-gray-800 text-sm mb-2">Their Listings ({listings.length})</p>
            {listings.length === 0 ? (
              <p className="text-xs text-gray-400">No listings submitted.</p>
            ) : (
              <div className="space-y-1.5">
                {listings.map(l => (
                  <div key={l.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                    <span className="text-sm text-kerala-deep font-medium truncate">{l.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ml-2 shrink-0 ${l.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-600'}`}>{l.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Section: Users ────────────────────────────────────────────────────────
function AdminUsersSection() {
  const [users,   setUsers]   = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')
  const [filter,  setFilter]  = useState<'all'|'business'|'verified'|'blocked'>('all')
  const [selected, setSelected] = useState<any|null>(null)

  async function load() {
    const { data } = await supabase
      .from('profiles')
      .select('id, email, full_name, avatar_url, phone, is_admin, is_business_owner, is_verified, is_blocked, is_professional, created_at, preferred_locale')
      .order('created_at', { ascending: false })
      .limit(500)
    setUsers(data ?? [])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const filtered = users
    .filter(u => filter === 'all' || (filter === 'business' && u.is_business_owner) || (filter === 'verified' && u.is_verified) || (filter === 'blocked' && u.is_blocked))
    .filter(u => !search || u.full_name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()))

  const roleLabel = (u: any) => u.is_admin ? { label: 'Admin', cls: 'bg-red-100 text-red-600' }
    : u.is_business_owner ? { label: 'Business', cls: 'bg-kerala-gold/20 text-kerala-gold' }
    : { label: 'User', cls: 'bg-gray-100 text-gray-500' }

  return (
    <div className="space-y-5">
      {selected && <UserDrawer user={selected} onClose={() => setSelected(null)} onUpdate={u => { setUsers(prev => prev.map(x => x.id === u.id ? u : x)); setSelected(u) }} />}

      <div className="flex flex-wrap gap-2 items-center justify-between">
        <h2 className="font-serif font-bold text-2xl text-kerala-deep">User Management</h2>
        <button onClick={() => exportCSV(filtered, 'users.csv')} className="flex items-center gap-2 text-sm font-semibold bg-gray-100 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-200">
          ↓ Export CSV
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
          {(['all','business','verified','blocked'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize ${filter === f ? 'bg-white text-kerala-deep shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              {f} <span className="text-[10px] ml-0.5">
                ({f === 'all' ? users.length : users.filter(u => f === 'business' ? u.is_business_owner : f === 'verified' ? u.is_verified : u.is_blocked).length})
              </span>
            </button>
          ))}
        </div>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..."
          className="flex-1 w-full sm:min-w-[200px] px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? <div className="flex justify-center py-16"><Loader2 size={28} className="animate-spin text-kerala-green" /></div> :
        filtered.length === 0 ? <div className="p-10 text-center text-gray-400 text-sm">No users found.</div> : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead><tr className="border-b border-gray-100 bg-gray-50">
                {['User', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map(h => <th key={h} className={`text-left text-xs font-semibold text-gray-500 px-4 py-3${h === 'Joined' ? ' hidden sm:table-cell' : ''}`}>{h}</th>)}
              </tr></thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(u => {
                  const role = roleLabel(u)
                  return (
                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-kerala-green/10 flex items-center justify-center text-xs font-bold text-kerala-green shrink-0">
                            {(u.full_name ?? u.email ?? '?')[0].toUpperCase()}
                          </div>
                          <span className="font-semibold text-sm text-kerala-deep">{u.full_name || '—'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">{u.email}</td>
                      <td className="px-4 py-3"><span className={`text-xs font-bold px-2 py-0.5 rounded-full ${role.cls}`}>{role.label}</span></td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          {u.is_verified && <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">Verified</span>}
                          {u.is_blocked  && <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-medium">Blocked</span>}
                          {!u.is_verified && !u.is_blocked && <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium">Active</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap hidden sm:table-cell">{fmtDate(u.created_at)}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => setSelected(u)} className="text-xs bg-kerala-green/10 text-kerala-green font-semibold px-2.5 py-1.5 rounded-lg hover:bg-kerala-green/20">
                          Manage
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Section: Shop ─────────────────────────────────────────────────────────
function AdminShopSection() {
  const [items,   setItems]   = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')
  const [filter,  setFilter]  = useState<'all'|'active'|'inactive'>('all')

  useEffect(() => {
    supabase.from('shop_listings')
      .select('id, name, listing_type, price, stock_status, is_active, is_bestseller, rating_avg, created_at, listing_id')
      .order('created_at', { ascending: false }).limit(500)
      .then(({ data }) => { setItems(data ?? []); setLoading(false) })
  }, [])

  async function toggleActive(id: string, val: boolean) {
    await supabase.from('shop_listings').update({ is_active: val }).eq('id', id)
    setItems(prev => prev.map(i => i.id === id ? { ...i, is_active: val } : i))
  }

  async function del(id: string) {
    if (!confirm('Delete this shop item?')) return
    await supabase.from('shop_listings').delete().eq('id', id)
    setItems(prev => prev.filter(i => i.id !== id))
  }

  const filtered = items
    .filter(i => filter === 'all' || (filter === 'active' && i.is_active) || (filter === 'inactive' && !i.is_active))
    .filter(i => !search || i.name?.toLowerCase().includes(search.toLowerCase()))

  const stockColors: Record<string,string> = { in_stock: 'bg-green-100 text-green-700', out_of_stock: 'bg-red-100 text-red-600', pre_order: 'bg-blue-100 text-blue-600' }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <h2 className="font-serif font-bold text-2xl text-kerala-deep">Shop Management</h2>
        <div className="flex gap-2">
          <span className="text-sm text-gray-500 self-center">{items.length} products</span>
          <button onClick={() => exportCSV(filtered, 'shop.csv')} className="flex items-center gap-2 text-sm font-semibold bg-gray-100 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-200">↓ CSV</button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
          {(['all','active','inactive'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize ${filter === f ? 'bg-white text-kerala-deep shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              {f}
            </button>
          ))}
        </div>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
          className="flex-1 w-full sm:min-w-[200px] px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-kerala-green" /></div> :
        filtered.length === 0 ? <div className="p-10 text-center text-gray-400 text-sm">No products found.</div> : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead><tr className="border-b border-gray-100 bg-gray-50">
                {['Product','Type','Price','Stock','Active','Bestseller','Rating','Actions'].map(h => <th key={h} className="text-left text-xs font-semibold text-gray-500 px-4 py-3">{h}</th>)}
              </tr></thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(i => (
                  <tr key={i.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold text-sm text-kerala-deep max-w-[180px] truncate">{i.name}</td>
                    <td className="px-4 py-3 text-xs text-gray-500 capitalize">{i.listing_type?.replace(/_/g,' ') ?? '—'}</td>
                    <td className="px-4 py-3 text-xs font-semibold text-gray-700">{i.price ? `AED ${i.price}` : 'Free'}</td>
                    <td className="px-4 py-3"><span className={`text-xs font-medium px-2 py-0.5 rounded-full ${stockColors[i.stock_status] ?? 'bg-gray-100 text-gray-500'}`}>{i.stock_status?.replace(/_/g,' ') ?? '—'}</span></td>
                    <td className="px-4 py-3"><span className={`text-xs font-bold px-2 py-0.5 rounded-full ${i.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{i.is_active ? 'Yes' : 'No'}</span></td>
                    <td className="px-4 py-3 text-xs">{i.is_bestseller ? '⭐' : '—'}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{i.rating_avg > 0 ? `${Number(i.rating_avg).toFixed(1)} ★` : '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        <button onClick={() => toggleActive(i.id, !i.is_active)}
                          className={`text-xs px-2.5 py-1 rounded-lg font-medium ${i.is_active ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>
                          {i.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                        <button onClick={() => del(i.id)} className="text-xs bg-red-50 text-red-600 px-2.5 py-1 rounded-lg hover:bg-red-100 font-medium">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Section: Payments ─────────────────────────────────────────────────────
function AdminPaymentsSection() {
  const [rows,    setRows]    = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter,  setFilter]  = useState<'all'|'paid'|'pending'|'failed'|'refunded'>('all')
  const [search,  setSearch]  = useState('')

  useEffect(() => {
    supabase.from('payments')
      .select('id, amount, currency, status, method, reference, notes, created_at, listing_id, user_id, profiles(full_name, email), listings(name)')
      .order('created_at', { ascending: false }).limit(300)
      .then(({ data, error }) => {
        if (error) console.error('[Payments]', error.message)
        setRows(data ?? [])
        setLoading(false)
      })
  }, [])

  async function updateStatus(id: string, status: string) {
    await supabase.from('payments').update({ status }).eq('id', id)
    setRows(prev => prev.map(r => r.id === id ? { ...r, status } : r))
  }

  const filtered = rows
    .filter(r => filter === 'all' || r.status === filter)
    .filter(r => !search || (r.profiles as any)?.email?.toLowerCase().includes(search.toLowerCase()) || (r.listings as any)?.name?.toLowerCase().includes(search.toLowerCase()) || r.reference?.toLowerCase().includes(search.toLowerCase()))

  const totalPaid    = rows.filter(r => r.status === 'paid').reduce((s, r) => s + (r.amount ?? 0), 0)
  const totalPending = rows.filter(r => r.status === 'pending').reduce((s, r) => s + (r.amount ?? 0), 0)

  const statusColors: Record<string,string> = {
    paid:     'bg-green-100 text-green-700',
    pending:  'bg-amber-100 text-amber-600',
    failed:   'bg-red-100 text-red-600',
    refunded: 'bg-gray-100 text-gray-500',
    manual:   'bg-blue-100 text-blue-600',
  }

  const methodIcon: Record<string,string> = { card: '💳', bank_transfer: '🏦', cash: '💵', manual: '📝' }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <h2 className="font-serif font-bold text-2xl text-kerala-deep">Payments & Invoices</h2>
        <button onClick={() => exportCSV(filtered, 'payments.csv')} className="text-sm font-semibold bg-gray-100 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-200">↓ CSV</button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Received',  value: `AED ${totalPaid.toLocaleString()}`,    color: 'text-green-600',  bg: 'bg-green-50'  },
          { label: 'Pending',         value: `AED ${totalPending.toLocaleString()}`, color: 'text-amber-600',  bg: 'bg-amber-50'  },
          { label: 'Paid Invoices',   value: String(rows.filter(r => r.status === 'paid').length),    color: 'text-kerala-green', bg: 'bg-kerala-green/10' },
          { label: 'Failed',          value: String(rows.filter(r => r.status === 'failed').length),  color: 'text-red-500',      bg: 'bg-red-50'  },
        ].map(c => (
          <div key={c.label} className={`${c.bg} rounded-2xl p-4`}>
            <p className="text-xs text-gray-500 mb-1">{c.label}</p>
            <p className={`text-xl font-bold font-serif ${c.color}`}>{c.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
          {(['all','paid','pending','failed','refunded'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize ${filter === f ? 'bg-white text-kerala-deep shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              {f}
            </button>
          ))}
        </div>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by email, business, reference..."
          className="flex-1 w-full sm:min-w-[200px] px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-kerala-green" /></div> :
        filtered.length === 0 ? <div className="p-10 text-center text-gray-400 text-sm">No payments found.</div> : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead><tr className="border-b border-gray-100 bg-gray-50">
                {['Business','User','Amount','Method','Status','Reference','Date','Actions'].map(h =>
                  <th key={h} className={`text-left text-xs font-semibold text-gray-500 px-4 py-3${h === 'Method' ? ' hidden sm:table-cell' : ''}`}>{h}</th>)}
              </tr></thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-semibold text-kerala-deep max-w-[160px] truncate">{(r.listings as any)?.name ?? '—'}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{(r.profiles as any)?.email ?? '—'}</td>
                    <td className="px-4 py-3 text-sm font-bold text-kerala-deep">AED {(r.amount ?? 0).toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm hidden sm:table-cell">{methodIcon[r.method] ?? '💳'} {r.method?.replace(/_/g,' ') ?? '—'}</td>
                    <td className="px-4 py-3"><span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[r.status] ?? 'bg-gray-100 text-gray-500'}`}>{r.status}</span></td>
                    <td className="px-4 py-3 text-xs text-gray-400 font-mono">{r.reference ?? '—'}</td>
                    <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{fmtDate(r.created_at)}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        {r.status === 'pending' && (
                          <button onClick={() => updateStatus(r.id, 'paid')} className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-lg hover:bg-green-200 font-medium">Mark Paid</button>
                        )}
                        {r.status === 'paid' && (
                          <button onClick={() => updateStatus(r.id, 'refunded')} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg hover:bg-gray-200 font-medium">Refund</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800">
        <p className="font-semibold mb-1">Setup required</p>
        <p className="text-xs">Run this SQL to create the payments table:</p>
        <code className="block bg-blue-100 rounded p-2 mt-1 font-mono text-xs whitespace-pre">{`CREATE TABLE IF NOT EXISTS payments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id uuid REFERENCES listings(id) ON DELETE SET NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  amount numeric NOT NULL DEFAULT 0,
  currency text DEFAULT 'AED',
  status text DEFAULT 'pending', -- paid | pending | failed | refunded
  method text DEFAULT 'manual',  -- card | bank_transfer | cash | manual
  reference text,
  notes text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth read payments" ON payments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth write payments" ON payments FOR ALL TO authenticated USING (true);`}</code>
      </div>
    </div>
  )
}

// ── Section: Offers ────────────────────────────────────────────────────────
function AdminOffersSection() {
  const [rows,    setRows]    = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter,  setFilter]  = useState<'all'|'pending'|'active'|'expired'>('all')
  const [adding,  setAdding]  = useState(false)
  const [form,    setForm]    = useState({ title: '', description: '', discount: '', valid_until: '', listing_id: '', is_featured: false })

  useEffect(() => {
    supabase.from('offers')
      .select('id, title, description, discount, valid_until, status, is_featured, created_at, listing_id, listings(name, emirate)')
      .order('created_at', { ascending: false }).limit(200)
      .then(({ data, error }) => {
        if (error) console.error('[Offers]', error.message)
        setRows(data ?? [])
        setLoading(false)
      })
  }, [])

  async function updateStatus(id: string, status: string) {
    await supabase.from('offers').update({ status }).eq('id', id)
    setRows(prev => prev.map(r => r.id === id ? { ...r, status } : r))
  }

  async function toggleFeatured(id: string, val: boolean) {
    await supabase.from('offers').update({ is_featured: val }).eq('id', id)
    setRows(prev => prev.map(r => r.id === id ? { ...r, is_featured: val } : r))
  }

  async function del(id: string) {
    if (!confirm('Delete this offer?')) return
    await supabase.from('offers').delete().eq('id', id)
    setRows(prev => prev.filter(r => r.id !== id))
  }

  async function addOffer() {
    const { data } = await supabase.from('offers').insert([{ ...form, status: 'active' }]).select().single()
    if (data) setRows(prev => [data, ...prev])
    setAdding(false)
    setForm({ title: '', description: '', discount: '', valid_until: '', listing_id: '', is_featured: false })
  }

  const filtered = rows.filter(r => filter === 'all' || r.status === filter)
  const statusColors: Record<string,string> = { active: 'bg-green-100 text-green-700', pending: 'bg-amber-100 text-amber-600', expired: 'bg-gray-100 text-gray-500', rejected: 'bg-red-100 text-red-600' }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <h2 className="font-serif font-bold text-2xl text-kerala-deep">Offers & Deals</h2>
        <div className="flex gap-2">
          <button onClick={() => exportCSV(filtered, 'offers.csv')} className="text-sm font-semibold bg-gray-100 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-200">↓ CSV</button>
          <button onClick={() => setAdding(true)} className="flex items-center gap-2 bg-kerala-green text-white text-sm font-semibold px-4 py-2 rounded-xl hover:opacity-90">
            <Plus size={15} /> Add Offer
          </button>
        </div>
      </div>

      {adding && (
        <div className="bg-white rounded-2xl border border-kerala-green/30 shadow-sm p-5 space-y-4">
          <h3 className="font-semibold text-kerala-deep">New Offer</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Offer Title',       key: 'title',        type: 'text' },
              { label: 'Discount / Value',  key: 'discount',     type: 'text' },
              { label: 'Valid Until',       key: 'valid_until',  type: 'date' },
              { label: 'Listing ID (opt)',  key: 'listing_id',   type: 'text' },
            ].map(f => (
              <div key={f.key}>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">{f.label}</label>
                <input type={f.type} value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30" />
              </div>
            ))}
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Description</label>
            <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 resize-none" />
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="feat" checked={form.is_featured} onChange={e => setForm(p => ({ ...p, is_featured: e.target.checked }))} className="w-4 h-4 accent-kerala-green" />
            <label htmlFor="feat" className="text-sm text-gray-700">Feature on homepage</label>
          </div>
          <div className="flex gap-2">
            <button onClick={addOffer} className="bg-kerala-green text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90">Save Offer</button>
            <button onClick={() => setAdding(false)} className="bg-gray-100 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-semibold">Cancel</button>
          </div>
        </div>
      )}

      <div className="flex gap-2 flex-wrap">
        {(['all','pending','active','expired'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize ${filter === f ? 'bg-kerala-green text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {f} ({f === 'all' ? rows.length : rows.filter(r => r.status === f).length})
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-kerala-green" /></div> :
        filtered.length === 0 ? <div className="p-10 text-center text-gray-400 text-sm">No offers found.</div> : (
          <div className="divide-y divide-gray-50">
            {filtered.map(r => (
              <div key={r.id} className="p-4 flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="font-bold text-kerala-deep">{r.title}</p>
                    {r.discount && <span className="text-xs bg-kerala-gold/20 text-kerala-gold px-2 py-0.5 rounded-full font-bold">{r.discount}</span>}
                    {r.is_featured && <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full font-semibold">⭐ Featured</span>}
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${statusColors[r.status] ?? 'bg-gray-100 text-gray-500'}`}>{r.status}</span>
                  </div>
                  {(r.listings as any)?.name && <p className="text-xs text-gray-500 mb-1">📍 {(r.listings as any).name} · {(r.listings as any).emirate}</p>}
                  {r.description && <p className="text-sm text-gray-600 line-clamp-1">{r.description}</p>}
                  {r.valid_until && <p className="text-xs text-gray-400 mt-1">Valid until: {fmtDate(r.valid_until)}</p>}
                </div>
                <div className="flex flex-col gap-1.5 shrink-0">
                  {r.status === 'pending' && <button onClick={() => updateStatus(r.id, 'active')} className="text-xs bg-green-100 text-green-700 px-2.5 py-1.5 rounded-lg hover:bg-green-200 font-medium">Approve</button>}
                  {r.status === 'active'  && <button onClick={() => updateStatus(r.id, 'expired')} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1.5 rounded-lg hover:bg-gray-200 font-medium">Expire</button>}
                  <button onClick={() => toggleFeatured(r.id, !r.is_featured)} className={`text-xs px-2.5 py-1.5 rounded-lg font-medium ${r.is_featured ? 'bg-purple-100 text-purple-600 hover:bg-purple-200' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}>
                    {r.is_featured ? 'Unfeature' : 'Feature'}
                  </button>
                  <button onClick={() => del(r.id)} className="text-xs bg-red-50 text-red-600 px-2.5 py-1.5 rounded-lg hover:bg-red-100 font-medium">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-blue-800">
        <p className="font-semibold mb-1">Setup required</p>
        <code className="block bg-blue-100 rounded p-2 mt-1 font-mono whitespace-pre">{`CREATE TABLE IF NOT EXISTS offers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id uuid REFERENCES listings(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  discount text,
  valid_until date,
  status text DEFAULT 'pending',
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth read offers" ON offers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth write offers" ON offers FOR ALL TO authenticated USING (true);`}</code>
      </div>
    </div>
  )
}

// ── Section: Ads ──────────────────────────────────────────────────────────
function AdminAdsSection() {
  const [rows,    setRows]    = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [adding,  setAdding]  = useState(false)
  const [form,    setForm]    = useState({ slot: '', advertiser: '', price: 0, start_date: '', end_date: '', target_url: '', status: 'active', impressions: 0, clicks: 0 })

  const AD_SLOTS = ['Homepage Banner', 'Category Page Banner', 'Search Results Spotlight', 'Ticker Announcements', 'Location Page Banner', 'Sidebar Ad', 'Mobile Banner']

  useEffect(() => {
    supabase.from('ads').select('*').order('created_at', { ascending: false }).limit(100)
      .then(({ data, error }) => {
        if (error) console.error('[Ads]', error.message)
        setRows(data ?? [])
        setLoading(false)
      })
  }, [])

  async function save() {
    const { data } = await supabase.from('ads').insert([form]).select().single()
    if (data) setRows(prev => [data, ...prev])
    setAdding(false)
    setForm({ slot: '', advertiser: '', price: 0, start_date: '', end_date: '', target_url: '', status: 'active', impressions: 0, clicks: 0 })
  }

  async function toggleStatus(id: string, status: string) {
    const next = status === 'active' ? 'paused' : 'active'
    await supabase.from('ads').update({ status: next }).eq('id', id)
    setRows(prev => prev.map(r => r.id === id ? { ...r, status: next } : r))
  }

  async function del(id: string) {
    if (!confirm('Delete this ad?')) return
    await supabase.from('ads').delete().eq('id', id)
    setRows(prev => prev.filter(r => r.id !== id))
  }

  const totalRevenue = rows.filter(r => r.status === 'active').reduce((s, r) => s + (r.price ?? 0), 0)

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <h2 className="font-serif font-bold text-2xl text-kerala-deep">Ads & Promotions</h2>
        <div className="flex gap-2">
          <span className="text-sm text-gray-500 self-center">AED {totalRevenue.toLocaleString()}/mo active</span>
          <button onClick={() => exportCSV(rows, 'ads.csv')} className="text-sm font-semibold bg-gray-100 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-200">↓ CSV</button>
          <button onClick={() => setAdding(true)} className="flex items-center gap-2 bg-kerala-green text-white text-sm font-semibold px-4 py-2 rounded-xl hover:opacity-90">
            <Plus size={15} /> New Ad
          </button>
        </div>
      </div>

      {adding && (
        <div className="bg-white rounded-2xl border border-kerala-green/30 shadow-sm p-5 space-y-4">
          <h3 className="font-semibold text-kerala-deep">New Ad Slot</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Ad Slot</label>
              <select value={form.slot} onChange={e => setForm(p => ({ ...p, slot: e.target.value }))}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 bg-white">
                <option value="">Select slot…</option>
                {AD_SLOTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            {[
              { label: 'Advertiser Name', key: 'advertiser',  type: 'text'   },
              { label: 'Price (AED/mo)',  key: 'price',       type: 'number' },
              { label: 'Target URL',      key: 'target_url',  type: 'url'    },
              { label: 'Start Date',      key: 'start_date',  type: 'date'   },
              { label: 'End Date',        key: 'end_date',    type: 'date'   },
            ].map(f => (
              <div key={f.key}>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">{f.label}</label>
                <input type={f.type} value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value }))}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30" />
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={save} className="bg-kerala-green text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90">Save Ad</button>
            <button onClick={() => setAdding(false)} className="bg-gray-100 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-semibold">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-kerala-green" /></div> :
        rows.length === 0 ? (
          <div className="p-10 text-center text-gray-400 text-sm">No ads yet. Click "New Ad" to add one.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px]">
              <thead><tr className="border-b border-gray-100 bg-gray-50">
                {['Slot','Advertiser','Price','Impressions','Clicks','Dates','Status','Actions'].map(h =>
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 px-4 py-3">{h}</th>)}
              </tr></thead>
              <tbody className="divide-y divide-gray-50">
                {rows.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-semibold text-kerala-deep">{r.slot}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{r.advertiser || '—'}</td>
                    <td className="px-4 py-3 text-sm font-bold text-kerala-deep">AED {(r.price ?? 0).toLocaleString()}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{(r.impressions ?? 0).toLocaleString()}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{(r.clicks ?? 0).toLocaleString()}</td>
                    <td className="px-4 py-3 text-xs text-gray-400">{r.start_date ? `${r.start_date} → ${r.end_date ?? '∞'}` : '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${r.status === 'active' ? 'bg-green-100 text-green-700' : r.status === 'paused' ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-500'}`}>{r.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        <button onClick={() => toggleStatus(r.id, r.status)} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg hover:bg-gray-200 font-medium">
                          {r.status === 'active' ? 'Pause' : 'Resume'}
                        </button>
                        <button onClick={() => del(r.id)} className="text-xs bg-red-50 text-red-600 px-2.5 py-1 rounded-lg hover:bg-red-100 font-medium">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-blue-800">
        <p className="font-semibold mb-1">Setup required</p>
        <code className="block bg-blue-100 rounded p-2 mt-1 font-mono whitespace-pre">{`CREATE TABLE IF NOT EXISTS ads (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slot text NOT NULL,
  advertiser text,
  price numeric DEFAULT 0,
  target_url text,
  start_date date,
  end_date date,
  status text DEFAULT 'active',
  impressions integer DEFAULT 0,
  clicks integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE ads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth read ads" ON ads FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth write ads" ON ads FOR ALL TO authenticated USING (true);`}</code>
      </div>
    </div>
  )
}

// ── Section: Settings ─────────────────────────────────────────────────────
function Toggle({ on, onChange, label, desc }: { on: boolean; onChange: (v: boolean) => void; label: string; desc?: string }) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
      <div>
        <p className="font-semibold text-sm text-kerala-deep">{label}</p>
        {desc && <p className="text-xs text-gray-500 mt-0.5">{desc}</p>}
      </div>
      <button onClick={() => onChange(!on)}
        className={`relative w-12 h-6 rounded-full transition-colors ${on ? 'bg-kerala-green' : 'bg-gray-300'}`}>
        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${on ? 'translate-x-7' : 'translate-x-1'}`} />
      </button>
    </div>
  )
}

function AdminSettingsSection() {
  const [tab, setTab] = useState<'general'|'listings'|'notifications'|'admins'|'announcement'|'plans'|'security'>('general')
  const [maintenance,    setMaintenance]    = useState(false)
  const [autoApprove,    setAutoApprove]    = useState(false)
  const [requirePhone,   setRequirePhone]   = useState(true)
  const [emailOnNew,     setEmailOnNew]     = useState(true)
  const [emailOnReview,  setEmailOnReview]  = useState(false)
  const [bannerOn,       setBannerOn]       = useState(false)
  const [bannerText,     setBannerText]     = useState('')
  const [admins,         setAdmins]         = useState<any[]>([])
  const [newAdminEmail,  setNewAdminEmail]  = useState('')
  const [saving,         setSaving]         = useState(false)
  const [saved,          setSaved]          = useState(false)
  // Security / reset password
  const [newPassword,    setNewPassword]    = useState('')
  const [confirmPwd,     setConfirmPwd]     = useState('')
  const [pwdSaving,      setPwdSaving]      = useState(false)
  const [pwdMsg,         setPwdMsg]         = useState<{type:'success'|'error', text:string}|null>(null)

  useEffect(() => {
    supabase.from('profiles').select('id, email, full_name, created_at').eq('is_admin', true).limit(50)
      .then(({ data }) => setAdmins(data ?? []))
  }, [])

  function save() {
    setSaving(true)
    setTimeout(() => { setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000) }, 600)
  }

  async function addAdmin() {
    if (!newAdminEmail.trim()) return
    const { data } = await supabase.from('profiles').select('id, email, full_name').eq('email', newAdminEmail.trim()).single()
    if (!data) { alert('No user found with that email'); return }
    await supabase.from('profiles').update({ is_admin: true }).eq('id', data.id)
    setAdmins(prev => [...prev, data])
    setNewAdminEmail('')
  }

  async function removeAdmin(id: string) {
    if (!confirm('Remove admin access from this user?')) return
    await supabase.from('profiles').update({ is_admin: false }).eq('id', id)
    setAdmins(prev => prev.filter(a => a.id !== id))
  }

  async function changePassword() {
    if (!newPassword || newPassword.length < 6) { setPwdMsg({ type: 'error', text: 'Password must be at least 6 characters' }); return }
    if (newPassword !== confirmPwd) { setPwdMsg({ type: 'error', text: 'Passwords do not match' }); return }
    setPwdSaving(true); setPwdMsg(null)
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    setPwdSaving(false)
    if (error) { setPwdMsg({ type: 'error', text: error.message }) }
    else { setPwdMsg({ type: 'success', text: 'Password updated successfully!' }); setNewPassword(''); setConfirmPwd('') }
  }

  const tabs = [
    { key: 'general',      label: '⚙️ General'       },
    { key: 'listings',     label: '🏢 Listings'      },
    { key: 'notifications',label: '🔔 Notifications'  },
    { key: 'admins',       label: '👑 Admins'         },
    { key: 'announcement', label: '📢 Announcement'  },
    { key: 'plans',        label: '💎 Plans'          },
    { key: 'security',     label: '🔒 Security'       },
  ] as const

  return (
    <div className="space-y-5 max-w-3xl">
      <h2 className="font-serif font-bold text-2xl text-kerala-deep">Platform Settings</h2>

      {/* Tab bar */}
      <div className="flex flex-wrap gap-1 bg-gray-100 p-1 rounded-xl">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${tab === t.key ? 'bg-white text-kerala-deep shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* General */}
      {tab === 'general' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h3 className="font-semibold text-kerala-deep">Site Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Site Name',        key: 'siteName',  value: 'MalayaliBusiness',         type: 'text'   },
              { label: 'Tagline',          key: 'tagline',   value: 'UAE Malayali Community',   type: 'text'   },
              { label: 'Contact Email',    key: 'email',     value: 'admin@malayalibusiness.ae', type: 'email'  },
              { label: 'Support Phone',    key: 'phone',     value: '+971 4 000 0000',           type: 'tel'    },
              { label: 'WhatsApp Number',  key: 'wa',        value: '+971 50 000 0000',          type: 'tel'    },
              { label: 'Instagram Handle', key: 'ig',        value: '@malayalibusiness',         type: 'text'   },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">{f.label}</label>
                <input type={f.type} defaultValue={f.value}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 bg-gray-50" />
              </div>
            ))}
          </div>
          <Toggle on={maintenance} onChange={setMaintenance} label="Maintenance Mode" desc="Show a maintenance page to all visitors" />
          {maintenance && (
            <div className="flex items-center gap-2 text-amber-600 bg-amber-50 rounded-xl border border-amber-100 px-4 py-3 text-sm">
              <AlertTriangle size={16} /><span>Site is currently in maintenance mode.</span>
            </div>
          )}
          <button onClick={save} disabled={saving} className="bg-kerala-green text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:opacity-90 disabled:opacity-60">
            {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save Settings'}
          </button>
        </div>
      )}

      {/* Listings */}
      {tab === 'listings' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h3 className="font-semibold text-kerala-deep">Listing Controls</h3>
          <Toggle on={autoApprove} onChange={setAutoApprove} label="Auto-Approve Listings" desc="New listings go live immediately without admin review" />
          <Toggle on={requirePhone} onChange={setRequirePhone} label="Require Phone Number" desc="Listings must have a valid phone number to be published" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Free Plan Listing Limit',    value: '1'  },
              { label: 'Basic Plan Listing Limit',   value: '3'  },
              { label: 'Premium Plan Listing Limit', value: '10' },
              { label: 'Elite Plan Listing Limit',   value: '50' },
            ].map(f => (
              <div key={f.label}>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">{f.label}</label>
                <input type="number" defaultValue={f.value}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 bg-gray-50" />
              </div>
            ))}
          </div>
          <button onClick={save} disabled={saving} className="bg-kerala-green text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:opacity-90">
            {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save Settings'}
          </button>
        </div>
      )}

      {/* Notifications */}
      {tab === 'notifications' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h3 className="font-semibold text-kerala-deep">Email Notifications to Admin</h3>
          <Toggle on={emailOnNew}    onChange={setEmailOnNew}    label="New Listing Submitted"     desc="Get an email when a new listing is submitted for approval" />
          <Toggle on={emailOnReview} onChange={setEmailOnReview} label="New Review Posted"         desc="Get an email when a user posts a new review" />
          <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl text-sm text-amber-700">
            <p className="font-semibold mb-1">⚠️ SMTP not configured</p>
            <p className="text-xs">Set up Resend or SMTP credentials in your environment variables to enable email notifications. Add <code className="bg-amber-100 px-1 rounded">RESEND_API_KEY</code> to your Vercel project settings.</p>
          </div>
        </div>
      )}

      {/* Admins */}
      {tab === 'admins' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h3 className="font-semibold text-kerala-deep">Admin Users ({admins.length})</h3>
          <div className="space-y-2">
            {admins.map(a => (
              <div key={a.id} className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-semibold text-sm text-kerala-deep">{a.full_name || '—'}</p>
                  <p className="text-xs text-gray-400">{a.email}</p>
                </div>
                <button onClick={() => removeAdmin(a.id)} className="text-xs bg-red-50 text-red-600 px-2.5 py-1.5 rounded-lg hover:bg-red-100 font-medium">Remove</button>
              </div>
            ))}
          </div>
          <div className="flex gap-2 pt-2">
            <input value={newAdminEmail} onChange={e => setNewAdminEmail(e.target.value)}
              placeholder="user@email.com"
              className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30" />
            <button onClick={addAdmin} className="bg-kerala-green text-white font-semibold px-4 py-2.5 rounded-xl text-sm hover:opacity-90">
              Add Admin
            </button>
          </div>
        </div>
      )}

      {/* Announcement */}
      {tab === 'announcement' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h3 className="font-semibold text-kerala-deep">Site-wide Announcement Banner</h3>
          <Toggle on={bannerOn} onChange={setBannerOn} label="Show Announcement Banner" desc="Displays a banner at the top of every page" />
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Banner Text</label>
            <textarea value={bannerText} onChange={e => setBannerText(e.target.value)} rows={3}
              placeholder="e.g. MalayaliBusiness Grand Meet 2026 — Register now! →"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 bg-gray-50 resize-none" />
          </div>
          {bannerOn && bannerText && (
            <div className="bg-kerala-green text-white text-sm text-center py-2.5 px-4 rounded-xl font-medium">{bannerText}</div>
          )}
          <button onClick={save} disabled={saving} className="bg-kerala-green text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:opacity-90">
            {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save Settings'}
          </button>
        </div>
      )}

      {/* Plans */}
      {tab === 'plans' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h3 className="font-semibold text-kerala-deep">Business Plan Pricing (AED/month)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Free',    value: '0',   color: 'bg-gray-100' },
              { label: 'Basic',   value: '49',  color: 'bg-blue-50'  },
              { label: 'Premium', value: '149', color: 'bg-kerala-gold/10' },
              { label: 'Elite',   value: '349', color: 'bg-kerala-green/10' },
            ].map(p => (
              <div key={p.label} className={`p-4 rounded-xl border border-gray-100 ${p.color}`}>
                <label className="block text-xs font-bold text-gray-600 mb-2">{p.label} Plan</label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">AED</span>
                  <input type="number" defaultValue={p.value}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-kerala-green/30 bg-white" />
                  <span className="text-xs text-gray-400">/mo</span>
                </div>
              </div>
            ))}
          </div>
          <button onClick={save} disabled={saving} className="bg-kerala-green text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:opacity-90">
            {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save Pricing'}
          </button>
        </div>
      )}

      {tab === 'security' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5 max-w-md">
          <h3 className="font-semibold text-kerala-deep flex items-center gap-2"><Lock size={18} /> Change Admin Password</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Confirm New Password</label>
              <input
                type="password"
                value={confirmPwd}
                onChange={e => setConfirmPwd(e.target.value)}
                placeholder="Re-enter password"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 bg-gray-50"
              />
            </div>
            {pwdMsg && (
              <div className={`px-4 py-3 rounded-xl text-sm font-medium ${pwdMsg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                {pwdMsg.text}
              </div>
            )}
            <button
              onClick={changePassword}
              disabled={pwdSaving}
              className="w-full bg-kerala-green text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {pwdSaving ? <><Loader2 size={15} className="animate-spin" /> Updating…</> : <><Lock size={15} /> Update Password</>}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Section: Categories ───────────────────────────────────────────────────
function AdminCategoriesSection() {
  const [cats, setCats]       = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding]   = useState(false)
  const [editId, setEditId]   = useState<string|null>(null)
  const [form, setForm]       = useState({ name: '', slug: '', icon: '', description: '', is_active: true })

  async function load() {
    const { data } = await supabase.from('categories').select('*').order('name')
    setCats(data ?? [])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  async function save() {
    if (editId) {
      await supabase.from('categories').update(form).eq('id', editId)
      setCats(prev => prev.map(c => c.id === editId ? { ...c, ...form } : c))
    } else {
      const slug = form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      const { data } = await supabase.from('categories').insert([{ ...form, slug }]).select().single()
      if (data) setCats(prev => [...prev, data])
    }
    setAdding(false); setEditId(null); setForm({ name: '', slug: '', icon: '', description: '', is_active: true })
  }

  async function toggle(id: string, val: boolean) {
    await supabase.from('categories').update({ is_active: val }).eq('id', id)
    setCats(prev => prev.map(c => c.id === id ? { ...c, is_active: val } : c))
  }

  async function del(id: string, name: string) {
    if (!confirm(`Delete category "${name}"?`)) return
    await supabase.from('categories').delete().eq('id', id)
    setCats(prev => prev.filter(c => c.id !== id))
  }

  const editing = adding || !!editId

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-serif font-bold text-2xl text-kerala-deep">Categories</h2>
        <button onClick={() => { setAdding(true); setEditId(null); setForm({ name: '', slug: '', icon: '', description: '', is_active: true }) }}
          className="flex items-center gap-2 bg-kerala-green text-white text-sm font-semibold px-4 py-2 rounded-xl hover:opacity-90">
          + Add Category
        </button>
      </div>

      {editing && (
        <div className="bg-white rounded-2xl border border-kerala-green/30 shadow-sm p-5 space-y-3">
          <h3 className="font-semibold text-kerala-deep">{editId ? 'Edit Category' : 'New Category'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[{ label: 'Name', key: 'name' }, { label: 'Slug', key: 'slug' }, { label: 'Icon (emoji)', key: 'icon' }].map(f => (
              <div key={f.key}>
                <label className="text-xs font-medium text-gray-600 mb-1 block">{f.label}</label>
                <input value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30" />
              </div>
            ))}
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Description</label>
              <input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30" />
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={save} className="bg-kerala-green text-white px-5 py-2 rounded-lg text-sm font-semibold hover:opacity-90">Save</button>
            <button onClick={() => { setAdding(false); setEditId(null) }} className="bg-gray-100 text-gray-700 px-5 py-2 rounded-lg text-sm font-semibold">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-kerala-green" /></div> : (
          <div className="overflow-x-auto"><table className="w-full">
            <thead><tr className="border-b border-gray-100 bg-gray-50">
              {['Icon', 'Name', 'Slug', 'Status', 'Actions'].map(h => <th key={h} className="text-left text-xs font-semibold text-gray-500 px-4 py-3">{h}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {cats.map(c => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-xl">{c.icon || '📁'}</td>
                  <td className="px-4 py-3 font-semibold text-sm text-kerala-deep">{c.name}</td>
                  <td className="px-4 py-3 text-xs text-gray-400 font-mono">{c.slug}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${c.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {c.is_active ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => { setEditId(c.id); setAdding(false); setForm({ name: c.name, slug: c.slug, icon: c.icon ?? '', description: c.description ?? '', is_active: c.is_active }) }}
                        className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg hover:bg-blue-100 font-medium">Edit</button>
                      <button onClick={() => toggle(c.id, !c.is_active)}
                        className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg hover:bg-gray-200 font-medium">{c.is_active ? 'Hide' : 'Show'}</button>
                      <button onClick={() => del(c.id, c.name)}
                        className="text-xs bg-red-50 text-red-600 px-2.5 py-1 rounded-lg hover:bg-red-100 font-medium">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table></div>
        )}
      </div>
    </div>
  )
}

// ── Section: Reviews ──────────────────────────────────────────────────────
function AdminReviewsSection() {
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState<'all'|'pending'|'approved'>('all')

  useEffect(() => {
    supabase.from('reviews').select('id, rating, comment, reviewer_name, status, created_at, listing_id').order('created_at', { ascending: false }).limit(200)
      .then(({ data }) => { setReviews(data ?? []); setLoading(false) })
  }, [])

  async function updateStatus(id: string, status: string) {
    await supabase.from('reviews').update({ status }).eq('id', id)
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status } : r))
  }

  async function del(id: string) {
    if (!confirm('Delete this review?')) return
    await supabase.from('reviews').delete().eq('id', id)
    setReviews(prev => prev.filter(r => r.id !== id))
  }

  const filtered = filter === 'all' ? reviews : reviews.filter(r => r.status === filter)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-serif font-bold text-2xl text-kerala-deep">Reviews & Ratings</h2>
        <button onClick={() => exportCSV(filtered, 'reviews.csv')} className="text-sm font-semibold bg-gray-100 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-200">↓ CSV</button>
      </div>
      <div className="flex gap-2">
        {(['all','pending','approved'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize ${filter === f ? 'bg-kerala-green text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {f} ({f === 'all' ? reviews.length : reviews.filter(r => r.status === f).length})
          </button>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-kerala-green" /></div> :
        filtered.length === 0 ? <div className="p-10 text-center text-gray-400 text-sm">No reviews found.</div> : (
          <div className="divide-y divide-gray-50">
            {filtered.map(r => (
              <div key={r.id} className="p-4 flex gap-4 items-start">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-kerala-deep">{r.reviewer_name || 'Anonymous'}</span>
                    <span className="text-amber-500 text-sm">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-600'}`}>{r.status || 'pending'}</span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{r.comment}</p>
                  <p className="text-xs text-gray-400 mt-1">{fmtDate(r.created_at)}</p>
                </div>
                <div className="flex flex-col gap-1.5 shrink-0">
                  {r.status !== 'approved' && <button onClick={() => updateStatus(r.id, 'approved')} className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-lg hover:bg-green-200 font-medium">Approve</button>}
                  {r.status !== 'rejected' && <button onClick={() => updateStatus(r.id, 'rejected')} className="text-xs bg-amber-50 text-amber-700 px-2.5 py-1 rounded-lg hover:bg-amber-100 font-medium">Reject</button>}
                  <button onClick={() => del(r.id)} className="text-xs bg-red-50 text-red-600 px-2.5 py-1 rounded-lg hover:bg-red-100 font-medium">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Section: Jobs ─────────────────────────────────────────────────────────
function AdminJobsSection() {
  const [rows, setRows]       = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState<'all'|'active'|'pending'|'rejected'>('all')

  useEffect(() => {
    supabase.from('jobs').select('id, title, company_name, emirate, job_type, status, created_at').order('created_at', { ascending: false }).limit(200)
      .then(({ data }) => { setRows(data ?? []); setLoading(false) })
  }, [])

  async function update(id: string, status: string) {
    await supabase.from('jobs').update({ status }).eq('id', id)
    setRows(prev => prev.map(r => r.id === id ? { ...r, status } : r))
  }

  async function del(id: string) {
    if (!confirm('Delete this job?')) return
    await supabase.from('jobs').delete().eq('id', id)
    setRows(prev => prev.filter(r => r.id !== id))
  }

  const filtered = filter === 'all' ? rows : rows.filter(r => r.status === filter)
  const statusColors: Record<string,string> = { active: 'bg-green-100 text-green-700', pending: 'bg-amber-100 text-amber-600', rejected: 'bg-red-100 text-red-600' }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-serif font-bold text-2xl text-kerala-deep">Jobs Management</h2>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">{rows.length} total</span>
          <button onClick={() => exportCSV(filtered, 'jobs.csv')} className="text-sm font-semibold bg-gray-100 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-200">↓ CSV</button>
        </div>
      </div>
      <div className="flex gap-2">
        {(['all','active','pending','rejected'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize ${filter === f ? 'bg-kerala-green text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {f}
          </button>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-kerala-green" /></div> :
        filtered.length === 0 ? <div className="p-10 text-center text-gray-400 text-sm">No jobs found.</div> : (
          <div className="overflow-x-auto"><table className="w-full min-w-[600px]">
            <thead><tr className="border-b border-gray-100 bg-gray-50">
              {['Job Title','Company','Emirate','Type','Status','Date','Actions'].map(h => <th key={h} className="text-left text-xs font-semibold text-gray-500 px-4 py-3">{h}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold text-sm text-kerala-deep">{r.title}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{r.company_name ?? '—'}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{r.emirate ?? '—'}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{r.job_type ?? '—'}</td>
                  <td className="px-4 py-3"><span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[r.status] ?? 'bg-gray-100 text-gray-500'}`}>{capitalize(r.status ?? 'active')}</span></td>
                  <td className="px-4 py-3 text-xs text-gray-400">{fmtDate(r.created_at)}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      {r.status !== 'active'   && <button onClick={() => update(r.id,'active')}   className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-lg hover:bg-green-200 font-medium">Approve</button>}
                      {r.status !== 'rejected' && <button onClick={() => update(r.id,'rejected')} className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded-lg hover:bg-amber-100 font-medium">Reject</button>}
                      <button onClick={() => del(r.id)} className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-lg hover:bg-red-100 font-medium">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table></div>
        )}
      </div>
    </div>
  )
}

// ── Section: Classifieds ──────────────────────────────────────────────────
function AdminClassifiedsSection() {
  const [rows, setRows]       = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState<'all'|'active'|'pending'|'rejected'>('all')

  useEffect(() => {
    supabase.from('classifieds').select('id, title, category, price, emirate, status, created_at').order('created_at', { ascending: false }).limit(200)
      .then(({ data }) => { setRows(data ?? []); setLoading(false) })
  }, [])

  async function update(id: string, status: string) {
    await supabase.from('classifieds').update({ status }).eq('id', id)
    setRows(prev => prev.map(r => r.id === id ? { ...r, status } : r))
  }

  async function del(id: string) {
    if (!confirm('Delete this classified?')) return
    await supabase.from('classifieds').delete().eq('id', id)
    setRows(prev => prev.filter(r => r.id !== id))
  }

  const filtered = filter === 'all' ? rows : rows.filter(r => r.status === filter)
  const statusColors: Record<string,string> = { active: 'bg-green-100 text-green-700', pending: 'bg-amber-100 text-amber-600', rejected: 'bg-red-100 text-red-600' }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-serif font-bold text-2xl text-kerala-deep">Classifieds Management</h2>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">{rows.length} total</span>
          <button onClick={() => exportCSV(filtered, 'classifieds.csv')} className="text-sm font-semibold bg-gray-100 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-200">↓ CSV</button>
        </div>
      </div>
      <div className="flex gap-2">
        {(['all','active','pending','rejected'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize ${filter === f ? 'bg-kerala-green text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {f}
          </button>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-kerala-green" /></div> :
        filtered.length === 0 ? <div className="p-10 text-center text-gray-400 text-sm">No classifieds found.</div> : (
          <div className="overflow-x-auto"><table className="w-full min-w-[600px]">
            <thead><tr className="border-b border-gray-100 bg-gray-50">
              {['Title','Category','Price','Emirate','Status','Date','Actions'].map(h => <th key={h} className="text-left text-xs font-semibold text-gray-500 px-4 py-3">{h}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold text-sm text-kerala-deep max-w-[180px] truncate">{r.title}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{r.category ?? '—'}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{r.price ? `AED ${r.price}` : '—'}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{r.emirate ?? '—'}</td>
                  <td className="px-4 py-3"><span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[r.status] ?? 'bg-gray-100 text-gray-500'}`}>{capitalize(r.status ?? 'active')}</span></td>
                  <td className="px-4 py-3 text-xs text-gray-400">{fmtDate(r.created_at)}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      {r.status !== 'active'   && <button onClick={() => update(r.id,'active')}   className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-lg hover:bg-green-200 font-medium">Approve</button>}
                      {r.status !== 'rejected' && <button onClick={() => update(r.id,'rejected')} className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded-lg hover:bg-amber-100 font-medium">Reject</button>}
                      <button onClick={() => del(r.id)} className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-lg hover:bg-red-100 font-medium">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table></div>
        )}
      </div>
    </div>
  )
}

// ── Section: Events ───────────────────────────────────────────────────────
function AdminEventsSection() {
  const [rows, setRows]       = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('events').select('id, title, category, emirate, event_date, status, created_at').order('created_at', { ascending: false }).limit(200)
      .then(({ data }) => { setRows(data ?? []); setLoading(false) })
  }, [])

  async function update(id: string, status: string) {
    await supabase.from('events').update({ status }).eq('id', id)
    setRows(prev => prev.map(r => r.id === id ? { ...r, status } : r))
  }

  async function del(id: string) {
    if (!confirm('Delete this event?')) return
    await supabase.from('events').delete().eq('id', id)
    setRows(prev => prev.filter(r => r.id !== id))
  }

  const statusColors: Record<string,string> = { active: 'bg-green-100 text-green-700', pending: 'bg-amber-100 text-amber-600', rejected: 'bg-red-100 text-red-600' }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-serif font-bold text-2xl text-kerala-deep">Events Management</h2>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">{rows.length} total</span>
          <button onClick={() => exportCSV(rows, 'events.csv')} className="text-sm font-semibold bg-gray-100 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-200">↓ CSV</button>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-kerala-green" /></div> :
        rows.length === 0 ? <div className="p-10 text-center text-gray-400 text-sm">No events found.</div> : (
          <div className="overflow-x-auto"><table className="w-full min-w-[600px]">
            <thead><tr className="border-b border-gray-100 bg-gray-50">
              {['Title','Category','Emirate','Event Date','Status','Actions'].map(h => <th key={h} className="text-left text-xs font-semibold text-gray-500 px-4 py-3">{h}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {rows.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold text-sm text-kerala-deep max-w-[200px] truncate">{r.title}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{r.category ?? '—'}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{r.emirate ?? '—'}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{r.event_date ? new Date(r.event_date).toLocaleDateString('en-GB') : '—'}</td>
                  <td className="px-4 py-3"><span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[r.status] ?? 'bg-gray-100 text-gray-500'}`}>{capitalize(r.status ?? 'active')}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      {r.status !== 'active'   && <button onClick={() => update(r.id,'active')}   className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-lg hover:bg-green-200 font-medium">Approve</button>}
                      {r.status !== 'rejected' && <button onClick={() => update(r.id,'rejected')} className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded-lg hover:bg-amber-100 font-medium">Reject</button>}
                      <button onClick={() => del(r.id)} className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-lg hover:bg-red-100 font-medium">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table></div>
        )}
      </div>
    </div>
  )
}

// ── Generic Table Section ─────────────────────────────────────────────────
function GenericSection({ title, table, columns, statusCol, whereCol, whereVal }: {
  title: string
  table: string
  columns: string[]
  statusCol?: string
  whereCol?: string
  whereVal?: unknown
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'active' | 'rejected'>('all')

  useEffect(() => {
    async function load() {
      setLoading(true)
      let q = supabase.from(table).select('*').order('created_at', { ascending: false }).limit(200)
      if (whereCol !== undefined) q = q.eq(whereCol, whereVal)
      if (statusCol && filter !== 'all') q = q.eq(statusCol, filter)
      const { data, error } = await q
      if (error) console.error('[GenericSection]', table, error.message)
      setRows(data ?? [])
      setLoading(false)
    }
    load()
  }, [table, statusCol, filter, whereCol, whereVal])

  async function updateStatus(id: string, status: string) {
    if (!statusCol) return
    await supabase.from(table).update({ [statusCol]: status }).eq('id', id)
    setRows(prev => prev.map(r => r.id === id ? { ...r, [statusCol]: status } : r))
  }

  const statusColors: Record<string, string> = {
    active:   'bg-green-100 text-green-700',
    pending:  'bg-amber-100 text-amber-600',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-600',
    suspended:'bg-red-100 text-red-600',
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-serif font-bold text-2xl text-kerala-deep">{title} <span className="text-sm font-normal text-gray-400 ml-1">({rows.length})</span></h2>
        <button onClick={() => exportCSV(rows, `${title.toLowerCase().replace(/\s+/g,'-')}.csv`)} className="text-sm font-semibold bg-gray-100 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-200">↓ CSV</button>
      </div>

      {statusCol && (
        <div className="flex gap-2">
          {(['all', 'pending', 'active', 'rejected'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${filter === f ? 'bg-kerala-green text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {f}
            </button>
          ))}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16"><Loader2 size={24} className="animate-spin text-kerala-green" /></div>
        ) : rows.length === 0 ? (
          <div className="p-10 text-center text-gray-400 text-sm">No records found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {columns.map(c => <th key={c} className="text-left text-xs font-semibold text-gray-500 px-4 py-3 capitalize">{c.replace(/_/g, ' ')}</th>)}
                  {statusCol && <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    {columns.map(c => (
                      <td key={c} className="px-4 py-3 text-sm text-gray-700 max-w-[200px] truncate">
                        {c === statusCol ? (
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[row[c]] ?? 'bg-gray-100 text-gray-500'}`}>
                            {row[c] ?? '—'}
                          </span>
                        ) : c === 'created_at' ? (
                          new Date(row[c]).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                        ) : (
                          String(row[c] ?? '—').slice(0, 60)
                        )}
                      </td>
                    ))}
                    {statusCol && (
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1.5">
                          {row[statusCol] !== 'active' && row[statusCol] !== 'approved' && (
                            <button onClick={() => updateStatus(row.id, 'active')}
                              className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-lg hover:bg-green-200 transition-colors font-medium">
                              Approve
                            </button>
                          )}
                          {row[statusCol] !== 'rejected' && row[statusCol] !== 'suspended' && (
                            <button onClick={() => updateStatus(row.id, 'rejected')}
                              className="text-xs bg-red-50 text-red-600 px-2.5 py-1 rounded-lg hover:bg-red-100 transition-colors font-medium">
                              Reject
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Business Meet Registrations ───────────────────────────────────────────
function BusinessMeetSection() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('business_meet_registrations').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { setRows(data ?? []); setLoading(false) })
  }, [])

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-serif font-bold text-2xl text-kerala-deep">Business Meet Registrations</h2>
        <span className="bg-kerala-gold/20 text-kerala-gold text-sm font-bold px-3 py-1 rounded-full">{rows.length} registered</span>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16"><Loader2 size={24} className="animate-spin text-kerala-green" /></div>
        ) : rows.length === 0 ? (
          <div className="p-10 text-center text-gray-400 text-sm">No registrations yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {['Name', 'Email', 'Phone', 'Company', 'Pass Type', 'Registered'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-500 px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rows.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-kerala-deep">{r.full_name ?? r.name ?? '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{r.email ?? '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{r.phone ?? '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{r.company ?? r.business_name ?? '—'}</td>
                    <td className="px-4 py-3"><span className="bg-kerala-gold/20 text-kerala-gold text-xs font-bold px-2.5 py-1 rounded-full">{r.pass_type ?? 'Gold'}</span></td>
                    <td className="px-4 py-3 text-xs text-gray-400">{new Date(r.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Section: Approvals ────────────────────────────────────────────────────
function AdminApprovalsSection() {
  const [tab, setTab]       = useState<'pending'|'reported'|'license'>('pending')
  const [rows, setRows]     = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<any|null>(null)

  async function load(t: typeof tab) {
    setLoading(true)
    let q = supabase.from('listings')
      .select('id, name, slug, emirate, area, phone, email, status, is_verified, is_featured, plan, owner_id, created_at, description, address, website')
      .order('created_at', { ascending: false }).limit(200)
    if (t === 'pending')  q = q.eq('status', 'pending')
    if (t === 'reported') q = q.eq('status', 'reported')
    if (t === 'license')  q = q.eq('is_verified', false).eq('status', 'active')
    const { data, error } = await q
    if (error) console.error('[Approvals]', error.message)
    setRows(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load(tab) }, [tab])

  async function approve(id: string) {
    await supabase.from('listings').update({ status: 'active' }).eq('id', id)
    setRows(prev => prev.filter(r => r.id !== id))
  }

  async function reject(id: string) {
    const reason = prompt('Rejection reason (optional):')
    await supabase.from('listings').update({ status: 'rejected' }).eq('id', id)
    setRows(prev => prev.filter(r => r.id !== id))
    console.log('Rejected', id, reason)
  }

  async function approveAll() {
    if (!confirm(`Approve all ${rows.length} pending listings?`)) return
    await supabase.from('listings').update({ status: 'active' }).in('id', rows.map(r => r.id))
    setRows([])
  }

  const tabs = [
    { key: 'pending',  label: 'Pending Approval', color: 'text-amber-600' },
    { key: 'reported', label: 'Reported',          color: 'text-red-600'   },
    { key: 'license',  label: 'License Pending',   color: 'text-blue-600'  },
  ] as const

  return (
    <div className="space-y-5">
      {selected && (
        <ListingDrawer listing={selected} onClose={() => setSelected(null)}
          onUpdate={u => { setRows(prev => prev.map(r => r.id === u.id ? u : r).filter(r => !r._deleted)); setSelected(null) }} />
      )}

      <div className="flex items-center justify-between">
        <h2 className="font-serif font-bold text-2xl text-kerala-deep">Approvals & Verification</h2>
        {tab === 'pending' && rows.length > 0 && (
          <button onClick={approveAll} className="bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-green-700">
            ✓ Approve All ({rows.length})
          </button>
        )}
      </div>

      <div className="flex gap-2">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${tab === t.key ? 'bg-kerala-deep text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {t.label}
            {tab === t.key && rows.length > 0 && <span className="ml-2 bg-white/20 px-1.5 py-0.5 rounded-full text-xs">{rows.length}</span>}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? <div className="flex justify-center py-16"><Loader2 size={24} className="animate-spin text-kerala-green" /></div> :
        rows.length === 0 ? (
          <div className="p-12 text-center">
            <CheckCircle size={40} className="text-green-400 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">All clear — nothing to review</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {rows.map(r => (
              <div key={r.id} className="p-4 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-kerala-green/10 flex items-center justify-center font-bold text-kerala-green shrink-0 text-sm">
                  {r.name?.[0]?.toUpperCase() ?? '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-kerala-deep">{r.name}</p>
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{r.emirate}</span>
                    <span className="text-xs bg-kerala-gold/15 text-kerala-gold px-2 py-0.5 rounded-full font-medium uppercase">{r.plan}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{r.description || r.address || '—'}</p>
                  <div className="flex gap-3 mt-1 text-xs text-gray-400">
                    {r.phone && <span>📞 {r.phone}</span>}
                    {r.email && <span>✉️ {r.email}</span>}
                    <span>🕒 {fmtDate(r.created_at)}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  {tab === 'pending' && (
                    <>
                      <button onClick={() => approve(r.id)} className="flex items-center gap-1.5 text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-200 font-semibold">
                        <CheckCircle size={13} /> Approve
                      </button>
                      <button onClick={() => reject(r.id)} className="flex items-center gap-1.5 text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100 font-semibold">
                        <XCircle size={13} /> Reject
                      </button>
                    </>
                  )}
                  {tab === 'license' && (
                    <button onClick={() => supabase.from('listings').update({ is_verified: true }).eq('id', r.id).then(() => setRows(prev => prev.filter(x => x.id !== r.id)))}
                      className="text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-200 font-semibold">
                      Mark Verified
                    </button>
                  )}
                  {tab === 'reported' && (
                    <>
                      <button onClick={() => supabase.from('listings').update({ status: 'active' }).eq('id', r.id).then(() => setRows(prev => prev.filter(x => x.id !== r.id)))}
                        className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-200 font-semibold">
                        Clear Report
                      </button>
                      <button onClick={() => reject(r.id)} className="text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100 font-semibold">
                        Remove
                      </button>
                    </>
                  )}
                  <button onClick={() => setSelected(r)} className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-200 font-semibold">
                    <Eye size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Section: Claims ────────────────────────────────────────────────────────
function AdminClaimsSection() {
  const [rows, setRows]       = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState<'pending'|'approved'|'rejected'>('pending')

  useEffect(() => {
    supabase.from('listing_claims')
      .select('id, status, message, created_at, user_id, listing_id, profiles(full_name, email, phone), listings(name, emirate)')
      .eq('status', filter).order('created_at', { ascending: false }).limit(100)
      .then(({ data, error }) => {
        if (error) console.error('[Claims]', error.message)
        setRows(data ?? [])
        setLoading(false)
      })
  }, [filter])

  async function decide(id: string, status: 'approved'|'rejected', listingId?: string, userId?: string) {
    await supabase.from('listing_claims').update({ status }).eq('id', id)
    if (status === 'approved' && listingId && userId) {
      await supabase.from('listings').update({ owner_id: userId, status: 'active' }).eq('id', listingId)
    }
    setRows(prev => prev.filter(r => r.id !== id))
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-serif font-bold text-2xl text-kerala-deep">Business Claim Requests</h2>
        <button onClick={() => {/* export */}} className="text-sm font-semibold bg-gray-100 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-200">↓ CSV</button>
      </div>

      <div className="flex gap-2">
        {(['pending','approved','rejected'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${filter === f ? 'bg-kerala-deep text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-kerala-green" /></div> :
        rows.length === 0 ? <div className="p-10 text-center text-gray-400 text-sm">No {filter} claims.</div> : (
          <div className="divide-y divide-gray-50">
            {rows.map((r: any) => (
              <div key={r.id} className="p-5 flex items-start gap-4">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-kerala-deep">{(r.listings as any)?.name ?? 'Unknown Listing'}</p>
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{(r.listings as any)?.emirate}</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Claimed by: <span className="font-semibold">{(r.profiles as any)?.full_name ?? '—'}</span>
                    {' · '}{(r.profiles as any)?.email}
                    {(r.profiles as any)?.phone && <> · {(r.profiles as any)?.phone}</>}
                  </p>
                  {r.message && <p className="text-xs text-gray-500 italic">"{r.message}"</p>}
                  <p className="text-xs text-gray-400">{fmtDate(r.created_at)}</p>
                </div>
                {filter === 'pending' && (
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => decide(r.id, 'approved', r.listing_id, r.user_id)}
                      className="flex items-center gap-1.5 text-xs bg-green-100 text-green-700 px-3 py-2 rounded-lg hover:bg-green-200 font-semibold">
                      <CheckCircle size={13} /> Approve
                    </button>
                    <button onClick={() => decide(r.id, 'rejected')}
                      className="flex items-center gap-1.5 text-xs bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100 font-semibold">
                      <XCircle size={13} /> Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <p className="font-semibold mb-1">⚠️ Setup required</p>
        <p className="text-xs">Create the <code className="bg-amber-100 px-1 rounded">listing_claims</code> table in Supabase to enable claims. Run the SQL from Settings → Setup.</p>
      </div>
    </div>
  )
}

// ── Section: Locations ─────────────────────────────────────────────────────
function AdminLocationsSection() {
  const [emirate,    setEmirate]    = useState('')
  const [city,       setCity]       = useState('')
  const [area,       setArea]       = useState('')
  const [selEmirate, setSelEmirate] = useState('')
  const [selCity,    setSelCity]    = useState('')
  const [locations,  setLocations]  = useState<any[]>([])
  const [loading,    setLoading]    = useState(true)
  const [saving,     setSaving]     = useState(false)

  useEffect(() => {
    supabase.from('locations').select('*').order('emirate').order('city').order('area')
      .then(({ data, error }) => {
        if (error) console.error('[Locations]', error.message)
        setLocations(data ?? [])
        setLoading(false)
      })
  }, [])

  async function addLocation(type: 'emirate'|'city'|'area') {
    const value = type === 'emirate' ? emirate : type === 'city' ? city : area
    if (!value.trim()) return
    setSaving(true)
    const record: any = { emirate: type === 'emirate' ? value.trim() : selEmirate, type }
    if (type === 'city')  record.city = value.trim()
    if (type === 'area')  { record.city = selCity; record.area = value.trim() }
    const { data } = await supabase.from('locations').insert([record]).select().single()
    if (data) setLocations(prev => [...prev, data])
    if (type === 'emirate') setEmirate('')
    if (type === 'city')    setCity('')
    if (type === 'area')    setArea('')
    setSaving(false)
  }

  async function del(id: string) {
    await supabase.from('locations').delete().eq('id', id)
    setLocations(prev => prev.filter(l => l.id !== id))
  }

  const emirates = Array.from(new Set(locations.filter(l => l.type === 'emirate').map(l => l.emirate)))
  const cities   = locations.filter(l => l.type === 'city' && l.emirate === selEmirate)
  const areas    = locations.filter(l => l.type === 'area' && l.emirate === selEmirate && l.city === selCity)

  const inputCls = "flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30"
  const addBtnCls = "bg-kerala-green text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-50 flex items-center gap-1.5"

  return (
    <div className="space-y-5">
      <h2 className="font-serif font-bold text-2xl text-kerala-deep">Location Management</h2>
      <p className="text-sm text-gray-500">Manage UAE emirate → city → area hierarchy for better SEO and filtering.</p>

      {loading ? <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-kerala-green" /></div> : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* Emirates */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
            <h3 className="font-bold text-kerala-deep flex items-center gap-2"><MapPin size={16} className="text-kerala-green" /> Emirates</h3>
            <div className="flex gap-2">
              <input value={emirate} onChange={e => setEmirate(e.target.value)} placeholder="e.g. Dubai"
                onKeyDown={e => e.key === 'Enter' && addLocation('emirate')} className={inputCls} />
              <button onClick={() => addLocation('emirate')} disabled={saving} className={addBtnCls}><Plus size={14} /></button>
            </div>
            <div className="space-y-1.5 max-h-64 overflow-y-auto">
              {emirates.map(em => (
                <div key={em} onClick={() => { setSelEmirate(em); setSelCity('') }}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${selEmirate === em ? 'bg-kerala-green text-white' : 'bg-gray-50 hover:bg-gray-100'}`}>
                  <span className="text-sm font-medium">{em}</span>
                  <button onClick={e => { e.stopPropagation(); const loc = locations.find(l => l.emirate === em && l.type === 'emirate'); if (loc) del(loc.id) }}
                    className="opacity-60 hover:opacity-100"><Trash2 size={13} /></button>
                </div>
              ))}
              {emirates.length === 0 && <p className="text-xs text-gray-400 text-center py-2">No emirates added</p>}
            </div>
          </div>

          {/* Cities */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
            <h3 className="font-bold text-kerala-deep">Cities {selEmirate && <span className="text-kerala-green text-sm font-normal">in {selEmirate}</span>}</h3>
            {!selEmirate ? <p className="text-xs text-gray-400">Select an emirate first</p> : (
              <>
                <div className="flex gap-2">
                  <input value={city} onChange={e => setCity(e.target.value)} placeholder="e.g. Deira"
                    onKeyDown={e => e.key === 'Enter' && addLocation('city')} className={inputCls} />
                  <button onClick={() => addLocation('city')} disabled={saving} className={addBtnCls}><Plus size={14} /></button>
                </div>
                <div className="space-y-1.5 max-h-64 overflow-y-auto">
                  {cities.map(c => (
                    <div key={c.id} onClick={() => setSelCity(c.city)}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${selCity === c.city ? 'bg-kerala-green text-white' : 'bg-gray-50 hover:bg-gray-100'}`}>
                      <span className="text-sm font-medium">{c.city}</span>
                      <button onClick={e => { e.stopPropagation(); del(c.id) }} className="opacity-60 hover:opacity-100"><Trash2 size={13} /></button>
                    </div>
                  ))}
                  {cities.length === 0 && <p className="text-xs text-gray-400 text-center py-2">No cities added</p>}
                </div>
              </>
            )}
          </div>

          {/* Areas */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
            <h3 className="font-bold text-kerala-deep">Areas {selCity && <span className="text-kerala-green text-sm font-normal">in {selCity}</span>}</h3>
            {!selCity ? <p className="text-xs text-gray-400">Select a city first</p> : (
              <>
                <div className="flex gap-2">
                  <input value={area} onChange={e => setArea(e.target.value)} placeholder="e.g. Naif"
                    onKeyDown={e => e.key === 'Enter' && addLocation('area')} className={inputCls} />
                  <button onClick={() => addLocation('area')} disabled={saving} className={addBtnCls}><Plus size={14} /></button>
                </div>
                <div className="space-y-1.5 max-h-64 overflow-y-auto">
                  {areas.map(a => (
                    <div key={a.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50">
                      <span className="text-sm">{a.area}</span>
                      <button onClick={() => del(a.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={13} /></button>
                    </div>
                  ))}
                  {areas.length === 0 && <p className="text-xs text-gray-400 text-center py-2">No areas added</p>}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800">
        <p className="font-semibold mb-1">Setup required</p>
        <p className="text-xs">Run this SQL to create the locations table:
          <code className="block bg-blue-100 rounded p-2 mt-1 font-mono text-xs whitespace-pre">CREATE TABLE IF NOT EXISTS locations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  type text NOT NULL, -- emirate | city | area
  emirate text NOT NULL,
  city text,
  area text,
  created_at timestamptz DEFAULT now()
);
CREATE POLICY "Auth read locations" ON locations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth write locations" ON locations FOR ALL TO authenticated USING (true);</code>
        </p>
      </div>
    </div>
  )
}

// ── Section: Packages ──────────────────────────────────────────────────────
const DEFAULT_PACKAGES = [
  { name: 'Free',      price: 0,   duration: 0,  color: '#6b7280', features: ['1 listing','Basic info','Phone number'], listing_limit: 1,  is_featured: false, is_active: true },
  { name: 'Basic',     price: 49,  duration: 30, color: '#3b82f6', features: ['3 listings','Logo','Gallery','WhatsApp','Map'], listing_limit: 3, is_featured: false, is_active: true },
  { name: 'Premium',   price: 149, duration: 30, color: '#f59e0b', features: ['10 listings','Featured badge','Top placement','Leads form','Social links'], listing_limit: 10, is_featured: true, is_active: true },
  { name: 'Elite',     price: 349, duration: 30, color: '#10b981', features: ['Unlimited','Homepage banner','Priority support','Analytics','All features'], listing_limit: 999, is_featured: true, is_active: true },
]

function AdminPackagesSection() {
  const [pkgs,    setPkgs]    = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<any|null>(null)
  const [form,    setForm]    = useState<any>({})
  const [featStr, setFeatStr] = useState('')

  useEffect(() => {
    supabase.from('packages').select('*').order('price')
      .then(({ data, error }) => {
        if (error || !data?.length) {
          setPkgs(DEFAULT_PACKAGES.map((p, i) => ({ ...p, id: `default-${i}` })))
        } else {
          setPkgs(data)
        }
        setLoading(false)
      })
  }, [])

  function openEdit(pkg: any) {
    setEditing(pkg)
    setForm({ ...pkg })
    setFeatStr(Array.isArray(pkg.features) ? pkg.features.join('\n') : '')
  }

  async function save() {
    const payload = { ...form, features: featStr.split('\n').map((s: string) => s.trim()).filter(Boolean) }
    if (editing.id?.startsWith('default-')) {
      const { data } = await supabase.from('packages').insert([payload]).select().single()
      if (data) setPkgs(prev => prev.map(p => p.id === editing.id ? data : p))
    } else {
      await supabase.from('packages').update(payload).eq('id', editing.id)
      setPkgs(prev => prev.map(p => p.id === editing.id ? { ...p, ...payload } : p))
    }
    setEditing(null)
  }

  async function toggleActive(id: string, val: boolean) {
    await supabase.from('packages').update({ is_active: val }).eq('id', id)
    setPkgs(prev => prev.map(p => p.id === id ? { ...p, is_active: val } : p))
  }

  const planColors: Record<string,string> = { Free: 'bg-gray-100 border-gray-200', Basic: 'bg-blue-50 border-blue-100', Premium: 'bg-amber-50 border-amber-100', Elite: 'bg-green-50 border-green-100' }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-serif font-bold text-2xl text-kerala-deep">Packages & Plans</h2>
        <button onClick={() => { setEditing({ id: `new-${Date.now()}` }); setForm({ name: '', price: 0, duration: 30, listing_limit: 1, is_featured: false, is_active: true }); setFeatStr('') }}
          className="flex items-center gap-2 bg-kerala-green text-white text-sm font-semibold px-4 py-2 rounded-xl hover:opacity-90">
          <Plus size={15} /> Add Plan
        </button>
      </div>

      {editing && (
        <div className="bg-white rounded-2xl border border-kerala-green/30 shadow-sm p-6 space-y-4">
          <h3 className="font-semibold text-kerala-deep">{editing.id?.startsWith('default-') || editing.id?.startsWith('new-') ? 'New Package' : `Edit: ${editing.name}`}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { label: 'Plan Name',      key: 'name',          type: 'text'   },
              { label: 'Price (AED/mo)', key: 'price',         type: 'number' },
              { label: 'Duration (days)',key: 'duration',      type: 'number' },
              { label: 'Listing Limit',  key: 'listing_limit', type: 'number' },
              { label: 'Color (hex)',    key: 'color',         type: 'text'   },
            ].map(f => (
              <div key={f.key}>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">{f.label}</label>
                <input type={f.type} value={form[f.key] ?? ''} onChange={e => setForm((p: any) => ({ ...p, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30" />
              </div>
            ))}
            <div className="flex items-center gap-3 pt-5">
              <label className="text-xs font-semibold text-gray-600">Featured placement</label>
              <input type="checkbox" checked={form.is_featured ?? false} onChange={e => setForm((p: any) => ({ ...p, is_featured: e.target.checked }))} className="w-4 h-4 accent-kerala-green" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Features (one per line)</label>
            <textarea value={featStr} onChange={e => setFeatStr(e.target.value)} rows={5}
              placeholder="3 listings&#10;Logo upload&#10;WhatsApp button&#10;Google Maps"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 resize-none" />
          </div>
          <div className="flex gap-2">
            <button onClick={save} className="bg-kerala-green text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90">Save Package</button>
            <button onClick={() => setEditing(null)} className="bg-gray-100 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-semibold">Cancel</button>
          </div>
        </div>
      )}

      {loading ? <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-kerala-green" /></div> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pkgs.map(pkg => (
            <div key={pkg.id} className={`rounded-2xl border-2 p-5 space-y-4 ${planColors[pkg.name] ?? 'bg-white border-gray-100'} ${!pkg.is_active ? 'opacity-50' : ''}`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-bold text-kerala-deep text-lg">{pkg.name}</p>
                  <p className="text-2xl font-serif font-bold text-kerala-deep mt-1">
                    {pkg.price === 0 ? 'Free' : `AED ${pkg.price}`}
                    {pkg.price > 0 && <span className="text-sm font-normal text-gray-400">/mo</span>}
                  </p>
                </div>
                {pkg.is_featured && <span className="text-xs bg-kerala-gold/20 text-kerala-gold px-2 py-0.5 rounded-full font-bold">⭐ Featured</span>}
              </div>
              <ul className="space-y-1.5">
                {(pkg.features ?? []).map((f: string, i: number) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-gray-600">
                    <CheckCircle size={12} className="text-green-500 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <div className="flex gap-2 pt-1">
                <button onClick={() => openEdit(pkg)} className="flex-1 text-xs bg-white border border-gray-200 text-gray-700 py-1.5 rounded-lg hover:bg-gray-50 font-medium flex items-center justify-center gap-1">
                  <Edit3 size={12} /> Edit
                </button>
                <button onClick={() => toggleActive(pkg.id, !pkg.is_active)}
                  className={`flex-1 text-xs py-1.5 rounded-lg font-medium ${pkg.is_active ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}>
                  {pkg.is_active ? 'Disable' : 'Enable'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800">
        <p className="font-semibold mb-1">Setup required</p>
        <p className="text-xs">Run this SQL to create the packages table:
          <code className="block bg-blue-100 rounded p-2 mt-1 font-mono text-xs whitespace-pre">CREATE TABLE IF NOT EXISTS packages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  price numeric DEFAULT 0,
  duration integer DEFAULT 30,
  listing_limit integer DEFAULT 1,
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  color text,
  features jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);
CREATE POLICY "Auth read packages" ON packages FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth write packages" ON packages FOR ALL TO authenticated USING (true);</code>
        </p>
      </div>
    </div>
  )
}

// ── Section: Leads ────────────────────────────────────────────────────────
function AdminLeadsSection() {
  const [rows,    setRows]    = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter,  setFilter]  = useState<'all'|'whatsapp'|'call'|'website'|'enquiry'|'direction'>('all')
  const [search,  setSearch]  = useState('')

  useEffect(() => {
    supabase.from('leads')
      .select('id, type, created_at, listing_id, user_id, metadata, listings(name, emirate, category_id)')
      .order('created_at', { ascending: false }).limit(500)
      .then(({ data, error }) => {
        if (error) console.error('[Leads]', error.message)
        setRows(data ?? [])
        setLoading(false)
      })
  }, [])

  const filtered = rows
    .filter(r => filter === 'all' || r.type === filter)
    .filter(r => !search || (r.listings as any)?.name?.toLowerCase().includes(search.toLowerCase()))

  // Aggregate per listing
  const byListing = filtered.reduce((acc: any, r) => {
    const name = (r.listings as any)?.name ?? r.listing_id ?? 'Unknown'
    const emirate = (r.listings as any)?.emirate ?? ''
    if (!acc[name]) acc[name] = { name, emirate, total: 0, whatsapp: 0, call: 0, website: 0, enquiry: 0, direction: 0 }
    acc[name].total++
    acc[name][r.type as string] = (acc[name][r.type as string] ?? 0) + 1
    return acc
  }, {} as Record<string, any>)

  const leaderboard = Object.values(byListing).sort((a: any, b: any) => b.total - a.total).slice(0, 50)

  const typeIcon: Record<string, string> = { whatsapp: '💬', call: '📞', website: '🌐', enquiry: '📝', direction: '📍' }
  const typeColor: Record<string, string> = { whatsapp: 'bg-green-100 text-green-700', call: 'bg-blue-100 text-blue-600', website: 'bg-purple-100 text-purple-600', enquiry: 'bg-amber-100 text-amber-600', direction: 'bg-red-100 text-red-500' }

  const totals = { whatsapp: rows.filter(r => r.type === 'whatsapp').length, call: rows.filter(r => r.type === 'call').length, website: rows.filter(r => r.type === 'website').length, enquiry: rows.filter(r => r.type === 'enquiry').length, direction: rows.filter(r => r.type === 'direction').length }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-serif font-bold text-2xl text-kerala-deep">Leads & Enquiries</h2>
        <button onClick={() => exportCSV(filtered, 'leads.csv')} className="text-sm font-semibold bg-gray-100 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-200">↓ CSV</button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {(['whatsapp','call','website','enquiry','direction'] as const).map(t => (
          <div key={t} className={`rounded-2xl p-4 cursor-pointer border-2 transition-all ${filter === t ? 'border-kerala-green' : 'border-transparent'} ${typeColor[t].replace('text-','').replace('bg-','bg-').split(' ')[0]}`}
            onClick={() => setFilter(filter === t ? 'all' : t)}>
            <p className="text-2xl mb-1">{typeIcon[t]}</p>
            <p className={`text-xl font-bold font-serif ${typeColor[t].split(' ')[1]}`}>{totals[t]}</p>
            <p className="text-xs text-gray-500 capitalize">{t}</p>
          </div>
        ))}
      </div>

      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Filter by business name..."
        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30" />

      {/* Leaderboard */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Top Businesses by Leads</p>
        </div>
        {loading ? <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-kerala-green" /></div> :
        leaderboard.length === 0 ? <div className="p-10 text-center text-gray-400 text-sm">No leads recorded yet.</div> : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px]">
              <thead><tr className="border-b border-gray-100">
                {['#','Business','Emirate','Total','💬','📞','🌐','📝','📍'].map(h =>
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 px-4 py-3">{h}</th>)}
              </tr></thead>
              <tbody className="divide-y divide-gray-50">
                {leaderboard.map((b: any, i: number) => (
                  <tr key={b.name} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-bold text-gray-400">#{i + 1}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-kerala-deep max-w-[180px] truncate">{b.name}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{b.emirate}</td>
                    <td className="px-4 py-3 text-sm font-bold text-kerala-deep">{b.total}</td>
                    <td className="px-4 py-3 text-xs text-green-600 font-semibold">{b.whatsapp || '—'}</td>
                    <td className="px-4 py-3 text-xs text-blue-600 font-semibold">{b.call || '—'}</td>
                    <td className="px-4 py-3 text-xs text-purple-600 font-semibold">{b.website || '—'}</td>
                    <td className="px-4 py-3 text-xs text-amber-600 font-semibold">{b.enquiry || '—'}</td>
                    <td className="px-4 py-3 text-xs text-red-500 font-semibold">{b.direction || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-blue-800">
        <p className="font-semibold mb-1">Setup required</p>
        <code className="block bg-blue-100 rounded p-2 mt-1 font-mono whitespace-pre">{`CREATE TABLE IF NOT EXISTS leads (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id uuid REFERENCES listings(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  type text NOT NULL, -- whatsapp | call | website | enquiry | direction
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth read leads" ON leads FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone insert leads" ON leads FOR INSERT TO anon, authenticated WITH CHECK (true);`}</code>
      </div>
    </div>
  )
}

// ── Section: Bulk Upload ───────────────────────────────────────────────────
function AdminBulkUploadSection() {
  const [step,      setStep]      = useState<'upload'|'preview'|'importing'|'done'>('upload')
  const [preview,   setPreview]   = useState<any[]>([])
  const [errors,    setErrors]    = useState<string[]>([])
  const [imported,  setImported]  = useState(0)
  const [history,   setHistory]   = useState<any[]>([])
  const [dragOver,  setDragOver]  = useState(false)

  useEffect(() => {
    supabase.from('bulk_imports').select('*').order('created_at', { ascending: false }).limit(20)
      .then(({ data }) => setHistory(data ?? []))
  }, [])

  const REQUIRED = ['name', 'emirate', 'phone']
  const TEMPLATE_HEADERS = ['name','emirate','area','phone','whatsapp','email','website','address','description','category_id','plan','status']

  function downloadTemplate() {
    const csv = TEMPLATE_HEADERS.join(',') + '\n' + 'Example Business,Dubai,Deira,+971501234567,+971501234567,info@example.com,https://example.com,Shop 1 Deira,Description here,,free,pending'
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'listings-template.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  function parseCSV(text: string): any[] {
    const lines = text.trim().split('\n')
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
    return lines.slice(1).map((line, i) => {
      const vals = line.split(',').map(v => v.trim().replace(/"/g, ''))
      const row: any = { _row: i + 2 }
      headers.forEach((h, j) => { row[h] = vals[j] ?? '' })
      return row
    })
  }

  function validateRows(rows: any[]): string[] {
    const errs: string[] = []
    rows.forEach(r => {
      REQUIRED.forEach(f => { if (!r[f]) errs.push(`Row ${r._row}: missing "${f}"`) })
    })
    return errs
  }

  function handleFile(file: File) {
    const reader = new FileReader()
    reader.onload = e => {
      const text = e.target?.result as string
      const rows = parseCSV(text)
      const errs = validateRows(rows)
      setPreview(rows.slice(0, 20))
      setErrors(errs)
      setStep('preview')
    }
    reader.readAsText(file)
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault(); setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file?.name.endsWith('.csv')) handleFile(file)
  }

  async function importAll() {
    if (errors.length > 0) { alert('Fix errors before importing'); return }
    setStep('importing')
    let count = 0
    const batchSize = 50
    for (let i = 0; i < preview.length; i += batchSize) {
      const batch = preview.slice(i, i + batchSize).map(r => ({
        name:        r.name,
        emirate:     r.emirate,
        area:        r.area || null,
        phone:       r.phone,
        whatsapp:    r.whatsapp || null,
        email:       r.email || null,
        website:     r.website || null,
        address:     r.address || null,
        description: r.description || null,
        plan:        r.plan || 'free',
        status:      r.status || 'pending',
        slug:        r.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).slice(2, 6),
      }))
      await supabase.from('listings').insert(batch)
      count += batch.length
      setImported(count)
    }
    await supabase.from('bulk_imports').insert([{ count, status: 'completed', filename: 'upload.csv' }])
    setStep('done')
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-serif font-bold text-2xl text-kerala-deep">Bulk Upload</h2>
        <button onClick={downloadTemplate} className="flex items-center gap-2 text-sm font-semibold bg-gray-100 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-200">
          ↓ Download Template
        </button>
      </div>

      {step === 'upload' && (
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors ${dragOver ? 'border-kerala-green bg-kerala-green/5' : 'border-gray-200 bg-gray-50'}`}
        >
          <Upload size={36} className="text-gray-300 mx-auto mb-3" />
          <p className="font-semibold text-gray-600 mb-1">Drag & drop your CSV file here</p>
          <p className="text-xs text-gray-400 mb-4">or click to browse</p>
          <label className="cursor-pointer bg-kerala-green text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90">
            Browse File
            <input type="file" accept=".csv" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
          </label>
          <div className="mt-6 text-xs text-gray-400">
            <p className="font-semibold mb-1">Required columns: {REQUIRED.join(', ')}</p>
            <p>Optional: {TEMPLATE_HEADERS.filter(h => !REQUIRED.includes(h)).join(', ')}</p>
          </div>
        </div>
      )}

      {step === 'preview' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-700">{preview.length} rows parsed</span>
              {errors.length > 0 ? (
                <span className="text-xs bg-red-100 text-red-600 px-2.5 py-1 rounded-full font-semibold">{errors.length} errors</span>
              ) : (
                <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-semibold">✓ Ready to import</span>
              )}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setStep('upload')} className="text-sm bg-gray-100 text-gray-700 px-4 py-2 rounded-xl font-semibold hover:bg-gray-200">← Back</button>
              <button onClick={importAll} disabled={errors.length > 0}
                className="text-sm bg-kerala-green text-white px-4 py-2 rounded-xl font-semibold hover:opacity-90 disabled:opacity-40">
                Import {preview.length} Listings
              </button>
            </div>
          </div>

          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 space-y-1 max-h-40 overflow-y-auto">
              {errors.map((e, i) => <p key={i} className="text-xs text-red-600">⚠️ {e}</p>)}
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead><tr className="border-b border-gray-100 bg-gray-50">
                  {['Row','Name','Emirate','Phone','Email','Plan','Status'].map(h =>
                    <th key={h} className="text-left text-xs font-semibold text-gray-500 px-4 py-3">{h}</th>)}
                </tr></thead>
                <tbody className="divide-y divide-gray-50">
                  {preview.map(r => (
                    <tr key={r._row} className="hover:bg-gray-50">
                      <td className="px-4 py-2.5 text-xs text-gray-400">{r._row}</td>
                      <td className="px-4 py-2.5 text-sm font-semibold text-kerala-deep">{r.name || <span className="text-red-500">MISSING</span>}</td>
                      <td className="px-4 py-2.5 text-xs text-gray-500">{r.emirate || <span className="text-red-500">MISSING</span>}</td>
                      <td className="px-4 py-2.5 text-xs text-gray-500">{r.phone || <span className="text-red-500">MISSING</span>}</td>
                      <td className="px-4 py-2.5 text-xs text-gray-500">{r.email || '—'}</td>
                      <td className="px-4 py-2.5 text-xs"><span className="bg-kerala-gold/15 text-kerala-gold px-2 py-0.5 rounded-full text-xs font-medium">{r.plan || 'free'}</span></td>
                      <td className="px-4 py-2.5 text-xs text-gray-400">{r.status || 'pending'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {step === 'importing' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <Loader2 size={36} className="animate-spin text-kerala-green mx-auto mb-4" />
          <p className="font-semibold text-kerala-deep">Importing listings…</p>
          <p className="text-sm text-gray-500 mt-1">{imported} imported so far</p>
        </div>
      )}

      {step === 'done' && (
        <div className="bg-green-50 border border-green-100 rounded-2xl p-10 text-center">
          <CheckCircle size={40} className="text-green-500 mx-auto mb-3" />
          <p className="font-bold text-green-700 text-lg">Import Complete!</p>
          <p className="text-sm text-green-600 mt-1">{imported} listings imported successfully</p>
          <button onClick={() => { setStep('upload'); setPreview([]); setErrors([]); setImported(0) }}
            className="mt-4 bg-kerala-green text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90">
            Upload Another File
          </button>
        </div>
      )}

      {/* Import History */}
      {history.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Import History</p>
          </div>
          <div className="divide-y divide-gray-50">
            {history.map(h => (
              <div key={h.id} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-kerala-deep">{h.filename ?? 'upload.csv'}</p>
                  <p className="text-xs text-gray-400">{fmtDate(h.created_at)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-kerala-deep">{h.count} listings</span>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${h.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-600'}`}>{h.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-blue-800">
        <p className="font-semibold mb-1">Setup required</p>
        <code className="block bg-blue-100 rounded p-2 mt-1 font-mono whitespace-pre">{`CREATE TABLE IF NOT EXISTS bulk_imports (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  filename text,
  count integer DEFAULT 0,
  status text DEFAULT 'completed',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE bulk_imports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth bulk imports" ON bulk_imports FOR ALL TO authenticated USING (true);`}</code>
      </div>
    </div>
  )
}

// ── Section: Notifications ─────────────────────────────────────────────────
function AdminNotificationsSection() {
  const [tab,       setTab]       = useState<'send'|'history'>('send')
  const [audience,  setAudience]  = useState<'all'|'business'|'premium'|'pending_payment'|'expired'>('all')
  const [title,     setTitle]     = useState('')
  const [message,   setMessage]   = useState('')
  const [link,      setLink]      = useState('')
  const [sending,   setSending]   = useState(false)
  const [sent,      setSent]      = useState(false)
  const [history,   setHistory]   = useState<any[]>([])
  const [hLoading,  setHLoading]  = useState(false)

  async function loadHistory() {
    setHLoading(true)
    const { data } = await supabase.from('notifications').select('*').order('created_at', { ascending: false }).limit(50)
    setHistory(data ?? [])
    setHLoading(false)
  }

  useEffect(() => { if (tab === 'history') loadHistory() }, [tab])

  async function send() {
    if (!title.trim() || !message.trim()) { alert('Title and message are required'); return }
    setSending(true)

    // Fetch target user IDs
    let q = supabase.from('profiles').select('id')
    if (audience === 'business') q = q.eq('is_business_owner', true)
    const { data: users } = await q.limit(1000)

    // Insert notification record
    const { data: notif } = await supabase.from('notifications').insert([{
      title, message, link: link || null, audience,
      recipient_count: users?.length ?? 0, status: 'sent',
    }]).select().single()

    // Insert per-user notification rows
    if (users && users.length > 0) {
      const rows = users.map(u => ({ user_id: u.id, notification_id: notif?.id, is_read: false }))
      const batchSize = 100
      for (let i = 0; i < rows.length; i += batchSize) {
        await supabase.from('user_notifications').insert(rows.slice(i, i + batchSize))
      }
    }

    setSending(false)
    setSent(true)
    setTitle(''); setMessage(''); setLink('')
    setTimeout(() => setSent(false), 3000)
  }

  const audienceOptions = [
    { key: 'all',             label: 'All Users',           desc: 'Every registered user' },
    { key: 'business',        label: 'Business Owners',     desc: 'Users with business listings' },
    { key: 'premium',         label: 'Premium Members',     desc: 'Users on Premium or Elite plan' },
    { key: 'pending_payment', label: 'Pending Payment',     desc: 'Users with unpaid invoices' },
    { key: 'expired',         label: 'Expired Listings',    desc: 'Users whose listings expired' },
  ] as const

  return (
    <div className="space-y-5">
      <h2 className="font-serif font-bold text-2xl text-kerala-deep">Notifications</h2>

      <div className="flex gap-2">
        {(['send','history'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-xl text-sm font-semibold capitalize ${tab === t ? 'bg-kerala-deep text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {t === 'send' ? '📤 Send Notification' : '📋 History'}
          </button>
        ))}
      </div>

      {tab === 'send' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Notification Title *</label>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Onam Special Offer — Upgrade Now!"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Message *</label>
              <textarea value={message} onChange={e => setMessage(e.target.value)} rows={4}
                placeholder="Write your notification message here…"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 resize-none" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Link (optional)</label>
              <input value={link} onChange={e => setLink(e.target.value)} placeholder="https://malayalibusiness.com/..."
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30" />
            </div>

            {/* Preview */}
            {(title || message) && (
              <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 space-y-1">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Preview</p>
                <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                  <p className="font-semibold text-kerala-deep text-sm">{title || 'Notification Title'}</p>
                  <p className="text-xs text-gray-600 mt-1">{message || 'Message text here…'}</p>
                  {link && <p className="text-xs text-kerala-green mt-1 font-medium">→ {link}</p>}
                </div>
              </div>
            )}

            <button onClick={send} disabled={sending || !title || !message}
              className="flex items-center gap-2 bg-kerala-green text-white px-6 py-3 rounded-xl text-sm font-bold hover:opacity-90 disabled:opacity-40 transition-all">
              {sending ? <><Loader2 size={16} className="animate-spin" /> Sending…</> :
               sent    ? <><CheckCircle size={16} /> Sent!</> :
               <><Send size={16} /> Send Notification</>}
            </button>
          </div>

          {/* Audience selector */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Target Audience</p>
            {audienceOptions.map(a => (
              <div key={a.key} onClick={() => setAudience(a.key)}
                className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${audience === a.key ? 'border-kerala-green bg-kerala-green/5' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
                <p className={`font-semibold text-sm ${audience === a.key ? 'text-kerala-green' : 'text-kerala-deep'}`}>{a.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{a.desc}</p>
                {audience === a.key && <span className="text-xs text-kerala-green font-bold mt-1 block">✓ Selected</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'history' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {hLoading ? <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-kerala-green" /></div> :
          history.length === 0 ? <div className="p-10 text-center text-gray-400 text-sm">No notifications sent yet.</div> : (
            <div className="divide-y divide-gray-50">
              {history.map(n => (
                <div key={n.id} className="px-5 py-4 flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-kerala-deep text-sm">{n.title}</p>
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full capitalize">{n.audience}</span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-1">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{fmtDate(n.created_at)} · {n.recipient_count ?? 0} recipients</p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-semibold shrink-0">{n.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-blue-800">
        <p className="font-semibold mb-1">Setup required</p>
        <code className="block bg-blue-100 rounded p-2 mt-1 font-mono whitespace-pre">{`CREATE TABLE IF NOT EXISTS notifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  message text NOT NULL,
  link text,
  audience text DEFAULT 'all',
  recipient_count integer DEFAULT 0,
  status text DEFAULT 'sent',
  created_at timestamptz DEFAULT now()
);
CREATE TABLE IF NOT EXISTS user_notifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  notification_id uuid REFERENCES notifications(id) ON DELETE CASCADE,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth notifications" ON notifications FOR ALL TO authenticated USING (true);
CREATE POLICY "Auth user_notifications" ON user_notifications FOR ALL TO authenticated USING (true);`}</code>
      </div>
    </div>
  )
}

// ── Section: Duplicates ───────────────────────────────────────────────────
function AdminDuplicatesSection() {
  const [listings,  setListings]  = useState<any[]>([])
  const [loading,   setLoading]   = useState(true)
  const [groupBy,   setGroupBy]   = useState<'phone'|'name'|'email'>('phone')
  const [expanded,  setExpanded]  = useState<string|null>(null)

  useEffect(() => {
    supabase.from('listings')
      .select('id, name, slug, phone, email, emirate, area, status, created_at, owner_id')
      .order('created_at', { ascending: false }).limit(1000)
      .then(({ data, error }) => {
        if (error) console.error('[Duplicates]', error.message)
        setListings(data ?? [])
        setLoading(false)
      })
  }, [])

  const groups = listings.reduce((acc: Record<string, any[]>, l) => {
    const key = (l[groupBy] ?? '').toString().trim().toLowerCase()
    if (!key) return acc
    if (!acc[key]) acc[key] = []
    acc[key].push(l)
    return acc
  }, {})

  const duplicateGroups = Object.entries(groups)
    .filter(([, items]) => items.length > 1)
    .sort((a, b) => b[1].length - a[1].length)

  async function deleteListing(id: string, groupKey: string) {
    if (!confirm('Delete this listing?')) return
    await supabase.from('listings').delete().eq('id', id)
    setListings(prev => prev.filter(l => l.id !== id))
    setExpanded(null)
  }

  async function mergeDuplicates(ids: string[], keepId: string) {
    if (!confirm(`Keep listing and delete ${ids.length - 1} duplicate(s)?`)) return
    const toDelete = ids.filter(id => id !== keepId)
    await supabase.from('listings').delete().in('id', toDelete)
    setListings(prev => prev.filter(l => !toDelete.includes(l.id)))
    setExpanded(null)
  }

  const statusColors: Record<string,string> = { active: 'bg-green-100 text-green-700', pending: 'bg-amber-100 text-amber-600', suspended: 'bg-red-100 text-red-600' }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-serif font-bold text-2xl text-kerala-deep">Duplicate Detector</h2>
        <span className="text-sm text-gray-500">{duplicateGroups.length} duplicate groups found</span>
      </div>

      <div className="flex gap-2">
        {(['phone','name','email'] as const).map(g => (
          <button key={g} onClick={() => { setGroupBy(g); setExpanded(null) }}
            className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${groupBy === g ? 'bg-kerala-deep text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            By {g}
          </button>
        ))}
      </div>

      {loading ? <div className="flex justify-center py-16"><Loader2 size={24} className="animate-spin text-kerala-green" /></div> :
      duplicateGroups.length === 0 ? (
        <div className="bg-green-50 border border-green-100 rounded-2xl p-12 text-center">
          <CheckCircle size={40} className="text-green-400 mx-auto mb-3" />
          <p className="font-semibold text-green-700">No duplicates found by {groupBy}</p>
          <p className="text-sm text-green-600 mt-1">All listings have unique {groupBy} values</p>
        </div>
      ) : (
        <div className="space-y-3">
          {duplicateGroups.map(([key, items]) => (
            <div key={key} className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-50"
                onClick={() => setExpanded(expanded === key ? null : key)}>
                <div className="flex items-center gap-3">
                  <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2.5 py-1 rounded-full">{items.length} duplicates</span>
                  <p className="font-semibold text-kerala-deep">{groupBy === 'phone' ? '📞' : groupBy === 'email' ? '✉️' : '🏢'} {key}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={e => { e.stopPropagation(); mergeDuplicates(items.map(i => i.id), items[0].id) }}
                    className="text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-200 font-semibold">
                    Keep First & Delete Rest
                  </button>
                  <ChevronRight size={16} className={`text-gray-400 transition-transform ${expanded === key ? 'rotate-90' : ''}`} />
                </div>
              </div>

              {expanded === key && (
                <div className="border-t border-gray-100 divide-y divide-gray-50">
                  {items.map((l, i) => (
                    <div key={l.id} className="px-5 py-3 flex items-center gap-4">
                      <span className="text-xs font-bold text-gray-400 w-6">#{i+1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-kerala-deep truncate">{l.name}</p>
                        <p className="text-xs text-gray-400">{l.emirate}{l.area ? ` · ${l.area}` : ''} · {fmtDate(l.created_at)}</p>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${statusColors[l.status] ?? 'bg-gray-100 text-gray-500'}`}>{l.status}</span>
                      <div className="flex gap-2 shrink-0">
                        {i > 0 && (
                          <button onClick={() => deleteListing(l.id, key)}
                            className="text-xs bg-red-50 text-red-600 px-2.5 py-1.5 rounded-lg hover:bg-red-100 font-medium">Delete</button>
                        )}
                        {i === 0 && <span className="text-xs text-green-600 font-semibold px-2.5 py-1.5">✓ Keep</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Section: Support Tickets ───────────────────────────────────────────────
function AdminSupportSection() {
  const [tickets,  setTickets]  = useState<any[]>([])
  const [loading,  setLoading]  = useState(true)
  const [filter,   setFilter]   = useState<'open'|'in_progress'|'resolved'|'all'>('open')
  const [selected, setSelected] = useState<any|null>(null)
  const [reply,    setReply]    = useState('')
  const [sending,  setSending]  = useState(false)

  async function load() {
    setLoading(true)
    let q = supabase.from('support_tickets')
      .select('id, subject, message, status, priority, type, created_at, updated_at, user_id, profiles(full_name, email, phone)')
      .order('created_at', { ascending: false }).limit(200)
    if (filter !== 'all') q = q.eq('status', filter)
    const { data, error } = await q
    if (error) console.error('[Support]', error.message)
    setTickets(data ?? [])
    setLoading(false)
  }
  useEffect(() => { load() }, [filter])

  async function updateStatus(id: string, status: string) {
    await supabase.from('support_tickets').update({ status }).eq('id', id)
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status } : t))
    if (selected?.id === id) setSelected((prev: any) => ({ ...prev, status }))
  }

  async function sendReply() {
    if (!reply.trim() || !selected) return
    setSending(true)
    await supabase.from('ticket_replies').insert([{ ticket_id: selected.id, message: reply, is_admin: true }])
    await supabase.from('support_tickets').update({ status: 'in_progress', updated_at: new Date().toISOString() }).eq('id', selected.id)
    setReply('')
    setSending(false)
    load()
  }

  const priorityColor: Record<string,string> = { high: 'bg-red-100 text-red-600', medium: 'bg-amber-100 text-amber-600', low: 'bg-gray-100 text-gray-500' }
  const statusColor:   Record<string,string> = { open: 'bg-blue-100 text-blue-600', in_progress: 'bg-amber-100 text-amber-600', resolved: 'bg-green-100 text-green-700', closed: 'bg-gray-100 text-gray-500' }
  const typeIcon: Record<string,string> = { listing_update: '🏢', payment: '💳', verification: '✅', wrong_info: '⚠️', claim: '📋', general: '💬' }

  return (
    <div className="space-y-5">
      {/* Ticket detail drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelected(null)} />
          <div className="relative ml-auto w-full max-w-[95vw] sm:max-w-lg bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between z-10">
              <div>
                <p className="font-bold text-kerala-deep">{selected.subject}</p>
                <p className="text-xs text-gray-400">{(selected.profiles as any)?.email} · {fmtDate(selected.created_at)}</p>
              </div>
              <button onClick={() => setSelected(null)} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
            </div>
            <div className="p-5 flex-1 space-y-4">
              <div className="flex gap-2">
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${statusColor[selected.status] ?? 'bg-gray-100 text-gray-500'}`}>{selected.status?.replace('_',' ')}</span>
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${priorityColor[selected.priority] ?? 'bg-gray-100 text-gray-500'}`}>{selected.priority} priority</span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">{typeIcon[selected.type] ?? '💬'} {selected.type?.replace('_',' ')}</span>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-semibold text-gray-500 mb-1">Message from {(selected.profiles as any)?.full_name ?? 'User'}</p>
                <p className="text-sm text-gray-700">{selected.message}</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {['open','in_progress','resolved'].map(s => (
                  <button key={s} onClick={() => updateStatus(selected.id, s)}
                    className={`py-2 rounded-xl text-xs font-semibold capitalize transition-all ${selected.status === s ? 'bg-kerala-green text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    {s.replace('_',' ')}
                  </button>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs font-semibold text-gray-500 mb-2">Admin Reply</p>
                <textarea value={reply} onChange={e => setReply(e.target.value)} rows={4}
                  placeholder="Type your reply to the user…"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 resize-none" />
                <button onClick={sendReply} disabled={sending || !reply.trim()}
                  className="mt-2 flex items-center gap-2 bg-kerala-green text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-40">
                  {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} Send Reply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="font-serif font-bold text-2xl text-kerala-deep">Support Tickets</h2>
        <button onClick={() => exportCSV(tickets, 'support-tickets.csv')} className="text-sm font-semibold bg-gray-100 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-200">↓ CSV</button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {(['open','in_progress','resolved','all'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${filter === f ? 'bg-kerala-deep text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {f.replace('_',' ')} {f !== 'all' && `(${tickets.filter(t => t.status === f).length})`}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-kerala-green" /></div> :
        tickets.length === 0 ? <div className="p-10 text-center text-gray-400 text-sm">No tickets found.</div> : (
          <div className="divide-y divide-gray-50">
            {tickets.map(t => (
              <div key={t.id} className="px-5 py-4 flex items-start gap-4 hover:bg-gray-50 cursor-pointer" onClick={() => setSelected(t)}>
                <div className="text-2xl shrink-0">{typeIcon[t.type] ?? '💬'}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="font-bold text-kerala-deep text-sm">{t.subject}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${priorityColor[t.priority] ?? 'bg-gray-100 text-gray-500'}`}>{t.priority}</span>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-1">{t.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{(t.profiles as any)?.full_name ?? '—'} · {(t.profiles as any)?.email} · {fmtDate(t.created_at)}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold shrink-0 ${statusColor[t.status] ?? 'bg-gray-100 text-gray-500'}`}>{t.status?.replace('_',' ')}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-blue-800">
        <p className="font-semibold mb-1">Setup required</p>
        <code className="block bg-blue-100 rounded p-2 mt-1 font-mono whitespace-pre">{`CREATE TABLE IF NOT EXISTS support_tickets (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  subject text NOT NULL,
  message text NOT NULL,
  type text DEFAULT 'general',
  priority text DEFAULT 'medium',
  status text DEFAULT 'open',
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);
CREATE TABLE IF NOT EXISTS ticket_replies (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id uuid REFERENCES support_tickets(id) ON DELETE CASCADE,
  message text NOT NULL,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_replies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth support tickets" ON support_tickets FOR ALL TO authenticated USING (true);
CREATE POLICY "Auth ticket replies" ON ticket_replies FOR ALL TO authenticated USING (true);`}</code>
      </div>
    </div>
  )
}

// ── Section: Audit Log ─────────────────────────────────────────────────────
function AdminAuditSection() {
  const [logs,    setLogs]    = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter,  setFilter]  = useState<'all'|'listing'|'user'|'payment'|'settings'>('all')
  const [search,  setSearch]  = useState('')

  useEffect(() => {
    supabase.from('audit_logs')
      .select('id, action, entity_type, entity_id, entity_name, admin_email, metadata, created_at')
      .order('created_at', { ascending: false }).limit(300)
      .then(({ data, error }) => {
        if (error) console.error('[Audit]', error.message)
        setLogs(data ?? [])
        setLoading(false)
      })
  }, [])

  const filtered = logs
    .filter(l => filter === 'all' || l.entity_type === filter)
    .filter(l => !search || l.entity_name?.toLowerCase().includes(search.toLowerCase()) || l.action?.toLowerCase().includes(search.toLowerCase()) || l.admin_email?.toLowerCase().includes(search.toLowerCase()))

  const actionColor: Record<string,string> = {
    approved:  'bg-green-100 text-green-700',
    rejected:  'bg-red-100 text-red-600',
    deleted:   'bg-red-100 text-red-600',
    suspended: 'bg-orange-100 text-orange-600',
    featured:  'bg-purple-100 text-purple-600',
    verified:  'bg-blue-100 text-blue-600',
    updated:   'bg-gray-100 text-gray-600',
    created:   'bg-kerala-green/10 text-kerala-green',
    blocked:   'bg-red-100 text-red-600',
    paid:      'bg-green-100 text-green-700',
  }

  const entityIcon: Record<string,string> = { listing: '🏢', user: '👤', payment: '💳', settings: '⚙️', review: '⭐', category: '📁' }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-serif font-bold text-2xl text-kerala-deep">Audit Log</h2>
        <button onClick={() => exportCSV(filtered, 'audit-log.csv')} className="text-sm font-semibold bg-gray-100 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-200">↓ CSV</button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
          {(['all','listing','user','payment','settings'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize ${filter === f ? 'bg-white text-kerala-deep shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              {f}
            </button>
          ))}
        </div>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by action, name, admin…"
          className="flex-1 w-full sm:min-w-[200px] px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-kerala-green" /></div> :
        filtered.length === 0 ? <div className="p-10 text-center text-gray-400 text-sm">No audit logs yet. Actions you take in the admin panel will be recorded here.</div> : (
          <div className="divide-y divide-gray-50">
            {filtered.map(l => (
              <div key={l.id} className="px-5 py-3.5 flex items-center gap-4">
                <div className="text-lg shrink-0 w-8 text-center">{entityIcon[l.entity_type] ?? '📋'}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${actionColor[l.action] ?? 'bg-gray-100 text-gray-600'}`}>{l.action}</span>
                    <span className="text-sm font-semibold text-kerala-deep truncate">{l.entity_name ?? l.entity_id}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">by <span className="font-medium text-gray-600">{l.admin_email ?? 'admin'}</span> · {fmtDate(l.created_at)}</p>
                </div>
                <span className="text-xs text-gray-300 font-mono shrink-0 hidden sm:block">{l.entity_type}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-blue-800">
        <p className="font-semibold mb-1">Setup required</p>
        <code className="block bg-blue-100 rounded p-2 mt-1 font-mono whitespace-pre">{`CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  entity_name text,
  admin_email text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth audit logs" ON audit_logs FOR ALL TO authenticated USING (true);`}</code>
      </div>
    </div>
  )
}

// ── Section: Blog / Content ───────────────────────────────────────────────
function AdminBlogSection() {
  const [posts,   setPosts]   = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<any|null>(null)
  const [filter,  setFilter]  = useState<'all'|'published'|'draft'>('all')
  const [form,    setForm]    = useState({ title: '', slug: '', excerpt: '', content: '', category: 'news', status: 'draft', is_featured: false, meta_title: '', meta_description: '', cover_url: '' })

  useEffect(() => {
    supabase.from('blog_posts').select('id, title, slug, category, status, is_featured, created_at, cover_url')
      .order('created_at', { ascending: false }).limit(100)
      .then(({ data, error }) => { if (error) console.error('[Blog]', error.message); setPosts(data ?? []); setLoading(false) })
  }, [])

  async function save() {
    const payload = { ...form, slug: form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') }
    if (editing?.id) {
      await supabase.from('blog_posts').update(payload).eq('id', editing.id)
      setPosts(prev => prev.map(p => p.id === editing.id ? { ...p, ...payload } : p))
    } else {
      const { data } = await supabase.from('blog_posts').insert([payload]).select().single()
      if (data) setPosts(prev => [data, ...prev])
    }
    setEditing(null)
    setForm({ title: '', slug: '', excerpt: '', content: '', category: 'news', status: 'draft', is_featured: false, meta_title: '', meta_description: '', cover_url: '' })
  }

  async function del(id: string) {
    if (!confirm('Delete this post?')) return
    await supabase.from('blog_posts').delete().eq('id', id)
    setPosts(prev => prev.filter(p => p.id !== id))
  }

  async function toggleStatus(id: string, status: string) {
    const next = status === 'published' ? 'draft' : 'published'
    await supabase.from('blog_posts').update({ status: next }).eq('id', id)
    setPosts(prev => prev.map(p => p.id === id ? { ...p, status: next } : p))
  }

  function openNew() {
    setEditing({})
    setForm({ title: '', slug: '', excerpt: '', content: '', category: 'news', status: 'draft', is_featured: false, meta_title: '', meta_description: '', cover_url: '' })
  }

  function openEdit(p: any) {
    setEditing(p)
    setForm({ title: p.title, slug: p.slug, excerpt: p.excerpt ?? '', content: p.content ?? '', category: p.category ?? 'news', status: p.status, is_featured: p.is_featured, meta_title: p.meta_title ?? '', meta_description: p.meta_description ?? '', cover_url: p.cover_url ?? '' })
  }

  const filtered = posts.filter(p => filter === 'all' || p.status === filter)
  const CATEGORIES = ['news', 'guide', 'entrepreneur', 'event', 'community', 'interview', 'top-list']
  const catColors: Record<string,string> = { news: 'bg-blue-100 text-blue-600', guide: 'bg-green-100 text-green-700', entrepreneur: 'bg-kerala-gold/20 text-kerala-gold', event: 'bg-purple-100 text-purple-600', community: 'bg-pink-100 text-pink-600', interview: 'bg-orange-100 text-orange-600', 'top-list': 'bg-red-100 text-red-600' }

  if (editing !== null) return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-center justify-between">
        <h2 className="font-serif font-bold text-2xl text-kerala-deep">{editing.id ? 'Edit Post' : 'New Blog Post'}</h2>
        <button onClick={() => setEditing(null)} className="text-sm bg-gray-100 text-gray-700 px-4 py-2 rounded-xl font-semibold hover:bg-gray-200">← Back</button>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Title *</label>
            <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              placeholder="e.g. Top 10 Malayali Restaurants in Dubai"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Slug (URL)</label>
            <input value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))}
              placeholder="auto-generated from title"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Category</label>
            <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-kerala-green/30">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Status</label>
            <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-kerala-green/30">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Cover Image URL</label>
            <input value={form.cover_url} onChange={e => setForm(p => ({ ...p, cover_url: e.target.value }))}
              placeholder="https://..."
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Excerpt</label>
            <textarea value={form.excerpt} onChange={e => setForm(p => ({ ...p, excerpt: e.target.value }))} rows={2}
              placeholder="Short summary shown in listings…"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 resize-none" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Content (Markdown supported)</label>
            <textarea value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} rows={10}
              placeholder="Write your blog post here…"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-kerala-green/30 resize-y" />
          </div>
        </div>
        <div className="border-t border-gray-100 pt-4 space-y-3">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">SEO Settings</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Meta Title</label>
              <input value={form.meta_title} onChange={e => setForm(p => ({ ...p, meta_title: e.target.value }))}
                placeholder="SEO title (60 chars max)"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30" />
              <p className="text-xs text-gray-400 mt-1">{form.meta_title.length}/60</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Meta Description</label>
              <input value={form.meta_description} onChange={e => setForm(p => ({ ...p, meta_description: e.target.value }))}
                placeholder="SEO description (160 chars max)"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30" />
              <p className="text-xs text-gray-400 mt-1">{form.meta_description.length}/160</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <input type="checkbox" id="feat-post" checked={form.is_featured} onChange={e => setForm(p => ({ ...p, is_featured: e.target.checked }))} className="w-4 h-4 accent-kerala-green" />
          <label htmlFor="feat-post" className="text-sm text-gray-700">Feature on homepage</label>
        </div>
        <div className="flex gap-2 pt-2">
          <button onClick={save} className="bg-kerala-green text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90">Save Post</button>
          <button onClick={() => setEditing(null)} className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-xl text-sm font-semibold">Cancel</button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <h2 className="font-serif font-bold text-2xl text-kerala-deep">Blog & Content</h2>
        <div className="flex gap-2">
          <button onClick={() => exportCSV(filtered, 'blog-posts.csv')} className="text-sm font-semibold bg-gray-100 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-200">↓ CSV</button>
          <button onClick={openNew} className="flex items-center gap-2 bg-kerala-green text-white text-sm font-semibold px-4 py-2 rounded-xl hover:opacity-90"><Plus size={15} /> New Post</button>
        </div>
      </div>
      <div className="flex gap-2">
        {(['all','published','draft'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize ${filter === f ? 'bg-kerala-deep text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {f} ({f === 'all' ? posts.length : posts.filter(p => p.status === f).length})
          </button>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-kerala-green" /></div> :
        filtered.length === 0 ? <div className="p-10 text-center text-gray-400 text-sm">No posts yet. Click "New Post" to start.</div> : (
          <div className="divide-y divide-gray-50">
            {filtered.map(p => (
              <div key={p.id} className="px-5 py-4 flex items-center gap-4">
                {p.cover_url && <div className="w-14 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0"><img src={p.cover_url} alt="" className="w-full h-full object-cover" /></div>}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    {p.is_featured && <span className="text-xs bg-kerala-gold/20 text-kerala-gold px-2 py-0.5 rounded-full font-bold">⭐ Featured</span>}
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${catColors[p.category] ?? 'bg-gray-100 text-gray-500'}`}>{p.category}</span>
                  </div>
                  <p className="font-bold text-kerala-deep text-sm truncate">{p.title}</p>
                  <p className="text-xs text-gray-400">{fmtDate(p.created_at)}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${p.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{p.status}</span>
                  <button onClick={() => openEdit(p)} className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1.5 rounded-lg hover:bg-blue-100 font-medium">Edit</button>
                  <button onClick={() => toggleStatus(p.id, p.status)} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1.5 rounded-lg hover:bg-gray-200 font-medium">{p.status === 'published' ? 'Unpublish' : 'Publish'}</button>
                  <button onClick={() => del(p.id)} className="text-xs bg-red-50 text-red-600 px-2.5 py-1.5 rounded-lg hover:bg-red-100 font-medium">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-blue-800">
        <p className="font-semibold mb-1">Setup required</p>
        <code className="block bg-blue-100 rounded p-2 mt-1 font-mono whitespace-pre">{`CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text,
  content text,
  cover_url text,
  category text DEFAULT 'news',
  status text DEFAULT 'draft',
  is_featured boolean DEFAULT false,
  meta_title text,
  meta_description text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read blog" ON blog_posts FOR SELECT USING (true);
CREATE POLICY "Auth write blog" ON blog_posts FOR ALL TO authenticated USING (true);`}</code>
      </div>
    </div>
  )
}

// ── Section: SEO Controls ──────────────────────────────────────────────────
function AdminSEOSection() {
  const [listings, setListings] = useState<any[]>([])
  const [loading,  setLoading]  = useState(true)
  const [search,   setSearch]   = useState('')
  const [selected, setSelected] = useState<any|null>(null)
  const [form,     setForm]     = useState({ meta_title: '', meta_description: '', keywords: '', slug: '', canonical_url: '', no_index: false })
  const [saving,   setSaving]   = useState(false)
  const [saved,    setSaved]    = useState(false)

  useEffect(() => {
    supabase.from('listings').select('id, name, slug, emirate, status, meta_title, meta_description, keywords, canonical_url, no_index')
      .order('created_at', { ascending: false }).limit(200)
      .then(({ data, error }) => { if (error) console.error('[SEO]', error.message); setListings(data ?? []); setLoading(false) })
  }, [])

  function openListing(l: any) {
    setSelected(l)
    setForm({ meta_title: l.meta_title ?? '', meta_description: l.meta_description ?? '', keywords: l.keywords ?? '', slug: l.slug ?? '', canonical_url: l.canonical_url ?? '', no_index: l.no_index ?? false })
  }

  async function saveSEO() {
    if (!selected) return
    setSaving(true)
    await supabase.from('listings').update(form).eq('id', selected.id)
    setListings(prev => prev.map(l => l.id === selected.id ? { ...l, ...form } : l))
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000)
  }

  const filtered = listings.filter(l => !search || l.name?.toLowerCase().includes(search.toLowerCase()) || l.emirate?.toLowerCase().includes(search.toLowerCase()))

  const seoScore = (l: any) => {
    let score = 0
    if (l.meta_title)       score += 35
    if (l.meta_description) score += 35
    if (l.keywords)         score += 15
    if (l.slug)             score += 15
    return score
  }

  const scoreColor = (s: number) => s >= 85 ? 'text-green-600' : s >= 50 ? 'text-amber-600' : 'text-red-500'

  return (
    <div className="space-y-5">
      <h2 className="font-serif font-bold text-2xl text-kerala-deep">SEO Controls</h2>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
        {/* Listing picker */}
        <div className="md:col-span-2 space-y-3">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search listings…"
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30" />
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden max-h-[600px] overflow-y-auto">
            {loading ? <div className="flex justify-center py-8"><Loader2 size={20} className="animate-spin text-kerala-green" /></div> :
            filtered.map(l => {
              const score = seoScore(l)
              return (
                <div key={l.id} onClick={() => openListing(l)}
                  className={`px-4 py-3.5 flex items-center gap-3 cursor-pointer border-b border-gray-50 transition-colors ${selected?.id === l.id ? 'bg-kerala-green/5 border-l-2 border-l-kerala-green' : 'hover:bg-gray-50'}`}>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-kerala-deep truncate">{l.name}</p>
                    <p className="text-xs text-gray-400">{l.emirate}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-xs font-bold ${scoreColor(score)}`}>{score}%</p>
                    <p className="text-[10px] text-gray-400">SEO</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* SEO editor */}
        <div className="md:col-span-3">
          {!selected ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center text-gray-400">
              <Search size={32} className="mx-auto mb-3 text-gray-300" />
              <p className="text-sm">Select a listing to edit its SEO settings</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="font-bold text-kerala-deep">{selected.name}</p>
                <span className={`text-sm font-bold ${scoreColor(seoScore(selected))}`}>SEO Score: {seoScore(selected)}%</span>
              </div>

              {[
                { label: 'Meta Title', key: 'meta_title', max: 60, placeholder: 'e.g. Best Malayali Restaurant in Dubai | MalayaliBusiness' },
                { label: 'Meta Description', key: 'meta_description', max: 160, placeholder: 'e.g. Discover the best authentic Kerala cuisine in Dubai…' },
                { label: 'Keywords', key: 'keywords', max: 0, placeholder: 'e.g. malayali restaurant dubai, kerala food dubai' },
                { label: 'URL Slug', key: 'slug', max: 0, placeholder: 'e.g. best-malayali-restaurant-dubai' },
                { label: 'Canonical URL', key: 'canonical_url', max: 0, placeholder: 'https://malayalibusiness.com/...' },
              ].map(f => (
                <div key={f.key}>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-gray-600">{f.label}</label>
                    {f.max > 0 && <span className={`text-xs ${(form as any)[f.key].length > f.max ? 'text-red-500 font-bold' : 'text-gray-400'}`}>{(form as any)[f.key].length}/{f.max}</span>}
                  </div>
                  <input value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30" />
                </div>
              ))}

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <input type="checkbox" id="noindex" checked={form.no_index} onChange={e => setForm(p => ({ ...p, no_index: e.target.checked }))} className="w-4 h-4 accent-red-500" />
                <div>
                  <label htmlFor="noindex" className="text-sm font-semibold text-gray-700">No Index</label>
                  <p className="text-xs text-gray-500">Hide this listing from Google search results</p>
                </div>
              </div>

              {/* Google preview */}
              {(form.meta_title || form.meta_description) && (
                <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                  <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Google Preview</p>
                  <p className="text-blue-700 text-base font-medium">{form.meta_title || selected.name}</p>
                  <p className="text-green-700 text-xs mt-0.5">malayalibusiness.com › {form.slug || selected.slug}</p>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">{form.meta_description || 'No meta description set.'}</p>
                </div>
              )}

              <button onClick={saveSEO} disabled={saving}
                className="w-full bg-kerala-green text-white py-2.5 rounded-xl text-sm font-bold hover:opacity-90 disabled:opacity-50">
                {saving ? 'Saving…' : saved ? '✓ Saved!' : 'Save SEO Settings'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Section: Roles & Permissions ───────────────────────────────────────────
const ROLES = [
  { key: 'super_admin',      label: 'Super Admin',      color: 'bg-red-100 text-red-600',         desc: 'Full platform access — only you',         permissions: ['all'] },
  { key: 'listing_manager',  label: 'Listing Manager',  color: 'bg-blue-100 text-blue-600',        desc: 'Add, edit, approve and reject listings',  permissions: ['listings','approvals','categories','locations'] },
  { key: 'sales_team',       label: 'Sales Team',       color: 'bg-green-100 text-green-700',      desc: 'Leads, packages, payments, offers',        permissions: ['leads','packages','payments','offers'] },
  { key: 'content_manager',  label: 'Content Manager',  color: 'bg-purple-100 text-purple-600',    desc: 'Blog, events, community posts',            permissions: ['blog','events','community','media'] },
  { key: 'support_team',     label: 'Support Team',     color: 'bg-amber-100 text-amber-600',      desc: 'Handle support tickets and claims',        permissions: ['support','claims','users'] },
  { key: 'finance',          label: 'Finance',          color: 'bg-kerala-gold/20 text-kerala-gold', desc: 'Payments and invoices only',             permissions: ['payments'] },
]

function AdminRolesSection() {
  const [teamMembers, setTeamMembers] = useState<any[]>([])
  const [loading,     setLoading]     = useState(true)
  const [adding,      setAdding]      = useState(false)
  const [newEmail,    setNewEmail]    = useState('')
  const [newRole,     setNewRole]     = useState('listing_manager')
  const [activeRole,  setActiveRole]  = useState(ROLES[0])

  useEffect(() => {
    supabase.from('team_members')
      .select('id, role, created_at, profiles(full_name, email, avatar_url)')
      .order('created_at', { ascending: false }).limit(50)
      .then(({ data, error }) => { if (error) console.error('[Roles]', error.message); setTeamMembers(data ?? []); setLoading(false) })
  }, [])

  async function addMember() {
    if (!newEmail.trim()) return
    const { data: profile } = await supabase.from('profiles').select('id, email, full_name').eq('email', newEmail.trim()).single()
    if (!profile) { alert('No user found with that email'); return }
    const { data } = await supabase.from('team_members').insert([{ user_id: profile.id, role: newRole }]).select('id, role, created_at, profiles(full_name, email)').single()
    if (data) setTeamMembers(prev => [data, ...prev])
    setAdding(false); setNewEmail('')
  }

  async function removeMember(id: string) {
    if (!confirm('Remove this team member?')) return
    await supabase.from('team_members').delete().eq('id', id)
    setTeamMembers(prev => prev.filter(m => m.id !== id))
  }

  return (
    <div className="space-y-5">
      <h2 className="font-serif font-bold text-2xl text-kerala-deep">Roles & Permissions</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Role cards */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Available Roles</p>
          {ROLES.map(r => (
            <div key={r.key} onClick={() => setActiveRole(r)}
              className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${activeRole.key === r.key ? 'border-kerala-green bg-kerala-green/5' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${r.color}`}>{r.label}</span>
                <span className="text-xs text-gray-400">{teamMembers.filter(m => m.role === r.key).length} members</span>
              </div>
              <p className="text-xs text-gray-500">{r.desc}</p>
            </div>
          ))}
        </div>

        {/* Role detail + members */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className={`text-sm font-bold px-3 py-1 rounded-full ${activeRole.color}`}>{activeRole.label}</span>
                <p className="text-xs text-gray-500 mt-1.5">{activeRole.desc}</p>
              </div>
              {activeRole.key !== 'super_admin' && (
                <button onClick={() => setAdding(true)} className="flex items-center gap-1.5 text-xs bg-kerala-green text-white px-3 py-2 rounded-xl font-semibold hover:opacity-90">
                  <Plus size={13} /> Add Member
                </button>
              )}
            </div>

            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs font-semibold text-gray-500 mb-2">Permissions</p>
              <div className="flex flex-wrap gap-1.5">
                {activeRole.permissions[0] === 'all' ? (
                  <span className="text-xs bg-red-100 text-red-600 px-2.5 py-1 rounded-full font-semibold">✓ All Sections</span>
                ) : activeRole.permissions.map(p => (
                  <span key={p} className="text-xs bg-kerala-green/10 text-kerala-green px-2.5 py-1 rounded-full font-semibold capitalize">{p.replace('-',' ')}</span>
                ))}
              </div>
            </div>

            {adding && (
              <div className="border border-kerala-green/20 rounded-xl p-4 space-y-3 bg-kerala-green/5">
                <p className="text-sm font-semibold text-kerala-deep">Add to {activeRole.label}</p>
                <div className="flex gap-2">
                  <input value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="user@email.com"
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30" />
                  <button onClick={addMember} className="bg-kerala-green text-white px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90">Add</button>
                  <button onClick={() => setAdding(false)} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold">Cancel</button>
                </div>
              </div>
            )}

            {/* Members list */}
            {loading ? <div className="flex justify-center py-4"><Loader2 size={20} className="animate-spin text-kerala-green" /></div> : (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-500">Members ({teamMembers.filter(m => m.role === activeRole.key).length})</p>
                {teamMembers.filter(m => m.role === activeRole.key).length === 0 ? (
                  <p className="text-xs text-gray-400 py-2">{activeRole.key === 'super_admin' ? 'You are the super admin.' : 'No members in this role yet.'}</p>
                ) : teamMembers.filter(m => m.role === activeRole.key).map(m => (
                  <div key={m.id} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                    <div>
                      <p className="font-semibold text-sm text-kerala-deep">{(m.profiles as any)?.full_name || '—'}</p>
                      <p className="text-xs text-gray-400">{(m.profiles as any)?.email}</p>
                    </div>
                    <button onClick={() => removeMember(m.id)} className="text-xs bg-red-50 text-red-600 px-2.5 py-1.5 rounded-lg hover:bg-red-100 font-medium">Remove</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-blue-800">
        <p className="font-semibold mb-1">Setup required</p>
        <code className="block bg-blue-100 rounded p-2 mt-1 font-mono whitespace-pre">{`CREATE TABLE IF NOT EXISTS team_members (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'listing_manager',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth team members" ON team_members FOR ALL TO authenticated USING (true);`}</code>
      </div>
    </div>
  )
}

// ── Section: Reports ───────────────────────────────────────────────────────
function AdminReportsSection() {
  const [data,    setData]    = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [tab,     setTab]     = useState<'overview'|'listings'|'users'|'revenue'>('overview')

  useEffect(() => {
    async function load() {
      const [listRes, userRes, reviewRes, leadRes, payRes] = await Promise.all([
        supabase.from('listings').select('id, status, plan, emirate, is_featured, is_verified, views_count, created_at'),
        supabase.from('profiles').select('id, is_business_owner, is_professional, created_at'),
        supabase.from('reviews').select('id, rating, created_at'),
        supabase.from('leads').select('id, type, created_at'),
        supabase.from('payments').select('id, amount, status, created_at'),
      ])
      setData({
        listings: listRes.data ?? [],
        users:    userRes.data ?? [],
        reviews:  reviewRes.data ?? [],
        leads:    leadRes.data ?? [],
        payments: payRes.data ?? [],
      })
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div className="flex justify-center py-20"><Loader2 size={28} className="animate-spin text-kerala-green" /></div>

  const now  = new Date()
  const d30  = new Date(now.getTime() - 30 * 86400000)
  const d7   = new Date(now.getTime() -  7 * 86400000)

  const listings  = data.listings  as any[]
  const users     = data.users     as any[]
  const reviews   = data.reviews   as any[]
  const leads     = data.leads     as any[]
  const payments  = data.payments  as any[]

  const newLast30  = (arr: any[]) => arr.filter(r => new Date(r.created_at) > d30).length
  const newLast7   = (arr: any[]) => arr.filter(r => new Date(r.created_at) > d7).length

  const byEmirate = listings.reduce((acc: any, l) => { acc[l.emirate ?? 'Unknown'] = (acc[l.emirate ?? 'Unknown'] ?? 0) + 1; return acc }, {})
  const topEmirs  = Object.entries(byEmirate).sort((a: any, b: any) => b[1] - a[1]).slice(0, 6)

  const byPlan    = listings.reduce((acc: any, l) => { acc[l.plan ?? 'free'] = (acc[l.plan ?? 'free'] ?? 0) + 1; return acc }, {})
  const totalRev  = payments.filter(p => p.status === 'paid').reduce((s: number, p: any) => s + (p.amount ?? 0), 0)
  const revLast30 = payments.filter(p => p.status === 'paid' && new Date(p.created_at) > d30).reduce((s: number, p: any) => s + (p.amount ?? 0), 0)

  const noPhoto = listings.filter(l => !l.logo_url).length
  const inactive = listings.filter(l => l.status !== 'active').length

  const StatCard = ({ label, value, sub, color = 'text-kerala-deep' }: any) => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-2xl font-bold font-serif ${color}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  )

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-serif font-bold text-2xl text-kerala-deep">Reports & Analytics</h2>
        <button onClick={() => exportCSV(listings, 'listings-report.csv')} className="text-sm font-semibold bg-gray-100 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-200">↓ Export Listings CSV</button>
      </div>

      <div className="flex gap-2">
        {(['overview','listings','users','revenue'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize ${tab === t ? 'bg-kerala-deep text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard label="Total Listings"   value={listings.length}                  sub={`+${newLast30(listings)} this month`} />
            <StatCard label="Active Listings"  value={listings.filter(l => l.status === 'active').length} color="text-green-600" />
            <StatCard label="Total Users"      value={users.length}                     sub={`+${newLast7(users)} this week`} />
            <StatCard label="Total Reviews"    value={reviews.length}                   sub={`+${newLast30(reviews)} this month`} />
            <StatCard label="Total Leads"      value={leads.length}                     sub={`+${newLast30(leads)} this month`} color="text-blue-600" />
            <StatCard label="Revenue (total)"  value={`AED ${totalRev.toLocaleString()}`}  sub={`AED ${revLast30.toLocaleString()} last 30d`} color="text-kerala-green" />
            <StatCard label="No Logo/Photo"    value={noPhoto}                          sub="listings missing logo" color="text-orange-500" />
            <StatCard label="Inactive Listings" value={inactive}                        sub="pending/suspended/expired" color="text-red-500" />
          </div>
        </div>
      )}

      {tab === 'listings' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="font-semibold text-kerala-deep mb-4">By Emirate</p>
            <div className="space-y-2.5">
              {topEmirs.map(([em, count]: any) => (
                <div key={em} className="flex items-center gap-3">
                  <span className="text-xs text-gray-600 w-28 shrink-0">{em}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div className="bg-kerala-green h-2 rounded-full" style={{ width: `${(count / listings.length) * 100}%` }} />
                  </div>
                  <span className="text-xs font-bold text-gray-700 w-8 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="font-semibold text-kerala-deep mb-4">By Plan</p>
            <div className="space-y-2.5">
              {Object.entries(byPlan).map(([plan, count]: any) => (
                <div key={plan} className="flex items-center gap-3">
                  <span className="text-xs text-gray-600 w-20 shrink-0 capitalize">{plan}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div className="bg-kerala-gold h-2 rounded-full" style={{ width: `${(count / listings.length) * 100}%` }} />
                  </div>
                  <span className="text-xs font-bold text-gray-700 w-8 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:col-span-2">
            <p className="font-semibold text-kerala-deep mb-3">Quality Issues</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'No logo',        count: listings.filter(l => !l.logo_url).length,    color: 'text-orange-500' },
                { label: 'Not verified',   count: listings.filter(l => !l.is_verified).length, color: 'text-red-500'    },
                { label: 'Not featured',   count: listings.filter(l => !l.is_featured).length, color: 'text-gray-500'   },
                { label: 'Pending',        count: listings.filter(l => l.status === 'pending').length, color: 'text-amber-600' },
              ].map(q => (
                <div key={q.label} className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className={`text-2xl font-bold font-serif ${q.color}`}>{q.count}</p>
                  <p className="text-xs text-gray-500 mt-1">{q.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'users' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="font-semibold text-kerala-deep mb-4">User Breakdown</p>
            <div className="space-y-3">
              {[
                { label: 'Total Users',       count: users.length,                                        color: 'bg-kerala-green' },
                { label: 'Business Owners',   count: users.filter(u => u.is_business_owner).length,       color: 'bg-kerala-gold'  },
                { label: 'Professionals',     count: users.filter(u => u.is_professional).length,         color: 'bg-blue-500'     },
                { label: 'New this month',    count: newLast30(users),                                    color: 'bg-green-400'    },
                { label: 'New this week',     count: newLast7(users),                                     color: 'bg-purple-400'   },
              ].map(u => (
                <div key={u.label} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full shrink-0 ${u.color}`} />
                  <span className="text-sm text-gray-600 flex-1">{u.label}</span>
                  <span className="text-sm font-bold text-kerala-deep">{u.count}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="font-semibold text-kerala-deep mb-4">Lead Breakdown</p>
            <div className="space-y-3">
              {[
                { label: '💬 WhatsApp',  count: leads.filter(l => l.type === 'whatsapp').length },
                { label: '📞 Calls',     count: leads.filter(l => l.type === 'call').length },
                { label: '🌐 Website',   count: leads.filter(l => l.type === 'website').length },
                { label: '📝 Enquiry',   count: leads.filter(l => l.type === 'enquiry').length },
                { label: '📍 Direction', count: leads.filter(l => l.type === 'direction').length },
              ].map(l => (
                <div key={l.label} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{l.label}</span>
                  <span className="text-sm font-bold text-kerala-deep">{l.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'revenue' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="font-semibold text-kerala-deep mb-4">Payment Summary</p>
            <div className="space-y-3">
              {[
                { label: 'Total Received',   value: `AED ${totalRev.toLocaleString()}`,      color: 'text-green-600' },
                { label: 'Last 30 days',     value: `AED ${revLast30.toLocaleString()}`,     color: 'text-kerala-green' },
                { label: 'Pending',          value: `AED ${payments.filter(p => p.status === 'pending').reduce((s: number, p: any) => s + (p.amount ?? 0), 0).toLocaleString()}`, color: 'text-amber-600' },
                { label: 'Paid invoices',    value: String(payments.filter(p => p.status === 'paid').length),    color: 'text-kerala-deep' },
                { label: 'Failed',           value: String(payments.filter(p => p.status === 'failed').length),  color: 'text-red-500' },
              ].map(r => (
                <div key={r.label} className="flex items-center justify-between py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-600">{r.label}</span>
                  <span className={`text-sm font-bold ${r.color}`}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="font-semibold text-kerala-deep mb-4">Plan Distribution</p>
            <div className="space-y-3">
              {Object.entries(byPlan).sort((a: any, b: any) => b[1] - a[1]).map(([plan, count]: any) => (
                <div key={plan} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 capitalize w-20 shrink-0">{plan}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-3">
                    <div className="bg-kerala-gold h-3 rounded-full transition-all" style={{ width: `${(count / listings.length) * 100}%` }} />
                  </div>
                  <span className="text-sm font-bold text-kerala-deep w-10 text-right">{count}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">Premium conversion: <span className="font-bold text-kerala-deep">{listings.length > 0 ? ((listings.filter(l => l.plan !== 'free').length / listings.length) * 100).toFixed(1) : 0}%</span></p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Nav Config ──────────────────────────────────────────────────────────────
const adminNavItems: { key: AdminSection; icon: React.ElementType; label: string }[] = [
  { key: 'dashboard',    icon: LayoutDashboard, label: 'Dashboard'      },
  { key: 'listings',     icon: Building2,       label: 'Listings'       },
  { key: 'approvals',    icon: ClipboardCheck,  label: 'Approvals'      },
  { key: 'claims',       icon: FileSearch,      label: 'Claims'         },
  { key: 'users',        icon: Users,           label: 'Users'          },
  { key: 'categories',   icon: Tag,             label: 'Categories'     },
  { key: 'locations',    icon: MapPin,          label: 'Locations'      },
  { key: 'packages',     icon: Package,         label: 'Packages'       },
  { key: 'payments',     icon: CreditCard,      label: 'Payments'       },
  { key: 'offers',       icon: Gift,            label: 'Offers'         },
  { key: 'leads',        icon: BarChart2,       label: 'Leads'          },
  { key: 'bulk-upload',  icon: Upload,          label: 'Bulk Upload'    },
  { key: 'notifications',icon: Bell,            label: 'Notifications'  },
  { key: 'duplicates',   icon: Copy,            label: 'Duplicates'     },
  { key: 'support',      icon: HeadphonesIcon,  label: 'Support'        },
  { key: 'audit',        icon: ScrollText,      label: 'Audit Log'      },
  { key: 'reviews',      icon: Star,            label: 'Reviews'        },
  { key: 'jobs',         icon: Briefcase,       label: 'Jobs'           },
  { key: 'classifieds',  icon: ShoppingBag,     label: 'Classifieds'    },
  { key: 'events',       icon: Calendar,        label: 'Events'         },
  { key: 'businessmen',  icon: UserCheck,       label: 'Businessmen'    },
  { key: 'professionals',icon: Shield,          label: 'Professionals'  },
  { key: 'media',        icon: Tv,              label: 'Media'          },
  { key: 'community',    icon: BookOpen,        label: 'Community'      },
  { key: 'shop',         icon: ShoppingBag,     label: 'Shop'           },
  { key: 'business-meet',icon: Ticket,          label: 'Business Meet'  },
  { key: 'ads',          icon: Megaphone,       label: 'Ads'            },
  { key: 'blog',         icon: FileText,        label: 'Blog'           },
  { key: 'seo',          icon: Search,          label: 'SEO'            },
  { key: 'roles',        icon: Lock,            label: 'Roles'          },
  { key: 'reports',      icon: PieChart,        label: 'Reports'        },
  { key: 'settings',     icon: Settings,        label: 'Settings'       },
]

// ── Main Admin Component ────────────────────────────────────────────────────
export default function AdminPage() {
  const locale                             = useLocale()
  const router                             = useRouter()
  const { signOut } = useAuth()
  const [activeSection, setActiveSection]  = useState<AdminSection>('dashboard')
  const [sidebarOpen,  setSidebarOpen]     = useState(false)
  const [stats,        setStats]           = useState<AdminStats>(null)
  const [checking,     setChecking]        = useState(true)
  const [isAdmin,      setIsAdmin]         = useState(false)
  const [adminName,    setAdminName]       = useState('Admin')

  useEffect(() => {
    async function check() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.replace(`/auth`); return }
      const { data: profile } = await supabase.from('profiles').select('is_admin, full_name, email').eq('id', session.user.id).single()
      if (!profile?.is_admin) { router.replace(`/`); return }
      setAdminName(profile.full_name || profile.email || session.user.email || 'Admin')
      setIsAdmin(true)
      adminGetStats().then(setStats)
      setChecking(false)
    }
    check()
  }, [locale, router])

  if (checking) {
    return (
      <div className="min-h-screen bg-kerala-cream flex items-center justify-center">
        <Loader2 size={36} className="animate-spin text-kerala-green" />
      </div>
    )
  }

  function handleNavClick(key: AdminSection) {
    setActiveSection(key)
    setSidebarOpen(false)
  }


  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo / Title */}
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-kerala-gold/20 border border-kerala-gold/30 flex items-center justify-center flex-shrink-0">
            <Shield size={18} className="text-kerala-gold" />
          </div>
          <div>
            <p className="font-serif font-bold text-white text-sm leading-none">Admin Panel</p>
            <p className="text-white/40 text-xs mt-0.5">MalayaliBusiness</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
          <span className="text-white/50 text-xs truncate">
            Signed in as <strong className="text-white/70">{adminName}</strong>
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {adminNavItems.map(item => (
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
            {item.label}
            {item.key === 'reports' && (
              <span className="ml-auto bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {reportedContent.length}
              </span>
            )}
            {item.key === 'listings' && stats && stats.pendingListings > 0 && (
              <span className="ml-auto bg-amber-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                {stats.pendingListings}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={() => signOut()}
          className="w-full flex items-center gap-2 text-white/50 hover:text-white text-sm font-medium px-3 py-2.5 rounded-xl hover:bg-white/10 transition-all"
        >
          <LogOut size={16} />
          Sign Out
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

        {/* Mobile sidebar */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-40 flex">
            <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <div className="relative z-50 w-72 bg-kerala-deep h-full overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <span className="font-serif font-bold text-white">Admin Panel</span>
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
                className="lg:hidden p-3 rounded-xl border border-gray-200 text-gray-500 hover:text-kerala-green"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu size={18} />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-serif font-bold text-lg text-kerala-deep leading-none">
                    {adminNavItems.find(n => n.key === activeSection)?.label}
                  </h1>
                  <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">ADMIN</span>
                </div>
                <p className="text-gray-400 text-xs">MalayaliBusiness Platform · Super Admin</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="relative p-2.5 rounded-xl border border-gray-200 bg-white text-gray-500 hover:text-kerala-green transition-colors">
                <Bell size={17} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <button className="hidden sm:flex items-center gap-2 text-xs font-semibold text-gray-500 border border-gray-200 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors">
                <ChevronRight size={14} />
                Quick Actions
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 lg:p-8">
            {activeSection === 'dashboard'     && <AdminDashboardSection stats={stats} />}
            {activeSection === 'listings'      && <AdminListingsSection />}
            {activeSection === 'approvals'     && <AdminApprovalsSection />}
            {activeSection === 'claims'        && <AdminClaimsSection />}
            {activeSection === 'users'         && <AdminUsersSection />}
            {activeSection === 'categories'    && <AdminCategoriesSection />}
            {activeSection === 'locations'     && <AdminLocationsSection />}
            {activeSection === 'packages'      && <AdminPackagesSection />}
            {activeSection === 'payments'      && <AdminPaymentsSection />}
            {activeSection === 'offers'        && <AdminOffersSection />}
            {activeSection === 'leads'         && <AdminLeadsSection />}
            {activeSection === 'bulk-upload'   && <AdminBulkUploadSection />}
            {activeSection === 'notifications' && <AdminNotificationsSection />}
            {activeSection === 'duplicates'    && <AdminDuplicatesSection />}
            {activeSection === 'support'       && <AdminSupportSection />}
            {activeSection === 'audit'         && <AdminAuditSection />}
            {activeSection === 'reviews'       && <AdminReviewsSection />}
            {activeSection === 'jobs'          && <AdminJobsSection />}
            {activeSection === 'classifieds'   && <AdminClassifiedsSection />}
            {activeSection === 'events'        && <AdminEventsSection />}
            {activeSection === 'businessmen'   && <GenericSection title="Business Owners" table="profiles" columns={['full_name','email','phone','is_verified','preferred_locale','created_at']} whereCol="is_business_owner" whereVal={true} />}
            {activeSection === 'professionals' && <GenericSection title="Professionals" table="profiles" columns={['full_name','email','phone','is_verified','preferred_locale','created_at']} whereCol="is_professional" whereVal={true} />}
            {activeSection === 'media'         && <GenericSection title="Media" table="media_posts" columns={['title','category','status','created_at']} statusCol="status" />}
            {activeSection === 'community'     && <GenericSection title="Community Posts" table="community_posts" columns={['title','category','status','created_at']} statusCol="status" />}
            {activeSection === 'shop'          && <AdminShopSection />}
            {activeSection === 'business-meet' && <BusinessMeetSection />}
            {activeSection === 'ads'           && <AdminAdsSection />}
            {activeSection === 'blog'          && <AdminBlogSection />}
            {activeSection === 'seo'           && <AdminSEOSection />}
            {activeSection === 'roles'         && <AdminRolesSection />}
            {activeSection === 'reports'       && <AdminReportsSection />}
            {activeSection === 'settings'      && <AdminSettingsSection />}
          </div>
        </main>
      </div>
    </div>
  )
}
