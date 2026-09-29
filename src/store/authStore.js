import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { OTP_EXPIRY_SECONDS, RESEND_COOLDOWN_SECONDS } from '../lib/constants'

const newOtpTimers = () => {
  const now = Date.now()
  return {
    otpExpiresAt: now + OTP_EXPIRY_SECONDS * 1000,
    resendAvailableAt: now + RESEND_COOLDOWN_SECONDS * 1000,
  }
}

const noOtpTimers = { otpExpiresAt: null, resendAvailableAt: null }

export const useAuthStore = create(
  persist(
    (set) => ({
      mobile: '',
      otpExpiresAt: null,
      resendAvailableAt: null,
      isAuthenticated: false,

      startOtp: (mobile) => set({ mobile, ...newOtpTimers() }),

      restartOtpTimers: () => set(newOtpTimers()),

      login: ({ mobile }) => set({ mobile, isAuthenticated: true, ...noOtpTimers }),

      reset: () => set({ mobile: '', isAuthenticated: false, ...noOtpTimers }),
    }),
    {
      name: 'sillypoint-auth',
      storage: createJSONStorage(() => sessionStorage),
      partialize: ({ mobile, otpExpiresAt, resendAvailableAt }) => ({
        mobile,
        otpExpiresAt,
        resendAvailableAt,
      }),
    },
  ),
)
