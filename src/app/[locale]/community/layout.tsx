import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Malayali Community UAE | Forum & Discussions | MalayaliBusiness UAE',
  description: 'Connect with 3.5 million Malayalis in UAE. Join discussions, share advice and build connections with the Malayali community across Dubai, Abu Dhabi and Sharjah.',
  keywords: 'Malayali community UAE, Kerala community Dubai, Malayali forum UAE, Malayalam community forum, Keralites UAE',
  openGraph: {
    title: 'Malayali Community UAE — MalayaliBusiness',
    description: 'Connect with 3.5 million Malayalis in UAE. Join discussions and build community.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Malayali Community UAE',
    description: 'Connect with 3.5 million Malayalis in UAE.',
  },
}

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
