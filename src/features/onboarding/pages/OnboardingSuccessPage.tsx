import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { Button } from '@/components/ui/button'
import { completeStep, goToStep } from '@/features/onboarding/onboardingSlice'

const OnboardingSuccessPage = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { profile, favoriteSongs, payment, completedSteps } = useAppSelector(
    (state) => state.onboarding,
  )

  useEffect(() => {
    dispatch(goToStep(4))
    if (!completedSteps.includes(4)) {
      dispatch(completeStep(4))
    }
  }, [completedSteps, dispatch])

  const lastFourDigits = payment.cardNumber.replace(/\s/g, '').slice(-4)
  const hasPaymentDetails = Boolean(lastFourDigits && payment.expiryDate)

  const handleFinish = () => {
    navigate('/home')
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <span className="text-2xl">🎉</span>
        </div>
        <h2 className="text-2xl font-semibold text-slate-900">You’re all set!</h2>
        <p className="text-sm text-slate-600">
          Thanks for sharing your details. Your profile is ready and we’ve saved everything for
          future sessions.
        </p>
      </header>

      <section className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Your summary
        </h3>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <h4 className="text-base font-semibold text-slate-800">Profile</h4>
            <dl className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-3">
              <div>
                <dt className="font-medium text-slate-700">Name</dt>
                <dd>{profile.name || '—'}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-700">Age</dt>
                <dd>{profile.age || '—'}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-700">Email</dt>
                <dd>{profile.email || '—'}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <h4 className="text-base font-semibold text-slate-800">Favorite songs</h4>
            {favoriteSongs.length > 0 ? (
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {favoriteSongs.map((song) => (
                  <li key={song} className="flex items-center gap-2">
                    <span className="text-primary">♪</span>
                    <span>{song}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-slate-500">No songs selected.</p>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <h4 className="text-base font-semibold text-slate-800">Payment details</h4>
            {hasPaymentDetails ? (
              <div className="mt-3 space-y-1 text-sm text-slate-600">
                <p>
                  Card ending in <span className="font-medium text-slate-700">{lastFourDigits}</span>
                </p>
                <p>Expires {payment.expiryDate}</p>
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-500">No payment details provided.</p>
            )}
          </div>
        </div>
      </section>

      <footer className="flex justify-center">
        <Button size="lg" onClick={handleFinish}>
          Go to dashboard
        </Button>
      </footer>
    </div>
  )
}

export default OnboardingSuccessPage


