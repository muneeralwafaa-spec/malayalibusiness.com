'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { useParams } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import {
  Calendar, Clock, Eye, Heart, Bookmark, Share2, MessageCircle,
  ChevronRight, ArrowLeft, Tag, ThumbsUp, Send
} from 'lucide-react'

interface Article {
  slug: string
  title: string
  titleMl: string
  excerpt: string
  excerptMl: string
  content: string[]
  contentMl: string[]
  coverImage: string
  author: {
    name: string
    nameMl: string
    avatar: string
    role: string
    roleMl: string
  }
  category: string
  categoryMl: string
  tags: string[]
  date: string
  dateMl: string
  readTime: string
  readTimeMl: string
  views: number
  likes: number
  comments: number
}

interface Comment {
  id: number
  name: string
  avatar: string
  date: string
  text: string
  likes: number
}

const ARTICLES: Record<string, Article> = {
  'top-malayali-entrepreneurs-dubai-2025': {
    slug: 'top-malayali-entrepreneurs-dubai-2025',
    title: 'Top 10 Malayali Entrepreneurs Shaping Dubai in 2025',
    titleMl: '2025-ൽ ദുബായ് രൂപപ്പെടുത്തുന്ന മികച്ച 10 മലയാളി സംരംഭകർ',
    excerpt: 'From real estate moguls to tech disruptors, these Malayali visionaries are transforming the UAE business landscape.',
    excerptMl: 'റിയൽ എസ്റ്റേറ്റ് ഭീമന്മാർ മുതൽ ടെക് ഡിസ്‌റപ്‌ടർമാർ വരെ — ഈ മലയാളി ദർശകർ UAE ബിസിനസ് ലാൻഡ്‌സ്‌കേപ്പ് മാറ്റുകയാണ്.',
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80&auto=format&fit=crop',
    author: {
      name: 'Arun Krishnan',
      nameMl: 'അരുൺ കൃഷ്ണൻ',
      avatar: 'https://i.pravatar.cc/80?img=15',
      role: 'Business Editor',
      roleMl: 'ബിസിനസ് എഡിറ്റർ',
    },
    category: 'Business',
    categoryMl: 'ബിസിനസ്',
    tags: ['Entrepreneurs', 'Dubai', 'Success Stories', 'Malayali'],
    date: 'May 10, 2025',
    dateMl: 'മേയ് 10, 2025',
    readTime: '8 min read',
    readTimeMl: '8 മിനിറ്റ് വായന',
    views: 12400,
    likes: 843,
    comments: 67,
    content: [
      "The Malayali community in the UAE has long been recognised as one of the most entrepreneurially driven diaspora groups in the world. With over 1.2 million Keralites calling the UAE home, the economic footprint of this community spans virtually every sector — from construction and healthcare to technology and retail.",
      "In 2025, as Dubai continues its ambitious growth trajectory toward Expo-era legacies and beyond, Malayali entrepreneurs are not just participating — they are leading the charge. This list highlights ten individuals whose businesses, vision, and community impact have set them apart.",
      "**1. Ravi Menon — Founder, GreenBuild Constructions**\nStarting with a single labour contract in 1995, Ravi Menon built GreenBuild into a AED 400 million turnover construction conglomerate. His recent pivot to sustainable building practices has won contracts with Dubai Municipality for eco-housing projects.",
      "**2. Divya Nair — CEO, HealthFirst Clinics**\nWith 14 clinics across Dubai and Abu Dhabi, Divya Nair has democratised affordable healthcare for the South Asian community. Her tele-health platform launched in 2024 now serves over 80,000 patients monthly.",
      "**3. Santhosh Paul — Co-Founder, Finova Technologies**\nHaving previously built and sold a fintech startup to a regional bank, Santhosh's second venture Finova is disrupting remittance services with AI-powered exchange rate prediction — particularly relevant to the millions of Indians sending money home.",
      "**4. Lekha Thomas — Owner, Spice Routes Hospitality**\nFrom one restaurant in Deira in 2008 to a 12-venue fine-dining group, Lekha Thomas has redefined what Kerala cuisine can mean in a cosmopolitan city. Her flagship restaurant Tharavadu has a 3-month waiting list.",
      "**5. Ajith Kumar — Managing Director, Gulf Freight Logistics**\nBuilding on deep expertise in the shipping sector, Ajith's GFL now handles 8% of all small-parcel logistics between India and UAE. The company's same-day Dubai–Abu Dhabi corridor is now a benchmark for the industry.",
      "The remaining five entrepreneurs on this list — spanning education, beauty, real estate technology, legal services, and renewable energy — represent the full breadth of Malayali enterprise in 2025.",
      "What unites all ten is not just commercial success, but a visible commitment to community. Each of these entrepreneurs invests significantly in scholarships, cultural organisations, and employment opportunities for new arrivals from Kerala.",
      "As Dubai looks to the next decade, there is little doubt that the Malayali community will continue to punch far above its demographic weight — not just sustaining the UAE's economic engine, but quietly reimagining it.",
    ],
    contentMl: [
      "UAE-ലെ മലയാളി സമൂഹം ലോകത്തിലെ ഏറ്റവും സംരംഭക-നിർഭരമായ ഡയസ്‌പോര ഗ്രൂപ്പുകളിൽ ഒന്നായി അംഗീകരിക്കപ്പെട്ടിട്ടുണ്ട്. 12 ലക്ഷത്തിലധികം കേരളീയർ UAE-ൽ വസിക്കുന്നതോടെ, ഈ സമൂഹത്തിന്റെ സാമ്പത്തിക ഛായ ഏതാണ്ട് എല്ലാ മേഖലകളിലും വ്യാപിക്കുന്നു.",
      "2025-ൽ, ദുബായ് എക്‌സ്‌പോ-കാലഘട്ടത്തിന്റെ പൈതൃകങ്ങൾ തുടരുന്നതോടൊപ്പം, മലയാളി സംരംഭകർ ആ ചലനത്തിൽ പങ്കാളിക്കാക്കൽ മാത്രമല്ല — നേതൃത്വം നൽകുകയാണ്.",
      "ഈ ലേഖനം ദർശനവും ബിസിനസ് ആഘാതവും കൊണ്ട് വേർതിരിഞ്ഞ പത്ത് പ്രമുഖ വ്യക്തിത്വങ്ങളെ ഉയർത്തിക്കാണിക്കുന്നു.",
    ],
  },
  'onam-uae-celebrations-guide': {
    slug: 'onam-uae-celebrations-guide',
    title: 'Your Complete Guide to Onam Celebrations Across the UAE 2025',
    titleMl: 'UAE-ൽ ഓണം ആഘോഷങ്ങൾക്കുള്ള സമ്പൂർണ്ണ ഗൈഡ് 2025',
    excerpt: 'Sadya venues, cultural programmes, family events and shopping offers — everything you need to celebrate Onam in the Gulf.',
    excerptMl: 'സദ്യ സ്ഥലങ്ങൾ, സാംസ്കാരിക പരിപാടികൾ, കുടുംബ ഇവന്റുകൾ — ഗൾഫിൽ ഓണം ആഘോഷിക്കാൻ ആവശ്യമായ എല്ലാം.',
    coverImage: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&q=80&auto=format&fit=crop',
    author: {
      name: 'Meera Pillai',
      nameMl: 'മീര പിള്ള',
      avatar: 'https://i.pravatar.cc/80?img=23',
      role: 'Culture Writer',
      roleMl: 'സംസ്കാര എഴുത്തുകാർ',
    },
    category: 'Culture',
    categoryMl: 'സംസ്കാരം',
    tags: ['Onam', 'Festival', 'UAE', 'Kerala Culture'],
    date: 'Aug 15, 2025',
    dateMl: 'ഓഗസ്റ്റ് 15, 2025',
    readTime: '6 min read',
    readTimeMl: '6 മിനിറ്റ് വായന',
    views: 28700,
    likes: 1240,
    comments: 94,
    content: [
      "Onam — Kerala's most beloved harvest festival — transforms the UAE every September into a little Kerala, with sadyas stretching across hotel banquet halls, pookkalams blooming in community centres, and the rhythm of thiruvathira echoing from Abu Dhabi to Ras Al Khaimah.",
      "With Onam 2025 falling on September 5th (Thiruvonam), the preparations are already underway. Here's your definitive guide to celebrating it fully, wherever you are in the UAE.",
      "**SADYA: WHERE TO EAT**\nThe quintessential Onam Sadya experience is now offered by dozens of restaurants across all seven emirates. In Dubai, Tharavadu in Al Karama and Chakara in Karama have month-long advance bookings by August. Kerala House near DWTC is a classic. In Abu Dhabi, Arya Bhavan in Madinat Zayed and Kerala Kitchen in Mussafah are community favourites.",
      "For a more authentic community experience, several Malayali associations host sadya events open to the public. The Kerala Muslim Cultural Centre in Sharjah typically seats 2,000+, while the Kerala Association Dubai's main event at the cricket stadium is a landmark of the season.",
      "**CULTURAL PROGRAMMES**\nThe Onam season sees the UAE's cultural calendar fill up rapidly. Major performances include classical kathakali at Madinat Jumeirah, mohiniyattam recitals at the Indian Community Centre in Abu Dhabi, and fusion performances combining classical and contemporary Kerala music.",
      "**POOKKALAM COMPETITIONS**\nFlower carpet (pookkalam) competitions are held by most associations. The Dubai Malayalee Samajam competition attracts over 50 entries annually with AED prizes. Participants use marigolds, roses, and chrysanthemums sourced from the flower markets of Deira and Sharjah.",
      "**SHOPPING & DEALS**\nOnam is the biggest shopping season for Kerala businesses in the UAE. Expect 20–40% discounts on traditional wear (kasavu sarees, mundus), Kerala gold jewellery, and home goods. Most Kerala textile stores in Meena Bazaar and Gold Souk areas launch dedicated Onam collections by late August.",
      "Wherever you celebrate this Onam, the spirit of Mahabali's homecoming — one of prosperity, equality, and abundance — is alive and well in the UAE.",
    ],
    contentMl: [
      "ഓണം — കേരളത്തിന്റെ ഏറ്റവും പ്രിയപ്പെട്ട വിളവെടുപ്പ് ഉത്സവം — ഓരോ സെപ്തംബറിലും UAE-നെ ഒരു ചെറിയ കേരളമാക്കി മാറ്റുന്നു.",
      "2025-ൽ ഓണം (തിരുവോണം) സെപ്തംബർ 5-ന് ആണ്. ഇവിടെ UAE-ൽ അത് പൂർണ്ണമായി ആഘോഷിക്കാനുള്ള ഒരു ഗൈഡ്.",
    ],
  },
}

const COMMENTS: Comment[] = [
  {
    id: 1,
    name: 'Rahul Menon',
    avatar: 'https://i.pravatar.cc/48?img=12',
    date: 'May 12, 2025',
    text: 'Excellent article! Really inspiring to see how far our community has come in Dubai. The Ravi Menon story is particularly amazing.',
    likes: 24,
  },
  {
    id: 2,
    name: 'Asha George',
    avatar: 'https://i.pravatar.cc/48?img=44',
    date: 'May 11, 2025',
    text: 'Would have loved to see more women entrepreneurs featured. The healthcare and hospitality mentions are great but there are many more!',
    likes: 18,
  },
  {
    id: 3,
    name: 'Suresh Pillai',
    avatar: 'https://i.pravatar.cc/48?img=29',
    date: 'May 10, 2025',
    text: 'This brought tears to my eyes. 30 years of hard work by our elders made all of this possible. Proud to be Malayali.',
    likes: 67,
  },
]

const RELATED_ARTICLES = [
  {
    slug: 'onam-uae-celebrations-guide',
    title: 'Your Complete Onam Celebrations Guide UAE 2025',
    category: 'Culture',
    date: 'Aug 15, 2025',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&q=80&auto=format&fit=crop',
  },
  {
    slug: 'kerala-food-spots-dubai',
    title: '15 Best Kerala Restaurants in Dubai Right Now',
    category: 'Food',
    date: 'Apr 22, 2025',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80&auto=format&fit=crop',
  },
  {
    slug: 'invest-in-kerala-from-uae',
    title: 'How to Invest Back in Kerala from the UAE: A Complete Guide',
    category: 'Finance',
    date: 'Mar 30, 2025',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&q=80&auto=format&fit=crop',
  },
]

export default function ArticlePage() {
  const locale = useLocale()
  const isMl = locale === 'ml'
  const { slug } = useParams() as { slug: string }

  const article = ARTICLES[slug] ?? ARTICLES['top-malayali-entrepreneurs-dubai-2025']

  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [commentLikes, setCommentLikes] = useState<Record<number, boolean>>({})
  const [commentText, setCommentText] = useState('')
  const [commentPosted, setCommentPosted] = useState(false)

  const content = isMl ? article.contentMl : article.content

  function toggleCommentLike(id: number) {
    setCommentLikes(prev => ({ ...prev, [id]: !prev[id] }))
  }

  function submitComment(e: React.FormEvent) {
    e.preventDefault()
    if (!commentText.trim()) return
    setCommentPosted(true)
    setCommentText('')
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-16">
        {/* Cover image */}
        <div className="relative h-64 sm:h-80 md:h-[420px] w-full">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 max-w-4xl mx-auto w-full">
            <span className="inline-block bg-kerala-green text-white text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
              {isMl ? article.categoryMl : article.category}
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-snug">
              {isMl ? article.titleMl : article.title}
            </h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-gray-400 py-4 flex-wrap">
            <Link href={`/${locale}`} className="hover:text-kerala-green">{isMl ? 'ഹോം' : 'Home'}</Link>
            <ChevronRight size={12} />
            <Link href={`/${locale}/community`} className="hover:text-kerala-green">{isMl ? 'കമ്മ്യൂണിറ്റി' : 'Community'}</Link>
            <ChevronRight size={12} />
            <span className="text-kerala-deep font-medium line-clamp-1">{isMl ? article.titleMl : article.title}</span>
          </nav>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-4 py-4 border-y border-gray-100 mb-8">
            <div className="flex items-center gap-3">
              <Image src={article.author.avatar} alt={article.author.name} width={44} height={44} className="rounded-full" />
              <div>
                <p className="font-semibold text-kerala-deep text-sm">{isMl ? article.author.nameMl : article.author.name}</p>
                <p className="text-xs text-gray-400">{isMl ? article.author.roleMl : article.author.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-400 ml-auto flex-wrap">
              <span className="flex items-center gap-1"><Calendar size={12} />{isMl ? article.dateMl : article.date}</span>
              <span className="flex items-center gap-1"><Clock size={12} />{isMl ? article.readTimeMl : article.readTime}</span>
              <span className="flex items-center gap-1"><Eye size={12} />{article.views.toLocaleString()}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-10">
            {/* Main content */}
            <div>
              {/* Excerpt */}
              <p className="text-xl text-gray-600 leading-relaxed mb-8 font-light border-l-4 border-kerala-gold pl-5">
                {isMl ? article.excerptMl : article.excerpt}
              </p>

              {/* Body */}
              <div className="prose prose-lg max-w-none">
                {content.map((para, i) => {
                  if (para.startsWith('**') && para.includes('**\n')) {
                    const [heading, ...rest] = para.split('\n')
                    const headingText = heading.replace(/\*\*/g, '')
                    return (
                      <div key={i} className="mb-6">
                        <h3 className="font-serif text-xl font-bold text-kerala-deep mb-2">{headingText}</h3>
                        <p className="text-gray-600 leading-relaxed">{rest.join('\n')}</p>
                      </div>
                    )
                  }
                  return (
                    <p key={i} className="text-gray-600 leading-relaxed mb-6">{para}</p>
                  )
                })}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-gray-100">
                <Tag size={14} className="text-gray-400 mt-0.5" />
                {article.tags.map(tag => (
                  <Link
                    key={tag}
                    href={`/${locale}/community?tag=${tag.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-sm px-3 py-1 bg-kerala-cream text-gray-600 rounded-full hover:bg-kerala-green hover:text-white transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>

              {/* Reaction bar */}
              <div className="flex items-center gap-4 mt-6 py-4 border-y border-gray-100">
                <button
                  onClick={() => setLiked(!liked)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all text-sm font-semibold ${
                    liked ? 'border-kerala-red bg-kerala-red/5 text-kerala-red' : 'border-gray-200 text-gray-500 hover:border-kerala-red hover:text-kerala-red'
                  }`}
                >
                  <Heart size={16} className={liked ? 'fill-kerala-red' : ''} />
                  {article.likes + (liked ? 1 : 0)} {isMl ? 'ലൈക്ക്' : 'Likes'}
                </button>
                <button
                  onClick={() => setBookmarked(!bookmarked)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all text-sm font-semibold ${
                    bookmarked ? 'border-kerala-gold bg-kerala-gold/5 text-kerala-gold' : 'border-gray-200 text-gray-500 hover:border-kerala-gold hover:text-kerala-gold'
                  }`}
                >
                  <Bookmark size={16} className={bookmarked ? 'fill-kerala-gold' : ''} />
                  {isMl ? 'സേവ് ചെയ്യുക' : 'Save'}
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-gray-500 hover:border-kerala-green hover:text-kerala-green transition-all text-sm font-semibold ml-auto">
                  <Share2 size={16} />
                  {isMl ? 'ഷെയർ' : 'Share'}
                </button>
              </div>

              {/* Comments */}
              <div className="mt-10">
                <h2 className="font-serif text-2xl font-bold text-kerala-deep mb-6 flex items-center gap-2">
                  <MessageCircle size={22} className="text-kerala-green" />
                  {isMl ? 'അഭിപ്രായങ്ങൾ' : 'Comments'} ({article.comments + (commentPosted ? 1 : 0)})
                </h2>

                {/* Comment form */}
                {commentPosted ? (
                  <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6 text-green-700 text-sm font-medium">
                    {isMl ? 'അഭിപ്രായം പ്രസിദ്ധീകരിക്കാൻ കാത്തിരിക്കുന്നു. നന്ദി!' : 'Your comment is awaiting moderation. Thank you!'}
                  </div>
                ) : (
                  <form onSubmit={submitComment} className="mb-8 bg-kerala-cream rounded-2xl p-4">
                    <textarea
                      value={commentText}
                      onChange={e => setCommentText(e.target.value)}
                      placeholder={isMl ? 'നിങ്ങളുടെ അഭിപ്രായം ഇവിടെ എഴുതുക...' : 'Write your comment here...'}
                      className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm text-gray-700 resize-none focus:outline-none focus:border-kerala-green h-24"
                    />
                    <div className="flex justify-end mt-3">
                      <button
                        type="submit"
                        className="flex items-center gap-2 bg-kerala-green text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-kerala-green-light transition-colors"
                      >
                        <Send size={14} />
                        {isMl ? 'അഭിപ്രായം ഇടുക' : 'Post Comment'}
                      </button>
                    </div>
                  </form>
                )}

                <div className="space-y-5">
                  {COMMENTS.map(c => (
                    <div key={c.id} className="flex gap-4">
                      <Image src={c.avatar} alt={c.name} width={44} height={44} className="rounded-full flex-shrink-0" />
                      <div className="flex-1 bg-kerala-cream rounded-2xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-kerala-deep text-sm">{c.name}</span>
                          <span className="text-xs text-gray-400">{c.date}</span>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed mb-3">{c.text}</p>
                        <button
                          onClick={() => toggleCommentLike(c.id)}
                          className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                            commentLikes[c.id] ? 'text-kerala-red' : 'text-gray-400 hover:text-kerala-red'
                          }`}
                        >
                          <ThumbsUp size={13} className={commentLikes[c.id] ? 'fill-kerala-red' : ''} />
                          {c.likes + (commentLikes[c.id] ? 1 : 0)}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Author card */}
              <div className="bg-kerala-cream rounded-2xl p-5 text-center">
                <Image src={article.author.avatar} alt={article.author.name} width={72} height={72} className="rounded-full mx-auto mb-3" />
                <h3 className="font-semibold text-kerala-deep">{isMl ? article.author.nameMl : article.author.name}</h3>
                <p className="text-xs text-gray-400 mb-3">{isMl ? article.author.roleMl : article.author.role}</p>
                <button className="w-full bg-kerala-green text-white text-sm font-semibold py-2 rounded-xl hover:bg-kerala-green-light transition-colors">
                  {isMl ? 'ഫോളോ' : 'Follow'}
                </button>
              </div>

              {/* Stats */}
              <div className="bg-kerala-cream rounded-2xl p-5 space-y-3">
                <h3 className="font-semibold text-kerala-deep text-sm">{isMl ? 'ലേഖന സ്ഥിതിവിവരം' : 'Article Stats'}</h3>
                {[
                  { label: isMl ? 'കാഴ്ചകൾ' : 'Views', value: article.views.toLocaleString(), icon: Eye },
                  { label: isMl ? 'ലൈക്കുകൾ' : 'Likes', value: String(article.likes + (liked ? 1 : 0)), icon: Heart },
                  { label: isMl ? 'അഭിപ്രായങ്ങൾ' : 'Comments', value: String(article.comments), icon: MessageCircle },
                ].map(s => (
                  <div key={s.label} className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm text-gray-500">
                      <s.icon size={14} className="text-kerala-green" />
                      {s.label}
                    </span>
                    <span className="font-bold text-kerala-deep text-sm">{s.value}</span>
                  </div>
                ))}
              </div>

              {/* Related articles */}
              <div>
                <h3 className="font-semibold text-kerala-deep mb-3">{isMl ? 'അനുബന്ധ ലേഖനങ്ങൾ' : 'Related Articles'}</h3>
                <div className="space-y-3">
                  {RELATED_ARTICLES.map(ra => (
                    <Link
                      key={ra.slug}
                      href={`/${locale}/community/${ra.slug}`}
                      className="flex gap-3 group"
                    >
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                        <Image src={ra.image} alt={ra.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="64px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-600 group-hover:text-kerala-green transition-colors leading-snug line-clamp-2">{ra.title}</p>
                        <p className="text-xs text-gray-400 mt-1">{ra.date}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Back to community */}
              <Link
                href={`/${locale}/community`}
                className="flex items-center gap-2 text-kerala-green hover:text-kerala-green-light font-semibold text-sm"
              >
                <ArrowLeft size={16} />
                {isMl ? 'കമ്മ്യൂണിറ്റിലേക്ക് തിരികെ' : 'Back to Community'}
              </Link>
            </aside>
          </div>
        </div>
      </div>

      {/* Author bio footer */}
      <div className="bg-kerala-cream mt-16 py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex items-start gap-5">
          <Image src={article.author.avatar} alt={article.author.name} width={64} height={64} className="rounded-full flex-shrink-0" />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-kerala-green uppercase tracking-wider">{isMl ? 'ലേഖകൻ' : 'Written by'}</span>
            </div>
            <h3 className="font-serif text-xl font-bold text-kerala-deep mb-1">
              {isMl ? article.author.nameMl : article.author.name}
            </h3>
            <p className="text-sm text-gray-500">{isMl ? article.author.roleMl : article.author.role} · MalayaliBusiness.com</p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
