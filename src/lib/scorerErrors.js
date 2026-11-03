import { useScorerStore } from '../store/scorerStore'
import { getErrorMessage } from './api'
import { notifyError } from './notify'

export const handleScorerError = (error) => {
  if (error.response?.status === 401) {
    notifyError('Your session has expired. Please log in again.')
    useScorerStore.getState().clearScorerSession()
    return
  }

  notifyError(getErrorMessage(error))
}
