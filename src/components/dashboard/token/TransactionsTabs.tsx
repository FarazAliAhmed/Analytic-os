import React, { useState } from 'react';

const holders = [
    { rank: 1, address: 'HJ...k6c', percent: 2.29, amount: 22.9, value: '$1.0M' },
    { rank: 2, address: '6Gp...EkUX', percent: 3.5, amount: 22.9, value: '$952.7K' },
    { rank: 3, address: 'Buy', percent: 4.2, amount: 22.9, value: '$675.7K' },
    { rank: 4, address: 'Buy', percent: 6.28, amount: 22.9, value: '$661.0K' },
];

const transactions = [
    { date: '19s ago, Today', type: 'Buy', usd: 285.47, amount: '230,996', price: 1208.85, maker: '28aevP' },
    { date: '19s ago, Today', type: 'Sell', usd: 285.47, amount: '230,996', price: 1208.85, maker: '28aevP' },
    { date: '19s ago, Today', type: 'Buy', usd: 285.47, amount: '230,996', price: 1208.85, maker: '28aevP' },
    { date: '19s ago, Today', type: 'Buy', usd: 285.47, amount: '230,996', price: 1208.85, maker: '28aevP' },
];

const TABS = [
    { label: 'Transactions' },
    { label: 'Holders (401)' },
    { label: 'About' },
];

const TransactionsTabs: React.FC = () => {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div className="bg-[#0A0A0A] rounded-xl border border-[#23262F] p-0 overflow-hidden">
            {/* Tabs */}
            <div className="flex space-x-1 border-b border-[#23262F] bg-[#26262680] rounded-t-xl">
                {TABS.map((tab, idx) => (
                    <button
                        key={tab.label}
                        className={`px-6 py-3 cursor-pointer text-sm font-medium focus:outline-none transition-colors duration-150 ${activeTab === idx
                            ? 'text-white border-b-2 border-white' // active
                            : 'text-gray-400 border-b-2 border-transparent hover:text-white'
                            }`}
                        onClick={() => setActiveTab(idx)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="p-0">
                {activeTab === 0 && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm">
                            <thead>
                                <tr className="text-gray-500 text-xs uppercase">
                                    <th className="py-3 px-4 font-normal">Date</th>
                                    <th className="py-3 px-4 font-normal">Type</th>
                                    <th className="py-3 px-4 font-normal">USD</th>
                                    <th className="py-3 px-4 font-normal">Amount</th>
                                    <th className="py-3 px-4 font-normal">Price</th>
                                    <th className="py-3 px-4 font-normal">Maker</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((tx, i) => (
                                    <tr key={i} className="border-t border-[#23262F] last:rounded-b-xl">
                                        <td className="py-3 px-4 text-white">{tx.date}</td>
                                        <td className={`py-3 px-4 font-medium ${tx.type === 'Buy' ? 'text-green-500' : 'text-red-500'}`}>{tx.type}</td>
                                        <td className={`py-3 px-4 ${tx.type === 'Buy' ? 'text-green-500' : 'text-red-500'}`}>{tx.usd}</td>
                                        <td className="py-3 px-4 text-white">{tx.amount}</td>
                                        <td className={`py-3 px-4 font-semibold ${tx.type === 'Buy' ? 'text-green-500' : 'text-red-500'}`}>${tx.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                        <td className="py-3 px-4 text-white">{tx.maker}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {activeTab === 1 && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm">
                            <thead>
                                <tr className="text-gray-500 text-xs uppercase">
                                    <th className="py-3 px-4 font-normal">Rank</th>
                                    <th className="py-3 px-4 font-normal">Address</th>
                                    <th className="py-3 px-4 font-normal">%</th>
                                    <th className="py-3 px-4 font-normal">Amount</th>
                                    <th className="py-3 px-4 font-normal">Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                {holders.map((h, i) => (
                                    <tr key={i} className="border-t border-[#23262F] last:rounded-b-xl">
                                        <td className="py-3 px-4 text-white font-semibold">#{h.rank}</td>
                                        <td className="py-3 px-4 text-white">{h.address}</td>
                                        <td className="py-3 px-4 text-white">{h.percent}%</td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-white">{h.amount}M</span>
                                                <div className="w-32 h-2 bg-[#23262F] rounded-full overflow-hidden">
                                                    <div className="h-2 bg-white rounded-full" style={{ width: `${h.percent * 10}%` }} />
                                                </div>
                                                <span className="text-gray-500">999.9M</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-white font-bold text-right">{h.value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {activeTab === 2 && (
                    <div className="p-6">
                        <h2 className="text-xl font-bold mb-4 text-white">About PYSK</h2>
                        <div className="mb-6">
                            <div className="font-semibold text-white mb-1">Overview</div>
                            <div className="text-gray-300 text-sm">PYSK is a decentralized finance (DeFi) token designed to provide stable yield through low-risk, debt-based instruments. Built on a secure and scalable blockchain, PYSK offers transparent, automated investments for users seeking consistent returns.</div>
                        </div>
                        <div className="mb-6">
                            <div className="font-semibold text-white mb-1">Purpose</div>
                            <div className="text-gray-300 text-sm">The goal of PYSK is to democratize access to fixed-income opportunities by enabling investors to participate in structured debt offerings with ease and transparency. With automated smart contracts, users benefit from trustless execution and minimal counterparty risk.</div>
                        </div>
                        <div className="mb-6">
                            <div className="font-semibold text-white mb-2">Investment Mechanics</div>
                            <table className="min-w-full text-left text-sm mb-2">
                                <tbody>
                                    <tr>
                                        <td className="py-1 px-2 text-gray-400">Type</td>
                                        <td className="py-1 px-2 text-white">Debt-based instrument</td>
                                        <td className="py-1 px-2 text-gray-400">Payout Frequency</td>
                                        <td className="py-1 px-2 text-white">Monthly</td>
                                        <td className="py-1 px-2 text-gray-400">Annual Yield</td>
                                        <td className="py-1 px-2 text-white">35%</td>
                                    </tr>
                                    <tr>
                                        <td className="py-1 px-2 text-gray-400">Minimum Investment</td>
                                        <td className="py-1 px-2 text-white">1 USDT</td>
                                        <td className="py-1 px-2 text-gray-400">Risk Level</td>
                                        <td className="py-1 px-2 text-white">Low</td>
                                        <td className="py-1 px-2 text-gray-400">Employee Count</td>
                                        <td className="py-1 px-2 text-white">50</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div>
                            <div className="font-semibold text-white mb-1">Security & Compliance</div>
                            <div className="text-gray-300 text-sm">Each transaction is recorded on-chain with verifiable smart contract logic. Regular audits and community governance ensure accountability and long-term sustainability.</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TransactionsTabs; 