import { api, refreshAccessToken } from './api'

export const requestOtp = (mobile) =>
  api.post('/auth/request-otp', { mobile }).then((response) => response.data)

export const verifyOtp = ({ userId, otp, purpose }) =>
  api.post('/auth/verify-otp', { userId, otp, purpose }).then((response) => response.data)

export const resendOtp = ({ userId, purpose }) =>
  api.post('/auth/resend-otp', { userId, purpose }).then((response) => response.data)

export const refreshSession = refreshAccessToken

export const fetchMe = () => api.get('/auth/me').then((response) => response.data)

export const logoutRequest = () => api.post('/auth/logout').then((response) => response.data)
