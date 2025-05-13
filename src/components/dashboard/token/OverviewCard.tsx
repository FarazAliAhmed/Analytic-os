import React from 'react';
import { FiInfo } from 'react-icons/fi';

const OverviewCard: React.FC = () => (
    <div className="bg-[#151517] rounded-lg p-4 text-gray-200">
        <div className="flex items-center mb-4">
            <span className="text-base font-semibold mr-2">Overview</span>
            <FiInfo className="text-gray-400" size={16} />
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4 text-sm">
            <div>
                <div className="text-gray-400">Price</div>
                <div className="font-semibold text-white">$0.25</div>
            </div>
            <div>
                <div className="text-gray-400">Market Cap</div>
                <div className="font-semibold text-white">$52m</div>
            </div>
            <div>
                <div className="text-gray-400">Volume</div>
                <div className="font-semibold text-white">$189K</div>
            </div>
            <div>
                <div className="text-gray-400">TSPv</div>
                <div className="font-semibold text-white">$2m</div>
            </div>
            <div>
                <div className="text-gray-400">Transactions</div>
                <div className="font-semibold text-white">289</div>
            </div>
            <div>
                <div className="text-gray-400">Liquidity</div>
                <div className="font-semibold text-white">289</div>
            </div>
            <div className="col-span-1">
                <div className="text-gray-400">Date of Listing</div>
                <div className="font-semibold text-white">May 23, 2025</div>
            </div>
            <div className="col-span-1">
                <div className="text-gray-400">Contract Address</div>
                <div className="font-semibold text-white text-xs break-all">0xe54d08a...bfd4b</div>
            </div>
        </div>
        <div className="mb-2">
            <label className="block text-xs mb-1">Amount</label>
            <input className="w-full bg-[#181A20] border border-[#353945] rounded px-2 py-2 text-white text-sm focus:outline-none focus:border-blue-600" placeholder="0" />
            <div className="flex justify-between text-xs mt-1">
                <span className="text-red-500">Min: 1</span>
                <span className="text-green-400">Available: 3,265.00</span>
            </div>
        </div>
        <div className="flex space-x-2 mb-2">
            {['1%', '50%', '75%', '100%'].map((p) => (
                <button key={p} className="flex-1 bg-[#181A20] text-gray-300 rounded py-1 hover:bg-[#353945] text-xs font-medium">{p}</button>
            ))}
        </div>
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded py-2 font-semibold text-base mt-2">Buy</button>
    </div>
);

export default OverviewCard; 