import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { Button } from '@/components/ui/button'
import {
  completeStep,
  goToStep,
  setProfile,
  type PersonalProfile,
} from '@/features/onboarding/onboardingSlice'

const MAX_PROFILE_IMAGE_SIZE = 2 * 1024 * 1024

type ProfileFormErrors = Partial<Record<'name' | 'age' | 'email' | 'profilePicture', string>>

const PersonalProfilePage = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const storedProfile = useAppSelector((state) => state.onboarding.profile)

  const [profile, setProfileState] = useState<PersonalProfile>(storedProfile)
  const [errors, setErrors] = useState<ProfileFormErrors>({})
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    setProfileState(storedProfile)
  }, [storedProfile])

  const removeError = (key: keyof ProfileFormErrors) => {
    setErrors((previous) => {
      if (!(key in previous)) {
        return previous
      }

      const rest = { ...previous }
      delete rest[key]
      return rest
    })
  }

  const handleFieldChange =
    (key: keyof PersonalProfile) => (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value
      removeError(key)
      setProfileState((previous) => ({
        ...previous,
        [key]: value,
      }))
    }

  const handleProfilePictureChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    removeError('profilePicture')

    if (!file) {
      return
    }

    if (!file.type.startsWith('image/')) {
      setErrors((previous) => ({
        ...previous,
        profilePicture: 'Please choose an image file.',
      }))
      return
    }

    if (file.size > MAX_PROFILE_IMAGE_SIZE) {
      setErrors((previous) => ({
        ...previous,
        profilePicture: 'Profile photos must be 2 MB or smaller.',
      }))
      return
    }

    setIsProcessingPhoto(true)

    const reader = new FileReader()
    reader.onloadend = () => {
      setIsProcessingPhoto(false)
      const result = reader.result
      if (typeof result === 'string') {
        setProfileState((previous) => ({
          ...previous,
          profilePicture: result,
        }))
      } else {
        setErrors((previous) => ({
          ...previous,
          profilePicture: 'Unable to read the selected image.',
        }))
      }
    }
    reader.onerror = () => {
      setIsProcessingPhoto(false)
      setErrors((previous) => ({
        ...previous,
        profilePicture: 'Unable to read the selected image.',
      }))
    }

    reader.readAsDataURL(file)
  }

  const clearProfilePicture = () => {
    removeError('profilePicture')
    setProfileState((previous) => ({
      ...previous,
      profilePicture: undefined,
    }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const validateProfile = (value: PersonalProfile): ProfileFormErrors => {
    const nextErrors: ProfileFormErrors = {}

    if (!value.name.trim()) {
      nextErrors.name = 'Your name is required.'
    }

    if (!value.age.trim()) {
      nextErrors.age = 'Please tell us your age.'
    } else {
      const ageNumber = Number(value.age)
      if (!Number.isFinite(ageNumber)) {
        nextErrors.age = 'Age must be a number.'
      } else if (ageNumber < 13 || ageNumber > 120) {
        nextErrors.age = 'Age should be between 13 and 120.'
      }
    }

    if (!value.email.trim()) {
      nextErrors.email = 'We need your email address.'
    } else {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailPattern.test(value.email)) {
        nextErrors.email = 'Enter a valid email address.'
      }
    }

    return nextErrors
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const validationErrors = validateProfile(profile)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setErrors({})
    dispatch(setProfile(profile))
    dispatch(completeStep(1))
    dispatch(goToStep(2))
    navigate('/onboarding/step-2')
  }

  const showError = (key: keyof ProfileFormErrors) => Boolean(errors[key])

  return (
    <div className="space-y-6">
      <header className="space-y-1">
      <h2 className="text-xl font-semibold text-slate-900">Personal Profile</h2>
      <p className="text-sm text-slate-600">
          Share a few details so we can tailor the experience to you.
        </p>
      </header>

      <form className="space-y-8" onSubmit={handleSubmit} noValidate>
        <section className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="profile-name">
              Full name
            </label>
            <input
              id="profile-name"
              name="name"
              type="text"
              value={profile.name}
              onChange={handleFieldChange('name')}
              placeholder="Enter your full name"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-base shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              aria-invalid={showError('name') || undefined}
              aria-describedby={showError('name') ? 'profile-name-error' : undefined}
              required
            />
            {showError('name') && (
              <p id="profile-name-error" className="text-sm text-rose-500">
                {errors.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="profile-age">
              Age
            </label>
            <input
              id="profile-age"
              name="age"
              type="number"
              inputMode="numeric"
              value={profile.age}
              onChange={handleFieldChange('age')}
              placeholder="How old are you?"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-base shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              aria-invalid={showError('age') || undefined}
              aria-describedby={showError('age') ? 'profile-age-error' : undefined}
              required
            />
            {showError('age') && (
              <p id="profile-age-error" className="text-sm text-rose-500">
                {errors.age}
              </p>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="profile-email">
              Email address
            </label>
            <input
              id="profile-email"
              name="email"
              type="email"
              value={profile.email}
              onChange={handleFieldChange('email')}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-base shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              autoComplete="email"
              aria-invalid={showError('email') || undefined}
              aria-describedby={showError('email') ? 'profile-email-error' : undefined}
              required
            />
            {showError('email') && (
              <p id="profile-email-error" className="text-sm text-rose-500">
                {errors.email}
              </p>
            )}
          </div>
        </section>

        <section className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Profile photo</label>
            <div className="flex flex-col gap-4 rounded-lg border border-dashed border-slate-300 p-4">
              {profile.profilePicture ? (
                <div className="flex items-center gap-4">
                  <img
                    src={profile.profilePicture}
                    alt="Profile preview"
                    className="size-16 rounded-full object-cover"
                  />
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={clearProfilePicture}>
                      Remove photo
                    </Button>
                    <label
                      htmlFor="profile-picture"
                      className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                    >
                      Change photo
                    </label>
                  </div>
                </div>
              ) : (
                <label
                  htmlFor="profile-picture"
                  className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-6 py-8 text-center text-sm text-slate-500 transition hover:border-primary/60 hover:bg-primary/5 hover:text-primary"
                >
                  <span className="font-medium text-slate-700">Upload a profile photo</span>
                  <span className="text-xs text-slate-500">JPG, PNG or GIF up to 2 MB.</span>
                </label>
              )}

              <input
                ref={fileInputRef}
                id="profile-picture"
                name="profilePicture"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleProfilePictureChange}
              />
              {isProcessingPhoto && <p className="text-sm text-slate-500">Processing image…</p>}
              {showError('profilePicture') && (
                <p className="text-sm text-rose-500">{errors.profilePicture}</p>
              )}
            </div>
          </div>
        </section>

        <footer className="flex justify-end">
          <Button type="submit" disabled={isProcessingPhoto}>
            Continue to favorite songs
          </Button>
        </footer>
      </form>
    </div>
  )
}

export default PersonalProfilePage


