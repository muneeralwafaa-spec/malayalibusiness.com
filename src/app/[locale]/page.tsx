import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/home/Hero'
import LocationStrip from '@/components/home/LocationStrip'
import CategoryGrid from '@/components/home/CategoryGrid'
import FeaturedListings from '@/components/home/FeaturedListings'
import PremiumAdsTicker from '@/components/home/PremiumAdsTicker'
import EventsSection from '@/components/home/EventsSection'
import ClassifiedsSection from '@/components/home/ClassifiedsSection'
import BusinessOwnersCTA from '@/components/home/BusinessOwnersCTA'
import JobsSection from '@/components/home/JobsSection'
import ShopSection from '@/components/home/ShopSection'
import BlogSection from '@/components/home/BlogSection'
import CTABanner from '@/components/home/CTABanner'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-kerala-cream">
      <Navbar />
      <Hero />
      <LocationStrip />
      <CategoryGrid />
      <FeaturedListings />
      <PremiumAdsTicker />
      <EventsSection />
      <ClassifiedsSection />
      <BusinessOwnersCTA />
      <JobsSection />
      <ShopSection />
      <BlogSection />
      <CTABanner />
      <Footer />
    </main>
  )
}
