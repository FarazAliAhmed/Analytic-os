"use client"

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  // Determine page title from pathname
  const getPageTitle = () => {
    if (pathname === '/admin' || pathname === '/admin/dashboard') return 'Dashboard'
    if (pathname.startsWith('/admin/transactions')) return 'Transactions'
    if (pathname.startsWith('/admin/tokens')) return 'Tokens'
    if (pathname.startsWith('/admin/users')) return 'Users'
    if (pathname.startsWith('/admin/settings')) return 'Settings'
    return 'Admin'
  }

  return (
    <div className="w-full h-screen flex bg-primary text-white overflow-hidden">
      {/* Sidebar - fixed on the left */}
      <div className="hidden lg:block">
        <AdminSidebar isOpen={true} />
      </div>

      {/* Mobile Sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-40 backdrop-blur-xs" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}
      <div className="lg:hidden fixed inset-y-0 left-0 z-50">
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col h-screen min-w-0">
        {/* Header */}
        <div className="sticky top-0 z-30 w-full bg-primary">
          <AdminHeader 
            onOpenSidebar={() => setSidebarOpen(true)} 
            pageTitle={getPageTitle()}
          />
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-auto w-full">
          {children}
        </div>
      </div>
    </div>
  )
}
