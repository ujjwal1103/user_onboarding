import { useEffect, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { Button } from '@/components/ui/button'
import {
  completeStep,
  goToStep,
  setPaymentDetails,
  type PaymentDetails,
} from '@/features/onboarding/onboardingSlice'

type PaymentFieldKey = keyof PaymentDetails
type PaymentErrors = Partial<Record<PaymentFieldKey, string>>

const MAX_CARD_DIGITS = 16
const MAX_CVV_DIGITS = 4

const formatCardNumber = (input: string) => {
  const digitsOnly = input.replace(/\D/g, '').slice(0, MAX_CARD_DIGITS)
  return digitsOnly.replace(/(\d{4})(?=\d)/g, '$1 ')
}

const formatExpiryDate = (input: string) => {
  const digitsOnly = input.replace(/\D/g, '').slice(0, 4)
  if (digitsOnly.length <= 2) {
    return digitsOnly
  }
  return `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2)}`
}

const PaymentInformationPage = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const storedPayment = useAppSelector((state) => state.onboarding.payment)

  const [payment, setPayment] = useState<PaymentDetails>(storedPayment)
  const [errors, setErrors] = useState<PaymentErrors>({})

  useEffect(() => {
    setPayment(storedPayment)
  }, [storedPayment])

  const updateField = (key: PaymentFieldKey, value: string) => {
    setErrors((previous) => {
      if (!(key in previous)) {
        return previous
      }
      const next = { ...previous }
      delete next[key]
      return next
    })

    setPayment((previous) => ({
      ...previous,
      [key]: value,
    }))
  }

  const handleCardNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
    updateField('cardNumber', formatCardNumber(event.target.value))
  }

  const handleExpiryDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    updateField('expiryDate', formatExpiryDate(event.target.value))
  }

  const handleCVVChange = (event: ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = event.target.value.replace(/\D/g, '').slice(0, MAX_CVV_DIGITS)
    updateField('cvv', digitsOnly)
  }

  const validatePayment = (value: PaymentDetails): PaymentErrors => {
    const validationErrors: PaymentErrors = {}

    const normalizedCardDigits = value.cardNumber.replace(/\s/g, '')
    if (!normalizedCardDigits) {
      validationErrors.cardNumber = 'Card number is required.'
    } else if (normalizedCardDigits.length !== MAX_CARD_DIGITS) {
      validationErrors.cardNumber = 'Enter a 16-digit card number.'
    }

    if (!value.expiryDate) {
      validationErrors.expiryDate = 'Expiry date is required.'
    } else {
      const expiryPattern = /^(0[1-9]|1[0-2])\/\d{2}$/
      if (!expiryPattern.test(value.expiryDate)) {
        validationErrors.expiryDate = 'Use MM/YY format.'
      } else {
        const [monthString, yearString] = value.expiryDate.split('/')
        const month = Number(monthString)
        const year = Number(yearString)
        const now = new Date()
        const currentYear = now.getFullYear() % 100
        const currentMonth = now.getMonth() + 1

        if (year < currentYear || (year === currentYear && month < currentMonth)) {
          validationErrors.expiryDate = 'This card is expired.'
        }
      }
    }

    if (!value.cvv) {
      validationErrors.cvv = 'Security code is required.'
    } else if (value.cvv.length < 3 || value.cvv.length > 4) {
      validationErrors.cvv = 'Security code must be 3 or 4 digits.'
    }

    return validationErrors
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const validationErrors = validatePayment(payment)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setErrors({})
    dispatch(setPaymentDetails(payment))
    dispatch(completeStep(3))
    dispatch(goToStep(4))
    navigate('/onboarding/step-4')
  }

  const getError = (key: PaymentFieldKey) => errors[key]

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h2 className="text-xl font-semibold text-slate-900">Payment Information</h2>
        <p className="text-sm text-slate-600">
          Add your billing details so we can enable premium features later.
        </p>
      </header>

      <form className="space-y-8" onSubmit={handleSubmit} noValidate>
        <section className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="payment-card-number">
              Card number
            </label>
            <input
              id="payment-card-number"
              name="cardNumber"
              type="text"
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="1234 5678 9012 3456"
              value={payment.cardNumber}
              onChange={handleCardNumberChange}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-base shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              aria-invalid={Boolean(getError('cardNumber')) || undefined}
              aria-describedby={getError('cardNumber') ? 'payment-card-number-error' : undefined}
              required
            />
            {getError('cardNumber') && (
              <p id="payment-card-number-error" className="text-sm text-rose-500">
                {errors.cardNumber}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="payment-expiry">
              Expiry date
            </label>
            <input
              id="payment-expiry"
              name="expiryDate"
              type="text"
              inputMode="numeric"
              autoComplete="cc-exp"
              placeholder="MM/YY"
              value={payment.expiryDate}
              onChange={handleExpiryDateChange}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-base shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              aria-invalid={Boolean(getError('expiryDate')) || undefined}
              aria-describedby={getError('expiryDate') ? 'payment-expiry-error' : undefined}
              required
            />
            {getError('expiryDate') && (
              <p id="payment-expiry-error" className="text-sm text-rose-500">
                {errors.expiryDate}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="payment-cvv">
              Security code
            </label>
            <input
              id="payment-cvv"
              name="cvv"
              type="password"
              inputMode="numeric"
              autoComplete="cc-csc"
              placeholder="123"
              value={payment.cvv}
              onChange={handleCVVChange}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-base shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              aria-invalid={Boolean(getError('cvv')) || undefined}
              aria-describedby={getError('cvv') ? 'payment-cvv-error' : undefined}
              required
            />
            {getError('cvv') && (
              <p id="payment-cvv-error" className="text-sm text-rose-500">
                {errors.cvv}
              </p>
            )}
          </div>
        </section>

        <footer className="flex justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              dispatch(goToStep(2))
              navigate('/onboarding/step-2')
            }}
          >
            Back
          </Button>
          <Button type="submit">Review and finish</Button>
        </footer>
      </form>
    </div>
  )
}

export default PaymentInformationPage


