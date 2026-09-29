import { Navigate } from 'react-router-dom'
import FullPageLoader from './FullPageLoader'
import { useAuthStore } from '../store/authStore'

function RedirectIfAuthed({ children }) {
  const status = useAuthStore((state) => state.status)

  if (status === 'loading') return <FullPageLoader />
  if (status === 'authenticated') return <Navigate to="/home" replace />

  return children
}

export default RedirectIfAuthed
