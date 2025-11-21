import { Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from '@/features/auth/LoginPage'
import OnboardingLayout from '@/features/onboarding/components/OnboardingLayout'
import OnboardingIndexRedirect from '@/features/onboarding/components/OnboardingIndexRedirect'
import PersonalProfilePage from '@/features/onboarding/pages/PersonalProfilePage'
import FavoriteSongsPage from '@/features/onboarding/pages/FavoriteSongsPage'
import PaymentInformationPage from '@/features/onboarding/pages/PaymentInformationPage'
import OnboardingSuccessPage from '@/features/onboarding/pages/OnboardingSuccessPage'
import HomePage from '@/features/home/HomePage'
import {
  RequireAuth,
  RequireOnboardingCompleted,
  RequireOnboardingIncomplete,
} from '@/routes/guards'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />

      <Route element={<RequireAuth />}>
        <Route element={<RequireOnboardingIncomplete />}>
          <Route path="/onboarding" element={<OnboardingLayout />}>
            <Route index element={<OnboardingIndexRedirect />} />
            <Route path="step-1" element={<PersonalProfilePage />} />
            <Route path="step-2" element={<FavoriteSongsPage />} />
            <Route path="step-3" element={<PaymentInformationPage />} />
            <Route path="step-4" element={<OnboardingSuccessPage />} />
          </Route>
        </Route>

        <Route element={<RequireOnboardingCompleted />}>
          <Route path="/home" element={<HomePage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
