import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
interface HeaderProps {
    onOpenSidebar?: () => void;
}

export default function Header({ onOpenSidebar }: HeaderProps) {

    return (
        <header className="bg-secondary p-4 border-b border-[#858B9A33] flex items-center justify-between">
            <div className="flex items-center gap-3">
                {/* Hamburger for mobile */}
                <button
                    className="lg:hidden bg-gray-800 p-2 rounded"
                    onClick={onOpenSidebar}
                    aria-label="Open sidebar"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <h1 className="text-lg lg:text-3xl lg:block hidden font-bold">Dashboard</h1>
            </div>
            <div className="flex items-center gap-2 lg:gap-4">
                <Link href="/dashboard/account">
                    <div className='w-10 h-10 bg-[#868686] rounded-full cursor-pointer'></div>
                </Link> <button className="relative">
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 7.165 6 9.388 6 12v2.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                </button>
                <ConnectButton showBalance={{ smallScreen: false, largeScreen: true }} chainStatus={{ smallScreen: "icon", largeScreen: "full" }} />
            </div>
        </header>
    );
} 