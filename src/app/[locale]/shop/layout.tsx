import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Malayali Shop UAE | Shop from Kerala Businesses | MalayaliBusiness UAE',
  description: 'Shop products and services from Malayali businesses across UAE. From Kerala food & spices to electronics, clothing and professional services — all in one marketplace.',
  keywords: 'Malayali shop UAE, Kerala products Dubai, Malayalam business shop UAE, buy from Malayali businesses, Kerala marketplace UAE',
  openGraph: {
    title: 'Malayali Shop UAE — MalayaliBusiness',
    description: 'Shop products and services from Malayali businesses across UAE.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Malayali Shop UAE',
    description: 'Shop products and services from Malayali businesses across UAE.',
  },
}

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
