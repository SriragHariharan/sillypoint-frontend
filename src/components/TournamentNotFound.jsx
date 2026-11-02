import { Link } from 'react-router-dom'

function TournamentNotFound() {
  return (
    <main className="mx-auto max-w-md px-5 py-20 text-center">
      <h1 className="text-2xl font-extrabold text-gray-900">Tournament not found</h1>
      <p className="mt-2 text-sm text-gray-600">It may have been removed or the link is wrong.</p>
      <Link
        to="/tournaments"
        className="mt-6 inline-block rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
      >
        Browse tournaments
      </Link>
    </main>
  )
}

export default TournamentNotFound
