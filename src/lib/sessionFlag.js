const SESSION_FLAG_KEY = 'sillypoint_session'

export const hasSessionFlag = () => localStorage.getItem(SESSION_FLAG_KEY) === '1'

export const setSessionFlag = () => localStorage.setItem(SESSION_FLAG_KEY, '1')

export const clearSessionFlag = () => localStorage.removeItem(SESSION_FLAG_KEY)
