import React, { useState } from 'react';

const FILTER_TABS = [
    'Category', 'Price', 'Performance', 'Liquidity', 'Market Cap', 'Sort'
];

export default function FiltersModal({ open, onClose }: { open: boolean, onClose: () => void }) {
    const [activeTab, setActiveTab] = useState('Category');

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm">
            <div className="bg-[#0A0A0A] rounded-xl shadow-2xl md:w-full w-[95%] max-w-2xl mx-4 sm:mx-auto p-6 relative">
                {/* Close button */}
                <button className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl" onClick={onClose}>&times;</button>
                <h2 className="text-2xl font-semibold text-white mb-1">Filters</h2>
                <p className="text-gray-400 mb-4 text-lg">Filter and sort the startups displayed in the dashboard</p>
                {/* Tabs */}
                <div className="flex gap-2 mb-4">
                    {FILTER_TABS.map(tab => (
                        <button
                            key={tab}
                            className={`px-4 py-2 rounded-full text-base font-medium ${activeTab === tab ? 'bg-[#23262F] text-white' : 'bg-transparent text-gray-400 hover:bg-[#23262F]'}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <div className="border-b border-[#23262F] mb-4" />
                {/* Tab Content */}
                <div className="min-h-[180px]">
                    {activeTab === 'Category' && (
                        <div className='text-lg'>
                            <div className="font-medium text-white mb-2">Select Categories</div>
                            {/* <div className="grid grid-cols-2 gap-2 text-lg md:text-xl">
                                <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> All</label>
                                <label className="flex items-center gap-2"><input type="checkbox" /> Software</label>
                                <label className="flex items-center gap-2"><input type="checkbox" /> EdTech</label>
                                <label className="flex items-center gap-2"><input type="checkbox" /> Fintech</label>
                                <label className="flex items-center gap-2"><input type="checkbox" /> AI</label>
                                <label className="flex items-center gap-2"><input type="checkbox" /> Blockchain</label>
                                <label className="flex items-center gap-2"><input type="checkbox" /> DeFi</label>
                                <label className="flex items-center gap-2"><input type="checkbox" /> Crypto</label>
                                <label className="flex items-center gap-2"><input type="checkbox" /> Automotive</label>
                            </div> */}
                            <div className="grid grid-cols-2 gap-2 text-lg md:text-xl">
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
                                ].map((label, index) => (
                                    <label key={index} className="flex items-center gap-2 text-white">
                                        <input
                                            type="checkbox"
                                            className="appearance-none w-5 h-5 border border-white rounded-sm bg-black checked:bg-white checked:border-white focus:outline-none"
                                            defaultChecked={label === 'All'}
                                        />
                                        {label}
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                    {activeTab === 'Price' && (
                        <div className='text-lg'>
                            <div className="font-medium text-white mb-2">Price Range</div>
                            <input type="range" min={0} max={100} className="w-full accent-white" />
                            <div className="flex justify-between text-lg text-white mt-2">
                                <span>₦0</span>
                                <span>₦8,640,000</span>
                            </div>
                        </div>
                    )}
                    {activeTab === 'Performance' && (
                        <div className='text-lg'>
                            <div className="font-medium text-white mb-2">Performance</div>
                            <div className="flex flex-col gap-2 text-lg">
                                <label className="flex items-center gap-2"><input type="radio" name="performance" defaultChecked /> All</label>
                                <label className="flex items-center gap-2"><input type="radio" name="performance" /> <span>Positive Only <span className="text-green-500">(+%)</span></span></label>
                                <label className="flex items-center gap-2"><input type="radio" name="performance" /> <span>Negative Only <span className="text-red-500">(-%)</span></span></label>
                            </div>
                        </div>
                    )}
                    {activeTab === 'Liquidity' && (
                        <div className='text-lg'>
                            <div className="font-medium text-white mb-2">Liquidity Range</div>
                            <input type="range" min={0} max={100} className="w-full accent-white" />
                            <div className="flex justify-between text-lg text-white mt-2">
                                <span>₦0m</span>
                                <span>₦113,600m</span>
                            </div>
                        </div>
                    )}
                    {activeTab === 'Market Cap' && (
                        <div className='text-lg'>
                            <div className="font-medium text-white mb-2">Market Cap Range</div>
                            <input type="range" min={0} max={100} className="w-full accent-white" />
                            <div className="flex justify-between text-lg text-white mt-2">
                                <span>₦0b</span>
                                <span>₦5.4b</span>
                            </div>
                        </div>
                    )}
                    {activeTab === 'Sort' && (
                        <div className='text-lg'>
                            <div className="font-medium text-white mb-2">Sort By</div>
                            <div className="flex flex-col gap-2 text-lg md:text-xl">
                                <label className="flex items-center gap-2"><input type="radio" name="sort" /> Alphabetical (A-Z)</label>
                                <label className="flex items-center gap-2"><input type="radio" name="sort" /> Price: High to Low</label>
                                <label className="flex items-center gap-2"><input type="radio" name="sort" /> Price: Low to High</label>
                                <label className="flex items-center gap-2"><input type="radio" name="sort" defaultChecked /> Performance: High to Low</label>
                                <label className="flex items-center gap-2"><input type="radio" name="sort" /> Performance: Low to High</label>
                                <label className="flex items-center gap-2"><input type="radio" name="sort" /> Market Cap</label>
                            </div>
                        </div>
                    )}
                </div>
                {/* Footer */}
                <div className="flex justify-between items-center mt-8 border-t border-[#23262F] pt-4">
                    <button className="text-gray-400 hover:text-white">Reset</button>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 rounded bg-[#23262F] text-white" onClick={onClose}>Cancel</button>
                        <button className="px-4 py-2 rounded bg-white text-black font-semibold">Apply Filters</button>
                    </div>
                </div>
            </div>
        </div>
    );
} 