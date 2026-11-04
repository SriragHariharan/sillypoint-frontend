export const MIN_PLAYERS_PER_SIDE = 5
export const MAX_PLAYERS_PER_SIDE = 11
export const MIN_SUBSTITUTES_PER_SIDE = 0
export const MAX_SUBSTITUTES_PER_SIDE = 4

export const SIDES = ['teamA', 'teamB']

export const squadLimits = (tournament) => {
  const playing = tournament?.playersPerSide ?? MAX_PLAYERS_PER_SIDE
  const substitutes = tournament?.substitutesPerSide ?? MAX_SUBSTITUTES_PER_SIDE
  return { playing, substitutes, total: playing + substitutes }
}

const padTo = (players, size) => Array.from({ length: size }, (_, index) => ({ name: players[index]?.name ?? '' }))

export const squadDefaults = (squads, limits) =>
  Object.fromEntries(
    SIDES.map((side) => [
      side,
      {
        playing: padTo(squads[side].playing, limits.playing),
        substitutes: padTo(squads[side].substitutes, limits.substitutes),
      },
    ]),
  )

const filledPlayers = (players) =>
  players.map((player) => ({ name: player.name.trim() })).filter((player) => player.name)

export const buildSquadPayload = (values) =>
  Object.fromEntries(
    SIDES.map((side) => [
      side,
      { playing: filledPlayers(values[side].playing), substitutes: filledPlayers(values[side].substitutes) },
    ]),
  )

export const filledCount = (side) =>
  [...(side?.playing ?? []), ...(side?.substitutes ?? [])].filter((player) => player.name?.trim()).length

export const savedCount = (squad) => squad.playing.length + squad.substitutes.length

export const isMatchReady = (match, squads) => {
  if (!match?.tossWinnerTeamId || !squads) return false
  const { playing } = squadLimits(match.tournament)
  return SIDES.every((side) => (squads[side]?.playing.length ?? 0) >= playing)
}

export const tossSummary =(match) => {
  if (!match.tossWinnerTeamId) return null
  const winner = match.tossWinnerTeamId === match.teamA.id ? match.teamA : match.teamB
  return `${winner.name} won the toss and chose to ${match.tossDecision === 'bat' ? 'bat' : 'bowl'}.`
}
