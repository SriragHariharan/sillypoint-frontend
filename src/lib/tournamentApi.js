import { api } from './api'

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
