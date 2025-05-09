export default function Header() {
    return (
        <header className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <div className="flex items-center gap-4">
                <button className="relative">
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 7.165 6 9.388 6 12v2.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                </button>
                <button className="bg-gray-800 px-4 py-2 rounded text-white font-semibold">Connect wallet</button>
            </div>
        </header>
    );
} 