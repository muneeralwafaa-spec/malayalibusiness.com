import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MalayaliBusiness UAE - UAE\'s #1 Malayali Business Network',
  description: 'Connecting 3.5 million Malayalis across Dubai, Abu Dhabi, Sharjah and all UAE emirates. Find Malayali businesses, events, jobs, classifieds and more.',
  keywords: 'Malayali business UAE, Kerala business Dubai, Malayalam directory UAE, Malayali community UAE',
  openGraph: {
    title: 'MalayaliBusiness UAE',
    description: 'UAE\'s #1 Malayali Business Network',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&family=Baloo+Chettan+2:wght@400;500;600;700;800&family=Outfit:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}
