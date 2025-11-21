import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export type OnboardingStep = 1 | 2 | 3 | 4

export interface PersonalProfile {
  name: string
  age: string
  email: string
  profilePicture?: string
}

export interface PaymentDetails {
  cardNumber: string
  expiryDate: string
  cvv: string
}

export interface OnboardingState {
  currentStep: OnboardingStep
  completedSteps: OnboardingStep[]
  isComplete: boolean
  profile: PersonalProfile
  favoriteSongs: string[]
  payment: PaymentDetails
}

const INITIAL_PROFILE: PersonalProfile = {
  name: '',
  age: '',
  email: '',
  profilePicture: undefined,
}

const INITIAL_PAYMENT: PaymentDetails = {
  cardNumber: '',
  expiryDate: '',
  cvv: '',
}

const initialState: OnboardingState = {
  currentStep: 1,
  completedSteps: [],
  isComplete: false,
  profile: INITIAL_PROFILE,
  favoriteSongs: [''],
  payment: INITIAL_PAYMENT,
}

const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    goToStep(state, action: PayloadAction<OnboardingStep>) {
      state.currentStep = action.payload
    },
    completeStep(state, action: PayloadAction<OnboardingStep>) {
      const step = action.payload
      if (!state.completedSteps.includes(step)) {
        state.completedSteps.push(step)
      }

      if (step === 4) {
        state.isComplete = true
      }
    },
    setProfile(state, action: PayloadAction<PersonalProfile>) {
      state.profile = action.payload
    },
    setFavoriteSongs(state, action: PayloadAction<string[]>) {
      state.favoriteSongs = action.payload
    },
    setPaymentDetails(state, action: PayloadAction<PaymentDetails>) {
      state.payment = action.payload
    },
    resetOnboarding() {
      return initialState
    },
  },
})

export const {
  goToStep,
  completeStep,
  setProfile,
  setFavoriteSongs,
  setPaymentDetails,
  resetOnboarding,
} = onboardingSlice.actions

export default onboardingSlice.reducer


