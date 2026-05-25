import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Malayali Classifieds UAE | Buy, Sell & Rent | MalayaliBusiness UAE',
  description: 'Browse Malayali classifieds across UAE. Buy, sell and rent items — cars, electronics, furniture, properties and services posted by the Malayali community in Dubai, Abu Dhabi and Sharjah.',
  keywords: 'Malayali classifieds UAE, buy sell Dubai Malayali, Kerala classifieds UAE, Malayalam ads UAE, used items Dubai Malayali',
  openGraph: {
    title: 'Malayali Classifieds UAE — MalayaliBusiness',
    description: 'Buy, sell and rent within the UAE Malayali community. Find great deals on cars, electronics, furniture and more.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Malayali Classifieds UAE',
    description: 'Buy, sell and rent within the UAE Malayali community.',
  },
}

export default function ClassifiedsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
