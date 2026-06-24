'use client'

import { useState } from 'react'
import { X, ArrowLeft, ShieldCheck, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'

interface SmileIDKYCModalProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

type KYCStep = 'intro' | 'nin-form' | 'processing' | 'success' | 'error'

export function SmileIDKYCModal({ open, onClose, onSuccess }: SmileIDKYCModalProps) {
  const [step, setStep] = useState<KYCStep>('intro')
  const [nin, setNin] = useState('')
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (!open) return null

  const reset = () => {
    setStep('intro')
    setNin('')
    setFirstname('')
    setLastname('')
    setError('')
    setLoading(false)
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (nin.length !== 11 || !/^\d{11}$/.test(nin)) {
      setError('NIN must be exactly 11 digits')
      return
    }
    if (!firstname.trim() || !lastname.trim()) {
      setError('First name and last name are required')
      return
    }

    setError('')
    setLoading(true)
    setStep('processing')

    try {
      const res = await fetch('/api/kyc/verify-nin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nin, firstname: firstname.trim(), lastname: lastname.trim() }),
      })

      const data = await res.json()

      if (data.verified) {
        setStep('success')
        setTimeout(() => {
          reset()
          onSuccess()
          onClose()
        }, 2500)
      } else {
        setError(data.error || 'NIN could not be verified. Please check your details.')
        setStep('error')
      }
    } catch (err: any) {
      setError('Something went wrong. Please try again.')
      setStep('error')
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch (step) {
      case 'intro':
        return (
          <div className="space-y-5">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-[#4459FF]/10 flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-[#4459FF]" />
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-white font-semibold text-base mb-1">Verify Your Identity</h3>
              <p className="text-sm text-gray-400">
                We use your National Identification Number (NIN) to verify your identity. This is required to enable withdrawals.
              </p>
            </div>

            <div className="bg-[#0A0A0A] rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <span className="text-green-400">✓</span> Quick — takes less than 30 seconds
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <span className="text-green-400">✓</span> No selfie or document upload needed
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <span className="text-green-400">✓</span> Your data is encrypted and secure
              </div>
            </div>

            <button
              onClick={() => setStep('nin-form')}
              className="w-full py-3 bg-[#4459FF] hover:bg-[#3448EE] text-white rounded-lg transition-colors font-medium"
            >
              Start Verification
            </button>
          </div>
        )

      case 'nin-form':
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                First Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                placeholder="As it appears on your NIN"
                className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#262626] rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#4459FF] transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Last Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                placeholder="As it appears on your NIN"
                className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#262626] rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#4459FF] transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                NIN (National Identification Number) <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={nin}
                onChange={(e) => setNin(e.target.value.replace(/\D/g, '').slice(0, 11))}
                placeholder="Enter your 11-digit NIN"
                className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#262626] rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#4459FF] transition-colors tracking-widest"
                maxLength={11}
                required
              />
              <p className="text-xs text-gray-500 mt-1">{nin.length}/11 digits</p>
            </div>

            <button
              type="submit"
              disabled={nin.length !== 11 || !firstname.trim() || !lastname.trim()}
              className="w-full py-3 bg-[#4459FF] hover:bg-[#3448EE] disabled:bg-[#4459FF]/40 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
            >
              Verify NIN
            </button>
          </form>
        )

      case 'processing':
        return (
          <div className="text-center py-8 space-y-4">
            <div className="flex justify-center">
              <Loader2 className="w-12 h-12 text-[#4459FF] animate-spin" />
            </div>
            <h3 className="text-white font-semibold">Verifying your NIN...</h3>
            <p className="text-sm text-gray-400">This usually takes a few seconds</p>
          </div>
        )

      case 'success':
        return (
          <div className="text-center py-8 space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
            </div>
            <h3 className="text-white font-semibold text-lg">Identity Verified!</h3>
            <p className="text-sm text-gray-400">
              Your NIN has been verified successfully. You can now withdraw funds.
            </p>
          </div>
        )

      case 'error':
        return (
          <div className="text-center py-8 space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-red-500" />
              </div>
            </div>
            <h3 className="text-white font-semibold text-lg">Verification Failed</h3>
            <p className="text-sm text-gray-400">{error}</p>
            <button
              onClick={() => { setStep('nin-form'); setError('') }}
              className="w-full py-3 bg-[#4459FF] hover:bg-[#3448EE] text-white rounded-lg transition-colors font-medium"
            >
              Try Again
            </button>
          </div>
        )
    }
  }

  const showBackButton = step === 'nin-form'
  const title = step === 'intro' ? 'KYC Verification'
    : step === 'nin-form' ? 'Enter Your NIN'
    : step === 'processing' ? 'Verifying...'
    : step === 'success' ? 'Verified'
    : 'Verification Failed'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div className="bg-[#1A1A1A] rounded-xl w-full max-w-md border border-[#262626]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#262626]">
          <div className="flex items-center gap-3">
            {showBackButton && (
              <button
                onClick={() => { setStep('intro'); setError('') }}
                className="p-1 text-gray-400 hover:text-white transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <h2 className="text-lg font-semibold text-white">{title}</h2>
          </div>
          {step !== 'processing' && step !== 'success' && (
            <button
              onClick={handleClose}
              className="p-1 text-gray-400 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-5">
          {renderStep()}
        </div>
      </div>
    </div>
  )
}
