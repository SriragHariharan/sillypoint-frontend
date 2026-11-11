import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import logo from '../assets/app_logo.png'
import { eyebrowClass, headingClass, redGlow } from '../lib/premiumStyles'

const GLOW = `${redGlow('55% 60%', '12% 18%', 0.1)}, ${redGlow('45% 50%', '90% 85%', 0.06)}`

function AuthLayout({ eyebrow, title, subtitle, children }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white px-5 py-10 sm:px-6">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: GLOW }} />
      <svg
        aria-hidden="true"
        viewBox="0 0 600 600"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[44rem] w-[44rem] -translate-x-1/2 -translate-y-1/2"
      >
        <g className="origin-center animate-orbit motion-reduce:animate-none [transform-box:fill-box]">
          <circle cx="300" cy="300" r="298" fill="none" stroke="#9ca3af" strokeOpacity="0.5" strokeWidth="2" strokeDasharray="2 12" />
        </g>
        <circle cx="300" cy="300" r="220" fill="none" stroke="#9ca3af" strokeOpacity="0.3" strokeWidth="1.5" strokeDasharray="6 8" />
      </svg>

      <Link to="/" className="relative mb-8 flex items-center gap-2">
        <img src={logo} alt="Sillypoint" className="h-9 w-9 rounded-md" />
        <span className="text-lg font-bold tracking-tight text-gray-900">Sillypoint</span>
      </Link>

      <div className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-gray-200 bg-white/90 shadow-xl shadow-red-600/10 backdrop-blur sm:max-w-md">
        <div className="h-1 bg-gradient-to-r from-red-700 via-red-500 to-red-700" />
        <div className="p-6 sm:p-8">
          {eyebrow && <span className={eyebrowClass}>{eyebrow}</span>}
          <h1 className={`${eyebrow ? 'mt-4' : ''} text-2xl sm:text-3xl ${headingClass}`}>{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-gray-600">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>
      </div>

      <Link
        to="/"
        className="relative mt-6 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-red-50 hover:text-red-600"
      >
        <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
        Back to home
      </Link>
    </div>
  )
}

export default AuthLayout
