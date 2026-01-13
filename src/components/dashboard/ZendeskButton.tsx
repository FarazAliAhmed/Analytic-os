'use client'

import { MessageCircle, X } from 'lucide-react'
import { useState, useCallback } from 'react'
import { useZendesk } from '@/components/providers/ZendeskProvider'

interface ZendeskButtonProps {
  className?: string
  variant?: 'icon' | 'button'
  showBadge?: boolean
}

export function ZendeskButton({
  className = '',
  variant = 'button',
  showBadge = true,
}: ZendeskButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { openChat, closeChat } = useZendesk()

  const handleClick = useCallback(() => {
    if (isOpen) {
      closeChat()
      setIsOpen(false)
    } else {
      openChat()
      setIsOpen(true)
    }
  }, [isOpen, openChat, closeChat])

  if (variant === 'icon') {
    return (
      <button
        onClick={handleClick}
        className={`fixed bottom-6 right-6 z-50 w-12 h-12 rounded-xl bg-[#4459FF] hover:bg-[#3448EE] text-white shadow-lg shadow-[#4459FF]/25 flex items-center justify-center transition-all duration-300 hover:scale-105 ${className}`}
        aria-label="Open support chat"
      >
        {isOpen ? <X size={20} /> : <MessageCircle size={20} />}
        {showBadge && !isOpen && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-[#181A20]" />
        )}
      </button>
    )
  }

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-2 px-4 py-2 bg-[#4459FF] hover:bg-[#3448EE] text-white rounded-lg font-medium transition-all duration-300 shadow-lg shadow-[#4459FF]/25 hover:shadow-[#4459FF]/40 ${className}`}
    >
      <MessageCircle size={18} />
      <span>Help & Support</span>
      {showBadge && (
        <span className="ml-1 w-2 h-2 bg-green-400 rounded-full" />
      )}
    </button>
  )
}

export default ZendeskButton
