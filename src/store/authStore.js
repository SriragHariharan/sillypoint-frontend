import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  mobile: '',
  isAuthenticated: false,

  setMobile: (mobile) => set({ mobile }),

  login: ({ mobile }) => set({ mobile, isAuthenticated: true }),

  reset: () => set({ mobile: '', isAuthenticated: false }),
}))
