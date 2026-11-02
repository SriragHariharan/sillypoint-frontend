function TournamentLoadError({ onRetry }) {
  return (
    <main className="mx-auto max-w-md px-5 py-20 text-center">
      <h1 className="text-2xl font-extrabold text-gray-900">Couldn&apos;t load this tournament</h1>
      <p className="mt-2 text-sm text-gray-600">Check your connection and try again.</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-6 rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
      >
        Retry
      </button>
    </main>
  )
}

export default TournamentLoadError
