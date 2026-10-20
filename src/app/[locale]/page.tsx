import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/home/Hero'
import LocationStrip from '@/components/home/LocationStrip'
import CategoryGrid from '@/components/home/CategoryGrid'
import FeaturedListings from '@/components/home/FeaturedListings'
import PremiumAdsTicker from '@/components/home/PremiumAdsTicker'
import BusinessOwnersCTA from '@/components/home/BusinessOwnersCTA'
import ProfessionalsSection from '@/components/home/ProfessionalsSection'
import MediaSection from '@/components/home/MediaSection'
import CTABanner from '@/components/home/CTABanner'

// Phase 2 (hidden — import when ready):
// import EventsSection from '@/components/home/EventsSection'
// import ClassifiedsSection from '@/components/home/ClassifiedsSection'
// import JobsSection from '@/components/home/JobsSection'
// import ShopSection from '@/components/home/ShopSection'
// import BlogSection from '@/components/home/BlogSection'
// import BusinessmenSection from '@/components/home/BusinessmenSection'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-kerala-cream">
      <Navbar />
      <Hero />
      <LocationStrip />
      <CategoryGrid />
      <FeaturedListings />
      <PremiumAdsTicker />
      <BusinessOwnersCTA />
      <ProfessionalsSection />
      <MediaSection />
      <CTABanner />
      <Footer />
    </main>
  )
}
