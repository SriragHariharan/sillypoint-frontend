import { SearchX } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import AppFormShell from '../components/AppFormShell'
import EmptyState from '../components/EmptyState'
import RetryPanel from '../components/RetryPanel'
import Skeleton from '../components/Skeleton'
import TeamForm from '../components/TeamForm'
import { getErrorMessage } from '../lib/api'
import { notifyError, notifyInfo } from '../lib/notify'
import { primaryButtonClass } from '../lib/premiumStyles'
import { fetchTeam, updateTeam } from '../lib/teamApi'

const isCanceled = (error) => error?.code === 'ERR_CANCELED'

function EditTeamPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [reloadKey, setReloadKey] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState({ key: null, team: null, notFound: false, failed: false })

  const key = `${id}|${reloadKey}`
  const loading = result.key !== key

  useEffect(() => {
    const controller = new AbortController()

    fetchTeam(id, controller.signal)
      .then((team) => setResult({ key, team, notFound: false, failed: false }))
      .catch((error) => {
        if (isCanceled(error)) return
        const notFound = error.response?.status === 404
        if (!notFound) notifyError(getErrorMessage(error))
        setResult({ key, team: null, notFound, failed: !notFound })
      })

    return () => controller.abort()
  }, [key, id])

  const onSubmit = async (values) => {
    setSubmitting(true)

    try {
      const team = await updateTeam(id, values)
      setResult((prev) => ({ ...prev, team }))
      notifyInfo('Team updated.')
      navigate('/teams')
    } catch (error) {
      notifyError(getErrorMessage(error))
      setSubmitting(false)
    }
  }

  let content
  if (loading) {
    content = (
      <div aria-busy="true" className="space-y-5">
        <span className="sr-only">Loading team…</span>
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    )
  } else if (result.notFound) {
    content = (
      <EmptyState
        icon={SearchX}
        title="Team not found"
        action={
          <Link to="/teams" className={`inline-block px-6 ${primaryButtonClass}`}>
            Back to teams
          </Link>
        }
      >
        It may not exist, or you don&apos;t manage it.
      </EmptyState>
    )
  } else if (result.failed) {
    content = <RetryPanel message="Couldn't load team" onRetry={() => setReloadKey((value) => value + 1)} />
  } else {
    content = (
      <TeamForm
        team={result.team}
        submitting={submitting}
        submitLabel="Save changes"
        submittingLabel="Saving…"
        onSubmit={onSubmit}
      />
    )
  }

  return (
    <AppFormShell eyebrow="Team settings" title="Edit team" subtitle="Update your team and captain details.">
      {content}
    </AppFormShell>
  )
}

export default EditTeamPage
