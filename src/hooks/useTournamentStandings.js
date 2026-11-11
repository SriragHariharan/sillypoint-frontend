import { useEffect, useState } from 'react'
import { fetchTournamentStandings } from '../lib/tournamentApi'

// The tournament's points table, read fresh every time the Points tab is opened
export function useTournamentStandings(id) {
  const [reloadKey, setReloadKey] = useState(0)
  const [result, setResult] = useState({ key: null, standings: null, failed: false })

  const key = `${id}|${reloadKey}`

  useEffect(() => {
    const controller = new AbortController()

    fetchTournamentStandings(id, controller.signal)
      .then((standings) => setResult({ key, standings, failed: false }))
      .catch((error) => {
        if (error?.code === 'ERR_CANCELED') return
        setResult({ key, standings: null, failed: true })
      })

    return () => controller.abort()
  }, [id, key])

  return {
    standings: result.standings,
    loading: result.key !== key,
    failed: result.failed,
    reload: () => setReloadKey((value) => value + 1),
  }
}
