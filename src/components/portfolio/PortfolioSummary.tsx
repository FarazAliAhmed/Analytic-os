import { FaDollarSign, FaChartLine, FaRegCalendarAlt } from 'react-icons/fa';

export default function PortfolioSummary() {
    return (
        <section className="mb-8">
            <div className="flex flex-col md:flex-row gap-4">
                {/* Total Portfolio Value */}
                <div className="flex-1 bg-[#101014] rounded-xl p-6 flex flex-col gap-2 border border-[#23262F] relative min-h-[160px]">
                    <span className="absolute top-4 right-4 bg-transparent"><span className="bg-[#0B2E1A] text-green-400 px-3 py-1 rounded-full text-xs font-semibold border border-green-700">+3.2% today</span></span>
                    <div className="flex items-center gap-2 text-gray-400 text-lg"><FaDollarSign /> Total Portfolio Value</div>
                    <div className="text-3xl font-bold text-white">$57,939.11</div>
                    <div className="text-green-400 text-sm font-medium">+8,720.44 since inception</div>
                </div>
                {/* Total Yield */}
                <div className="flex-1 bg-[#101014] rounded-xl p-6 flex flex-col gap-2 border border-[#23262F] relative min-h-[160px]">
                    <span className="absolute top-4 right-4 bg-transparent"><span className="bg-[#0B2E1A] text-green-400 px-3 py-1 rounded-full text-xs font-semibold border border-green-700">Better than 78%</span></span>
                    <div className="flex items-center gap-2 text-gray-400 text-lg"><FaChartLine /> Total Yield</div>
                    <div className="text-3xl font-bold text-white">0.53</div>
                    <div className="text-green-400 text-sm font-medium">+1.23% past month</div>
                </div>
                {/* Recent Activity */}
                <div className="flex-1 bg-[#101014] rounded-xl p-6 flex flex-col gap-2 border border-[#23262F] relative min-h-[160px]">
                    <span className="absolute top-4 right-4 bg-transparent"><span className="bg-[#0A1A2E] text-blue-400 px-3 py-1 rounded-full text-xs font-semibold border border-blue-700">Last 30 days</span></span>
                    <div className="flex items-center gap-2 text-gray-400 text-lg"><FaRegCalendarAlt /> Recent Activity</div>
                    <div className="text-3xl font-bold text-white">7 Transactions</div>
                    <div className="text-gray-400 text-sm font-medium">3 buys, 2 sells, 2 hold</div>
                </div>
            </div>
        </section>
    );
} 