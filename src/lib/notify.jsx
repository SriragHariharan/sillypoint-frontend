import toast from 'react-hot-toast'
import AppToast from '../components/AppToast'
import { TOAST_DURATION_MS } from './constants'

const show = (type, message) =>
  toast.custom((t) => <AppToast t={t} type={type} message={message} />, {
    id: `${type}:${message}`,
    duration: TOAST_DURATION_MS,
  })

export const notifyError = (message) => show('error', message)

export const notifyInfo = (message) => show('info', message)
