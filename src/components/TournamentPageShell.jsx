import Footer from './Footer'
import Navbar from './Navbar'

function TournamentPageShell({ children }) {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />
      {children}
      <Footer />
    </div>
  )
}

export default TournamentPageShell
