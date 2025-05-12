"use client"
import { useState } from 'react';
import Sidebar from '@/common/Sidebar';
import Header from '@/common/Header';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="w-full flex min-h-screen bg-primary text-white">
            {/* Sidebar - overlay on mobile, fixed on desktop */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <main className="flex-1 w-full bg-primary min-h-screen">
                <Header onOpenSidebar={() => setSidebarOpen(true)} />
                <div className="w-full">
                    {children}
                </div>
            </main>
        </div>
    );
} 