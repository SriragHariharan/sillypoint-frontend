import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getErrorMessage } from '../lib/api'
import { demoLogin } from '../lib/authApi'
import { notifyError } from '../lib/notify'
import { setSessionFlag } from '../lib/sessionFlag'
import { useAuthStore } from '../store/authStore'

export function useDemoLogin() {
  const navigate = useNavigate()
  const setSession = useAuthStore((state) => state.setSession)
  const [pendingRole, setPendingRole] = useState(null)

  const login = async (role) => {
    setPendingRole(role)

    try {
      const data = await demoLogin(role)
      setSessionFlag()
      setSession({ user: data.user, accessToken: data.accessToken })
      navigate('/home', { replace: true })
    } catch (error) {
      notifyError(getErrorMessage(error))
      setPendingRole(null)
    }
  }

  return { login, pendingRole }
}
