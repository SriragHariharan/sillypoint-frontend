import { api } from './api'

export const fetchTournaments = (params, signal) =>
  api.get('/tournaments', { params, signal }).then((response) => response.data)

export const fetchTournamentDetails = (id, signal) =>
  api.get(`/tournaments/${id}`, { signal }).then((response) => response.data.tournament)

export const createTournament = ({ name, description, location, startDate, endDate, logo }) => {
  const formData = new FormData()
  formData.append('name', name)
  formData.append('description', description)
  formData.append('location', location)
  formData.append('startDate', startDate)
  formData.append('endDate', endDate)
  if (logo) formData.append('logo', logo)

  return api.post('/tournaments', formData).then((response) => response.data)
}

export const fetchTournamentTeams = (id, signal) =>
  api.get(`/tournaments/${id}/teams`, { signal }).then((response) => response.data.teams)

export const addTournamentTeams = (id, teamIds) =>
  api.post(`/tournaments/${id}/teams`, { team_ids: teamIds }).then((response) => response.data.teams)

export const removeTournamentTeam = (id, teamId) => api.delete(`/tournaments/${id}/teams/${teamId}`)

export const cancelTournament = (id) => api.post(`/tournaments/${id}/cancel`).then((response) => response.data.tournament)

export const rescheduleTournament = (id, { startDate, endDate }) =>
  api.patch(`/tournaments/${id}/reschedule`, { startDate, endDate }).then((response) => response.data.tournament)
