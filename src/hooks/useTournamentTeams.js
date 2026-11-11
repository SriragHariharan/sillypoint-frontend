import { useEffect, useState } from 'react'
import { getErrorMessage } from '../lib/api'
import { notifyError, notifyInfo } from '../lib/notify'
import { useAuthStore } from '../store/authStore'
import { addTournamentTeams, fetchTournamentTeams, removeTournamentTeam } from '../lib/tournamentApi'

export function useTournamentTeams(id) {
  const [reloadKey, setReloadKey] = useState(0)
  const [enrolled, setEnrolled] = useState({ key: null, teams: [], failed: false })
  const [adding, setAdding] = useState(false)

  // The organizer also gets the managers' mobiles, so load again once the session is known (or changes)
  const userId = useAuthStore((state) => state.user?.id ?? null)
  const key = `${id}|${reloadKey}|${userId}`

  useEffect(() => {
    const controller = new AbortController()

    fetchTournamentTeams(id, controller.signal)
      .then((teams) => setEnrolled({ key, teams, failed: false }))
      .catch((error) => {
        if (error?.code === 'ERR_CANCELED') return
        if (error.response?.status !== 404) notifyError(getErrorMessage(error))
        setEnrolled({ key, teams: [], failed: true })
      })

    return () => controller.abort()
  }, [id, key])

  const reload = () => setReloadKey((value) => value + 1)

  const enroll = async (teams) => {
    setAdding(true)
    try {
      const added = await addTournamentTeams(
        id,
        teams.map((team) => team.id),
      )
      setEnrolled((current) => ({ ...current, teams: [...current.teams, ...added] }))
      notifyInfo(
        teams.length === 1
          ? `${teams[0].name} added to this tournament.`
          : `${teams.length} teams added to this tournament.`,
      )
      return true
    } catch (error) {
      notifyError(getErrorMessage(error))
      reload()
      return false
    } finally {
      setAdding(false)
    }
  }

  const removeTeam = async (team) => {
    try {
      await removeTournamentTeam(id, team.id)
      setEnrolled((current) => ({ ...current, teams: current.teams.filter((item) => item.id !== team.id) }))
      notifyInfo(`${team.name} removed from this tournament.`)
    } catch (error) {
      notifyError(getErrorMessage(error))
      reload()
    }
  }

  return {
    teams: enrolled.teams,
    loading: enrolled.key !== key,
    failed: enrolled.failed,
    reload,
    enroll,
    adding,
    removeTeam,
  }
}
