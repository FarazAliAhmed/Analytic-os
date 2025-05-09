interface HeaderProps {
    onOpenSidebar?: () => void;
}

export default function Header({ onOpenSidebar }: HeaderProps) {
    return (
        <header className="bg-secondary p-4 border-b border-[#858B9A33] flex items-center justify-between">
            <div className="flex items-center gap-3">
                {/* Hamburger for mobile */}
                <button
                    className="md:hidden bg-gray-800 p-2 rounded"
                    onClick={onOpenSidebar}
                    aria-label="Open sidebar"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <h1 className="text-lg md:text-3xl font-bold">Dashboard</h1>
            </div>
            <div className="flex items-center gap-2 md:gap-4 px-4">
                <button className="relative">
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 7.165 6 9.388 6 12v2.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                </button>
                <button className="border border-white px-2 py-2 rounded-full text-sm text-white font-semibold">Connect wallet</button>
            </div>
        </header>
    );
} 