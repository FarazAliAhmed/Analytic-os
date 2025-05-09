"use client"

import { useState } from 'react';

export default function Tabs() {
    const [active, setActive] = useState('gainers');
    const tabs = [
        { key: 'gainers', label: 'Top Gainers' },
        { key: 'losers', label: 'Top Losers' },
        { key: 'listings', label: 'New Listings' },
    ];
    return (
        <div className="flex gap-8 border-b px-8 border-borderColor">
            {tabs.map((tab) => (
                <button
                    key={tab.key}
                    className={`pb-2 px-2 font-semibold cursor-pointer ${active === tab.key ? 'border-b-2 border-[#8B99FF] text-[#8B99FF]' : 'text-gray-400'}`}
                    onClick={() => setActive(tab.key)}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
} 