import { useEffect, useState } from 'react'
import { getErrorMessage } from '../lib/api'
import { createTournamentMatch, fetchTournamentMatches } from '../lib/matchApi'
import { notifyError, notifyInfo } from '../lib/notify'

export function useTournamentMatches(id) {
  const [reloadKey, setReloadKey] = useState(0)
  const [matchList, setMatchList] = useState({ key: null, matches: [], failed: false })
  const [showAddMatch, setShowAddMatch] = useState(false)
  const [creating, setCreating] = useState(false)

  const key = `${id}|${reloadKey}`

  useEffect(() => {
    const controller = new AbortController()

    fetchTournamentMatches(id, controller.signal)
      .then((matches) => setMatchList({ key, matches, failed: false }))
      .catch((error) => {
        if (error?.code === 'ERR_CANCELED') return
        if (error.response?.status !== 404) notifyError(getErrorMessage(error))
        setMatchList({ key, matches: [], failed: true })
      })

    return () => controller.abort()
  }, [id, key])

  const reload = () => setReloadKey((value) => value + 1)

  const createMatch = async (values) => {
    setCreating(true)
    try {
      await createTournamentMatch(id, values)
      setShowAddMatch(false)
      reload()
      notifyInfo('Match created.')
    } catch (error) {
      notifyError(getErrorMessage(error))
    } finally {
      setCreating(false)
    }
  }

  return {
    matches: matchList.matches,
    loading: matchList.key !== key,
    failed: matchList.failed,
    reload,
    showAddMatch,
    openAddMatch: () => setShowAddMatch(true),
    closeAddMatch: () => setShowAddMatch(false),
    creating,
    createMatch,
  }
}
