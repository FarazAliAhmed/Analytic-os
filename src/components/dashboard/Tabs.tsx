"use client"

import { useState } from 'react';

type TimePeriod = '1d' | '7d' | '30d' | '1yr';

interface TabsProps {
  onTabChange?: (tab: string) => void;
  onTimePeriodChange?: (period: TimePeriod) => void;
}

export default function Tabs({ onTabChange, onTimePeriodChange }: TabsProps) {
    const [active, setActive] = useState('all');
    const [timePeriod, setTimePeriod] = useState<TimePeriod>('30d');
    
    const tabs = [
        { key: 'all', label: 'All Listings' },
        { key: 'volume', label: 'Top Volume' },
        { key: 'upcoming', label: 'Upcoming' },
    ];

    const handleTabClick = (key: string) => {
        setActive(key);
        onTabChange?.(key);
    };

    const handleTimePeriodClick = (period: TimePeriod) => {
        setTimePeriod(period);
        onTimePeriodChange?.(period);
    };

    return (
        <div className="flex items-center justify-between border-b px-2 sm:px-8 border-borderColor">
            {/* Tabs on the left */}
            <div className="flex gap-8">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        className={`pb-2 px-2 text-sm sm:text-base font-semibold cursor-pointer ${active === tab.key ? 'border-b-2 border-[#8B99FF] text-[#8B99FF]' : 'text-gray-400'}`}
                        onClick={() => handleTabClick(tab.key)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Time Period buttons on the right */}
            <div className="flex gap-2 pb-2">
                {(['1d', '7d', '30d', '1yr'] as TimePeriod[]).map((period) => (
                    <button
                        key={period}
                        onClick={() => handleTimePeriodClick(period)}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                            timePeriod === period
                                ? 'bg-[#4459FF] text-white'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                    >
                        {period}
                    </button>
                ))}
            </div>
        </div>
    );
} 