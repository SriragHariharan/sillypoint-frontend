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

const noOtpFlow = {
  mobile: '',
  userId: null,
  purpose: null,
  otpExpiresAt: null,
  resendAvailableAt: null,
}

export const useAuthStore = create(
  persist(
    (set) => ({
      ...noOtpFlow,
      user: null,
      accessToken: null,
      status: 'loading',

      startOtp: ({ mobile, userId, purpose }) => set({ mobile, userId, purpose, ...newOtpTimers() }),

      restartOtpTimers: () => set(newOtpTimers()),

      setSession: ({ user, accessToken }) =>
        set({ user, accessToken, status: 'authenticated', ...noOtpFlow }),

      setAccessToken: (accessToken) => set({ accessToken }),

      updateUser: (changes) => set((state) => ({ user: state.user ? { ...state.user, ...changes } : state.user })),

      clearSession: () => set({ user: null, accessToken: null, status: 'unauthenticated' }),
    }),
    {
      name: 'sillypoint-auth',
      storage: createJSONStorage(() => sessionStorage),
      partialize: ({ mobile, userId, purpose, otpExpiresAt, resendAvailableAt }) => ({
        mobile,
        userId,
        purpose,
        otpExpiresAt,
        resendAvailableAt,
      }),
    },
  ),
)
