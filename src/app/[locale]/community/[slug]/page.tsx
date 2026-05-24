'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { useParams } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { getPost, getPostComments, getPosts } from '@/lib/community'
import type { CommunityPost, CommunityComment } from '@/lib/community'
import {
  Calendar, Clock, Eye, Heart, Bookmark, Share2, MessageCircle,
  ChevronRight, ArrowLeft, Tag, ThumbsUp, Send
} from 'lucide-react'

function formatDate(dateStr: string, ml: boolean) {
  const d = new Date(dateStr)
  if (ml) return d.toLocaleDateString('ml-IN', { day: 'numeric', month: 'long', year: 'numeric' })
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function ArticlePage() {
  const locale = useLocale()
  const isMl = locale === 'ml'
  const { slug } = useParams() as { slug: string }

  const [post, setPost] = useState<CommunityPost | null | undefined>(undefined)
  const [comments, setComments] = useState<CommunityComment[]>([])
  const [related, setRelated] = useState<CommunityPost[]>([])
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [commentLikes, setCommentLikes] = useState<Record<number, boolean>>({})
  const [commentText, setCommentText] = useState('')
  const [commentPosted, setCommentPosted] = useState(false)

  useEffect(() => {
    async function load() {
      const p = await getPost(slug)
      setPost(p)
      if (p) {
        const [coms, rel] = await Promise.all([
          getPostComments(p.id),
          getPosts({ limit: 3 }),
        ])
        setComments(coms)
        setRelated(rel.filter(r => r.slug !== slug).slice(0, 3))
      }
    }
    load()
  }, [slug])

  function toggleCommentLike(id: number) {
    setCommentLikes(prev => ({ ...prev, [id]: !prev[id] }))
  }

  function submitComment(e: React.FormEvent) {
    e.preventDefault()
    if (!commentText.trim()) return
    setCommentPosted(true)
    setCommentText('')
  }

  // Loading
  if (post === undefined) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="pt-16 animate-pulse">
          <div className="h-64 sm:h-80 md:h-[420px] bg-gray-100 w-full" />
          <div className="max-w-4xl mx-auto px-4 pt-8 space-y-4">
            <div className="h-4 bg-gray-100 rounded w-24" />
            <div className="h-6 bg-gray-100 rounded w-3/4" />
            <div className="h-4 bg-gray-100 rounded w-1/2" />
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  // Not found
  if (!post) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 text-center px-4">
          <div className="text-6xl mb-4">📰</div>
          <h1 className="font-serif text-2xl font-bold text-kerala-deep mb-2">Article Not Found</h1>
          <p className="text-gray-500 mb-6">This article may have been removed or is unavailable.</p>
          <Link href={`/${locale}/community`} className="bg-kerala-green text-white px-6 py-2.5 rounded-xl font-semibold text-sm">
            Back to Community
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  // Parse body into paragraphs
  const bodyText = (isMl ? (post.body_ml ?? post.body) : post.body) ?? ''
  const paragraphs = bodyText.split(/\n\n+/).filter(Boolean)

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-16">
        {/* Cover image */}
        <div className="relative h-64 sm:h-80 md:h-[420px] w-full bg-gray-100">
          {post.image_url && (
            <Image
              src={post.image_url}
              alt={post.title}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 max-w-4xl mx-auto w-full">
            <span className="inline-block bg-kerala-green text-white text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
              {isMl ? (post.category_ml ?? post.category) : post.category}
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-snug">
              {isMl ? (post.title_ml ?? post.title) : post.title}
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
            <span className="text-kerala-deep font-medium line-clamp-1">{isMl ? (post.title_ml ?? post.title) : post.title}</span>
          </nav>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-4 py-4 border-y border-gray-100 mb-8">
            <div className="flex items-center gap-3">
              {post.author_avatar && (
                <Image src={post.author_avatar} alt={post.author_name} width={44} height={44} className="rounded-full" />
              )}
              <div>
                <p className="font-semibold text-kerala-deep text-sm">
                  {isMl ? (post.author_name_ml ?? post.author_name) : post.author_name}
                </p>
                <p className="text-xs text-gray-400">
                  {isMl ? (post.author_role_ml ?? post.author_role) : post.author_role}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-400 ml-auto flex-wrap">
              <span className="flex items-center gap-1"><Calendar size={12} />{formatDate(post.published_at, isMl)}</span>
              <span className="flex items-center gap-1"><Clock size={12} />{post.read_time} {isMl ? 'മിനിറ്റ്' : 'min read'}</span>
              <span className="flex items-center gap-1"><Eye size={12} />{post.views.toLocaleString()}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-10">
            {/* Main content */}
            <div>
              {/* Excerpt */}
              <p className="text-xl text-gray-600 leading-relaxed mb-8 font-light border-l-4 border-kerala-gold pl-5">
                {isMl ? (post.excerpt_ml ?? post.excerpt) : post.excerpt}
              </p>

              {/* Body */}
              <div className="prose prose-lg max-w-none">
                {paragraphs.length > 0 ? paragraphs.map((para, i) => {
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
                  return <p key={i} className="text-gray-600 leading-relaxed mb-6">{para}</p>
                }) : (
                  <p className="text-gray-500 italic">{isMl ? 'ഉള്ളടക്കം ഉടൻ ലഭ്യമാകും...' : 'Full article content coming soon...'}</p>
                )}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-gray-100">
                <Tag size={14} className="text-gray-400 mt-0.5" />
                {post.tags.map(tag => (
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
                  {post.likes + (liked ? 1 : 0)} {isMl ? 'ലൈക്ക്' : 'Likes'}
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
                <button
                  onClick={() => navigator.clipboard.writeText(window.location.href)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-gray-500 hover:border-kerala-green hover:text-kerala-green transition-all text-sm font-semibold ml-auto"
                >
                  <Share2 size={16} />
                  {isMl ? 'ഷെയർ' : 'Share'}
                </button>
              </div>

              {/* Comments */}
              <div className="mt-10">
                <h2 className="font-serif text-2xl font-bold text-kerala-deep mb-6 flex items-center gap-2">
                  <MessageCircle size={22} className="text-kerala-green" />
                  {isMl ? 'അഭിപ്രായങ്ങൾ' : 'Comments'} ({post.comments_count + (commentPosted ? 1 : 0)})
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
                  {comments.map(c => (
                    <div key={c.id} className="flex gap-4">
                      {c.author_avatar ? (
                        <Image src={c.author_avatar} alt={c.author_name} width={44} height={44} className="rounded-full flex-shrink-0" />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-kerala-cream flex items-center justify-center text-kerala-green font-bold flex-shrink-0">
                          {c.author_name[0]}
                        </div>
                      )}
                      <div className="flex-1 bg-kerala-cream rounded-2xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-kerala-deep text-sm">{c.author_name}</span>
                          <span className="text-xs text-gray-400">{formatDate(c.created_at, isMl)}</span>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed mb-3">{c.body}</p>
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
                {post.author_avatar && (
                  <Image src={post.author_avatar} alt={post.author_name} width={72} height={72} className="rounded-full mx-auto mb-3" />
                )}
                <h3 className="font-semibold text-kerala-deep">
                  {isMl ? (post.author_name_ml ?? post.author_name) : post.author_name}
                </h3>
                <p className="text-xs text-gray-400 mb-3">
                  {isMl ? (post.author_role_ml ?? post.author_role) : post.author_role}
                </p>
                <button className="w-full bg-kerala-green text-white text-sm font-semibold py-2 rounded-xl hover:bg-kerala-green-light transition-colors">
                  {isMl ? 'ഫോളോ' : 'Follow'}
                </button>
              </div>

              {/* Stats */}
              <div className="bg-kerala-cream rounded-2xl p-5 space-y-3">
                <h3 className="font-semibold text-kerala-deep text-sm">{isMl ? 'ലേഖന സ്ഥിതിവിവരം' : 'Article Stats'}</h3>
                {[
                  { label: isMl ? 'കാഴ്ചകൾ' : 'Views', value: post.views.toLocaleString(), icon: Eye },
                  { label: isMl ? 'ലൈക്കുകൾ' : 'Likes', value: String(post.likes + (liked ? 1 : 0)), icon: Heart },
                  { label: isMl ? 'അഭിപ്രായങ്ങൾ' : 'Comments', value: String(post.comments_count), icon: MessageCircle },
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
              {related.length > 0 && (
                <div>
                  <h3 className="font-semibold text-kerala-deep mb-3">{isMl ? 'അനുബന്ധ ലേഖനങ്ങൾ' : 'Related Articles'}</h3>
                  <div className="space-y-3">
                    {related.map(ra => (
                      <Link
                        key={ra.slug}
                        href={`/${locale}/community/${ra.slug}`}
                        className="flex gap-3 group"
                      >
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                          {ra.image_url && (
                            <Image src={ra.image_url} alt={ra.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="64px" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-600 group-hover:text-kerala-green transition-colors leading-snug line-clamp-2">
                            {isMl ? (ra.title_ml ?? ra.title) : ra.title}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">{formatDate(ra.published_at, isMl)}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

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
          {post.author_avatar && (
            <Image src={post.author_avatar} alt={post.author_name} width={64} height={64} className="rounded-full flex-shrink-0" />
          )}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-kerala-green uppercase tracking-wider">{isMl ? 'ലേഖകൻ' : 'Written by'}</span>
            </div>
            <h3 className="font-serif text-xl font-bold text-kerala-deep mb-1">
              {isMl ? (post.author_name_ml ?? post.author_name) : post.author_name}
            </h3>
            <p className="text-sm text-gray-500">
              {isMl ? (post.author_role_ml ?? post.author_role) : post.author_role} · MalayaliBusiness.com
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
