import { api } from './api'

const dataOf = (response) => response.data

export const fetchScoring = (signal) => api.get('/scorer/scoring', { signal }).then(dataOf)

export const startInnings = ({ strikerId, nonStrikerId, bowlerId }) =>
  api.post('/scorer/innings/start', { strikerId, nonStrikerId, bowlerId }).then(dataOf)

const change = (inningsNumber, action, payload) =>
  api.post(`/scorer/innings/${inningsNumber}/${action}`, payload).then(dataOf)

export const recordBall = (inningsNumber, payload) => change(inningsNumber, 'deliveries', payload)

export const chooseBatter = (inningsNumber, expectedVersion, playerId) =>
  change(inningsNumber, 'batter', { expectedVersion, playerId })

export const chooseBowler = (inningsNumber, expectedVersion, playerId) =>
  change(inningsNumber, 'bowler', { expectedVersion, playerId })

export const swapBatters = (inningsNumber, expectedVersion) => change(inningsNumber, 'swap-strike', { expectedVersion })

export const retireBatter = (inningsNumber, expectedVersion, playerId, type) =>
  change(inningsNumber, 'retire', { expectedVersion, playerId, type })

export const undoBall = (inningsNumber, expectedVersion) => change(inningsNumber, 'undo', { expectedVersion })

export const endInnings = (inningsNumber, expectedVersion) => change(inningsNumber, 'end', { expectedVersion })

export const fetchScorecard = (matchId, signal) =>
  api.get(`/matches/${matchId}/scorecard`, { signal, skipAuth: true }).then(dataOf)
