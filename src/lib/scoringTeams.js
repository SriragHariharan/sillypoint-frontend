export const teamById = (match, id) => (match.teamA.id === id ? match.teamA : match.teamB)

export const otherTeam = (match, id) => (match.teamA.id === id ? match.teamB : match.teamA)

export const playersOf = (players, teamId, squad = 'playing') =>
  players.filter((player) => player.teamId === teamId && (!squad || player.squad === squad)).sort((a, b) => a.position - b.position)

// Who bats next: the toss decides the first innings, the side that batted second opens the Super Over (innings 3),
// and otherwise the sides swap
export const nextBattingTeam = ({ match, innings, nextInnings }) => {
  const previous = innings[innings.length - 1]
  if (nextInnings === 3 && previous) return teamById(match, previous.battingTeamId)
  if (nextInnings > 1 && previous) return teamById(match, previous.bowlingTeamId)
  const winner = teamById(match, match.tossWinnerTeamId)
  return match.tossDecision === 'bat' ? winner : otherTeam(match, winner.id)
}

export const isSuperOverNumber = (number) => number > 2

export const inningsLabel = (number) =>
  ({ 1: '1st innings', 2: '2nd innings', 3: 'Super Over · 1st innings', 4: 'Super Over · 2nd innings' })[number] ?? ''

// How a win was decided when the regular innings did not decide it
export const decidedByText = (decidedBy) =>
  ({ super_over: 'Won the Super Over', boundary_count: 'Won on boundary count' })[decidedBy] ?? null

export const endReasonText = (reason) =>
  ({
    all_out: 'All out',
    overs_complete: 'Overs complete',
    target_reached: 'Target reached',
    ended_by_scorer: 'Innings ended by the scorer',
  })[reason] ?? ''
