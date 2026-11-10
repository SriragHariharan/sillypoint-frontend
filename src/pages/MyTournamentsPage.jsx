import { Link } from 'react-router-dom'
import AppNavbar from '../components/AppNavbar'
import Footer from '../components/Footer'
import TournamentList from '../components/TournamentList'
import { useTournamentList } from '../hooks/useTournamentList'
import { useAuthStore } from '../store/authStore'

function MyTournamentsPage() {
  const userId = useAuthStore((state) => state.user?.id)
  const list = useTournamentList({ organizerId: userId })

  return (
    <div className="min-h-screen bg-white pb-16 text-gray-900 sm:pb-0">
      <AppNavbar />

      <main className="mx-auto max-w-6xl px-5 pb-16 pt-6 sm:px-6 sm:pt-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">My tournaments</h1>
            <p className="mt-1 text-sm text-gray-600">Every tournament you created, including past and cancelled ones.</p>
          </div>
          <Link
            to="/tournaments/new"
            className="shrink-0 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
          >
            + Create
          </Link>
        </div>

        <TournamentList
          list={list}
          emptyTitle="You haven't created a tournament yet"
          emptyText="Set one up in a minute and share it with your teams."
          emptyAction={
            <Link
              to="/tournaments/new"
              className="mt-4 inline-block rounded-full bg-red-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Create your first tournament
            </Link>
          }
        />
      </main>

      <Footer />
    </div>
  )
}

export default MyTournamentsPage
