import { CalendarDays, ClipboardList, Smartphone } from 'lucide-react'
import { Link } from 'react-router-dom'
import HeroGround from './HeroGround'

const points = [
  { icon: CalendarDays, label: 'Match scheduling' },
  { icon: Smartphone, label: 'Ball-by-ball scoring' },
  { icon: ClipboardList, label: 'Public scorecards' },
]

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-white text-gray-900">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(55% 60% at 12% 18%, rgba(166, 25, 46, 0.1), transparent 70%), radial-gradient(45% 50% at 90% 85%, rgba(166, 25, 46, 0.06), transparent 70%)',
        }}
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 pb-14 pt-28 sm:px-6 sm:pb-20 sm:pt-32 md:grid-cols-[1.05fr_1fr] md:gap-8 md:pb-24 md:pt-36">
        <div>
          <span className="inline-block rounded-full border border-red-200 bg-red-50 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-red-700">
            Cricket tournament management
          </span>
          <h1 className="mt-6 text-5xl font-black leading-[1.02] tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
            Every <span className="text-red-600">ball</span> counts.
          </h1>
          {/* <p className="mt-6 max-w-xl text-base text-gray-600 sm:text-lg">
            Schedule your matches, hand a scorer one link and a PIN, and score every delivery from any phone. Everyone
            else follows the scorecard live.
          </p> */}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
            <a
              href="#get-started"
              className="rounded-full bg-red-600 px-7 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-red-600/25 transition hover:bg-red-700"
            >
              Get Started Free
            </a>
            <Link
              to="/tournaments"
              className="rounded-full border border-gray-300 bg-white px-7 py-3 text-center text-sm font-semibold text-gray-800 transition hover:border-red-600 hover:text-red-600"
            >
              Browse tournaments
            </Link>
          </div>

          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-600">
            {points.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2">
                <Icon className="h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
        </div>

        <HeroGround />
      </div>

      <div className="h-1 bg-gradient-to-r from-red-700 via-red-500 to-red-700" />
    </section>
  )
}

export default Hero
