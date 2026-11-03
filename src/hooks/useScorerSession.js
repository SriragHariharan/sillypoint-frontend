import { useEffect, useState } from 'react'
import { getErrorMessage } from '../lib/api'
import { notifyError } from '../lib/notify'
import { fetchScorerSession } from '../lib/scorerApi'
import { useScorerStore } from '../store/scorerStore'

export function useScorerSession(linkToken) {
  const hasSession = useScorerStore((state) => Boolean(state.accessToken) && state.linkToken === linkToken)
  const loadedScorer = useScorerStore((state) => state.scorer)
  const refreshKey = useScorerStore((state) => state.refreshKey)
  const requestRefresh = useScorerStore((state) => state.requestRefresh)

  const key = `${linkToken}|${refreshKey}`
  const [result, setResult] = useState(() => ({
    key: useScorerStore.getState().scorer ? key : null,
    failed: false,
  }))

  useEffect(() => {
    if (!hasSession || result.key === key) return undefined

    const controller = new AbortController()

    fetchScorerSession(controller.signal)
      .then((details) => {
        useScorerStore.getState().setScorerDetails(details)
        setResult({ key, failed: false })
      })
      .catch((error) => {
        if (error?.code === 'ERR_CANCELED') return

        const status = error.response?.status
        if (status === 401 || status === 409) {
          notifyError(status === 401 ? 'Your session has expired. Please log in again.' : getErrorMessage(error))
          useScorerStore.getState().clearScorerSession()
          return
        }

        notifyError(getErrorMessage(error))
        setResult({ key, failed: true })
      })

    return () => controller.abort()
  }, [hasSession, key, result.key])

  const loaded = result.key === key
  let status = 'ready'
  if (!hasSession) status = 'unauthenticated'
  else if (loaded && result.failed) status = 'error'
  else if (!loaded && !loadedScorer) status = 'loading'

  return { status, retry: requestRefresh }
}
