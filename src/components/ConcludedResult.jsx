import { Trophy } from 'lucide-react'
import { Link } from 'react-router-dom'
import { winnerOf } from '../lib/matchResult'
import { cardClass, iconTileClass, secondaryButtonClass } from '../lib/premiumStyles'
import Avatar from './Avatar'
import DecidedByChip from './DecidedByChip'

function ConcludedResult({ match }) {
  const winner = winnerOf(match)

  return (
    <section className={`${cardClass} mt-5 p-5 text-center`}>
      <span className={`${iconTileClass} mx-auto`}>
        <Trophy className="h-5 w-5" aria-hidden="true" />
      </span>
      <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-red-700">Match completed</p>

      {winner ? (
        <div className="mt-3 flex items-center justify-center gap-3">
          <Avatar src={winner.logo} name={winner.name} rounded="rounded-xl" />
          <p className="min-w-0 break-words text-left text-lg font-black leading-tight text-gray-900">{winner.name} won</p>
        </div>
      ) : (
        <p className="mt-3 text-lg font-black text-gray-900">Match tied</p>
      )}

      {match.resultSummary && <p className="mt-2 text-sm font-semibold text-gray-700">{match.resultSummary}</p>}
      {match.decidedBy && <DecidedByChip decidedBy={match.decidedBy} className="mt-3" />}

      <Link to={`/matches/${match.id}`} className={`mt-5 inline-block px-6 ${secondaryButtonClass}`}>
        View scorecard
      </Link>
    </section>
  )
}

export default ConcludedResult
