"use client";
import PortfolioSummary from '@/components/portfolio/PortfolioSummary';
import PortfolioHoldings from '@/components/portfolio/PortfolioHoldings';

export default function PortfolioContainer() {
    return (
        <div className="flex-1 w-full p-4 sm:p-8">
            {/* Header Row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-semibold text-white mb-1">My Portfolio</h2>
                    <div className="text-gray-400 text-sm">Last updated: May 21, 2025 • 09:42 AM</div>
                </div>
                <button className="bg-[#18181C] text-white px-4 py-2 rounded flex items-center gap-2 border border-gray-700 hover:bg-[#23262F] transition mt-4 sm:mt-0">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M5 20h14v-2H5v2zm7-16C8.13 4 5 7.13 5 11c0 2.38 1.19 4.47 3 5.74V17h8v-.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" /></svg>
                    Export
                </button>
            </div>
            <PortfolioSummary />
            <PortfolioHoldings />
        </div>
    );
} 