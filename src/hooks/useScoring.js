import { useCallback, useEffect, useState } from 'react'
import { getErrorMessage } from '../lib/api'
import { notifyError } from '../lib/notify'
import { handleScorerError } from '../lib/scorerErrors'
import {
  chooseBatter,
  chooseBowler,
  concludeMatch,
  endInnings,
  fetchScoring,
  recordBall,
  retireBatter,
  startInnings,
  swapBatters,
  undoBall,
} from '../lib/scoringApi'
import { predictCrease } from '../lib/scoringRules'
import { useScoringStore } from '../store/scoringStore'

const CONFLICT = 409

export function useScoring() {
  const data = useScoringStore((state) => state.data)
  const preview = useScoringStore((state) => state.preview)
  const busy = useScoringStore((state) => state.busy)
  const [reloadKey, setReloadKey] = useState(0)
  const [loaded, setLoaded] = useState({ key: null, failed: false })

  const key = String(reloadKey)

  useEffect(() => {
    const controller = new AbortController()

    fetchScoring(controller.signal)
      .then((state) => {
        useScoringStore.getState().setData(state)
        setLoaded({ key, failed: false })
      })
      .catch((error) => {
        if (error?.code === 'ERR_CANCELED') return
        handleScorerError(error)
        setLoaded({ key, failed: true })
      })

    return () => controller.abort()
  }, [key])

  // A fresh start every time the scoring screen opens
  useEffect(() => () => useScoringStore.getState().reset(), [])

  // Reads the state again without showing the loading screen (after a conflict)
  const refresh = useCallback(async () => {
    try {
      useScoringStore.getState().setData(await fetchScoring())
    } catch (error) {
      handleScorerError(error)
    }
  }, [])

  // One change at a time. A 409 means the screen was out of date: it is refreshed and the scorer checks again.
  const run = useCallback(
    async (request, preview = null) => {
      if (useScoringStore.getState().busy) return false
      useScoringStore.setState({ busy: true, preview })

      try {
        useScoringStore.getState().setData(await request())
        return true
      } catch (error) {
        if (error.response?.status === CONFLICT) {
          notifyError(getErrorMessage(error))
          await refresh()
        } else {
          handleScorerError(error)
        }
        return false
      } finally {
        useScoringStore.setState({ busy: false, preview: null })
      }
    },
    [refresh],
  )

  const currentOf = () => useScoringStore.getState().data.current

  const actions = {
    start: (payload) => run(() => startInnings(payload)),

    ball: (payload) => {
      const { number, version } = currentOf()
      return run(
        () => recordBall(number, { expectedVersion: version, ...payload }),
        predictCrease(currentOf(), payload),
      )
    },

    pickBatter: (playerId) => {
      const { number, version } = currentOf()
      return run(() => chooseBatter(number, version, playerId))
    },

    pickBowler: (playerId) => {
      const { number, version } = currentOf()
      return run(() => chooseBowler(number, version, playerId))
    },

    swap: () => {
      const { number, version, striker, nonStriker } = currentOf()
      return run(
        () => swapBatters(number, version),
        striker && nonStriker ? { striker: nonStriker, nonStriker: striker } : null,
      )
    },

    retire: (playerId, type) => {
      const { number, version } = currentOf()
      return run(() => retireBatter(number, version, playerId, type))
    },

    undo: () => {
      const { number, version } = currentOf()
      return run(() => undoBall(number, version))
    },

    finish: () => {
      const { number, version } = currentOf()
      return run(() => endInnings(number, version))
    },

    conclude: () => run(() => concludeMatch()),
  }

  return {
    data,
    preview,
    busy,
    loading: loaded.key !== key,
    failed: loaded.failed,
    retry: () => setReloadKey((value) => value + 1),
    ...actions,
  }
}
