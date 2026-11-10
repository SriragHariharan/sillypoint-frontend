import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getErrorMessage } from '../lib/api'
import { notifyError } from '../lib/notify'
import { fetchTournaments } from '../lib/tournamentApi'

const PAGE_SIZE = 12
const SEARCH_DEBOUNCE_MS = 300

const isCanceled = (error) => error?.code === 'ERR_CANCELED'

const queryFor = (page, { organizerId, q, status }) => {
  const query = { page, limit: PAGE_SIZE }
  if (organizerId) query.organizerId = organizerId
  if (q) query.q = q
  if (status !== 'all') query.status = status
  return query
}

export function useTournamentList({ organizerId } = {}) {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const status = params.get('status') ?? 'all'

  const [search, setSearch] = useState(q)
  const [reloadKey, setReloadKey] = useState(0)
  const [loadingMore, setLoadingMore] = useState(false)
  const [result, setResult] = useState({ key: null, items: [], total: 0, page: 1, failed: false })

  const key = `${organizerId ?? ''}|${q}|${status}|${reloadKey}`
  const loading = result.key !== key

  useEffect(() => {
    const timer = setTimeout(() => {
      setParams(
        (prev) => {
          if ((prev.get('q') ?? '') === search.trim()) return prev
          const next = new URLSearchParams(prev)
          if (search.trim()) next.set('q', search.trim())
          else next.delete('q')
          return next
        },
        { replace: true },
      )
    }, SEARCH_DEBOUNCE_MS)

    return () => clearTimeout(timer)
  }, [search, setParams])

  useEffect(() => {
    const controller = new AbortController()

    fetchTournaments(queryFor(1, { organizerId, q, status }), controller.signal)
      .then((data) => {
        setResult({ key, items: data.tournaments, total: data.total, page: data.page, failed: false })
      })
      .catch((error) => {
        if (isCanceled(error)) return
        notifyError(getErrorMessage(error))
        setResult({ key, items: [], total: 0, page: 1, failed: true })
      })

    return () => controller.abort()
  }, [key, organizerId, q, status])

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

  const clearFilters = () => {
    setSearch('')
    setParams({}, { replace: true })
  }

  const loadMore = async () => {
    setLoadingMore(true)

    try {
      const data = await fetchTournaments(queryFor(result.page + 1, { organizerId, q, status }))
      setResult((prev) =>
        prev.key === key
          ? { ...prev, items: [...prev.items, ...data.tournaments], total: data.total, page: data.page }
          : prev,
      )
    } catch (error) {
      notifyError(getErrorMessage(error))
    } finally {
      setLoadingMore(false)
    }
  }

  return {
    search,
    setSearch,
    status,
    setStatus,
    items: result.items,
    total: result.total,
    loading,
    loadingMore,
    failed: result.failed,
    hasFilters: Boolean(q) || status !== 'all',
    hasMore: !loading && result.items.length < result.total,
    loadMore,
    clearFilters,
    retry: () => setReloadKey((value) => value + 1),
  }
}
