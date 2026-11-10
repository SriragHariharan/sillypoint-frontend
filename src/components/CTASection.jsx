const RINGS = [90, 150, 210, 270]

function CTASection() {
  return (
    <section id="get-started" className="scroll-mt-16 bg-gray-950 px-5 pb-16 sm:px-6 sm:pb-24">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-to-br from-red-600 via-red-700 to-red-900 px-6 py-14 text-center shadow-2xl shadow-red-950/60 ring-1 ring-white/15 sm:px-12 sm:py-20">
        <svg
          aria-hidden="true"
          viewBox="0 0 600 600"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2"
        >
          {RINGS.map((radius) => (
            <circle key={radius} cx="300" cy="300" r={radius} fill="none" stroke="#ffffff" strokeOpacity="0.1" strokeWidth="2" />
          ))}
          <circle cx="300" cy="300" r="300" fill="none" stroke="#ffffff" strokeOpacity="0.16" strokeWidth="2" strokeDasharray="2 12" />
        </svg>

        <div className="relative">
          <h2 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
            Ready to run your next tournament properly?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-red-50 sm:text-lg">
            Free to start. No credit card required. Set up your first tournament in minutes.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
            <a
              href="#top"
              className="rounded-full bg-white px-7 py-3 text-center text-sm font-semibold text-red-700 shadow-lg shadow-red-950/30 transition hover:bg-red-50"
            >
              Create a Tournament
            </a>
            <a
              href="#how-it-works"
              className="rounded-full border border-white/50 px-7 py-3 text-center text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
            >
              See how it works
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTASection
