import { useEffect, useState } from 'react'
import { getErrorMessage } from '../lib/api'
import { fetchMatchDetails, rescheduleMatch } from '../lib/matchApi'
import { notifyError, notifyInfo } from '../lib/notify'

export function useMatchDetails(id) {
  const [reloadKey, setReloadKey] = useState(0)
  const [loaded, setLoaded] = useState({ key: null, match: null, failed: false })
  const [saving, setSaving] = useState(false)

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

  const save = async (request, message) => {
    setSaving(true)
    try {
      const updated = await request()
      setLoaded((current) => ({ ...current, match: updated }))
      notifyInfo(message)
      return true
    } catch (error) {
      notifyError(getErrorMessage(error))
      return false
    } finally {
      setSaving(false)
    }
  }

  return {
    match: loaded.match,
    loading: loaded.key !== key,
    failed: loaded.failed,
    saving,
    retry: () => setReloadKey((value) => value + 1),
    reschedule: (values) => save(() => rescheduleMatch(id, values), 'Match rescheduled.'),
  }
}
