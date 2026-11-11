import { useAuthStore } from '../store/authStore'
import Footer from './Footer'
import Navbar from './Navbar'

function TournamentPageShell({ children, bottomTabs = false }) {
  const authenticated = useAuthStore((state) => state.status === 'authenticated')

  return (
    <div className={`min-h-screen bg-white text-gray-900 ${bottomTabs && authenticated ? 'pb-16 sm:pb-0' : ''}`}>
      <Navbar bottomTabs={bottomTabs} />
      {children}
      <Footer />
    </div>
  )
}

export default TournamentPageShell
