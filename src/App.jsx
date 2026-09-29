import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import MobileEntryPage from './pages/MobileEntryPage'
import VerifyOtpPage from './pages/VerifyOtpPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<MobileEntryPage />} />
        <Route path="/signup" element={<MobileEntryPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
