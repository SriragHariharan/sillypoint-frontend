const features = [
  {
    title: 'Automatic fixtures',
    description:
      'Generate Round Robin, Single Elimination or Dynamic Knockout fixtures in one click, with byes handled automatically.',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 3v18M4 8h5m-5 8h5m6-13h5v18h-5m0-18v18"
      />
    ),
  },
  {
    title: 'Dynamic Knockout',
    description:
      'A random-pairing, sudden-death format built for uneven team counts — losers are out, winners advance, byes are handled fairly.',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 4h16v4l-6 5v5l3 2H7l3-2v-5L4 8V4Z"
      />
    ),
  },
  {
    title: 'Ball-by-ball scoring',
    description:
      'A fast, mobile-first scorer interface with one-tap runs, extras and wickets, plus undo and delivery correction.',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 6h16M4 12h16M4 18h7"
      />
    ),
  },
  {
    title: 'Live broadcast',
    description:
      'Every delivery pushes an instant update over WebSocket, so spectators watch the score change without refreshing.',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 18.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM8.5 13a5 5 0 0 1 7 0M5.5 10a9 9 0 0 1 13 0"
      />
    ),
  },
  {
    title: 'Points table & stats',
    description:
      'Standings, net run rate and batting/bowling statistics are calculated automatically as matches complete.',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 20h18M6 20V10m6 10V4m6 16v-7"
      />
    ),
  },
  {
    title: 'Public tournament pages',
    description:
      'Anyone can follow fixtures, live matches, scorecards and standings — no account or login required.',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.5 12h19M12 2.5a15 15 0 0 1 0 19M12 2.5a15 15 0 0 0 0 19M2.5 12a9.5 9.5 0 0 1 19 0"
      />
    ),
  },
]

function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-5 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl md:text-4xl">
          Everything a tournament needs
        </h2>
        <p className="mt-4 text-gray-600">
          From the first team registration to the final champion, one system
          runs the whole lifecycle.
        </p>
      </div>

      <div className="mt-10 grid gap-6 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:border-red-200 hover:shadow-md"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-6 w-6"
                aria-hidden="true"
              >
                {feature.icon}
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-bold text-gray-900">
              {feature.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Features
