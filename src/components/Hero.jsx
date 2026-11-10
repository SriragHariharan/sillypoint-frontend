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
    <section id="top" className="relative overflow-hidden bg-gray-950 text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(55% 60% at 12% 18%, rgba(166, 25, 46, 0.28), transparent 70%)' }}
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 py-14 sm:px-6 sm:py-20 md:grid-cols-[1.05fr_1fr] md:gap-8 md:py-24">
        <div>
          <span className="inline-block rounded-full border border-white/15 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-red-200">
            Cricket tournament management
          </span>
          <h1 className="mt-6 text-5xl font-black leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
            Every <span className="text-red-500">ball</span> counts.
          </h1>
          {/* <p className="mt-6 max-w-xl text-base text-gray-300 sm:text-lg">
            Schedule your matches, hand a scorer one link and a PIN, and score every delivery from any phone. Everyone
            else follows the scorecard live.
          </p> */}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
            <a
              href="#get-started"
              className="rounded-full bg-red-600 px-7 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-red-900/40 transition hover:bg-red-500"
            >
              Get Started Free
            </a>
            <Link
              to="/tournaments"
              className="rounded-full border border-white/25 px-7 py-3 text-center text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
            >
              Browse tournaments
            </Link>
          </div>

          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-300">
            {points.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2">
                <Icon className="h-4 w-4 shrink-0 text-red-400" aria-hidden="true" />
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
