'use client'

import { useState } from 'react'
import { useLocale } from 'next-intl'
import { Search, MapPin, ChevronDown, SlidersHorizontal } from 'lucide-react'
import { categories, emirates } from '@/lib/mock-businesses'
import type { FilterState } from '@/types/business'

type Props = {
  filters: FilterState
  onSearch: (q: string) => void
  onOpenMobileFilters: () => void
  activeFilterCount: number
}

export default function DirectorySearchBar({ filters, onSearch, onOpenMobileFilters, activeFilterCount }: Props) {
  const locale = useLocale()
  const isMl = locale === 'ml'
  const [query, setQuery] = useState(filters.query)
  const [catOpen, setCatOpen] = useState(false)
  const [locOpen, setLocOpen] = useState(false)
  const [selectedCat, setSelectedCat] = useState('')
  const [selectedLoc, setSelectedLoc] = useState('')

  return (
    <div className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="flex-1 flex items-center gap-2 bg-kerala-cream border border-gray-200 hover:border-kerala-green focus-within:border-kerala-green rounded-xl px-4 py-2.5 transition-colors">
            <Search size={16} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSearch(query)}
              placeholder={isMl ? 'ബിസിനസുകൾ, സേവനങ്ങൾ തിരയൂ...' : 'Search businesses, services...'}
              className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
            />
          </div>

          {/* Category dropdown */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => { setCatOpen(!catOpen); setLocOpen(false) }}
              className="flex items-center gap-2 bg-kerala-cream border border-gray-200 hover:border-kerala-green rounded-xl px-3 py-2.5 text-sm text-gray-600 hover:text-kerala-green transition-colors whitespace-nowrap"
            >
              <span className="max-w-[120px] truncate">
                {selectedCat ? categories.find(c => c.slug === selectedCat)?.[isMl ? 'nameMl' : 'name'] : (isMl ? 'വിഭാഗം' : 'Category')}
              </span>
              <ChevronDown size={14} className={`flex-shrink-0 transition-transform ${catOpen ? 'rotate-180' : ''}`} />
            </button>
            {catOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-xl z-50 w-56 py-1 max-h-64 overflow-y-auto">
                <button
                  onClick={() => { setSelectedCat(''); setCatOpen(false) }}
                  className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-kerala-cream hover:text-kerala-green"
                >
                  {isMl ? 'എല്ലാ വിഭാഗങ്ങളും' : 'All Categories'}
                </button>
                {categories.map((c) => (
                  <button
                    key={c.slug}
                    onClick={() => { setSelectedCat(c.slug); setCatOpen(false) }}
                    className={`block w-full text-left px-4 py-2.5 text-sm hover:bg-kerala-cream hover:text-kerala-green ${selectedCat === c.slug ? 'text-kerala-green font-semibold' : 'text-gray-700'}`}
                  >
                    {isMl ? c.nameMl : c.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Location dropdown */}
          <div className="relative hidden md:block">
            <button
              onClick={() => { setLocOpen(!locOpen); setCatOpen(false) }}
              className="flex items-center gap-2 bg-kerala-cream border border-gray-200 hover:border-kerala-green rounded-xl px-3 py-2.5 text-sm text-gray-600 hover:text-kerala-green transition-colors whitespace-nowrap"
            >
              <MapPin size={14} className="flex-shrink-0" />
              <span className="max-w-[100px] truncate">
                {selectedLoc ? emirates.find(e => e.slug === selectedLoc)?.[isMl ? 'nameMl' : 'name'] : (isMl ? 'สถानান്' : 'Location')}
              </span>
              <ChevronDown size={14} className={`flex-shrink-0 transition-transform ${locOpen ? 'rotate-180' : ''}`} />
            </button>
            {locOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-xl z-50 w-44 py-1">
                <button
                  onClick={() => { setSelectedLoc(''); setLocOpen(false) }}
                  className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-kerala-cream hover:text-kerala-green"
                >
                  {isMl ? 'എല്ലാ അമിരേറ്റ്' : 'All Emirates'}
                </button>
                {emirates.map((e) => (
                  <button
                    key={e.slug}
                    onClick={() => { setSelectedLoc(e.slug); setLocOpen(false) }}
                    className={`block w-full text-left px-4 py-2.5 text-sm hover:bg-kerala-cream hover:text-kerala-green ${selectedLoc === e.slug ? 'text-kerala-green font-semibold' : 'text-gray-700'}`}
                  >
                    {isMl ? e.nameMl : e.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search Button */}
          <button
            onClick={() => onSearch(query)}
            className="bg-kerala-green hover:bg-kerala-green-light text-white font-semibold px-5 py-2.5 rounded-xl transition-all text-sm flex items-center gap-2 flex-shrink-0"
          >
            <Search size={15} />
            <span className="hidden sm:inline">{isMl ? 'തിരയൂ' : 'Search'}</span>
          </button>

          {/* Mobile filter button */}
          <button
            onClick={onOpenMobileFilters}
            className="lg:hidden relative flex items-center gap-1.5 border border-gray-200 text-gray-600 px-3 py-2.5 rounded-xl text-sm hover:border-kerala-green hover:text-kerala-green transition-colors flex-shrink-0"
          >
            <SlidersHorizontal size={15} />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-kerala-green text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
