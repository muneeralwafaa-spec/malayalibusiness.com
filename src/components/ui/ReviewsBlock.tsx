'use client'

import { useState } from 'react'
import { Star, CheckCircle, ThumbsUp, BadgeCheck, Loader2, MessageSquare } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { submitReviewAuthenticated, submitReview, voteHelpful } from '@/lib/listings'
import type { ReviewRow } from '@/lib/supabase'

// ── Star picker ──────────────────────────────────────────────────────────────
function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(s => (
        <button
          key={s}
          type="button"
          onMouseEnter={() => setHover(s)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(s)}
          className="transition-transform hover:scale-110"
        >
          <svg width={28} height={28} viewBox="0 0 24 24"
            className={s <= (hover || value) ? 'fill-kerala-gold text-kerala-gold' : 'fill-gray-200 text-gray-200'}
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </button>
      ))}
      <span className="text-sm font-semibold text-gray-500 ml-1">
        {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'][hover || value]}
      </span>
    </div>
  )
}

// ── Single review card ────────────────────────────────────────────────────────
function ReviewCard({ review, isMl, onHelpful }: {
  review: ReviewRow
  isMl: boolean
  onHelpful: (id: string) => void
}) {
  const [voted, setVoted] = useState(false)
  const initial = (review.reviewer_name || 'A').trim()[0].toUpperCase()

  const handleHelpful = async () => {
    if (voted) return
    const fp = navigator.userAgent.slice(0, 32)
    await voteHelpful(review.id, fp)
    onHelpful(review.id)
    setVoted(true)
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-xl bg-kerala-green/10 text-kerala-green font-bold flex items-center justify-center flex-shrink-0 font-serif text-lg">
          {initial}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-semibold text-kerala-deep text-sm">{review.reviewer_name || 'Anonymous'}</span>
            {review.is_verified && <BadgeCheck size={13} className="text-kerala-green" />}
            <span className="text-gray-400 text-xs ml-auto">
              {new Date(review.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
          {/* Stars */}
          <div className="flex gap-0.5 mb-2">
            {[1, 2, 3, 4, 5].map(i => (
              <svg key={i} width={13} height={13} viewBox="0 0 24 24"
                className={i <= review.rating ? 'fill-kerala-gold' : 'fill-gray-200'}
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
          </div>
          {review.body && (
            <p className="text-gray-600 text-sm leading-relaxed mb-3">{review.body}</p>
          )}
          <button
            onClick={handleHelpful}
            disabled={voted}
            className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
              voted ? 'text-kerala-green' : 'text-gray-400 hover:text-kerala-green'
            }`}
          >
            <ThumbsUp size={12} />
            {isMl ? 'സഹായകരം' : 'Helpful'}
            {review.helpful_count > 0 && ` (${review.helpful_count})`}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Rating summary bar ────────────────────────────────────────────────────────
function RatingSummary({ reviews, avgRating, isMl }: {
  reviews: ReviewRow[]
  avgRating: number
  isMl: boolean
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex gap-6 items-center">
      {/* Big number */}
      <div className="text-center flex-shrink-0">
        <div className="font-serif text-5xl font-bold text-kerala-deep leading-none">{avgRating.toFixed(1)}</div>
        <div className="flex justify-center gap-0.5 mt-2 mb-1">
          {[1,2,3,4,5].map(i => (
            <svg key={i} width={14} height={14} viewBox="0 0 24 24"
              className={i <= Math.round(avgRating) ? 'fill-kerala-gold' : 'fill-gray-200'}
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          ))}
        </div>
        <div className="text-xs text-gray-400">{reviews.length} {isMl ? 'റിവ്യൂ' : 'reviews'}</div>
      </div>
      {/* Bars */}
      <div className="flex-1 space-y-1.5">
        {[5, 4, 3, 2, 1].map(stars => {
          const count = reviews.filter(r => r.rating === stars).length
          const pct = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0
          return (
            <div key={stars} className="flex items-center gap-2 text-xs">
              <span className="text-gray-500 w-2">{stars}</span>
              <svg width={11} height={11} viewBox="0 0 24 24" className="fill-kerala-gold flex-shrink-0">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-kerala-gold rounded-full" style={{ width: `${pct}%` }} />
              </div>
              <span className="text-gray-400 w-6 text-right">{count}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Review form ───────────────────────────────────────────────────────────────
function ReviewForm({
  isMl, onSubmit, submitting, submitted,
}: {
  isMl: boolean
  onSubmit: (rating: number, name: string, body: string) => Promise<void>
  submitting: boolean
  submitted: boolean
}) {
  const { user, profile } = useAuth()
  const [rating, setRating]   = useState(5)
  const [name,   setName]     = useState(profile?.full_name ?? '')
  const [body,   setBody]     = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!body.trim() || rating < 1) return
    await onSubmit(rating, name || (isMl ? 'അനോണിമസ്' : 'Anonymous'), body)
  }

  if (submitted) return (
    <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
      <CheckCircle size={36} className="text-kerala-green mx-auto mb-2" />
      <p className="font-semibold text-kerala-deep">{isMl ? 'നന്ദി! റിവ്യൂ ലഭിച്ചു.' : 'Thank you! Review submitted.'}</p>
      <p className="text-sm text-gray-500 mt-1">{isMl ? 'പരിശോധനക്ക് ശേഷം പ്രദർശിപ്പിക്കും.' : 'It will appear after moderation.'}</p>
    </div>
  )

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h3 className="font-serif text-lg font-bold text-kerala-deep mb-4 flex items-center gap-2">
        <MessageSquare size={18} className="text-kerala-green" />
        {isMl ? 'റിവ്യൂ എഴുതൂ' : 'Write a Review'}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Star picker */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">
            {isMl ? 'റേറ്റിംഗ്' : 'Your Rating'}
          </label>
          <StarPicker value={rating} onChange={setRating} />
        </div>

        {/* Name — prefilled if logged in */}
        {!user && (
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
              {isMl ? 'നിങ്ങളുടെ പേര്' : 'Your Name'}
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={isMl ? 'ആദ്യ പേര് മതി' : 'First name is fine'}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-kerala-green"
            />
          </div>
        )}

        {user && profile?.full_name && (
          <p className="text-xs text-gray-400">
            {isMl ? 'ഇതായി പോസ്റ്റ് ചെയ്യും:' : 'Posting as:'}{' '}
            <span className="font-semibold text-kerala-deep">{profile.full_name}</span>
          </p>
        )}

        {/* Review body */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
            {isMl ? 'അഭിപ്രായം *' : 'Your Review *'}
          </label>
          <textarea
            required
            rows={4}
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder={isMl
              ? 'നിങ്ങളുടെ അനുഭവം പങ്കുവെക്കൂ...'
              : 'Share your experience — what did you like, what could be better?'}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-kerala-green resize-none"
          />
          <p className="text-xs text-gray-400 mt-1">{body.length}/500</p>
        </div>

        <button
          type="submit"
          disabled={submitting || !body.trim() || rating < 1}
          className="w-full bg-kerala-green text-white font-semibold py-3 rounded-xl text-sm hover:bg-kerala-deep transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {submitting && <Loader2 size={15} className="animate-spin" />}
          {submitting
            ? (isMl ? 'സമർപ്പിക്കുന്നു...' : 'Submitting...')
            : (isMl ? 'റിവ്യൂ സമർപ്പിക്കൂ' : 'Submit Review')}
        </button>
      </form>
    </div>
  )
}

// ── Main exported component ───────────────────────────────────────────────────
interface ReviewsBlockProps {
  reviews:        ReviewRow[]
  avgRating:      number
  isMl:           boolean
  /** Either listingId or professionalId must be provided */
  listingId?:     string
  professionalId?: string
  onReviewAdded?: (review: ReviewRow) => void
}

export default function ReviewsBlock({
  reviews: initialReviews, avgRating: initialAvg, isMl,
  listingId, professionalId, onReviewAdded,
}: ReviewsBlockProps) {
  const { user, profile } = useAuth()
  const [reviews,    setReviews]    = useState<ReviewRow[]>(initialReviews)
  const [submitting, setSubmitting] = useState(false)
  const [submitted,  setSubmitted]  = useState(false)
  const [sortBy,     setSortBy]     = useState<'newest' | 'highest' | 'helpful'>('newest')

  const avgRating = reviews.length > 0
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : initialAvg

  const sorted = [...reviews].sort((a, b) => {
    if (sortBy === 'highest') return b.rating - a.rating
    if (sortBy === 'helpful') return (b.helpful_count ?? 0) - (a.helpful_count ?? 0)
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  const handleSubmit = async (rating: number, name: string, body: string) => {
    setSubmitting(true)
    const { ok, error } = await submitReviewAuthenticated({
      listingId,
      professionalId,
      reviewerName: name,
      reviewerId:   user?.id,
      rating,
      body,
    })
    setSubmitting(false)
    if (!ok) { console.error(error); return }
    setSubmitted(true)
    // Optimistically prepend the new review
    const newReview: ReviewRow = {
      id: `temp-${Date.now()}`,
      listing_id:    listingId    ?? null,
      reviewer_name: profile?.full_name || name,
      reviewer_id:   user?.id    ?? null,
      rating,
      body,
      is_verified:   false,
      helpful_count: 0,
      created_at:    new Date().toISOString(),
    } as unknown as ReviewRow
    setReviews(prev => [newReview, ...prev])
    onReviewAdded?.(newReview)
  }

  const handleHelpful = (id: string) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, helpful_count: (r.helpful_count ?? 0) + 1 } : r))
  }

  return (
    <div className="space-y-5">
      {/* Rating summary */}
      {reviews.length > 0 && (
        <RatingSummary reviews={reviews} avgRating={avgRating} isMl={isMl} />
      )}

      {/* Sort + count bar */}
      {reviews.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-kerala-deep">
            {reviews.length} {isMl ? 'റിവ്യൂകൾ' : 'Reviews'}
          </p>
          <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
            {([['newest', isMl ? 'പുതിയത്' : 'Newest'], ['highest', isMl ? 'ടോപ്' : 'Top Rated'], ['helpful', isMl ? 'സഹായകരം' : 'Most Helpful']] as const).map(([k, l]) => (
              <button key={k} onClick={() => setSortBy(k)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${sortBy === k ? 'bg-white text-kerala-deep shadow-sm' : 'text-gray-500'}`}>
                {l}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Review list */}
      {sorted.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 py-12 text-center">
          <Star size={32} className="mx-auto mb-3 text-gray-200" />
          <p className="font-semibold text-kerala-deep mb-1">{isMl ? 'ഇതുവരെ റിവ്യൂ ഇല്ല' : 'No reviews yet'}</p>
          <p className="text-sm text-gray-400">{isMl ? 'ആദ്യ റിവ്യൂ ഇടൂ!' : 'Be the first to leave a review!'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map(r => <ReviewCard key={r.id} review={r} isMl={isMl} onHelpful={handleHelpful} />)}
        </div>
      )}

      {/* Write review form */}
      {!submitted && (
        <ReviewForm isMl={isMl} onSubmit={handleSubmit} submitting={submitting} submitted={submitted} />
      )}
      {submitted && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
          <CheckCircle size={36} className="text-kerala-green mx-auto mb-2" />
          <p className="font-semibold text-kerala-deep">{isMl ? 'നന്ദി! റിവ്യൂ ലഭിച്ചു.' : 'Thank you! Review submitted.'}</p>
          <p className="text-sm text-gray-500 mt-1">{isMl ? 'പരിശോധനക്ക് ശേഷം പ്രദർശിപ്പിക്കും.' : 'It will appear shortly after moderation.'}</p>
        </div>
      )}
    </div>
  )
}
