'use client'

import { useCart } from '@/context/CartContext'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import { X, Plus, Minus, Trash2, ShoppingBag, MessageCircle } from 'lucide-react'

export default function CartDrawer() {
  const locale = useLocale()
  const { isOpen, closeCart, items, byVendor, removeItem, updateQty, totalItems, totalAmount } = useCart()

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-kerala-green">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-white" />
            <h2 className="text-lg font-bold text-white">
              {locale === 'ml' ? 'കൂട' : 'Your Cart'}
            </h2>
            {totalItems > 0 && (
              <span className="bg-kerala-gold text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {totalItems}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center h-full gap-4 px-6 text-center">
              <div className="w-20 h-20 rounded-full bg-kerala-cream flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 text-kerala-green/40" />
              </div>
              <div>
                <p className="text-lg font-semibold text-kerala-deep">
                  {locale === 'ml' ? 'കൂട ഒഴിഞ്ഞിരിക്കുന്നു' : 'Your cart is empty'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {locale === 'ml'
                    ? 'ഉൽപ്പന്നങ്ങൾ ചേർക്കാൻ ഷോപ്പ് ബ്രൗസ് ചെയ്യൂ'
                    : 'Browse the shop to add products & services'}
                </p>
              </div>
              <button
                onClick={closeCart}
                className="mt-2 px-6 py-2.5 bg-kerala-green text-white rounded-xl font-semibold hover:bg-kerala-deep transition-colors"
              >
                {locale === 'ml' ? 'ഷോപ്പ് തുറക്കൂ' : 'Continue Shopping'}
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {Object.entries(byVendor).map(([vendorSlug, vendorItems]) => {
                const vendor = vendorItems[0].listing
                const vendorTotal = vendorItems.reduce((s, i) => s + i.listing.price * i.quantity, 0)

                return (
                  <div key={vendorSlug} className="py-4">
                    {/* Vendor header */}
                    <div className="flex items-center gap-2 px-5 mb-3">
                      <div className="relative w-7 h-7 rounded-full overflow-hidden border border-gray-200 bg-gray-100 flex-shrink-0">
                        {vendor.vendor_logo_url && (
                          <Image
                            src={vendor.vendor_logo_url}
                            alt={vendor.vendor_name}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <span className="text-sm font-semibold text-kerala-deep">
                        {locale === 'ml' ? vendor.vendor_name : vendor.vendor_name}
                      </span>
                      {vendor.vendor_verified && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-medium">✓</span>
                      )}
                    </div>

                    {/* Items */}
                    <div className="space-y-3 px-5">
                      {vendorItems.map((item) => (
                        <div key={item.listing.id} className="flex gap-3">
                          {/* Image */}
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                            {item.listing.image_url && (
                              <Image
                                src={item.listing.image_url}
                                alt={item.listing.name}
                                fill
                                className="object-cover"
                              />
                            )}
                          </div>

                          {/* Details */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-kerala-deep truncate">
                              {locale === 'ml' ? item.listing.name_ml : item.listing.name}
                            </p>

                            {/* Slot/date if appointment */}
                            {item.selectedDate && (
                              <p className="text-xs text-gray-500 mt-0.5">
                                📅 {item.selectedDate}{item.selectedSlot ? ` · ${item.selectedSlot}` : ''}
                              </p>
                            )}

                            {/* Price */}
                            <p className="text-sm font-bold text-kerala-green mt-0.5">
                              AED {item.listing.price.toFixed(2)}
                              {item.listing.unit && (
                                <span className="text-xs text-gray-500 font-normal">
                                  {' '}/ {locale === 'ml' ? item.listing.unit_ml : item.listing.unit}
                                </span>
                              )}
                            </p>

                            {/* Qty controls */}
                            <div className="flex items-center gap-2 mt-1.5">
                              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
                                <button
                                  onClick={() => updateQty(item.listing.id, item.quantity - 1)}
                                  className="w-6 h-6 rounded-md hover:bg-white flex items-center justify-center transition-colors"
                                >
                                  <Minus className="w-3 h-3 text-gray-600" />
                                </button>
                                <span className="text-sm font-semibold text-kerala-deep w-5 text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQty(item.listing.id, item.quantity + 1)}
                                  className="w-6 h-6 rounded-md hover:bg-white flex items-center justify-center transition-colors"
                                >
                                  <Plus className="w-3 h-3 text-gray-600" />
                                </button>
                              </div>

                              <button
                                onClick={() => removeItem(item.listing.id)}
                                className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>

                              <span className="ml-auto text-sm font-bold text-kerala-deep">
                                AED {(item.listing.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Vendor subtotal */}
                    <div className="flex justify-between items-center px-5 mt-3 pt-3 border-t border-dashed border-gray-200">
                      <span className="text-xs text-gray-500">
                        {locale === 'ml' ? 'ഉപ-ആകെ' : 'Subtotal'} · {vendor.vendor_name}
                      </span>
                      <span className="text-sm font-bold text-kerala-deep">
                        AED {vendorTotal.toFixed(2)}
                      </span>
                    </div>

                    {/* WhatsApp contact for this vendor */}
                    {vendor.vendor_whatsapp && (
                      <div className="px-5 mt-2">
                        <a
                          href={`https://wa.me/${vendor.vendor_whatsapp.replace(/\D/g, '')}?text=Hi! I have a question about my order.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs text-green-600 hover:text-green-700 transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          {locale === 'ml' ? 'വെണ്ടർ ബന്ധപ്പെടൂ' : 'Contact vendor on WhatsApp'}
                        </a>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer — only show when items exist */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 bg-white px-5 py-4 space-y-3">
            {/* Grand total */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                {locale === 'ml' ? 'ആകെ' : 'Grand Total'}
                <span className="text-xs text-gray-400 ml-1">
                  ({totalItems} {locale === 'ml' ? 'ഇനങ്ങൾ' : 'items'})
                </span>
              </span>
              <span className="text-xl font-bold text-kerala-deep">
                AED {totalAmount.toFixed(2)}
              </span>
            </div>

            {/* Checkout button */}
            <Link
              href={`/${locale}/checkout`}
              onClick={closeCart}
              className="block w-full py-3 bg-kerala-green text-white text-center font-bold rounded-xl hover:bg-kerala-deep transition-colors"
            >
              {locale === 'ml' ? 'ചെക്കൗട്ടിലേക്ക് →' : 'Proceed to Checkout →'}
            </Link>

            {/* Continue shopping */}
            <button
              onClick={closeCart}
              className="block w-full py-2.5 border border-kerala-green text-kerala-green text-center font-semibold rounded-xl hover:bg-kerala-green/5 transition-colors text-sm"
            >
              {locale === 'ml' ? 'ഷോപ്പിങ് തുടരൂ' : 'Continue Shopping'}
            </button>
          </div>
        )}
      </div>
    </>
  )
}
