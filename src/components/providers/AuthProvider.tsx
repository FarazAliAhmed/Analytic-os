'use client'

import { SessionProvider, useSession } from 'next-auth/react'
import { ReactNode, useEffect, useState } from 'react'

function WalletEnsurer() {
  const { data: session, status } = useSession()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    async function ensureWallet() {
      if (status === 'authenticated' && session?.user?.id && !checked) {
        setChecked(true)
        try {
          const response = await fetch('/api/wallet/ensure', {
            method: 'POST',
          })
          const data = await response.json()
          if (data.success) {
            console.log('Wallet ensured:', data.message)
          }
        } catch (error) {
          console.error('Failed to ensure wallet:', error)
        }
      }
    }

    ensureWallet()
  }, [status, session, checked])

  return null
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <WalletEnsurer />
      {children}
    </SessionProvider>
  )
}
