import { Plus, Trophy } from 'lucide-react'
import { Link } from 'react-router-dom'
import AppNavbar from '../components/AppNavbar'
import ComingSoonCard from '../components/ComingSoonCard'
import EmptyState from '../components/EmptyState'
import Footer from '../components/Footer'
import PageHeader from '../components/PageHeader'
import ProfileCard from '../components/ProfileCard'
import RetryPanel from '../components/RetryPanel'
import StatTile from '../components/StatTile'
import TournamentCard from '../components/TournamentCard'
import TournamentCardSkeleton from '../components/TournamentCardSkeleton'
import { RECENT_COUNT, useDashboardStats } from '../hooks/useDashboardStats'
import { primaryButtonClass, secondaryButtonClass } from '../lib/premiumStyles'
import { useAuthStore } from '../store/authStore'

function DashboardPage() {
  const user = useAuthStore((state) => state.user)
  const { data, loading, retry } = useDashboardStats(user?.id)

  return (
    <div className="min-h-screen bg-gray-50 pb-16 text-gray-900 sm:pb-0">
      <AppNavbar />

      <main className="mx-auto max-w-6xl px-5 pb-16 pt-6 sm:px-6 sm:pt-10">
        <PageHeader
          eyebrow="Your workspace"
          title={
            <>
              Your <span className="text-red-600">dashboard</span>
            </>
          }
          subtitle="Manage your tournaments and account."
        />

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <aside className="order-last space-y-4 sm:order-first lg:sticky lg:top-24 lg:self-start">
            <ProfileCard user={user} />
            <ComingSoonCard />
          </aside>

          <div className="space-y-6 lg:col-span-2">
            <section aria-label="Your tournament stats">
              <div className="grid grid-cols-3 gap-3">
                <StatTile label="Organized" value={data.total} loading={loading} />
                <StatTile label="Live" value={data.live} loading={loading} />
                <StatTile label="Upcoming" value={data.upcoming} loading={loading} />
              </div>
            </section>

            <section aria-label="Quick actions" className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/tournaments/new"
                className={`inline-flex items-center justify-center gap-2 px-6 sm:flex-1 ${primaryButtonClass}`}
              >
                <Plus className="h-4 w-4 shrink-0" aria-hidden="true" />
                Create tournament
              </Link>
              <Link to="/tournaments" className={`px-6 text-center sm:flex-1 ${secondaryButtonClass}`}>
                Browse tournaments
              </Link>
            </section>

            <section aria-label="Your tournaments">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black tracking-tight">Your tournaments</h2>
                {!loading && data.total > 0 && (
                  <span className="flex items-center gap-3 text-xs text-gray-500">
                    {data.total > RECENT_COUNT && (
                      <span>
                        Showing {RECENT_COUNT} of {data.total}
                      </span>
                    )}
                    <Link to="/my-tournaments" className="text-sm font-semibold text-red-600 transition hover:text-red-700">
                      View all
                    </Link>
                  </span>
                )}
              </div>

              {loading ? (
                <div aria-busy="true" className="mt-3 grid gap-4 sm:grid-cols-2">
                  <span className="sr-only">Loading your tournaments…</span>
                  {Array.from({ length: 2 }, (_, index) => (
                    <TournamentCardSkeleton key={index} />
                  ))}
                </div>
              ) : data.failed ? (
                <div className="mt-3">
                  <RetryPanel message="Couldn't load your tournaments" onRetry={retry} />
                </div>
              ) : data.recent.length === 0 ? (
                <div className="mt-3">
                  <EmptyState
                    icon={Trophy}
                    title="You haven't created a tournament yet"
                    action={
                      <Link to="/tournaments/new" className={`inline-block px-6 ${primaryButtonClass}`}>
                        Create your first tournament
                      </Link>
                    }
                  >
                    Set one up in a minute and share it with your teams.
                  </EmptyState>
                </div>
              ) : (
                <div className="mt-3 grid gap-4 sm:grid-cols-2">
                  {data.recent.map((tournament) => (
                    <TournamentCard key={tournament.id} tournament={tournament} />
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default DashboardPage
