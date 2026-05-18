'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { useParams } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import {
  MapPin, Briefcase, Clock, DollarSign, Users, Star,
  CheckCircle, X, Upload, Bookmark, ArrowLeft,
  Building2, Calendar, Award, ChevronRight, Copy, Tag,
  Shield, Heart, Zap, Coffee, TrendingUp, Globe, BookOpen
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Benefit {
  icon: string
  text: string
  textMl: string
}

interface Job {
  id: string
  title: string
  titleMl: string
  company: string
  companyMl: string
  companyLogo: string
  companyCover: string
  location: string
  emirate: string
  salary: string
  salaryMl: string
  jobType: string
  jobTypeMl: string
  experience: string
  experienceMl: string
  industry: string
  industryMl: string
  description: string
  descriptionMl: string
  requirements: string[]
  requirementsMl: string[]
  benefits: Benefit[]
  postedDate: string
  deadline: string
  applicants: number
  companyRating: number
  companyReviews: number
  companyDescription: string
  companyDescriptionMl: string
  tags: string[]
}

// ─── Benefit icons map ────────────────────────────────────────────────────────

const benefitIconMap: Record<string, React.ReactNode> = {
  health: <Shield size={20} className="text-kerala-green" />,
  visa: <Globe size={20} className="text-kerala-green" />,
  flight: <TrendingUp size={20} className="text-kerala-green" />,
  learning: <BookOpen size={20} className="text-kerala-green" />,
  wellness: <Heart size={20} className="text-kerala-green" />,
  coffee: <Coffee size={20} className="text-kerala-green" />,
  bonus: <Award size={20} className="text-kerala-green" />,
  flexible: <Clock size={20} className="text-kerala-green" />,
  remote: <Zap size={20} className="text-kerala-green" />,
  meal: <Coffee size={20} className="text-kerala-green" />,
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockJobs: Job[] = [
  {
    id: 'senior-software-engineer-dubai',
    title: 'Senior Software Engineer',
    titleMl: 'സീനിയർ സോഫ്റ്റ്‌വെയർ എഞ്ചിനീയർ',
    company: 'Noon.com',
    companyMl: 'നൂൺ.കോം',
    companyLogo: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=120&q=80',
    companyCover: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80',
    location: 'Dubai Internet City, Dubai',
    emirate: 'Dubai',
    salary: 'AED 20,000 – 28,000 / month',
    salaryMl: 'AED 20,000 – 28,000 / മാസം',
    jobType: 'Full-time',
    jobTypeMl: 'പൂർണ്ണ സമയം',
    experience: '5+ years',
    experienceMl: '5+ വർഷം',
    industry: 'E-commerce / Technology',
    industryMl: 'ഇ-കൊമേഴ്‌സ് / ടെക്‌നോളജി',
    description: `We are seeking a talented and experienced Senior Software Engineer to join our growing engineering team at Noon.com, the Middle East's leading e-commerce platform. In this role, you will be at the forefront of building scalable, resilient systems that serve millions of customers across the UAE, Saudi Arabia, and Egypt.

As a Senior Software Engineer, you will design and implement backend services using Go and Python, collaborate with cross-functional teams including product, design, and operations, and mentor junior engineers on best practices in software architecture and clean code. You will own critical platform features from conception through deployment and post-launch monitoring.

Our engineering culture values psychological safety, code quality, and continuous improvement. We run agile sprints, maintain rigorous code review standards, and invest heavily in our engineers' growth. If you are passionate about building systems at scale and want to work with a talented Malayali and diverse team in the heart of Dubai, we would love to hear from you.

This role offers a competitive compensation package, visa sponsorship, annual flight allowance, and access to premium health insurance for you and your family. We believe in work-life balance and offer flexible working hours with two days of remote work per week.`,
    descriptionMl: `Noon.com-ൽ ഞങ്ങളുടെ വളരുന്ന എഞ്ചിനീയറിംഗ് ടീമിൽ ചേരാൻ ഒരു പ്രതിഭാസ്പർശിയും അനുഭവസമ്പന്നനുമായ സീനിയർ സോഫ്റ്റ്‌വെയർ എഞ്ചിനീയറെ ഞങ്ങൾ അന്വേഷിക്കുന്നു. ഈ റോളിൽ, UAE, സൗദി അറേബ്യ, ഈജിപ്ത് എന്നിവിടങ്ങളിൽ ദശലക്ഷക്കണക്കിന് ഉപഭോക്താക്കളെ സേവിക്കുന്ന സ്കേലബിൾ, പ്രതിരോധശേഷിയുള്ള സിസ്റ്റങ്ങൾ നിർമ്മിക്കുന്നതിന്റെ മുൻനിരയിൽ ആയിരിക്കും.

ഒരു സീനിയർ സോഫ്റ്റ്‌വെയർ എഞ്ചിനീയർ എന്ന നിലയിൽ, Go, Python ഉപയോഗിച്ച് ബാക്കൻഡ് സേവനങ്ങൾ ഡിസൈൻ ചെയ്യുകയും നടപ്പിലാക്കുകയും, ക്രോസ്-ഫങ്ഷണൽ ടീമുകളുമായി സഹകരിക്കുകയും, ജൂനിയർ എഞ്ചിനീയർമാർക്ക് മാർഗ്ഗദർശനം നൽകുകയും ചെയ്യും.

ഞങ്ങളുടെ എഞ്ചിനീയറിംഗ് സംസ്കാരം മനഃശാസ്ത്രപരമായ സുരക്ഷ, കോഡ് ഗുണമേന്മ, തുടർച്ചയായ മെച്ചപ്പെടുത്തൽ എന്നിവ വിലമതിക്കുന്നു.`,
    requirements: [
      '5+ years of backend software engineering experience',
      'Proficiency in Go, Python, or similar languages',
      'Experience with distributed systems and microservices architecture',
      'Strong knowledge of SQL and NoSQL databases (PostgreSQL, Redis, MongoDB)',
      'Familiarity with cloud platforms (AWS, GCP, or Azure)',
      'Experience with containerization (Docker, Kubernetes)',
      'Excellent problem-solving and communication skills',
      'Bachelor\'s degree in Computer Science or related field',
    ],
    requirementsMl: [
      'ബാക്കൻഡ് സോഫ്റ്റ്‌വെയർ എഞ്ചിനീയറിംഗ് അനുഭവം 5+ വർഷം',
      'Go, Python അല്ലെങ്കിൽ സമാന ഭാഷകളിൽ പ്രാവീണ്യം',
      'ഡിസ്ട്രിബ്യൂട്ടഡ് സിസ്റ്റങ്ങൾ, മൈക്രോ സർവീസസ് ആർകിടെക്ചർ അനുഭവം',
      'SQL, NoSQL ഡേറ്റാബേസുകളിൽ (PostgreSQL, Redis, MongoDB) ശക്തമായ അറിവ്',
      'ക്ലൗഡ് പ്ലാറ്റ്‌ഫോമുകളിൽ (AWS, GCP, Azure) പരിചയം',
      'കണ്ടെയ്‌നറൈസേഷൻ (Docker, Kubernetes) അനുഭവം',
      'മികച്ച പ്രശ്‌നപരിഹാര, ആശയവിനിമയ കഴിവുകൾ',
      'കമ്പ്യൂട്ടർ സയൻസ് അല്ലെങ്കിൽ അനുബന്ധ മേഖലയിൽ ബിരുദം',
    ],
    benefits: [
      { icon: 'health', text: 'Premium health insurance (family coverage)', textMl: 'പ്രീമിയം ആരോഗ്യ ഇൻഷുറൻസ് (കുടുംബ കവറേജ്)' },
      { icon: 'visa', text: 'Visa & work permit sponsorship', textMl: 'വിസ & വർക്ക് പെർമിറ്റ് സ്പോൺസർഷിപ്പ്' },
      { icon: 'flight', text: 'Annual return flight to home country', textMl: 'ആണ്ടിൽ ഒരിക്കൽ നാട്ടിലേക്ക് വിമാനം' },
      { icon: 'learning', text: 'AED 5,000 annual learning budget', textMl: 'AED 5,000 വാർഷിക പഠന ബജറ്റ്' },
      { icon: 'flexible', text: 'Flexible hours + 2 days WFH', textMl: 'ഫ്ലെക്സിബിൾ സമയം + 2 ദിനം WFH' },
      { icon: 'bonus', text: 'Annual performance bonus', textMl: 'വാർഷിക പ്രകടന ബോണസ്' },
    ],
    postedDate: '2025-05-01',
    deadline: '2025-06-15',
    applicants: 124,
    companyRating: 4.3,
    companyReviews: 287,
    companyDescription: 'Noon.com is the Middle East\'s homegrown e-commerce platform, founded in 2017 with a mission to be the region\'s most customer-centric company. With operations in UAE, Saudi Arabia, and Egypt, Noon serves millions of customers with a vast selection of products across all categories.\n\nOur engineering teams build the backbone of a platform that handles millions of transactions daily, tackling challenges in logistics, payments, personalization, and performance at a scale unique to the region.',
    companyDescriptionMl: 'Noon.com മിഡിൽ ഈസ്റ്റിന്റെ സ്വദേശ ഇ-കൊമേഴ്‌സ് പ്ലാറ്റ്‌ഫോമാണ്, 2017-ൽ സ്ഥാപിതമായത്. ഞങ്ങളുടെ ടെക് ടീമുകൾ ദൈനംദിനം ദശലക്ഷക്കണക്കിന് ഇടപാടുകൾ കൈകാര്യം ചെയ്യുന്ന ഒരു പ്ലാറ്റ്‌ഫോമിന്റെ ബാക്ക്‌ബോൺ നിർമ്മിക്കുന്നു.',
    tags: ['Engineering', 'Backend', 'Go', 'Python', 'E-commerce', 'Dubai'],
  },
  {
    id: 'marketing-manager-abudhabi',
    title: 'Marketing Manager — UAE & GCC',
    titleMl: 'മാർക്കറ്റിംഗ് മാനേജർ — UAE & GCC',
    company: 'Aldar Properties',
    companyMl: 'അൽദർ പ്രോപ്പർട്ടീസ്',
    companyLogo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=120&q=80',
    companyCover: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80',
    location: 'Al Raha, Abu Dhabi',
    emirate: 'Abu Dhabi',
    salary: 'AED 18,000 – 24,000 / month',
    salaryMl: 'AED 18,000 – 24,000 / മാസം',
    jobType: 'Full-time',
    jobTypeMl: 'പൂർണ്ണ സമയം',
    experience: '7+ years',
    experienceMl: '7+ വർഷം',
    industry: 'Real Estate',
    industryMl: 'റിയൽ എസ്റ്റേറ്റ്',
    description: `Aldar Properties is seeking a dynamic and strategic Marketing Manager to lead brand and performance marketing initiatives across the UAE and GCC markets. Reporting to the CMO, you will own the full marketing mix — digital, experiential, and traditional — for some of Abu Dhabi's most prestigious residential and commercial developments.

In this role, you will develop integrated marketing campaigns that drive brand awareness, generate qualified leads, and support the sales team in achieving quarterly targets. You will manage a team of four marketing specialists, oversee external agency relationships, and collaborate closely with the product development team to position new projects effectively in a competitive market.

You will bring deep expertise in digital marketing channels including SEO, paid social, programmatic display, and email nurturing. Experience in the UAE real estate sector is highly preferred, as is fluency in English and Arabic. Malayalam language skills are considered an added advantage for community engagement initiatives.

The ideal candidate is a data-driven storyteller who can balance creative vision with commercial pragmatism. You should be comfortable presenting marketing strategies to C-suite executives and can translate complex data into clear, actionable insights.`,
    descriptionMl: `Aldar Properties UAE, GCC മാർക്കറ്റുകളിൽ ബ്രാൻഡ്, പ്രകടന മാർക്കറ്റിംഗ് സംരംഭങ്ങൾ നയിക്കാൻ ഒരു ഡൈനാമിക്, സ്ട്രാറ്റജിക് മാർക്കറ്റിംഗ് മാനേജറെ ആഗ്രഹിക്കുന്നു. CMO-ക്ക് റിപ്പോർട്ട് ചെയ്യുന്ന നിങ്ങൾ അബുദാബിയിലെ ഏറ്റവും പ്രശസ്തമായ ചില റെസിഡൻഷ്യൽ, കൊമേഴ്‌ഷ്യൽ ഡെവലപ്‌മെന്റുകൾക്ക് ഡിജിറ്റൽ, എക്‌സ്പീരിയൻഷ്യൽ, പരമ്പരാഗത മാർക്കറ്റിംഗ് മേൽനോട്ടം വഹിക്കും.`,
    requirements: [
      '7+ years marketing experience, 3+ in UAE/GCC real estate',
      'Proven track record in digital marketing and lead generation',
      'Strong understanding of UAE real estate market dynamics',
      'Experience managing marketing teams and agency partners',
      'Proficiency with marketing analytics tools (Google Analytics, HubSpot)',
      'Bachelor\'s degree in Marketing, Business or related field',
      'English fluency required; Arabic proficiency strongly preferred',
    ],
    requirementsMl: [
      '7+ വർഷം മാർക്കറ്റിംഗ് അനുഭവം, 3+ UAE/GCC റിയൽ എസ്റ്റേറ്റിൽ',
      'ഡിജിറ്റൽ മാർക്കറ്റിംഗ്, ലീഡ് ജനറേഷൻ സ്ഥിരീകരിക്കപ്പെട്ട ട്രാക്ക് റെക്കോർഡ്',
      'UAE റിയൽ എസ്റ്റേറ്റ് മാർക്കറ്റ് ഡൈനാമിക്‌സ് ശക്തമായ ധാരണ',
      'മാർക്കറ്റിംഗ് ടീമുകൾ, ഏജൻസി പാർട്ണർമാർ മാനേജ് ചെയ്ത അനുഭവം',
      'Google Analytics, HubSpot-ൽ പ്രാവീണ്യം',
      'മാർക്കറ്റിംഗ്, ബിസിനസ് ബിരുദം',
    ],
    benefits: [
      { icon: 'health', text: 'Comprehensive health insurance', textMl: 'സമഗ്ര ആരോഗ്യ ഇൻഷുറൻസ്' },
      { icon: 'visa', text: 'Residency visa sponsorship', textMl: 'റെസിഡൻസി വിസ സ്പോൺസർഷിപ്പ്' },
      { icon: 'bonus', text: 'Quarterly performance bonus', textMl: 'ത്രൈമാസ പ്രകടന ബോണസ്' },
      { icon: 'flight', text: 'Annual air ticket allowance', textMl: 'വാർഷിക വിമാന ടിക്കറ്റ് അലവൻസ്' },
      { icon: 'learning', text: 'Professional development programs', textMl: 'പ്രൊഫഷണൽ ഡെവലപ്‌മെന്റ് പ്രോഗ്രാമുകൾ' },
      { icon: 'meal', text: 'Daily meal allowance', textMl: 'ദൈനംദിന ഭക്ഷണ അലവൻസ്' },
    ],
    postedDate: '2025-04-28',
    deadline: '2025-06-01',
    applicants: 89,
    companyRating: 4.1,
    companyReviews: 412,
    companyDescription: 'Aldar Properties is Abu Dhabi\'s leading real estate developer, known for iconic projects such as Yas Island, Al Raha Beach, and Saadiyat Island. With a legacy spanning two decades, Aldar has transformed the UAE\'s urban landscape through world-class residential, retail, and hospitality developments.',
    companyDescriptionMl: 'Aldar Properties അബുദാബിയുടെ മുൻനിര റിയൽ എസ്റ്റേറ്റ് ഡെവലപ്പറാണ്, ‌Yas Island, Al Raha Beach, Saadiyat Island തുടങ്ങിയ ഐക്കണിക് പ്രോജക്ടുകൾക്ക് പ്രസിദ്ധം.',
    tags: ['Marketing', 'Real Estate', 'UAE', 'Digital Marketing', 'Management'],
  },
  {
    id: 'chartered-accountant-sharjah',
    title: 'Chartered Accountant — VAT & Corporate Tax',
    titleMl: 'ചാർട്ടഡ് അക്കൗണ്ടന്റ് — VAT & കോർപ്പറേറ്റ് ടാക്സ്',
    company: 'Gulf Finance Group',
    companyMl: 'ഗൾഫ് ഫിനാൻസ് ഗ്രൂപ്പ്',
    companyLogo: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=120&q=80',
    companyCover: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80',
    location: 'Sharjah Media City',
    emirate: 'Sharjah',
    salary: 'AED 14,000 – 18,000 / month',
    salaryMl: 'AED 14,000 – 18,000 / മാസം',
    jobType: 'Full-time',
    jobTypeMl: 'പൂർണ്ണ സമയം',
    experience: '4-6 years',
    experienceMl: '4-6 വർഷം',
    industry: 'Finance & Accounting',
    industryMl: 'ഫിനാൻസ് & അക്കൗണ്ടിംഗ്',
    description: `Gulf Finance Group is hiring a meticulous and experienced Chartered Accountant to manage VAT compliance, corporate tax filings, and financial reporting for a growing portfolio of client businesses across the UAE. This is an excellent opportunity for a CA with UAE-specific tax expertise to join a respected firm in Sharjah Media City.\n\nYou will be responsible for preparing and reviewing VAT returns, managing client tax registrations, conducting tax health checks, and staying abreast of UAE Federal Tax Authority (FTA) regulations. Following the introduction of UAE corporate tax in 2023, expertise in CT planning and compliance has become essential, and we expect you to advise clients proactively on optimal tax structures.\n\nThe role also encompasses bookkeeping supervision, monthly management accounts preparation, cash flow forecasting, and liaison with external auditors. Strong command of accounting software (Tally, QuickBooks, Xero) and Excel modelling skills are essential.\n\nThis is a client-facing role with excellent career progression opportunities within our expanding firm.`,
    descriptionMl: `Gulf Finance Group UAE-യിലെ ഒരു ക്ലയന്റ് ബിസിനസ് പോർട്ട്‌ഫോളിയോക്ക് VAT കംപ്ലയൻസ്, കോർപ്പറേറ്റ് ടാക്‌സ് ഫൈലിംഗുകൾ, ഫിനാൻഷ്യൽ റിപ്പോർട്ടിംഗ് കൈകാര്യം ചെയ്യുന്നതിന് ഒരു ചാർട്ടഡ് അക്കൗണ്ടന്റിനെ നിയോഗിക്കുന്നു.`,
    requirements: [
      'CA / ACCA / CPA qualification mandatory',
      '4-6 years UAE accounting and tax experience',
      'Deep knowledge of UAE VAT law and FTA regulations',
      'Corporate tax knowledge (post-2023 UAE CT law)',
      'Proficiency in Tally, QuickBooks, Xero, and advanced Excel',
      'Strong client communication and advisory skills',
    ],
    requirementsMl: [
      'CA / ACCA / CPA യോഗ്യത നിർബന്ധം',
      '4-6 വർഷം UAE അക്കൗണ്ടിംഗ്, ടാക്‌സ് അനുഭവം',
      'UAE VAT നിയമം, FTA നിയന്ത്രണങ്ങൾ ആഴത്തിൽ അറിവ്',
      'കോർപ്പറേറ്റ് ടാക്‌സ് അറിവ് (2023 UAE CT നിയമം)',
      'Tally, QuickBooks, Xero, Excel-ൽ പ്രാവീണ്യം',
    ],
    benefits: [
      { icon: 'health', text: 'Health insurance', textMl: 'ആരോഗ്യ ഇൻഷുറൻസ്' },
      { icon: 'visa', text: 'Visa sponsorship', textMl: 'വിസ സ്പോൺസർഷിപ്പ്' },
      { icon: 'bonus', text: 'Annual bonus', textMl: 'വാർഷിക ബോണസ്' },
      { icon: 'learning', text: 'CPD support & exam fees', textMl: 'CPD, പരീക്ഷ ഫീ സഹായം' },
    ],
    postedDate: '2025-05-05',
    deadline: '2025-06-30',
    applicants: 67,
    companyRating: 4.5,
    companyReviews: 134,
    companyDescription: 'Gulf Finance Group is a leading accounting, audit, and tax advisory firm based in Sharjah Media City, serving SMEs and large enterprises across the UAE for over 15 years.',
    companyDescriptionMl: 'Gulf Finance Group ഷാർജ മീഡിയ സിറ്റി ആസ്ഥാനമായ ഒരു പ്രമുഖ അക്കൗണ്ടിംഗ്, ഓഡിറ്റ്, ടാക്‌സ് അഡ്വൈസറി സ്ഥാപനമാണ്.',
    tags: ['Finance', 'Accounting', 'VAT', 'Tax', 'CA', 'ACCA'],
  },
  {
    id: 'nurse-dubai-hospital',
    title: 'Staff Nurse — ICU & Critical Care',
    titleMl: 'സ്റ്റാഫ് നഴ്‌സ് — ICU & ക്രിറ്റിക്കൽ കെയർ',
    company: 'Medcare Hospitals',
    companyMl: 'മെഡ്‌കെയർ ഹോസ്പിറ്റൽസ്',
    companyLogo: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=120&q=80',
    companyCover: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&q=80',
    location: 'Al Safa, Dubai',
    emirate: 'Dubai',
    salary: 'AED 8,000 – 12,000 / month',
    salaryMl: 'AED 8,000 – 12,000 / മാസം',
    jobType: 'Full-time',
    jobTypeMl: 'പൂർണ്ണ സമയം',
    experience: '3+ years',
    experienceMl: '3+ വർഷം',
    industry: 'Healthcare',
    industryMl: 'ആരോഗ്യ പരിരക്ഷ',
    description: `Medcare Hospitals is one of Dubai's most trusted private hospital groups, and we are expanding our ICU team with compassionate, skilled nursing professionals. As a Staff Nurse in our Critical Care Unit, you will provide expert nursing care to critically ill patients, working closely with our multidisciplinary medical teams.\n\nYou will monitor patients' vital signs, administer medications and treatments as prescribed, respond to medical emergencies, and maintain accurate patient records in our electronic health records system. Reporting to the Head Nurse, you will also mentor student nurses and contribute to the continuous quality improvement programs across the ward.\n\nMedcare is committed to building a supportive, inclusive workplace that values its nursing staff. We provide ongoing training, clear career pathways, and an environment where every nurse is treated with dignity and respect. Our Malayali nursing community within Medcare is strong, and we welcome nurses from Kerala who bring dedication and expertise to patient care.`,
    descriptionMl: `Medcare Hospitals ദുബായിലെ ഏറ്റവും വിശ്വസ്തമായ സ്വകാര്യ ആശുപത്രി ഗ്രൂപ്പുകളിൽ ഒന്നാണ്, ഞങ്ങൾ ഞങ്ങളുടെ ICU ടീം ദയാശീലവും നൈപുണ്യമുള്ളതുമായ നഴ്സിംഗ് പ്രൊഫഷണലുകളോടൊപ്പം വിപുലീകരിക്കുകയാണ്.`,
    requirements: [
      'BSc Nursing or equivalent qualification',
      'DHA license or eligibility for DHA exam',
      '3+ years ICU/Critical Care nursing experience',
      'BLS/ACLS certification mandatory',
      'Strong English communication skills',
      'Experience with ventilator management preferred',
    ],
    requirementsMl: [
      'BSc നഴ്‌സിംഗ് അല്ലെങ്കിൽ തത്തുല്യ യോഗ്യത',
      'DHA ലൈസൻസ് അല്ലെങ്കിൽ DHA പരീക്ഷ യോഗ്യത',
      '3+ വർഷം ICU/ക്രിറ്റിക്കൽ കെയർ നഴ്‌സിംഗ് അനുഭവം',
      'BLS/ACLS സർട്ടിഫിക്കേഷൻ നിർബന്ധം',
      'ഇംഗ്ലീഷ് ആശയവിനിമയ കഴിവ്',
    ],
    benefits: [
      { icon: 'health', text: 'Health & dental insurance', textMl: 'ആരോഗ്യ & ദന്ത ഇൻഷുറൻസ്' },
      { icon: 'visa', text: 'DHA licensing support', textMl: 'DHA ലൈസൻസ് സഹായം' },
      { icon: 'flight', text: 'Annual repatriation ticket', textMl: 'വാർഷിക നാട്ടിൽ ടിക്കറ്റ്' },
      { icon: 'learning', text: 'Ongoing training & CPD', textMl: 'തുടർ പരിശീലനം & CPD' },
      { icon: 'meal', text: 'Staff accommodation available', textMl: 'ജീവനക്കാർ താമസ സൗകര്യം' },
    ],
    postedDate: '2025-05-10',
    deadline: '2025-07-01',
    applicants: 203,
    companyRating: 4.2,
    companyReviews: 891,
    companyDescription: 'Medcare Hospitals is a leading private hospital group in Dubai with over 25 years of service excellence. Our hospitals are JCI-accredited and known for exceptional patient outcomes across specialties.',
    companyDescriptionMl: 'Medcare Hospitals 25+ വർഷത്തെ സേവന മികവുള്ള ദുബായിലെ ഒരു പ്രമുഖ സ്വകാര്യ ആശുപത്രി ഗ്രൂപ്പാണ്.',
    tags: ['Nursing', 'ICU', 'Healthcare', 'Dubai', 'DHA'],
  },
  {
    id: 'civil-engineer-abudhabi',
    title: 'Senior Civil Engineer — Infrastructure',
    titleMl: 'സീനിയർ സിവിൽ എഞ്ചിനീയർ — ഇൻഫ്രാസ്ട്രക്ചർ',
    company: 'Arabtec Construction',
    companyMl: 'അറബ്ടെക് കൺസ്ട്രക്ഷൻ',
    companyLogo: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=120&q=80',
    companyCover: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80',
    location: 'Mussafah, Abu Dhabi',
    emirate: 'Abu Dhabi',
    salary: 'AED 16,000 – 22,000 / month',
    salaryMl: 'AED 16,000 – 22,000 / മാസം',
    jobType: 'Full-time',
    jobTypeMl: 'പൂർണ്ണ സമയം',
    experience: '8+ years',
    experienceMl: '8+ വർഷം',
    industry: 'Construction',
    industryMl: 'നിർമ്മാണം',
    description: `Arabtec Construction seeks a Senior Civil Engineer to oversee infrastructure projects across Abu Dhabi including road construction, drainage systems, and utility networks. You will manage site teams, coordinate with sub-contractors, and ensure all works are delivered on time, within budget, and to specification.\n\nYou will prepare and review engineering drawings, conduct site inspections, manage material procurement, and liaise with client representatives and regulatory authorities including ADDC, AADC, and TRANSCO. Strong knowledge of UAE construction standards, AASHTO, and AutoCAD is essential.\n\nThis is a leadership role requiring you to mentor junior engineers, manage up to 150 site workers, and represent the company in client meetings. Gulf experience is a must.`,
    descriptionMl: `Arabtec Construction റോഡ് നിർമ്മാണം, ഡ്രെയിനേജ് സിസ്റ്റങ്ങൾ, യൂട്ടിലിറ്റി നെറ്റ്‌വർക്കുകൾ ഉൾപ്പെടുന്ന അബുദാബി ഇൻഫ്രാസ്ട്രക്ചർ പ്രോജക്ടുകൾ മേൽനോട്ടം വഹിക്കാൻ ഒരു സീനിയർ സിവിൽ എഞ്ചിനീയറെ ആഗ്രഹിക്കുന്നു.`,
    requirements: [
      'B.E./B.Tech in Civil Engineering (mandatory)',
      '8+ years infrastructure construction experience in UAE/GCC',
      'Proficiency in AutoCAD, Civil 3D, and MS Project',
      'Familiarity with AASHTO, BS, and UAE standards',
      'Valid UAE driving license',
      'Strong leadership and team management skills',
    ],
    requirementsMl: [
      'B.E./B.Tech സിവിൽ എഞ്ചിനീയറിംഗ് (നിർബന്ധം)',
      '8+ വർഷം UAE/GCC ഇൻഫ്രാ കൺസ്ട്രക്ഷൻ അനുഭവം',
      'AutoCAD, Civil 3D, MS Project-ൽ പ്രാവീണ്യം',
    ],
    benefits: [
      { icon: 'health', text: 'Medical insurance', textMl: 'മെഡിക്കൽ ഇൻഷുറൻസ്' },
      { icon: 'visa', text: 'Visa + accommodation', textMl: 'വിസ + താമസം' },
      { icon: 'flight', text: 'Annual air ticket', textMl: 'വാർഷിക വിമാനം' },
      { icon: 'bonus', text: 'Site completion bonus', textMl: 'സൈറ്റ് ബോണസ്' },
    ],
    postedDate: '2025-04-20',
    deadline: '2025-06-20',
    applicants: 156,
    companyRating: 3.9,
    companyReviews: 564,
    companyDescription: 'Arabtec Construction is one of the GCC\'s largest construction companies with a 40-year track record delivering iconic projects including the Burj Khalifa podium, Presidential Palace Abu Dhabi, and major infrastructure across the region.',
    companyDescriptionMl: 'Arabtec Construction GCC-ൽ 40 വർഷത്തെ ട്രാക്ക് റെക്കോർഡ് ഉള്ള ഏറ്റവും വലിയ നിർമ്മാണ കമ്പനികളിൽ ഒന്നാണ്.',
    tags: ['Civil', 'Engineering', 'Construction', 'Infrastructure', 'Abu Dhabi'],
  },
  {
    id: 'restaurant-manager-dubai',
    title: 'Restaurant Manager — Kerala Cuisine',
    titleMl: 'റസ്റ്റോറന്റ് മാനേജർ — കേരള ഭക്ഷണം',
    company: 'Malabar Kitchen Group',
    companyMl: 'മലബാർ കിച്ചൺ ഗ്രൂപ്പ്',
    companyLogo: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=120&q=80',
    companyCover: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80',
    location: 'Jumeirah, Dubai',
    emirate: 'Dubai',
    salary: 'AED 10,000 – 14,000 / month',
    salaryMl: 'AED 10,000 – 14,000 / മാസം',
    jobType: 'Full-time',
    jobTypeMl: 'പൂർണ്ണ സമയം',
    experience: '5+ years',
    experienceMl: '5+ വർഷം',
    industry: 'Food & Beverage',
    industryMl: 'ഭക്ഷണം & പാനീയം',
    description: `Malabar Kitchen Group is bringing authentic Kerala and Malabar cuisine to Dubai's discerning food lovers, and we need a passionate, experienced Restaurant Manager to run our flagship Jumeirah location. This is an exciting opportunity to join a fast-growing F&B brand that celebrates the rich culinary heritage of Kerala.\n\nYou will oversee daily restaurant operations including front-of-house management, inventory control, staff scheduling, and customer experience. Working directly with the Executive Chef, you will maintain the highest standards of food quality, hygiene, and service that our guests expect.\n\nStrong Malayalam language skills are highly desirable for this role, as you will work with an exclusively Malayali kitchen team and serve a predominantly Malayali customer base. Experience with Kerala or Malabar cuisine is a definite advantage.`,
    descriptionMl: `Malabar Kitchen Group ദുബായ് ഭക്ഷണ പ്രേമികൾക്ക് ആധികാരിക കേരള, മലബാർ ഭക്ഷണം കൊണ്ടുവരുന്നു, ഞങ്ങളുടെ ഫ്ലാഗ്‌ഷിപ്പ് ജുമേറ ലൊക്കേഷൻ നടത്താൻ ഒരു അഭിനിവേശം, അനുഭവം ഉള്ള റസ്റ്റോറന്റ് മാനേജർ ആവശ്യം.`,
    requirements: [
      '5+ years restaurant management experience',
      'Knowledge of Kerala/Malabar cuisine strongly preferred',
      'Malayalam language proficiency required',
      'Strong leadership and team motivation skills',
      'Experience with POS systems and inventory management',
      'Food Safety certification (HACCP/ISO 22000)',
    ],
    requirementsMl: [
      '5+ വർഷം റസ്റ്റോറന്റ് മാനേജ്‌മെന്റ് അനുഭവം',
      'കേരള/മലബാർ ഭക്ഷണത്തിന്റെ അറിവ് ഗുണം',
      'മലയാളം ഭാഷ പ്രാവീണ്യം',
      'ശക്തമായ നേതൃത്വ, ടീം ഓർഗനൈസേഷൻ കഴിവ്',
    ],
    benefits: [
      { icon: 'health', text: 'Health insurance', textMl: 'ആരോഗ്യ ഇൻഷുറൻസ്' },
      { icon: 'meal', text: 'Free daily meals', textMl: 'സൗജന്യ ഭക്ഷണം' },
      { icon: 'bonus', text: 'Sales performance bonus', textMl: 'സെയിൽസ് ബോണസ്' },
      { icon: 'visa', text: 'Visa sponsorship', textMl: 'വിസ സ്പോൺസർഷിപ്പ്' },
    ],
    postedDate: '2025-05-08',
    deadline: '2025-06-08',
    applicants: 48,
    companyRating: 4.7,
    companyReviews: 89,
    companyDescription: 'Malabar Kitchen Group is a premium F&B brand celebrating authentic Kerala cuisine in Dubai. With three outlets and plans for rapid expansion, we bring the flavors of God\'s Own Country to the Emirates.',
    companyDescriptionMl: 'Malabar Kitchen Group ദുബായിലെ ആധികാരിക കേരള ഭക്ഷണം ആഘോഷിക്കുന്ന ഒരു പ്രീമിയം F&B ബ്രാൻഡാണ്.',
    tags: ['F&B', 'Restaurant', 'Kerala Cuisine', 'Management', 'Dubai'],
  },
  {
    id: 'teacher-indian-curriculum-dubai',
    title: 'Senior Mathematics Teacher (CBSE/ICSE)',
    titleMl: 'സീനിയർ ഗണിതം അദ്ധ്യാപകൻ (CBSE/ICSE)',
    company: 'Gems Modern Academy',
    companyMl: 'ജെംസ് മോഡേൺ അക്കാദമി',
    companyLogo: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=120&q=80',
    companyCover: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1200&q=80',
    location: 'Al Qusais, Dubai',
    emirate: 'Dubai',
    salary: 'AED 9,000 – 13,000 / month',
    salaryMl: 'AED 9,000 – 13,000 / മാസം',
    jobType: 'Full-time',
    jobTypeMl: 'പൂർണ്ണ സമയം',
    experience: '5+ years',
    experienceMl: '5+ വർഷം',
    industry: 'Education',
    industryMl: 'വിദ്യാഭ്യാസം',
    description: `GEMS Modern Academy, one of Dubai's top-rated Indian curriculum schools, is seeking a dedicated and passionate Senior Mathematics Teacher to join our secondary school faculty. You will teach Mathematics to students in Grades 9 through 12 following the CBSE/ICSE curriculum, preparing students for board examinations and competitive entrance tests.\n\nYou will design engaging lesson plans, develop assessments, provide individualised support to struggling students, and participate in parent-teacher meetings and school events. Experience with digital learning tools and SMART classroom technology is expected.\n\nWe particularly welcome applications from Malayali teachers who bring cultural sensitivity and dedication that our predominantly South Indian student community appreciates. KHDA approval is required before joining.`,
    descriptionMl: `GEMS Modern Academy ദുബായിൽ ടോപ്-റേറ്റഡ് ഇന്ത്യൻ കരിക്കുലം സ്കൂളുകളിൽ ഒന്നാണ്, ഞങ്ങൾ ഗ്രേഡ് 9-12 വിദ്യാർത്ഥികൾക്ക് ഗണിതം പഠിപ്പിക്കുന്ന ഒരു ഉത്സാഹഭരിതനായ സീനിയർ ടീച്ചറെ ആഗ്രഹിക്കുന്നു.`,
    requirements: [
      'B.Ed + BSc/MSc Mathematics (mandatory)',
      '5+ years secondary school teaching experience',
      'KHDA approval or eligibility',
      'Strong command of CBSE/ICSE curriculum',
      'Experience with digital learning tools',
      'Excellent classroom management skills',
    ],
    requirementsMl: [
      'B.Ed + BSc/MSc ഗണിതം (നിർബന്ധം)',
      '5+ വർഷം സെക്കൻഡറി സ്കൂൾ ടീച്ചിംഗ് അനുഭവം',
      'KHDA അംഗീകാരം',
      'CBSE/ICSE കരിക്കുലം ശക്തമായ കൈകാര്യ ശേഷി',
    ],
    benefits: [
      { icon: 'health', text: 'Medical insurance', textMl: 'മെഡിക്കൽ ഇൻഷുറൻസ്' },
      { icon: 'visa', text: 'Residency visa', textMl: 'റെസിഡൻസി വിസ' },
      { icon: 'flight', text: 'Annual air ticket', textMl: 'വാർഷിക വിമാനം' },
      { icon: 'learning', text: 'Professional development', textMl: 'പ്രൊഫഷണൽ ഡെവലപ്‌മെന്റ്' },
      { icon: 'bonus', text: 'End of service gratuity', textMl: 'ഗ്രാറ്റ്യൂട്ടി' },
    ],
    postedDate: '2025-04-15',
    deadline: '2025-06-10',
    applicants: 178,
    companyRating: 4.4,
    companyReviews: 723,
    companyDescription: 'GEMS Modern Academy is one of the UAE\'s most respected Indian curriculum schools, with a legacy of academic excellence spanning 30 years in Dubai.',
    companyDescriptionMl: 'GEMS Modern Academy UAE-ൽ ഏറ്റവും ബഹുമാനനീയ ഇന്ത്യൻ കരിക്കുലം സ്കൂളുകളിൽ ഒന്നാണ്.',
    tags: ['Education', 'Teaching', 'CBSE', 'Mathematics', 'Dubai'],
  },
  {
    id: 'logistics-coordinator-jebel-ali',
    title: 'Logistics & Supply Chain Coordinator',
    titleMl: 'ലോജിസ്റ്റിക്‌സ് & സപ്ലൈ ചെയിൻ കോഓർഡിനേറ്റർ',
    company: 'DP World Logistics',
    companyMl: 'DP World ലോജിസ്റ്റിക്‌സ്',
    companyLogo: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=120&q=80',
    companyCover: 'https://images.unsplash.com/photo-1494412651409-8963ce7935a7?w=1200&q=80',
    location: 'Jebel Ali Free Zone, Dubai',
    emirate: 'Dubai',
    salary: 'AED 7,000 – 10,000 / month',
    salaryMl: 'AED 7,000 – 10,000 / മാസം',
    jobType: 'Full-time',
    jobTypeMl: 'പൂർണ്ണ സമയം',
    experience: '3-5 years',
    experienceMl: '3-5 വർഷം',
    industry: 'Logistics & Supply Chain',
    industryMl: 'ലോജിസ്റ്റിക്‌സ് & സപ്ലൈ ചെയിൻ',
    description: `DP World, a global leader in smart end-to-end supply chain solutions, is expanding its operations team at Jebel Ali Free Zone. We are looking for a detail-oriented Logistics Coordinator to manage import/export documentation, coordinate with shipping lines and freight forwarders, and ensure seamless cargo movement through our terminals.\n\nYou will process customs declarations, manage Bills of Lading, track shipment milestones, and resolve discrepancies with suppliers and customers. Familiarity with Dubai Customs and UAE import/export regulations is essential. Experience with SAP or similar ERP systems is advantageous.\n\nThis is a high-pace role in one of the world's most important logistics hubs, ideal for a driven professional who thrives in dynamic environments.`,
    descriptionMl: `DP World Jebel Ali Free Zone-ൽ ഞങ്ങളുടെ ഓപ്പറേഷൻ ടീം വിപുലീകരിക്കുകയാണ്. ഇറക്കുമതി/കയറ്റുമതി ഡോക്യുമെന്റേഷൻ കൈകാര്യം ചെയ്യാൻ, ഷിപ്പിംഗ് ലൈൻ, ഫ്രെയ്റ്റ് ഫോർവാർഡറുകളുമായി ഏകോപിപ്പിക്കാൻ ഒരു കൃത്യതയുള്ള ലോജിസ്റ്റിക്‌സ് കോഓർഡിനേറ്ററെ ഞങ്ങൾ ആഗ്രഹിക്കുന്നു.`,
    requirements: [
      '3-5 years UAE logistics/freight forwarding experience',
      'Knowledge of Dubai Customs and UAE trade regulations',
      'Experience with shipping documentation (B/L, LC, COO)',
      'Proficiency in SAP or other ERP systems',
      'Strong MS Excel skills',
      'UAE driving license preferred',
    ],
    requirementsMl: [
      '3-5 വർഷം UAE ലോജിസ്റ്റിക്‌സ് അനുഭവം',
      'ദുബായ് കസ്റ്റംസ്, UAE ട്രേഡ് നിയന്ത്രണങ്ങൾ അറിവ്',
      'ഷിപ്പിംഗ് ഡോക്യുമെന്റേഷൻ അനുഭവം',
      'SAP അല്ലെങ്കിൽ ERP-ൽ പ്രാവീണ്യം',
    ],
    benefits: [
      { icon: 'health', text: 'Medical + life insurance', textMl: 'മെഡിക്കൽ + ജീവൻ ഇൻഷുറൻസ്' },
      { icon: 'visa', text: 'Visa sponsorship', textMl: 'വിസ സ്പോൺസർഷിപ്പ്' },
      { icon: 'bonus', text: 'Annual bonus', textMl: 'വാർഷിക ബോണസ്' },
      { icon: 'flexible', text: 'Shift flexibility', textMl: 'ഷിഫ്റ്റ് ഫ്ലെക്സിബിലിറ്റി' },
    ],
    postedDate: '2025-05-12',
    deadline: '2025-07-12',
    applicants: 92,
    companyRating: 4.0,
    companyReviews: 1234,
    companyDescription: 'DP World is a global leader in smart supply chain solutions, operating a world-class logistics park at Jebel Ali that handles over 20 million TEUs annually — the busiest port in the MENA region.',
    companyDescriptionMl: 'DP World ഒരു ആഗോള ലോജിസ്റ്റിക്‌സ് ലീഡർ ആണ്, Jebel Ali-ൽ ലോക ക്ലാസ് ലോജിസ്റ്റിക്‌സ് പാർക്ക് ഓപ്പറേറ്റ് ചെയ്യുന്നു.',
    tags: ['Logistics', 'Supply Chain', 'Shipping', 'Customs', 'Jebel Ali'],
  },
]

// ─── Star Rating ──────────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={14}
          className={star <= Math.round(rating) ? 'text-kerala-gold fill-kerala-gold' : 'text-gray-200 fill-gray-200'}
        />
      ))}
    </div>
  )
}

// ─── Apply Modal ──────────────────────────────────────────────────────────────

interface ApplyModalProps {
  job: Job
  isMl: boolean
  onClose: () => void
}

function ApplyModal({ job, isMl, onClose }: ApplyModalProps) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', cover: '' })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => { setLoading(false); setSubmitted(true) }, 1200)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-kerala-green to-kerala-deep p-5 rounded-t-2xl flex items-center justify-between">
          <div>
            <p className="text-white/70 text-xs">{isMl ? 'അപേക്ഷ' : 'Apply for'}</p>
            <h3 className="text-white font-serif text-lg font-bold">{isMl ? job.titleMl : job.title}</h3>
            <p className="text-kerala-gold text-sm">{isMl ? job.companyMl : job.company}</p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {submitted ? (
            <div className="text-center py-8">
              <CheckCircle size={56} className="text-kerala-green mx-auto mb-3" />
              <h4 className="font-serif text-xl text-kerala-deep font-bold mb-2">
                {isMl ? 'അപേക്ഷ സ്വീകരിച്ചു!' : 'Application Submitted!'}
              </h4>
              <p className="text-gray-500 text-sm">
                {isMl
                  ? 'ടീം 3 ദിവസത്തിനകം ബന്ധപ്പെടും.'
                  : 'Our recruitment team will reach out within 3 business days.'}
              </p>
              <button
                onClick={onClose}
                className="mt-5 bg-kerala-green text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-kerala-green/90 transition-colors"
              >
                {isMl ? 'അടയ്ക്കുക' : 'Close'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">
                  {isMl ? 'പൂർണ്ണ നാമം' : 'Full Name'} *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-kerala-green"
                  placeholder={isMl ? 'നിങ്ങളുടെ പേര്' : 'Your full name'}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">
                  {isMl ? 'ഇമെയിൽ' : 'Email Address'} *
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-kerala-green"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">
                  {isMl ? 'ഫോൺ' : 'Phone Number'} *
                </label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-kerala-green"
                  placeholder="+971 50 000 0000"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">
                  {isMl ? 'കവർ ലെറ്റർ' : 'Cover Letter'}
                </label>
                <textarea
                  rows={4}
                  value={form.cover}
                  onChange={(e) => setForm((f) => ({ ...f, cover: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-kerala-green resize-none"
                  placeholder={isMl ? 'ഈ ജോലി നിങ്ങൾക്ക് അനുയോജ്യമായ കാരണം...' : 'Tell us why you are the right fit for this role...'}
                />
              </div>
              <div>
                <button
                  type="button"
                  className="w-full border-2 border-dashed border-gray-300 rounded-xl px-3 py-4 text-sm text-gray-500 hover:border-kerala-green hover:text-kerala-green transition-colors flex items-center justify-center gap-2"
                >
                  <Upload size={16} />
                  {isMl ? 'CV/Resume അപ്‌ലോഡ് ചെയ്യൂ (PDF/DOC)' : 'Upload CV / Resume (PDF, DOC)'}
                </button>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-kerala-green hover:bg-kerala-green/90 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : null}
                {isMl ? 'അപേക്ഷ സമർപ്പിക്കൂ' : 'Submit Application'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function JobDetailPage() {
  const locale = useLocale()
  const params = useParams()
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : ''

  const isMl = locale === 'ml'

  const job = useMemo(
    () => mockJobs.find((j) => j.id === id) ?? mockJobs[0],
    [id],
  )

  const [showModal, setShowModal] = useState(false)
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)

  const similarJobs = useMemo(
    () => mockJobs.filter((j) => j.id !== job.id && j.industry === job.industry)
      .concat(mockJobs.filter((j) => j.id !== job.id && j.industry !== job.industry))
      .slice(0, 4),
    [job.id, job.industry],
  )

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const postedDaysAgo = Math.floor(
    (Date.now() - new Date(job.postedDate).getTime()) / 86400000,
  )

  return (
    <main className="min-h-screen bg-kerala-cream pb-20 md:pb-0">
      <Navbar />

      {/* ── Company Cover Banner ── */}
      <section className="relative h-48 w-full overflow-hidden">
        <Image src={job.companyCover} alt={job.company} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-kerala-deep/80 to-transparent" />
        <Link
          href={`/${locale}/jobs`}
          className="absolute top-4 left-4 inline-flex items-center gap-1 text-white/80 hover:text-white text-sm transition-colors bg-black/30 px-3 py-1.5 rounded-full"
        >
          <ArrowLeft size={14} /> {isMl ? 'ജോലികൾ' : 'All Jobs'}
        </Link>

        {/* Company logo overlaid */}
        <div className="absolute bottom-0 left-6 translate-y-1/2 z-10">
          <div className="relative w-20 h-20 rounded-xl overflow-hidden border-4 border-white shadow-lg bg-white">
            <Image src={job.companyLogo} alt={job.company} fill className="object-cover" />
          </div>
        </div>
      </section>

      {/* ── Job Header ── */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 pt-14 pb-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-serif text-2xl md:text-3xl text-kerala-deep font-bold">
                {isMl ? job.titleMl : job.title}
              </h1>
              <p className="text-kerala-green font-semibold mt-1">
                {isMl ? job.companyMl : job.company}
              </p>
              <div className="flex flex-wrap gap-3 mt-3 text-sm text-gray-600">
                <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                <span className="flex items-center gap-1"><DollarSign size={14} /> {isMl ? job.salaryMl : job.salary}</span>
                <span className="flex items-center gap-1"><Briefcase size={14} /> {isMl ? job.jobTypeMl : job.jobType}</span>
                <span className="flex items-center gap-1"><Clock size={14} /> {isMl ? job.experienceMl : job.experience}</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {[job.jobType, job.industry].map((chip) => (
                  <span key={chip} className="bg-kerala-green/10 text-kerala-green text-xs px-3 py-1 rounded-full font-semibold">
                    {chip}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex gap-2 hidden md:flex">
              <button
                onClick={() => setSaved(!saved)}
                className={`p-2.5 rounded-xl border transition-colors ${saved ? 'bg-kerala-gold/10 border-kerala-gold text-kerala-gold' : 'border-gray-200 text-gray-400 hover:border-kerala-gold hover:text-kerala-gold'}`}
              >
                <Bookmark size={18} className={saved ? 'fill-kerala-gold' : ''} />
              </button>
              <button
                onClick={handleCopy}
                className="p-2.5 rounded-xl border border-gray-200 text-gray-400 hover:border-kerala-green hover:text-kerala-green transition-colors"
              >
                {copied ? <CheckCircle size={18} className="text-kerala-green" /> : <Copy size={18} />}
              </button>
              <button
                onClick={() => setShowModal(true)}
                className="bg-kerala-green text-white px-6 py-2.5 rounded-xl font-bold hover:bg-kerala-green/90 transition-colors"
              >
                {isMl ? 'ഇപ്പോൾ അപേക്ഷിക്കൂ' : 'Apply Now'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">

            {/* Job Description */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-serif text-xl text-kerala-deep font-bold mb-4">
                {isMl ? 'ജോലി വിവരണം' : 'Job Description'}
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed text-sm">
                {(isMl ? job.descriptionMl : job.description).split('\n\n').map((para, i) => (
                  <p key={i} className={isMl ? 'font-malayalam' : ''}>{para}</p>
                ))}
              </div>
            </section>

            {/* Requirements */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-serif text-xl text-kerala-deep font-bold mb-4">
                {isMl ? 'ആവശ്യകതകൾ' : 'Requirements'}
              </h2>
              <ul className="space-y-2">
                {(isMl ? job.requirementsMl : job.requirements).map((req, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                    <CheckCircle size={15} className="text-kerala-green mt-0.5 shrink-0" />
                    <span className={isMl ? 'font-malayalam' : ''}>{req}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Benefits */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-serif text-xl text-kerala-deep font-bold mb-5">
                {isMl ? 'ആനുകൂല്യങ്ങൾ' : 'Benefits & Perks'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {job.benefits.map((benefit, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-kerala-cream rounded-xl">
                    <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-sm shrink-0">
                      {benefitIconMap[benefit.icon] ?? <Star size={18} className="text-kerala-green" />}
                    </div>
                    <span className={`text-sm text-gray-700 ${isMl ? 'font-malayalam' : ''}`}>
                      {isMl ? benefit.textMl : benefit.text}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* About Company */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-serif text-xl text-kerala-deep font-bold mb-5">
                {isMl ? 'കമ്പനിയെ കുറിച്ച്' : 'About the Company'}
              </h2>
              <div className="flex items-start gap-4 mb-4">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-gray-100 shadow-sm shrink-0">
                  <Image src={job.companyLogo} alt={job.company} fill className="object-cover" />
                </div>
                <div>
                  <p className="font-semibold text-kerala-deep">{isMl ? job.companyMl : job.company}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <StarRating rating={job.companyRating} />
                    <span className="text-kerala-gold font-bold text-sm">{job.companyRating}</span>
                    <span className="text-gray-400 text-xs">({job.companyReviews} {isMl ? 'അഭിപ്രായങ്ങൾ' : 'reviews'})</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3 text-sm text-gray-700">
                {(isMl ? job.companyDescriptionMl : job.companyDescription).split('\n\n').map((para, i) => (
                  <p key={i} className={isMl ? 'font-malayalam' : ''}>{para}</p>
                ))}
              </div>
            </section>

            {/* Share & Save */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-serif text-lg text-kerala-deep font-bold mb-4">
                {isMl ? 'ഈ ജോലി പങ്കിടൂ' : 'Share This Job'}
              </h2>
              <div className="flex flex-wrap gap-3">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent((isMl ? job.titleMl : job.title) + ' at ' + (isMl ? job.companyMl : job.company) + ' — ' + (typeof window !== 'undefined' ? window.location.href : ''))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  WhatsApp
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#0A66C2] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  LinkedIn
                </a>
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors"
                >
                  {copied ? <CheckCircle size={14} className="text-kerala-green" /> : <Copy size={14} />}
                  {copied ? (isMl ? 'പകർത്തി!' : 'Copied!') : (isMl ? 'ലിങ്ക് പകർത്തൂ' : 'Copy Link')}
                </button>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* Job Summary Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-4">
              <h3 className="font-semibold text-kerala-deep mb-4 uppercase text-xs tracking-wide">
                {isMl ? 'ജോലി സംഗ്രഹം' : 'Job Summary'}
              </h3>
              <dl className="space-y-3 text-sm">
                {[
                  { icon: <DollarSign size={14} />, label: isMl ? 'ശമ്പളം' : 'Salary', value: isMl ? job.salaryMl : job.salary },
                  { icon: <Briefcase size={14} />, label: isMl ? 'തരം' : 'Job Type', value: isMl ? job.jobTypeMl : job.jobType },
                  { icon: <Award size={14} />, label: isMl ? 'അനുഭവം' : 'Experience', value: isMl ? job.experienceMl : job.experience },
                  { icon: <Building2 size={14} />, label: isMl ? 'വ്യവസായം' : 'Industry', value: isMl ? job.industryMl : job.industry },
                  { icon: <Calendar size={14} />, label: isMl ? 'പ്രസിദ്ധീകരിച്ചത്' : 'Posted', value: `${postedDaysAgo}d ${isMl ? 'മുമ്പ്' : 'ago'}` },
                  { icon: <Clock size={14} />, label: isMl ? 'അവസാന തീയതി' : 'Deadline', value: new Date(job.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) },
                  { icon: <Users size={14} />, label: isMl ? 'അപേക്ഷകർ' : 'Applicants', value: `${job.applicants}+` },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="flex items-start gap-2.5">
                    <span className="text-kerala-green mt-0.5">{icon}</span>
                    <div>
                      <span className="text-gray-400 text-xs">{label}</span>
                      <p className="font-semibold text-kerala-deep">{value}</p>
                    </div>
                  </div>
                ))}
              </dl>

              <button
                onClick={() => setShowModal(true)}
                className="mt-5 w-full bg-kerala-green hover:bg-kerala-green/90 text-white font-bold py-3.5 rounded-xl transition-colors text-sm"
              >
                {isMl ? 'ഇപ്പോൾ അപേക്ഷിക്കൂ' : 'Apply Now'}
              </button>
              <button
                onClick={() => setSaved(!saved)}
                className={`mt-2 w-full border font-semibold py-2.5 rounded-xl transition-colors text-sm flex items-center justify-center gap-2 ${saved ? 'border-kerala-gold text-kerala-gold bg-kerala-gold/5' : 'border-gray-200 text-gray-600 hover:border-kerala-gold hover:text-kerala-gold'}`}
              >
                <Bookmark size={14} className={saved ? 'fill-kerala-gold' : ''} />
                {saved ? (isMl ? 'സംരക്ഷിച്ചു' : 'Saved') : (isMl ? 'ജോലി സംരക്ഷിക്കൂ' : 'Save Job')}
              </button>
            </div>

            {/* Similar Jobs */}
            {similarJobs.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-semibold text-kerala-deep mb-4 uppercase text-xs tracking-wide">
                  {isMl ? 'സമാന ജോലികൾ' : 'Similar Jobs'}
                </h3>
                <div className="space-y-3">
                  {similarJobs.map((sj) => (
                    <Link
                      key={sj.id}
                      href={`/${locale}/jobs/${sj.id}`}
                      className="flex gap-3 group p-2 rounded-xl hover:bg-kerala-cream transition-colors"
                    >
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-gray-100 shrink-0">
                        <Image src={sj.companyLogo} alt={sj.company} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-kerala-deep group-hover:text-kerala-green transition-colors line-clamp-1">
                          {isMl ? sj.titleMl : sj.title}
                        </p>
                        <p className="text-gray-400 text-xs mt-0.5 truncate">{isMl ? sj.companyMl : sj.company}</p>
                        <p className="text-kerala-gold text-xs font-semibold mt-0.5">{sj.salary.split(' / ')[0]}</p>
                      </div>
                      <ChevronRight size={14} className="text-gray-300 group-hover:text-kerala-green shrink-0 mt-1 transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-semibold text-kerala-deep mb-3 uppercase text-xs tracking-wide">
                {isMl ? 'ടാഗുകൾ' : 'Tags'}
              </h3>
              <div className="flex flex-wrap gap-2">
                {job.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 bg-kerala-green/10 text-kerala-green text-xs px-3 py-1.5 rounded-full"
                  >
                    <Tag size={10} /> {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Apply bar — mobile only */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 flex gap-3 md:hidden z-40 shadow-lg">
        <button
          onClick={() => setSaved(!saved)}
          className={`p-3 rounded-xl border transition-colors shrink-0 ${saved ? 'border-kerala-gold text-kerala-gold bg-kerala-gold/5' : 'border-gray-200 text-gray-400'}`}
        >
          <Bookmark size={18} className={saved ? 'fill-kerala-gold' : ''} />
        </button>
        <button
          onClick={() => setShowModal(true)}
          className="flex-1 bg-kerala-green text-white font-bold py-3 rounded-xl hover:bg-kerala-green/90 transition-colors text-sm"
        >
          {isMl ? 'ഇപ്പോൾ അപേക്ഷിക്കൂ' : 'Apply Now'}
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <ApplyModal job={job} isMl={isMl} onClose={() => setShowModal(false)} />
      )}

      <Footer />
    </main>
  )
}
