import { api } from './api'

export const scorerLogin = ({ token, mobile, pin }) =>
  api.post('/scorer/login', { token, mobile, pin }).then((response) => response.data)

export const fetchScorerSession = (signal) =>
  api.get('/scorer/me', { signal }).then((response) => response.data)

export const fetchSquads = (signal) =>
  api.get('/scorer/players', { signal }).then((response) => response.data)

export const saveSquads = (squads) => api.put('/scorer/players', squads).then((response) => response.data)

export const saveToss = ({ winnerTeamId, decision }) =>
  api.put('/scorer/toss', { winnerTeamId, decision }).then((response) => response.data.match)

export const saveOvers = ({ oversPerSide }) =>
  api.put('/scorer/overs', { oversPerSide }).then((response) => response.data.match)

export const scorerLinkUrl = (token) => `${window.location.origin}/scorer/${token}`
