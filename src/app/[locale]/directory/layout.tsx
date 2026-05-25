import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Malayali Business Directory UAE | Find Kerala Businesses | MalayaliBusiness UAE',
  description: 'UAE\'s most complete Malayali business directory. Find Kerala restaurants, grocery stores, healthcare providers, legal services, IT companies and more across Dubai, Abu Dhabi and Sharjah.',
  keywords: 'Malayali business directory UAE, Kerala business Dubai, Kerala restaurant Dubai, Malayali companies UAE, Malayalam business listing UAE',
  openGraph: {
    title: 'Malayali Business Directory UAE — MalayaliBusiness',
    description: 'UAE\'s most complete Malayali business directory — restaurants, grocery, healthcare, legal and more.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Malayali Business Directory UAE',
    description: 'Find Kerala businesses across Dubai, Abu Dhabi, Sharjah and all UAE emirates.',
  },
}

export default function DirectoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
