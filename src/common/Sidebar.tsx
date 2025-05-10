import { FaLayerGroup, FaWallet, FaTimes } from 'react-icons/fa';

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
    return (
        <aside
            className={`
                fixed top-0 left-0 min-h-screen w-64 bg-secondary border-r border-[#858B9A33] z-50
                transition-transform duration-300 ease-in-out
                md:translate-x-0 md:static md:z-0
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}
        >
            {/* Close button for mobile */}
            <button
                className="md:hidden absolute top-4 right-4 text-2xl text-gray-400 hover:text-white"
                onClick={onClose}
                aria-label="Close sidebar"
            >
                <FaTimes />
            </button>
            <div className="text-2xl font-bold mb-12 px-4 pt-8">AnalyticaOS</div>
            <nav className="flex flex-col gap-2 px-4">
                <a href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded bg-gray-800 font-semibold">
                    <FaLayerGroup /> Dashboard
                </a>
                <a href="/portfolio" className="flex items-center gap-3 px-4 py-3 rounded hover:bg-gray-800">
                    <FaWallet /> Portfolio
                </a>
            </nav>
        </aside>
    );
}