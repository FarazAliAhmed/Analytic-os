'use client'

import { useState } from 'react'
import SignInModal from '@/components/dashboard/SignInModal'
import SignUpModal from '@/components/dashboard/SignUpModal'
import { HeroSection } from '@/components/landing/HeroSection'

export default function Home() {
  const [showSignIn, setShowSignIn] = useState(false)
  const [showSignUp, setShowSignUp] = useState(false)

  return (
    <div className="min-h-screen">
      <HeroSection
        onOpenSignIn={() => setShowSignIn(true)}
        onOpenSignUp={() => setShowSignUp(true)}
      />

      {/* Sign In Modal */}
      <SignInModal
        open={showSignIn}
        onClose={() => setShowSignIn(false)}
        onSwitchToSignup={() => {
          setShowSignIn(false)
          setShowSignUp(true)
        }}
      />

      {/* Sign Up Modal */}
      <SignUpModal
        open={showSignUp}
        onClose={() => setShowSignUp(false)}
        onSwitchToSignin={() => {
          setShowSignUp(false)
          setShowSignIn(true)
        }}
      />
    </div>
  )
}
