import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'MalayaliBusiness UAE — UAE\'s #1 Malayali Business Network',
    template: '%s | MalayaliBusiness UAE',
  },
  description: 'Connecting 3.5 million Malayalis across Dubai, Abu Dhabi, Sharjah and all UAE emirates. Find Malayali businesses, events, jobs, classifieds and more.',
  keywords: 'Malayali business UAE, Kerala business Dubai, Malayalam directory UAE, Malayali community UAE, Kerala community Dubai, malayali jobs UAE',
  metadataBase: new URL('https://malayalibusiness.ae'),
  alternates: {
    canonical: '/',
    languages: {
      'en': '/en',
      'ml': '/ml',
    },
  },
  openGraph: {
    title: 'MalayaliBusiness UAE — UAE\'s #1 Malayali Business Network',
    description: 'Connecting 3.5 million Malayalis across Dubai, Abu Dhabi, Sharjah and all UAE emirates.',
    type: 'website',
    siteName: 'MalayaliBusiness UAE',
    locale: 'en_AE',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MalayaliBusiness UAE',
    description: 'UAE\'s #1 Malayali Business Network — businesses, events, jobs and classifieds.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
