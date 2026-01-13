import React, { useState, useEffect, useRef } from 'react';

const FILTER_TABS = [
    'Category', 'Price', 'Performance', 'Liquidity', 'Market Cap', 'Sort'
];

interface FiltersDropdownProps {
    id: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function FiltersDropdown({ id, isOpen, onClose }: FiltersDropdownProps) {
    const [activeTab, setActiveTab] = useState('Category');
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Calculate position when opened
    useEffect(() => {
        if (isOpen) {
            // Find the Filters button
            const filtersButton = document.querySelector('button[class*="cursor-pointer"][class*="hover:bg-secondary"]');
            if (filtersButton) {
                const rect = filtersButton.getBoundingClientRect();
                setPosition({
                    top: rect.bottom + 8, // 8px below the button
                    left: rect.right - 360, // Align right edge with button right edge
                });
            }
        }
    }, [isOpen]);

    // Close on escape key
    useEffect(() => {
        function handleEscape(event: KeyboardEvent) {
            if (event.key === 'Escape') onClose();
        }
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop to close on outside click */}
            <div
                id={`${id}-backdrop`}
                className="fixed inset-0 z-40"
                onClick={onClose}
            />
            <div
                ref={dropdownRef}
                id={id}
                className="fixed z-50 bg-[#0A0A0A] rounded-xl shadow-2xl w-[360px] p-4 animate-scaleIn"
                style={{
                    top: position.top,
                    left: Math.max(16, position.left), // Ensure it doesn't go off-screen left
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <h3 className="text-lg font-semibold text-white">Filters</h3>
                        <p className="text-xs text-gray-400">Filter and sort the startups</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-[#23262F] rounded transition-colors"
                    >
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 mb-3 overflow-x-auto pb-1">
                    {FILTER_TABS.map(tab => (
                        <button
                            key={tab}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                                activeTab === tab
                                    ? 'bg-[#23262F] text-white'
                                    : 'bg-transparent text-gray-400 hover:bg-[#23262F]'
                            }`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="border-b border-[#23262F] mb-3" />

                {/* Tab Content */}
                <div className="max-h-[240px] overflow-y-auto">
                    {activeTab === 'Category' && (
                        <div className="space-y-2">
                            {[
                                'All',
                                'Software',
                                'EdTech',
                                'Fintech',
                                'AI',
                                'Blockchain',
                                'DeFi',
                                'Crypto',
                                'Automotive',
                            ].map((label) => (
                                <label key={label} className="flex items-center gap-2 text-sm text-white cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="appearance-none w-4 h-4 border border-gray-500 rounded bg-[#1A1A1A] checked:bg-[#4459FF] checked:border-[#4459FF] focus:outline-none cursor-pointer"
                                        defaultChecked={label === 'All'}
                                    />
                                    {label}
                                </label>
                            ))}
                        </div>
                    )}
                    {activeTab === 'Price' && (
                        <div>
                            <div className="flex justify-between text-sm text-white mb-2">
                                <span>$0</span>
                                <span>$5.4k</span>
                            </div>
                            <input type="range" min={0} max={100} className="w-full accent-[#4459FF]" />
                        </div>
                    )}
                    {activeTab === 'Performance' && (
                        <div className="space-y-2 text-sm">
                            <label className="flex items-center gap-2 text-white cursor-pointer">
                                <input type="radio" name="performance" className="accent-[#4459FF]" defaultChecked />
                                All
                            </label>
                            <label className="flex items-center gap-2 text-white cursor-pointer">
                                <input type="radio" name="performance" className="accent-[#4459FF]" />
                                <span>Positive Only <span className="text-green-500">(+%)</span></span>
                            </label>
                            <label className="flex items-center gap-2 text-white cursor-pointer">
                                <input type="radio" name="performance" className="accent-[#4459FF]" />
                                <span>Negative Only <span className="text-red-500">(-%)</span></span>
                            </label>
                        </div>
                    )}
                    {activeTab === 'Liquidity' && (
                        <div>
                            <div className="flex justify-between text-sm text-white mb-2">
                                <span>$0m</span>
                                <span>$71m</span>
                            </div>
                            <input type="range" min={0} max={100} className="w-full accent-[#4459FF]" />
                        </div>
                    )}
                    {activeTab === 'Market Cap' && (
                        <div>
                            <div className="flex justify-between text-sm text-white mb-2">
                                <span>$0m</span>
                                <span>$3.4b</span>
                            </div>
                            <input type="range" min={0} max={100} className="w-full accent-[#4459FF]" />
                        </div>
                    )}
                    {activeTab === 'Sort' && (
                        <div className="space-y-2 text-sm">
                            {[
                                { label: 'Alphabetical (A-Z)', value: 'az' },
                                { label: 'Price: High to Low', value: 'price_high' },
                                { label: 'Price: Low to High', value: 'price_low' },
                                { label: 'Performance: High to Low', value: 'perf_high', default: true },
                                { label: 'Performance: Low to High', value: 'perf_low' },
                                { label: 'Market Cap', value: 'market_cap' },
                            ].map((option) => (
                                <label key={option.value} className="flex items-center gap-2 text-white cursor-pointer">
                                    <input
                                        type="radio"
                                        name="sort"
                                        className="accent-[#4459FF]"
                                        defaultChecked={option.default}
                                    />
                                    {option.label}
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#23262F]">
                    <button
                        className="text-sm text-gray-400 hover:text-white transition-colors"
                        onClick={() => console.log('Reset filters')}
                    >
                        Reset
                    </button>
                    <div className="flex gap-2">
                        <button
                            className="px-4 py-1.5 rounded-lg bg-[#23262F] text-white text-sm hover:bg-[#2d3139] transition-colors"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            className="px-4 py-1.5 rounded-lg bg-[#4459FF] text-white text-sm font-medium hover:bg-[#3448EE] transition-colors"
                            onClick={() => {
                                console.log('Apply filters');
                                onClose();
                            }}
                        >
                            Apply
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
