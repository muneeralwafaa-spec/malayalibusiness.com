'use client'

import { useLocale } from 'next-intl'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type Props = {
  page: number
  total: number
  perPage: number
  onChange: (page: number) => void
}

export default function Pagination({ page, total, perPage, onChange }: Props) {
  const locale = useLocale()
  const isMl = locale === 'ml'
  const totalPages = Math.ceil(total / perPage)
  if (totalPages <= 1) return null

  const pages: (number | '…')[] = []
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    pages.push(1)
    if (page > 3) pages.push('…')
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i)
    if (page < totalPages - 2) pages.push('…')
    pages.push(totalPages)
  }

  const start = (page - 1) * perPage + 1
  const end = Math.min(page * perPage, total)

  return (
    <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Count */}
      <p className="text-sm text-gray-500">
        {isMl
          ? `${total} ൽ ${start}–${end} കാണിക്കുന്നു`
          : `Showing ${start}–${end} of ${total} businesses`}
      </p>

      {/* Pages */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          className="flex items-center justify-center w-9 h-9 rounded-xl border border-gray-200 text-gray-500 hover:border-kerala-green hover:text-kerala-green disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={16} />
        </button>

        {pages.map((p, i) =>
          p === '…' ? (
            <span key={`e-${i}`} className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onChange(p as number)}
              className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${
                p === page
                  ? 'bg-kerala-green text-white shadow-md'
                  : 'border border-gray-200 text-gray-600 hover:border-kerala-green hover:text-kerala-green'
              }`}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
          className="flex items-center justify-center w-9 h-9 rounded-xl border border-gray-200 text-gray-500 hover:border-kerala-green hover:text-kerala-green disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
