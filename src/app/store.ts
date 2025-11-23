import { combineReducers, configureStore } from '@reduxjs/toolkit'
import authReducer from '@/features/auth/authSlice'
import onboardingReducer from '@/features/onboarding/onboardingSlice'
import { loadAppState, saveAppState } from '@/lib/storage'

const rootReducer = combineReducers({
  auth: authReducer,
  onboarding: onboardingReducer,
})

export type RootState = ReturnType<typeof rootReducer>
type PersistedState = Partial<RootState>

const persistedState = loadAppState<PersistedState>()

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: persistedState,
})

store.subscribe(() => {
  const state = store.getState()

  saveAppState({
    auth: state.auth,
    onboarding: state.onboarding,
  })
})

export type AppDispatch = typeof store.dispatch

