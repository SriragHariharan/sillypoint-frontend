import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

const noDetails = { scorer: null, match: null, scoringOpensAt: null, serverOffsetMs: 0 }

const detailsOf = ({ scorer, match, serverTime, scoringOpensAt }) => ({
  scorer,
  match,
  scoringOpensAt,
  serverOffsetMs: Date.parse(serverTime) - Date.now(),
})

export const useScorerStore = create(
  persist(
    (set) => ({
      accessToken: null,
      linkToken: null,
      ...noDetails,
      refreshKey: 0,

      setScorerSession: ({ accessToken, linkToken, ...details }) =>
        set({ accessToken, linkToken, ...detailsOf(details) }),

      setScorerDetails: (details) => set(detailsOf(details)),

      setMatch: (match) => set({ match }),

      requestRefresh: () => set((state) => ({ refreshKey: state.refreshKey + 1 })),

      clearScorerSession: () => set({ accessToken: null, linkToken: null, ...noDetails }),
    }),
    {
      name: 'sillypoint-scorer',
      storage: createJSONStorage(() => localStorage),
      partialize: ({ accessToken, linkToken }) => ({ accessToken, linkToken }),
    },
  ),
)
