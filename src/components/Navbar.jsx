import logo from '../assets/app_logo.png'
import { useAuthStore } from '../store/authStore'
import AppNavbar from './AppNavbar'
import PublicNavbar from './PublicNavbar'

function Navbar() {
  const status = useAuthStore((state) => state.status)

  if (status === 'authenticated') return <AppNavbar bottomTabs={false} />

  if (status === 'loading') {
    return (
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-5 sm:px-6">
          <img src={logo} alt="" className="h-8 w-8 rounded-md" />
          <span className="text-lg font-bold tracking-tight text-gray-900">Sillypoint</span>
        </div>
      </header>
    )
  }

  return <PublicNavbar />
}

export default Navbar
