import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import AppNavbar from '../components/AppNavbar'
import Skeleton from '../components/Skeleton'
import TeamForm from '../components/TeamForm'
import { getErrorMessage } from '../lib/api'
import { notifyError, notifyInfo } from '../lib/notify'
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
      <div className="rounded-2xl border border-dashed border-gray-300 px-6 py-12 text-center">
        <p className="font-semibold text-gray-900">Team not found</p>
        <p className="mt-1 text-sm text-gray-600">It may not exist, or you don&apos;t manage it.</p>
        <Link
          to="/teams"
          className="mt-5 inline-block rounded-full bg-red-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
        >
          Back to teams
        </Link>
      </div>
    )
  } else if (result.failed) {
    content = (
      <div className="rounded-2xl border border-dashed border-gray-300 px-6 py-12 text-center">
        <p className="font-semibold text-gray-900">Couldn&apos;t load team</p>
        <p className="mt-1 text-sm text-gray-600">Check your connection and try again.</p>
        <button
          type="button"
          onClick={() => setReloadKey((value) => value + 1)}
          className="mt-5 rounded-full bg-red-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    )
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
    <div className="min-h-screen bg-white pb-16 sm:bg-gray-50 sm:pb-0">
      <AppNavbar />
      <main className="mx-auto w-full max-w-md px-5 py-6 sm:max-w-lg sm:py-10">
        <div className="sm:rounded-2xl sm:border sm:border-gray-200 sm:bg-white sm:p-8 sm:shadow-xl">
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">Edit team</h1>
          <p className="mt-2 text-sm text-gray-600">Update your team and captain details.</p>
          <div className="mt-6">{content}</div>
        </div>
      </main>
    </div>
  )
}

export default EditTeamPage
