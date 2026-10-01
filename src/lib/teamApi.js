import { api } from './api'

const toFormData = ({ name, captainName, captainMobile, logo }) => {
  const formData = new FormData()
  formData.append('name', name)
  formData.append('captain_name', captainName)
  formData.append('captain_mobile', captainMobile)
  if (logo) formData.append('logo', logo)
  return formData
}

export const fetchTeams = (signal) => api.get('/teams', { signal }).then((response) => response.data)

export const fetchTeam = (id, signal) => api.get(`/teams/${id}`, { signal }).then((response) => response.data)

export const createTeam = (values) => api.post('/teams', toFormData(values)).then((response) => response.data)

export const updateTeam = (id, values) =>
  api.patch(`/teams/${id}`, toFormData(values)).then((response) => response.data)
