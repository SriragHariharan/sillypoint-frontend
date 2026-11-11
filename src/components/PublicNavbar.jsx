import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import logo from '../assets/app_logo.png'
import { useAuthStore } from '../store/authStore'

const links = [
  { label: 'Tournaments', to: '/tournaments' },
  { label: 'How it works', href: '/#how-it-works' },
]

const lightText = {
  brand: 'text-gray-900',
  link: 'text-gray-700 hover:bg-red-50 hover:text-red-600',
  active: 'bg-red-50 text-red-600',
  login: 'text-gray-700 hover:text-red-600',
  toggle: 'text-gray-700 hover:bg-gray-100',
  outline: 'border-gray-300 text-gray-800 hover:border-red-600 hover:text-red-600',
}

const THEMES = {
  solid: {
    ...lightText,
    header: 'sticky top-0 border-b border-gray-100 bg-white/90 backdrop-blur',
    panel: 'border-t border-gray-100 bg-white',
  },
  glass: {
    ...lightText,
    header: 'fixed inset-x-0 top-0 border-b border-gray-200/70 bg-white/70 backdrop-blur-xl',
    panel: 'border-t border-gray-200/70 bg-white/90 backdrop-blur-xl',
  },
}

function NavItem({ link, active, className, onClick, theme }) {
  const classes = `${className} ${active ? theme.active : theme.link}`

  if (link.to) {
    return (
      <Link to={link.to} onClick={onClick} aria-current={active ? 'page' : undefined} className={classes}>
        {link.label}
      </Link>
    )
  }
  return (
    <a href={link.href} onClick={onClick} className={classes}>
      {link.label}
    </a>
  )
}

// With `glass` the bar floats over the page as frosted glass
function PublicNavbar({ glass = false }) {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const authenticated = useAuthStore((state) => state.status === 'authenticated')

  const theme = THEMES[glass ? 'glass' : 'solid']
  const isActive = (link) => Boolean(link.to) && pathname.startsWith(link.to)
  const close = () => setOpen(false)

  return (
    <header className={`z-50 transition-colors duration-300 ${theme.header}`}>
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-6"
      >
        <a href="/#top" className="flex items-center gap-2">
          <img src={logo} alt="" className="h-8 w-8 rounded-md" />
          <span className={`text-lg font-bold tracking-tight transition-colors ${theme.brand}`}>Sillypoint</span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <li key={link.label}>
              <NavItem
                link={link}
                active={isActive(link)}
                theme={theme}
                className="rounded-full px-3.5 py-2 text-sm font-medium transition"
              />
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          {authenticated ? (
            <Link
              to="/home"
              className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 sm:px-5"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className={`hidden rounded-full px-4 py-2 text-sm font-semibold transition md:block ${theme.login}`}
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="hidden rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 md:block"
              >
                Get Started
              </Link>
            </>
          )}

          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="public-mobile-menu"
            className={`flex h-10 w-10 items-center justify-center rounded-full transition md:hidden ${theme.toggle}`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="h-5 w-5"
            >
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div id="public-mobile-menu" className={`px-5 pb-5 pt-3 md:hidden ${theme.panel}`}>
          <ul className="space-y-1">
            {links.map((link) => (
              <li key={link.label}>
                <NavItem
                  link={link}
                  active={isActive(link)}
                  theme={theme}
                  className="block rounded-xl px-3 py-3 text-base font-medium transition"
                  onClick={close}
                />
              </li>
            ))}
          </ul>

          {!authenticated && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Link
                to="/login"
                onClick={close}
                className={`rounded-full border py-3 text-center text-sm font-semibold transition ${theme.outline}`}
              >
                Log in
              </Link>
              <Link
                to="/signup"
                onClick={close}
                className="rounded-full bg-red-600 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}

export default PublicNavbar
