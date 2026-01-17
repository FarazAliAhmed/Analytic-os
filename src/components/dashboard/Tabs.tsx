"use client"

import { useState } from 'react';

interface TabsProps {
  onTabChange?: (tab: string) => void;
}

export default function Tabs({ onTabChange }: TabsProps) {
    const [active, setActive] = useState('all');
    const tabs = [
        { key: 'all', label: 'All Listings' },
        { key: 'volume', label: 'Top Volume' },
        { key: 'upcoming', label: 'Upcoming' },
    ];

    const handleTabClick = (key: string) => {
        setActive(key);
        onTabChange?.(key);
    };

    return (
        <div className="flex gap-8 border-b px-2 sm:px-8 border-borderColor">
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
    );
} 