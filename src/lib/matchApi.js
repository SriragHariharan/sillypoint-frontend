import { api } from './api'

export const fetchTournamentMatches = (id, signal) =>
  api.get(`/tournaments/${id}/matches`, { signal }).then((response) => response.data.matches)

export const fetchMatchDetails = (id, signal) =>
  api.get(`/matches/${id}`, { signal }).then((response) => response.data.match)

export const rescheduleMatch = (id, { matchDate, matchTime }) =>
  api.patch(`/matches/${id}/reschedule`, { matchDate, matchTime }).then((response) => response.data.match)

export const createTournamentMatch = (id, { teamAId, teamBId, matchDate, matchTime, stage, notes }) =>
  api
    .post(`/tournaments/${id}/matches`, { teamAId, teamBId, matchDate, matchTime, stage, notes })
    .then((response) => response.data.match)
