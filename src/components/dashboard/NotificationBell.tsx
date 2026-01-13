// src/components/dashboard/NotificationBell.tsx

'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import NotificationDropdown from './NotificationDropdown'

export function NotificationBell() {
  const { data: session, status } = useSession()
  const [showDropdown, setShowDropdown] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setShowDropdown(false)
    }
  }, [])

  // Fetch unread count on mount (only when authenticated)
  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/notifications/count')
        .then(res => {
          if (!res.ok) return { data: { unreadCount: 0 } }
          return res.json()
        })
        .then(data => {
          if (data.success) {
            setUnreadCount(data.data.unreadCount)
          }
        })
        .catch(() => {
          // Silently fail - no notifications to show
        })
    }
  }, [status])

  useEffect(() => {
    if (showDropdown) {
      window.addEventListener('click', handleClickOutside)
    }
    return () => {
      window.removeEventListener('click', handleClickOutside)
    }
  }, [showDropdown, handleClickOutside])

  // Close dropdown when clicking the bell
  const handleBellClick = () => {
    if (status === 'authenticated') {
      setShowDropdown(!showDropdown)
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleBellClick}
        className={`relative p-2 rounded-lg transition-colors ${
          status === 'authenticated'
            ? 'hover:bg-[#23262F]'
            : 'opacity-50 cursor-not-allowed'
        }`}
        aria-label="Notifications"
        disabled={status !== 'authenticated'}
      >
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 7.165 6 9.388 6 12v2.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center px-1.5">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && status === 'authenticated' && (
        <NotificationDropdown
          onClose={() => setShowDropdown(false)}
          onUnreadCountChange={setUnreadCount}
        />
      )}
    </div>
  )
}
