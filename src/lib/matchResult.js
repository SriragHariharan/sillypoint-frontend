// The second innings decided the match: it is final (nothing can be scored or undone any more)
export const isMatchCompleted = (match) => Boolean(match?.completedAt)

export const winnerOf = (match) => {
  if (!match?.winnerTeamId) return null
  return [match.teamA, match.teamB].find((team) => team.id === match.winnerTeamId) ?? null
}
