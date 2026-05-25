import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Malayali Events in UAE | MalayaliBusiness UAE',
  description: 'Discover Malayali cultural events, networking meetups, business summits, food festivals and community gatherings across Dubai, Abu Dhabi, Sharjah and all UAE emirates.',
  keywords: 'Malayali events UAE, Kerala events Dubai, Malayalam community events UAE, onam events UAE, Malayali networking Dubai',
  openGraph: {
    title: 'Malayali Events in UAE — MalayaliBusiness',
    description: 'Cultural events, business networking, food festivals and community gatherings for the Malayali community across UAE.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Malayali Events in UAE',
    description: 'Discover Malayali cultural events and community gatherings across UAE.',
  },
}

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
