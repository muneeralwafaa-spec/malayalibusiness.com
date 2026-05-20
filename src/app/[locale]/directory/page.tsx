'use client'

import { useState, useMemo, useEffect } from 'react'
import { useLocale } from 'next-intl'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import DirectorySearchBar from '@/components/directory/DirectorySearchBar'
import FiltersSidebar from '@/components/directory/FiltersSidebar'
import ActiveFilters from '@/components/directory/ActiveFilters'
import BusinessCard from '@/components/directory/BusinessCard'
import Pagination from '@/components/directory/Pagination'
import { getListings, adaptListing, getCategoryCounts, getEmirateCounts, getCategories } from '@/lib/listings'
import type { FilterState } from '@/types/business'
import { Building2, TrendingUp, MapPin, Loader2 } from 'lucide-react'

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
  // Store raw listings — adapt at render time so categoryMap race is avoided
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [rawListings,    setRawListings]    = useState<any[]>([])
  const [total,          setTotal]          = useState(0)
  const [loading,        setLoading]        = useState(true)
  const [dbError,        setDbError]        = useState<string | null>(null)
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({})
  const [emirateCounts,  setEmirateCounts]  = useState<Record<string, number>>({})
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [categoryMap,    setCategoryMap]    = useState<Record<string, any>>({})

  // Adapt raw listings whenever rawListings or categoryMap changes (fixes race condition)
  const businesses = useMemo(
    () => rawListings.map((l) => adaptListing(l, categoryMap)),
    [rawListings, categoryMap]
  )

  const patchFilters = (patch: Partial<FilterState>) =>
    setFilters((prev) => ({ ...prev, ...patch, page: 'page' in patch ? patch.page! : 1 }))

  const resetFilters = () => setFilters(defaultFilters)

  // Fetch category + emirate counts once on mount
  useEffect(() => {
    getCategoryCounts().then(setCategoryCounts)
    getEmirateCounts().then(setEmirateCounts)
    // Build id→{name,name_ml,slug} map for adaptListing
    getCategories().then((cats) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const map: Record<string, any> = {}
      cats.forEach((c: any) => { map[c.id] = { name: c.name, name_ml: c.name_ml, slug: c.slug } })
      setCategoryMap(map)
    })
  }, [])

  // Fetch from Supabase whenever filters change — store raw (unadapted) rows
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    getListings({
      query:    filters.query,
      category: filters.category,
      emirate:  filters.emirate,
      verified: filters.verified || undefined,
      sort:     filters.sort,
      page:     filters.page,
      perPage:  PER_PAGE,
    }).then(({ listings, total, error }) => {
      if (cancelled) return
      if (error) setDbError(error)
      setRawListings(listings)
      setTotal(total)
      setLoading(false)
    })
    return () => { cancelled = true }
  }, [filters])

  const activeFilterCount = [
    filters.category, filters.emirate, filters.rating,
    filters.verified, filters.open,
  ].filter(Boolean).length

  const filtered = businesses   // already filtered server-side
  const paginated = businesses  // already paginated server-side

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
                  ? `യുഎഇ മുഴുവൻ ${total > 0 ? `${total}+` : '465+'} മലയാളി ബിസിനസുകൾ കണ്ടെത്തൂ`
                  : `Discover ${total > 0 ? `${total}+` : '465+'} Malayali businesses across all UAE emirates`}
              </p>
            </div>

            {/* Quick stats */}
            <div className="flex items-center gap-6 flex-shrink-0">
              {[
                { icon: Building2, val: total > 0 ? `${total}+` : '465+', label: isMl ? 'ബിസിനസ്' : 'Businesses' },
                { icon: MapPin, val: '7', label: isMl ? 'എമിറേറ്റ്' : 'Emirates' },
                { icon: TrendingUp, val: '7', label: isMl ? 'കാറ്റഗറി' : 'Categories' },
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
            categoryCounts={categoryCounts}
            emirateCounts={emirateCounts}
          />

          {/* Results */}
          <div className="flex-1 min-w-0">
            {/* DEBUG: show Supabase error if any */}
            {dbError && (
              <div className="mb-4 p-4 bg-red-50 border border-red-300 rounded-xl text-red-800 text-sm font-mono break-all">
                <strong>Supabase error:</strong> {dbError}
              </div>
            )}
            {/* Active Filters + Sort/View */}
            <ActiveFilters
              filters={filters}
              totalResults={filtered.length}
              onChange={patchFilters}
              onReset={resetFilters}
            />

            {/* Grid / List */}
            {loading ? (
              <div className="flex items-center justify-center py-32">
                <Loader2 size={36} className="animate-spin text-kerala-green" />
              </div>
            ) : paginated.length === 0 ? (
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
                  total={total}
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
