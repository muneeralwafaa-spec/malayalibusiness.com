'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { useParams } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { mockBusinesses } from '@/lib/mock-businesses'
import {
  MapPin, Phone, Globe, Clock, BadgeCheck, MessageCircle, Share2, Heart,
  Mail, Camera, Users, Calendar, CheckCircle, ArrowRight, Building2,
  Languages, Star, ShoppingCart, X, Send, Award, Package
} from 'lucide-react'

type Tab = 'home' | 'about' | 'services' | 'shop' | 'gallery' | 'reviews' | 'contact'

const teamMembers = [
  { name:'Mohammed Al Rashid', nameMl:'മൊഹമ്മദ് അൽ റാഷിദ്', role:'General Manager', roleMl:'ജനറൽ മാനേജർ', photo:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80&auto=format&fit=crop&crop=faces', years:8 },
  { name:'Anjali Thomas', nameMl:'അഞ്ജലി തോമസ്', role:'Operations Head', roleMl:'ഓപ്പറേഷൻസ് ഹെഡ്', photo:'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80&auto=format&fit=crop&crop=faces', years:5 },
  { name:'Rajesh Kumar', nameMl:'രാജേഷ് കുമാർ', role:'Customer Relations', roleMl:'കസ്റ്റമർ റിലേഷൻസ്', photo:'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&q=80&auto=format&fit=crop&crop=faces', years:6 },
]

const mockServices = [
  { id:1, name:'Premium Package', nameMl:'പ്രീമിയം പാക്കേജ്', desc:'Our flagship service with full features and priority support.', descMl:'പ്രയർ സപ്പോർട്ടോടുകൂടിയ ഫ്ലാഗ്ഷിപ്പ് സർവ്വീസ്.', price:299, image:'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80&auto=format&fit=crop' },
  { id:2, name:'Standard Service', nameMl:'സ്റ്റാൻഡേർഡ് സർവ്വീസ്', desc:'Quality service with all essential features included.', descMl:'അവശ്യ ഫീച്ചറുകൾ ഉൾക്കൊള്ളുന്ന ഗുണനിലവാര സർവ്വീസ്.', price:149, image:'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80&auto=format&fit=crop' },
  { id:3, name:'Express Service', nameMl:'എക്സ്പ്രസ് സർവ്വീസ്', desc:'Fast-turnaround service for urgent requirements.', descMl:'അടിയന്തിര ആവശ്യങ്ങൾക്കുള്ള വേഗതയേറിയ സർവ്വീസ്.', price:199, image:'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80&auto=format&fit=crop' },
  { id:4, name:'Corporate Package', nameMl:'കോർപ്പറേറ്റ് പാക്കേജ്', desc:'Tailored solutions for businesses and organisations.', descMl:'ബിസിനസ്, ഓർഗനൈസേഷനുകൾക്കുള്ള ഇഷ്ടാനുസൃത സൊലൂഷൻ.', price:499, image:'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&q=80&auto=format&fit=crop' },
  { id:5, name:'Home Delivery', nameMl:'ഹോം ഡെലിവറി', desc:'Convenient delivery or service at your doorstep.', descMl:'നിങ്ങളുടെ വീട്ടിൽ സൗകര്യപ്രദമായ ഡെലിവറി.', price:79, image:'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80&auto=format&fit=crop' },
  { id:6, name:'Consultation', nameMl:'കൺസൾട്ടേഷൻ', desc:'One-on-one expert consultation and advice session.', descMl:'വ്യക്തിഗത വിദഗ്ദ്ധ കൺസൾട്ടേഷൻ.', price:99, image:'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=400&q=80&auto=format&fit=crop' },
]

const mockProducts = [
  { id:1, name:'Kerala Special Mix', nameMl:'കേരള സ്പെഷ്യൽ മിക്സ്', price:45, original:60, image:'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80&auto=format&fit=crop', inStock:true },
  { id:2, name:'Signature Gift Pack', nameMl:'സിഗ്നേച്ചർ ഗിഫ്റ്റ് പാക്ക്', price:120, original:150, image:'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80&auto=format&fit=crop', inStock:true },
  { id:3, name:'Traditional Halwa', nameMl:'പരമ്പരാഗത ഹൽവ', price:35, original:40, image:'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=400&q=80&auto=format&fit=crop', inStock:true },
  { id:4, name:'Premium Biryani Kit', nameMl:'പ്രീമിയം ബിരിയാണി കിറ്റ്', price:89, original:110, image:'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80&auto=format&fit=crop', inStock:false },
  { id:5, name:'Coconut Cookies Box', nameMl:'കൊക്കോനട്ട് കുക്കീസ് ബോക്സ്', price:28, original:35, image:'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80&auto=format&fit=crop', inStock:true },
  { id:6, name:'Spice Collection', nameMl:'സ്പൈസ് കലക്ഷൻ', price:65, original:80, image:'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80&auto=format&fit=crop', inStock:true },
  { id:7, name:'Kerala Saree', nameMl:'കേരള സാരി', price:250, original:320, image:'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=80&auto=format&fit=crop', inStock:true },
  { id:8, name:'Handmade Pickle Set', nameMl:'ഹാൻഡ്‌മേഡ് അച്ചാർ സെറ്റ്', price:42, original:55, image:'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80&auto=format&fit=crop', inStock:true },
]

const galleryPhotos = [
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=400&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=400&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80&auto=format&fit=crop',
]

const mockReviews = [
  { id:1, name:'Arun Kumar', nameMl:'അരുൺ കുമാർ', avatar:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&q=80', rating:5, date:'Aug 2025', text:'Absolutely outstanding! The quality is unmatched and the staff were incredibly helpful throughout.', textMl:'അദ്ഭുതകരം! ഗുണനിലവാരം അതുല്യം, ജീവനക്കാർ ഏറ്റവും സഹകരണ മനോഭാവം.', helpful:23 },
  { id:2, name:'Priya Nair', nameMl:'പ്രിയ നായർ', avatar:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&q=80', rating:5, date:'Jul 2025', text:'Best experience I have had in Dubai. Very authentic, clean, and friendly atmosphere.', textMl:'ദുബായിൽ ഞാൻ അനുഭവിച്ചതിൽ ഏറ്റവും നല്ലത്. വളരെ ആധികാരികം, ശുദ്ധം.', helpful:18 },
  { id:3, name:'Rajan Pillai', nameMl:'രാജൻ പിള്ള', avatar:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&q=80', rating:4, date:'Jul 2025', text:'Very good overall. Slightly busy on weekends but totally worth it. Will come again.', textMl:'ആകെ വളരെ നല്ലത്. വാരാന്ത്യങ്ങളിൽ തിരക്കുണ്ട്. വീണ്ടും വരും.', helpful:12 },
  { id:4, name:'Meera Menon', nameMl:'മീര മേനോൻ', avatar:'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&q=80', rating:5, date:'Jun 2025', text:'Our family favourite place in the UAE! We celebrate every special occasion here.', textMl:'UAE-ൽ ഞങ്ങളുടെ കുടുംബത്തിന്റെ പ്രിയ ഇടം! ഓരോ ആഘോഷവും ഇവിടെ.', helpful:31 },
  { id:5, name:'Ahmed Hassan', nameMl:'അഹ്മദ് ഹസ്സൻ', avatar:'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&q=80', rating:4, date:'May 2025', text:'Impressive quality and value for money. The team goes above and beyond every time.', textMl:'ഗുണനിലവാരവും മൂല്യവും ഇംപ്രസ്സീവ്. ടീം എല്ലാ തവണയും ഒരു പടി കൂടുതൽ.', helpful:8 },
  { id:6, name:'Fatima Al Ali', nameMl:'ഫാത്തിമ അൽ അലി', avatar:'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=60&q=80', rating:5, date:'Apr 2025', text:'Exceptional service and amazing products. Highly recommend to everyone!', textMl:'അദ്ഭുതകരമായ സർവ്വീസ്. എല്ലാവർക്കും ശക്തമായ ശുപാർശ!', helpful:15 },
]

const ratingBreakdown = [
  { stars:5, pct:72 }, { stars:4, pct:18 }, { stars:3, pct:6 }, { stars:2, pct:2 }, { stars:1, pct:2 },
]

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
  const [cartItems, setCartItems] = useState<{id:number; qty:number}[]>([])
  const [lightbox, setLightbox] = useState<string|null>(null)
  const [saved, setSaved] = useState(false)
  const [reviewForm, setReviewForm] = useState({ name:'', rating:5, text:'' })
  const [reviewSubmitted, setReviewSubmitted] = useState(false)
  const [enquiryForm, setEnquiryForm] = useState({ name:'', email:'', phone:'', message:'' })
  const [enquirySubmitted, setEnquirySubmitted] = useState(false)
  const [helpfulVotes, setHelpfulVotes] = useState<Record<number,boolean>>({})

  const business = mockBusinesses.find(b => b.slug === slug || String(b.id) === slug) ?? mockBusinesses[0]
  const cartCount = cartItems.reduce((s,i)=>s+i.qty,0)
  const cartTotal = cartItems.reduce((s,i)=>{
    const p = mockProducts.find(x=>x.id===i.id)
    return s + (p ? p.price * i.qty : 0)
  },0)

  const addToCart = (id:number) => setCartItems(prev => {
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

  return (
    <main className="min-h-screen bg-kerala-cream">
      <Navbar />

      {/* Cover Banner */}
      <div className="relative w-full h-72 md:h-96 mt-16">
        <Image src={business.image} alt={business.name} fill className="object-cover" priority sizes="100vw" />
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
              <Image src={business.logo} alt="logo" fill className="object-cover" sizes="64px"/>
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
                <div className="flex flex-wrap gap-2 mt-4">{(isMl?business.tagsMl:business.tags).map(tag=><span key={tag} className="bg-kerala-cream text-kerala-green text-xs font-medium px-3 py-1 rounded-full">{tag}</span>)}</div>
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
                <div className="flex flex-wrap gap-2">{business.languages.map(l=><span key={l} className="bg-kerala-cream border border-kerala-green/20 text-kerala-deep text-xs px-3 py-1 rounded-full">{l}</span>)}</div>
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
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
                <h2 className="font-serif text-2xl font-bold text-kerala-deep mb-5">{isMl?'ഞങ്ങളുടെ ടീം':'Meet the Team'}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {teamMembers.map(m=>(
                    <div key={m.name} className="text-center">
                      <div className="relative w-20 h-20 rounded-2xl overflow-hidden mx-auto mb-3 border-2 border-gray-100">
                        <Image src={m.photo} alt={m.name} fill className="object-cover" sizes="80px"/>
                      </div>
                      <h3 className="font-semibold text-kerala-deep text-sm">{isMl?m.nameMl:m.name}</h3>
                      <p className="text-kerala-green text-xs mt-0.5">{isMl?m.roleMl:m.role}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{m.years} {isMl?'വർഷം':'yrs'}</p>
                    </div>
                  ))}
                </div>
              </div>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockServices.map(svc=>(
                <div key={svc.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all group">
                  <div className="relative h-44 overflow-hidden">
                    <Image src={svc.image} alt={svc.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="400px"/>
                    <div className="absolute top-3 right-3 bg-kerala-gold text-white text-xs font-bold px-3 py-1 rounded-full">AED {svc.price}</div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif font-bold text-kerala-deep text-lg mb-1">{isMl?svc.nameMl:svc.name}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4">{isMl?svc.descMl:svc.desc}</p>
                    <button className="w-full bg-kerala-green hover:bg-kerala-green-light text-white text-sm font-semibold py-2.5 rounded-xl transition-all">
                      {isMl?'എൻക്വയർ':'Enquire Now'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SHOP */}
        {activeTab==='shop' && (
          <div>
            <div className="flex items-center justify-between mb-7">
              <div>
                <h2 className="font-serif text-3xl font-bold text-kerala-deep">{isMl?'ഷോപ്പ്':'Shop'}</h2>
                <p className="text-gray-500 text-sm mt-1">{isMl?'ഞങ്ങളുടെ പ്രൊഡക്ടുകൾ':'Browse our products'}</p>
              </div>
              {cartCount>0 && (
                <div className="flex items-center gap-2 bg-kerala-green/10 border border-kerala-green/20 text-kerala-green text-sm font-semibold px-4 py-2 rounded-xl">
                  <ShoppingCart size={16}/>{cartCount} {isMl?'ഇനം':'items'} · AED {cartTotal}
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {mockProducts.map(p=>(
                <div key={p.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all group">
                  <Link href={`/${locale}/company/${slug}/shop/${p.id}`}>
                    <div className="relative h-40 overflow-hidden">
                      <Image src={p.image} alt={p.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="300px"/>
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{Math.round((1-p.price/p.original)*100)}% OFF</div>
                      {!p.inStock && <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><span className="bg-white text-gray-700 text-xs font-bold px-3 py-1 rounded-full">{isMl?'ലഭ്യമല്ല':'Out of Stock'}</span></div>}
                    </div>
                  </Link>
                  <div className="p-3">
                    <h3 className="font-semibold text-kerala-deep text-sm truncate">{isMl?p.nameMl:p.name}</h3>
                    <div className="flex items-center gap-1.5 mt-1 mb-2.5">
                      <span className="font-bold text-kerala-green text-sm">AED {p.price}</span>
                      <span className="text-gray-400 text-xs line-through">AED {p.original}</span>
                    </div>
                    <button onClick={()=>p.inStock&&addToCart(p.id)} disabled={!p.inStock}
                      className={`w-full text-xs font-semibold py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${p.inStock?'bg-kerala-green text-white hover:bg-kerala-green-light':'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                      <ShoppingCart size={13}/>{p.inStock?(isMl?'കാർട്ടിൽ':'Add to Cart'):(isMl?'ലഭ്യമല്ല':'Unavailable')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
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
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {galleryPhotos.map((photo,i)=>(
                <button key={i} onClick={()=>setLightbox(photo)} className="relative aspect-square overflow-hidden rounded-xl group hover:shadow-lg transition-all">
                  <Image src={photo} alt={`Gallery ${i+1}`} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="300px"/>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                    <Camera size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity"/>
                  </div>
                </button>
              ))}
            </div>
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
              {mockReviews.map(review=>(
                <div key={review.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <div className="flex items-start gap-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                      <Image src={review.avatar} alt={review.name} fill className="object-cover" sizes="40px"/>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-kerala-deep text-sm">{isMl?review.nameMl:review.name}</span>
                        <span className="text-gray-400 text-xs">· {review.date}</span>
                      </div>
                      <StarRow rating={review.rating} size={13}/>
                      <p className="text-gray-600 text-sm mt-2 leading-relaxed">{isMl?review.textMl:review.text}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <button onClick={()=>setHelpfulVotes(prev=>({...prev,[review.id]:!prev[review.id]}))}
                          className={`text-xs flex items-center gap-1 transition-colors ${helpfulVotes[review.id]?'text-kerala-green font-semibold':'text-gray-400 hover:text-gray-600'}`}>
                          <CheckCircle size={12}/>{isMl?'സഹായകരം':'Helpful'} ({review.helpful+(helpfulVotes[review.id]?1:0)})
                        </button>
                        <button className="text-xs text-gray-400 hover:text-gray-600">{isMl?'മറുപടി':'Reply'}</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-serif font-bold text-kerala-deep text-lg mb-4">{isMl?'റിവ്യൂ എഴുതൂ':'Write a Review'}</h3>
                {reviewSubmitted ? (
                  <div className="text-center py-6"><CheckCircle size={36} className="text-kerala-green mx-auto mb-2"/><p className="font-semibold text-kerala-deep">{isMl?'നന്ദി! റിവ്യൂ ലഭിച്ചു.':'Thank you! Review submitted.'}</p></div>
                ) : (
                  <div className="space-y-4">
                    <input value={reviewForm.name} onChange={e=>setReviewForm(f=>({...f,name:e.target.value}))} placeholder={isMl?'നിങ്ങളുടെ പേര്':'Your name'} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-kerala-green"/>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">{isMl?'റേറ്റിംഗ്:':'Rating:'}</span>
                      <div className="flex gap-1">
                        {[1,2,3,4,5].map(s=>(
                          <button key={s} onClick={()=>setReviewForm(f=>({...f,rating:s}))}>
                            <svg width={20} height={20} viewBox="0 0 24 24" className={s<=reviewForm.rating?'fill-kerala-gold text-kerala-gold':'fill-gray-200 text-gray-200'}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                          </button>
                        ))}
                      </div>
                    </div>
                    <textarea value={reviewForm.text} onChange={e=>setReviewForm(f=>({...f,text:e.target.value}))} rows={3} placeholder={isMl?'നിങ്ങളുടെ അനുഭവം...':'Share your experience...'} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-kerala-green resize-none"/>
                    <button onClick={()=>setReviewSubmitted(true)} className="bg-kerala-green text-white font-semibold px-6 py-2.5 rounded-xl text-sm hover:bg-kerala-green-light transition-all">{isMl?'സമർപ്പിക്കൂ':'Submit Review'}</button>
                  </div>
                )}
              </div>
            </div>
            <div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-28">
                <div className="text-center mb-5">
                  <div className="font-serif text-6xl font-bold text-kerala-deep">{business.rating}</div>
                  <div className="flex justify-center mt-2"><StarRow rating={business.rating} size={20}/></div>
                  <p className="text-gray-500 text-sm mt-1">{business.reviewCount} {isMl?'റിവ്യൂ':'reviews'}</p>
                </div>
                <div className="space-y-2">
                  {ratingBreakdown.map(({stars,pct})=>(
                    <div key={stars} className="flex items-center gap-2 text-xs">
                      <span className="w-3">{stars}</span>
                      <svg width={10} height={10} viewBox="0 0 24 24" className="fill-kerala-gold"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                      <div className="flex-1 bg-gray-100 rounded-full h-2"><div className="bg-kerala-gold h-2 rounded-full" style={{width:`${pct}%`}}/></div>
                      <span className="w-7 text-right text-gray-500">{pct}%</span>
                    </div>
                  ))}
                </div>
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
