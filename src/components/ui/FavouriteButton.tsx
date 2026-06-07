'use client'

import { useState, useEffect } from 'react'
import { Heart, Loader2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { toggleFavourite, isFavourited } from '@/lib/favourites'
import type { FavouriteType } from '@/lib/favourites'
import { useRouter, usePathname } from 'next/navigation'
import { useLocale } from 'next-intl'

interface Props {
  itemType:  FavouriteType
  itemId:    string
  size?:     'sm' | 'md' | 'lg'
  /** If you already know the initial state, pass it to skip the DB check */
  initialState?: boolean
  className?: string
}

export default function FavouriteButton({
  itemType, itemId, size = 'md', initialState, className = '',
}: Props) {
  const { user } = useAuth()
  const locale   = useLocale()
  const router   = useRouter()
  const pathname = usePathname()

  const [faved,    setFaved]    = useState(initialState ?? false)
  const [loading,  setLoading]  = useState(initialState === undefined)
  const [animating, setAnimating] = useState(false)

  // Load initial state from DB (only if not supplied by parent)
  useEffect(() => {
    if (!user || initialState !== undefined) {
      setLoading(false)
      return
    }
    isFavourited(user.id, itemType, itemId).then(v => {
      setFaved(v)
      setLoading(false)
    })
  }, [user, itemType, itemId, initialState])

  const iconSize = size === 'sm' ? 14 : size === 'lg' ? 22 : 18
  const btnSize  = size === 'sm'
    ? 'w-7 h-7'
    : size === 'lg'
    ? 'w-11 h-11'
    : 'w-9 h-9'

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      // Redirect to auth, come back after login
      router.push(`/${locale}/auth?tab=login&next=${encodeURIComponent(pathname)}`)
      return
    }

    // Optimistic UI
    setFaved(prev => !prev)
    setAnimating(true)
    setTimeout(() => setAnimating(false), 600)

    const { isFavourited: newState, error } = await toggleFavourite(user.id, itemType, itemId)
    if (error) {
      // Revert on error
      setFaved(prev => !prev)
    } else {
      setFaved(newState)
    }
  }

  return (
    <button
      onClick={handleClick}
      title={faved ? 'Remove from wishlist' : 'Save to wishlist'}
      className={`
        ${btnSize} rounded-full flex items-center justify-center transition-all duration-200
        ${faved
          ? 'bg-red-500 text-white shadow-md shadow-red-200'
          : 'bg-white/90 text-gray-400 hover:text-red-400 hover:bg-white shadow-sm border border-gray-100'
        }
        ${animating ? 'scale-125' : 'scale-100'}
        ${className}
      `}
    >
      {loading
        ? <Loader2 size={iconSize - 2} className="animate-spin text-gray-300" />
        : <Heart size={iconSize} className={faved ? 'fill-white' : ''} />
      }
    </button>
  )
}
