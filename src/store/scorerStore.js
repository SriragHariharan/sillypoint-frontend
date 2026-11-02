import { create } from 'zustand'

export const useScorerStore = create((set) => ({
  accessToken: null,
  scorer: null,
  match: null,

  setScorerSession: ({ accessToken, scorer, match }) => set({ accessToken, scorer, match }),

  clearScorerSession: () => set({ accessToken: null, scorer: null, match: null }),
}))
