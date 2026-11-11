import { useEffect, useRef } from 'react'

const MAX_BACKOFF_MS = 30 * 1000

// Runs `task(signal)` again and again while `enabled`. The next run starts `intervalMs` after the previous one
// finished (so slow responses never pile up); the task returns false to stop for good. Paused while the tab is
// hidden and resumed at once when it is visible again. Failures are silent: the wait doubles (up to 30 s) and resets
// after a success. `resetKey` restarts the loop for a different subject.
export function usePolling(task, { enabled, intervalMs, resetKey }) {
  const taskRef = useRef(task)

  useEffect(() => {
    taskRef.current = task
  })

  useEffect(() => {
    if (!enabled) return undefined

    let stopped = false
    let failures = 0
    let timer = null
    let controller = null

    const schedule = () => {
      if (stopped) return
      timer = setTimeout(run, Math.min(intervalMs * 2 ** failures, MAX_BACKOFF_MS))
    }

    async function run() {
      if (stopped || document.hidden) return
      controller = new AbortController()
      try {
        const keepGoing = await taskRef.current(controller.signal)
        failures = 0
        if (keepGoing === false) {
          stopped = true
          return
        }
      } catch (error) {
        if (stopped || error?.code === 'ERR_CANCELED') return
        failures += 1
      }
      schedule()
    }

    const onVisibilityChange = () => {
      if (document.hidden || stopped) return
      clearTimeout(timer)
      controller?.abort()
      run()
    }

    document.addEventListener('visibilitychange', onVisibilityChange)
    schedule()

    return () => {
      stopped = true
      clearTimeout(timer)
      controller?.abort()
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [enabled, intervalMs, resetKey])
}
