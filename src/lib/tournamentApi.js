import { api } from './api'
import tournaments from '../data/tournaments.json'
import tournamentDetails from '../data/tournamentDetails.json'

export const fetchTournaments = () => Promise.resolve(tournaments)

export const fetchTournamentDetails = (id) => {
  const summary = tournaments.find((tournament) => tournament.id === id)
  const details = tournamentDetails[id]
  return Promise.resolve(summary && details ? { ...summary, ...details } : null)
}

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
