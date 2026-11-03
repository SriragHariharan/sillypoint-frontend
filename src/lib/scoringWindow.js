export const isScoringOpen = (scoringOpensAt, serverOffsetMs) =>
  Date.now() + serverOffsetMs >= Date.parse(scoringOpensAt)
