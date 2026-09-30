import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import logo from '../assets/app_logo.png'
import { signOut } from '../lib/session'
import { useAuthStore } from '../store/authStore'
import Avatar from './Avatar'

const NAV_LINKS = [
  {
    to: '/home',
    label: 'Dashboard',
    icon: 'M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
    isActive: (pathname) => pathname === '/home',
  },
  {
    to: '/tournaments',
    label: 'Tournaments',
    icon: 'M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4',
    isActive: (pathname) => pathname.startsWith('/tournaments') && pathname !== '/tournaments/new',
  },
  {
    to: '/tournaments/new',
    label: 'Create',
    icon: 'M12 5v14M5 12h14',
    isActive: (pathname) => pathname === '/tournaments/new',
  },
]

function Icon({ path }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path d={path} />
    </svg>
  )
}

function ProfileMenu() {
  const navigate = useNavigate()
  const mobile = useAuthStore((state) => state.user?.mobile)
  const [open, setOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined

    const onPointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) setOpen(false)
    }
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const onLogout = async () => {
    setLoggingOut(true)
    await signOut()
    navigate('/', { replace: true })
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Account menu"
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center rounded-full ring-2 ring-transparent transition hover:ring-red-200 focus-visible:ring-red-300"
      >
        <Avatar size="sm" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-gray-200 bg-white p-2 shadow-xl"
        >
          <div className="px-3 py-2.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Signed in as</p>
            <p className="mt-0.5 text-sm font-bold text-gray-900">+91 {mobile}</p>
          </div>

          <div className="border-t border-gray-100 pt-1 sm:hidden">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                role="menuitem"
                onClick={() => setOpen(false)}
                className="block rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-red-50 hover:text-red-600"
              >
                {link.label === 'Create' ? 'Create tournament' : link.label}
              </Link>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-1">
            <button
              type="button"
              role="menuitem"
              onClick={onLogout}
              disabled={loggingOut}
              className="block w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:text-gray-400 disabled:hover:bg-transparent"
            >
              {loggingOut ? 'Logging out…' : 'Log out'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function AppNavbar({ bottomTabs = true }) {
  const { pathname } = useLocation()

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
        <nav aria-label="Main" className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-2.5 sm:px-6">
          <Link to="/home" className="flex items-center gap-2">
            <img src={logo} alt="" className="h-8 w-8 rounded-md" />
            <span className="text-lg font-bold tracking-tight text-gray-900">Sillypoint</span>
          </Link>

          <ul className="ml-4 hidden items-center gap-1 sm:flex">
            {NAV_LINKS.map((link) => {
              const active = link.isActive(pathname)
              const isCreate = link.to === '/tournaments/new'
              return (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    aria-current={active ? 'page' : undefined}
                    className={`flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold transition ${
                      active
                        ? 'bg-red-50 text-red-600'
                        : isCreate
                          ? 'text-red-600 hover:bg-red-50'
                          : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon path={link.icon} />
                    {isCreate ? 'Create tournament' : link.label}
                  </Link>
                </li>
              )
            })}
          </ul>

          <div className="ml-auto">
            <ProfileMenu />
          </div>
        </nav>
      </header>

      {bottomTabs && (
        <nav
          aria-label="Primary"
          className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur sm:hidden"
        >
          <ul className="grid grid-cols-3">
            {NAV_LINKS.map((link) => {
              const active = link.isActive(pathname)
              return (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    aria-current={active ? 'page' : undefined}
                    className={`flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold transition ${
                      active ? 'text-red-600' : 'text-gray-500 active:text-red-600'
                    }`}
                  >
                    <Icon path={link.icon} />
                    {link.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      )}
    </>
  )
}

export default AppNavbar
