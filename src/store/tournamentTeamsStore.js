import { create } from 'zustand'

export const useTournamentTeamsStore = create((set) => ({
  teamsByTournament: {},

  addTeams: (tournamentId, teams) =>
    set((state) => {
      const current = state.teamsByTournament[tournamentId] ?? []
      const known = new Set(current.map((team) => team.id))
      const fresh = teams.filter((team) => !known.has(team.id))
      if (fresh.length === 0) return state
      return {
        teamsByTournament: { ...state.teamsByTournament, [tournamentId]: [...current, ...fresh] },
      }
    }),
}))
