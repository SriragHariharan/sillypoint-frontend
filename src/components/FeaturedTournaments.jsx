import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchTournaments } from '../lib/tournamentApi'
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
    <section id="tournaments" className="bg-gray-50 py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl md:text-4xl">
              Happening on Sillypoint
            </h2>
            <p className="mt-4 text-gray-600">
              Follow live tournaments or find one to join — no account needed to browse.
            </p>
          </div>
          <Link
            to="/tournaments"
            className="text-sm font-semibold text-red-600 transition hover:text-red-700"
          >
            View all tournaments →
          </Link>
        </div>

        <div
          aria-busy={tournaments === null}
          className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
        >
          {tournaments === null
            ? Array.from({ length: FEATURED_COUNT }, (_, index) => <TournamentCardSkeleton key={index} />)
            : tournaments.map((tournament) => <TournamentCard key={tournament.id} tournament={tournament} />)}
        </div>
      </div>
    </section>
  )
}

export default FeaturedTournaments
