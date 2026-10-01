import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppNavbar from '../components/AppNavbar'
import TeamForm from '../components/TeamForm'
import { getErrorMessage } from '../lib/api'
import { notifyError, notifyInfo } from '../lib/notify'
import { createTeam } from '../lib/teamApi'

function AddTeamPage() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (values) => {
    setSubmitting(true)

    try {
      await createTeam(values)
      notifyInfo('Team created.')
      navigate('/teams')
    } catch (error) {
      notifyError(getErrorMessage(error))
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white pb-16 sm:bg-gray-50 sm:pb-0">
      <AppNavbar />
      <main className="mx-auto w-full max-w-md px-5 py-6 sm:max-w-lg sm:py-10">
        <div className="sm:rounded-2xl sm:border sm:border-gray-200 sm:bg-white sm:p-8 sm:shadow-xl">
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">Add team</h1>
          <p className="mt-2 text-sm text-gray-600">Enter your team and captain details.</p>
          <div className="mt-6">
            <TeamForm
              submitting={submitting}
              submitLabel="Add team"
              submittingLabel="Adding…"
              onSubmit={onSubmit}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default AddTeamPage
