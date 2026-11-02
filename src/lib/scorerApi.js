import { api } from './api'

export const scorerLogin = ({ token, mobile, pin }) =>
  api.post('/scorer/login', { token, mobile, pin }).then((response) => response.data)

export const scorerLinkUrl = (token) => `${window.location.origin}/scorer/${token}`
