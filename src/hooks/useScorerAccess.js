import { useEffect, useState } from 'react'
import { getErrorMessage } from '../lib/api'
import { fetchScorerAccess } from '../lib/matchApi'
import { notifyError } from '../lib/notify'

export function useScorerAccess(matchId) {
  const [reloadKey, setReloadKey] = useState(0)
  const [loaded, setLoaded] = useState({ key: null, access: null, failed: false })

  const key = `${matchId}|${reloadKey}`

  useEffect(() => {
    const controller = new AbortController()

    fetchScorerAccess(matchId, controller.signal)
      .then((access) => setLoaded({ key, access, failed: false }))
      .catch((error) => {
        if (error?.code === 'ERR_CANCELED') return
        notifyError(getErrorMessage(error))
        setLoaded({ key, access: null, failed: true })
      })

    return () => controller.abort()
  }, [matchId, key])

  return {
    access: loaded.access,
    loading: loaded.key !== key,
    failed: loaded.failed,
    retry: () => setReloadKey((value) => value + 1),
  }
}
