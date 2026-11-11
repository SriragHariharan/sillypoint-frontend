// Mirrors OTP_TTL_MS in the backend (src/modules/auth/auth.constants.ts)
export const OTP_EXPIRY_SECONDS = 10 * 60

// Frontend-only wait before "Resend OTP" unlocks; the backend has no resend cooldown
export const RESEND_COOLDOWN_SECONDS = 30

// How long toast notifications stay on screen
export const TOAST_DURATION_MS = 10 * 1000

// Live scores: how often a viewer re-reads the scorecard while the match is being scored
export const LIVE_SCORE_POLL_MS = 3 * 1000

// A match that has not started yet is only watched for its start inside this window, and only this slowly.
// SCORING_OPENS_BEFORE_MS mirrors the backend (src/modules/matches/matches.constants.ts)
export const MATCH_START_WATCH_MS = 15 * 1000
export const SCORING_OPENS_BEFORE_MS = 30 * 60 * 1000
export const START_WATCH_GIVE_UP_MS = 12 * 60 * 60 * 1000
