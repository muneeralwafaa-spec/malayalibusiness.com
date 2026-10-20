'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles, Search, Building2, Tag } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

function renderMarkdown(text: string): string {
  return text
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Clickable links [text](url)
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-kerala-deep underline font-medium hover:text-kerala-green">$1</a>')
    // Bullet points
    .replace(/^- (.+)$/gm, '<div class="flex gap-1.5 mt-1"><span class="text-kerala-gold mt-0.5">•</span><span>$1</span></div>')
    // Line breaks
    .replace(/\n/g, '<br/>')
}

const QUICK_OPTIONS = [
  {
    label: 'Find a Business',
    icon: Search,
    message: 'I want to find a business',
    followUp: 'What type of business are you looking for? (e.g. restaurant, IT company, accounting, cargo, real estate…) And which emirate?',
  },
  {
    label: 'List My Business',
    icon: Building2,
    message: 'I want to list my business',
    href: '/en/dashboard',
    followUp: 'Great! You can list your business for free on Malayalibusiness.com.\n\n👉 [Go to Dashboard & Add Your Listing](https://www.malayalibusiness.com/en/dashboard)\n\nOnce listed, your business will be visible to thousands of Malayalis across the UAE. Need help with anything before listing?',
  },
  {
    label: 'Post a Classified',
    icon: Tag,
    message: 'I want to post a classified ad',
    href: '/en/classifieds/new',
    followUp: 'You can post a classified ad for free!\n\n👉 [Post Your Classified Now](https://www.malayalibusiness.com/en/classifieds/new)\n\nYou can post for: items for sale, rentals, services, jobs, and more. Need help with anything?',
  },
]

export default function AIChatWidget() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm Sallu, your AI assistant for Malayalibusiness.com 👋 I can help you find Malayali businesses, services, or answer any questions. How can I help you today?"
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMsg: Message = { role: 'user', content: text }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }))
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history }),
      })
      const data = await res.json()
      if (data.reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <>
      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 max-h-[70vh] flex flex-col bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-kerala-deep to-kerala-green p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-white font-semibold text-sm flex items-center gap-1">
                  Sallu <Sparkles className="w-3 h-3 text-kerala-gold" />
                </div>
                <div className="text-white/70 text-xs">AI Assistant · Always online</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 min-h-0">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'assistant' ? 'bg-kerala-deep' : 'bg-kerala-gold'}`}>
                  {msg.role === 'assistant'
                    ? <Bot className="w-4 h-4 text-white" />
                    : <User className="w-4 h-4 text-white" />
                  }
                </div>
                <div className={`max-w-[78%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'assistant'
                    ? 'bg-white text-gray-800 shadow-sm rounded-tl-sm'
                    : 'bg-kerala-deep text-white rounded-tr-sm'
                }`}>
                  {msg.role === 'assistant'
                    ? <span dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }} />
                    : msg.content
                  }
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-kerala-deep flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm">
                  <Loader2 className="w-4 h-4 animate-spin text-kerala-deep" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick options */}
          {messages.length === 1 && (
            <div className="px-3 py-3 bg-white border-t border-gray-100 flex flex-col gap-2">
              <p className="text-xs text-gray-400 px-1">Quick options:</p>
              {QUICK_OPTIONS.map(opt => {
                const Icon = opt.icon
                return (
                  <button
                    key={opt.label}
                    onClick={() => {
                      // Show user message
                      const userMsg: Message = { role: 'user', content: opt.message }
                      const assistantMsg: Message = { role: 'assistant', content: opt.followUp }
                      setMessages(prev => [...prev, userMsg, assistantMsg])
                    }}
                    className="flex items-center gap-3 px-4 py-2.5 bg-kerala-deep/5 hover:bg-kerala-deep/10 border border-kerala-deep/10 rounded-xl text-sm text-kerala-deep font-medium transition-colors text-left"
                  >
                    <Icon className="w-4 h-4 flex-shrink-0 text-kerala-green" />
                    {opt.label}
                  </button>
                )
              })}
            </div>
          )}

          {/* Input */}
          <div className="p-3 bg-white border-t border-gray-200 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask me anything..."
              className="flex-1 text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-kerala-deep/30"
            />
            <button
              onClick={send}
              disabled={!input.trim() || loading}
              className="w-9 h-9 bg-kerala-deep text-white rounded-xl flex items-center justify-center disabled:opacity-40 hover:bg-kerala-green transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setOpen(prev => !prev)}
        className="fixed bottom-6 right-4 sm:right-6 z-50 w-14 h-14 bg-gradient-to-br from-kerala-deep to-kerala-green text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all hover:scale-105"
        aria-label="Open AI Chat"
      >
        {open
          ? <X className="w-6 h-6" />
          : <MessageCircle className="w-6 h-6" />
        }
        {!open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-kerala-gold rounded-full flex items-center justify-center">
            <Sparkles className="w-2.5 h-2.5 text-white" />
          </span>
        )}
      </button>
    </>
  )
}
