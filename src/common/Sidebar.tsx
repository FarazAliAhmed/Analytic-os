import { FaLayerGroup, FaWallet, FaTimes } from 'react-icons/fa';

interface SidebarProps {
    onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
    return (
        <aside className="w-64 fixed bg-secondary border-r border-[#858B9A33] min-h-screen flex flex-col py-8 px-4 z-50">
            {/* Close button for mobile */}
            <button
                className="md:hidden absolute top-4 right-4 text-2xl text-gray-400 hover:text-white"
                onClick={onClose}
                aria-label="Close sidebar"
            >
                <FaTimes />
            </button>
            <div className="text-2xl font-bold mb-12">AnalyticaOS</div>
            <nav className="flex flex-col gap-2">
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