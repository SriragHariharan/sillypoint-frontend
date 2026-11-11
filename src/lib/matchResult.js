export const isConcluded = (match) => Boolean(match?.concludedAt)

export const winnerOf = (match) => {
  if (!match?.winnerTeamId) return null
  return [match.teamA, match.teamB].find((team) => team.id === match.winnerTeamId) ?? null
}
