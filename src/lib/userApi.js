import { api } from './api'

export const uploadAvatar = (file) => {
  const formData = new FormData()
  formData.append('avatar', file)
  return api.put('/users/me/avatar', formData).then((response) => response.data)
}

export const removeAvatar = () => api.delete('/users/me/avatar').then((response) => response.data)
