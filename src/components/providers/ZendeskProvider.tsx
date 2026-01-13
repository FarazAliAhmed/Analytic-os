'use client'

import { useEffect, useCallback, useRef } from 'react'

// TypeScript declaration for Zendesk web widget
declare global {
  interface Window {
    zE?: {
      (action: string, method: string, ...args: unknown[]): void
    }
  }
}

interface ZendeskProviderProps {
  children: React.ReactNode
}

export function ZendeskProvider({ children }: ZendeskProviderProps) {
  const scriptLoadedRef = useRef(false)

  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return
    
    // Don't load twice
    if (scriptLoadedRef.current) return
    if (document.getElementById('ze-snippet')) {
      scriptLoadedRef.current = true
      return
    }

    const ZENDESK_KEY = process.env.NEXT_PUBLIC_ZENDESK_KEY
    if (!ZENDESK_KEY) {
      console.warn('Zendesk: NEXT_PUBLIC_ZENDESK_KEY not configured')
      return
    }

    // Load script after a short delay
    const timer = setTimeout(() => {
      const script = document.createElement('script')
      script.id = 'ze-snippet'
      script.src = `https://static.zdassets.com/ekr/snippet.js?key=${ZENDESK_KEY}`
      script.async = true
      
      script.onload = () => {
        console.log('Zendesk: Widget loaded')
        scriptLoadedRef.current = true
        
        // Hide the default Zendesk launcher (we use our own button)
        if (window.zE) {
          window.zE('messenger', 'hide')
        }
      }

      document.head.appendChild(script)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return <>{children}</>
}

// Hook for controlling the widget
export function useZendesk() {
  const openChat = useCallback(() => {
    if (typeof window !== 'undefined' && window.zE) {
      try {
        window.zE('messenger', 'show')
        window.zE('messenger', 'open')
      } catch {
        console.warn('Could not open Zendesk chat')
      }
    }
  }, [])

  const closeChat = useCallback(() => {
    if (typeof window !== 'undefined' && window.zE) {
      try {
        window.zE('messenger', 'close')
      } catch {
        console.warn('Could not close Zendesk chat')
      }
    }
  }, [])

  return { openChat, closeChat }
}

export default ZendeskProvider
