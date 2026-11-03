import { useEffect, useState } from 'react'
import { notifyInfo } from '../lib/notify'
import { handleScorerError } from '../lib/scorerErrors'
import { fetchSquads, saveSquads } from '../lib/scorerApi'
import { buildSquadPayload } from '../lib/squad'

export function useSquads() {
  const [reloadKey, setReloadKey] = useState(0)
  const [loaded, setLoaded] = useState({ key: null, squads: null, failed: false })
  const [version, setVersion] = useState(0)
  const [saving, setSaving] = useState(false)

  const key = String(reloadKey)

  useEffect(() => {
    const controller = new AbortController()

    fetchSquads(controller.signal)
      .then((squads) => setLoaded({ key, squads, failed: false }))
      .catch((error) => {
        if (error?.code === 'ERR_CANCELED') return
        handleScorerError(error)
        setLoaded({ key, squads: null, failed: true })
      })

    return () => controller.abort()
  }, [key])

  const save = async (values) => {
    setSaving(true)
    try {
      const squads = await saveSquads(buildSquadPayload(values))
      setLoaded((current) => ({ ...current, squads }))
      setVersion((value) => value + 1)
      notifyInfo('Players saved.')
      return true
    } catch (error) {
      handleScorerError(error)
      return false
    } finally {
      setSaving(false)
    }
  }

  return {
    squads: loaded.squads,
    loading: loaded.key !== key,
    failed: loaded.failed,
    saving,
    version,
    retry: () => setReloadKey((value) => value + 1),
    save,
  }
}
