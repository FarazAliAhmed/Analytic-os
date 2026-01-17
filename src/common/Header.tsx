'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import SignInModal from '@/components/dashboard/SignInModal'
import SignUpModal from '@/components/dashboard/SignUpModal'
import { WalletInfo } from '@/components/dashboard/WalletInfo'
import { FundWalletModal } from '@/components/dashboard/FundWalletModal'
import { WithdrawModal } from '@/components/dashboard/WithdrawModal'
import { NotificationBell } from '@/components/dashboard/NotificationBell'
import { useWallet } from '@/hooks/useWallet'
import { useWalletSync } from '@/hooks/useWalletSync'

interface HeaderProps {
  onOpenSidebar?: () => void
}

export default function Header({ onOpenSidebar }: HeaderProps) {
  const { data: session, status } = useSession()
  const [showSignIn, setShowSignIn] = useState(false)
  const [showSignUp, setShowSignUp] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showFundModal, setShowFundModal] = useState(false)
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)

  // Use NGN wallet hook
  const { balance, wallet, hasWallet, isLoading, createWallet, mutateWallet } = useWallet()
  const [isCreating, setIsCreating] = useState(false)

  // Enable auto-sync for wallet polling
  useWalletSync(status === 'authenticated')

  // Close profile menu when clicking outside
  const profileMenuRef = useRef<HTMLDivElement>(null)

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
      setShowProfileMenu(false)
    }
  }, [])

  useEffect(() => {
    if (showProfileMenu) {
      window.addEventListener('click', handleClickOutside)
    }
    return () => {
      window.removeEventListener('click', handleClickOutside)
    }
  }, [showProfileMenu, handleClickOutside])

  const handleLogout = useCallback(async () => {
    setShowProfileMenu(false)
    await signOut({ callbackUrl: '/' })
  }, [])

  const handleCreateWallet = useCallback(async () => {
    if (isCreating) return
    setIsCreating(true)
    try {
      await createWallet()
      await mutateWallet()
    } catch (error) {
      console.error('Failed to create wallet:', error)
    } finally {
      setIsCreating(false)
    }
  }, [createWallet, mutateWallet, isCreating])

  return (
    <>
      <header className="bg-[#181A20] p-4 border-b border-[#858B9A33] flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Hamburger for mobile */}
          <button
            className="lg:hidden p-2 hover:bg-[#23262F] rounded-lg transition-colors"
            onClick={onOpenSidebar}
            aria-label="Open sidebar"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg lg:text-xl font-semibold text-white">new card</h1>
        </div>

        <div className="flex items-center gap-2 lg:gap-3">
          {/* Notifications */}
          <NotificationBell />

          {/* Wallet Info - Authenticated User */}
          {status === 'authenticated' && session?.user ? (
            <div className="flex items-center gap-2">
              {isLoading ? (
                <div className="w-32 h-10 bg-gray-800 rounded-xl animate-pulse" />
              ) : wallet ? (
                /* NGN Wallet */
                <WalletInfo
                  balance={balance}
                  accountNumber={wallet.accountNumber}
                  bankName={wallet.bankName}
                  accountName={wallet.accountName}
                  onOpenFund={() => setShowFundModal(true)}
                  onOpenWithdraw={() => setShowWithdrawModal(true)}
                />
              ) : (
                /* No Wallet - Show Create Button */
                <button
                  onClick={handleCreateWallet}
                  disabled={isCreating}
                  className="px-4 py-2 bg-[#4459FF] hover:bg-[#3448EE] disabled:bg-[#4459FF]/50 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors"
                >
                  {isCreating ? 'Creating...' : 'Create Wallet'}
                </button>
              )}

              {/* Profile Dropdown */}
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowProfileMenu(!showProfileMenu)
                  }}
                  className="p-2 hover:bg-[#23262F] rounded-lg transition-colors"
                  aria-label="Profile menu"
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showProfileMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-[#23262F] rounded-lg shadow-xl border border-[#858B9A33] py-2 z-50">
                    <div className="px-4 py-2 border-b border-[#858B9A33]">
                      <p className="text-sm text-gray-400">Account</p>
                      <p className="text-sm text-white truncate">{session.user.email || session.user.name}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:text-white hover:bg-[#181A20] transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : status === 'loading' ? (
            <div className="w-8 h-8 bg-gray-800 rounded-full animate-pulse" />
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSignIn(true)}
                className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => setShowSignUp(true)}
                className="px-4 py-2 text-sm bg-[#4459FF] hover:bg-[#3448EE] text-white rounded-lg transition-colors"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </header>

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

      {/* Fund Wallet Modal */}
      {showFundModal && wallet && (
        <FundWalletModal
          open={showFundModal}
          onClose={() => setShowFundModal(false)}
          accountNumber={wallet.accountNumber}
          bankName={wallet.bankName}
          accountName={wallet.accountName}
        />
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && wallet && (
        <WithdrawModal
          open={showWithdrawModal}
          onClose={() => setShowWithdrawModal(false)}
          balance={balance}
          onWithdraw={() => {
            setShowWithdrawModal(false)
          }}
        />
      )}
    </>
  )
}
