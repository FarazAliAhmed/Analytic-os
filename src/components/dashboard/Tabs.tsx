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
        <div className="flex gap-8 border-b border-gray-700 mb-2">
            {tabs.map((tab) => (
                <button
                    key={tab.key}
                    className={`pb-2 px-2 font-semibold ${active === tab.key ? 'border-b-2 border-blue-500 text-blue-400' : 'text-gray-400'}`}
                    onClick={() => setActive(tab.key)}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
} 