import { useForm } from 'react-hook-form'
import { matchDateInput, matchTimeInput } from '../lib/formatDate'
import MatchScheduleFields from './MatchScheduleFields'
import ModalFooter from './ModalFooter'
import ModalShell from './ModalShell'

function RescheduleMatchModal({ match, submitting, onClose, onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { matchDate: matchDateInput(match.scheduledAt), matchTime: matchTimeInput(match.scheduledAt) },
  })

  return (
    <ModalShell
      title="Reschedule match"
      subtitle={`${match.teamA.name} vs ${match.teamB.name}`}
      onClose={onClose}
      busy={submitting}
      footer={
        <ModalFooter
          form="reschedule-match-form"
          onCancel={onClose}
          cancelDisabled={submitting}
          confirmDisabled={submitting}
          confirmLabel={submitting ? 'Rescheduling…' : 'Reschedule'}
        />
      }
    >
      <form id="reschedule-match-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <MatchScheduleFields
          register={register}
          errors={errors}
          tournament={match.tournament}
          idPrefix="reschedule"
          dateLabel="New date"
          timeLabel="New start time"
        />
      </form>
    </ModalShell>
  )
}

export default RescheduleMatchModal
