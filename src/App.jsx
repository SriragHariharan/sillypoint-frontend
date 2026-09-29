import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import RedirectIfAuthed from './components/RedirectIfAuthed'
import RequireAuth from './components/RequireAuth'
import { restoreSession } from './lib/session'
import LandingPage from './pages/LandingPage'
import MobileEntryPage from './pages/MobileEntryPage'
import VerifyOtpPage from './pages/VerifyOtpPage'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  useEffect(() => {
    restoreSession()
  }, [])

  return (
    <BrowserRouter>
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
              <HomePage />
            </RequireAuth>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
