import { ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchTournaments } from '../lib/tournamentApi'
import SectionHeading from './SectionHeading'
import TournamentCard from './TournamentCard'
import TournamentCardSkeleton from './TournamentCardSkeleton'

const FEATURED_COUNT = 3

function FeaturedTournaments() {
  const [tournaments, setTournaments] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    const request = (status) =>
      fetchTournaments({ status, limit: FEATURED_COUNT }, controller.signal).then((data) => data.tournaments)

    Promise.all([request('live'), request('upcoming')])
      .then(([live, upcoming]) => setTournaments([...live, ...upcoming].slice(0, FEATURED_COUNT)))
      .catch((error) => {
        if (error?.code !== 'ERR_CANCELED') setTournaments([])
      })

    return () => controller.abort()
  }, [])

  if (tournaments?.length === 0) return null

  return (
    <section id="tournaments" className="relative scroll-mt-16 overflow-hidden bg-gray-950 py-16 sm:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(45% 55% at 92% 0%, rgba(166, 25, 46, 0.2), transparent 70%)' }}
      />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Happening now"
            title={
              <>
                On <span className="text-red-500">Sillypoint</span> right now
              </>
            }
          >
            Follow live tournaments or find one to join. No account needed to browse.
          </SectionHeading>
          <Link
            to="/tournaments"
            className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
          >
            View all tournaments
            <ArrowRight aria-hidden="true" className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div
          aria-busy={tournaments === null}
          className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
        >
          {tournaments === null
            ? Array.from({ length: FEATURED_COUNT }, (_, index) => <TournamentCardSkeleton key={index} dark />)
            : tournaments.map((tournament) => <TournamentCard key={tournament.id} tournament={tournament} dark />)}
        </div>
      </div>
    </section>
  )
}

export default FeaturedTournaments
