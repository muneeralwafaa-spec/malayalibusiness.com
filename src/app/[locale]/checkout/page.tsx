'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Tag,
  ChevronRight,
  ChevronLeft,
  Truck,
  Zap,
  Shield,
  CheckCircle,
  CreditCard,
  Lock,
  MessageCircle,
  ClipboardList,
} from 'lucide-react'

type Step = 'cart' | 'details' | 'payment' | 'confirmed'

interface CartItem {
  id: string
  name: string
  nameMl: string
  price: number
  qty: number
  image: string
}

const INITIAL_ITEMS: CartItem[] = [
  {
    id: '1',
    name: 'Premium Cold-Pressed Coconut Oil',
    nameMl: 'തേങ്ങ എണ്ണ – ശീതകൊടുങ്ങൽ',
    price: 45,
    qty: 2,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=200&q=80&auto=format&fit=crop',
  },
  {
    id: '2',
    name: 'Kerala Spice Collection Box',
    nameMl: 'കേരള മസാല കലക്ഷൻ',
    price: 89,
    qty: 1,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=200&q=80&auto=format&fit=crop',
  },
]

const EMIRATES = [
  'Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah',
]

const STEPS_EN = ['Cart', 'Details', 'Payment', 'Confirmed']
const STEPS_ML = ['കാർട്ട്', 'വിവരങ്ങൾ', 'പേയ്മെന്റ്', 'സ്ഥിരീകരണം']

function StepIndicator({ step, isMl }: { step: Step; isMl: boolean }) {
  const steps: Step[] = ['cart', 'details', 'payment', 'confirmed']
  const current = steps.indexOf(step)
  const labels = isMl ? STEPS_ML : STEPS_EN

  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                i < current
                  ? 'bg-kerala-green text-white'
                  : i === current
                  ? 'bg-kerala-gold text-white ring-4 ring-kerala-gold/30'
                  : 'bg-gray-200 text-gray-400'
              }`}
            >
              {i < current ? <CheckCircle size={18} /> : i + 1}
            </div>
            <span
              className={`mt-1.5 text-xs font-medium whitespace-nowrap ${
                i === current ? 'text-kerala-gold' : i < current ? 'text-kerala-green' : 'text-gray-400'
              }`}
            >
              {labels[i]}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`h-0.5 w-12 sm:w-20 mx-1 mb-5 transition-all ${
                i < current ? 'bg-kerala-green' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}

// ─── CART STEP ───────────────────────────────────────────────────────────────
function CartStep({
  items,
  setItems,
  onNext,
  isMl,
  deliveryFee,
}: {
  items: CartItem[]
  setItems: React.Dispatch<React.SetStateAction<CartItem[]>>
  onNext: () => void
  isMl: boolean
  deliveryFee: number
}) {
  const [promo, setPromo] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [promoError, setPromoError] = useState(false)

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0)
  const discount = promoApplied ? Math.round(subtotal * 0.1) : 0
  const vatBase = subtotal - discount + deliveryFee
  const vat = Math.round(vatBase * 0.05 * 100) / 100
  const total = vatBase + vat

  function applyPromo() {
    if (promo.trim().toUpperCase() === 'KERALA10') {
      setPromoApplied(true)
      setPromoError(false)
    } else {
      setPromoError(true)
      setPromoApplied(false)
    }
  }

  function updateQty(id: string, delta: number) {
    setItems(prev =>
      prev.map(it => it.id === id ? { ...it, qty: Math.max(1, it.qty + delta) } : it)
    )
  }

  function removeItem(id: string) {
    setItems(prev => prev.filter(it => it.id !== id))
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Items */}
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-serif text-xl font-bold text-kerala-deep flex items-center gap-2">
              <ShoppingCart size={20} className="text-kerala-green" />
              {isMl ? 'നിങ്ങളുടെ കാർട്ട്' : 'Your Cart'} ({items.length})
            </h2>
          </div>
          {items.length === 0 ? (
            <div className="py-16 text-center text-gray-400">
              <ShoppingCart size={40} className="mx-auto mb-3 opacity-30" />
              <p>{isMl ? 'കാർട്ട് ശൂന്യം' : 'Your cart is empty'}</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {items.map(item => (
                <li key={item.id} className="flex gap-4 p-5 hover:bg-gray-50/50 transition-colors">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-kerala-deep text-sm leading-snug">
                      {isMl ? item.nameMl : item.name}
                    </h3>
                    <p className="text-kerala-green font-bold mt-1">AED {item.price}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-1">
                        <button
                          onClick={() => updateQty(item.id, -1)}
                          className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-kerala-green"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="text-sm font-semibold w-5 text-center">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.id, 1)}
                          className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-kerala-green"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                      <span className="text-xs text-gray-400">
                        {isMl ? 'ആകെ:' : 'Total:'} AED {item.price * item.qty}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="flex-shrink-0 text-gray-300 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Promo Code */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-semibold text-kerala-deep text-sm mb-3 flex items-center gap-2">
            <Tag size={15} className="text-kerala-gold" />
            {isMl ? 'പ്രോമോ കോഡ്' : 'Promo Code'}
          </h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={promo}
              onChange={e => { setPromo(e.target.value); setPromoError(false) }}
              placeholder={isMl ? 'കോഡ് നൽകൂ' : 'Enter code'}
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 focus:border-kerala-green"
            />
            <button
              onClick={applyPromo}
              className="px-5 py-2.5 bg-kerala-green text-white rounded-xl text-sm font-semibold hover:bg-kerala-green-light transition-colors"
            >
              {isMl ? 'നടപ്പിലാക്കൂ' : 'Apply'}
            </button>
          </div>
          {promoApplied && (
            <p className="text-kerala-green text-xs mt-2 flex items-center gap-1">
              <CheckCircle size={13} /> {isMl ? '"KERALA10" — 10% കിഴിവ് ലഭിച്ചു!' : '"KERALA10" applied — 10% off!'}
            </p>
          )}
          {promoError && (
            <p className="text-red-500 text-xs mt-2">
              {isMl ? 'അസാധുവായ കോഡ്. ശ്രമിക്കൂ: KERALA10' : 'Invalid code. Try: KERALA10'}
            </p>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
          <h3 className="font-serif text-lg font-bold text-kerala-deep mb-5">
            {isMl ? 'ഓർഡർ സംഗ്രഹം' : 'Order Summary'}
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>{isMl ? 'ഉപ-ആകെ' : 'Subtotal'}</span>
              <span>AED {subtotal}</span>
            </div>
            {promoApplied && (
              <div className="flex justify-between text-kerala-green">
                <span>{isMl ? 'കിഴിവ് (10%)' : 'Discount (10%)'}</span>
                <span>−AED {discount}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-600">
              <span>{isMl ? 'ഡെലിവറി' : 'Delivery'}</span>
              <span>AED {deliveryFee}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>{isMl ? 'VAT (5%)' : 'VAT (5%)'}</span>
              <span>AED {vat.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-kerala-deep text-base">
              <span>{isMl ? 'ആകെ' : 'Total'}</span>
              <span>AED {total.toFixed(2)}</span>
            </div>
          </div>
          <button
            onClick={onNext}
            disabled={items.length === 0}
            className="mt-6 w-full flex items-center justify-center gap-2 bg-kerala-green hover:bg-kerala-green-light disabled:bg-gray-300 text-white font-semibold py-3.5 rounded-xl transition-all"
          >
            {isMl ? 'വിവരങ്ങളിലേക്ക്' : 'Continue to Details'}
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── DETAILS STEP ────────────────────────────────────────────────────────────
interface DeliveryForm {
  fullName: string
  phone: string
  email: string
  address1: string
  address2: string
  city: string
  emirate: string
  postalCode: string
  notes: string
  deliveryMethod: 'standard' | 'express'
}

function DetailsStep({
  form,
  setForm,
  onBack,
  onNext,
  isMl,
}: {
  form: DeliveryForm
  setForm: React.Dispatch<React.SetStateAction<DeliveryForm>>
  onBack: () => void
  onNext: () => void
  isMl: boolean
}) {
  function field(key: keyof DeliveryForm, label: string, labelMl: string, props?: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
          {isMl ? labelMl : label}
        </label>
        <input
          {...props}
          value={form[key] as string}
          onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 focus:border-kerala-green bg-gray-50"
        />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {/* Address */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-serif text-xl font-bold text-kerala-deep mb-5">
            {isMl ? 'ഡെലിവറി വിലാസം' : 'Delivery Address'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field('fullName', 'Full Name', 'മുഴുവൻ പേര്', { placeholder: 'Muhammed Ali' })}
            {field('phone', 'Phone', 'ഫോൺ', { type: 'tel', placeholder: '+971 50 123 4567' })}
            {field('email', 'Email', 'ഇമെയിൽ', { type: 'email', placeholder: 'you@example.com', className: 'sm:col-span-2 w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 focus:border-kerala-green bg-gray-50' })}
            <div className="sm:col-span-2">
              {field('address1', 'Address Line 1', 'വിലാസം 1', { placeholder: 'Flat / Villa number, Building name' })}
            </div>
            <div className="sm:col-span-2">
              {field('address2', 'Address Line 2', 'വിലാസം 2', { placeholder: 'Street, Area (optional)' })}
            </div>
            {field('city', 'City', 'നഗരം', { placeholder: 'Dubai' })}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                {isMl ? 'എമിറേറ്റ്' : 'Emirate'}
              </label>
              <select
                value={form.emirate}
                onChange={e => setForm(prev => ({ ...prev, emirate: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 focus:border-kerala-green bg-gray-50"
              >
                <option value="">{isMl ? 'തിരഞ്ഞെടുക്കൂ' : 'Select Emirate'}</option>
                {EMIRATES.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            {field('postalCode', 'Postal Code', 'പോസ്റ്റൽ കോഡ്', { placeholder: '00000' })}
          </div>
        </div>

        {/* Delivery Method */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-serif text-xl font-bold text-kerala-deep mb-5">
            {isMl ? 'ഡെലിവറി രീതി' : 'Delivery Method'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {([
              {
                value: 'standard',
                icon: Truck,
                label: 'Standard Delivery',
                labelMl: 'സ്റ്റാൻഡേർഡ് ഡെലിവറി',
                sub: '3–5 business days',
                subMl: '3–5 ബിസിനസ് ദിവസം',
                price: 'AED 15',
              },
              {
                value: 'express',
                icon: Zap,
                label: 'Express Delivery',
                labelMl: 'എക്സ്പ്രസ് ഡെലിവറി',
                sub: '1–2 business days',
                subMl: '1–2 ബിസിനസ് ദിവസം',
                price: 'AED 35',
              },
            ] as const).map(opt => (
              <button
                key={opt.value}
                onClick={() => setForm(prev => ({ ...prev, deliveryMethod: opt.value }))}
                className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                  form.deliveryMethod === opt.value
                    ? 'border-kerala-green bg-kerala-green/5'
                    : 'border-gray-200 hover:border-kerala-green/40'
                }`}
              >
                <opt.icon size={22} className={form.deliveryMethod === opt.value ? 'text-kerala-green mt-0.5' : 'text-gray-400 mt-0.5'} />
                <div className="flex-1">
                  <p className="font-semibold text-sm text-kerala-deep">
                    {isMl ? opt.labelMl : opt.label}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{isMl ? opt.subMl : opt.sub}</p>
                </div>
                <span className="font-bold text-sm text-kerala-green">{opt.price}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-serif text-lg font-bold text-kerala-deep mb-4">
            {isMl ? 'ഓർഡർ കുറിപ്പുകൾ' : 'Order Notes'}
          </h2>
          <textarea
            value={form.notes}
            onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
            placeholder={isMl ? 'ഡ്രൈവർക്ക് നിർദ്ദേശം, gift wrap ഇത്യാദി...' : 'Instructions for delivery, gift wrap, etc.'}
            rows={3}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 focus:border-kerala-green bg-gray-50 resize-none"
          />
        </div>
      </div>

      {/* Side buttons */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24 space-y-3">
          <button
            onClick={onNext}
            className="w-full flex items-center justify-center gap-2 bg-kerala-green hover:bg-kerala-green-light text-white font-semibold py-3.5 rounded-xl transition-all"
          >
            {isMl ? 'പേയ്മെന്റിലേക്ക്' : 'Continue to Payment'}
            <ChevronRight size={16} />
          </button>
          <button
            onClick={onBack}
            className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-600 hover:border-kerala-green hover:text-kerala-green font-semibold py-3 rounded-xl transition-all text-sm"
          >
            <ChevronLeft size={15} />
            {isMl ? 'കാർട്ടിലേക്ക്' : 'Back to Cart'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── PAYMENT STEP ────────────────────────────────────────────────────────────
interface CardForm {
  number: string
  expiry: string
  cvv: string
  name: string
  sameAddress: boolean
}

function detectCardType(num: string): 'visa' | 'mastercard' | null {
  if (num.startsWith('4')) return 'visa'
  if (num.startsWith('5') || num.startsWith('2')) return 'mastercard'
  return null
}

function formatCardNumber(val: string) {
  return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
}

function formatExpiry(val: string) {
  const digits = val.replace(/\D/g, '').slice(0, 4)
  if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2)
  return digits
}

function PaymentStep({
  items,
  total,
  onBack,
  onPay,
  isMl,
}: {
  items: CartItem[]
  total: number
  onBack: () => void
  onPay: () => void
  isMl: boolean
}) {
  const [card, setCard] = useState<CardForm>({
    number: '',
    expiry: '',
    cvv: '',
    name: '',
    sameAddress: true,
  })
  const [loading, setLoading] = useState(false)
  const [summaryOpen, setSummaryOpen] = useState(false)

  const cardType = detectCardType(card.number.replace(/\s/g, ''))

  function handlePay() {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      onPay()
    }, 1800)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {/* Card Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-serif text-xl font-bold text-kerala-deep flex items-center gap-2">
              <CreditCard size={20} className="text-kerala-green" />
              {isMl ? 'കാർഡ് വിവരങ്ങൾ' : 'Card Details'}
            </h2>
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded italic">VISA</div>
              <div className="flex">
                <div className="w-5 h-5 rounded-full bg-red-500 opacity-90" />
                <div className="w-5 h-5 rounded-full bg-yellow-400 opacity-90 -ml-2" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Card Number */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                {isMl ? 'കാർഡ് നമ്പർ' : 'Card Number'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  value={card.number}
                  onChange={e => setCard(prev => ({ ...prev, number: formatCardNumber(e.target.value) }))}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className="w-full px-4 py-3 pr-14 border border-gray-200 rounded-xl text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-kerala-green/30 focus:border-kerala-green bg-gray-50"
                />
                {cardType && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold uppercase">
                    {cardType === 'visa' ? (
                      <span className="text-blue-600 font-serif italic text-base">VISA</span>
                    ) : (
                      <span className="flex">
                        <span className="w-4 h-4 rounded-full bg-red-500 inline-block" />
                        <span className="w-4 h-4 rounded-full bg-yellow-400 inline-block -ml-2" />
                      </span>
                    )}
                  </span>
                )}
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                {isMl ? 'കാർഡ്‌ഹോൾഡർ നാമം' : 'Cardholder Name'}
              </label>
              <input
                type="text"
                value={card.name}
                onChange={e => setCard(prev => ({ ...prev, name: e.target.value }))}
                placeholder="MUHAMMED ALI"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-kerala-green/30 focus:border-kerala-green bg-gray-50"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Expiry */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  {isMl ? 'കാലഹരണ തീയതി' : 'Expiry (MM/YY)'}
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={card.expiry}
                  onChange={e => setCard(prev => ({ ...prev, expiry: formatExpiry(e.target.value) }))}
                  placeholder="MM/YY"
                  maxLength={5}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-kerala-green/30 focus:border-kerala-green bg-gray-50"
                />
              </div>
              {/* CVV */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  {isMl ? 'CVV' : 'CVV'}
                </label>
                <input
                  type="password"
                  inputMode="numeric"
                  value={card.cvv}
                  onChange={e => setCard(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                  placeholder="•••"
                  maxLength={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-kerala-green/30 focus:border-kerala-green bg-gray-50"
                />
              </div>
            </div>

            {/* Same address */}
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => setCard(prev => ({ ...prev, sameAddress: !prev.sameAddress }))}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                  card.sameAddress ? 'bg-kerala-green border-kerala-green' : 'border-gray-300'
                }`}
              >
                {card.sameAddress && <CheckCircle size={13} className="text-white" />}
              </div>
              <span className="text-sm text-gray-700">
                {isMl ? 'ബില്ലിംഗ് വിലാസം ഡെലിവറി വിലാസം പോലെ' : 'Billing address same as delivery'}
              </span>
            </label>
          </div>

          {/* SSL Badge */}
          <div className="mt-5 flex items-center gap-2 text-xs text-gray-400 bg-gray-50 px-3 py-2.5 rounded-lg">
            <Shield size={14} className="text-kerala-green flex-shrink-0" />
            <span>
              {isMl
                ? '256-bit SSL എൻക്രിപ്ഷൻ വഴി സുരക്ഷിതം. നിങ്ങളുടെ കാർഡ് വിവരങ്ങൾ ഒരിക്കലും സംഭരിക്കില്ല.'
                : 'Secured by 256-bit SSL encryption. Your card details are never stored.'}
            </span>
          </div>
        </div>

        {/* Collapsed order summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <button
            onClick={() => setSummaryOpen(!summaryOpen)}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
          >
            <span className="font-semibold text-kerala-deep text-sm">
              {isMl ? 'ഓർഡർ സംഗ്രഹം' : 'Order Summary'} ({items.length} {isMl ? 'ഇനം' : 'items'})
            </span>
            <ChevronRight size={16} className={`text-gray-400 transition-transform ${summaryOpen ? 'rotate-90' : ''}`} />
          </button>
          {summaryOpen && (
            <div className="px-6 pb-4 divide-y divide-gray-50">
              {items.map(it => (
                <div key={it.id} className="flex justify-between py-3 text-sm">
                  <span className="text-gray-600">{isMl ? it.nameMl : it.name} ×{it.qty}</span>
                  <span className="font-semibold text-kerala-deep">AED {it.price * it.qty}</span>
                </div>
              ))}
              <div className="flex justify-between pt-3 font-bold text-kerala-deep">
                <span>{isMl ? 'ആകെ' : 'Total'}</span>
                <span>AED {total.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24 space-y-3">
          <div className="flex justify-between font-bold text-kerala-deep text-lg mb-4">
            <span>{isMl ? 'ആകെ' : 'Total'}</span>
            <span>AED {total.toFixed(2)}</span>
          </div>
          <button
            onClick={handlePay}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-kerala-gold hover:bg-kerala-gold-light disabled:opacity-80 text-white font-bold py-4 rounded-xl transition-all text-base shadow-lg"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                {isMl ? 'പ്രോസസ്സ് ചെയ്യുന്നു...' : 'Processing...'}
              </>
            ) : (
              <>
                <Lock size={16} />
                {isMl ? 'ഇപ്പോൾ പേ ചെയ്യൂ' : 'Pay Now'} — AED {total.toFixed(2)}
              </>
            )}
          </button>
          <button
            onClick={onBack}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-600 hover:border-kerala-green hover:text-kerala-green font-semibold py-3 rounded-xl transition-all text-sm disabled:opacity-50"
          >
            <ChevronLeft size={15} />
            {isMl ? 'വിവരങ്ങളിലേക്ക്' : 'Back to Details'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── CONFIRMED STEP ──────────────────────────────────────────────────────────
function ConfirmedStep({
  items,
  total,
  orderNumber,
  locale,
  isMl,
}: {
  items: CartItem[]
  total: number
  orderNumber: string
  locale: string
  isMl: boolean
}) {
  const deliveryDate = new Date()
  deliveryDate.setDate(deliveryDate.getDate() + 4)
  const dateStr = deliveryDate.toLocaleDateString(isMl ? 'ml-IN' : 'en-AE', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  const whatsappMsg = encodeURIComponent(
    `I just ordered from MalayaliBusiness! 🛍️ Order #${orderNumber}. Check it out: malayalibusiness.com`
  )

  return (
    <div className="max-w-lg mx-auto text-center space-y-6">
      {/* Success Animation */}
      <div
        className="w-24 h-24 rounded-full bg-kerala-green/10 flex items-center justify-center mx-auto"
        style={{ animation: 'scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards' }}
      >
        <style>{`@keyframes scaleIn{0%{transform:scale(0);opacity:0}100%{transform:scale(1);opacity:1}}`}</style>
        <CheckCircle size={52} className="text-kerala-green" />
      </div>

      <div>
        <h2 className="font-serif text-3xl font-bold text-kerala-deep mb-1">
          {isMl ? 'ഓർഡർ സ്ഥിരീകരിച്ചു!' : 'Order Confirmed!'}
        </h2>
        <p className="text-gray-500 text-sm">
          {isMl ? 'നന്ദി! നിങ്ങളുടെ ഓർഡർ ലഭിച്ചു.' : 'Thank you! Your order has been received.'}
        </p>
      </div>

      <div className="bg-kerala-cream rounded-2xl p-5 text-left space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">{isMl ? 'ഓർഡർ നം.' : 'Order No.'}</span>
          <span className="font-bold text-kerala-deep font-mono">#{orderNumber}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">{isMl ? 'ഡെലിവറി തീയതി' : 'Est. Delivery'}</span>
          <span className="font-semibold text-kerala-green">{dateStr}</span>
        </div>
        <div className="border-t border-gray-200 pt-3 space-y-2">
          {items.map(it => (
            <div key={it.id} className="flex justify-between text-sm">
              <span className="text-gray-600">{isMl ? it.nameMl : it.name} ×{it.qty}</span>
              <span className="font-medium">AED {it.price * it.qty}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold text-kerala-deep border-t border-gray-200 pt-2 mt-2">
            <span>{isMl ? 'ആകെ' : 'Total'}</span>
            <span>AED {total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Link
          href={`/${locale}/shop`}
          className="flex items-center justify-center gap-2 border-2 border-kerala-green text-kerala-green font-semibold py-3 rounded-xl hover:bg-kerala-green hover:text-white transition-all text-sm"
        >
          <ShoppingCart size={15} />
          {isMl ? 'ഷോപ്പിംഗ് തുടരൂ' : 'Continue Shopping'}
        </Link>
        <Link
          href={`/${locale}/dashboard`}
          className="flex items-center justify-center gap-2 bg-kerala-deep text-white font-semibold py-3 rounded-xl hover:bg-kerala-green transition-all text-sm"
        >
          <ClipboardList size={15} />
          {isMl ? 'ഓർഡറുകൾ കാണൂ' : 'View Orders'}
        </Link>
      </div>

      <a
        href={`https://wa.me/?text=${whatsappMsg}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition-all text-sm"
      >
        <MessageCircle size={16} />
        {isMl ? 'WhatsApp-ൽ പങ്കുവെക്കൂ' : 'Share via WhatsApp'}
      </a>
    </div>
  )
}

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const locale = useLocale()
  const isMl = locale === 'ml'

  const [step, setStep] = useState<Step>('cart')
  const [items, setItems] = useState<CartItem[]>(INITIAL_ITEMS)
  const [deliveryForm, setDeliveryForm] = useState<DeliveryForm>({
    fullName: '', phone: '', email: '', address1: '', address2: '',
    city: '', emirate: '', postalCode: '', notes: '',
    deliveryMethod: 'standard',
  })

  const orderNumber = useMemo(() => String(Math.floor(100000 + Math.random() * 900000)), [])

  const deliveryFee = deliveryForm.deliveryMethod === 'express' ? 35 : 15
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0)
  const vat = Math.round((subtotal + deliveryFee) * 0.05 * 100) / 100
  const total = subtotal + deliveryFee + vat

  return (
    <main className="min-h-screen bg-kerala-cream">
      <Navbar />

      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-gray-400 text-xs mb-6 mt-4">
            <Link href={`/${locale}`} className="hover:text-kerala-green">{isMl ? 'ഹോം' : 'Home'}</Link>
            <ChevronRight size={12} />
            <Link href={`/${locale}/shop`} className="hover:text-kerala-green">{isMl ? 'ഷോപ്പ്' : 'Shop'}</Link>
            <ChevronRight size={12} />
            <span className="text-kerala-deep font-medium">{isMl ? 'ചെക്ക്ഔട്ട്' : 'Checkout'}</span>
          </div>

          <StepIndicator step={step} isMl={isMl} />

          {step === 'cart' && (
            <CartStep
              items={items}
              setItems={setItems}
              onNext={() => setStep('details')}
              isMl={isMl}
              deliveryFee={deliveryFee}
            />
          )}
          {step === 'details' && (
            <DetailsStep
              form={deliveryForm}
              setForm={setDeliveryForm}
              onBack={() => setStep('cart')}
              onNext={() => setStep('payment')}
              isMl={isMl}
            />
          )}
          {step === 'payment' && (
            <PaymentStep
              items={items}
              total={total}
              onBack={() => setStep('details')}
              onPay={() => setStep('confirmed')}
              isMl={isMl}
            />
          )}
          {step === 'confirmed' && (
            <ConfirmedStep
              items={items}
              total={total}
              orderNumber={orderNumber}
              locale={locale}
              isMl={isMl}
            />
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}
