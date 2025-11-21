import { Outlet } from 'react-router-dom'
import { useAppSelector } from '@/app/hooks'

const STEPS = [
  { step: 1, title: 'Personal Profile' },
  { step: 2, title: 'Favorite Songs' },
  { step: 3, title: 'Payment Information' },
  { step: 4, title: 'Success' },
] as const

export const OnboardingLayout = () => {
  const { currentStep } = useAppSelector((state) => state.onboarding)

  return (
    <div className="min-h-screen bg-slate-900/5 px-4 py-12">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <header className="rounded-2xl bg-white p-6 shadow-lg shadow-slate-900/5">
          <p className="text-sm uppercase tracking-wide text-slate-500">Onboarding</p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">
            Complete the steps to finish setting up your account
          </h1>
          <nav className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(({ step, title }) => {
              const isActive = step === currentStep
              return (
                <div
                  key={step}
                  className={`rounded-xl border p-4 transition ${
                    isActive
                      ? 'border-primary/60 bg-primary/5 text-primary'
                      : 'border-slate-200 bg-slate-50 text-slate-500'
                  }`}
                >
                  <p className="text-xs font-semibold uppercase tracking-wide">Step {step}</p>
                  <p className="mt-1 text-sm font-medium">{title}</p>
                </div>
              )
            })}
          </nav>
        </header>

        <main className="rounded-2xl bg-white p-8 shadow-lg shadow-slate-900/5">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default OnboardingLayout


