// The second innings decided the match: it is final (nothing can be scored or undone any more)
export const isMatchCompleted = (match) => Boolean(match?.completedAt)

// Being scored right now: the first innings has started and the result is not final yet
export const isMatchLive = (match) => Boolean(match?.scoringStartedAt) && !match?.completedAt

const plural = (count, word) => `${count} ${word}${count === 1 ? '' : 's'}`

// The regular innings a team batted in, if it has batted yet
export const inningsOfTeam = (scorecard, teamId) =>
  scorecard?.innings?.find((innings) => !innings.isSuperOver && innings.battingTeam.id === teamId) ?? null

// The team's Super Over innings, if the match went to one and it has batted in it
export const superOverOfTeam = (scorecard, teamId) =>
  scorecard?.innings?.find((innings) => innings.isSuperOver && innings.battingTeam.id === teamId) ?? null

// "Indians need 12 runs from 8 balls" while a side is chasing
export const chaseText = (innings) =>
  innings?.chase
    ? `${innings.battingTeam.name} need ${plural(innings.chase.requiredRuns, 'run')} from ${plural(innings.chase.ballsRemaining, 'ball')}`
    : null

// What is happening now: the chase, who is batting, or the break before (or during) a Super Over
export const liveLine = (scorecard) => {
  const innings = scorecard?.innings ?? []
  const current = innings.find((entry) => entry.status !== 'completed')
  if (current) {
    const text = chaseText(current) ?? `${current.battingTeam.name} batting`
    return current.isSuperOver ? `Super Over: ${text}` : text
  }
  if (scorecard?.match?.completedAt) return null
  const last = innings[innings.length - 1]
  if (innings.length === 2) return 'Scores level: Super Over next'
  if (innings.length === 3 && last) {
    return `Super Over: ${last.bowlingTeam.name} need ${plural(last.total.runs + 1, 'run')} to win`
  }
  return null
}

export const winnerOf = (match) => {
  if (!match?.winnerTeamId) return null
  return [match.teamA, match.teamB].find((team) => team.id === match.winnerTeamId) ?? null
}
