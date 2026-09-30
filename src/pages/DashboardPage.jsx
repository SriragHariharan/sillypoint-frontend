import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppNavbar from '../components/AppNavbar'
import Avatar from '../components/Avatar'
import Footer from '../components/Footer'
import Skeleton from '../components/Skeleton'
import TournamentCard from '../components/TournamentCard'
import TournamentCardSkeleton from '../components/TournamentCardSkeleton'
import { getErrorMessage } from '../lib/api'
import { notifyError } from '../lib/notify'
import { signOut } from '../lib/session'
import { fetchTournaments } from '../lib/tournamentApi'
import { useAuthStore } from '../store/authStore'

const RECENT_COUNT = 6

const isCanceled = (error) => error?.code === 'ERR_CANCELED'

function StatTile({ label, value, loading }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-3.5 text-center sm:p-4">
      {loading ? (
        <Skeleton className="mx-auto h-7 w-8 rounded" />
      ) : (
        <p className="text-2xl font-extrabold text-gray-900">{value}</p>
      )}
      <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
    </div>
  )
}

function DashboardPage() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const [loggingOut, setLoggingOut] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)
  const [data, setData] = useState({ key: null, recent: [], total: 0, live: 0, upcoming: 0, failed: false })

  const userId = user?.id
  const key = `${userId}|${reloadKey}`
  const loading = Boolean(userId) && data.key !== key

  useEffect(() => {
    if (!userId) return undefined

    const controller = new AbortController()
    const request = (params) =>
      fetchTournaments({ organizerId: userId, ...params }, controller.signal)

    Promise.all([
      request({ limit: RECENT_COUNT }),
      request({ status: 'live', limit: 1 }),
      request({ status: 'upcoming', limit: 1 }),
    ])
      .then(([all, live, upcoming]) =>
        setData({
          key,
          recent: all.tournaments,
          total: all.total,
          live: live.total,
          upcoming: upcoming.total,
          failed: false,
        }),
      )
      .catch((error) => {
        if (isCanceled(error)) return
        notifyError(getErrorMessage(error))
        setData({ key, recent: [], total: 0, live: 0, upcoming: 0, failed: true })
      })

    return () => controller.abort()
  }, [userId, key])

  const onLogout = async () => {
    setLoggingOut(true)
    await signOut()
    navigate('/', { replace: true })
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16 text-gray-900 sm:pb-0">
      <AppNavbar />

      <main className="mx-auto max-w-6xl px-5 pb-16 pt-6 sm:px-6 sm:pt-10">
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">Manage your tournaments and account.</p>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <aside className="order-last space-y-4 sm:order-first lg:sticky lg:top-24 lg:self-start">
            <section className="hidden rounded-2xl border border-gray-200 bg-white p-4 sm:block sm:p-5">
              <div className="flex items-center gap-3">
                <Avatar src={user?.avatar} size="lg" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Your profile</p>
                  <p className="mt-1 truncate text-lg font-bold text-gray-900">+91 {user?.mobile}</p>
                  <span className="mt-1.5 inline-flex items-center gap-1 rounded-full border border-red-600 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-red-600">
                    ✓ Verified mobile
                  </span>
                </div>
              </div>

              <p className="mt-4 rounded-xl bg-gray-50 px-3 py-2.5 text-xs text-gray-600">
                You sign in with your mobile number and an OTP. Change your photo from the account menu at the top right; names are coming soon.
              </p>

              <button
                type="button"
                onClick={onLogout}
                disabled={loggingOut}
                className="mt-4 w-full rounded-full border border-red-600 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400 disabled:hover:bg-transparent"
              >
                {loggingOut ? 'Logging out…' : 'Log out'}
              </button>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Coming soon</h2>
              <ul className="mt-3 space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2">🏏 Manage your teams</li>
                <li className="flex items-center gap-2">📋 Fixtures and live scoring</li>
                <li className="flex items-center gap-2">🏆 Standings and stats</li>
              </ul>
            </section>
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
                className="rounded-full bg-red-600 px-6 py-3.5 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 sm:flex-1"
              >
                + Create tournament
              </Link>
              <Link
                to="/tournaments"
                className="rounded-full border border-gray-300 bg-white px-6 py-3.5 text-center text-sm font-semibold text-gray-800 transition hover:border-red-600 hover:text-red-600 sm:flex-1"
              >
                Browse tournaments
              </Link>
            </section>

            <section aria-label="Your tournaments">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Your tournaments</h2>
                {!loading && data.total > RECENT_COUNT && (
                  <span className="text-xs text-gray-500">
                    Showing {RECENT_COUNT} of {data.total}
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
                <div className="mt-3 rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-10 text-center">
                  <p className="font-semibold text-gray-900">Couldn&apos;t load your tournaments</p>
                  <button
                    type="button"
                    onClick={() => setReloadKey((value) => value + 1)}
                    className="mt-4 rounded-full bg-red-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                  >
                    Retry
                  </button>
                </div>
              ) : data.recent.length === 0 ? (
                <div className="mt-3 rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-10 text-center">
                  <p className="font-semibold text-gray-900">You haven&apos;t created a tournament yet</p>
                  <p className="mt-1 text-sm text-gray-600">Set one up in a minute and share it with your teams.</p>
                  <Link
                    to="/tournaments/new"
                    className="mt-4 inline-block rounded-full bg-red-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                  >
                    Create your first tournament
                  </Link>
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
