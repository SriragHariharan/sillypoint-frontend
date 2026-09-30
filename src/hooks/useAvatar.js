import { useState } from 'react'
import { getErrorMessage } from '../lib/api'
import { notifyError, notifyInfo } from '../lib/notify'
import { removeAvatar, uploadAvatar } from '../lib/userApi'
import { validateAvatar } from '../lib/validators'
import { useAuthStore } from '../store/authStore'

export const useAvatar = () => {
  const avatar = useAuthStore((state) => state.user?.avatar ?? null)
  const updateUser = useAuthStore((state) => state.updateUser)
  const [busy, setBusy] = useState(null)

  const run = async (kind, action, successMessage) => {
    setBusy(kind)
    try {
      const { avatar: next } = await action()
      updateUser({ avatar: next })
      notifyInfo(successMessage)
      return true
    } catch (error) {
      notifyError(getErrorMessage(error))
      return false
    } finally {
      setBusy(null)
    }
  }

  const upload = async (file) => {
    const check = validateAvatar(file)
    if (check !== true) {
      notifyError(check)
      return false
    }
    return run('uploading', () => uploadAvatar(file), 'Profile photo updated.')
  }

  const remove = () => run('removing', removeAvatar, 'Profile photo removed.')

  return { avatar, busy, upload, remove }
}
