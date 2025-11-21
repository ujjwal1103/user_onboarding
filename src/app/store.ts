import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@/features/auth/authSlice'
import onboardingReducer from '@/features/onboarding/onboardingSlice'
import { loadAppState, saveAppState } from '@/lib/storage'

type PersistedState = Partial<{
  auth: ReturnType<typeof authReducer>
  onboarding: ReturnType<typeof onboardingReducer>
}>

const persistedState = loadAppState<PersistedState>()

export const store = configureStore({
  reducer: {
    auth: authReducer,
    onboarding: onboardingReducer,
  },
  preloadedState: persistedState,
})

store.subscribe(() => {
  const state = store.getState()

  saveAppState({
    auth: state.auth,
    onboarding: state.onboarding,
  })
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch


