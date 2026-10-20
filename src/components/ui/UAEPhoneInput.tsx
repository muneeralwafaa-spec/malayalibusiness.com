'use client'

import { useEffect, useState } from 'react'

const PREFIXES = ['50', '52', '53', '54', '55', '56', '57', '58']

interface Props {
  value: string
  onChange: (val: string) => void
  placeholder?: string
  className?: string
  required?: boolean
  hasError?: boolean
}

function parse(val: string): { prefix: string; local: string } {
  // Accept formats: +97150xxxxxxx, 050xxxxxxx, 50xxxxxxx, +971 50 xxx xxxx
  const digits = val.replace(/\D/g, '')
  // Strip leading 971 or 00971
  const stripped = digits.startsWith('971') ? digits.slice(3)
    : digits.startsWith('00971') ? digits.slice(5)
    : digits
  // Strip leading 0
  const local = stripped.startsWith('0') ? stripped.slice(1) : stripped
  const prefix = PREFIXES.find(p => local.startsWith(p)) ?? '50'
  const number = local.startsWith(prefix) ? local.slice(prefix.length) : local
  return { prefix, local: number }
}

export default function UAEPhoneInput({ value, onChange, placeholder = '1234567', className = '', required, hasError }: Props) {
  const parsed = parse(value)
  const [prefix, setPrefix] = useState(parsed.prefix)
  const [number, setNumber] = useState(parsed.local)

  // Sync external value changes (e.g. form reset)
  useEffect(() => {
    const p = parse(value)
    setPrefix(p.prefix)
    setNumber(p.local)
  }, [value])

  function handleNumber(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, '').replace(/^0+/, '').slice(0, 7)
    setNumber(raw)
    emit(prefix, raw)
  }

  function handlePrefix(e: React.ChangeEvent<HTMLSelectElement>) {
    setPrefix(e.target.value)
    emit(e.target.value, number)
  }

  function emit(p: string, n: string) {
    onChange(n ? `+971${p}${n}` : '')
  }

  const base = `flex items-center border rounded-xl overflow-hidden text-sm focus-within:ring-2 focus-within:ring-kerala-green/30 ${hasError ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'} ${className}`

  return (
    <div className={base}>
      {/* Country code — fixed */}
      <span className="px-2.5 py-2.5 text-gray-500 font-semibold bg-gray-50 border-r border-gray-200 text-xs shrink-0 select-none">
        🇦🇪 +971
      </span>
      {/* Operator prefix dropdown */}
      <select
        value={prefix}
        onChange={handlePrefix}
        className="px-2 py-2.5 bg-gray-50 border-r border-gray-200 text-sm font-semibold text-gray-700 focus:outline-none cursor-pointer shrink-0"
        aria-label="UAE mobile prefix"
      >
        {PREFIXES.map(p => (
          <option key={p} value={p}>0{p}</option>
        ))}
      </select>
      {/* 7-digit local number */}
      <input
        type="tel"
        value={number}
        onChange={handleNumber}
        placeholder={placeholder}
        required={required}
        maxLength={7}
        inputMode="numeric"
        className="flex-1 px-3 py-2.5 focus:outline-none bg-transparent min-w-0"
        aria-label="Phone number"
      />
    </div>
  )
}
