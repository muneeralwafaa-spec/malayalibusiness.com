export type Business = {
  id: number
  name: string
  nameMl: string
  slug: string
  category: string
  categoryMl: string
  categorySlug: string
  location: string
  locationMl: string
  emirate: string
  emirateSlug: string
  address: string
  phone: string
  whatsapp?: string
  website?: string
  email?: string
  rating: number
  reviewCount: number
  priceRange: 1 | 2 | 3 | 4
  image: string
  logo?: string
  photos: string[]
  description: string
  descriptionMl: string
  tags: string[]
  tagsMl: string[]
  verified: boolean
  featured: boolean
  premium: boolean
  open: boolean
  hours: string
  established?: number
  employees?: string
  languages: string[]
}

export type FilterState = {
  query: string
  category: string
  emirate: string
  rating: number | null
  priceRange: number[]
  verified: boolean
  open: boolean
  sort: 'relevance' | 'rating' | 'reviews' | 'newest'
  view: 'grid' | 'list'
  page: number
}
