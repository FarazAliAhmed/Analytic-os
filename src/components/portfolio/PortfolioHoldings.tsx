import PortfolioTable from './PortfolioTable';

export default function PortfolioHoldings() {
    return (
        <section className="bg-[#0A0A0A] rounded-2xl p-6 mt-4 shadow border border-[#262626]">
            <div className="mb-2 border-b border-[#262626] pb-4">
                <div className="text-xl font-semibold text-[#FAFAFA] mb-1">Portfolio Holdings</div>
                <div className="text-[#A1A1A1] mb-4">Complete breakdown of your investments</div>
                <div className="flex gap-2">
                    <button className="px-4 py-1 rounded bg-[#262626] text-[#FAFAFA] font-medium border border-[#262626]">All Tokens <span className="ml-1 text-xs bg-gray-700 px-2 py-0.5 rounded">16</span></button>
                    <button className="px-4 py-1 rounded bg-transparent text-[#A1A1A1] hover:bg-[#262626] border border-[#262626]">Watchlist <span className="ml-1 text-xs bg-gray-700 px-2 py-0.5 rounded">8</span></button>
                </div>
            </div>
            <PortfolioTable />
        </section>
    );
} 