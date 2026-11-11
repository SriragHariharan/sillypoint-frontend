// Small pure helpers behind the scorecard's highlights, bars and running totals

export const topScorer = (batting) =>
  batting.reduce((best, line) => (!best || line.runs > best.runs ? line : best), null)

// Most wickets, then fewest runs conceded
export const bestBowler = (bowling) =>
  bowling.reduce(
    (best, line) =>
      !best || line.wickets > best.wickets || (line.wickets === best.wickets && line.runs < best.runs) ? line : best,
    null,
  )

export const boundaryTotals = (batting) => ({
  fours: batting.reduce((sum, line) => sum + line.fours, 0),
  sixes: batting.reduce((sum, line) => sum + line.sixes, 0),
})

// The score after each over: [{ runs, wickets }, ...]
export const runningTotals = (overs) => {
  let runs = 0
  let wickets = 0
  return overs.map((over) => {
    runs += over.runs
    wickets += over.wickets
    return { runs, wickets }
  })
}

// A bar width in percent relative to the biggest value, never invisible
export const barPercent = (value, max) => (max > 0 ? Math.max(Math.round((value / max) * 100), 4) : 4)
