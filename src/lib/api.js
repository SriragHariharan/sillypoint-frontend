import axios from 'axios'
import { useAuthStore } from '../store/authStore'
import { notifyError } from './notify'
import { clearSessionFlag } from './sessionFlag'

const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'
const timeout = 15000

const AUTH_PATHS = ['/auth/request-otp', '/auth/verify-otp', '/auth/resend-otp', '/auth/refresh', '/auth/logout']

export const api = axios.create({ baseURL, timeout, withCredentials: true })

let refreshPromise = null

export const refreshAccessToken = () => {
  refreshPromise ??= axios
    .post(`${baseURL}/auth/refresh`, null, { timeout, withCredentials: true })
    .then((response) => {
      useAuthStore.getState().setAccessToken(response.data.accessToken)
      return response.data.accessToken
    })
    .finally(() => {
      refreshPromise = null
    })

  return refreshPromise
}

api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState()
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    const isAuthCall = AUTH_PATHS.some((path) => original?.url?.includes(path))

    if (error.response?.status !== 401 || !original || original._retried || isAuthCall) {
      return Promise.reject(error)
    }

    original._retried = true

    try {
      await refreshAccessToken()
    } catch {
      useAuthStore.getState().clearSession()
      clearSessionFlag()
      notifyError('Your session has expired. Please log in again.')
      return Promise.reject(error)
    }

    return api(original)
  },
)

export const getErrorMessage = (error) => {
  if (error.response?.data?.message) return error.response.data.message
  if (error.request) return "Can't reach the server. Check your connection and try again."
  return 'Something went wrong. Please try again.'
}
