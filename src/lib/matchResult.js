// The second innings decided the match: it is final (nothing can be scored or undone any more)
export const isMatchCompleted = (match) => Boolean(match?.completedAt)

// Being scored right now: the first innings has started and the result is not final yet
export const isMatchLive = (match) => Boolean(match?.scoringStartedAt) && !match?.completedAt

const plural = (count, word) => `${count} ${word}${count === 1 ? '' : 's'}`

// The innings a team batted in, if it has batted yet
export const inningsOfTeam = (scorecard, teamId) =>
  scorecard?.innings?.find((innings) => innings.battingTeam.id === teamId) ?? null

// "Indians need 12 runs from 8 balls" while a side is chasing
export const chaseText = (innings) =>
  innings?.chase
    ? `${innings.battingTeam.name} need ${plural(innings.chase.requiredRuns, 'run')} from ${plural(innings.chase.ballsRemaining, 'ball')}`
    : null

// What is happening now: the chase, or who is batting in the first innings
export const liveLine = (scorecard) => {
  const current = scorecard?.innings?.find((innings) => innings.status !== 'completed')
  if (!current) return null
  return chaseText(current) ?? `${current.battingTeam.name} batting`
}

export const winnerOf = (match) => {
  if (!match?.winnerTeamId) return null
  return [match.teamA, match.teamB].find((team) => team.id === match.winnerTeamId) ?? null
}
