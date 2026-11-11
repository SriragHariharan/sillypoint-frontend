import { Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import AppNavbar from '../components/AppNavbar'
import Footer from '../components/Footer'
import PageHeader from '../components/PageHeader'
import TournamentList from '../components/TournamentList'
import { useTournamentList } from '../hooks/useTournamentList'
import { primaryButtonClass } from '../lib/premiumStyles'
import { useAuthStore } from '../store/authStore'

function MyTournamentsPage() {
  const userId = useAuthStore((state) => state.user?.id)
  const list = useTournamentList({ organizerId: userId })

  return (
    <div className="min-h-screen bg-white pb-16 text-gray-900 sm:pb-0">
      <AppNavbar />

      <main className="mx-auto max-w-6xl px-5 pb-16 pt-6 sm:px-6 sm:pt-10">
        <PageHeader
          eyebrow="Organizer"
          title={
            <>
              My <span className="text-red-600">tournaments</span>
            </>
          }
          subtitle="Every tournament you created, including past ones."
          action={
            <Link to="/tournaments/new" className={`inline-flex items-center gap-2 px-5 ${primaryButtonClass}`}>
              <Plus className="h-4 w-4 shrink-0" aria-hidden="true" />
              Create
            </Link>
          }
        />

        <TournamentList
          list={list}
          emptyTitle="You haven't created a tournament yet"
          emptyText="Set one up in a minute and share it with your teams."
          emptyAction={
            <Link to="/tournaments/new" className={`inline-block px-6 ${primaryButtonClass}`}>
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
