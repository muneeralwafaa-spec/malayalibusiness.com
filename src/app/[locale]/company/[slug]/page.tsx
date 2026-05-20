'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { useParams } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import {
  getListing, adaptListing, incrementViews,
  getServices, getReviews, submitReview, voteHelpful,
  getTeamMembers, getShopListings, getCategories,
} from '@/lib/listings'
import type { ServiceRow, ReviewRow, TeamMemberRow, ShopListingRow } from '@/lib/supabase'
import {
  MapPin, Phone, Globe, Clock, BadgeCheck, MessageCircle, Share2, Heart,
  Mail, Camera, Users, Calendar, CheckCircle, Building2,
  Languages, Star, ShoppingCart, X, Send, Plus, Zap, FileText, Loader2
} from 'lucide-react'

type Tab = 'home' | 'about' | 'services' | 'shop' | 'gallery' | 'reviews' | 'contact'


function StarRow({ rating, size=14 }: { rating:number; size?:number }) {
  return (
    <span className="flex gap-0.5">
      {[1,2,3,4,5].map(i=>(
        <svg key={i} width={size} height={size} viewBox="0 0 24 24"
          className={i<=Math.floor(rating)?'fill-kerala-gold text-kerala-gold':'fill-gray-200 text-gray-200'}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </span>
  )
}

export default function CompanyPage() {
  const locale = useLocale()
  const isMl = locale === 'ml'
  const { slug } = useParams<{slug:string}>()
  const [activeTab, setActiveTab] = useState<Tab>('home')
  const [cartItems, setCartItems] = useState<{id:string; qty:number}[]>([])
  const [lightbox, setLightbox] = useState<string|null>(null)
  const [saved, setSaved] = useState(false)
  const [reviewForm, setReviewForm] = useState({ name:'', rating:5, text:'' })
  const [reviewSubmitted, setReviewSubmitted] = useState(false)
  const [enquiryForm, setEnquiryForm] = useState({ name:'', email:'', phone:'', message:'' })
  const [enquirySubmitted, setEnquirySubmitted] = useState(false)
  const [business, setBusiness] = useState<ReturnType<typeof adaptListing> | null>(null)
  const [loading, setLoading] = useState(true)
  const [services, setServices] = useState<ServiceRow[]>([])
  const [reviews, setReviews] = useState<ReviewRow[]>([])
  const [team, setTeam] = useState<TeamMemberRow[]>([])
  const [shopItems, setShopItems] = useState<ShopListingRow[]>([])

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    // Load categories map first so adaptListing gets correct category name
    getCategories().then((cats) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const catMap: Record<string, any> = {}
      cats.forEach((c: any) => { catMap[c.id] = { name: c.name, name_ml: c.name_ml, slug: c.slug } })

      getListing(slug).then((row) => {
        if (row) {
          const adapted = adaptListing(row, catMap)
          setBusiness(adapted)
        incrementViews(slug)
        // Fetch tab data in parallel
          Promise.all([
            getServices(row.id),
            getReviews(row.id),
            getTeamMembers(row.id),
            getShopListings(row.id),
          ]).then(([svc, rev, tm, shop]) => {
            setServices(svc)
            setReviews(rev)
            setTeam(tm)
            setShopItems(shop)
          })
        }
        setLoading(false)
      })
    })
  }, [slug])

  const cartCount = cartItems.reduce((s,i)=>s+i.qty,0)
  const cartTotal = cartItems.reduce((s,i)=>{
    const p = shopItems.find(x=>x.id===i.id)
    return s + (p ? p.price * i.qty : 0)
  },0)

  const addToCart = (id:string) => setCartItems(prev => {
    const ex = prev.find(i=>i.id===id)
    if (ex) return prev.map(i=>i.id===id ? {...i,qty:i.qty+1} : i)
    return [...prev,{id,qty:1}]
  })

  const tabs: {key:Tab; label:string; labelMl:string}[] = [
    { key:'home', label:'Home', labelMl:'ഹോം' },
    { key:'about', label:'About', labelMl:'ഞങ്ങൾ' },
    { key:'services', label:'Services', labelMl:'സർവ്വീസ്' },
    { key:'shop', label:'Shop', labelMl:'ഷോപ്പ്' },
    { key:'gallery', label:'Gallery', labelMl:'ഗാലറി' },
    { key:'reviews', label:'Reviews', labelMl:'റിവ്യൂ' },
    { key:'contact', label:'Contact', labelMl:'ബന്ധം' },
  ]

  if (loading) {
    return (
      <main className="min-h-screen bg-kerala-cream">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 size={40} className="animate-spin text-kerala-green" />
        </div>
        <Footer />
      </main>
    )
  }

  if (!business) {
    return (
      <main className="min-h-screen bg-kerala-cream">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
          <Building2 size={48} className="text-gray-300 mb-4" />
          <h1 className="font-serif text-3xl font-bold text-kerala-deep mb-2">
            {isMl ? 'ബിസിനസ് കണ്ടെത്തിയില്ല' : 'Business Not Found'}
          </h1>
          <p className="text-gray-500 mb-6">
            {isMl ? 'ഈ ബിസിനസ് ലഭ്യമല്ല അല്ലെങ്കിൽ നീക്കം ചെയ്തു.' : 'This business is not available or has been removed.'}
          </p>
          <Link href={`/${locale}/directory`} className="bg-kerala-green text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-kerala-green-light transition-all text-sm">
            {isMl ? 'ഡയറക്ടറിയിലേക്ക്' : 'Back to Directory'}
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-kerala-cream">
      <Navbar />

      {/* Cover Banner */}
      <div className="relative w-full h-72 md:h-96 mt-16">
        <Image src={business.image || 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80&auto=format&fit=crop'} alt={business.name} fill className="object-cover" priority sizes="100vw" onError={(e)=>{ (e.target as HTMLImageElement).src='https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80&auto=format&fit=crop' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-kerala-deep/85 via-kerala-deep/30 to-transparent" />
        <div className="absolute top-4 left-4 flex gap-2">
          {business.verified && (
            <span className="bg-kerala-green text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1"><BadgeCheck size={12}/> Verified</span>
          )}
          <span className={`text-white text-xs font-bold px-3 py-1 rounded-full ${business.premium?'bg-kerala-gold':'bg-white/20 backdrop-blur'}`}>
            {business.premium?(isMl?'പ്രീമിയം':'Premium'):(isMl?'സ്റ്റാൻഡേർഡ്':'Standard')}
          </span>
        </div>
        <div className="absolute top-4 right-4 flex gap-2">
          <button onClick={()=>setSaved(!saved)} className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur ${saved?'bg-red-500 text-white':'bg-white/20 text-white'} transition-all`}>
            <Heart size={16} className={saved?'fill-current':''}/>
          </button>
          <button className="w-9 h-9 rounded-full bg-white/20 backdrop-blur text-white flex items-center justify-center"><Share2 size={16}/></button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end gap-4">
          {business.logo && (
            <div className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-white shadow-lg flex-shrink-0 bg-white">
              <Image src={business.logo} alt="logo" fill className="object-cover" sizes="64px" onError={(e)=>{ (e.target as HTMLImageElement).style.display='none' }}/>
            </div>
          )}
          <div className="flex-1">
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-white mb-1">{isMl?business.nameMl:business.name}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <div className="flex items-center gap-1 text-white"><StarRow rating={business.rating} size={13}/><span className="font-semibold">{business.rating}</span><span className="text-white/70">({business.reviewCount})</span></div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${business.open?'bg-kerala-green/80 text-white':'bg-red-500/80 text-white'}`}>{business.open?(isMl?'തുറന്നിരിക്കുന്നു':'Open Now'):(isMl?'അടഞ്ഞിരിക്കുന്നു':'Closed')}</span>
              <span className="text-white/70 text-xs flex items-center gap-1"><MapPin size={11}/>{business.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Tabs */}
      <div className="sticky top-16 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 overflow-x-auto">
          <div className="flex min-w-max">
            {tabs.map(tab=>(
              <button key={tab.key} onClick={()=>setActiveTab(tab.key)}
                className={`px-5 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-all relative ${activeTab===tab.key?'border-kerala-green text-kerala-green':'border-transparent text-gray-500 hover:text-gray-700'}`}>
                {isMl?tab.labelMl:tab.label}
                {tab.key==='shop' && cartCount>0 && <span className="ml-1 bg-kerala-green text-white text-xs rounded-full w-4 h-4 inline-flex items-center justify-center">{cartCount}</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* HOME */}
        {activeTab==='home' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="font-serif text-xl font-bold text-kerala-deep mb-3">{isMl?'ഞങ്ങളെ കുറിച്ച്':'About Us'}</h2>
                <p className="text-gray-600 text-sm leading-relaxed">{isMl?business.descriptionMl:business.description}</p>
                <div className="flex flex-wrap gap-2 mt-4">{(isMl?business.tagsMl:business.tags).map((tag: string)=><span key={tag} className="bg-kerala-cream text-kerala-green text-xs font-medium px-3 py-1 rounded-full">{tag}</span>)}</div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { href:`tel:${business.phone}`, icon:Phone, label:isMl?'വിളിക്കൂ':'Call', color:'bg-kerala-green text-white' },
                  { href:`https://wa.me/${(business.whatsapp||business.phone).replace(/\D/g,'')}`, icon:MessageCircle, label:'WhatsApp', color:'bg-green-500 text-white' },
                  { href:business.website||'#', icon:Globe, label:isMl?'വെബ്സൈറ്റ്':'Website', color:'bg-blue-600 text-white' },
                  { href:`https://maps.google.com/?q=${encodeURIComponent(business.address)}`, icon:MapPin, label:isMl?'ദിശ':'Directions', color:'bg-kerala-gold text-white' },
                ].map(b=>(
                  <a key={b.label} href={b.href} target="_blank" rel="noopener noreferrer" className={`${b.color} flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity`}>
                    <b.icon size={18}/>{b.label}
                  </a>
                ))}
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-3"><Languages size={16} className="text-kerala-green"/><h3 className="font-semibold text-kerala-deep text-sm">{isMl?'ഭാഷകൾ':'Languages'}</h3></div>
                <div className="flex flex-wrap gap-2">{business.languages.map((l: string)=><span key={l} className="bg-kerala-cream border border-kerala-green/20 text-kerala-deep text-xs px-3 py-1 rounded-full">{l}</span>)}</div>
              </div>
            </div>
            <div className="space-y-5">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-3"><Clock size={16} className="text-kerala-green"/><h3 className="font-semibold text-kerala-deep text-sm">{isMl?'സമയം':'Hours'}</h3></div>
                <div className="space-y-1.5">
                  {[['Mon–Fri','Mon–Fri'],['Saturday','ശനി'],['Sunday','ഞായർ']].map(([en,ml],i)=>(
                    <div key={en} className="flex justify-between text-xs">
                      <span className="text-gray-500">{isMl?ml:en}</span>
                      <span className="font-medium text-kerala-deep">{i<2?business.hours:(isMl?'അടഞ്ഞ്':'Closed')}</span>
                    </div>
                  ))}
                </div>
                <div className={`mt-3 text-center text-xs font-bold py-1.5 rounded-lg ${business.open?'bg-kerala-green/10 text-kerala-green':'bg-red-50 text-red-600'}`}>
                  {business.open?(isMl?'ഇപ്പോൾ തുറന്ന്':'Open Now'):(isMl?'ഇപ്പോൾ അടഞ്ഞ്':'Closed Now')}
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
                {[
                  { icon:Building2, label:isMl?'ഇൻഡസ്ട്രി':'Industry', val:isMl?business.categoryMl:business.category },
                  { icon:MapPin, label:isMl?'ലൊക്കേഷൻ':'Location', val:business.emirate },
                  ...(business.established?[{ icon:Calendar, label:isMl?'സ്ഥാപിതം':'Est.', val:String(business.established) }]:[]),
                  ...(business.employees?[{ icon:Users, label:isMl?'ജീവനക്കാർ':'Staff', val:business.employees }]:[]),
                ].map(item=>(
                  <div key={item.label} className="flex items-center gap-3 text-sm">
                    <item.icon size={14} className="text-kerala-green flex-shrink-0"/>
                    <span className="text-gray-400 text-xs w-16 flex-shrink-0">{item.label}</span>
                    <span className="font-medium text-kerala-deep text-xs truncate">{item.val}</span>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="h-40 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <div className="text-center px-4">
                    <MapPin size={24} className="text-kerala-green mx-auto mb-2"/>
                    <p className="text-xs text-gray-600 font-medium">{business.address}</p>
                  </div>
                </div>
                <a href={`https://maps.google.com/?q=${encodeURIComponent(business.address)}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 text-kerala-green text-xs font-semibold hover:bg-kerala-cream transition-colors">
                  <MapPin size={13}/> {isMl?'Google Maps':'View on Google Maps'}
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ABOUT */}
        {activeTab==='about' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
            <div className="lg:col-span-2 space-y-7">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
                <h2 className="font-serif text-2xl font-bold text-kerala-deep mb-4">{isMl?'ഞങ്ങളുടെ കഥ':'Our Story'}</h2>
                <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
                  <p>{isMl?business.descriptionMl:business.description}</p>
                  <p>{isMl?`${business.established||''}‑ൽ സ്ഥാപിതമായ ${business.nameMl}, UAE-ൽ ${business.categoryMl} മേഖലയിൽ മുൻനിരക്കാരായി. ഞങ്ങളുടെ ദൗത്യം: ഓരോ ഉപഭോക്താവിനും ഏറ്റവും മികച്ച അനുഭവം.`:`Founded in ${business.established||'recent years'}, ${business.name} has become a trusted name in ${business.category} across the UAE. Our mission is to deliver excellence in every interaction.`}</p>
                  <p>{isMl?`ഞങ്ങളുടെ ${business.employees||'10+'} ജീവനക്കാർ ${business.languages.join(', ')} ഭാഷകൾ സംസാരിക്കുന്നു, എല്ലാ കമ്മ്യൂണിറ്റികൾക്കും സർവ്വീസ് ലഭ്യമാക്കുന്നു.`:`Our team of ${business.employees||'10+'} professionals speaks ${business.languages.join(', ')}, ensuring every customer feels at home.`}</p>
                </div>
              </div>
              {team.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
                  <h2 className="font-serif text-2xl font-bold text-kerala-deep mb-5">{isMl?'ഞങ്ങളുടെ ടീം':'Meet the Team'}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    {team.map(m=>(
                      <div key={m.id} className="text-center">
                        <div className="relative w-20 h-20 rounded-2xl overflow-hidden mx-auto mb-3 border-2 border-gray-100 bg-gray-100">
                          {m.photo_url && (
                            <Image src={m.photo_url} alt={m.name} fill className="object-cover" sizes="80px"
                              onError={(e)=>{ (e.target as HTMLImageElement).style.display='none' }}/>
                          )}
                          {!m.photo_url && (
                            <div className="w-full h-full flex items-center justify-center bg-kerala-cream">
                              <Users size={24} className="text-kerala-green/40"/>
                            </div>
                          )}
                        </div>
                        <h3 className="font-semibold text-kerala-deep text-sm">{isMl?(m.name_ml||m.name):m.name}</h3>
                        <p className="text-kerala-green text-xs mt-0.5">{isMl?(m.role_ml||m.role||''):m.role||''}</p>
                        {m.years_exp && <p className="text-gray-400 text-xs mt-0.5">{m.years_exp} {isMl?'വർഷം':'yrs'}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-serif text-lg font-bold text-kerala-deep mb-5">{isMl?'ഞങ്ങളുടെ യാത്ര':'Our Journey'}</h3>
                <div className="relative">
                  <div className="absolute left-3.5 top-0 bottom-0 w-px bg-gray-100"/>
                  <div className="space-y-5">
                    {[
                      { year:String(business.established||2010), ev:isMl?'ആരംഭം':'Founded', d:isMl?'UAE-ൽ ബിസിനസ് ആരംഭം':'Launched in UAE' },
                      { year:String((business.established||2010)+2), ev:isMl?'100 ഉപഭോക്താ':'100 Customers', d:isMl?'ആദ്യ നാഴികക്കല്ല്':'First milestone' },
                      { year:String((business.established||2010)+4), ev:'Verified', d:isMl?'MalayaliBusiness Verified':'Verified on MalayaliBusiness' },
                      { year:String((business.established||2010)+6), ev:isMl?'വ്യാപനം':'Expansion', d:isMl?'ടീം & സർവ്വീസ് വ്യാപനം':'Grew team & services' },
                      { year:'2025', ev:isMl?'ഇന്ന്':'Today', d:isMl?`${business.reviewCount}+ റിവ്യൂ`:`${business.reviewCount}+ reviews` },
                    ].map((m,i)=>(
                      <div key={i} className="flex gap-4">
                        <div className="w-7 h-7 rounded-full bg-kerala-green text-white text-xs font-bold flex items-center justify-center flex-shrink-0 z-10">{i+1}</div>
                        <div>
                          <div className="font-bold text-kerala-gold text-sm">{m.year}</div>
                          <div className="font-semibold text-kerala-deep text-sm">{m.ev}</div>
                          <p className="text-gray-500 text-xs">{m.d}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SERVICES */}
        {activeTab==='services' && (
          <div>
            <div className="mb-7">
              <h2 className="font-serif text-3xl font-bold text-kerala-deep">{isMl?'ഞങ്ങളുടെ സർവ്വീസ്':'Our Services'}</h2>
              <p className="text-gray-500 text-sm mt-1">{isMl?'ഞങ്ങൾ ഓഫർ ചെയ്യുന്ന സർവ്വീസ്':'Services and packages we offer'}</p>
            </div>
            {services.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                <FileText size={40} className="mx-auto mb-3 text-gray-300"/>
                <p className="font-semibold text-kerala-deep">{isMl?'സർവ്വീസ് ഒന്നും ചേർത്തിട്ടില്ല':'No services listed yet'}</p>
                <p className="text-sm text-gray-400 mt-1">{isMl?'ഉടൻ ചേർക്കും':'Check back soon'}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map(svc=>(
                  <div key={svc.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all group">
                    {svc.image_url && (
                      <div className="relative h-44 overflow-hidden">
                        <Image src={svc.image_url} alt={svc.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="400px"
                          onError={(e)=>{ (e.target as HTMLImageElement).style.display='none' }}/>
                        {svc.price != null && (
                          <div className="absolute top-3 right-3 bg-kerala-gold text-white text-xs font-bold px-3 py-1 rounded-full">
                            {svc.price_unit} {svc.price}
                          </div>
                        )}
                      </div>
                    )}
                    <div className="p-5">
                      {svc.price != null && !svc.image_url && (
                        <span className="inline-block bg-kerala-gold/10 text-kerala-gold text-xs font-bold px-2 py-0.5 rounded-full mb-2">
                          {svc.price_unit} {svc.price}
                        </span>
                      )}
                      <h3 className="font-serif font-bold text-kerala-deep text-lg mb-1">
                        {isMl ? (svc.name_ml || svc.name) : svc.name}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed mb-4">
                        {isMl ? (svc.description_ml || svc.description || '') : (svc.description || '')}
                      </p>
                      <a href={`https://wa.me/${(business.whatsapp||business.phone).replace(/\D/g,'')}`}
                        target="_blank" rel="noopener noreferrer"
                        className="w-full bg-kerala-green hover:bg-kerala-green-light text-white text-sm font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2">
                        <MessageCircle size={14}/>{isMl?'എൻക്വയർ':'Enquire Now'}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SHOP */}
        {activeTab==='shop' && (
          <div>
            <div className="flex items-center justify-between mb-7 flex-wrap gap-3">
              <div>
                <h2 className="font-serif text-3xl font-bold text-kerala-deep">{isMl?'ഷോപ്പ്':'Shop'}</h2>
                <p className="text-gray-500 text-sm mt-1">{isMl?'ഉൽപ്പന്നങ്ങളും സേവനങ്ങളും':'Products & Services by this vendor'}</p>
              </div>
              {cartCount > 0 && (
                <div className="flex items-center gap-2 bg-kerala-green/10 border border-kerala-green/20 text-kerala-green text-sm font-semibold px-4 py-2 rounded-xl">
                  <ShoppingCart size={16}/>{cartCount} {isMl?'ഇനം':'items'} · AED {cartTotal}
                </div>
              )}
            </div>

            {shopItems.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
                <ShoppingCart size={40} className="mx-auto mb-3 text-gray-300"/>
                <p className="font-semibold text-kerala-deep">{isMl?'ഷോപ്പ് ഒഴിഞ്ഞിരിക്കുന്നു':'No products listed yet'}</p>
                <p className="text-sm text-gray-400 mt-1">{isMl?'ഉടൻ ചേർക്കും':'Check back soon'}</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                {shopItems.map(item => {
                  const discount = item.original_price ? Math.round((1 - item.price / item.original_price) * 100) : 0
                  const typeColors: Record<string,string> = {
                    product: 'bg-kerala-green text-white',
                    service: 'bg-blue-500 text-white',
                    appointment: 'bg-purple-500 text-white',
                    quote: 'bg-orange-500 text-white',
                    contact_only: 'bg-green-500 text-white',
                    direct_service: 'bg-kerala-gold text-white',
                  }
                  const typeLabels: Record<string,string> = {
                    product: isMl?'ഉൽപ്പന്നം':'Product',
                    service: isMl?'സർവ്വീസ്':'Service',
                    appointment: isMl?'അപ്പോയ്ന്റ്മെന്റ്':'Appointment',
                    quote: isMl?'ക്വോട്ട്':'Quote',
                    contact_only: isMl?'ബന്ധപ്പെടൂ':'Contact',
                    direct_service: isMl?'ഡയറക്ട്':'Direct',
                  }
                  return (
                    <div key={item.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg hover:border-kerala-green/20 transition-all group flex flex-col">
                      <div className="relative h-40 overflow-hidden bg-gray-100">
                        {item.image_url && (
                          <Image src={item.image_url} alt={item.name} fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="300px"
                            onError={(e)=>{ (e.target as HTMLImageElement).style.display='none' }}/>
                        )}
                        <div className="absolute top-2 left-2 flex gap-1.5">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${typeColors[item.listing_type] || 'bg-gray-500 text-white'}`}>
                            {typeLabels[item.listing_type] || item.listing_type}
                          </span>
                          {discount > 0 && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500 text-white">-{discount}%</span>}
                          {item.is_bestseller && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-kerala-gold text-white">🔥</span>}
                        </div>
                      </div>
                      <div className="p-3 flex flex-col flex-1">
                        <h3 className="font-semibold text-kerala-deep text-sm line-clamp-2 flex-1 mb-1.5">
                          {isMl ? (item.name_ml || item.name) : item.name}
                        </h3>
                        {item.rating_avg > 0 && (
                          <div className="flex items-center gap-1 mb-2">
                            {[1,2,3,4,5].map(i=><Star key={i} size={10} className={i<=Math.floor(item.rating_avg)?'text-kerala-gold fill-kerala-gold':'text-gray-300'}/>)}
                            <span className="text-[10px] text-gray-400">({item.review_count})</span>
                          </div>
                        )}
                        <div className="flex items-baseline gap-1 mb-2.5">
                          {item.price > 0 ? (
                            <>
                              <span className="font-bold text-kerala-green text-sm">AED {item.price}</span>
                              {item.original_price && <span className="text-gray-300 text-xs line-through">AED {item.original_price}</span>}
                            </>
                          ) : (
                            <span className="text-orange-500 font-semibold text-xs">{isMl?'ക്വോട്ട്':'Get Quote'}</span>
                          )}
                        </div>
                        {item.stock_status === 'out_of_stock' ? (
                          <span className="w-full text-center text-xs font-semibold py-2 rounded-lg bg-gray-100 text-gray-400">
                            {isMl?'സ്റ്റോക്ക് ഇല്ല':'Out of Stock'}
                          </span>
                        ) : item.listing_type === 'contact_only' ? (
                          <a href={`https://wa.me/${(item.whatsapp||business.whatsapp||business.phone).replace(/\D/g,'')}`}
                            target="_blank" rel="noopener noreferrer"
                            className="w-full text-xs font-semibold py-2 rounded-lg flex items-center justify-center gap-1.5 bg-[#25D366] text-white hover:bg-[#20bd5a] transition-all">
                            <MessageCircle size={12}/>WhatsApp
                          </a>
                        ) : item.listing_type === 'quote' ? (
                          <a href={`https://wa.me/${(business.whatsapp||business.phone).replace(/\D/g,'')}`}
                            target="_blank" rel="noopener noreferrer"
                            className="w-full text-xs font-semibold py-2 rounded-lg flex items-center justify-center gap-1.5 bg-orange-500 text-white hover:bg-orange-600 transition-all">
                            <FileText size={12}/>{isMl?'ക്വോട്ട്':'Get Quote'}
                          </a>
                        ) : item.listing_type === 'appointment' ? (
                          <a href={`https://wa.me/${(business.whatsapp||business.phone).replace(/\D/g,'')}`}
                            target="_blank" rel="noopener noreferrer"
                            className="w-full text-xs font-semibold py-2 rounded-lg flex items-center justify-center gap-1.5 bg-blue-500 text-white hover:bg-blue-600 transition-all">
                            <Calendar size={12}/>{isMl?'ബുക്ക്':'Book Slot'}
                          </a>
                        ) : item.listing_type === 'direct_service' ? (
                          <a href={`https://wa.me/${(business.whatsapp||business.phone).replace(/\D/g,'')}`}
                            target="_blank" rel="noopener noreferrer"
                            className="w-full text-xs font-semibold py-2 rounded-lg flex items-center justify-center gap-1.5 bg-purple-600 text-white hover:bg-purple-700 transition-all">
                            <Zap size={12}/>{isMl?'ഇപ്പോൾ':'Book Now'}
                          </a>
                        ) : (
                          <button onClick={()=>addToCart(item.id)}
                            className="w-full text-xs font-semibold py-2 rounded-lg flex items-center justify-center gap-1.5 bg-kerala-green text-white hover:bg-kerala-deep transition-all">
                            <ShoppingCart size={12}/>{isMl?'കാർട്ടിൽ':'Add to Cart'}
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* GALLERY */}
        {activeTab==='gallery' && (
          <div>
            <div className="flex items-center justify-between mb-7">
              <h2 className="font-serif text-3xl font-bold text-kerala-deep">{isMl?'ഫോട്ടോ ഗാലറി':'Photo Gallery'}</h2>
              <button className="flex items-center gap-2 border border-kerala-green text-kerala-green text-sm font-semibold px-4 py-2 rounded-xl hover:bg-kerala-green hover:text-white transition-all">
                <Camera size={15}/> {isMl?'ഫോട്ടോ ചേർക്കൂ':'Add Photo'}
              </button>
            </div>
            {business.photos?.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {business.photos.map((photo: string, i: number)=>(
                  <button key={i} onClick={()=>setLightbox(photo)} className="relative aspect-square overflow-hidden rounded-xl group hover:shadow-lg transition-all">
                    <Image src={photo} alt={`Gallery ${i+1}`} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="300px"/>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                      <Camera size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity"/>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                <Camera size={40} className="mx-auto mb-3 text-gray-300"/>
                <p className="font-semibold text-kerala-deep">{isMl?'ഫോട്ടോകൾ ഒന്നും ചേർത്തിട്ടില്ല':'No photos added yet'}</p>
                <p className="text-sm text-gray-400 mt-1">{isMl?'ഉടൻ ചേർക്കും':'Check back soon'}</p>
              </div>
            )}
            {lightbox && (
              <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={()=>setLightbox(null)}>
                <button className="absolute top-4 right-4 text-white bg-white/20 rounded-full p-2"><X size={20}/></button>
                <div className="relative w-full max-w-3xl aspect-video" onClick={e=>e.stopPropagation()}>
                  <Image src={lightbox} alt="Gallery" fill className="object-contain" sizes="900px"/>
                </div>
              </div>
            )}
          </div>
        )}

        {/* REVIEWS */}
        {activeTab==='reviews' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
            <div className="lg:col-span-2 space-y-5">
              {reviews.length === 0 && (
                <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
                  <Star size={36} className="mx-auto mb-3 text-gray-300"/>
                  <p className="font-semibold text-kerala-deep">{isMl?'ഇനിയും റിവ്യൂ ഇല്ല':'No reviews yet'}</p>
                  <p className="text-sm text-gray-400 mt-1">{isMl?'ആദ്യ റിവ്യൂ എഴുതൂ':'Be the first to leave a review'}</p>
                </div>
              )}
              {reviews.map(review=>(
                <div key={review.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-kerala-green/10 flex items-center justify-center flex-shrink-0 font-bold text-kerala-green text-sm">
                      {review.reviewer_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-kerala-deep text-sm">{review.reviewer_name}</span>
                        {review.is_verified && <BadgeCheck size={13} className="text-kerala-green"/>}
                        <span className="text-gray-400 text-xs">· {new Date(review.created_at).toLocaleDateString('en-GB',{month:'short',year:'numeric'})}</span>
                      </div>
                      <StarRow rating={review.rating} size={13}/>
                      {review.body && <p className="text-gray-600 text-sm mt-2 leading-relaxed">{review.body}</p>}
                      <div className="flex items-center gap-4 mt-3">
                        <button
                          onClick={async ()=>{
                            const fp = Math.random().toString(36).slice(2)
                            const ok = await voteHelpful(review.id, fp)
                            if (ok) setReviews(prev=>prev.map(r=>r.id===review.id?{...r,helpful_count:r.helpful_count+1}:r))
                          }}
                          className="text-xs flex items-center gap-1 text-gray-400 hover:text-kerala-green transition-colors">
                          <CheckCircle size={12}/>{isMl?'സഹായകരം':'Helpful'} ({review.helpful_count})
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {/* Write a Review */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-serif font-bold text-kerala-deep text-lg mb-4">{isMl?'റിവ്യൂ എഴുതൂ':'Write a Review'}</h3>
                {reviewSubmitted ? (
                  <div className="text-center py-6">
                    <CheckCircle size={36} className="text-kerala-green mx-auto mb-2"/>
                    <p className="font-semibold text-kerala-deep">{isMl?'നന്ദി! റിവ്യൂ ലഭിച്ചു.':'Thank you! Review submitted.'}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <input value={reviewForm.name} onChange={e=>setReviewForm(f=>({...f,name:e.target.value}))}
                      placeholder={isMl?'നിങ്ങളുടെ പേര്':'Your name'}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-kerala-green"/>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">{isMl?'റേറ്റിംഗ്:':'Rating:'}</span>
                      <div className="flex gap-1">
                        {[1,2,3,4,5].map(s=>(
                          <button key={s} onClick={()=>setReviewForm(f=>({...f,rating:s}))}>
                            <svg width={20} height={20} viewBox="0 0 24 24" className={s<=reviewForm.rating?'fill-kerala-gold text-kerala-gold':'fill-gray-200 text-gray-200'}>
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                          </button>
                        ))}
                      </div>
                    </div>
                    <textarea value={reviewForm.text} onChange={e=>setReviewForm(f=>({...f,text:e.target.value}))}
                      rows={3} placeholder={isMl?'നിങ്ങളുടെ അനുഭവം...':'Share your experience...'}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-kerala-green resize-none"/>
                    <button
                      onClick={async ()=>{
                        if (!reviewForm.name.trim() || !reviewForm.text.trim()) return
                        const { ok } = await submitReview({
                          listingId:    business.id,
                          reviewerName: reviewForm.name,
                          rating:       reviewForm.rating,
                          body:         reviewForm.text,
                        })
                        if (ok) {
                          setReviewSubmitted(true)
                          // Reload reviews
                          getReviews(business.id).then(setReviews)
                        }
                      }}
                      className="bg-kerala-green text-white font-semibold px-6 py-2.5 rounded-xl text-sm hover:bg-kerala-green-light transition-all">
                      {isMl?'സമർപ്പിക്കൂ':'Submit Review'}
                    </button>
                  </div>
                )}
              </div>
            </div>
            {/* Rating Summary */}
            <div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-28">
                <div className="text-center mb-5">
                  <div className="font-serif text-6xl font-bold text-kerala-deep">{business.rating.toFixed(1)}</div>
                  <div className="flex justify-center mt-2"><StarRow rating={business.rating} size={20}/></div>
                  <p className="text-gray-500 text-sm mt-1">{business.reviewCount} {isMl?'റിവ്യൂ':'reviews'}</p>
                </div>
                {/* Live breakdown from real reviews */}
                {[5,4,3,2,1].map(stars=>{
                  const count = reviews.filter(r=>r.rating===stars).length
                  const pct = reviews.length > 0 ? Math.round((count/reviews.length)*100) : 0
                  return (
                    <div key={stars} className="flex items-center gap-2 text-xs mb-2">
                      <span className="w-3">{stars}</span>
                      <svg width={10} height={10} viewBox="0 0 24 24" className="fill-kerala-gold">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      <div className="flex-1 bg-gray-100 rounded-full h-2">
                        <div className="bg-kerala-gold h-2 rounded-full transition-all" style={{width:`${pct}%`}}/>
                      </div>
                      <span className="w-7 text-right text-gray-500">{pct}%</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* CONTACT */}
        {activeTab==='contact' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                <h2 className="font-serif text-2xl font-bold text-kerala-deep">{isMl?'ബന്ധപ്പെടൂ':'Get in Touch'}</h2>
                {[
                  { icon:MapPin, label:isMl?'വിലാസം':'Address', val:business.address },
                  { icon:Phone, label:isMl?'ഫോൺ':'Phone', val:business.phone },
                  ...(business.email?[{ icon:Mail, label:'Email', val:business.email }]:[]),
                  { icon:Clock, label:isMl?'സമയം':'Hours', val:business.hours },
                ].map(c=>(
                  <div key={c.label} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-kerala-cream rounded-lg flex items-center justify-center flex-shrink-0"><c.icon size={14} className="text-kerala-green"/></div>
                    <div><p className="text-xs text-gray-400">{c.label}</p><p className="text-sm font-medium text-kerala-deep">{c.val}</p></div>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <div className="text-center px-4"><MapPin size={32} className="text-kerala-green mx-auto mb-2"/><p className="text-xs text-gray-600 font-medium">{business.address}</p><a href={`https://maps.google.com/?q=${encodeURIComponent(business.address)}`} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 bg-kerala-green text-white text-xs font-bold px-4 py-2 rounded-full"><MapPin size={12}/>Google Maps</a></div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-serif text-2xl font-bold text-kerala-deep mb-5">{isMl?'സന്ദേശം അയക്കൂ':'Send a Message'}</h2>
              {enquirySubmitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-kerala-green/10 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle size={32} className="text-kerala-green"/></div>
                  <h3 className="font-serif text-xl font-bold text-kerala-deep mb-2">{isMl?'സന്ദേശം ലഭിച്ചു!':'Message Received!'}</h3>
                  <p className="text-gray-500 text-sm">{isMl?'ഞങ്ങൾ ഉടൻ ബന്ധപ്പെടും.':'We will get back to you shortly.'}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {(['name','email','phone'] as const).map(k=>(
                    <div key={k}><label className="text-xs text-gray-500 font-medium mb-1 block capitalize">{k}</label><input value={enquiryForm[k]} onChange={e=>setEnquiryForm(prev=>({...prev,[k]:e.target.value}))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-kerala-green"/></div>
                  ))}
                  <div><label className="text-xs text-gray-500 font-medium mb-1 block">{isMl?'സന്ദേശം':'Message'}</label><textarea value={enquiryForm.message} onChange={e=>setEnquiryForm(f=>({...f,message:e.target.value}))} rows={4} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-kerala-green resize-none"/></div>
                  <button onClick={()=>setEnquirySubmitted(true)} className="w-full bg-kerala-green hover:bg-kerala-green-light text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-sm transition-all"><Send size={16}/>{isMl?'അയക്കൂ':'Send Message'}</button>
                  <a href={`https://wa.me/${(business.whatsapp||business.phone).replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-sm transition-all block text-center"><MessageCircle size={16}/> WhatsApp</a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer/>
    </main>
  )
}
