const bracketRounds = [
  { label: 'R1', team: 'Tigers', detail: 'beat Warriors' },
  { label: 'R2', team: 'Tigers', detail: 'beat Kings' },
]

function Hero() {
  return (
    <section
      id="top"
      className="mx-auto max-w-6xl px-5 pt-10 pb-14 sm:px-6 sm:pt-16 sm:pb-20 md:pt-24 md:pb-28"
    >
      <div className="grid items-center gap-10 md:grid-cols-2 md:gap-12">
        <div>
          <span className="inline-block rounded-full bg-red-50 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-red-600">
            Cricket tournament management
          </span>
          <h1 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
            Run your cricket tournament without the WhatsApp chaos.
          </h1>
          <p className="mt-5 max-w-xl text-base text-gray-600 sm:text-lg">
            Sillypoint replaces spreadsheets, paper scorebooks and endless
            group messages with one platform for fixtures, ball-by-ball
            scoring, live broadcasts and standings — built for local,
            college, corporate and club cricket.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
            <a
              href="#get-started"
              className="rounded-full bg-red-600 px-7 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
            >
              Get Started Free
            </a>
            <a
              href="#how-it-works"
              className="rounded-full border border-gray-300 px-7 py-3 text-center text-sm font-semibold text-gray-800 transition hover:border-red-600 hover:text-red-600"
            >
              See how it works
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wide text-red-600">
                Dynamic Knockout
              </span>
              <span className="text-xs font-medium text-gray-400">
                20 teams → 1 champion
              </span>
            </div>

            <div className="mt-5 space-y-3">
              {bracketRounds.map((round, index) => (
                <div key={round.label}>
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-50 text-xs font-bold text-red-600">
                      {round.label}
                    </span>
                    <div className="flex flex-1 items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm">
                      <span className="font-semibold text-gray-900">
                        {round.team}
                      </span>
                      <span className="text-gray-400">{round.detail}</span>
                    </div>
                  </div>
                  {index < bracketRounds.length && (
                    <div className="ml-3.5 h-4 w-px bg-gray-200" />
                  )}
                </div>
              ))}

              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-600 text-sm text-white">
                  🏆
                </span>
                <div className="flex-1 rounded-lg bg-red-600 px-3 py-2 text-sm font-bold text-white">
                  Tigers are Champions
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-5 -right-5 -z-10 h-full w-full rounded-2xl bg-red-100 md:-bottom-6 md:-right-6" />
        </div>
      </div>
    </section>
  )
}

export default Hero
