'use client'

import { useState } from 'react'
import { useLocale } from 'next-intl'
import { ChevronDown, ChevronUp, X, SlidersHorizontal } from 'lucide-react'
import { categories, emirates } from '@/lib/mock-businesses'
import type { FilterState } from '@/types/business'

type Props = {
  filters: FilterState
  onChange: (patch: Partial<FilterState>) => void
  onReset: () => void
  mobileOpen: boolean
  onMobileClose: () => void
  categoryCounts?: Record<string, number>
  emirateCounts?: Record<string, number>
}

function Panel({
  title, children, defaultOpen = true,
}: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-gray-100 pb-4 mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-1 text-sm font-semibold text-kerala-deep hover:text-kerala-green transition-colors"
      >
        {title}
        {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  )
}

export default function FiltersSidebar({ filters, onChange, onReset, mobileOpen, onMobileClose, categoryCounts, emirateCounts }: Props) {
  const locale = useLocale()
  const isMl = locale === 'ml'

  const activeCount = [
    filters.category,
    filters.emirate,
    filters.rating,
    filters.verified,
    filters.open,
  ].filter(Boolean).length

  const content = (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-kerala-green" />
          <span className="font-semibold text-sm text-kerala-deep">
            {isMl ? 'ഫിൽട്ടറുകൾ' : 'Filters'}
          </span>
          {activeCount > 0 && (
            <span className="bg-kerala-green text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeCount > 0 && (
            <button
              onClick={onReset}
              className="text-xs text-kerala-red hover:text-red-700 font-medium transition-colors"
            >
              {isMl ? 'മായ്ക്കൂ' : 'Clear all'}
            </button>
          )}
          <button
            onClick={onMobileClose}
            className="lg:hidden p-1 text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="px-5 py-4 max-h-[calc(100vh-160px)] overflow-y-auto">
        {/* Category */}
        <Panel title={isMl ? 'വിഭാഗം' : 'Category'}>
          <div className="space-y-1.5">
            <button
              onClick={() => onChange({ category: '' })}
              className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                !filters.category
                  ? 'bg-kerala-green text-white font-semibold'
                  : 'text-gray-600 hover:bg-kerala-cream hover:text-kerala-deep'
              }`}
            >
              {isMl ? 'എല്ലാ വിഭാഗങ്ങളും' : 'All Categories'}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => onChange({ category: cat.slug })}
                className={`w-full flex items-center justify-between text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                  filters.category === cat.slug
                    ? 'bg-kerala-green text-white font-semibold'
                    : 'text-gray-600 hover:bg-kerala-cream hover:text-kerala-deep'
                }`}
              >
                <span>{isMl ? cat.nameMl : cat.name}</span>
                <span className={`text-xs ${filters.category === cat.slug ? 'text-white/70' : 'text-gray-400'}`}>
                  {(categoryCounts?.[cat.slug] ?? 0).toLocaleString()}
                </span>
              </button>
            ))}
          </div>
        </Panel>

        {/* Emirate */}
        <Panel title={isMl ? 'എമിറേറ്റ്' : 'Emirate'}>
          <div className="space-y-1.5">
            <button
              onClick={() => onChange({ emirate: '' })}
              className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                !filters.emirate
                  ? 'bg-kerala-green text-white font-semibold'
                  : 'text-gray-600 hover:bg-kerala-cream hover:text-kerala-deep'
              }`}
            >
              {isMl ? 'എല്ലാ എമിറേറ്റുകളും' : 'All Emirates'}
            </button>
            {emirates.map((em) => (
              <button
                key={em.slug}
                onClick={() => onChange({ emirate: em.slug })}
                className={`w-full flex items-center justify-between text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                  filters.emirate === em.slug
                    ? 'bg-kerala-green text-white font-semibold'
                    : 'text-gray-600 hover:bg-kerala-cream hover:text-kerala-deep'
                }`}
              >
                <span>{isMl ? em.nameMl : em.name}</span>
                <span className={`text-xs ${filters.emirate === em.slug ? 'text-white/70' : 'text-gray-400'}`}>
                  {(emirateCounts?.[em.slug] ?? 0).toLocaleString()}
                </span>
              </button>
            ))}
          </div>
        </Panel>

        {/* Rating */}
        <Panel title={isMl ? 'മിനിമം റേറ്റിംഗ്' : 'Minimum Rating'}>
          <div className="space-y-1.5">
            {[null, 4.5, 4.0, 3.5, 3.0].map((r) => (
              <button
                key={String(r)}
                onClick={() => onChange({ rating: r })}
                className={`w-full flex items-center gap-2 text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                  filters.rating === r
                    ? 'bg-kerala-green text-white font-semibold'
                    : 'text-gray-600 hover:bg-kerala-cream hover:text-kerala-deep'
                }`}
              >
                {r === null ? (
                  <span>{isMl ? 'ഏതും' : 'Any rating'}</span>
                ) : (
                  <>
                    <span className="flex">
                      {[1,2,3,4,5].map((i) => (
                        <svg key={i} className={`w-3.5 h-3.5 ${i <= Math.floor(r) ? (filters.rating === r ? 'fill-white text-white' : 'fill-kerala-gold text-kerala-gold') : (filters.rating === r ? 'fill-white/30 text-white/30' : 'fill-gray-200 text-gray-200')}`} viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                      ))}
                    </span>
                    <span>{r}+</span>
                  </>
                )}
              </button>
            ))}
          </div>
        </Panel>

        {/* Price Range */}
        <Panel title={isMl ? 'വിലയുടെ ശ്രേണി' : 'Price Range'}>
          <div className="flex gap-2 flex-wrap">
            {[1, 2, 3, 4].map((p) => (
              <button
                key={p}
                onClick={() => {
                  const next = filters.priceRange.includes(p)
                    ? filters.priceRange.filter((x) => x !== p)
                    : [...filters.priceRange, p]
                  onChange({ priceRange: next })
                }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                  filters.priceRange.includes(p)
                    ? 'bg-kerala-green border-kerala-green text-white'
                    : 'border-gray-200 text-gray-600 hover:border-kerala-green hover:text-kerala-green'
                }`}
              >
                {'AED '.padEnd(4) + '₹'.repeat(p)}
              </button>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-4 text-center text-xs text-gray-400">
            <span>{isMl ? 'ചെലവ് കുറഞ്ഞ' : 'Budget'}</span>
            <span></span>
            <span></span>
            <span>{isMl ? 'ചെലവ് കൂടിയ' : 'Premium'}</span>
          </div>
        </Panel>

        {/* Options */}
        <Panel title={isMl ? 'മറ്റ് ഓപ്ഷനുകൾ' : 'More Options'} defaultOpen={false}>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div
                onClick={() => onChange({ verified: !filters.verified })}
                className={`w-10 h-5 rounded-full relative transition-colors ${filters.verified ? 'bg-kerala-green' : 'bg-gray-200'}`}
              >
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${filters.verified ? 'left-5' : 'left-0.5'}`} />
              </div>
              <span className="text-sm text-gray-700 group-hover:text-kerala-deep">
                {isMl ? 'വെരിഫൈഡ് ബിസിനസ് മാത്രം' : 'Verified businesses only'}
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <div
                onClick={() => onChange({ open: !filters.open })}
                className={`w-10 h-5 rounded-full relative transition-colors ${filters.open ? 'bg-kerala-green' : 'bg-gray-200'}`}
              >
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${filters.open ? 'left-5' : 'left-0.5'}`} />
              </div>
              <span className="text-sm text-gray-700 group-hover:text-kerala-deep">
                {isMl ? 'ഇപ്പോൾ തുറന്നിരിക്കുന്നത്' : 'Open now'}
              </span>
            </label>
          </div>
        </Panel>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 xl:w-72 flex-shrink-0 sticky top-24 self-start">
        {content}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={onMobileClose} />
          <div className="relative ml-auto w-80 max-w-full h-full bg-white overflow-y-auto p-4 shadow-2xl">
            {content}
          </div>
        </div>
      )}
    </>
  )
}
