import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Malayali Jobs in UAE | MalayaliBusiness UAE',
  description: 'Find jobs posted by Malayali businesses across UAE. Browse full-time, part-time, contract and freelance positions in Dubai, Abu Dhabi, Sharjah and all UAE emirates.',
  keywords: 'Malayali jobs UAE, Kerala jobs Dubai, Malayalam jobs UAE, jobs for Malayalis Dubai, UAE job vacancies Kerala',
  openGraph: {
    title: 'Malayali Jobs in UAE — MalayaliBusiness',
    description: 'Browse job opportunities from Malayali businesses across Dubai, Abu Dhabi, Sharjah and all UAE emirates.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Malayali Jobs in UAE',
    description: 'Find jobs posted by Malayali businesses across UAE.',
  },
}

export default function JobsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
