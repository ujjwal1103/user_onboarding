import { Navigate } from 'react-router-dom'
import { useAppSelector } from '@/app/hooks'

const OnboardingIndexRedirect = () => {
  const { currentStep } = useAppSelector((state) => state.onboarding)

  return <Navigate to={`/onboarding/step-${currentStep}`} replace />
}

export default OnboardingIndexRedirect


