'use client';

import React from 'react';

const ChartCard: React.FC = () => (
    <div className="bg-[#151517] rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
            <span className="text-white font-semibold">Chart</span>
            {/* Time Range Controls */}
            <div className="flex space-x-2 text-xs">
                {['1s', '1m', '5m', '15m', '1h', '4h', '1D'].map((t) => (
                    <button key={t} className="px-2 py-1 rounded bg-[#181A20] text-gray-300 hover:bg-[#353945]">{t}</button>
                ))}
            </div>
        </div>
        {/* Chart Placeholder */}
        <div className="h-[320px] bg-[#181A20] rounded flex items-center justify-center text-gray-500">
            Candlestick Chart Here
        </div>
    </div>
);

export default ChartCard; 