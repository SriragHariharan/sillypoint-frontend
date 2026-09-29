import { fetchMe, logoutRequest, refreshSession } from './authApi'
import { clearSessionFlag, hasSessionFlag } from './sessionFlag'
import { useAuthStore } from '../store/authStore'

let restoreStarted = false

export const restoreSession = async () => {
  if (restoreStarted) return
  restoreStarted = true

  const { setSession, clearSession } = useAuthStore.getState()

  if (!hasSessionFlag()) {
    clearSession()
    return
  }

  try {
    const accessToken = await refreshSession()
    const { user } = await fetchMe()
    setSession({ user, accessToken })
  } catch (error) {
    if (error.response?.status === 401) clearSessionFlag()
    clearSession()
  }
}

export const signOut = async () => {
  await logoutRequest().catch(() => undefined)
  useAuthStore.getState().clearSession()
  clearSessionFlag()
}
