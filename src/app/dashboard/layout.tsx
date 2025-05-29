"use client"
import { useState } from 'react';
import Sidebar from '@/common/Sidebar';
import Header from '@/common/Header';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="w-full h-screen flex bg-primary text-white overflow-hidden">
            {/* Sidebar - fixed on the left */}
            <div className="hidden lg:block">
                <Sidebar isOpen={true} />
            </div>
            {/* Mobile Sidebar overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 bg-opacity-40 backdrop-blur-xs" onClick={() => setSidebarOpen(false)} />
            )}
            <div className="lg:hidden fixed inset-y-0 left-0 z-50">
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            </div>
            {/* Main content area */}
            <div className="flex-1 flex flex-col h-screen min-w-0">
                {/* Header - fixed at the top, also scrolls horizontally with content */}
                <div className="sticky top-0 z-30 w-full bg-primary">
                    <Header onOpenSidebar={() => setSidebarOpen(true)} />
                </div>
                {/* Scrollable content (vertical and horizontal) */}
                <div className="flex-1 overflow-auto w-full">
                    {children}
                </div>
            </div>
        </div>
    );
} 