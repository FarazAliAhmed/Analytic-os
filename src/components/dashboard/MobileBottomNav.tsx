'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useWallet } from '@/hooks/useWallet'
import { useCurrency } from '@/contexts/CurrencyContext'
import { useState } from 'react'
import { FundWalletModal } from './FundWalletModal'
import { WithdrawModal } from './WithdrawModal'

export function MobileBottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { status } = useSession()
  const { balance, wallet } = useWallet()
  const { formatAmount } = useCurrency()
  const [showFundModal, setShowFundModal] = useState(false)
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)

  const isActive = (path: string) => pathname === path

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0A0A0A] border-t border-[#1A1A1A] safe-area-bottom">
        {/* Wallet Balance Bar */}
        {status === 'authenticated' && wallet && (
          <div className="flex items-center justify-between px-4 py-2 border-b border-[#1A1A1A]">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Balance:</span>
              <span className="text-sm font-bold text-white">{formatAmount(balance / 100)}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFundModal(true)}
                className="px-3 py-1 bg-[#4459FF] hover:bg-[#3448EE] text-white text-xs font-medium rounded-lg transition-colors"
              >
                Fund +
              </button>
              <button
                onClick={() => setShowWithdrawModal(true)}
                className="px-3 py-1 bg-[#1A1A1A] hover:bg-[#252525] text-white text-xs font-medium rounded-lg transition-colors"
              >
                Withdraw
              </button>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center justify-around px-2 py-2">
          <button
            onClick={() => router.push('/dashboard')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              isActive('/dashboard')
                ? 'text-[#4459FF]'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs font-medium">Home</span>
          </button>

          <button
            onClick={() => router.push('/dashboard/portfolio')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              isActive('/dashboard/portfolio')
                ? 'text-[#4459FF]'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-xs font-medium">Portfolio</span>
          </button>

          <button
            onClick={() => router.push('/dashboard/list-startup')}
            className="flex flex-col items-center gap-1 px-6 py-2 bg-[#4459FF] hover:bg-[#3448EE] rounded-xl transition-colors -mt-4 shadow-lg"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-xs font-medium text-white">List</span>
          </button>

          <button
            onClick={() => router.push('/dashboard/account')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              isActive('/dashboard/account')
                ? 'text-[#4459FF]'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-xs font-medium">Account</span>
          </button>

          <button
            className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg text-gray-500 hover:text-gray-300 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            <span className="text-xs font-medium">More</span>
          </button>
        </div>
      </nav>

      {/* Modals */}
      {showFundModal && wallet && (
        <FundWalletModal
          open={showFundModal}
          onClose={() => setShowFundModal(false)}
          accountNumber={wallet.accountNumber}
          bankName={wallet.bankName}
          accountName={wallet.accountName}
        />
      )}

      {showWithdrawModal && wallet && (
        <WithdrawModal
          open={showWithdrawModal}
          onClose={() => setShowWithdrawModal(false)}
          balance={balance}
          onWithdraw={() => setShowWithdrawModal(false)}
        />
      )}
    </>
  )
}
