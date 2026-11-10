import PublicNavbar from '../components/PublicNavbar'
import Hero from '../components/Hero'
import FeaturedTournaments from '../components/FeaturedTournaments'
import HowItWorks from '../components/HowItWorks'
import CTASection from '../components/CTASection'
import Footer from '../components/Footer'

function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <PublicNavbar glass />
      <Hero />
      <FeaturedTournaments />
      <HowItWorks />
      <CTASection />
      <Footer />
    </div>
  )
}

export default LandingPage
