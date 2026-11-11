import { endReasonText, teamById } from '../lib/scoringTeams'

const plural = (count, word) => `${count} ${word}${count === 1 ? '' : 's'}`

const scoreLine = (match, innings) =>
  `${teamById(match, innings.battingTeamId).name} ${innings.runs}/${innings.wickets} in ${innings.overs} ${
    innings.overs === '1.0' ? 'over' : 'overs'
  }`

// The break before the next innings: the target, or the tie that sends the match to a Super Over
function InningsBreakNote({ match, innings, nextInnings, batting }) {
  const previous = innings[innings.length - 1]
  if (!previous) return null

  const superOverStarts = nextInnings === 3
  const eyebrow = superOverStarts ? 'Scores level' : nextInnings === 4 ? 'Super Over break' : 'Innings break'

  return (
    <div className="mb-5 rounded-2xl border border-red-100 bg-red-50/60 p-4 text-center">
      <p className="text-xs font-semibold uppercase tracking-wider text-red-700">{eyebrow}</p>
      {superOverStarts ? (
        <>
          <p className="mt-1 text-base font-black text-gray-900">Match tied: Super Over</p>
          <ul className="mt-1 space-y-0.5 text-xs text-gray-600">
            {innings.map((entry) => (
              <li key={entry.number}>{scoreLine(match, entry)}</li>
            ))}
          </ul>
          <p className="mt-2 text-sm font-semibold text-red-700">
            1 over, 2 wickets a side. {batting.name} bat first.
          </p>
        </>
      ) : (
        <>
          <p className="mt-1 text-base font-black text-gray-900">{scoreLine(match, previous)}</p>
          <p className="mt-1 text-xs text-gray-500">{endReasonText(previous.endReason)}</p>
          <p className="mt-2 text-sm font-semibold text-red-700">
            {batting.name} need {plural(previous.runs + 1, 'run')} to win{nextInnings === 4 ? ' the Super Over' : ''}
          </p>
        </>
      )}
    </div>
  )
}

export default InningsBreakNote
