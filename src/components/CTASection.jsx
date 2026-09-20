function CTASection() {
  return (
    <section id="get-started" className="bg-red-600 py-14 sm:py-20">
      <div className="mx-auto max-w-3xl px-5 text-center sm:px-6">
        <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl md:text-4xl">
          Ready to run your next tournament properly?
        </h2>
        <p className="mt-4 text-red-50">
          Free to start. No credit card required. Set up your first
          tournament in minutes.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
          <a
            href="#top"
            className="rounded-full bg-white px-7 py-3 text-center text-sm font-semibold text-red-600 shadow-sm transition hover:bg-red-50"
          >
            Create a Tournament
          </a>
          <a
            href="#features"
            className="rounded-full border border-white/70 px-7 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Explore Features
          </a>
        </div>
      </div>
    </section>
  )
}

export default CTASection
