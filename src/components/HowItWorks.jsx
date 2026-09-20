const steps = [
  { title: 'Create your tournament', description: 'Set the name, format, overs and dates.' },
  { title: 'Register teams', description: 'Add teams manually or share a registration link.' },
  { title: 'Generate fixtures', description: 'Byes and pairings are handled automatically.' },
  { title: 'Score every ball', description: 'Assign scorers and record deliveries live.' },
  { title: 'Broadcast live scores', description: 'Spectators watch matches update in real time.' },
  { title: 'Crown a champion', description: 'Standings, stats and results, all calculated for you.' },
]

function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-5 py-14 sm:px-6 sm:py-20 bg-gray-50">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl md:text-4xl">
          From kickoff to champion
        </h2>
        <p className="mt-4 text-gray-600">
          The whole tournament lifecycle, in one flow.
        </p>
      </div>

      <ol className="mt-10 grid gap-8 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3">
        {steps.map((step, index) => (
          <li key={step.title} className="flex gap-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-600 text-sm font-bold text-white">
              {index + 1}
            </span>
            <div>
              <h3 className="font-bold text-gray-900">{step.title}</h3>
              <p className="mt-1 text-sm text-gray-600">{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

export default HowItWorks
