import { Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import PageHeader from '../components/PageHeader'
import TournamentList from '../components/TournamentList'
import { useTournamentList } from '../hooks/useTournamentList'
import { primaryButtonClass } from '../lib/premiumStyles'

function TournamentsPage() {
  const list = useTournamentList()

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />

      <main className="mx-auto max-w-6xl px-5 pb-16 pt-6 sm:px-6 sm:pt-10">
        <PageHeader
          eyebrow="Discover"
          title={
            <>
              Cricket <span className="text-red-600">tournaments</span>
            </>
          }
          subtitle="Browse live, upcoming and past cricket tournaments."
          action={
            <Link to="/tournaments/new" className={`inline-flex items-center gap-2 px-5 ${primaryButtonClass}`}>
              <Plus className="h-4 w-4 shrink-0" aria-hidden="true" />
              Create
            </Link>
          }
        />

        <TournamentList list={list} emptyTitle="No tournaments yet" emptyText="Be the first to create one." />
      </main>

      <Footer />
    </div>
  )
}

export default TournamentsPage
