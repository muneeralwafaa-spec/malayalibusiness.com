'use client'

import { useLocale } from 'next-intl'
import { X, LayoutGrid, List, ArrowUpDown } from 'lucide-react'
import { categories, emirates } from '@/lib/mock-businesses'
import type { FilterState } from '@/types/business'

type Props = {
  filters: FilterState
  totalResults: number
  onChange: (patch: Partial<FilterState>) => void
  onReset: () => void
}

const sortOptions = [
  { value: 'relevance', label: 'Relevance', labelMl: 'പ്രസക്തി' },
  { value: 'rating', label: 'Top Rated', labelMl: 'ടോപ് റേറ്റഡ്' },
  { value: 'reviews', label: 'Most Reviewed', labelMl: 'ഏറ്റവും കൂടുതൽ റിവ്യൂ' },
  { value: 'newest', label: 'Newest', labelMl: 'പുതിയത്' },
]

export default function ActiveFilters({ filters, totalResults, onChange, onReset }: Props) {
  const locale = useLocale()
  const isMl = locale === 'ml'

  const chips: { label: string; key: keyof FilterState; value?: unknown }[] = []
  if (filters.query) chips.push({ label: `"${filters.query}"`, key: 'query' })
  if (filters.category) {
    const cat = categories.find((c) => c.slug === filters.category)
    if (cat) chips.push({ label: isMl ? cat.nameMl : cat.name, key: 'category' })
  }
  if (filters.emirate) {
    const em = emirates.find((e) => e.slug === filters.emirate)
    if (em) chips.push({ label: isMl ? em.nameMl : em.name, key: 'emirate' })
  }
  if (filters.rating) chips.push({ label: `${filters.rating}+ ★`, key: 'rating' })
  if (filters.verified) chips.push({ label: isMl ? 'വെരിഫൈഡ്' : 'Verified', key: 'verified' })
  if (filters.open) chips.push({ label: isMl ? 'ഇപ്പോൾ തുറന്ന്' : 'Open Now', key: 'open' })

  const removeChip = (key: keyof FilterState) => {
    const defaults: Partial<FilterState> = {
      query: '', category: '', emirate: '', rating: null,
      verified: false, open: false,
    }
    onChange({ [key]: defaults[key] })
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
      {/* Left: Count + Active chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-kerala-deep whitespace-nowrap">
          {totalResults.toLocaleString()} {isMl ? 'ബിസിനസുകൾ' : 'businesses found'}
        </span>
        {chips.map((chip) => (
          <span
            key={chip.key}
            className="inline-flex items-center gap-1.5 bg-kerala-green/10 text-kerala-green text-xs font-semibold pl-3 pr-1.5 py-1 rounded-full border border-kerala-green/20"
          >
            {chip.label}
            <button
              onClick={() => removeChip(chip.key)}
              className="w-4 h-4 rounded-full bg-kerala-green/20 hover:bg-kerala-green hover:text-white flex items-center justify-center transition-colors"
            >
              <X size={9} />
            </button>
          </span>
        ))}
        {chips.length > 1 && (
          <button
            onClick={onReset}
            className="text-xs text-kerala-red hover:text-red-700 font-medium underline"
          >
            {isMl ? 'എല്ലാം മായ്ക്കൂ' : 'Clear all'}
          </button>
        )}
      </div>

      {/* Right: Sort + View toggle */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Sort */}
        <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm">
          <ArrowUpDown size={13} className="text-gray-400" />
          <select
            value={filters.sort}
            onChange={(e) => onChange({ sort: e.target.value as FilterState['sort'] })}
            className="bg-transparent text-gray-700 outline-none text-sm cursor-pointer pr-1"
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {isMl ? o.labelMl : o.label}
              </option>
            ))}
          </select>
        </div>

        {/* View toggle */}
        <div className="flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => onChange({ view: 'grid' })}
            className={`flex items-center justify-center w-9 h-9 transition-colors ${
              filters.view === 'grid'
                ? 'bg-kerala-green text-white'
                : 'text-gray-400 hover:text-kerala-green'
            }`}
            aria-label="Grid view"
          >
            <LayoutGrid size={16} />
          </button>
          <button
            onClick={() => onChange({ view: 'list' })}
            className={`flex items-center justify-center w-9 h-9 transition-colors ${
              filters.view === 'list'
                ? 'bg-kerala-green text-white'
                : 'text-gray-400 hover:text-kerala-green'
            }`}
            aria-label="List view"
          >
            <List size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
