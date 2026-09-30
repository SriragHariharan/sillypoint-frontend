import { Link, useLocation } from 'react-router-dom'
import logo from '../assets/app_logo.png'
import { NAV_LINKS } from '../lib/navLinks'
import ProfileMenu from './ProfileMenu'

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
