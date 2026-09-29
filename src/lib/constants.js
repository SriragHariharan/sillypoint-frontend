// Mirrors OTP_TTL_MS in the backend (src/modules/auth/auth.constants.ts)
export const OTP_EXPIRY_SECONDS = 10 * 60

// Frontend-only wait before "Resend OTP" unlocks; the backend has no resend cooldown
export const RESEND_COOLDOWN_SECONDS = 30

// How long toast notifications stay on screen
export const TOAST_DURATION_MS = 10 * 1000
