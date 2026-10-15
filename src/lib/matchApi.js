import { api } from './api'

export const fetchTournamentMatches = (id, signal) =>
  api.get(`/tournaments/${id}/matches`, { signal }).then((response) => response.data.matches)

export const createTournamentMatch = (id, { teamAId, teamBId, matchDate, matchTime, stage, notes }) =>
  api
    .post(`/tournaments/${id}/matches`, { teamAId, teamBId, matchDate, matchTime, stage, notes })
    .then((response) => response.data.match)
