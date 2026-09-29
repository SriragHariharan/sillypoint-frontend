import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Features from '../components/Features'
import Formats from '../components/Formats'
import FeaturedTournaments from '../components/FeaturedTournaments'
import HowItWorks from '../components/HowItWorks'
import Roles from '../components/Roles'
import CTASection from '../components/CTASection'
import Footer from '../components/Footer'

function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <Hero />
      <FeaturedTournaments />
      <HowItWorks />
      <Features />
      <Formats />
      <Roles />
      <CTASection />
      <Footer />
    </div>
  )
}

export default LandingPage
