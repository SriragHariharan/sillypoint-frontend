export const PLAYING_XI_SIZE = 11
export const SUBSTITUTES_SIZE = 4
export const SQUAD_SIZE = PLAYING_XI_SIZE + SUBSTITUTES_SIZE

export const SIDES = ['teamA', 'teamB']

const padTo = (players, size) => Array.from({ length: size }, (_, index) => ({ name: players[index]?.name ?? '' }))

export const squadDefaults = (squads) =>
  Object.fromEntries(
    SIDES.map((side) => [
      side,
      {
        playing: padTo(squads[side].playing, PLAYING_XI_SIZE),
        substitutes: padTo(squads[side].substitutes, SUBSTITUTES_SIZE),
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

export const tossSummary = (match) => {
  if (!match.tossWinnerTeamId) return null
  const winner = match.tossWinnerTeamId === match.teamA.id ? match.teamA : match.teamB
  return `${winner.name} won the toss and chose to ${match.tossDecision === 'bat' ? 'bat' : 'bowl'}.`
}
