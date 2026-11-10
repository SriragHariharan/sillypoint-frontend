import { useEffect, useState } from 'react'
import { getErrorMessage } from '../lib/api'
import { notifyError } from '../lib/notify'
import { fetchScorecard } from '../lib/scoringApi'

// The public scorecard of a match. `refreshKey` reloads it (the scorer's screen passes the innings version).
export function useScorecard(matchId, refreshKey = 0) {
  const [reloadKey, setReloadKey] = useState(0)
  const [loaded, setLoaded] = useState({ key: null, scorecard: null, failed: false })

  const key = `${matchId}|${refreshKey}|${reloadKey}`

  useEffect(() => {
    const controller = new AbortController()

    fetchScorecard(matchId, controller.signal)
      .then((scorecard) => setLoaded({ key, scorecard, failed: false }))
      .catch((error) => {
        if (error?.code === 'ERR_CANCELED') return
        notifyError(getErrorMessage(error))
        setLoaded((current) => ({ key, scorecard: current.scorecard, failed: true }))
      })

    return () => controller.abort()
  }, [matchId, key])

  return {
    scorecard: loaded.scorecard,
    loading: loaded.scorecard === null && !loaded.failed,
    failed: loaded.failed,
    retry: () => setReloadKey((value) => value + 1),
  }
}
