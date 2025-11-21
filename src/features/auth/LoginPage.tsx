import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { clearError, login } from '@/features/auth/authSlice'
import { Button } from '@/components/ui/button'

interface Credentials {
  username: string
  password: string
}

const DEFAULT_CREDENTIALS: Credentials = {
  username: 'user123',
  password: 'password123',
}

export const LoginPage = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { isAuthenticated, error } = useAppSelector((state) => state.auth)
  const { isComplete, currentStep } = useAppSelector((state) => state.onboarding)

  const [credentials, setCredentials] = useState<Credentials>(DEFAULT_CREDENTIALS)
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) return

    if (isComplete) {
      navigate('/home', { replace: true })
      return
    }

    navigate(`/onboarding/step-${currentStep}`, { replace: true })
  }, [isAuthenticated, isComplete, currentStep, navigate])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitted(true)
    dispatch(login(credentials))
  }

  const handleFieldChange =
    (key: keyof Credentials) => (event: React.ChangeEvent<HTMLInputElement>) => {
      if (error) {
        dispatch(clearError())
      }

      setCredentials((previous) => ({
        ...previous,
        [key]: event.target.value,
      }))
    }

  const showValidation = isSubmitted && (!credentials.username || !credentials.password)

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900/5 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg shadow-slate-900/10">
        <header className="mb-8 space-y-2">
          <h1 className="text-2xl font-semibold text-slate-900">Welcome back</h1>
          <p className="text-sm text-slate-500">
            Use the sample credentials below to access the onboarding experience.
          </p>
          <div className="rounded-lg bg-slate-100 p-4 text-sm text-slate-600">
            <p>
              <span className="font-medium text-slate-700">Username:</span> user123
            </p>
            <p>
              <span className="font-medium text-slate-700">Password:</span> password123
            </p>
          </div>
        </header>

        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={credentials.username}
              onChange={handleFieldChange('username')}
              autoComplete="username"
              placeholder="Enter your username"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-base shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={credentials.password}
              onChange={handleFieldChange('password')}
              autoComplete="current-password"
              placeholder="Enter your password"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-base shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>

          {showValidation && (
            <p className="text-sm text-rose-500">Username and password are required.</p>
          )}

          {error && <p className="text-sm text-rose-500">{error}</p>}

          <Button type="submit" className="w-full">
            Continue
          </Button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage


