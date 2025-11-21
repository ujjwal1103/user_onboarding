import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

const VALID_CREDENTIALS = {
  username: 'user123',
  password: 'password123',
}

export interface AuthState {
  isAuthenticated: boolean
  user: { username: string } | null
  error: string | null
  lastLoginAt?: string
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ username: string; password: string }>) {
      const { username, password } = action.payload
      const isValid =
        username === VALID_CREDENTIALS.username && password === VALID_CREDENTIALS.password

      if (isValid) {
        state.isAuthenticated = true
        state.user = { username }
        state.error = null
        state.lastLoginAt = new Date().toISOString()
      } else {
        state.isAuthenticated = false
        state.user = null
        state.error = 'Invalid credentials. Try user123 / password123.'
      }
    },
    logout(state) {
      state.isAuthenticated = false
      state.user = null
      state.error = null
      state.lastLoginAt = undefined
    },
    clearError(state) {
      state.error = null
    },
  },
})

export const { login, logout, clearError } = authSlice.actions
export default authSlice.reducer


