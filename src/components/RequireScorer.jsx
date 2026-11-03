import { Navigate, useParams } from 'react-router-dom'
import { useScorerSession } from '../hooks/useScorerSession'
import AuthLayout from './AuthLayout'
import FullPageLoader from './FullPageLoader'
import RetryPanel from './RetryPanel'

function RequireScorer({ children }) {
  const { token } = useParams()
  const { status, retry } = useScorerSession(token)

  if (status === 'loading') return <FullPageLoader />
  if (status === 'unauthenticated') return <Navigate to={`/scorer/${token}`} replace />

  if (status === 'error') {
    return (
      <AuthLayout title="Scorer">
        <RetryPanel message="Couldn't load your match." onRetry={retry} />
      </AuthLayout>
    )
  }

  return children
}

export default RequireScorer
