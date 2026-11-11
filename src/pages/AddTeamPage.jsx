import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppFormShell from '../components/AppFormShell'
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
    <AppFormShell eyebrow="New team" title="Add team" subtitle="Enter your team and manager details.">
      <TeamForm submitting={submitting} submitLabel="Add team" submittingLabel="Adding…" onSubmit={onSubmit} />
    </AppFormShell>
  )
}

export default AddTeamPage
