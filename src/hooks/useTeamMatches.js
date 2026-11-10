import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getErrorMessage } from '../lib/api'
import { notifyError } from '../lib/notify'
import { fetchTeam, fetchTeamMatches } from '../lib/teamApi'

const PAGE_SIZE = 10

const isCanceled = (error) => error?.code === 'ERR_CANCELED'

const queryFor = (page, status) => (status === 'all' ? { page, limit: PAGE_SIZE } : { page, limit: PAGE_SIZE, status })

export function useTeamMatches(teamId) {
  const [params, setParams] = useSearchParams()
  const status = params.get('status') ?? 'all'

  const [reloadKey, setReloadKey] = useState(0)
  const [loadingMore, setLoadingMore] = useState(false)
  const [teamResult, setTeamResult] = useState({ key: null, team: null, notFound: false, failed: false })
  const [history, setHistory] = useState({ key: null, matches: [], summary: null, total: 0, page: 1, failed: false })

  const teamKey = `${teamId}|${reloadKey}`
  const historyKey = `${teamId}|${status}|${reloadKey}`

  useEffect(() => {
    const controller = new AbortController()

    fetchTeam(teamId, controller.signal)
      .then((team) => setTeamResult({ key: teamKey, team, notFound: false, failed: false }))
      .catch((error) => {
        if (isCanceled(error)) return
        const notFound = error.response?.status === 404
        if (!notFound) notifyError(getErrorMessage(error))
        setTeamResult({ key: teamKey, team: null, notFound, failed: !notFound })
      })

    return () => controller.abort()
  }, [teamId, teamKey])

  useEffect(() => {
    const controller = new AbortController()

    fetchTeamMatches(teamId, queryFor(1, status), controller.signal)
      .then((data) =>
        setHistory({ key: historyKey, matches: data.matches, summary: data.summary, total: data.total, page: data.page, failed: false }),
      )
      .catch((error) => {
        if (isCanceled(error)) return
        if (error.response?.status !== 404) notifyError(getErrorMessage(error))
        setHistory({ key: historyKey, matches: [], summary: null, total: 0, page: 1, failed: error.response?.status !== 404 })
      })

    return () => controller.abort()
  }, [teamId, status, historyKey])

  const setStatus = (value) => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (value === 'all') next.delete('status')
        else next.set('status', value)
        return next
      },
      { replace: true },
    )
  }

  const loadMore = async () => {
    setLoadingMore(true)

    try {
      const data = await fetchTeamMatches(teamId, queryFor(history.page + 1, status))
      setHistory((prev) =>
        prev.key === historyKey
          ? { ...prev, matches: [...prev.matches, ...data.matches], total: data.total, page: data.page }
          : prev,
      )
    } catch (error) {
      notifyError(getErrorMessage(error))
    } finally {
      setLoadingMore(false)
    }
  }

  return {
    team: teamResult.team,
    notFound: teamResult.notFound,
    teamLoading: teamResult.key !== teamKey,
    summary: history.summary,
    matches: history.matches,
    total: history.total,
    status,
    setStatus,
    loading: history.key !== historyKey,
    failed: history.failed || teamResult.failed,
    hasMore: history.key === historyKey && history.matches.length < history.total,
    loadingMore,
    loadMore,
    retry: () => setReloadKey((value) => value + 1),
  }
}
