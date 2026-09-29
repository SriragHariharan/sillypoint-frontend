import { useEffect, useState } from 'react'

const secondsLeft = (targetMs) =>
  targetMs ? Math.max(0, Math.ceil((targetMs - Date.now()) / 1000)) : 0

export function useCountdown(targetMs) {
  const [, setTick] = useState(0)

  useEffect(() => {
    if (secondsLeft(targetMs) === 0) return undefined

    const id = setInterval(() => {
      setTick((tick) => tick + 1)
      if (secondsLeft(targetMs) === 0) clearInterval(id)
    }, 1000)

    return () => clearInterval(id)
  }, [targetMs])

  return secondsLeft(targetMs)
}
