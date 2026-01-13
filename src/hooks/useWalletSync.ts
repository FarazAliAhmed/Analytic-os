// src/hooks/useWalletSync.ts

import { useEffect, useCallback } from 'react'
import { useWallet } from './useWallet'

export function useWalletSync(enabled: boolean = true) {
  const { syncWallet } = useWallet()

  const sync = useCallback(async () => {
    try {
      const result = await syncWallet()
      if (result.data?.newTransactions > 0) {
        console.log(`Wallet synced: +${result.data.newTransactions} transactions`)
      }
    } catch (error) {
      console.error('Wallet sync failed:', error)
    }
  }, [syncWallet])

  useEffect(() => {
    if (!enabled) return

    // Initial sync
    sync()

    // Poll every 60 seconds
    const interval = setInterval(sync, 60 * 1000)

    return () => clearInterval(interval)
  }, [enabled, sync])
}
