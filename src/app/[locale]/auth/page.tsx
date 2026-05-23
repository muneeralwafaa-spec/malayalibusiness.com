'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock, User, Phone, Building2, CheckCircle, ArrowRight, Loader2, AlertCircle } from 'lucide-react'
import { signIn, signUp, signInWithGoogle } from '@/lib/auth'

type Tab = 'login' | 'register'
type AccountType = 'user' | 'business'

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

export default function AuthPage() {
  const locale = useLocale()
  const isMl = locale === 'ml'
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('login')
  const [accountType, setAccountType] = useState<AccountType>('user')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // Form state
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPhone, setRegPhone] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regConfirmPassword, setRegConfirmPassword] = useState('')
  const [regBusiness, setRegBusiness] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) { setError(isMl ? 'എല്ലാ ഫീൽഡുകളും പൂരിപ്പിക്കൂ' : 'Please fill in all fields'); return }
    setError(''); setSubmitting(true)
    const { error: err } = await signIn(loginEmail, loginPassword)
    setSubmitting(false)
    if (err) { setError(err.message); return }
    router.push(`/${locale}/dashboard`)
  }

  const handleRegister = async () => {
    if (!regName || !regEmail || !regPassword) { setError(isMl ? 'എല്ലാ ഫീൽഡുകളും പൂരിപ്പിക്കൂ' : 'Please fill in all fields'); return }
    if (regPassword !== regConfirmPassword) { setError(isMl ? 'പാസ്‌വേഡ് പൊരുത്തപ്പെടുന്നില്ല' : 'Passwords do not match'); return }
    if (regPassword.length < 8) { setError(isMl ? 'പാസ്‌വേഡ് കുറഞ്ഞത് 8 അക്ഷരം ആണ്' : 'Password must be at least 8 characters'); return }
    setError(''); setSubmitting(true)
    const { error: err } = await signUp({
      email: regEmail, password: regPassword,
      fullName: regName, phone: regPhone,
      isBusiness: accountType === 'business',
      businessName: accountType === 'business' ? regBusiness : undefined,
    })
    setSubmitting(false)
    if (err) { setError(err.message); return }
    setSuccessMsg(isMl ? 'അക്കൗണ്ട് ഉണ്ടാക്കി! ഇമെയിൽ സ്ഥിരീകരിക്കൂ.' : 'Account created! Please check your email to verify.')
  }

  const handleGoogle = async () => {
    setError('')
    const { error: err } = await signInWithGoogle(locale)
    if (err) setError(err.message)
  }

  return (
    <main className="min-h-screen bg-kerala-cream flex">
      {/* Left panel — decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80&auto=format&fit=crop"
          alt="Dubai skyline"
          fill
          className="object-cover"
          priority
          sizes="50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-kerala-deep/90 via-kerala-deep/70 to-kerala-green/50" />
        <div className="relative z-10 flex flex-col justify-between h-full p-12">
          <Link href="/en" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-kerala-gold flex items-center justify-center">
              <span className="font-serif font-bold text-white text-lg">M</span>
            </div>
            <div>
              <div className="font-serif font-bold text-white text-xl leading-none">MalayaliBusiness</div>
              <div className="text-white/50 text-xs">{isMl ? 'UAE' : 'UAE'}</div>
            </div>
          </Link>

          <div>
            <h2 className="font-serif text-4xl font-bold text-white mb-4 leading-tight">
              {isMl
                ? 'UAE-ൽ മലയാളി ബിസിനസ്\nകമ്മ്യൂണിറ്റിയിൽ ചേരൂ'
                : 'Join the UAE Malayali\nBusiness Community'}
            </h2>
            <p className="text-white/70 text-base mb-8">
              {isMl
                ? '15,000+ ബിസിനസുകൾ, 50,000+ അംഗങ്ങൾ, ഒരു കമ്മ്യൂണിറ്റി.'
                : '15,000+ businesses, 50,000+ members, one community.'}
            </p>

            {/* Benefits */}
            <div className="space-y-3">
              {[
                isMl ? 'ബിസിനസ് ലിസ്റ്റ് ചെയ്ത് ഉപഭോക്താക്കളെ കണ്ടെത്തൂ' : 'List your business and reach customers',
                isMl ? 'ഇവന്റുകൾ, ജോലി ഒഴിവുകൾ, ക്ലാസിഫൈഡ്‌സ് ആക്‌സസ് ചെയ്യൂ' : 'Access events, jobs, and classifieds',
                isMl ? 'കമ്മ്യൂണിറ്റി ലേഖനങ്ങൾ വായിക്കൂ, എഴുതൂ' : 'Read and write community articles',
                isMl ? 'ഡ്യൂൽ ഭാഷ — ഇംഗ്ലീഷ്, മലയാളം' : 'Bilingual — English & Malayalam',
              ].map(b => (
                <div key={b} className="flex items-center gap-2.5 text-white/80 text-sm">
                  <CheckCircle size={16} className="text-kerala-gold-light flex-shrink-0" />
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-white/30 text-xs">
            © 2025 MalayaliBusiness UAE. {isMl ? 'എല്ലാ അവകാശങ്ങളും' : 'All rights reserved.'}
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-16 py-12">
        {/* Mobile logo */}
        <Link href="/en" className="flex items-center gap-2 mb-8 lg:hidden">
          <div className="w-8 h-8 rounded-lg bg-kerala-green flex items-center justify-center">
            <span className="font-serif font-bold text-white">M</span>
          </div>
          <span className="font-serif font-bold text-kerala-deep text-lg">MalayaliBusiness UAE</span>
        </Link>

        <div className="w-full max-w-md">
          {/* Tab switcher */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-7">
            {([['login', isMl ? 'ലോഗിൻ' : 'Sign In'], ['register', isMl ? 'രജിസ്ട്രേഷൻ' : 'Create Account']] as const).map(([t, l]) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  tab === t ? 'bg-white text-kerala-deep shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Error / Success banners */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
              <AlertCircle size={15}/>{error}
            </div>
          )}
          {successMsg && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
              <CheckCircle size={15}/>{successMsg}
            </div>
          )}

          {tab === 'login' ? (
            /* ─── LOGIN FORM ─── */
            <div>
              <h1 className="font-serif text-2xl font-bold text-kerala-deep mb-1">
                {isMl ? 'സ്വാഗതം!' : 'Welcome back!'}
              </h1>
              <p className="text-gray-500 text-sm mb-6">
                {isMl ? 'നിങ്ങളുടെ അക്കൗണ്ടിലേക്ക് ലോഗിൻ ചെയ്യൂ' : 'Sign in to your account to continue'}
              </p>

              {/* Google */}
              <button onClick={handleGoogle} className="w-full flex items-center justify-center gap-3 border border-gray-200 bg-white rounded-xl py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all mb-4">
                <GoogleIcon />
                {isMl ? 'Google ഉപയോഗിച്ച് ലോഗിൻ' : 'Continue with Google'}
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400">{isMl ? 'അല്ലെങ്കിൽ' : 'or'}</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {isMl ? 'ഇമെയിൽ' : 'Email address'}
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                      placeholder={isMl ? 'നിങ്ങളുടെ ഇമെയിൽ' : 'you@example.com'}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 focus:border-kerala-green bg-gray-50"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-medium text-gray-700">{isMl ? 'പാസ്‌വേഡ്' : 'Password'}</label>
                    <button className="text-kerala-green text-xs font-medium hover:underline">
                      {isMl ? 'മറന്നോ?' : 'Forgot password?'}
                    </button>
                  </div>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 focus:border-kerala-green bg-gray-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
              </div>

              <button onClick={handleLogin} disabled={submitting}
                className="w-full mt-5 bg-kerala-green hover:bg-kerala-green-light disabled:bg-gray-300 text-white font-semibold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-sm">
                {submitting ? <Loader2 size={16} className="animate-spin"/> : <>{isMl ? 'ലോഗിൻ' : 'Sign In'}<ArrowRight size={15}/></>}
              </button>

              <p className="mt-5 text-center text-sm text-gray-500">
                {isMl ? 'അക്കൗണ്ട് ഇല്ലേ?' : "Don't have an account?"}{' '}
                <button onClick={() => setTab('register')} className="text-kerala-green font-semibold hover:underline">
                  {isMl ? 'രജിസ്ട്രേഷൻ' : 'Register now'}
                </button>
              </p>
            </div>
          ) : (
            /* ─── REGISTER FORM ─── */
            <div>
              <h1 className="font-serif text-2xl font-bold text-kerala-deep mb-1">
                {isMl ? 'അക്കൗണ്ട് ഉണ്ടാക്കൂ' : 'Create your account'}
              </h1>
              <p className="text-gray-500 text-sm mb-5">
                {isMl ? 'UAE മലയാളി കമ്മ്യൂണിറ്റിയിൽ ചേരൂ' : 'Join the UAE Malayali community today'}
              </p>

              {/* Account type toggle */}
              <div className="mb-5">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  {isMl ? 'അക്കൗണ്ട് ടൈപ്പ്' : 'Account type'}
                </p>
                <div className="flex gap-3">
                  {([
                    ['user', isMl ? 'വ്യക്തിഗതം' : 'Personal', User],
                    ['business', isMl ? 'ബിസിനസ്' : 'Business', Building2],
                  ] as const).map(([t, l, Icon]) => (
                    <button
                      key={t}
                      onClick={() => setAccountType(t)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                        accountType === t
                          ? 'bg-kerala-green/10 border-kerala-green text-kerala-green'
                          : 'border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      <Icon size={15} />
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Google */}
              <button onClick={handleGoogle} className="w-full flex items-center justify-center gap-3 border border-gray-200 bg-white rounded-xl py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all mb-4">
                <GoogleIcon />
                {isMl ? 'Google ഉപയോഗിച്ച് രജിസ്ട്രേഷൻ' : 'Sign up with Google'}
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400">{isMl ? 'അല്ലെങ്കിൽ' : 'or'}</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <div className="space-y-3.5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {isMl ? 'പേര്' : 'Full name'}
                  </label>
                  <div className="relative">
                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={regName}
                      onChange={e => setRegName(e.target.value)}
                      placeholder={isMl ? 'നിങ്ങളുടെ പേര്' : 'Your full name'}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 focus:border-kerala-green bg-gray-50"
                    />
                  </div>
                </div>

                {accountType === 'business' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {isMl ? 'ബിസിനസ് പേര്' : 'Business name'}
                    </label>
                    <div className="relative">
                      <Building2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={regBusiness}
                        onChange={e => setRegBusiness(e.target.value)}
                        placeholder={isMl ? 'ബിസിനസ് നാമം' : 'Business name'}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 focus:border-kerala-green bg-gray-50"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {isMl ? 'ഇമെയിൽ' : 'Email address'}
                  </label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={regEmail}
                      onChange={e => setRegEmail(e.target.value)}
                      placeholder={isMl ? 'നിങ്ങളുടെ ഇമെയിൽ' : 'you@example.com'}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 focus:border-kerala-green bg-gray-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {isMl ? 'ഫോൺ' : 'Phone number'}
                  </label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={e => setRegPhone(e.target.value)}
                      placeholder="+971 50 000 0000"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 focus:border-kerala-green bg-gray-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {isMl ? 'പാസ്‌വേഡ്' : 'Password'}
                  </label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={regPassword}
                      onChange={e => setRegPassword(e.target.value)}
                      placeholder="Min. 8 characters"
                      className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 focus:border-kerala-green bg-gray-50"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {isMl ? 'പാസ്‌വേഡ് ഉറപ്പിക്കൂ' : 'Confirm password'}
                  </label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={regConfirmPassword}
                      onChange={e => setRegConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kerala-green/30 focus:border-kerala-green bg-gray-50"
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                      {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Terms */}
              <label className="flex items-start gap-2.5 mt-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={e => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 accent-kerala-green"
                />
                <span className="text-xs text-gray-500 leading-relaxed">
                  {isMl ? 'ഞാൻ ' : 'I agree to the '}
                  <Link href="#" className="text-kerala-green hover:underline font-medium">
                    {isMl ? 'നിബന്ധനകൾ' : 'Terms of Service'}
                  </Link>
                  {isMl ? ' ഉം ' : ' and '}
                  <Link href="#" className="text-kerala-green hover:underline font-medium">
                    {isMl ? 'സ്വകാര്യതാ നയം' : 'Privacy Policy'}
                  </Link>
                  {isMl ? ' അംഗീകരിക്കുന്നു' : ''}
                </span>
              </label>

              <button
                onClick={handleRegister}
                disabled={!agreeTerms || submitting}
                className="w-full mt-5 bg-kerala-green hover:bg-kerala-green-light disabled:bg-gray-200 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                {submitting ? <Loader2 size={16} className="animate-spin"/> : <>{isMl ? 'അക്കൗണ്ട് ഉണ്ടാക്കൂ' : 'Create Account'}<ArrowRight size={15}/></>}
              </button>

              <p className="mt-4 text-center text-sm text-gray-500">
                {isMl ? 'ഇതിനകം ഒരു അക്കൗണ്ട് ഉണ്ടോ?' : 'Already have an account?'}{' '}
                <button onClick={() => setTab('login')} className="text-kerala-green font-semibold hover:underline">
                  {isMl ? 'ലോഗിൻ' : 'Sign in'}
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
