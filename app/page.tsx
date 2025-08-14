import { Header } from '@/components/header'
import { HeroSection } from '@/components/hero-section'
import { WorkshopGrid } from '@/components/workshop-grid'
import { NewsSection } from '@/components/news-section'
import { Footer } from '@/components/footer'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <WorkshopGrid />
      <NewsSection />
      <Footer />
    </div>
  )
}
