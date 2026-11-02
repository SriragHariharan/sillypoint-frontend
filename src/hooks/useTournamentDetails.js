import { useEffect, useState } from 'react'
import { getErrorMessage } from '../lib/api'
import { notifyError } from '../lib/notify'
import { fetchTournamentDetails } from '../lib/tournamentApi'

export function useTournamentDetails(id) {
  const [reloadKey, setReloadKey] = useState(0)
  const [loaded, setLoaded] = useState({ key: null, tournament: null, failed: false })

  const key = `${id}|${reloadKey}`

  useEffect(() => {
    const controller = new AbortController()

    fetchTournamentDetails(id, controller.signal)
      .then((tournament) => setLoaded({ key, tournament, failed: false }))
      .catch((error) => {
        if (error?.code === 'ERR_CANCELED') return
        if (error.response?.status === 404) {
          setLoaded({ key, tournament: null, failed: false })
          return
        }
        notifyError(getErrorMessage(error))
        setLoaded({ key, tournament: null, failed: true })
      })

    return () => controller.abort()
  }, [id, key])

  const retry = () => setReloadKey((value) => value + 1)

  const patchTournament = (summary) =>
    setLoaded((current) => ({ ...current, tournament: { ...current.tournament, ...summary } }))

  return {
    tournament: loaded.tournament,
    loading: loaded.key !== key,
    failed: loaded.failed,
    retry,
    patchTournament,
  }
}
