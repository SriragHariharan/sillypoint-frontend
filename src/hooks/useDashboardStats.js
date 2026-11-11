import { useEffect, useState } from 'react'
import { getErrorMessage } from '../lib/api'
import { notifyError } from '../lib/notify'
import { fetchTournaments } from '../lib/tournamentApi'

export const RECENT_COUNT = 6

const isCanceled = (error) => error?.code === 'ERR_CANCELED'

export function useDashboardStats(userId) {
  const [reloadKey, setReloadKey] = useState(0)
  const [data, setData] = useState({ key: null, recent: [], total: 0, live: 0, upcoming: 0, failed: false })

  const key = `${userId}|${reloadKey}`
  const loading = Boolean(userId) && data.key !== key

  useEffect(() => {
    if (!userId) return undefined

    const controller = new AbortController()
    const request = (params) => fetchTournaments({ organizerId: userId, ...params }, controller.signal)

    Promise.all([
      request({ limit: RECENT_COUNT }),
      request({ status: 'live', limit: 1 }),
      request({ status: 'upcoming', limit: 1 }),
    ])
      .then(([all, live, upcoming]) =>
        setData({
          key,
          recent: all.tournaments,
          total: all.total,
          live: live.total,
          upcoming: upcoming.total,
          failed: false,
        }),
      )
      .catch((error) => {
        if (isCanceled(error)) return
        notifyError(getErrorMessage(error))
        setData({ key, recent: [], total: 0, live: 0, upcoming: 0, failed: true })
      })

    return () => controller.abort()
  }, [userId, key])

  return { data, loading, retry: () => setReloadKey((value) => value + 1) }
}
