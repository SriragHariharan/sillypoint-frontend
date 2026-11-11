import { useEffect, useState } from 'react'
import { getErrorMessage } from '../lib/api'
import { MATCH_START_WATCH_MS, SCORING_OPENS_BEFORE_MS, START_WATCH_GIVE_UP_MS } from '../lib/constants'
import { fetchMatchDetails } from '../lib/matchApi'
import { notifyError } from '../lib/notify'
import { usePolling } from './usePolling'

export function useMatchDetails(id) {
  const [reloadKey, setReloadKey] = useState(0)
  const [loaded, setLoaded] = useState({ key: null, match: null, failed: false })

  const key = `${id}|${reloadKey}`

  useEffect(() => {
    const controller = new AbortController()

    fetchMatchDetails(id, controller.signal)
      .then((match) => setLoaded({ key, match, failed: false }))
      .catch((error) => {
        if (error?.code === 'ERR_CANCELED') return
        if (error.response?.status === 404) {
          setLoaded({ key, match: null, failed: false })
          return
        }
        notifyError(getErrorMessage(error))
        setLoaded({ key, match: null, failed: true })
      })

    return () => controller.abort()
  }, [id, key])

  const { match } = loaded
  const waitingForStart = loaded.key === key && Boolean(match) && !match.scoringStartedAt && !match.completedAt

  // Notice the moment scoring starts, so the scorecard (and its live updates) appear without a refresh.
  // Only inside the scoring window, and no request at all outside it.
  usePolling(
    async (signal) => {
      const scheduledAt = new Date(match.scheduledAt).getTime()
      const now = Date.now()
      if (now > scheduledAt + START_WATCH_GIVE_UP_MS) return false
      if (now < scheduledAt - SCORING_OPENS_BEFORE_MS) return true

      const fresh = await fetchMatchDetails(id, signal)
      setLoaded((current) => (current.key === key ? { ...current, match: fresh } : current))
      return !fresh.scoringStartedAt
    },
    { enabled: waitingForStart, intervalMs: MATCH_START_WATCH_MS, resetKey: id },
  )

  return {
    match,
    loading: loaded.key !== key,
    failed: loaded.failed,
    retry: () => setReloadKey((value) => value + 1),
  }
}
