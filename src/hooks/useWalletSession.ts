'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useAccount, useDisconnect } from 'wagmi'
import { useSession, signOut } from 'next-auth/react'

/**
 * Hook to sync wagmi wallet connection state with NextAuth session.
 * Automatically updates the session when the wallet address changes.
 */
export function useWalletSession() {
  const { data: session, update: updateSession } = useSession()
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()

  // Use ref to track if we've already synced this address
  const syncedAddressRef = useRef<string | null>(null)

  // Prevent multiple simultaneous syncs
  const isSyncingRef = useRef(false)

  // Sync wagmi address to NextAuth session
  useEffect(() => {
    const syncWalletToSession = async () => {
      // Skip if no wallet, not connected, or already synced this address
      if (!address || !isConnected || syncedAddressRef.current === address || isSyncingRef.current) {
        return
      }

      isSyncingRef.current = true

      try {
        const response = await fetch('/api/auth/update-wallet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ walletAddress: address }),
        })

        if (response.ok) {
          // Mark this address as synced
          syncedAddressRef.current = address
          // Refresh the session to get updated walletAddress
          await updateSession()
        }
      } catch (error) {
        console.error('Failed to sync wallet to session:', error)
      } finally {
        isSyncingRef.current = false
      }
    }

    syncWalletToSession()
  }, [address, isConnected, updateSession])

  // Reset synced address when wallet disconnects
  useEffect(() => {
    if (!isConnected) {
      syncedAddressRef.current = null
    }
  }, [isConnected])

  // Handle disconnect - clear wallet from session and sign out
  const handleDisconnect = useCallback(async () => {
    syncedAddressRef.current = null
    disconnect()
    await signOut({ callbackUrl: '/' })
  }, [disconnect])

  return {
    address: address as string | undefined,
    isConnected,
    sessionWalletAddress: session?.user?.walletAddress as string | null | undefined,
    handleDisconnect,
  }
}
