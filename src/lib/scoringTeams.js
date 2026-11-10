export const teamById = (match, id) => (match.teamA.id === id ? match.teamA : match.teamB)

export const otherTeam = (match, id) => (match.teamA.id === id ? match.teamB : match.teamA)

export const playersOf = (players, teamId, squad = 'playing') =>
  players.filter((player) => player.teamId === teamId && (!squad || player.squad === squad)).sort((a, b) => a.position - b.position)

export const nextBattingTeam = ({ match, innings, nextInnings }) => {
  const first = innings[0]
  if (nextInnings === 2 && first) return teamById(match, first.bowlingTeamId)
  const winner = teamById(match, match.tossWinnerTeamId)
  return match.tossDecision === 'bat' ? winner : otherTeam(match, winner.id)
}

export const endReasonText = (reason) =>
  ({
    all_out: 'All out',
    overs_complete: 'Overs complete',
    target_reached: 'Target reached',
    ended_by_scorer: 'Innings ended by the scorer',
  })[reason] ?? ''
