'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import type { MarketplaceListing } from '@/lib/shop'

// Minimal cart-compatible shape (supports both real DB listings and legacy shapes)
export type CartListing = MarketplaceListing & {
  // Legacy camelCase aliases kept for CartDrawer compatibility
  vendorSlug?: string
}

export interface CartItem {
  listing: CartListing
  quantity: number
  selectedSlot?: string   // for appointments
  selectedDate?: string
  note?: string
}

interface CartContextValue {
  items: CartItem[]
  addItem: (listing: CartListing, opts?: { slot?: string; date?: string; note?: string }) => void
  removeItem: (id: string) => void
  updateQty: (id: string, qty: number) => void
  clearCart: () => void
  totalItems: number
  totalAmount: number
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  // grouped by vendor
  byVendor: Record<string, CartItem[]>
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const addItem = useCallback((listing: CartListing, opts?: { slot?: string; date?: string; note?: string }) => {
    setItems(prev => {
      const existing = prev.find(i => i.listing.id === listing.id)
      if (existing) {
        return prev.map(i => i.listing.id === listing.id ? { ...i, quantity: i.quantity + 1 } : i)
      }
      return [...prev, { listing, quantity: 1, selectedSlot: opts?.slot, selectedDate: opts?.date, note: opts?.note }]
    })
    setIsOpen(true)
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.listing.id !== id))
  }, [])

  const updateQty = useCallback((id: string, qty: number) => {
    if (qty <= 0) { removeItem(id); return }
    setItems(prev => prev.map(i => i.listing.id === id ? { ...i, quantity: qty } : i))
  }, [removeItem])

  const clearCart = useCallback(() => setItems([]), [])

  const totalItems = items.reduce((s, i) => s + i.quantity, 0)
  const totalAmount = items.reduce((s, i) => s + i.listing.price * i.quantity, 0)

  const byVendor = items.reduce<Record<string, CartItem[]>>((acc, item) => {
    const key = item.listing.vendor_slug ?? item.listing.vendorSlug ?? 'unknown'
    if (!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
  }, {})

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem, updateQty, clearCart,
      totalItems, totalAmount, isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      byVendor,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
