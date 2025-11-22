import { Outlet, useNavigate } from 'react-router-dom'
import { useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { goToStep, type OnboardingStep } from '@/features/onboarding/onboardingSlice'
import LogoutButton from '@/features/auth/components/LogoutButton'

const STEPS = [
  { step: 1, title: 'Personal Profile', description: 'Tell us about yourself' },
  { step: 2, title: 'Favorite Songs', description: 'Share what you love hearing' },
  { step: 3, title: 'Payment Information', description: 'Secure your billing details' },
  { step: 4, title: 'Success', description: 'Review and finish' },
] as const

const STEP_ROUTES: Record<OnboardingStep, string> = {
  1: '/onboarding/step-1',
  2: '/onboarding/step-2',
  3: '/onboarding/step-3',
  4: '/onboarding/step-4',
}

export const OnboardingLayout = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { currentStep, completedSteps } = useAppSelector((state) => state.onboarding)

  const progressPercentage = useMemo(() => {
    const totalSteps = STEPS.length
    const completedCount = completedSteps.length
    // ensure progress never goes backwards visually from current step
    const effectiveCount = Math.max(completedCount, currentStep - 1)
    return Math.round((effectiveCount / (totalSteps - 1)) * 100)
  }, [completedSteps, currentStep])

  const handleNavigate = (step: OnboardingStep) => {
    const canVisit = step <= currentStep || completedSteps.includes(step)
    if (!canVisit) return

    dispatch(goToStep(step))
    navigate(STEP_ROUTES[step])
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900/5 via-white to-primary/5 px-4 py-12">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header className="rounded-3xl bg-white/80 p-8 shadow-xl shadow-slate-900/10 backdrop-blur">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  Onboarding journey
                </p>
                <h1 className="mt-2 text-3xl font-semibold text-slate-900">
                  Complete the steps to personalize your experience
                </h1>
              </div>
              <div className="flex items-center gap-3 self-start text-sm text-slate-600">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Step {currentStep} of {STEPS.length}
                </span>
                <LogoutButton />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wide text-slate-400">
                <span>Progress</span>
                <span>{progressPercentage}%</span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            <nav className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Onboarding steps">
              {STEPS.map(({ step, title, description }) => {
                const isActive = step === currentStep
                const isComplete = completedSteps.includes(step)
                const canNavigate = step <= currentStep || isComplete

                return (
                  <button
                    key={step}
                    type="button"
                    onClick={() => handleNavigate(step)}
                    disabled={!canNavigate}
                    className={`flex h-full flex-col items-start gap-2 rounded-2xl border p-4 text-left transition ${
                      isActive
                        ? 'border-primary/60 bg-primary/5 text-primary'
                        : isComplete
                          ? 'border-emerald-300/80 bg-emerald-50 text-emerald-700 hover:border-emerald-300 hover:bg-emerald-100'
                          : 'border-slate-200 bg-slate-50 text-slate-500'
                    } ${canNavigate ? 'hover:-translate-y-0.5 hover:shadow-md' : 'cursor-not-allowed opacity-60'}`}
                    aria-current={isActive ? 'step' : undefined}
                  >
                    <span className="text-xs font-semibold uppercase tracking-wide">
                      Step {step}
                    </span>
                    <span className="text-sm font-medium">{title}</span>
                    <span className="text-xs text-slate-500">{description}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </header>

        <main className="rounded-3xl bg-white p-10 shadow-xl shadow-slate-900/10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default OnboardingLayout


