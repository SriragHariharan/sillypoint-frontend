import { api } from './api'

export const fetchTournaments = (params, signal) =>
  api.get('/tournaments', { params, signal }).then((response) => response.data)

export const fetchTournamentDetails = (id, signal) =>
  api.get(`/tournaments/${id}`, { signal }).then((response) => response.data.tournament)

export const createTournament = ({
  name,
  description,
  location,
  startDate,
  endDate,
  lastRegistrationDate,
  registrationFee,
  prizeMoney,
  playersPerSide,
  substitutesPerSide,
  logo,
}) => {
  const formData = new FormData()
  formData.append('name', name)
  formData.append('description', description)
  formData.append('location', location)
  formData.append('startDate', startDate)
  formData.append('endDate', endDate)
  formData.append('lastRegistrationDate', lastRegistrationDate)
  formData.append('registrationFee', registrationFee)
  formData.append('prizeMoney', prizeMoney)
  formData.append('playersPerSide', playersPerSide)
  formData.append('substitutesPerSide', substitutesPerSide)
  if (logo) formData.append('logo', logo)

  return api.post('/tournaments', formData).then((response) => response.data)
}

export const fetchTournamentTeams = (id, signal) =>
  api.get(`/tournaments/${id}/teams`, { signal }).then((response) => response.data.teams)

export const addTournamentTeams = (id, teamIds) =>
  api.post(`/tournaments/${id}/teams`, { team_ids: teamIds }).then((response) => response.data.teams)

export const removeTournamentTeam = (id, teamId) => api.delete(`/tournaments/${id}/teams/${teamId}`)
