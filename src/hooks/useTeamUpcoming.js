import { useEffect, useState } from 'react'
import { getErrorMessage } from '../lib/api'
import { notifyError } from '../lib/notify'
import { fetchTeamMatches } from '../lib/teamApi'

const PAGE_SIZE = 5

// A team's upcoming matches (not started yet), soonest first, a few at a time
export function useTeamUpcoming(teamId) {
  const [reloadKey, setReloadKey] = useState(0)
  const [loadingMore, setLoadingMore] = useState(false)
  const [result, setResult] = useState({ key: null, matches: [], total: 0, page: 1, failed: false })

  const key = `${teamId}|${reloadKey}`

  useEffect(() => {
    const controller = new AbortController()

    fetchTeamMatches(teamId, { status: 'upcoming', page: 1, limit: PAGE_SIZE }, controller.signal)
      .then((data) => setResult({ key, matches: data.matches, total: data.total, page: data.page, failed: false }))
      .catch((error) => {
        if (error?.code === 'ERR_CANCELED') return
        setResult({ key, matches: [], total: 0, page: 1, failed: true })
      })

    return () => controller.abort()
  }, [teamId, key])

  const loadMore = async () => {
    setLoadingMore(true)
    try {
      const data = await fetchTeamMatches(teamId, { status: 'upcoming', page: result.page + 1, limit: PAGE_SIZE })
      setResult((prev) =>
        prev.key === key ? { ...prev, matches: [...prev.matches, ...data.matches], total: data.total, page: data.page } : prev,
      )
    } catch (error) {
      notifyError(getErrorMessage(error))
    } finally {
      setLoadingMore(false)
    }
  }

  return {
    matches: result.matches,
    total: result.total,
    loading: result.key !== key,
    failed: result.failed,
    hasMore: result.key === key && result.matches.length < result.total,
    loadingMore,
    loadMore,
    retry: () => setReloadKey((value) => value + 1),
  }
}
