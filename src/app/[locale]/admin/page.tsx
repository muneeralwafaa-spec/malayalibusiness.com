'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import Navbar from '@/components/layout/Navbar'
import { useAuth } from '@/context/AuthContext'
import { adminGetListings, adminGetStats, adminGetUsers, adminUpdateListingStatus } from '@/lib/auth'
import {
  LayoutDashboard, Building2, Users, Megaphone, Flag, Settings,
  TrendingUp, CheckCircle, XCircle, Eye, Menu, X, Shield,
  AlertTriangle, ToggleLeft, ToggleRight, ChevronRight,
  ArrowUpRight, Bell, LogOut, Loader2,
} from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────────────
type AdminSection = 'dashboard' | 'listings' | 'users' | 'ads' | 'reports' | 'settings'

type AdminStats = {
  totalListings:   number
  activeListings:  number
  pendingListings: number
  totalUsers:      number
  totalReviews:    number
  premiumListings: number
} | null

// ── Static / Mock Data (analytics, ads, reports — no DB tables yet) ────────
const recentSignups = [
  { name: 'Aisha Mohammed', email: 'aisha@email.ae', date: '18 May 2026', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=60&q=80' },
  { name: 'Rajan Thomas', email: 'rajan@email.ae', date: '17 May 2026', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&q=80' },
  { name: 'Mohammed Al Farsi', email: 'm.farsi@email.ae', date: '17 May 2026', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&q=80' },
  { name: 'Priya Krishnan', email: 'priya@email.ae', date: '16 May 2026', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=60&q=80' },
  { name: 'James Thompson', email: 'james@email.ae', date: '16 May 2026', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&q=80' },
]

const monthlyRevenue = [
  { month: 'Jun', rev: 82000 },
  { month: 'Jul', rev: 91000 },
  { month: 'Aug', rev: 88000 },
  { month: 'Sep', rev: 95000 },
  { month: 'Oct', rev: 102000 },
  { month: 'Nov', rev: 115000 },
  { month: 'Dec', rev: 118000 },
  { month: 'Jan', rev: 108000 },
  { month: 'Feb', rev: 112000 },
  { month: 'Mar', rev: 119000 },
  { month: 'Apr', rev: 122000 },
  { month: 'May', rev: 124800 },
]
const maxRev = Math.max(...monthlyRevenue.map(d => d.rev))

const topCategories = [
  { name: 'Restaurants & Food', count: 3240 },
  { name: 'Real Estate', count: 2180 },
  { name: 'Healthcare', count: 1920 },
  { name: 'Retail & Shopping', count: 1640 },
  { name: 'Services', count: 1380 },
  { name: 'Education', count: 980 },
]
const maxCatCount = Math.max(...topCategories.map(c => c.count))

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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif font-bold text-2xl text-kerala-deep">Platform Dashboard</h2>
        <p className="text-gray-500 text-sm mt-1">MalayaliBusiness Admin · Live data</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStatCard icon={Building2}     label="Total Listings"     value={v(stats?.totalListings)}   color="text-kerala-green"  bg="bg-kerala-green/10" />
        <AdminStatCard icon={Users}         label="Total Users"        value={v(stats?.totalUsers)}      color="text-blue-600"      bg="bg-blue-50" />
        <AdminStatCard icon={TrendingUp}    label="Premium Listings"   value={v(stats?.premiumListings)} color="text-kerala-gold"   bg="bg-kerala-gold/10" />
        <AdminStatCard icon={AlertTriangle} label="Pending Approvals"  value={stats ? String(stats.pendingListings) : '—'} color="text-amber-600" bg="bg-amber-50" />
      </div>

      {/* Revenue chart + Top categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Revenue bar chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-serif font-bold text-kerala-deep">Revenue – Last 12 Months</h3>
            <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">AED 124,800 this month</span>
          </div>
          <div className="flex items-end gap-1.5" style={{ height: '120px' }}>
            {monthlyRevenue.map(d => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full relative" style={{ height: '96px' }}>
                  <div
                    className="absolute bottom-0 w-full bg-kerala-green rounded-t-lg hover:bg-kerala-gold transition-colors cursor-pointer"
                    style={{ height: `${Math.round((d.rev / maxRev) * 96)}px` }}
                    title={`AED ${d.rev.toLocaleString()}`}
                  />
                </div>
                <span className="text-xs text-gray-400" style={{ fontSize: '9px' }}>{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top categories */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-serif font-bold text-kerala-deep mb-4">Top Categories</h3>
          <div className="space-y-3">
            {topCategories.map(c => (
              <div key={c.name}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600 truncate mr-2">{c.name}</span>
                  <span className="font-semibold text-kerala-deep flex-shrink-0">{c.count.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-kerala-green rounded-full" style={{ width: `${(c.count / maxCatCount) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent signups */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif font-bold text-kerala-deep">Recent Signups</h3>
          <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
            {stats ? `${stats.totalUsers.toLocaleString()} total users` : '—'}
          </span>
        </div>
        <div className="space-y-3">
          {recentSignups.map(u => (
            <div key={u.email} className="flex items-center gap-3 py-1">
              <div className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
                <Image src={u.avatar} alt={u.name} fill className="object-cover" sizes="36px" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-kerala-deep">{u.name}</p>
                <p className="text-xs text-gray-400">{u.email}</p>
              </div>
              <span className="text-xs text-gray-400 flex-shrink-0">{u.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Section: Listings ─────────────────────────────────────────────────────
function AdminListingsSection() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [pendingListings, setPendingListings] = useState<any[]>([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [allListings, setAllListings] = useState<any[]>([])
  const [loadingData, setLoadingData]   = useState(true)
  const [approvedIds, setApprovedIds]   = useState<string[]>([])
  const [rejectedIds, setRejectedIds]   = useState<string[]>([])
  const [listingFilter, setListingFilter] = useState<'all' | 'active' | 'pending' | 'suspended'>('all')

  useEffect(() => {
    Promise.all([
      adminGetListings('pending', 20),
      adminGetListings(undefined, 50),
    ]).then(([pending, all]) => {
      setPendingListings(pending)
      setAllListings(all)
      setLoadingData(false)
    })
  }, [])

  async function handleApprove(id: string) {
    const ok = await adminUpdateListingStatus(id, 'active')
    if (ok) setApprovedIds(prev => [...prev, id])
  }

  async function handleReject(id: string) {
    const ok = await adminUpdateListingStatus(id, 'suspended')
    if (ok) setRejectedIds(prev => [...prev, id])
  }

  const planColors: Record<string, string> = {
    premium: 'bg-kerala-gold/15 text-kerala-gold',
    elite:   'bg-kerala-gold/15 text-kerala-gold',
    standard: 'bg-blue-100 text-blue-600',
    basic:   'bg-gray-100 text-gray-500',
  }
  const statusColors: Record<string, string> = {
    active:    'bg-green-100 text-green-700',
    pending:   'bg-amber-100 text-amber-600',
    suspended: 'bg-red-100 text-red-600',
  }

  const filteredListings = listingFilter === 'all'
    ? allListings
    : allListings.filter((l: any) => l.status === listingFilter)

  if (loadingData) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={28} className="animate-spin text-kerala-green" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif font-bold text-2xl text-kerala-deep">Listings Management</h2>
      </div>

      {/* Approval queue */}
      <div className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-amber-100 flex items-center gap-3 bg-amber-50">
          <AlertTriangle size={16} className="text-amber-500" />
          <h3 className="font-serif font-bold text-kerala-deep">Approval Queue</h3>
          <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-0.5 rounded-full ml-auto">
            {pendingListings.filter((l: any) => !approvedIds.includes(l.id) && !rejectedIds.includes(l.id)).length} pending
          </span>
        </div>
        {pendingListings.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">No listings pending approval.</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {pendingListings.map((l: any) => (
              <div
                key={l.id}
                className={`flex flex-wrap gap-3 items-center p-4 transition-opacity ${
                  approvedIds.includes(l.id) || rejectedIds.includes(l.id) ? 'opacity-50' : ''
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-kerala-deep text-sm">{l.name}</span>
                    <span className="font-mono text-xs text-gray-400">{l.id.slice(0, 8)}</span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                    {l.profiles?.full_name && <span>By: {l.profiles.full_name}</span>}
                    {l.categories?.name   && <span>{l.categories.name}</span>}
                    {l.emirate            && <span>{l.emirate}</span>}
                    <span>{fmtDate(l.created_at)}</span>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {approvedIds.includes(l.id) ? (
                    <span className="text-xs font-semibold text-green-600 flex items-center gap-1"><CheckCircle size={13} /> Approved</span>
                  ) : rejectedIds.includes(l.id) ? (
                    <span className="text-xs font-semibold text-red-500 flex items-center gap-1"><XCircle size={13} /> Rejected</span>
                  ) : (
                    <>
                      <button
                        onClick={() => handleApprove(l.id)}
                        className="flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-100 border border-green-200 px-3 py-1.5 rounded-lg hover:bg-green-200 transition-colors"
                      >
                        <CheckCircle size={13} /> Approve
                      </button>
                      <button
                        onClick={() => handleReject(l.id)}
                        className="flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <XCircle size={13} /> Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* All listings */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-wrap gap-3 items-center justify-between">
          <h3 className="font-serif font-bold text-kerala-deep">All Listings</h3>
          <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
            {(['all', 'active', 'pending', 'suspended'] as const).map(f => (
              <button
                key={f}
                onClick={() => setListingFilter(f)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-all ${
                  listingFilter === f ? 'bg-white text-kerala-deep shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          {filteredListings.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">No listings found.</div>
          ) : (
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {['ID', 'Listing Name', 'Owner', 'Plan', 'Status', 'Rating', 'Created', ''].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-500 px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredListings.map((l: any) => (
                  <tr key={l.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-gray-400">{l.id.slice(0, 8)}</td>
                    <td className="px-4 py-3 font-semibold text-sm text-kerala-deep">{l.name}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">{l.profiles?.full_name ?? l.profiles?.email ?? '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${planColors[l.plan] ?? 'bg-gray-100 text-gray-500'}`}>
                        {capitalize(l.plan)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[l.status] ?? 'bg-gray-100 text-gray-500'}`}>
                        {capitalize(l.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">
                      {l.rating_avg > 0 ? `${Number(l.rating_avg).toFixed(1)} ★` : '—'}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">{fmtDate(l.created_at)}</td>
                    <td className="px-4 py-3">
                      <button className="text-xs text-kerala-green font-semibold hover:underline flex items-center gap-0.5">
                        <Eye size={12} /> View
                      </button>
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

// ── Section: Users ────────────────────────────────────────────────────────
function AdminUsersSection() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [users, setUsers]     = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [suspended, setSuspended] = useState<string[]>([])

  useEffect(() => {
    adminGetUsers(50).then(data => { setUsers(data); setLoading(false) })
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={28} className="animate-spin text-kerala-green" />
      </div>
    )
  }

  const roleLabel = (u: any) => {
    if (u.is_admin)           return { label: 'Admin',    cls: 'bg-red-100 text-red-600' }
    if (u.is_business_owner)  return { label: 'Business', cls: 'bg-kerala-gold/15 text-kerala-gold' }
    return                           { label: 'User',     cls: 'bg-gray-100 text-gray-500' }
  }

  return (
    <div className="space-y-5">
      <h2 className="font-serif font-bold text-2xl text-kerala-deep">User Management</h2>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {users.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">No users found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px]">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {['User', 'Email', 'Role', 'Locale', 'Joined', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-500 px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((u: any) => {
                  const isSuspended = suspended.includes(u.id)
                  const role = roleLabel(u)
                  return (
                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          {u.avatar_url ? (
                            <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                              <Image src={u.avatar_url} alt={u.full_name ?? ''} fill className="object-cover" sizes="32px" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-kerala-green/10 flex items-center justify-center flex-shrink-0 text-xs font-bold text-kerala-green">
                              {(u.full_name ?? u.email ?? '?')[0].toUpperCase()}
                            </div>
                          )}
                          <span className="font-semibold text-sm text-kerala-deep whitespace-nowrap">
                            {u.full_name ?? '—'}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${role.cls}`}>{role.label}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400 uppercase">{u.preferred_locale ?? 'en'}</td>
                      <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{fmtDate(u.created_at)}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          isSuspended ? 'bg-red-100 text-red-600' : u.is_verified ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {isSuspended ? 'Suspended' : u.is_verified ? 'Verified' : 'Unverified'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSuspended(prev =>
                              isSuspended ? prev.filter(id => id !== u.id) : [...prev, u.id]
                            )}
                            className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors ${
                              isSuspended
                                ? 'bg-green-50 text-green-600 border border-green-200 hover:bg-green-100'
                                : 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
                            }`}
                          >
                            {isSuspended ? <ToggleRight size={12} /> : <ToggleLeft size={12} />}
                            {isSuspended ? 'Activate' : 'Suspend'}
                          </button>
                          <button className="text-xs text-kerala-green font-semibold hover:underline">Profile</button>
                        </div>
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

// ── Section: Ads ──────────────────────────────────────────────────────────
function AdminAdsSection() {
  return (
    <div className="space-y-5">
      <h2 className="font-serif font-bold text-2xl text-kerala-deep">Ad Slots</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {adSlots.map(ad => (
          <div key={ad.slot} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-serif font-semibold text-kerala-deep">{ad.slot}</h4>
                <p className="text-xs text-gray-500 mt-0.5">{ad.advertiser !== '—' ? `Advertiser: ${ad.advertiser}` : 'No advertiser'}</p>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${
                ad.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
              }`}>
                {ad.status}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm mb-4">
              <div>
                <span className="text-xs text-gray-500">Price</span>
                <p className="font-bold text-kerala-deep">AED {ad.price}<span className="text-xs font-normal text-gray-400">/month</span></p>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-500">Impressions</span>
                <p className="font-bold text-kerala-deep">{ad.impressions > 0 ? ad.impressions.toLocaleString() : '—'}</p>
              </div>
            </div>
            <button className="w-full text-sm font-semibold text-kerala-green border border-kerala-green/30 py-2 rounded-xl hover:bg-kerala-green/5 transition-colors">
              Manage Slot
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Section: Reports ──────────────────────────────────────────────────────
function AdminReportsSection() {
  const [resolved,  setResolved]  = useState<number[]>([])
  const [dismissed, setDismissed] = useState<number[]>([])

  const typeColors: Record<string, string> = {
    Listing: 'bg-blue-100 text-blue-600',
    Review:  'bg-purple-100 text-purple-600',
    Comment: 'bg-orange-100 text-orange-600',
  }

  const active  = reportedContent.filter(r => !resolved.includes(r.id) && !dismissed.includes(r.id))
  const handled = reportedContent.filter(r =>  resolved.includes(r.id) ||  dismissed.includes(r.id))

  return (
    <div className="space-y-5">
      <h2 className="font-serif font-bold text-2xl text-kerala-deep">Reported Content</h2>

      {active.length === 0 && (
        <div className="bg-green-50 border border-green-100 rounded-2xl p-5 text-center text-green-700 text-sm font-medium">
          <CheckCircle size={20} className="mx-auto mb-2" />
          All reports have been handled.
        </div>
      )}

      <div className="space-y-3">
        {active.map(r => (
          <div key={r.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="flex flex-wrap gap-3 items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${typeColors[r.type]}`}>{r.type}</span>
                <span className="font-semibold text-sm text-kerala-deep">{r.content}</span>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => setResolved(prev => [...prev, r.id])}
                  className="flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-100 border border-green-200 px-3 py-1.5 rounded-lg hover:bg-green-200 transition-colors"
                >
                  <CheckCircle size={13} /> Resolve
                </button>
                <button
                  onClick={() => setDismissed(prev => [...prev, r.id])}
                  className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <XCircle size={13} /> Dismiss
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-gray-500">
              <span>Reported by: <strong className="text-gray-700">{r.reportedBy}</strong></span>
              <span>{r.date}</span>
              <span className="text-red-500 font-medium">{r.reason}</span>
            </div>
          </div>
        ))}
      </div>

      {handled.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Handled</p>
          {handled.map(r => (
            <div key={r.id} className="bg-gray-50 rounded-xl border border-gray-100 p-3 flex items-center gap-3 opacity-60">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${typeColors[r.type]}`}>{r.type}</span>
              <span className="text-xs text-gray-500 flex-1 truncate">{r.content}</span>
              <span className={`text-xs font-semibold ${resolved.includes(r.id) ? 'text-green-600' : 'text-gray-400'}`}>
                {resolved.includes(r.id) ? 'Resolved' : 'Dismissed'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Section: Settings ─────────────────────────────────────────────────────
function AdminSettingsSection() {
  const [maintenance, setMaintenance] = useState(false)

  return (
    <div className="space-y-5 max-w-2xl">
      <h2 className="font-serif font-bold text-2xl text-kerala-deep">Platform Settings</h2>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Site Name',              value: 'MalayaliBusiness',      type: 'text'   },
            { label: 'Contact Email',          value: 'admin@malayalibusiness.ae', type: 'email' },
            { label: 'Max Listings Per User',  value: '10',                    type: 'number' },
            { label: 'Support Phone',          value: '+971 4 000 0000',       type: 'tel'    },
          ].map(f => (
            <div key={f.label}>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">{f.label}</label>
              <input
                type={f.type}
                defaultValue={f.value}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 focus:border-kerala-green bg-gray-50"
              />
            </div>
          ))}
        </div>

        {/* Maintenance toggle */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div>
            <p className="font-semibold text-sm text-kerala-deep">Maintenance Mode</p>
            <p className="text-xs text-gray-500 mt-0.5">Show a maintenance page to all visitors</p>
          </div>
          <button
            onClick={() => setMaintenance(!maintenance)}
            className={`relative w-12 h-6 rounded-full transition-colors ${maintenance ? 'bg-kerala-green' : 'bg-gray-300'}`}
          >
            <span
              className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${maintenance ? 'translate-x-7' : 'translate-x-1'}`}
            />
          </button>
        </div>
        {maintenance && (
          <div className="flex items-center gap-2 text-amber-600 bg-amber-50 rounded-xl border border-amber-100 px-4 py-3 text-sm">
            <AlertTriangle size={16} />
            <span>Site is currently in maintenance mode. Visitors will see a maintenance page.</span>
          </div>
        )}

        <button className="bg-kerala-green text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity">
          Save Settings
        </button>
      </div>
    </div>
  )
}

// ── Nav Config ──────────────────────────────────────────────────────────────
const adminNavItems: { key: AdminSection; icon: React.ElementType; label: string }[] = [
  { key: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { key: 'listings',  icon: Building2,       label: 'Listings'  },
  { key: 'users',     icon: Users,           label: 'Users'     },
  { key: 'ads',       icon: Megaphone,       label: 'Ads'       },
  { key: 'reports',   icon: Flag,            label: 'Reports'   },
  { key: 'settings',  icon: Settings,        label: 'Settings'  },
]

// ── Main Admin Component ────────────────────────────────────────────────────
export default function AdminPage() {
  const locale                             = useLocale()
  const router                             = useRouter()
  const { user, profile, loading: authLoading, signOut } = useAuth()
  const [activeSection, setActiveSection]  = useState<AdminSection>('dashboard')
  const [sidebarOpen,  setSidebarOpen]     = useState(false)
  const [stats,        setStats]           = useState<AdminStats>(null)

  // Auth guard: must be logged in AND is_admin
  useEffect(() => {
    if (authLoading) return
    if (!user || !profile?.is_admin) {
      router.replace(`/${locale}/auth`)
    } else {
      adminGetStats().then(setStats)
    }
  }, [authLoading, user, profile, locale, router])

  // Show spinner while auth resolves or access check is pending
  if (authLoading || !profile?.is_admin) {
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

  const adminName = profile.full_name ?? profile.email ?? 'Admin'

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
                className="lg:hidden p-2 rounded-xl border border-gray-200 text-gray-500 hover:text-kerala-green"
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
            {activeSection === 'dashboard' && <AdminDashboardSection stats={stats} />}
            {activeSection === 'listings'  && <AdminListingsSection />}
            {activeSection === 'users'     && <AdminUsersSection />}
            {activeSection === 'ads'       && <AdminAdsSection />}
            {activeSection === 'reports'   && <AdminReportsSection />}
            {activeSection === 'settings'  && <AdminSettingsSection />}
          </div>
        </main>
      </div>
    </div>
  )
}
