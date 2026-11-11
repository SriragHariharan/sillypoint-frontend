import {
  MAX_PLAYERS_PER_SIDE,
  MAX_SUBSTITUTES_PER_SIDE,
  MIN_PLAYERS_PER_SIDE,
  MIN_SUBSTITUTES_PER_SIDE,
} from './squad'
import { MAX_OVERS_PER_SIDE, MIN_OVERS_PER_SIDE } from './overs'

export const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/
export const OTP_REGEX = /^\d{4}$/
export const SCORER_PIN_REGEX = /^\d{6}$/

export const mobileValidation = {
  required: 'Enter your mobile number',
  pattern: {
    value: INDIAN_MOBILE_REGEX,
    message: 'Enter a valid 10-digit Indian mobile number',
  },
}

export const DESCRIPTION_MAX_LENGTH = 500
export const IMAGE_MAX_BYTES = 2 * 1024 * 1024
export const IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp']

export const htmlTextLength = (html) => html.replace(/<[^>]*>/g, '').length

export const todayISO = () => {
  const now = new Date()
  const offsetMs = now.getTimezoneOffset() * 60000
  return new Date(now.getTime() - offsetMs).toISOString().slice(0, 10)
}

export const tournamentNameValidation = {
  required: 'Enter the tournament name',
  minLength: { value: 3, message: 'Name must be at least 3 characters' },
  maxLength: { value: 80, message: 'Name must be at most 80 characters' },
  validate: (value) => value.trim().length >= 3 || 'Name must be at least 3 characters',
}

export const locationValidation = {
  required: 'Enter the location',
  maxLength: { value: 120, message: 'Location must be at most 120 characters' },
  validate: (value) => value.trim().length > 0 || 'Enter the location',
}

export const AMOUNT_MAX = 10000000

const amountValidation = (label) => ({
  required: `Enter the ${label}`,
  validate: (value) => {
    if (!/^\d+$/.test(String(value).trim())) return `${label[0].toUpperCase()}${label.slice(1)} must be a whole number`
    return Number(value) <= AMOUNT_MAX || `${label[0].toUpperCase()}${label.slice(1)} must be at most ${AMOUNT_MAX.toLocaleString('en-IN')}`
  },
})

export const registrationFeeValidation = amountValidation('registration fee')
export const prizeMoneyValidation = amountValidation('prize money')

const countValidation = (label, min, max) => ({
  required: `Enter the ${label}`,
  validate: (value) => {
    const name = `${label[0].toUpperCase()}${label.slice(1)}`
    if (!/^\d+$/.test(String(value).trim())) return `${name} must be a whole number`
    const count = Number(value)
    return (count >= min && count <= max) || `${name} must be between ${min} and ${max}`
  },
})

export const playersPerSideValidation = countValidation('players per side', MIN_PLAYERS_PER_SIDE, MAX_PLAYERS_PER_SIDE)
export const substitutesPerSideValidation = countValidation(
  'substitutes per side',
  MIN_SUBSTITUTES_PER_SIDE,
  MAX_SUBSTITUTES_PER_SIDE,
)

export const oversPerSideValidation = countValidation('overs per side', MIN_OVERS_PER_SIDE, MAX_OVERS_PER_SIDE)

export const teamNameValidation = {
  required: 'Enter the team name',
  maxLength: { value: 60, message: 'Team name must be at most 60 characters' },
  validate: (value) => value.trim().length >= 2 || 'Team name must be at least 2 characters',
}

export const managerNameValidation = {
  required: 'Enter the manager name',
  maxLength: { value: 60, message: 'Manager name must be at most 60 characters' },
  validate: (value) => value.trim().length > 0 || 'Enter the manager name',
}

export const managerMobileValidation = {
  ...mobileValidation,
  required: 'Enter the manager mobile number',
}

export const scorerPinValidation = {
  required: 'Enter the 6-digit PIN',
  pattern: {
    value: SCORER_PIN_REGEX,
    message: 'PIN must be 6 digits',
  },
}

export const PLAYER_NAME_MAX_LENGTH = 60

const squadNames = (squad) =>
  [...squad.playing, ...squad.substitutes].map((player) => player.name.trim().toLowerCase()).filter(Boolean)

export const playerNameValidation = (side) => ({
  maxLength: { value: PLAYER_NAME_MAX_LENGTH, message: `At most ${PLAYER_NAME_MAX_LENGTH} characters` },
  validate: (value, values) => {
    const name = value.trim().toLowerCase()
    if (!name) return true
    return squadNames(values[side]).filter((other) => other === name).length === 1 || 'Same player twice in this team'
  },
})

export const descriptionValidation = {
  validate: (value) =>
    htmlTextLength(value) <= DESCRIPTION_MAX_LENGTH ||
    `Description must be at most ${DESCRIPTION_MAX_LENGTH} characters`,
}

export const validateLogo = (file) => {
  if (!file) return true
  if (!IMAGE_TYPES.includes(file.type)) return 'Logo must be a PNG, JPG or WebP image'
  if (file.size > IMAGE_MAX_BYTES) return 'Logo must be smaller than 2 MB'
  return true
}

export const validateAvatar = (file) => {
  if (!IMAGE_TYPES.includes(file.type)) return 'Photo must be a PNG, JPG or WebP image'
  if (file.size > IMAGE_MAX_BYTES) return 'Photo must be smaller than 2 MB'
  return true
}

export const startDateValidation = {
  required: 'Select the start date',
  validate: (value) => value >= todayISO() || 'Start date cannot be in the past',
}

export const lastRegistrationDateValidation = (getStartDate) => ({
  required: 'Select the last date of registration',
  validate: (value) => {
    if (value < todayISO()) return 'Last date of registration cannot be in the past'
    const start = getStartDate()
    return !start || value <= start || 'Must be on or before the start date'
  },
})

export const rescheduleStartValidation = (lastRegistrationDate) => ({
  required: startDateValidation.required,
  validate: (value) => {
    if (value < todayISO()) return 'Start date cannot be in the past'
    return value >= lastRegistrationDate || 'Start date cannot be before the last date of registration'
  },
  deps: ['endDate'],
})

export const endDateValidation = (getStartDate) => ({
  required: 'Select the end date',
  validate: (value) => {
    const start = getStartDate()
    return !start || value >= start || 'End date must be on or after the start date'
  },
})

export const otpValidation = {
  required: 'Enter the OTP',
  pattern: {
    value: OTP_REGEX,
    message: 'OTP must be 4 digits',
  },
}
