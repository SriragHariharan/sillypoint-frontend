import { CircleDot, Crown, Radio, Shuffle, Trophy, Users } from 'lucide-react'
import SectionHeading from './SectionHeading'

const steps = [
  { icon: Trophy, title: 'Create your tournament', description: 'Set the name, format, overs and dates.' },
  { icon: Users, title: 'Register teams', description: 'Add teams manually or share a registration link.' },
  { icon: Shuffle, title: 'Generate fixtures', description: 'Byes and pairings are handled automatically.' },
  { icon: CircleDot, title: 'Score every ball', description: 'Assign scorers and record deliveries live.' },
  { icon: Radio, title: 'Broadcast live scores', description: 'Spectators watch matches update in real time.' },
  { icon: Crown, title: 'Crown a champion', description: 'Standings, stats and results, all calculated for you.' },
]

function HowItWorks() {
  return (
    <section id="how-it-works" className="relative scroll-mt-16 overflow-hidden border-t border-white/10 bg-gray-950 py-16 sm:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(55% 45% at 50% 55%, rgba(166, 25, 46, 0.2), transparent 70%)' }}
      />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
        <SectionHeading
          center
          eyebrow="How it works"
          title={
            <>
              From kickoff to <span className="text-red-500">champion</span>
            </>
          }
        >
          The whole tournament lifecycle, in one flow.
        </SectionHeading>

        <ol className="mt-12 grid gap-4 sm:mt-16 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {steps.map(({ icon: Icon, title, description }, index) => (
            <li
              key={title}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur transition hover:-translate-y-0.5 hover:border-red-500/60 hover:bg-white/[0.07]"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-1 -top-3 text-7xl font-black tabular-nums text-white/[0.06]"
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-red-400">
                <Icon aria-hidden="true" className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-lg font-bold text-white">{title}</h3>
              <p className="mt-1.5 text-sm text-gray-300">{description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export default HowItWorks
