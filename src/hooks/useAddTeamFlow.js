import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getErrorMessage } from '../lib/api'
import { notifyError, notifyInfo } from '../lib/notify'
import { fetchTeams } from '../lib/teamApi'
import { useAuthStore } from '../store/authStore'

export function useAddTeamFlow({ addedIds, enroll, adding }) {
  const navigate = useNavigate()
  const authenticated = useAuthStore((state) => state.status === 'authenticated')
  const [fetchingTeams, setFetchingTeams] = useState(false)
  const [myTeams, setMyTeams] = useState(null)

  const confirm = async (teams) => {
    if (await enroll(teams)) setMyTeams(null)
  }

  const onAddTeam = async () => {
    if (fetchingTeams || adding) return
    if (!authenticated) {
      notifyInfo('Log in to add your team to this tournament.')
      navigate('/login')
      return
    }

    setFetchingTeams(true)
    let teams
    try {
      teams = await fetchTeams()
    } catch (error) {
      notifyError(getErrorMessage(error))
      return
    } finally {
      setFetchingTeams(false)
    }

    if (teams.length === 0) {
      notifyInfo('Create a team first to add it to this tournament.')
      navigate('/teams/new')
      return
    }

    if (teams.length === 1) {
      const [team] = teams
      if (addedIds.includes(team.id)) {
        notifyInfo(`${team.name} is already added to this tournament.`)
        return
      }
      await confirm([team])
      return
    }

    setMyTeams(teams)
  }

  return {
    onAddTeam,
    busy: fetchingTeams || adding,
    myTeams,
    closeModal: () => setMyTeams(null),
    confirm,
  }
}
