import { Trophy } from 'lucide-react'
import Avatar from './Avatar'

function SuperOverLine({ innings, onDark }) {
  if (!innings) return null
  return (
    <span className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${onDark ? 'bg-white/15 text-white' : 'bg-red-50 text-red-700'}`}>
      Super Over {innings.total.runs}/{innings.total.wickets}
      <span className="font-semibold opacity-80">({innings.total.overs} ov)</span>
    </span>
  )
}

function Score({ innings, loading, yetToBat, onDark, dim }) {
  const muted = onDark ? 'text-red-100' : 'text-gray-500'

  if (loading) {
    return (
      <span
        aria-hidden="true"
        className="mt-1 h-8 w-20 animate-pulse rounded-lg bg-white/20 motion-reduce:animate-none"
      />
    )
  }
  if (innings) {
    return (
      <p className={`mt-0.5 ${dim ? 'opacity-75' : ''}`}>
        <span className={`text-2xl font-black sm:text-3xl ${onDark ? 'text-white' : 'text-gray-900'}`}>
          {innings.total.runs}/{innings.total.wickets}
        </span>
        <span className={`block text-xs font-semibold ${muted}`}>({innings.total.overs} ov)</span>
      </p>
    )
  }
  if (yetToBat) return <p className={`mt-0.5 text-sm font-semibold ${muted}`}>Yet to bat</p>
  return null
}

// One side of a match: logo, name and, once scoring has started, its score; the winner is marked
function MatchTeamSide({
  team,
  onDark = false,
  innings = null,
  superOver = null,
  scoreLoading = false,
  yetToBat = false,
  winner = false,
  dim = false,
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-3 text-center">
      {winner && (
        <span className="inline-flex h-5 items-center gap-1 rounded-full bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-400 px-2.5 text-[11px] font-black uppercase tracking-wide text-amber-950 shadow-md shadow-amber-950/30 ring-1 ring-amber-100/60">
          <Trophy className="h-3 w-3" aria-hidden="true" />
          Winner
        </span>
      )}
      {/* Keeps both logos level when the other side carries the Winner chip */}
      {dim && <span className="h-5" aria-hidden="true" />}
      <span className={`inline-flex rounded-2xl ${winner ? 'ring-2 ring-amber-300 ring-offset-2 ring-offset-red-700' : ''}`}>
        <Avatar src={team.logo} name={team.name} size="lg" rounded="rounded-2xl" />
      </span>
      <div className="flex w-full flex-col items-center">
        <span className={`w-full break-words text-base font-black sm:text-lg ${onDark ? 'text-white' : 'text-gray-900'}`}>
          {team.name}
        </span>
        <Score innings={innings} loading={scoreLoading} yetToBat={yetToBat} onDark={onDark} dim={dim} />
        <SuperOverLine innings={superOver} onDark={onDark} />
      </div>
    </div>
  )
}

export default MatchTeamSide
