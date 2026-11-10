export const MIN_OVERS_PER_SIDE = 1
export const MAX_OVERS_PER_SIDE = 50

export const oversSummary = (match) =>
  match.oversPerSide ? `${match.oversPerSide} ${match.oversPerSide === 1 ? 'over' : 'overs'} per side` : null
