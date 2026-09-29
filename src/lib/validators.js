export const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/
export const OTP_REGEX = /^\d{4}$/

export const mobileValidation = {
  required: 'Enter your mobile number',
  pattern: {
    value: INDIAN_MOBILE_REGEX,
    message: 'Enter a valid 10-digit Indian mobile number',
  },
}

export const otpValidation = {
  required: 'Enter the OTP',
  pattern: {
    value: OTP_REGEX,
    message: 'OTP must be 4 digits',
  },
}
