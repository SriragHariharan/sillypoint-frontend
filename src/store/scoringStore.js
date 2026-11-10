import { create } from 'zustand'

// The scorer's live scoring state. The server is the source of truth: `data` is always the last response.
// `preview` holds the crease the screen expects after the ball that is being saved, shown until the response arrives.
export const useScoringStore = create((set) => ({
  data: null,
  preview: null,
  busy: false,

  setData: (data) => set({ data }),
  reset: () => set({ data: null, preview: null, busy: false }),
}))
