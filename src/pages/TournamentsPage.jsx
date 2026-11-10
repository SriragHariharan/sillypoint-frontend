import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import TournamentList from '../components/TournamentList'
import { useTournamentList } from '../hooks/useTournamentList'

function TournamentsPage() {
  const list = useTournamentList()

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />

      <main className="mx-auto max-w-6xl px-5 pb-16 pt-6 sm:px-6 sm:pt-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Tournaments</h1>
            <p className="mt-1 text-sm text-gray-600">Browse live, upcoming and past cricket tournaments.</p>
          </div>
          <Link
            to="/tournaments/new"
            className="shrink-0 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
          >
            + Create
          </Link>
        </div>

        <TournamentList list={list} emptyTitle="No tournaments yet" emptyText="Be the first to create one." />
      </main>

      <Footer />
    </div>
  )
}

export default TournamentsPage
