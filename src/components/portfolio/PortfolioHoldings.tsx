import PortfolioTable from './PortfolioTable';

export default function PortfolioHoldings() {
    return (
        <section className="bg-[#101014] rounded-2xl p-6 mt-4 shadow border border-[#23262F]">
            <div className="mb-2">
                <div className="text-xl font-semibold text-white mb-1">Portfolio Holdings</div>
                <div className="text-gray-400 mb-4">Complete breakdown of your investments</div>
                <div className="flex gap-2">
                    <button className="px-4 py-1 rounded bg-[#23262F] text-white font-medium border border-[#23262F]">All Tokens <span className="ml-1 text-xs bg-gray-700 px-2 py-0.5 rounded">16</span></button>
                    <button className="px-4 py-1 rounded bg-transparent text-gray-400 hover:bg-[#23262F] border border-[#23262F]">Watchlist <span className="ml-1 text-xs bg-gray-700 px-2 py-0.5 rounded">8</span></button>
                </div>
            </div>
            <PortfolioTable />
        </section>
    );
} 