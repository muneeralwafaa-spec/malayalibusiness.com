'use client'

import { useState } from 'react'
import { useLocale } from 'next-intl'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import {
  Shield, Building2, Users, User, ChevronDown, ChevronRight,
  LogIn, UserPlus, Search, Star, MessageSquare, ShoppingBag,
  BarChart2, Briefcase, CreditCard, Settings, Plus, CheckCircle,
  Eye, Globe, Phone, Mail, MapPin, AlertTriangle, BookOpen
} from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────────────
type Role = 'getting-started' | 'user' | 'vendor' | 'admin'

interface Step {
  en: string
  ml: string
}

interface Section {
  id: string
  titleEn: string
  titleMl: string
  icon: React.ElementType
  steps: Step[]
}

interface RoleGuide {
  id: Role
  labelEn: string
  labelMl: string
  icon: React.ElementType
  color: string
  bg: string
  border: string
  descEn: string
  descMl: string
  sections: Section[]
}

// ── Content ────────────────────────────────────────────────────────────────
const guides: RoleGuide[] = [
  // ── 1. GETTING STARTED ──────────────────────────────────────────────────
  {
    id: 'getting-started',
    labelEn: 'Getting Started',
    labelMl: 'ആരംഭിക്കൽ',
    icon: BookOpen,
    color: 'text-kerala-green',
    bg: 'bg-kerala-green/10',
    border: 'border-kerala-green/20',
    descEn: 'New to MalayaliBusiness? Start here — learn how to navigate the platform, create an account, and find what you need.',
    descMl: 'MalayaliBusiness-ൽ പുതിയതോ? ഇവിടെ ആരംഭിക്കൂ — പ്ലാറ്റ്‌ഫോം നാവിഗേറ്റ് ചെയ്യാനും അക്കൗണ്ട് ഉണ്ടാക്കാനും ആവശ്യമുള്ളത് കണ്ടെത്താനും പഠിക്കൂ.',
    sections: [
      {
        id: 'overview',
        titleEn: 'What is MalayaliBusiness?',
        titleMl: 'MalayaliBusiness എന്താണ്?',
        icon: Globe,
        steps: [
          {
            en: 'MalayaliBusiness (www.malayalibusiness.com) is UAE\'s #1 Malayali business directory and community platform — connecting Malayali business owners, customers, and professionals across all 7 UAE emirates.',
            ml: 'MalayaliBusiness (www.malayalibusiness.com) UAE-ലെ #1 മലയാളി ബിസിനസ് ഡയറക്ടറിയും കമ്മ്യൂണിറ്റി പ്ലാറ്റ്‌ഫോമുമാണ് — UAE-ലെ 7 എമിറേറ്റുകളിലും മലയാളി ബിസിനസ് ഉടമകളെ, ഉപഭോക്താക്കളെ, പ്രൊഫഷണലുകളെ ബന്ധിപ്പിക്കുന്നു.'
          },
          {
            en: 'The platform has four main sections: Business Directory (find businesses), Classifieds (buy/sell ads), Events (community events), Jobs (job postings), Shop (online store), and Community (forums & profiles).',
            ml: 'പ്ലാറ്റ്‌ഫോമിന് നാല് പ്രധാന വിഭാഗങ്ങളുണ്ട്: ബിസിനസ് ഡയറക്ടറി, ക്ലാസിഫൈഡ്സ്, ഇവന്റ്സ്, ജോബ്സ്, ഷോപ്പ്, കമ്മ്യൂണിറ്റി.'
          },
          {
            en: 'The site supports two languages: English (EN) and Malayalam (ML). Use the language toggle button (top-right of the navbar) to switch between them at any time.',
            ml: 'സൈറ്റ് രണ്ട് ഭാഷകളെ പിന്തുണയ്ക്കുന്നു: ഇംഗ്ലീഷ് (EN), മലയാളം (ML). ഭാഷ മാറ്റാൻ നാവ്‌ബാറിന്റെ വലത്-മുകളിൽ ഉള്ള ഭാഷ ടോഗിൾ ബട്ടൺ ഉപയോഗിക്കൂ.'
          }
        ]
      },
      {
        id: 'create-account',
        titleEn: 'How to Create an Account',
        titleMl: 'അക്കൗണ്ട് എങ്ങനെ ഉണ്ടാക്കാം',
        icon: UserPlus,
        steps: [
          {
            en: 'Go to www.malayalibusiness.com. In the top navigation bar (the dark green bar at the top of the page), click the "Login" button on the right side.',
            ml: 'www.malayalibusiness.com-ൽ പോകൂ. പേജിന്റെ മുകളിലുള്ള ഡാർക്ക് ഗ്രീൻ നാവ്‌ബാറിൽ, വലതുവശത്ത് "Login" ബട്ടൺ ക്ലിക്ക് ചെയ്യൂ.'
          },
          {
            en: 'You will land on the Sign In / Sign Up page. Click the "Create account" tab (shown as a tab at the top of the white form card).',
            ml: 'നിങ്ങൾ Sign In / Sign Up പേജിലെത്തും. വെള്ള ഫോം കാർഡിന്റെ മുകളിൽ "Create account" ടാബ് ക്ലിക്ക് ചെയ്യൂ.'
          },
          {
            en: 'Fill in the form: Full Name (your complete name), Email Address (must be a valid email), Password (minimum 6 characters), Phone Number (optional, with UAE country code +971). If you are registering as a business owner, check the box that says "I am a business owner / vendor".',
            ml: 'ഫോം പൂരിപ്പിക്കൂ: Full Name (നിങ്ങളുടെ പൂർണ്ണ പേര്), Email Address (സാധുതയുള്ള ഇമെയിൽ), Password (കുറഞ്ഞത് 6 അക്ഷരം), Phone Number (ഐച്ഛികം, +971 കോഡ് സഹിതം). ബിസിനസ് ഉടമ ആണെങ്കിൽ "I am a business owner / vendor" ചെക്ക്ബോക്സ് ടിക്ക് ചെയ്യൂ.'
          },
          {
            en: 'Click the green "Create Account" button. You will be automatically signed in and redirected to the home page. Your profile is created instantly.',
            ml: 'ഗ്രീൻ "Create Account" ബട്ടൺ ക്ലിക്ക് ചെയ്യൂ. നിങ്ങൾ ഓട്ടോമാറ്റിക്കലി സൈൻ ഇൻ ആകുകയും ഹോം പേജിലേക്ക് റിഡയറക്ട് ആകുകയും ചെയ്യും. നിങ്ങളുടെ പ്രൊഫൈൽ ഉടനടി ക്രിയേറ്റ് ആകും.'
          },
          {
            en: 'Alternatively, click "Continue with Google" to sign up instantly using your Google account — no password required.',
            ml: 'പകരം, "Continue with Google" ക്ലിക്ക് ചെയ്ത് Google അക്കൗണ്ട് ഉപയോഗിച്ച് ഉടനടി സൈൻ അപ്പ് ചെയ്യാം — പാസ്‌വേഡ് ആവശ്യമില്ല.'
          }
        ]
      },
      {
        id: 'login',
        titleEn: 'How to Log In',
        titleMl: 'ലോഗ് ഇൻ എങ്ങനെ ചെയ്യാം',
        icon: LogIn,
        steps: [
          {
            en: 'Click "Login" in the top navigation bar. The Sign In form will appear with two input fields: Email Address and Password.',
            ml: 'ടോപ് നാവ്‌ബാറിൽ "Login" ക്ലിക്ക് ചെയ്യൂ. Sign In ഫോം രണ്ട് ഫീൽഡുകളോടെ ദൃശ്യമാകും: Email Address, Password.'
          },
          {
            en: 'Enter the email and password you registered with. Click the green "Sign In" button.',
            ml: 'രജിസ്റ്റർ ചെയ്ത ഇമെയിലും പാസ്‌വേഡും നൽകൂ. ഗ്രീൻ "Sign In" ബട്ടൺ ക്ലിക്ക് ചെയ്യൂ.'
          },
          {
            en: 'If you registered with Google, click "Continue with Google" instead — you will be signed in without a password.',
            ml: 'Google ഉപയോഗിച്ച് രജിസ്റ്റർ ചെയ്തിട്ടുണ്ടെങ്കിൽ "Continue with Google" ക്ലിക്ക് ചെയ്യൂ — പാസ്‌വേഡില്ലാതെ സൈൻ ഇൻ ആകും.'
          },
          {
            en: 'After successful login, you will be redirected to the home page. Your name or email will appear in the top navigation bar confirming you are logged in.',
            ml: 'വിജയകരമായ ലോഗിനു ശേഷം ഹോം പേജിലേക്ക് റിഡയറക്ട് ആകും. ടോപ് നാവ്‌ബാറിൽ നിങ്ങളുടെ പേര് അല്ലെങ്കിൽ ഇമെയിൽ ദൃശ്യമാകും.'
          }
        ]
      },
      {
        id: 'navigate',
        titleEn: 'How to Navigate the Site',
        titleMl: 'സൈറ്റ് നാവിഗേറ്റ് ചെയ്യൽ',
        icon: Globe,
        steps: [
          {
            en: 'The top navigation bar (dark green, fixed at the top) contains: Logo (click to go home), Business Directory, Classifieds, Events, Jobs, Shop, Community, Language toggle (EN/ML), Login, and "List Your Business" (gold button).',
            ml: 'ടോപ് നാവ്‌ബാർ (ഡാർക്ക് ഗ്രീൻ, മുകളിൽ ഫിക്സ്ഡ്) ഇവ ഉൾക്കൊള്ളുന്നു: ലോഗോ (ഹോമിലേക്ക്), ബിസിനസ് ഡയറക്ടറി, ക്ലാസിഫൈഡ്സ്, ഇവന്റ്സ്, ജോബ്സ്, ഷോപ്പ്, കമ്മ്യൂണിറ്റി, ഭാഷ ടോഗിൾ, ലോഗിൻ, "List Your Business" ബട്ടൺ.'
          },
          {
            en: 'On mobile (phones and small tablets), the navigation menu is hidden. Tap the hamburger icon (three horizontal lines, top-right) to open the mobile menu. All navigation links are listed inside the sliding menu.',
            ml: 'മൊബൈലിൽ (ഫോൺ, ചെറിയ ടാബ്ലറ്റ്) നാവിഗേഷൻ മെനു മറഞ്ഞിരിക്കും. ഹാംബർഗർ ഐക്കൺ (മൂന്ന് ഹൊറിസോൺടൽ ലൈൻ, വലത്-മുകൾ) ടാപ്പ് ചെയ്ത് മൊബൈൽ മെനു തുറക്കൂ.'
          },
          {
            en: 'The URL structure uses the language prefix: /en/ for English pages and /ml/ for Malayalam pages. Example: www.malayalibusiness.com/en/directory',
            ml: 'URL ഘടന ഭാഷ prefix ഉപയോഗിക്കുന്നു: ഇംഗ്ലീഷ് പേജുകൾക്ക് /en/, മലയാളം പേജുകൾക്ക് /ml/. ഉദാ: www.malayalibusiness.com/en/directory'
          }
        ]
      }
    ]
  },

  // ── 2. REGULAR USER ─────────────────────────────────────────────────────
  {
    id: 'user',
    labelEn: 'Regular User',
    labelMl: 'സാധാരണ ഉപഭോക്താവ്',
    icon: User,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    descEn: 'A regular user can browse the directory, search businesses, read reviews, write reviews, and manage their personal profile — all without needing a business listing.',
    descMl: 'ഒരു സാധാരണ ഉപഭോക്താവിന് ഡയറക്ടറി ബ്രൗസ് ചെയ്യാം, ബിസിനസുകൾ തിരയാം, റിവ്യൂ വായിക്കാം, റിവ്യൂ എഴുതാം, പ്രൊഫൈൽ മാനേജ് ചെയ്യാം — ബിസിനസ് ലിസ്റ്റിംഗ് ആവശ്യമില്ല.',
    sections: [
      {
        id: 'search-directory',
        titleEn: 'Searching the Business Directory',
        titleMl: 'ബിസിനസ് ഡയറക്ടറി തിരയൽ',
        icon: Search,
        steps: [
          {
            en: 'Click "Business Directory" in the navigation bar to go to /en/directory. You will see a search bar at the top, a filters sidebar on the left, and a grid of business cards on the right.',
            ml: '"Business Directory" ക്ലിക്ക് ചെയ്ത് /en/directory-ലേക്ക് പോകൂ. മുകളിൽ സെർച്ച് ബാർ, ഇടതുവശത്ത് ഫിൽട്ടർ സൈഡ്ബാർ, വലതുവശത്ത് ബിസിനസ് കാർഡ് ഗ്രിഡ് ദൃശ്യമാകും.'
          },
          {
            en: 'To search by name: Type any business name or keyword into the search bar (the wide input field labelled "Search businesses...") and press Enter or click the magnifying glass icon.',
            ml: 'പേര് ഉപയോഗിച്ച് തിരയാൻ: "Search businesses..." എന്ന് ലേബൽ ചെയ്ത സെർച്ച് ബാറിൽ ബിസിനസ് പേര് അല്ലെങ്കിൽ കീവേഡ് ടൈപ്പ് ചെയ്ത് Enter അമർത്തൂ.'
          },
          {
            en: 'To filter by Category: In the left sidebar, click any category name (e.g. "Restaurants & Food", "Healthcare & Medical") to show only businesses in that category. The active category will be highlighted in green.',
            ml: 'ക്യാറ്റഗറി ഉപയോഗിച്ച് ഫിൽട്ടർ ചെയ്യാൻ: ഇടത് സൈഡ്ബാറിൽ ഏതെങ്കിലും ക്യാറ്റഗറി പേര് ക്ലിക്ക് ചെയ്യൂ. ആക്ടീവ് ക്യാറ്റഗറി ഗ്രീൻ നിറത്തിൽ ഹൈലൈറ്റ് ആകും.'
          },
          {
            en: 'To filter by Emirate: In the left sidebar, scroll down to the "Emirate" section and click the emirate name (Dubai, Abu Dhabi, Sharjah, Ajman, Ras Al Khaimah, Fujairah, Umm Al Quwain) to show only businesses in that emirate.',
            ml: 'എമിറേറ്റ് ഉപയോഗിച്ച് ഫിൽട്ടർ ചെയ്യാൻ: ഇടത് സൈഡ്ബാറിൽ "Emirate" സെക്ഷനിലേക്ക് സ്ക്രോൾ ചെയ്ത് എമിറേറ്റ് പേര് ക്ലിക്ക് ചെയ്യൂ.'
          },
          {
            en: 'To sort results: Above the business cards grid, use the "Sort by" dropdown to sort by Relevance, Highest Rating, Most Reviews, or Newest.',
            ml: 'ഫലങ്ങൾ സോർട്ട് ചെയ്യാൻ: ബിസിനസ് കാർഡ് ഗ്രിഡിന് മുകളിൽ "Sort by" ഡ്രോപ്ഡൗൺ ഉപയോഗിക്കൂ: Relevance, Highest Rating, Most Reviews, Newest.'
          },
          {
            en: 'To switch between Grid and List view: Click the grid icon (four squares) or list icon (three lines) above the business cards to toggle the display layout.',
            ml: 'Grid, List വ്യൂ മാറ്റാൻ: ബിസിനസ് കാർഡുകൾക്ക് മുകളിൽ ഗ്രിഡ് ഐക്കൺ അല്ലെങ്കിൽ ലിസ്റ്റ് ഐക്കൺ ക്ലിക്ക് ചെയ്യൂ.'
          },
          {
            en: 'To clear all active filters: Click the "Clear all" link (appears in red/orange next to active filter tags) or click the "Clear filters" button in the left sidebar.',
            ml: 'ഫിൽട്ടറുകൾ മായ്ക്കാൻ: "Clear all" ലിങ്ക് ക്ലിക്ക് ചെയ്യൂ (ആക്ടീവ് ഫിൽട്ടർ ടാഗുകൾക്ക് അടുത്ത്) അല്ലെങ്കിൽ ഇടത് സൈഡ്ബാറിൽ "Clear filters" ബട്ടൺ ക്ലിക്ക് ചെയ്യൂ.'
          },
          {
            en: 'Results are paginated (9 per page). Use the page number buttons at the bottom of the results to go to the next/previous page.',
            ml: 'ഫലങ്ങൾ paginated ആണ് (ഒരു പേജിൽ 9). അടുത്ത/മുൻ പേജ് കാണാൻ ഫലങ്ങളുടെ താഴെ പേജ് നമ്പർ ബട്ടണുകൾ ഉപയോഗിക്കൂ.'
          }
        ]
      },
      {
        id: 'view-business',
        titleEn: 'Viewing a Business Profile',
        titleMl: 'ഒരു ബിസിനസ് പ്രൊഫൈൽ കാണൽ',
        icon: Eye,
        steps: [
          {
            en: 'Click "View Details" on any business card in the directory, or click the business name itself. This opens the full business profile page at /en/company/[business-name].',
            ml: 'ഡയറക്ടറിയിൽ ഏതെങ്കിലും ബിസിനസ് കാർഡിൽ "View Details" ക്ലിക്ക് ചെയ്യൂ. ഇത് /en/company/[business-name] ൽ ഫുൾ ബിസിനസ് പ്രൊഫൈൽ പേജ് തുറക്കുന്നു.'
          },
          {
            en: 'The business profile page has a header section showing: the business logo (top-left), business name, category badge, location (emirate and area), rating stars and review count, verification badge (blue tick if verified), and contact buttons (WhatsApp, Phone, Email, Website).',
            ml: 'ബിസിനസ് പ്രൊഫൈൽ പേജ് ഹെഡർ: ബിസിനസ് ലോഗോ, പേര്, ക്യാറ്റഗറി ബാഡ്ജ്, ലൊക്കേഷൻ, റേറ്റിംഗ് സ്റ്റാർ, റിവ്യൂ കൗണ്ട്, വെരിഫിക്കേഷൻ ബാഡ്ജ്, കോൺടാക്ട് ബട്ടണുകൾ (WhatsApp, Phone, Email, Website).'
          },
          {
            en: 'Below the header are tabs: About, Services, Reviews, Gallery, Shop, and Team. Click each tab to see that section of information.',
            ml: 'ഹെഡറിന് താഴെ ടാബുകൾ ഉണ്ട്: About, Services, Reviews, Gallery, Shop, Team. ഓരോ ടാബ് ക്ലിക്ക് ചെയ്ത് ആ വിഭാഗം കാണൂ.'
          },
          {
            en: 'About tab: Shows the full business description, address, working languages, and other details about the business.',
            ml: 'About ടാബ്: ബിസിനസ് വിവരണം, വിലാസം, ഭാഷകൾ, മറ്റ് വിശദാംശങ്ങൾ കാണിക്കുന്നു.'
          },
          {
            en: 'Services tab: Lists all services offered by the business with names, descriptions, and pricing if available.',
            ml: 'Services ടാബ്: ബിസിനസ് വാഗ്ദാനം ചെയ്യുന്ന എല്ലാ സേവനങ്ങളും പേര്, വിവരണം, വില എന്നിവ സഹിതം ലിസ്റ്റ് ചെയ്യുന്നു.'
          },
          {
            en: 'Reviews tab: Shows all customer reviews with star ratings (1–5), reviewer name, review text, and date. You can also write your own review from this tab.',
            ml: 'Reviews ടാബ്: Star ratings (1–5), reviewer name, review text, date സഹിതം എല്ലാ customer reviews-ഉം കാണിക്കുന്നു. ഈ ടാബിൽ നിന്ന് review എഴുതാം.'
          },
          {
            en: 'Gallery tab: Shows photos uploaded by the business. If no photos have been added, an empty state message ("No photos added yet") is shown.',
            ml: 'Gallery ടാബ്: ബിസിനസ് upload ചെയ്ത ഫോട്ടോകൾ കാണിക്കുന്നു. ഫോട്ടോ ഇല്ലെങ്കിൽ "No photos added yet" message കാണിക്കും.'
          },
          {
            en: 'Shop tab: Shows products/services available for purchase or enquiry from the business.',
            ml: 'Shop ടാബ്: ബിസിനസിൽ നിന്ന് വാങ്ങാവുന്ന / അന്വേഷിക്കാവുന്ന products/services കാണിക്കുന്നു.'
          },
          {
            en: 'Team tab: Shows team members and staff of the business with their names, roles, and photos if added.',
            ml: 'Team ടാബ്: ബിസിനസിന്റെ team members-ഉം staff-ഉം പേര്, role, ഫോട്ടോ സഹിതം കാണിക്കുന്നു.'
          },
          {
            en: 'To contact the business: Click the green "WhatsApp" button to open a WhatsApp chat, the "Call" button to dial, the "Email" button to send an email, or the "Website" button to visit their website.',
            ml: 'ബിസിനസ് contact ചെയ്യാൻ: ഗ്രീൻ "WhatsApp" ബട്ടൺ ക്ലിക്ക് ചെയ്ത് WhatsApp chat തുറക്കൂ, "Call" ബട്ടൺ ഫോൺ ചെയ്യാൻ, "Email" ബട്ടൺ ഇമെയിൽ അയക്കാൻ, "Website" ബട്ടൺ website സന്ദർശിക്കാൻ.'
          }
        ]
      },
      {
        id: 'write-review',
        titleEn: 'Writing a Review',
        titleMl: 'ഒരു റിവ്യൂ എഴുതൽ',
        icon: Star,
        steps: [
          {
            en: 'Open any business profile page and click the "Reviews" tab. Scroll down to the review submission form at the bottom of the reviews section.',
            ml: 'ഏതെങ്കിലും ബിസിനസ് പ്രൊഫൈൽ തുറന്ന് "Reviews" ടാബ് ക്ലിക്ക് ചെയ്യൂ. Reviews section-ന്റെ ചുവടെ review submission form-ലേക്ക് scroll ചെയ്യൂ.'
          },
          {
            en: 'In the review form: Enter your name in the "Your Name" field. Click the star rating (1 to 5 stars) to select your rating — 5 stars is the best. Write your review text in the "Your Review" text box.',
            ml: 'Review form-ൽ: "Your Name" ഫീൽഡിൽ നിങ്ങളുടെ പേര് നൽകൂ. Star rating (1 to 5 stars) ക്ലിക്ക് ചെയ്ത് rating തിരഞ്ഞെടുക്കൂ — 5 stars ആണ് ഏറ്റവും നല്ലത്. "Your Review" text box-ൽ review text എഴുതൂ.'
          },
          {
            en: 'Click the "Submit Review" button (green button at the bottom of the form). Your review will be submitted and appear in the reviews list.',
            ml: '"Submit Review" ബട്ടൺ (form-ന്റെ ചുവടെ ഗ്രീൻ ബട്ടൺ) ക്ലിക്ക് ചെയ്യൂ. നിങ്ങളുടെ review submit ആകുകയും reviews list-ൽ ദൃശ്യമാകുകയും ചെയ്യും.'
          }
        ]
      },
      {
        id: 'manage-profile',
        titleEn: 'Managing Your Profile',
        titleMl: 'നിങ്ങളുടെ പ്രൊഫൈൽ മാനേജ് ചെയ്യൽ',
        icon: Settings,
        steps: [
          {
            en: 'After logging in, click "List Your Business" or navigate to /en/dashboard. Then click "Settings" in the left sidebar of the dashboard.',
            ml: 'ലോഗിൻ ചെയ്ത ശേഷം "List Your Business" ക്ലിക്ക് ചെയ്ത് /en/dashboard-ലേക്ക് പോകൂ. Dashboard-ന്റെ ഇടത് sidebar-ൽ "Settings" ക്ലിക്ക് ചെയ്യൂ.'
          },
          {
            en: 'In the Settings section, you will see two sub-tabs: "Personal Info" and "Business Info". Click "Personal Info" to update your name, phone number, and profile photo.',
            ml: 'Settings section-ൽ രണ്ട് sub-tabs ദൃശ്യമാകും: "Personal Info", "Business Info". "Personal Info" ക്ലിക്ക് ചെയ്ത് നിങ്ങളുടെ പേര്, ഫോൺ നമ്പർ, പ്രൊഫൈൽ ഫോട്ടോ update ചെയ്യൂ.'
          },
          {
            en: 'To update your name or phone: Edit the "Full Name" and "Phone" input fields and click the green "Save Changes" button. Your email address cannot be changed as it is your login identity.',
            ml: 'പേരോ ഫോണോ update ചെയ്യാൻ: "Full Name", "Phone" ഫീൽഡ് edit ചെയ്ത് "Save Changes" ബട്ടൺ ക്ലിക്ക് ചെയ്യൂ. Email address login identity ആയതിനാൽ മാറ്റാൻ കഴിയില്ല.'
          }
        ]
      }
    ]
  },

  // ── 3. VENDOR / BUSINESS OWNER ──────────────────────────────────────────
  {
    id: 'vendor',
    labelEn: 'Business Owner / Vendor',
    labelMl: 'ബിസിനസ് ഉടമ / വെൻഡർ',
    icon: Building2,
    color: 'text-kerala-green',
    bg: 'bg-kerala-green/10',
    border: 'border-kerala-green/20',
    descEn: 'A Business Owner can list their business, manage their shop, post jobs, track analytics, handle enquiries and orders — all from the Vendor Dashboard.',
    descMl: 'ഒരു Business Owner-ന് ബിസിനസ് ലിസ്റ്റ് ചെയ്യാം, ഷോപ്പ് മാനേജ് ചെയ്യാം, ജോബ് പോസ്റ്റ് ചെയ്യാം, analytics track ചെയ്യാം, enquiries-ഉം orders-ഉം handle ചെയ്യാം — Vendor Dashboard-ൽ നിന്ന്.',
    sections: [
      {
        id: 'vendor-access',
        titleEn: 'Accessing the Vendor Dashboard',
        titleMl: 'Vendor Dashboard ആക്സസ് ചെയ്യൽ',
        icon: LogIn,
        steps: [
          {
            en: 'Make sure you have created an account with the "I am a business owner / vendor" checkbox selected during sign-up. If you already have an account without this, contact the admin to update your account type.',
            ml: 'Sign-up ചെയ്യുമ്പോൾ "I am a business owner / vendor" checkbox select ചെയ്ത് account create ചെയ്തിട്ടുണ്ടെന്ന് ഉറപ്പ് വരുത്തൂ. ഇല്ലെങ്കിൽ account type update ചെയ്യാൻ admin-ഉമായി contact ചെയ്യൂ.'
          },
          {
            en: 'Log in to your account. Then click "List Your Business" in the navigation bar (the gold button, top-right) or go directly to www.malayalibusiness.com/en/dashboard.',
            ml: 'Account-ൽ log in ചെയ്യൂ. തുടർന്ന് navigation bar-ൽ "List Your Business" (gold button, top-right) ക്ലിക്ക് ചെയ്യൂ അല്ലെങ്കിൽ www.malayalibusiness.com/en/dashboard-ലേക്ക് നേരിട്ട് പോകൂ.'
          },
          {
            en: 'The Vendor Dashboard has a dark green sidebar on the left with navigation links: Overview, My Listings, Shop Manager, Orders, Enquiries, Analytics, Jobs Posted, Billing, and Settings.',
            ml: 'Vendor Dashboard-ന്റെ ഇടത്ത് ഡാർക്ക് ഗ്രീൻ sidebar ഉണ്ട്: Overview, My Listings, Shop Manager, Orders, Enquiries, Analytics, Jobs Posted, Billing, Settings.'
          },
          {
            en: 'On mobile, the sidebar is hidden. Tap the hamburger menu icon (top-left of the main content area) to open the sidebar navigation.',
            ml: 'Mobile-ൽ sidebar hidden ആണ്. Main content area-ന്റെ top-left-ൽ hamburger menu icon tap ചെയ്ത് sidebar navigation തുറക്കൂ.'
          }
        ]
      },
      {
        id: 'overview-section',
        titleEn: 'Dashboard Overview',
        titleMl: 'ഡാഷ്‌ബോർഡ് ഓവർവ്യൂ',
        icon: BarChart2,
        steps: [
          {
            en: 'The Overview section is the default landing screen of the dashboard. It shows 4 stat cards at the top: My Listings (total number of your listings), Total Views (how many times your listings were viewed), Total Reviews (total reviews received), and Avg Rating.',
            ml: 'Overview section dashboard-ന്റെ default landing screen ആണ്. മുകളിൽ 4 stat cards: My Listings (ലിസ്റ്റിംഗ് എണ്ണം), Total Views (ലിസ്റ്റിംഗ് കണ്ടത് എത്ര), Total Reviews (ലഭിച്ച reviews), Avg Rating.'
          },
          {
            en: 'Below the stat cards are 4 quick action buttons: Add Listing, Post Job, View Analytics, and Upgrade Plan. Click any of these to go directly to that function.',
            ml: 'Stat cards-ന് താഴെ 4 quick action buttons: Add Listing, Post Job, View Analytics, Upgrade Plan. ഏതെങ്കിലും ക്ലിക്ക് ചെയ്ത് ആ ഫംഗ്ഷനിലേക്ക് നേരിട്ട് പോകൂ.'
          },
          {
            en: 'The bar chart shows "Profile Views – Last 7 Days" — a visual graph of daily views for the past week.',
            ml: 'Bar chart "Profile Views – Last 7 Days" കാണിക്കുന്നു — കഴിഞ്ഞ ആഴ്ചത്തെ daily views-ന്റെ visual graph.'
          },
          {
            en: 'The "Recent Activity" panel on the right shows the latest events: new reviews, new enquiries, new orders, and listing updates.',
            ml: '"Recent Activity" panel-ൽ ഏറ്റവും പുതിയ events: new reviews, new enquiries, new orders, listing updates.'
          }
        ]
      },
      {
        id: 'manage-listings',
        titleEn: 'Managing My Listings',
        titleMl: 'ലിസ്റ്റിംഗ് മാനേജ് ചെയ്യൽ',
        icon: Building2,
        steps: [
          {
            en: 'Click "My Listings" in the left sidebar. This section shows all your business listings with their status (Active or Pending), plan type (basic/premium/elite), view count, rating, and a "View" button.',
            ml: 'Left sidebar-ൽ "My Listings" ക്ലിക്ക് ചെയ്യൂ. ഈ section-ൽ നിങ്ങളുടെ എല്ലാ business listings-ഉം status (Active/Pending), plan type, view count, rating, "View" button സഹിതം കാണിക്കുന്നു.'
          },
          {
            en: 'To filter listings: Use the "All / Active / Pending" tab buttons at the top of the listings list to filter by status.',
            ml: 'Listings filter ചെയ്യാൻ: Listings list-ന്റെ മുകളിൽ "All / Active / Pending" tab buttons ഉപയോഗിക്കൂ.'
          },
          {
            en: 'To view your listing on the live site: Click the "View" button on any listing card. This opens your business public profile page in a new context.',
            ml: 'Live site-ൽ listing കാണാൻ: ഏതെങ്കിലും listing card-ൽ "View" button ക്ലിക്ക് ചെയ്യൂ. ഇത് business public profile page തുറക്കുന്നു.'
          },
          {
            en: 'To add a new listing: Click the green "Add New Listing" button (top-right of the My Listings section). Fill in all the required details: Business Name (English and Malayalam), Category, Emirate, Area, Phone, WhatsApp, Email, Website, and Description. Click "Save" when done.',
            ml: 'New listing add ചെയ്യാൻ: "Add New Listing" ബട്ടൺ ക്ലിക്ക് ചെയ്യൂ. ആവശ്യമായ വിവരങ്ങൾ: Business Name (EN, ML), Category, Emirate, Area, Phone, WhatsApp, Email, Website, Description. Save ക്ലിക്ക് ചെയ്യൂ.'
          },
          {
            en: 'New listings are submitted for admin approval and will appear with "Pending" status until the admin approves them. Once approved, the status changes to "Active" and the listing appears in the directory.',
            ml: 'പുതിയ listings admin approval-നായി submit ആകും — admin approve ചെയ്യും വരെ "Pending" status കാണിക്കും. Approve ആയ ശേഷം status "Active" ആകും, directory-ൽ ദൃശ്യമാകും.'
          }
        ]
      },
      {
        id: 'shop-manager',
        titleEn: 'Shop Manager — Adding Products & Services',
        titleMl: 'Shop Manager — Products & Services ചേർക്കൽ',
        icon: ShoppingBag,
        steps: [
          {
            en: 'Click "Shop Manager" in the left sidebar. This section shows all products and services linked to your business listing.',
            ml: 'Left sidebar-ൽ "Shop Manager" ക്ലിക്ക് ചെയ്യൂ. ഈ section-ൽ നിങ്ങളുടെ business listing-ലേക്ക് linked ആയ products-ഉം services-ഉം കാണിക്കുന്നു.'
          },
          {
            en: 'To add a new product/service: Click the green "Add Product" button (top-right of the Shop Manager section). A popup modal will appear with a form.',
            ml: 'New product/service add ചെയ്യാൻ: "Add Product" ബട്ടൺ ക്ലിക്ക് ചെയ്യൂ. Popup modal form ദൃശ്യമാകും.'
          },
          {
            en: 'In the Add Product form, fill in: Product Name (English), Product Name (Malayalam), Price in AED, and select the Type (Product / Service / Appointment / Quote / Contact Only). Upload a product image if available. Click "Add Product" to save.',
            ml: 'Add Product form-ൽ: Product Name (EN), Product Name (ML), Price (AED), Type (Product/Service/Appointment/Quote/Contact Only) select ചെയ്യൂ. Product image upload ചെയ്യൂ. "Add Product" ക്ലിക്ക് ചെയ്ത് save ചെയ്യൂ.'
          },
          {
            en: 'To edit or delete an existing product: Click the "Edit" button (blue, on the product card) to modify details, or the "Delete" button (red) to remove the product.',
            ml: 'Existing product edit/delete ചെയ്യാൻ: Product card-ൽ "Edit" button (blue) ക്ലിക്ക് ചെയ്ത് details modify ചെയ്യൂ, അല്ലെങ്കിൽ "Delete" button (red) ക്ലിക്ക് ചെയ്ത് remove ചെയ്യൂ.'
          }
        ]
      },
      {
        id: 'orders',
        titleEn: 'Managing Orders',
        titleMl: 'Orders മാനേജ് ചെയ്യൽ',
        icon: ShoppingBag,
        steps: [
          {
            en: 'Click "Orders" in the left sidebar. This section shows all orders received through your shop listings.',
            ml: 'Left sidebar-ൽ "Orders" ക്ലിക്ക് ചെയ്യൂ. ഈ section-ൽ shop listings-ൽ നിന്ന് ലഭിച്ച orders കാണിക്കുന്നു.'
          },
          {
            en: 'Each order card shows: Order ID, customer name, item ordered, quantity, total amount (in AED), and order status (Pending / Processing / Delivered / Cancelled).',
            ml: 'ഓരോ order card-ഉം കാണിക്കുന്നത്: Order ID, customer name, item, quantity, total amount (AED), order status (Pending/Processing/Delivered/Cancelled).'
          },
          {
            en: 'To update order status: Click the status dropdown on the order card and select the new status. This helps customers track their order progress.',
            ml: 'Order status update ചെയ്യാൻ: Order card-ൽ status dropdown ക്ലിക്ക് ചെയ്ത് new status select ചെയ്യൂ.'
          }
        ]
      },
      {
        id: 'enquiries',
        titleEn: 'Managing Enquiries',
        titleMl: 'Enquiries മാനേജ് ചെയ്യൽ',
        icon: MessageSquare,
        steps: [
          {
            en: 'Click "Enquiries" in the left sidebar. This shows all customer enquiries sent to your business.',
            ml: 'Left sidebar-ൽ "Enquiries" ക്ലിക്ക് ചെയ്യൂ. Business-ലേക്ക് അയച്ച customer enquiries കാണിക്കുന്നു.'
          },
          {
            en: 'Each enquiry card shows the customer name, their message, contact details, and the date the enquiry was sent.',
            ml: 'ഓരോ enquiry card-ഉം കാണിക്കുന്നത്: Customer name, message, contact details, date.'
          },
          {
            en: 'To reply to an enquiry: Use the customer\'s phone/email from the enquiry card to contact them directly via WhatsApp, phone, or email.',
            ml: 'Enquiry reply ചെയ്യാൻ: Enquiry card-ൽ നിന്ന് customer-ന്റെ phone/email ഉപയോഗിച്ച് WhatsApp, phone, email വഴി contact ചെയ്യൂ.'
          }
        ]
      },
      {
        id: 'jobs',
        titleEn: 'Posting & Managing Jobs',
        titleMl: 'Jobs Post ചെയ്യലും മാനേജ് ചെയ്യലും',
        icon: Briefcase,
        steps: [
          {
            en: 'Click "Jobs Posted" in the left sidebar. This shows all job listings you have posted.',
            ml: 'Left sidebar-ൽ "Jobs Posted" ക്ലിക്ക് ചെയ്യൂ. Post ചെയ്ത job listings കാണിക്കുന്നു.'
          },
          {
            en: 'To post a new job: Click the green "Post New Job" button. Fill in the job title, description, location, salary range, and job type. Submit to publish.',
            ml: 'New job post ചെയ്യാൻ: "Post New Job" button ക്ലിക്ക് ചെയ്യൂ. Job title, description, location, salary, job type നൽകൂ. Submit ചെയ്ത് publish ചെയ്യൂ.'
          },
          {
            en: 'To view applications for a job: Click the "View Applications" button on any job card. A dropdown expands showing the list of applicants with their names and application dates.',
            ml: 'Job applications കാണാൻ: Job card-ൽ "View Applications" button ക്ലിക്ക് ചെയ്യൂ. Applicants list expand ആകും.'
          },
          {
            en: 'Job status can be "Active" (accepting applications) or "Closed" (no longer accepting). The status and application count are shown on each job card.',
            ml: 'Job status "Active" (applications സ്വീകരിക്കുന്നു) അല്ലെങ്കിൽ "Closed" (applications സ്വീകരിക്കുന്നില്ല) ആകാം. ഓരോ job card-ഉം status-ഉം application count-ഉം കാണിക്കുന്നു.'
          }
        ]
      },
      {
        id: 'analytics',
        titleEn: 'Viewing Analytics',
        titleMl: 'Analytics കാണൽ',
        icon: BarChart2,
        steps: [
          {
            en: 'Click "Analytics" in the left sidebar. This section shows detailed performance data for your business listings.',
            ml: 'Left sidebar-ൽ "Analytics" ക്ലിക്ക് ചെയ്യൂ. ബിസിനസ് listings-ന്റെ detailed performance data കാണിക്കുന്നു.'
          },
          {
            en: 'Use the date range selector at the top to switch between "Last 7 Days", "30 Days", or "3 Months" of data.',
            ml: 'Top-ൽ date range selector ഉപയോഗിച്ച് "Last 7 Days", "30 Days", "3 Months" data-ലേക്ക് switch ചെയ്യൂ.'
          },
          {
            en: 'The analytics page shows: Profile Views by Week (bar chart), Enquiries by Week (bar chart), Top Search Keywords (what people searched to find you), Key Metrics (click-through rate, WhatsApp clicks, phone clicks), and Visitor Demographics (nationality, device type, time of day).',
            ml: 'Analytics page കാണിക്കുന്നത്: Profile Views by Week (bar chart), Enquiries by Week (bar chart), Top Search Keywords, Key Metrics (CTR, WhatsApp clicks, phone clicks), Visitor Demographics.'
          }
        ]
      },
      {
        id: 'billing',
        titleEn: 'Billing & Plan Management',
        titleMl: 'ബില്ലിംഗ് & പ്ലാൻ മാനേജ്മെൻറ്',
        icon: CreditCard,
        steps: [
          {
            en: 'Click "Billing" in the left sidebar. This section shows your current subscription plan, its features, and your invoice history.',
            ml: 'Left sidebar-ൽ "Billing" ക്ലിക്ക് ചെയ്യൂ. Current subscription plan, features, invoice history കാണിക്കുന്നു.'
          },
          {
            en: 'The current plan card shows the plan name (Standard / Premium / Elite), monthly price in AED, and a list of included features (e.g. number of listings, photos, analytics).',
            ml: 'Current plan card കാണിക്കുന്നത്: Plan name (Standard/Premium/Elite), monthly price (AED), included features (listings count, photos, analytics).'
          },
          {
            en: 'To upgrade your plan: Click the gold "Upgrade to Premium" button on the billing page or the "Go Premium" card in the sidebar bottom area. Contact admin to process the upgrade.',
            ml: 'Plan upgrade ചെയ്യാൻ: Billing page-ൽ gold "Upgrade to Premium" button ക്ലിക്ക് ചെയ്യൂ. Upgrade process ചെയ്യാൻ admin-ഉമായി contact ചെയ്യൂ.'
          },
          {
            en: 'The invoices table shows past invoice IDs, dates, amounts, and payment status (Paid / Overdue). Click the download icon to download any invoice.',
            ml: 'Invoices table-ൽ invoice IDs, dates, amounts, payment status (Paid/Overdue) കാണിക്കുന്നു. ഏതെങ്കിലും invoice download ചെയ്യാൻ download icon ക്ലിക്ക് ചെയ്യൂ.'
          }
        ]
      },
      {
        id: 'vendor-settings',
        titleEn: 'Vendor Settings',
        titleMl: 'Vendor Settings',
        icon: Settings,
        steps: [
          {
            en: 'Click "Settings" in the left sidebar. The settings page has two sub-tabs: Personal Info and Business Info.',
            ml: 'Left sidebar-ൽ "Settings" ക്ലിക്ക് ചെയ്യൂ. Settings page-ൽ രണ്ട് sub-tabs: Personal Info, Business Info.'
          },
          {
            en: 'Personal Info tab: Update your Full Name and Phone Number. Your email address is fixed and cannot be changed. Click "Change Photo" to upload a new profile picture. Click "Save Changes" to save.',
            ml: 'Personal Info tab: Full Name, Phone Number update ചെയ്യൂ. Email address fixed ആണ്, മാറ്റാൻ കഴിയില്ല. "Change Photo" ക്ലിക്ക് ചെയ്ത് profile picture upload ചെയ്യൂ. "Save Changes" ക്ലിക്ക് ചെയ്ത് save ചെയ്യൂ.'
          },
          {
            en: 'Business Info tab: Update your business name (English and Malayalam), website URL, business category, description (English and Malayalam), and tags/keywords for search. Click "Save Business Info" to save.',
            ml: 'Business Info tab: Business name (EN, ML), website URL, category, description (EN, ML), tags/keywords update ചെയ്യൂ. "Save Business Info" ക്ലിക്ക് ചെയ്ത് save ചെയ്യൂ.'
          },
          {
            en: 'Danger Zone (at the bottom of Settings): Contains the "Delete Account" button. Clicking this will ask for confirmation before permanently deleting your account and all associated data. This action cannot be undone.',
            ml: 'Danger Zone (Settings-ന്റെ ചുവടെ): "Delete Account" button ഉണ്ട്. ഇത് ക്ലിക്ക് ചെയ്താൽ confirm ചോദിക്കും. Account-ഉം data-ഉം permanently delete ആകും. ഇത് undo ചെയ്യാൻ കഴിയില്ല.'
          }
        ]
      }
    ]
  },

  // ── 4. ADMIN ────────────────────────────────────────────────────────────
  {
    id: 'admin',
    labelEn: 'Super Admin',
    labelMl: 'സൂപ്പർ അഡ്മിൻ',
    icon: Shield,
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-100',
    descEn: 'The Super Admin has full control over the entire platform — approving listings, managing users, viewing platform-wide stats, handling reports, and managing ad slots.',
    descMl: 'Super Admin-ന് പ്ലാറ്റ്‌ഫോം മൊത്തത്തിൽ control ഉണ്ട് — listings approve ചെയ്യൽ, users manage ചെയ്യൽ, platform-wide stats കാണൽ, reports handle ചെയ്യൽ, ad slots manage ചെയ്യൽ.',
    sections: [
      {
        id: 'admin-access',
        titleEn: 'Getting Admin Access',
        titleMl: 'Admin Access നേടൽ',
        icon: Shield,
        steps: [
          {
            en: 'Admin access is not given automatically. First, create a normal account at /en/auth. Then ask the platform super-admin (technical team) to run the following SQL in Supabase to grant admin rights: UPDATE profiles SET is_admin = true WHERE email = \'your-email@example.com\';',
            ml: 'Admin access ഓട്ടോമാറ്റിക്കലി ലഭിക്കില്ല. ആദ്യം /en/auth-ൽ account create ചെയ്യൂ. തുടർന്ന് platform super-admin (technical team) Supabase-ൽ ഈ SQL run ചെയ്ത് admin rights grant ചെയ്യും: UPDATE profiles SET is_admin = true WHERE email = \'your-email@example.com\';'
          },
          {
            en: 'After your account is granted admin access, log in as normal and navigate directly to www.malayalibusiness.com/en/admin.',
            ml: 'Account-ന് admin access ലഭിച്ചതിന് ശേഷം normal-ആയി log in ചെയ്ത് www.malayalibusiness.com/en/admin-ലേക്ക് navigate ചെയ്യൂ.'
          },
          {
            en: 'Non-admin users who try to access /en/admin will be automatically redirected to the login page. Only accounts with is_admin = true in the database can access the admin panel.',
            ml: 'Admin access ഇല്ലാത്ത users /en/admin access ചെയ്യാൻ ശ്രമിച്ചാൽ login page-ലേക്ക് automatically redirect ആകും. Database-ൽ is_admin = true ഉള്ള accounts മാത്രം admin panel access ചെയ്യാം.'
          }
        ]
      },
      {
        id: 'admin-dashboard',
        titleEn: 'Admin Dashboard Overview',
        titleMl: 'Admin Dashboard ഓവർവ്യൂ',
        icon: BarChart2,
        steps: [
          {
            en: 'The Admin Panel has a dark green sidebar on the left with 6 sections: Dashboard, Listings, Users, Ads, Reports, and Settings.',
            ml: 'Admin Panel-ന്റെ left sidebar-ൽ 6 sections: Dashboard, Listings, Users, Ads, Reports, Settings.'
          },
          {
            en: 'The Dashboard section shows 4 key stat cards: Total Listings, Total Users, Premium Listings, and Pending Approvals. These pull live data from the database.',
            ml: 'Dashboard section-ൽ 4 key stat cards: Total Listings, Total Users, Premium Listings, Pending Approvals. ഇവ database-ൽ നിന്ന് live data pull ചെയ്യുന്നു.'
          },
          {
            en: 'The Revenue chart shows monthly revenue for the last 12 months as a bar chart. Hover over each bar to see the exact AED amount for that month.',
            ml: 'Revenue chart കഴിഞ്ഞ 12 മാസത്തെ monthly revenue bar chart ആയി കാണിക്കുന്നു. ഓരോ bar-ഉം hover ചെയ്ത് ആ മാസത്തെ AED amount കാണൂ.'
          },
          {
            en: 'The Top Categories chart shows which business categories have the most activity (views, enquiries, listings).',
            ml: 'Top Categories chart ഏത് business categories-ന് ഏറ്റവും കൂടുതൽ activity (views, enquiries, listings) ഉണ്ടെന്ന് കാണിക്കുന്നു.'
          },
          {
            en: 'The Recent Signups list shows the 5 most recently registered users with their names, email addresses, and registration dates.',
            ml: 'Recent Signups list ഏറ്റവും പുതുതായി register ചെയ്ത 5 users-ഉടെ names, emails, registration dates കാണിക്കുന്നു.'
          }
        ]
      },
      {
        id: 'admin-listings',
        titleEn: 'Managing Listings (Approve / Reject / Suspend)',
        titleMl: 'Listings മാനേജ് ചെയ്യൽ (Approve / Reject / Suspend)',
        icon: Building2,
        steps: [
          {
            en: 'Click "Listings" in the admin sidebar. This section has two parts: Approval Queue (pending listings) and All Listings (all listings across the platform).',
            ml: 'Admin sidebar-ൽ "Listings" ക്ലിക്ക് ചെയ്യൂ. ഈ section-ൽ രണ്ട് ഭാഗം: Approval Queue (pending listings), All Listings (platform-wide all listings).'
          },
          {
            en: 'Approval Queue: Shows all listings waiting for approval. Each listing card shows the business name, ID, category, emirate, plan type, and the owner\'s name. The number of pending listings is shown as a badge next to "Listings" in the sidebar.',
            ml: 'Approval Queue: Approval കാത്തിരിക്കുന്ന listings. Business name, ID, category, emirate, plan type, owner name കാണിക്കുന്നു. Pending listings count sidebar-ൽ badge ആയി കാണിക്കുന്നു.'
          },
          {
            en: 'To approve a listing: Click the green "Approve" button on the listing card. The listing status will change from "pending" to "active" immediately, and it will appear in the public directory.',
            ml: 'Listing approve ചെയ്യാൻ: Listing card-ൽ green "Approve" button ക്ലിക്ക് ചെയ്യൂ. Status "pending" → "active" ആകും, public directory-ൽ ദൃശ്യമാകും.'
          },
          {
            en: 'To reject/suspend a listing: Click the red "Reject" button. The listing status will change to "suspended" and it will be hidden from the public directory.',
            ml: 'Listing reject/suspend ചെയ്യാൻ: Red "Reject" button ക്ലിക്ക് ചെയ്യൂ. Status "suspended" ആകും, public directory-ൽ ദൃശ്യമാകില്ല.'
          },
          {
            en: 'All Listings section: Shows all listings (active, pending, suspended) in a table. Use the filter tabs (All / Active / Pending / Suspended) to view specific groups. Each row shows name, category, emirate, plan, status, rating, views, and the owner.',
            ml: 'All Listings section: എല്ലാ listings-ഉം (active, pending, suspended) table-ൽ കാണിക്കുന്നു. Filter tabs (All/Active/Pending/Suspended) ഉപയോഗിക്കൂ. ഓരോ row-ഉം name, category, emirate, plan, status, rating, views, owner കാണിക്കുന്നു.'
          },
          {
            en: 'To change a listing\'s status from the All Listings table: Find the listing, click the status badge (e.g. "active"), and select a new status from the dropdown.',
            ml: 'All Listings table-ൽ status change ചെയ്യാൻ: Listing കണ്ടെത്തൂ, status badge ക്ലിക്ക് ചെയ്ത് dropdown-ൽ നിന്ന് new status select ചെയ്യൂ.'
          }
        ]
      },
      {
        id: 'admin-users',
        titleEn: 'Managing Users',
        titleMl: 'Users മാനേജ് ചെയ്യൽ',
        icon: Users,
        steps: [
          {
            en: 'Click "Users" in the admin sidebar. This shows a searchable table of all registered users on the platform.',
            ml: 'Admin sidebar-ൽ "Users" ക്ലിക്ക് ചെയ്യൂ. Platform-ൽ registered ആയ എല്ലാ users-ഉടെ searchable table കാണിക്കുന്നു.'
          },
          {
            en: 'The users table shows: Avatar, Full Name, Email, Role (Admin / Business Owner / User), Language Preference, Registration Date, and Verification Status.',
            ml: 'Users table കാണിക്കുന്നത്: Avatar, Full Name, Email, Role (Admin/Business Owner/User), Language Preference, Registration Date, Verification Status.'
          },
          {
            en: 'To search for a user: Type the user\'s name or email in the search box above the table. The table filters in real-time as you type.',
            ml: 'User തിരയാൻ: Table-ന് മുകളിൽ search box-ൽ user-ന്റെ name അല്ലെങ്കിൽ email type ചെയ്യൂ. Table real-time-ൽ filter ആകും.'
          },
          {
            en: 'To suspend a user: Click the red "Suspend" button on the user row. The user\'s account will be suspended and shown as "Suspended" in the status column. To reactivate: Click the green "Activate" button.',
            ml: 'User suspend ചെയ്യാൻ: User row-ൽ red "Suspend" button ക്ലിക്ക് ചെയ്യൂ. Account suspend ആകും, status column-ൽ "Suspended" കാണിക്കും. Reactivate ചെയ്യാൻ green "Activate" button ക്ലിക്ക് ചെയ്യൂ.'
          },
          {
            en: 'To grant admin access to a user: This must be done through the Supabase SQL Editor. Run: UPDATE profiles SET is_admin = true WHERE email = \'user@example.com\';',
            ml: 'User-ന് admin access grant ചെയ്യാൻ: Supabase SQL Editor-ൽ run ചെയ്യൂ: UPDATE profiles SET is_admin = true WHERE email = \'user@example.com\';'
          },
          {
            en: 'To verify a business owner (give them the blue verified tick): In Supabase SQL Editor run: UPDATE profiles SET is_verified = true WHERE email = \'user@example.com\'; Then also run: UPDATE listings SET is_verified = true WHERE owner_id = (SELECT id FROM profiles WHERE email = \'user@example.com\');',
            ml: 'Business owner verify ചെയ്യാൻ (blue verified tick): Supabase SQL Editor-ൽ: UPDATE profiles SET is_verified = true WHERE email = \'user@example.com\'; കൂടാതെ: UPDATE listings SET is_verified = true WHERE owner_id = (SELECT id FROM profiles WHERE email = \'user@example.com\');'
          }
        ]
      },
      {
        id: 'admin-ads',
        titleEn: 'Managing Ad Slots',
        titleMl: 'Ad Slots മാനേജ് ചെയ്യൽ',
        icon: Star,
        steps: [
          {
            en: 'Click "Ads" in the admin sidebar. This section shows all available advertising slots on the platform.',
            ml: 'Admin sidebar-ൽ "Ads" ക്ലിക്ക് ചെയ്യൂ. Platform-ൽ available ആയ advertising slots കാണിക്കുന്നു.'
          },
          {
            en: 'Each ad slot card shows: Slot name (e.g. "Homepage Banner"), current advertiser, monthly price in AED, status (Active / Available), and total impressions.',
            ml: 'ഓരോ ad slot card-ഉം കാണിക്കുന്നത്: Slot name (ഉദാ. "Homepage Banner"), current advertiser, monthly price (AED), status (Active/Available), total impressions.'
          },
          {
            en: 'To manage an ad slot: Click the "Manage Slot" button on any slot card to edit the advertiser details, pricing, or status.',
            ml: 'Ad slot manage ചെയ്യാൻ: ഏതെങ്കിലും slot card-ൽ "Manage Slot" button ക്ലിക്ക് ചെയ്ത് advertiser details, pricing, status edit ചെയ്യൂ.'
          }
        ]
      },
      {
        id: 'admin-reports',
        titleEn: 'Handling Reports & Flagged Content',
        titleMl: 'Reports & Flagged Content Handle ചെയ്യൽ',
        icon: AlertTriangle,
        steps: [
          {
            en: 'Click "Reports" in the admin sidebar. A red badge with the count of unresolved reports is shown next to "Reports" in the sidebar.',
            ml: 'Admin sidebar-ൽ "Reports" ക്ലിക്ക് ചെയ്യൂ. Unresolved reports count red badge-ആയി sidebar-ൽ "Reports"-ന് അടുത്ത് കാണിക്കുന്നു.'
          },
          {
            en: 'Each report card shows: Content type (Listing / Review / Comment), the specific content reported, who reported it, the date, and the reason for reporting.',
            ml: 'ഓരോ report card-ഉം കാണിക്കുന്നത്: Content type (Listing/Review/Comment), reported content, who reported it, date, reason.'
          },
          {
            en: 'To resolve a report: Click the green "Mark Resolved" button. The report will be moved out of the active queue.',
            ml: 'Report resolve ചെയ്യാൻ: Green "Mark Resolved" button ക്ലിക്ക് ചെയ്യൂ. Report active queue-ൽ നിന്ന് remove ആകും.'
          },
          {
            en: 'To dismiss a report (if it is not a valid complaint): Click the "Dismiss" button. The report will be closed without any action taken.',
            ml: 'Report dismiss ചെയ്യാൻ (valid complaint അല്ലെങ്കിൽ): "Dismiss" button ക്ലിക്ക് ചെയ്യൂ. Report action ഇല്ലാതെ close ആകും.'
          },
          {
            en: 'If a report is about a listing that violates guidelines: Go to the Listings section, find the listing, and click "Reject/Suspend" to remove it from the directory.',
            ml: 'Report ഒരു listing-നെക്കുറിച്ചാണ്, guidelines violate ചെയ്യുന്നുണ്ടെങ്കിൽ: Listings section-ൽ listing കണ്ടെത്തൂ, "Reject/Suspend" ക്ലിക്ക് ചെയ്ത് directory-ൽ നിന്ന് remove ചെയ്യൂ.'
          }
        ]
      },
      {
        id: 'admin-categories',
        titleEn: 'Managing Categories (via Supabase)',
        titleMl: 'Categories മാനേജ് ചെയ്യൽ (Supabase വഴി)',
        icon: Settings,
        steps: [
          {
            en: 'Business categories are managed directly in the Supabase database. Go to supabase.com → your project → Table Editor → categories table.',
            ml: 'Business categories Supabase database-ൽ directly manage ചെയ്യുന്നു. supabase.com → your project → Table Editor → categories table-ലേക്ക് പോകൂ.'
          },
          {
            en: 'To add a new category: Insert a new row with: slug (URL-friendly name, e.g. "food-delivery"), name (English display name), name_ml (Malayalam name), icon (emoji or icon name), and is_active = true.',
            ml: 'New category add ചെയ്യാൻ: New row insert ചെയ്യൂ: slug (URL-friendly name), name (EN), name_ml (ML), icon, is_active = true.'
          },
          {
            en: 'To deactivate a category: Set is_active = false for that row. The category will no longer appear in the directory filters.',
            ml: 'Category deactivate ചെയ്യാൻ: ആ row-ൽ is_active = false set ചെയ്യൂ. Directory filters-ൽ ആ category ദൃശ്യമാകില്ല.'
          },
          {
            en: 'To re-categorise listings in bulk: Use the Supabase SQL Editor to run UPDATE statements. Example: UPDATE listings SET category_id = (SELECT id FROM categories WHERE slug = \'new-category\') WHERE category_id = (SELECT id FROM categories WHERE slug = \'old-category\');',
            ml: 'Listings bulk re-categorise ചെയ്യാൻ: Supabase SQL Editor-ൽ UPDATE statements run ചെയ്യൂ.'
          }
        ]
      }
    ]
  }
]

// ── Accordion Item ──────────────────────────────────────────────────────────
function AccordionItem({ section, isMl }: { section: Section; isMl: boolean }) {
  const [open, setOpen] = useState(false)
  const Icon = section.icon
  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-3 p-5 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-kerala-green/10 flex items-center justify-center flex-shrink-0">
            <Icon size={17} className="text-kerala-green" />
          </div>
          <div>
            <p className="font-serif font-bold text-kerala-deep text-sm leading-tight">
              {isMl ? section.titleMl : section.titleEn}
            </p>
            {isMl && (
              <p className="text-xs text-gray-400 mt-0.5">{section.titleEn}</p>
            )}
          </div>
        </div>
        {open
          ? <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />
          : <ChevronRight size={18} className="text-gray-400 flex-shrink-0" />
        }
      </button>
      {open && (
        <div className="border-t border-gray-100 p-5 space-y-4">
          {section.steps.map((step, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-kerala-green text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                {i + 1}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {isMl ? step.ml : step.en}
                </p>
                {isMl && (
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed italic">
                    {step.en}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function HelpPage() {
  const locale = useLocale()
  const isMl = locale === 'ml'
  const [activeRole, setActiveRole] = useState<Role>('getting-started')

  const activeGuide = guides.find(g => g.id === activeRole)!

  return (
    <main className="min-h-screen bg-kerala-cream">
      <Navbar />

      {/* Hero */}
      <div className="bg-kerala-deep pt-20 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            <BookOpen size={13} />
            {isMl ? 'ഉപഭോക്തൃ മാർഗ്ഗനിർദ്ദേശം' : 'User Manual'}
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-3">
            {isMl ? 'MalayaliBusiness സഹായ കേന്ദ്രം' : 'MalayaliBusiness Help Centre'}
          </h1>
          <p className="text-white/60 text-base max-w-2xl mx-auto">
            {isMl
              ? 'Admin, Vendor, ഉപഭോക്താവ് — എല്ലാ stakeholders-നുള്ളും step-by-step ഗൈഡ്'
              : 'Step-by-step guides for every role — Admin, Vendor, Business Owner, and Regular User'
            }
          </p>
        </div>
      </div>

      {/* Role Tabs */}
      <div className="sticky top-16 z-20 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto gap-1 py-2 scrollbar-hide">
            {guides.map(g => {
              const Icon = g.icon
              const isActive = activeRole === g.id
              return (
                <button
                  key={g.id}
                  onClick={() => setActiveRole(g.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                    isActive
                      ? `${g.bg} ${g.color} border ${g.border}`
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                  }`}
                >
                  <Icon size={15} />
                  {isMl ? g.labelMl : g.labelEn}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Role header */}
        <div className={`rounded-2xl border ${activeGuide.border} ${activeGuide.bg} p-6 mb-8 flex gap-4`}>
          <div className={`w-12 h-12 rounded-2xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm`}>
            <activeGuide.icon size={24} className={activeGuide.color} />
          </div>
          <div>
            <h2 className="font-serif font-bold text-2xl text-kerala-deep mb-1">
              {isMl ? activeGuide.labelMl : activeGuide.labelEn}
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              {isMl ? activeGuide.descMl : activeGuide.descEn}
            </p>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-3">
          {activeGuide.sections.map(section => (
            <AccordionItem key={section.id} section={section} isMl={isMl} />
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-10 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
          <CheckCircle size={28} className="text-kerala-green mx-auto mb-3" />
          <h3 className="font-serif font-bold text-kerala-deep mb-1">
            {isMl ? 'കൂടുതൽ സഹായം ആവശ്യമുണ്ടോ?' : 'Need more help?'}
          </h3>
          <p className="text-gray-500 text-sm mb-4">
            {isMl
              ? 'ഈ ഗൈഡിൽ ഇല്ലാത്ത എന്തെങ്കിലും ഉണ്ടെങ്കിൽ, admin team-ഉമായി contact ചെയ്യൂ.'
              : 'If something isn\'t covered in this guide, contact the admin team directly.'
            }
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="mailto:support@malayalibusiness.com"
              className="flex items-center gap-2 bg-kerala-green text-white font-semibold px-4 py-2 rounded-xl text-sm hover:opacity-90 transition-opacity">
              <Mail size={14} />
              {isMl ? 'ഇമെയിൽ ചെയ്യൂ' : 'Email Support'}
            </a>
            <a href="https://wa.me/971000000000"
              className="flex items-center gap-2 bg-green-500 text-white font-semibold px-4 py-2 rounded-xl text-sm hover:opacity-90 transition-opacity">
              <Phone size={14} />
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
