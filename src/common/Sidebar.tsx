import { FaLayerGroup, FaWallet } from 'react-icons/fa';

export default function Sidebar() {
    return (
        <aside className="w-64 bg-gray-950 min-h-screen flex flex-col py-8 px-4">
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