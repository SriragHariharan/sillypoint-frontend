import { boundaryTotals, bestBowler, topScorer } from '../lib/scorecardStats'

function Cell({ label, value, detail }) {
  return (
    <div className="min-w-0 bg-white p-3 sm:p-4">
      <p className="text-[11px] font-black uppercase tracking-widest text-red-700">{label}</p>
      <p className="mt-1 truncate text-sm font-black text-gray-900 sm:text-base">{value}</p>
      <p className="truncate text-xs font-semibold tabular-nums text-gray-500">{detail}</p>
    </div>
  )
}

// A lower-third style row of the innings' headline numbers
function ScorecardHighlights({ innings }) {
  const top = topScorer(innings.batting)
  const best = bestBowler(innings.bowling)
  const { fours, sixes } = boundaryTotals(innings.batting)
  const { extras } = innings

  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-gray-200 bg-gray-200 shadow-sm sm:grid-cols-4">
      <Cell label="Top scorer" value={top ? top.name : '-'} detail={top ? `${top.runs} (${top.balls})` : 'Yet to score'} />
      <Cell label="Best bowler" value={best ? best.name : '-'} detail={best ? `${best.wickets}/${best.runs} (${best.overs})` : 'Yet to bowl'} />
      <Cell label="Extras" value={String(extras.total)} detail={`b ${extras.byes} lb ${extras.legByes} wd ${extras.wides} nb ${extras.noBalls}`} />
      <Cell label="Boundaries" value={`${fours} fours`} detail={`${sixes} ${sixes === 1 ? 'six' : 'sixes'}`} />
    </div>
  )
}

export default ScorecardHighlights
