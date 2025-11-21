import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppSelector } from '@/app/hooks'

export const RequireAuth = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}

export const RequireOnboardingIncomplete = () => {
  const { isComplete } = useAppSelector((state) => state.onboarding)

  if (isComplete) {
    return <Navigate to="/home" replace />
  }

  return <Outlet />
}

export const RequireOnboardingCompleted = () => {
  const { isComplete } = useAppSelector((state) => state.onboarding)

  if (!isComplete) {
    return <Navigate to="/onboarding" replace />
  }

  return <Outlet />
}


