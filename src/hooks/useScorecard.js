import { useEffect, useState } from 'react'
import { getErrorMessage } from '../lib/api'
import { LIVE_SCORE_POLL_MS } from '../lib/constants'
import { notifyError } from '../lib/notify'
import { fetchScorecard } from '../lib/scoringApi'
import { usePolling } from './usePolling'

const sameScorecard = (a, b) => JSON.stringify(a) === JSON.stringify(b)

// The public scorecard of a match. `refreshKey` reloads it (the scorer's screen passes the innings version).
// With `live` it also re-reads itself every few seconds, quietly, until a response says the match is concluded.
// With `enabled` false it does nothing (e.g. the match has not started, so there is no scorecard yet).
export function useScorecard(matchId, refreshKey = 0, { live = false, enabled = true } = {}) {
  const [reloadKey, setReloadKey] = useState(0)
  const [loaded, setLoaded] = useState({ key: null, matchId: null, scorecard: null, failed: false })

  const key = `${matchId}|${refreshKey}|${reloadKey}`

  useEffect(() => {
    if (!enabled) return undefined
    const controller = new AbortController()

    fetchScorecard(matchId, controller.signal)
      .then((scorecard) => setLoaded({ key, matchId, scorecard, failed: false }))
      .catch((error) => {
        if (error?.code === 'ERR_CANCELED') return
        notifyError(getErrorMessage(error))
        setLoaded((current) => ({
          key,
          matchId,
          scorecard: current.matchId === matchId ? current.scorecard : null,
          failed: true,
        }))
      })

    return () => controller.abort()
  }, [matchId, key, enabled])

  // Never show another match's data while this one loads
  const mine = loaded.matchId === matchId
  const scorecard = mine ? loaded.scorecard : null
  const failed = mine && loaded.failed
  const finished = Boolean(scorecard?.match?.completedAt)
  const polling = live && enabled && !finished && scorecard !== null

  usePolling(
    async (signal) => {
      const next = await fetchScorecard(matchId, signal)
      setLoaded((current) =>
        current.matchId !== matchId || sameScorecard(current.scorecard, next)
          ? current
          : { ...current, scorecard: next, failed: false },
      )
      return !next.match?.completedAt
    },
    { enabled: polling, intervalMs: LIVE_SCORE_POLL_MS, resetKey: matchId },
  )

  return {
    scorecard,
    loading: enabled && scorecard === null && !failed,
    failed,
    polling,
    retry: () => setReloadKey((value) => value + 1),
  }
}
