"use client"

import { useState, useRef, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { FaBell, FaSearch } from 'react-icons/fa'
import NotificationDropdown from '@/components/dashboard/NotificationDropdown'

interface AdminHeaderProps {
  onOpenSidebar?: () => void
  pageTitle?: string
}

export default function AdminHeader({ onOpenSidebar, pageTitle = 'Dashboard' }: AdminHeaderProps) {
  const { data: session, status } = useSession()
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  
  const profileMenuRef = useRef<HTMLDivElement>(null)
  const notificationRef = useRef<HTMLDivElement>(null)

  // Fetch unread notification count
  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/notifications/count')
        .then(res => {
          if (!res.ok) return { success: false, data: { unreadCount: 0 } }
          return res.json()
        })
        .then(data => {
          if (data.success) {
            setUnreadCount(data.data.unreadCount)
          }
        })
        .catch(() => {
          // Silently fail
        })
    }
  }, [status])

  // Close menus when clicking outside
  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
      setShowProfileMenu(false)
    }
    if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) {
      setShowNotifications(false)
    }
  }, [])

  useEffect(() => {
    if (showProfileMenu || showNotifications) {
      window.addEventListener('click', handleClickOutside)
    }
    return () => {
      window.removeEventListener('click', handleClickOutside)
    }
  }, [showProfileMenu, showNotifications, handleClickOutside])

  const handleLogout = async () => {
    setShowProfileMenu(false)
    await signOut({ callbackUrl: '/' })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement admin search functionality
    console.log('Search:', searchQuery)
  }

  return (
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
        <h1 className="text-lg lg:text-xl font-semibold text-white">{pageTitle}</h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="hidden md:flex items-center bg-[#23262F] rounded-lg px-3 py-2">
          <FaSearch className="w-4 h-4 text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-sm text-white placeholder-gray-400 w-48"
          />
        </form>

        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button 
            onClick={(e) => {
              e.stopPropagation()
              setShowNotifications(!showNotifications)
            }}
            className="relative p-2 hover:bg-[#23262F] rounded-lg transition-colors"
            aria-label="Notifications"
          >
            <FaBell className="w-5 h-5 text-gray-400" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center px-1.5">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <NotificationDropdown
              onClose={() => setShowNotifications(false)}
              onUnreadCountChange={setUnreadCount}
            />
          )}
        </div>

        {/* Profile */}
        {session?.user && (
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowProfileMenu(!showProfileMenu)
              }}
              className="flex items-center gap-2 p-2 hover:bg-[#23262F] rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-[#4459FF] rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {session.user.email?.charAt(0).toUpperCase() || 'A'}
                </span>
              </div>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-[#23262F] rounded-lg shadow-xl border border-[#858B9A33] py-2 z-50">
                <div className="px-4 py-2 border-b border-[#858B9A33]">
                  <p className="text-sm text-gray-400">Admin</p>
                  <p className="text-sm text-white truncate">{session.user.email}</p>
                </div>
                <Link
                  href="/dashboard"
                  className="block w-full px-4 py-2 text-left text-sm text-gray-300 hover:text-white hover:bg-[#181A20] transition-colors"
                  onClick={() => setShowProfileMenu(false)}
                >
                  Back to Dashboard
                </Link>
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
        )}
      </div>
    </header>
  )
}
