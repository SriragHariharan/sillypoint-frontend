import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import RedirectIfAuthed from './components/RedirectIfAuthed'
import RequireAuth from './components/RequireAuth'
import { TOAST_DURATION_MS } from './lib/constants'
import { restoreSession } from './lib/session'
import LandingPage from './pages/LandingPage'
import MobileEntryPage from './pages/MobileEntryPage'
import VerifyOtpPage from './pages/VerifyOtpPage'
import DashboardPage from './pages/DashboardPage'
import AddTournamentPage from './pages/AddTournamentPage'
import TournamentsPage from './pages/TournamentsPage'
import TournamentDetailsPage from './pages/TournamentDetailsPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  useEffect(() => {
    restoreSession()
  }, [])

  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        gutter={12}
        containerStyle={{ top: 16 }}
        toastOptions={{ duration: TOAST_DURATION_MS }}
      />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={
            <RedirectIfAuthed>
              <MobileEntryPage />
            </RedirectIfAuthed>
          }
        />
        <Route
          path="/signup"
          element={
            <RedirectIfAuthed>
              <MobileEntryPage />
            </RedirectIfAuthed>
          }
        />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route
          path="/home"
          element={
            <RequireAuth>
              <DashboardPage />
            </RequireAuth>
          }
        />
        <Route
          path="/tournaments/new"
          element={
            <RequireAuth>
              <AddTournamentPage />
            </RequireAuth>
          }
        />
        <Route path="/tournaments" element={<TournamentsPage />} />
        <Route path="/tournaments/:id" element={<TournamentDetailsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
