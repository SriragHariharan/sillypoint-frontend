export const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/
export const OTP_REGEX = /^\d{4}$/

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

export const teamNameValidation = {
  required: 'Enter the team name',
  maxLength: { value: 60, message: 'Team name must be at most 60 characters' },
  validate: (value) => value.trim().length >= 2 || 'Team name must be at least 2 characters',
}

export const captainNameValidation = {
  required: 'Enter the captain name',
  maxLength: { value: 60, message: 'Captain name must be at most 60 characters' },
  validate: (value) => value.trim().length > 0 || 'Enter the captain name',
}

export const captainMobileValidation = {
  ...mobileValidation,
  required: 'Enter the captain mobile number',
}

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
