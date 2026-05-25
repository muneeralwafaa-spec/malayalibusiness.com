'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useCart } from '@/context/CartContext'
import {
  ShoppingCart, Trash2, Plus, Minus, Tag, ChevronRight, ChevronLeft,
  Truck, Zap, Shield, CheckCircle, CreditCard, Lock, MessageCircle,
  ClipboardList, BadgeCheck,
} from 'lucide-react'

type Step = 'cart' | 'details' | 'payment' | 'confirmed'
const EMIRATES = ['Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah']
const STEPS_EN = ['Cart', 'Details', 'Payment', 'Confirmed']
const STEPS_ML = ['കാർട്ട്', 'വിവരങ്ങൾ', 'പേയ്മെന്റ്', 'സ്ഥിരീകരണം']

// ─── STEP INDICATOR ──────────────────────────────────────────────────────────
function StepIndicator({ step, isMl }: { step: Step; isMl: boolean }) {
  const steps: Step[] = ['cart', 'details', 'payment', 'confirmed']
  const current = steps.indexOf(step)
  const labels = isMl ? STEPS_ML : STEPS_EN
  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${i < current ? 'bg-kerala-green text-white' : i === current ? 'bg-kerala-gold text-white ring-4 ring-kerala-gold/30' : 'bg-gray-200 text-gray-400'}`}>
              {i < current ? <CheckCircle size={18} /> : i + 1}
            </div>
            <span className={`mt-1.5 text-xs font-medium whitespace-nowrap ${i === current ? 'text-kerala-gold' : i < current ? 'text-kerala-green' : 'text-gray-400'}`}>
              {labels[i]}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`h-0.5 w-12 sm:w-20 mx-1 mb-5 transition-all ${i < current ? 'bg-kerala-green' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

// ─── CART STEP ───────────────────────────────────────────────────────────────
function CartStep({ onNext, isMl, locale }: { onNext: () => void; isMl: boolean; locale: string }) {
  const { items, byVendor, removeItem, updateQty, totalAmount } = useCart()
  const [promo, setPromo] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [promoError, setPromoError] = useState(false)
  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express'>('standard')

  const deliveryFee = deliveryMethod === 'express' ? 35 : 15
  const discount = promoApplied ? Math.round(totalAmount * 0.1) : 0
  const vatBase = totalAmount - discount + deliveryFee
  const vat = Math.round(vatBase * 0.05 * 100) / 100
  const total = vatBase + vat

  function applyPromo() {
    if (promo.trim().toUpperCase() === 'KERALA10') { setPromoApplied(true); setPromoError(false) }
    else { setPromoError(true); setPromoApplied(false) }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        {/* Items grouped by vendor */}
        {items.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 py-20 text-center">
            <ShoppingCart size={40} className="mx-auto mb-3 text-gray-300" />
            <p className="text-gray-400 mb-4">{isMl ? 'കാർട്ട് ശൂന്യം' : 'Your cart is empty'}</p>
            <Link href={`/${locale}/shop`} className="bg-kerala-green text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-kerala-deep transition-colors">
              {isMl ? 'ഷോപ്പ് ബ്രൗസ് ചെയ്യൂ' : 'Browse Shop'}
            </Link>
          </div>
        ) : (
          Object.entries(byVendor).map(([vendorSlug, vendorItems]) => {
            const vendor = vendorItems[0].listing
            return (
              <div key={vendorSlug} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Vendor header */}
                <div className="flex items-center gap-3 px-5 py-3 bg-gray-50 border-b border-gray-100">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border border-gray-200">
                    {vendor.vendor_logo_url && <Image src={vendor.vendor_logo_url} alt={vendor.vendor_name} fill className="object-cover" />}
                  </div>
                  <span className="font-semibold text-kerala-deep text-sm flex items-center gap-1">
                    {vendor.vendor_name}
                    {vendor.vendor_verified && <BadgeCheck size={14} className="text-kerala-green" />}
                  </span>
                  {vendor.vendor_whatsapp && (
                    <a
                      href={`https://wa.me/${vendor.vendor_whatsapp.replace(/\D/g, '')}`}
                      target="_blank" rel="noopener noreferrer"
                      className="ml-auto flex items-center gap-1 text-xs text-green-600 hover:text-green-700"
                    >
                      <MessageCircle size={12} />
                      {isMl ? 'ബന്ധപ്പെടൂ' : 'Contact'}
                    </a>
                  )}
                </div>

                {/* Items */}
                <ul className="divide-y divide-gray-50">
                  {vendorItems.map(item => (
                    <li key={item.listing.id} className="flex gap-4 p-5 hover:bg-gray-50/50 transition-colors">
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                        {item.listing.image_url && <Image src={item.listing.image_url} alt={item.listing.name} fill className="object-cover" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-kerala-deep text-sm leading-snug">
                          {isMl ? item.listing.name_ml : item.listing.name}
                        </h3>
                        {item.selectedDate && (
                          <p className="text-xs text-gray-500 mt-0.5">
                            📅 {item.selectedDate}{item.selectedSlot ? ` · ${item.selectedSlot}` : ''}
                          </p>
                        )}
                        <p className="text-kerala-green font-bold mt-1 text-sm">AED {item.listing.price.toFixed(2)}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center gap-1 bg-gray-100 rounded-lg px-1">
                            <button onClick={() => updateQty(item.listing.id, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-kerala-green">
                              <Minus size={12} />
                            </button>
                            <span className="text-sm font-semibold w-5 text-center">{item.quantity}</span>
                            <button onClick={() => updateQty(item.listing.id, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-kerala-green">
                              <Plus size={12} />
                            </button>
                          </div>
                          <span className="text-xs text-gray-400">
                            {isMl ? 'ആകെ:' : 'Total:'} AED {(item.listing.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <button onClick={() => removeItem(item.listing.id)} className="flex-shrink-0 text-gray-300 hover:text-red-400 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </li>
                  ))}
                </ul>

                {/* Vendor subtotal */}
                <div className="flex justify-between items-center px-5 py-3 bg-gray-50 border-t border-gray-100 text-sm">
                  <span className="text-gray-500">{isMl ? 'ഉപ-ആകെ' : 'Vendor subtotal'}</span>
                  <span className="font-bold text-kerala-deep">
                    AED {vendorItems.reduce((s, i) => s + i.listing.price * i.quantity, 0).toFixed(2)}
                  </span>
                </div>
              </div>
            )
          })
        )}

        {/* Delivery method */}
        {items.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-semibold text-kerala-deep text-sm mb-3 flex items-center gap-2">
              <Truck size={15} className="text-kerala-green" />
              {isMl ? 'ഡെലിവറി രീതി' : 'Delivery Method'}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {([
                { value: 'standard', label: 'Standard', labelMl: 'സ്റ്റാൻഡേർഡ്', sub: '3–5 days · AED 15', icon: Truck },
                { value: 'express', label: 'Express', labelMl: 'എക്സ്പ്രസ്', sub: '1–2 days · AED 35', icon: Zap },
              ] as const).map(opt => (
                <button key={opt.value} onClick={() => setDeliveryMethod(opt.value)}
                  className={`flex items-center gap-2 p-3 rounded-xl border-2 text-left transition-all ${deliveryMethod === opt.value ? 'border-kerala-green bg-kerala-green/5' : 'border-gray-200 hover:border-kerala-green/40'}`}>
                  <opt.icon size={16} className={deliveryMethod === opt.value ? 'text-kerala-green' : 'text-gray-400'} />
                  <div>
                    <p className="font-semibold text-xs text-kerala-deep">{isMl ? opt.labelMl : opt.label}</p>
                    <p className="text-[10px] text-gray-400">{opt.sub}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Promo Code */}
        {items.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-semibold text-kerala-deep text-sm mb-3 flex items-center gap-2">
              <Tag size={15} className="text-kerala-gold" />
              {isMl ? 'പ്രോമോ കോഡ്' : 'Promo Code'}
            </h3>
            <div className="flex gap-2">
              <input type="text" value={promo} onChange={e => { setPromo(e.target.value); setPromoError(false) }}
                placeholder={isMl ? 'കോഡ് നൽകൂ' : 'Enter code (try KERALA10)'}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 focus:border-kerala-green" />
              <button onClick={applyPromo} className="px-5 py-2.5 bg-kerala-green text-white rounded-xl text-sm font-semibold hover:bg-kerala-deep transition-colors">
                {isMl ? 'ഉപയോഗിക്കൂ' : 'Apply'}
              </button>
            </div>
            {promoApplied && <p className="text-kerala-green text-xs mt-2 flex items-center gap-1"><CheckCircle size={12} /> 10% {isMl ? 'കിഴിവ് ലഭിച്ചു!' : 'discount applied!'}</p>}
            {promoError && <p className="text-red-500 text-xs mt-2">{isMl ? 'അസാധുവായ കോഡ്' : 'Invalid code. Try: KERALA10'}</p>}
          </div>
        )}
      </div>

      {/* Order summary */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
          <h3 className="font-serif text-lg font-bold text-kerala-deep mb-5">{isMl ? 'ഓർഡർ സംഗ്രഹം' : 'Order Summary'}</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-gray-600"><span>{isMl ? 'ഉപ-ആകെ' : 'Subtotal'}</span><span>AED {totalAmount.toFixed(2)}</span></div>
            {promoApplied && <div className="flex justify-between text-kerala-green"><span>{isMl ? 'കിഴിവ്' : 'Discount (10%)'}</span><span>−AED {discount.toFixed(2)}</span></div>}
            <div className="flex justify-between text-gray-600"><span>{isMl ? 'ഡെലിവറി' : 'Delivery'}</span><span>AED {deliveryFee}</span></div>
            <div className="flex justify-between text-gray-600"><span>VAT (5%)</span><span>AED {vat.toFixed(2)}</span></div>
            <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-kerala-deep text-base">
              <span>{isMl ? 'ആകെ' : 'Total'}</span><span>AED {total.toFixed(2)}</span>
            </div>
          </div>
          <button onClick={onNext} disabled={items.length === 0}
            className="mt-6 w-full flex items-center justify-center gap-2 bg-kerala-green hover:bg-kerala-deep disabled:bg-gray-300 text-white font-semibold py-3.5 rounded-xl transition-all">
            {isMl ? 'വിവരങ്ങളിലേക്ക്' : 'Continue to Details'} <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── DETAILS STEP ────────────────────────────────────────────────────────────
interface DeliveryForm {
  fullName: string; phone: string; email: string; address1: string; address2: string;
  city: string; emirate: string; postalCode: string; notes: string; deliveryMethod: 'standard' | 'express'
}

function DetailsStep({ form, setForm, onBack, onNext, isMl }: {
  form: DeliveryForm; setForm: React.Dispatch<React.SetStateAction<DeliveryForm>>;
  onBack: () => void; onNext: () => void; isMl: boolean
}) {
  function field(key: keyof DeliveryForm, label: string, labelMl: string, props?: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{isMl ? labelMl : label}</label>
        <input {...props} value={form[key] as string} onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 focus:border-kerala-green bg-gray-50" />
      </div>
    )
  }
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-serif text-xl font-bold text-kerala-deep mb-5">{isMl ? 'ഡെലിവറി വിലാസം' : 'Delivery Address'}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field('fullName', 'Full Name', 'മുഴുവൻ പേര്', { placeholder: 'Muhammed Ali' })}
            {field('phone', 'Phone', 'ഫോൺ', { type: 'tel', placeholder: '+971 50 123 4567' })}
            <div className="sm:col-span-2">{field('email', 'Email', 'ഇമെയിൽ', { type: 'email', placeholder: 'you@example.com' })}</div>
            <div className="sm:col-span-2">{field('address1', 'Address Line 1', 'വിലാസം 1', { placeholder: 'Flat / Villa number, Building name' })}</div>
            <div className="sm:col-span-2">{field('address2', 'Address Line 2 (optional)', 'വിലാസം 2 (ഐച്ഛികം)', { placeholder: 'Street, Area' })}</div>
            {field('city', 'City', 'നഗരം', { placeholder: 'Dubai' })}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{isMl ? 'എമിറേറ്റ്' : 'Emirate'}</label>
              <select value={form.emirate} onChange={e => setForm(p => ({ ...p, emirate: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 focus:border-kerala-green bg-gray-50">
                <option value="">{isMl ? 'തിരഞ്ഞെടുക്കൂ' : 'Select Emirate'}</option>
                {EMIRATES.map(e => <option key={e}>{e}</option>)}
              </select>
            </div>
            {field('postalCode', 'Postal Code', 'പോസ്റ്റൽ കോഡ്', { placeholder: '00000' })}
          </div>
          <div className="mt-4">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{isMl ? 'ഓർഡർ കുറിപ്പ്' : 'Order Notes (optional)'}</label>
            <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
              placeholder={isMl ? 'ഡ്രൈവർക്ക് നിർദ്ദേശം...' : 'Instructions for delivery, gift wrap, etc.'}
              rows={2} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 focus:border-kerala-green bg-gray-50 resize-none" />
          </div>
        </div>
      </div>
      <div className="lg:col-span-1">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24 space-y-3">
          <button onClick={onNext} className="w-full flex items-center justify-center gap-2 bg-kerala-green hover:bg-kerala-deep text-white font-semibold py-3.5 rounded-xl transition-all">
            {isMl ? 'പേയ്മെന്റിലേക്ക്' : 'Continue to Payment'} <ChevronRight size={16} />
          </button>
          <button onClick={onBack} className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-600 hover:border-kerala-green hover:text-kerala-green font-semibold py-3 rounded-xl transition-all text-sm">
            <ChevronLeft size={15} /> {isMl ? 'കാർട്ടിലേക്ക്' : 'Back to Cart'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── PAYMENT STEP ────────────────────────────────────────────────────────────
function formatCardNumber(v: string) { return v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim() }
function formatExpiry(v: string) { const d = v.replace(/\D/g, '').slice(0, 4); return d.length >= 3 ? d.slice(0, 2) + '/' + d.slice(2) : d }

function PaymentStep({ onBack, onPay, isMl }: { onBack: () => void; onPay: () => void; isMl: boolean }) {
  const { items, totalAmount, byVendor } = useCart()
  const [payMethod, setPayMethod] = useState<'card' | 'whatsapp'>('card')
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '', name: '' })
  const [loading, setLoading] = useState(false)
  const deliveryFee = 15
  const vat = Math.round((totalAmount + deliveryFee) * 0.05 * 100) / 100
  const total = totalAmount + deliveryFee + vat

  function handlePay() {
    if (payMethod === 'whatsapp') {
      // Build WhatsApp message for each vendor
      Object.entries(byVendor).forEach(([, vendorItems]) => {
        const vendor = vendorItems[0].listing
        const lines = vendorItems.map(i => `• ${i.listing.name} x${i.quantity} = AED ${(i.listing.price * i.quantity).toFixed(2)}`).join('\n')
        const msg = encodeURIComponent(`Hi ${vendor.vendor_name}! I'd like to place an order:\n\n${lines}\n\nTotal: AED ${vendorItems.reduce((s, i) => s + i.listing.price * i.quantity, 0).toFixed(2)}\n\nPlease confirm!`)
        window.open(`https://wa.me/${(vendor.vendor_whatsapp ?? '').replace(/\D/g, '')}?text=${msg}`, '_blank')
      })
      onPay()
      return
    }
    setLoading(true)
    setTimeout(() => { setLoading(false); onPay() }, 1800)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-5">
        {/* Payment method selector */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-serif text-lg font-bold text-kerala-deep mb-4">{isMl ? 'പേയ്മെന്റ് രീതി' : 'Payment Method'}</h2>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setPayMethod('card')}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${payMethod === 'card' ? 'border-kerala-green bg-kerala-green/5' : 'border-gray-200 hover:border-kerala-green/40'}`}>
              <CreditCard size={20} className={payMethod === 'card' ? 'text-kerala-green' : 'text-gray-400'} />
              <div className="text-left">
                <p className="font-semibold text-sm text-kerala-deep">{isMl ? 'കാർഡ്' : 'Card / Stripe'}</p>
                <p className="text-[11px] text-gray-400">{isMl ? 'ഓൺലൈൻ പേ' : 'Pay securely online'}</p>
              </div>
            </button>
            <button onClick={() => setPayMethod('whatsapp')}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${payMethod === 'whatsapp' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-400'}`}>
              <MessageCircle size={20} className={payMethod === 'whatsapp' ? 'text-green-600' : 'text-gray-400'} />
              <div className="text-left">
                <p className="font-semibold text-sm text-kerala-deep">{isMl ? 'WhatsApp / COD' : 'WhatsApp / COD'}</p>
                <p className="text-[11px] text-gray-400">{isMl ? 'വെണ്ടറിനോട് ബന്ധപ്പെടൂ' : 'Order via WhatsApp'}</p>
              </div>
            </button>
          </div>
        </div>

        {/* Card form */}
        {payMethod === 'card' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-kerala-deep flex items-center gap-2">
                <CreditCard size={18} className="text-kerala-green" />{isMl ? 'കാർഡ് വിവരങ്ങൾ' : 'Card Details'}
              </h3>
              <div className="flex items-center gap-2">
                <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded italic">VISA</span>
                <span className="flex"><span className="w-4 h-4 rounded-full bg-red-500 inline-block" /><span className="w-4 h-4 rounded-full bg-yellow-400 inline-block -ml-2" /></span>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1.5">{isMl ? 'കാർഡ് നമ്പർ' : 'Card Number'}</label>
                <input type="text" inputMode="numeric" value={card.number} maxLength={19}
                  onChange={e => setCard(p => ({ ...p, number: formatCardNumber(e.target.value) }))}
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-kerala-green/30 focus:border-kerala-green bg-gray-50" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1.5">{isMl ? 'കാർഡ്ഹോൾഡർ' : 'Cardholder Name'}</label>
                <input type="text" value={card.name} onChange={e => setCard(p => ({ ...p, name: e.target.value }))} placeholder="MUHAMMED ALI"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm uppercase focus:outline-none focus:ring-2 focus:ring-kerala-green/30 focus:border-kerala-green bg-gray-50" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-1.5">MM/YY</label>
                  <input type="text" inputMode="numeric" value={card.expiry} maxLength={5}
                    onChange={e => setCard(p => ({ ...p, expiry: formatExpiry(e.target.value) }))} placeholder="MM/YY"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-kerala-green/30 focus:border-kerala-green bg-gray-50" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-1.5">CVV</label>
                  <input type="password" inputMode="numeric" value={card.cvv} maxLength={4}
                    onChange={e => setCard(p => ({ ...p, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))} placeholder="•••"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-kerala-green/30 focus:border-kerala-green bg-gray-50" />
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 px-3 py-2.5 rounded-lg">
                <Shield size={13} className="text-kerala-green flex-shrink-0" />
                {isMl ? '256-bit SSL വഴി സുരക്ഷിതം. കാർഡ് ഡാറ്റ സംഭരിക്കില്ല.' : 'Secured by 256-bit SSL. Card data is never stored.'}
              </div>
            </div>
          </div>
        )}

        {/* WhatsApp info */}
        {payMethod === 'whatsapp' && (
          <div className="bg-green-50 rounded-2xl border border-green-200 p-5">
            <div className="flex items-start gap-3">
              <MessageCircle size={22} className="text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-green-800 text-sm">{isMl ? 'WhatsApp ഓർഡർ' : 'WhatsApp Order'}</p>
                <p className="text-xs text-green-700 mt-1">
                  {isMl
                    ? 'ഓർഡർ വിശദാംശങ്ങൾ ഓരോ വെണ്ടർക്കും WhatsApp-ൽ അയക്കും. COD / ബാങ്ക് ട്രാൻസ്ഫർ വഴി പേ ചെയ്യൂ.'
                    : 'Order details will be sent to each vendor via WhatsApp. Pay by cash on delivery or bank transfer as agreed with the vendor.'}
                </p>
                <div className="mt-3 space-y-1.5">
                  {Object.entries(byVendor).map(([, vi]) => (
                    <div key={vi[0].listing.vendor_slug} className="flex items-center gap-2 text-xs text-green-700">
                      <div className="relative w-5 h-5 rounded-full overflow-hidden flex-shrink-0">
                        {vi[0].listing.vendor_logo_url && <Image src={vi[0].listing.vendor_logo_url} alt="" fill className="object-cover" />}
                      </div>
                      {vi[0].listing.vendor_name} → {vi[0].listing.vendor_whatsapp}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Order summary accordion */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <p className="font-semibold text-kerala-deep text-sm mb-3">{isMl ? 'ഓർഡർ സംഗ്രഹം' : 'Order Summary'}</p>
          <div className="space-y-2">
            {items.map(i => (
              <div key={i.listing.id} className="flex justify-between text-sm text-gray-600">
                <span className="truncate max-w-[200px]">{isMl ? i.listing.name_ml : i.listing.name} ×{i.quantity}</span>
                <span className="font-medium text-kerala-deep flex-shrink-0">AED {(i.listing.price * i.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24 space-y-3">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-500"><span>{isMl ? 'ഉൽപ്പന്നങ്ങൾ' : 'Items'}</span><span>AED {totalAmount.toFixed(2)}</span></div>
            <div className="flex justify-between text-gray-500"><span>{isMl ? 'ഡെലിവറി' : 'Delivery'}</span><span>AED {deliveryFee}</span></div>
            <div className="flex justify-between text-gray-500"><span>VAT 5%</span><span>AED {vat.toFixed(2)}</span></div>
            <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-kerala-deep text-lg">
              <span>{isMl ? 'ആകെ' : 'Total'}</span><span>AED {total.toFixed(2)}</span>
            </div>
          </div>
          <button onClick={handlePay} disabled={loading}
            className={`w-full flex items-center justify-center gap-2 font-bold py-4 rounded-xl transition-all text-base shadow-lg text-white disabled:opacity-80 ${payMethod === 'whatsapp' ? 'bg-green-500 hover:bg-green-600' : 'bg-kerala-gold hover:bg-kerala-deep'}`}>
            {loading ? (
              <><svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg> {isMl ? 'പ്രോസസ്...' : 'Processing...'}</>
            ) : payMethod === 'whatsapp' ? (
              <><MessageCircle size={16} /> {isMl ? 'WhatsApp-ൽ ഓർഡർ' : 'Order via WhatsApp'}</>
            ) : (
              <><Lock size={16} /> {isMl ? 'ഇപ്പോൾ പേ ചെയ്യൂ' : 'Pay Now'} — AED {total.toFixed(2)}</>
            )}
          </button>
          <button onClick={onBack} disabled={loading}
            className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-600 hover:border-kerala-green hover:text-kerala-green font-semibold py-3 rounded-xl transition-all text-sm disabled:opacity-50">
            <ChevronLeft size={15} /> {isMl ? 'വിവരങ്ങളിലേക്ക്' : 'Back to Details'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── CONFIRMED STEP ──────────────────────────────────────────────────────────
function ConfirmedStep({ orderNumber, locale, isMl }: { orderNumber: string; locale: string; isMl: boolean }) {
  const { items, totalAmount, clearCart } = useCart()
  const router = useRouter()
  const deliveryDate = new Date(); deliveryDate.setDate(deliveryDate.getDate() + 4)
  const dateStr = deliveryDate.toLocaleDateString(isMl ? 'ml-IN' : 'en-AE', { weekday: 'long', day: 'numeric', month: 'long' })
  const whatsappMsg = encodeURIComponent(`Just ordered from MalayaliBusiness! 🛍️ Order #${orderNumber}`)
  const total = totalAmount + 15 + Math.round((totalAmount + 15) * 0.05 * 100) / 100

  function handleContinue() { clearCart(); router.push(`/${locale}/shop`) }

  return (
    <div className="max-w-lg mx-auto text-center space-y-6">
      <div className="w-24 h-24 rounded-full bg-kerala-green/10 flex items-center justify-center mx-auto" style={{ animation: 'scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards' }}>
        <style>{`@keyframes scaleIn{0%{transform:scale(0);opacity:0}100%{transform:scale(1);opacity:1}}`}</style>
        <CheckCircle size={52} className="text-kerala-green" />
      </div>
      <div>
        <h2 className="font-serif text-3xl font-bold text-kerala-deep mb-1">{isMl ? 'ഓർഡർ സ്ഥിരീകരിച്ചു!' : 'Order Confirmed!'}</h2>
        <p className="text-gray-500 text-sm">{isMl ? 'നന്ദി! നിങ്ങളുടെ ഓർഡർ ലഭിച്ചു.' : 'Thank you! Your order has been received.'}</p>
      </div>
      <div className="bg-kerala-cream rounded-2xl p-5 text-left space-y-3">
        <div className="flex justify-between text-sm"><span className="text-gray-500">{isMl ? 'ഓർഡർ നം.' : 'Order No.'}</span><span className="font-bold font-mono text-kerala-deep">#{orderNumber}</span></div>
        <div className="flex justify-between text-sm"><span className="text-gray-500">{isMl ? 'ഡെലിവറി' : 'Est. Delivery'}</span><span className="font-semibold text-kerala-green">{dateStr}</span></div>
        <div className="border-t border-gray-200 pt-3 space-y-2">
          {items.map(i => (
            <div key={i.listing.id} className="flex justify-between text-sm">
              <span className="text-gray-600">{isMl ? i.listing.name_ml : i.listing.name} ×{i.quantity}</span>
              <span className="font-medium">AED {(i.listing.price * i.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold text-kerala-deep border-t border-gray-200 pt-2 mt-2">
            <span>{isMl ? 'ആകെ' : 'Total'}</span><span>AED {total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <button onClick={handleContinue}
          className="flex items-center justify-center gap-2 border-2 border-kerala-green text-kerala-green font-semibold py-3 rounded-xl hover:bg-kerala-green hover:text-white transition-all text-sm">
          <ShoppingCart size={15} /> {isMl ? 'ഷോപ്പിംഗ് തുടരൂ' : 'Continue Shopping'}
        </button>
        <Link href={`/${locale}/dashboard`}
          className="flex items-center justify-center gap-2 bg-kerala-deep text-white font-semibold py-3 rounded-xl hover:bg-kerala-green transition-all text-sm">
          <ClipboardList size={15} /> {isMl ? 'ഓർഡറുകൾ' : 'View Orders'}
        </Link>
      </div>
      <a href={`https://wa.me/?text=${whatsappMsg}`} target="_blank" rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition-all text-sm">
        <MessageCircle size={16} /> {isMl ? 'WhatsApp-ൽ പങ്കുവെക്കൂ' : 'Share via WhatsApp'}
      </a>
    </div>
  )
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const locale = useLocale()
  const isMl = locale === 'ml'
  const [step, setStep] = useState<Step>('cart')
  const [deliveryForm, setDeliveryForm] = useState<DeliveryForm>({
    fullName: '', phone: '', email: '', address1: '', address2: '',
    city: '', emirate: '', postalCode: '', notes: '', deliveryMethod: 'standard',
  })
  const orderNumber = useMemo(() => String(Math.floor(100000 + Math.random() * 900000)), [])

  return (
    <main className="min-h-screen bg-kerala-cream">
      <Navbar />
      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-gray-400 text-xs mb-6 mt-4">
            <Link href={`/${locale}`} className="hover:text-kerala-green">{isMl ? 'ഹോം' : 'Home'}</Link>
            <ChevronRight size={12} />
            <Link href={`/${locale}/shop`} className="hover:text-kerala-green">{isMl ? 'ഷോപ്പ്' : 'Shop'}</Link>
            <ChevronRight size={12} />
            <span className="text-kerala-deep font-medium">{isMl ? 'ചെക്ക്ഔട്ട്' : 'Checkout'}</span>
          </div>
          <StepIndicator step={step} isMl={isMl} />
          {step === 'cart' && <CartStep onNext={() => setStep('details')} isMl={isMl} locale={locale} />}
          {step === 'details' && <DetailsStep form={deliveryForm} setForm={setDeliveryForm} onBack={() => setStep('cart')} onNext={() => setStep('payment')} isMl={isMl} />}
          {step === 'payment' && <PaymentStep onBack={() => setStep('details')} onPay={() => setStep('confirmed')} isMl={isMl} />}
          {step === 'confirmed' && <ConfirmedStep orderNumber={orderNumber} locale={locale} isMl={isMl} />}
        </div>
      </div>
      <Footer />
    </main>
  )
}
