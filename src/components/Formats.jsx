const formats = [
  {
    name: 'Round Robin',
    description: 'Every team plays every other team. Ideal for smaller, fair leagues.',
  },
  {
    name: 'Single Elimination',
    description: 'Classic knockout bracket, with byes auto-generated for uneven team counts.',
  },
  {
    name: 'Dynamic Knockout',
    description: 'Random pairing each round, sudden-death matches — built for large, flexible tournaments.',
    highlight: true,
  },
  {
    name: 'Group + Knockout',
    description: 'Group stage standings feed straight into a knockout bracket.',
  },
]

function Formats() {
  return (
    <section id="formats" className="bg-gray-50 py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl md:text-4xl">
            Built for however your tournament runs
          </h2>
          <p className="mt-4 text-gray-600">
            Pick a format when you create the tournament — Sillypoint handles
            the pairing, byes and bracket logic for you.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:mt-12 sm:grid-cols-2 lg:grid-cols-4">
          {formats.map((format) => (
            <div
              key={format.name}
              className={`rounded-2xl border p-6 ${
                format.highlight
                  ? 'border-red-600 bg-white shadow-md'
                  : 'border-gray-200 bg-white'
              }`}
            >
              {format.highlight && (
                <span className="mb-3 inline-block rounded-full bg-red-600 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                  Popular
                </span>
              )}
              <h3 className="text-base font-bold text-gray-900">
                {format.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {format.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Formats
