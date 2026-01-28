'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { NotificationBell } from './NotificationBell'
import SignInModal from './SignInModal'
import SignUpModal from './SignUpModal'

interface MobileHeaderProps {
  onOpenExplore: () => void
  onOpenSearch: () => void
}

export function MobileHeader({ onOpenExplore, onOpenSearch }: MobileHeaderProps) {
  const { data: session, status } = useSession()
  const [showSignIn, setShowSignIn] = useState(false)
  const [showSignUp, setShowSignUp] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#0A0A0A] border-b border-[#1A1A1A]">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">W</span>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSearch}
              className="p-2 hover:bg-[#1A1A1A] rounded-lg transition-colors"
              aria-label="Search"
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {status === 'authenticated' && <NotificationBell />}

            <button
              onClick={onOpenExplore}
              className="px-3 py-1.5 bg-[#1A1A1A] hover:bg-[#252525] rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span className="text-white text-sm font-medium">EXPLORE</span>
            </button>
          </div>
        </div>
      </header>

      <SignInModal
        open={showSignIn}
        onClose={() => setShowSignIn(false)}
        onSwitchToSignup={() => {
          setShowSignIn(false)
          setShowSignUp(true)
        }}
      />

      <SignUpModal
        open={showSignUp}
        onClose={() => setShowSignUp(false)}
        onSwitchToSignin={() => {
          setShowSignUp(false)
          setShowSignIn(true)
        }}
      />
    </>
  )
}
