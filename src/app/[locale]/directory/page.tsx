'use client'

import { useState, useMemo } from 'react'
import { useLocale } from 'next-intl'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import DirectorySearchBar from '@/components/directory/DirectorySearchBar'
import FiltersSidebar from '@/components/directory/FiltersSidebar'
import ActiveFilters from '@/components/directory/ActiveFilters'
import BusinessCard from '@/components/directory/BusinessCard'
import Pagination from '@/components/directory/Pagination'
import { mockBusinesses } from '@/lib/mock-businesses'
import type { FilterState } from '@/types/business'
import { Building2, TrendingUp, MapPin } from 'lucide-react'

const PER_PAGE = 9

const defaultFilters: FilterState = {
  query: '',
  category: '',
  emirate: '',
  rating: null,
  priceRange: [],
  verified: false,
  open: false,
  sort: 'relevance',
  view: 'grid',
  page: 1,
}

export default function DirectoryPage() {
  const locale = useLocale()
  const isMl = locale === 'ml'
  const [filters, setFilters] = useState<FilterState>(defaultFilters)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const patchFilters = (patch: Partial<FilterState>) =>
    setFilters((prev) => ({ ...prev, ...patch, page: 'page' in patch ? patch.page! : 1 }))

  const resetFilters = () => setFilters(defaultFilters)

  // Filter + sort logic
  const filtered = useMemo(() => {
    let list = [...mockBusinesses]
    if (filters.query) {
      const q = filters.query.toLowerCase()
      list = list.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.nameMl.includes(q) ||
          b.description.toLowerCase().includes(q) ||
          b.tags.some((t) => t.toLowerCase().includes(q))
      )
    }
    if (filters.category) list = list.filter((b) => b.categorySlug === filters.category)
    if (filters.emirate) list = list.filter((b) => b.emirateSlug === filters.emirate)
    if (filters.rating) list = list.filter((b) => b.rating >= filters.rating!)
    if (filters.priceRange.length) list = list.filter((b) => filters.priceRange.includes(b.priceRange))
    if (filters.verified) list = list.filter((b) => b.verified)
    if (filters.open) list = list.filter((b) => b.open)

    if (filters.sort === 'rating') list.sort((a, b) => b.rating - a.rating)
    else if (filters.sort === 'reviews') list.sort((a, b) => b.reviewCount - a.reviewCount)
    else if (filters.sort === 'newest') list.sort((a, b) => (b.established ?? 0) - (a.established ?? 0))
    else list.sort((a, b) => (b.premium ? 1 : 0) - (a.premium ? 1 : 0))

    return list
  }, [filters])

  const paginated = filtered.slice((filters.page - 1) * PER_PAGE, filters.page * PER_PAGE)

  const activeFilterCount = [
    filters.category, filters.emirate, filters.rating,
    filters.verified, filters.open,
  ].filter(Boolean).length

  return (
    <main className="min-h-screen bg-kerala-cream">
      <Navbar />

      {/* Page Header */}
      <div className="bg-kerala-deep pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-white/40 text-xs mb-4">
            <span>{isMl ? 'ഹോം' : 'Home'}</span>
            <span>/</span>
            <span className="text-kerala-gold-light">{isMl ? 'ബിസിനസ് ഡയറക്ടറി' : 'Business Directory'}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-2">
                {isMl ? 'ബിസിനസ് ഡയറക്ടറി' : 'Business Directory'}
              </h1>
              <p className="text-white/60 text-base">
                {isMl
                  ? 'യുഎഇ മുഴുവൻ 15,000+ മലയാളി ബിസിനസുകൾ കണ്ടെത്തൂ'
                  : 'Discover 15,000+ Malayali businesses across all UAE emirates'}
              </p>
            </div>

            {/* Quick stats */}
            <div className="flex items-center gap-6 flex-shrink-0">
              {[
                { icon: Building2, val: '15K+', label: isMl ? 'ബിസിനസ്' : 'Businesses' },
                { icon: MapPin, val: '7', label: isMl ? 'എമിറേറ്റ്' : 'Emirates' },
                { icon: TrendingUp, val: '50K+', label: isMl ? 'റിവ്യൂ' : 'Reviews' },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-kerala-gold-light font-serif font-bold text-xl">{s.val}</div>
                  <div className="text-white/50 text-xs">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Search Bar */}
      <DirectorySearchBar
        filters={filters}
        onSearch={(q) => patchFilters({ query: q })}
        onOpenMobileFilters={() => setMobileSidebarOpen(true)}
        activeFilterCount={activeFilterCount}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-7">
          {/* Sidebar */}
          <FiltersSidebar
            filters={filters}
            onChange={patchFilters}
            onReset={resetFilters}
            mobileOpen={mobileSidebarOpen}
            onMobileClose={() => setMobileSidebarOpen(false)}
          />

          {/* Results */}
          <div className="flex-1 min-w-0">
            {/* Active Filters + Sort/View */}
            <ActiveFilters
              filters={filters}
              totalResults={filtered.length}
              onChange={patchFilters}
              onReset={resetFilters}
            />

            {/* Grid / List */}
            {paginated.length === 0 ? (
              <EmptyState isMl={isMl} onReset={resetFilters} />
            ) : (
              <>
                <div
                  className={
                    filters.view === 'grid'
                      ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'
                      : 'flex flex-col gap-4'
                  }
                >
                  {paginated.map((business) => (
                    <BusinessCard key={business.id} business={business} view={filters.view} />
                  ))}
                </div>

                <Pagination
                  page={filters.page}
                  total={filtered.length}
                  perPage={PER_PAGE}
                  onChange={(p) => {
                    patchFilters({ page: p })
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                />
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

function EmptyState({ isMl, onReset }: { isMl: boolean; onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-2xl bg-kerala-cream border border-gray-200 flex items-center justify-center mb-5">
        <Building2 size={32} className="text-gray-300" />
      </div>
      <h3 className="font-serif text-2xl font-semibold text-kerala-deep mb-2">
        {isMl ? 'ഒന്നും കണ്ടെത്തിയില്ല' : 'No businesses found'}
      </h3>
      <p className="text-gray-500 text-sm mb-6 max-w-xs">
        {isMl
          ? 'നിങ്ങളുടെ ഫിൽട്ടറുകൾ മാറ്റി വീണ്ടും ശ്രമിക്കൂ'
          : 'Try adjusting your search filters to find more results'}
      </p>
      <button
        onClick={onReset}
        className="bg-kerala-green text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-kerala-green-light transition-all text-sm"
      >
        {isMl ? 'ഫിൽട്ടറുകൾ മായ്ക്കൂ' : 'Clear all filters'}
      </button>
    </div>
  )
}
