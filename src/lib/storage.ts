const STORAGE_KEY = 'user_onboarding_app_state'

type PersistableState = Record<string, unknown>

const isBrowser = () => typeof window !== 'undefined'

export const loadAppState = <T extends PersistableState>(): T | undefined => {
  if (!isBrowser()) return undefined

  try {
    const serializedState = window.localStorage.getItem(STORAGE_KEY)
    if (!serializedState) return undefined
    return JSON.parse(serializedState) as T
  } catch (error) {
    console.warn('Unable to load state from localStorage', error)
    return undefined
  }
}

export const saveAppState = <T extends PersistableState>(state: T) => {
  if (!isBrowser()) return

  try {
    const serializedState = JSON.stringify(state)
    window.localStorage.setItem(STORAGE_KEY, serializedState)
  } catch (error) {
    console.warn('Unable to save state to localStorage', error)
  }
}


