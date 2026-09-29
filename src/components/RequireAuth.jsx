import { Navigate } from 'react-router-dom'
import FullPageLoader from './FullPageLoader'
import { useAuthStore } from '../store/authStore'

function RequireAuth({ children }) {
  const status = useAuthStore((state) => state.status)

  if (status === 'loading') return <FullPageLoader />
  if (status === 'unauthenticated') return <Navigate to="/login" replace />

  return children
}

export default RequireAuth
