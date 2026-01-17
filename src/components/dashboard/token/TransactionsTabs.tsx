'use client'

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

interface Holder {
    rank: number
    userId: string
    percent: number
    amount: number
    value: number
    valueFormatted: string
}

const TABS = [
    { label: 'Transactions' },
    { label: 'My Orders' },
    { label: 'Holders' },
    { label: 'About' },
];

interface Transaction {
    id: string
    date: string
    type: 'buy' | 'sell'
    currency: string
    amount: number
    pricePerToken: number
    totalAmount: number
    userId: string
}

interface AllTransaction {
    id: string
    date: string
    type: 'buy' | 'sell'
    ngn: number
    amount: number
    price: number
    maker: string
}

interface TokenData {
    symbol: string
    name: string
    investmentType: string
    payoutFrequency: string
    annualYield: number
    minimumInvestment: number
    riskLevel: string
    employeeCount: number
    contractAddress: string | null
}

const TransactionsTabs: React.FC = () => {
    const searchParams = useSearchParams();
    const tokenSymbol = searchParams.get('symbol') || 'NG';
    
    const [activeTab, setActiveTab] = useState(0);
    const [allTransactions, setAllTransactions] = useState<AllTransaction[]>([]);
    const [myTransactions, setMyTransactions] = useState<Transaction[]>([]);
    const [holders, setHolders] = useState<Holder[]>([]);
    const [totalHolders, setTotalHolders] = useState(0);
    const [tokenData, setTokenData] = useState<TokenData | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (activeTab === 0) {
            fetchAllTransactions();
        } else if (activeTab === 1) {
            fetchMyTransactions();
        } else if (activeTab === 2) {
            fetchHolders();
        } else if (activeTab === 3) {
            fetchTokenData();
        }
    }, [activeTab, tokenSymbol]);

    const fetchTokenData = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/tokens');
            const data = await res.json();
            if (data.success && data.tokens && data.tokens.length > 0) {
                const token = data.tokens.find((t: any) => t.symbol === tokenSymbol) || data.tokens[0];
                setTokenData({
                    symbol: token.symbol,
                    name: token.name,
                    investmentType: token.investmentType,
                    payoutFrequency: token.payoutFrequency,
                    annualYield: token.annualYield,
                    minimumInvestment: token.minimumInvestment / 100, // Convert from kobo
                    riskLevel: token.riskLevel,
                    employeeCount: token.employeeCount,
                    contractAddress: token.contractAddress
                });
            }
        } catch (err) {
            console.error('Failed to fetch token data:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchHolders = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/token/holders?symbol=${tokenSymbol}`);
            const data = await res.json();
            if (data.success) {
                setHolders(data.holders);
                setTotalHolders(data.totalHolders);
            }
        } catch (err) {
            console.error('Failed to fetch holders:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAllTransactions = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/token/all-transactions');
            const data = await res.json();
            if (data.success) {
                setAllTransactions(data.transactions || []);
            }
        } catch (err) {
            console.error('Failed to fetch all transactions:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchMyTransactions = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/token/transactions');
            const data = await res.json();
            if (data.success) {
                setMyTransactions(data.transactions || []);
            }
        } catch (err) {
            console.error('Failed to fetch transactions:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-NG', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="bg-[#0A0A0A] rounded-xl border border-[#23262F] p-0 overflow-hidden">
            {/* Tabs */}
            <div className="flex space-x-1 border-b border-[#23262F] bg-[#26262680] rounded-t-xl overflow-x-auto">
                {TABS.map((tab, idx) => (
                    <button
                        key={tab.label}
                        className={`px-4 py-3 cursor-pointer text-sm font-medium focus:outline-none transition-colors duration-150 whitespace-nowrap ${activeTab === idx
                            ? 'text-white border-b-2 border-white'
                            : 'text-gray-400 border-b-2 border-transparent hover:text-white'
                            }`}
                        onClick={() => setActiveTab(idx)}
                    >
                        {idx === 2 ? `Holders (${totalHolders})` : tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="p-0">
                {activeTab === 0 && (
                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="p-8 text-center text-gray-400">Loading...</div>
                        ) : allTransactions.length === 0 ? (
                            <div className="p-8 text-center text-gray-400">
                                No transactions yet.
                            </div>
                        ) : (
                            <table className="min-w-full text-left text-sm">
                                <thead>
                                    <tr className="text-gray-500 text-xs uppercase">
                                        <th className="py-3 px-4 font-normal">Date</th>
                                        <th className="py-3 px-4 font-normal">Type</th>
                                        <th className="py-3 px-4 font-normal">NGN</th>
                                        <th className="py-3 px-4 font-normal">Amount</th>
                                        <th className="py-3 px-4 font-normal">Price</th>
                                        <th className="py-3 px-4 font-normal">Maker</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allTransactions.map((tx) => (
                                        <tr key={tx.id} className="border-t border-[#23262F]">
                                            <td className="py-3 px-4 text-white">{formatDate(tx.date)}</td>
                                            <td className={`py-3 px-4 font-medium capitalize ${tx.type === 'buy' ? 'text-green-500' : 'text-red-500'}`}>{tx.type}</td>
                                            <td className="py-3 px-4 text-white">₦{tx.ngn.toLocaleString()}</td>
                                            <td className="py-3 px-4 text-white">{tx.amount}</td>
                                            <td className="py-3 px-4 text-green-400">₦{tx.price.toLocaleString()}</td>
                                            <td className="py-3 px-4 text-gray-400">{tx.maker}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
                {activeTab === 1 && (
                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="p-8 text-center text-gray-400">Loading...</div>
                        ) : myTransactions.length === 0 ? (
                            <div className="p-8 text-center text-gray-400">
                                No transactions yet. Buy some tokens to see your history.
                            </div>
                        ) : (
                            <table className="min-w-full text-left text-sm">
                                <thead>
                                    <tr className="text-gray-500 text-xs uppercase">
                                        <th className="py-3 px-4 font-normal">Date</th>
                                        <th className="py-3 px-4 font-normal">Type</th>
                                        <th className="py-3 px-4 font-normal">NGN</th>
                                        <th className="py-3 px-4 font-normal">Amount</th>
                                        <th className="py-3 px-4 font-normal">Price</th>
                                        <th className="py-3 px-4 font-normal">User ID</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {myTransactions.map((tx) => (
                                        <tr key={tx.id} className="border-t border-[#23262F]">
                                            <td className="py-3 px-4 text-white">{formatDate(tx.date)}</td>
                                            <td className="py-3 px-4 font-medium text-green-500 capitalize">{tx.type}</td>
                                            <td className="py-3 px-4 text-white">₦{tx.totalAmount.toLocaleString()}</td>
                                            <td className="py-3 px-4 text-white">{tx.amount}</td>
                                            <td className="py-3 px-4 text-white">₦{tx.pricePerToken.toLocaleString()}</td>
                                            <td className="py-3 px-4 text-gray-400 text-xs">{tx.userId}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
                {activeTab === 2 && (
                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="text-center text-gray-400 py-8">Loading holders...</div>
                        ) : holders.length === 0 ? (
                            <div className="text-center text-gray-400 py-8">No holders found</div>
                        ) : (
                            <table className="min-w-full text-left text-sm">
                                <thead>
                                    <tr className="text-gray-500 text-xs uppercase">
                                        <th className="py-3 px-4 font-normal">Rank</th>
                                        <th className="py-3 px-4 font-normal">User ID</th>
                                        <th className="py-3 px-4 font-normal">%</th>
                                        <th className="py-3 px-4 font-normal">Amount</th>
                                        <th className="py-3 px-4 font-normal">Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {holders.map((h) => (
                                        <tr key={h.rank} className="border-t border-[#23262F]">
                                            <td className="py-3 px-4 text-white font-semibold">#{h.rank}</td>
                                            <td className="py-3 px-4 text-white">{h.userId}</td>
                                            <td className="py-3 px-4 text-white">{h.percent}%</td>
                                            <td className="py-3 px-4 text-white">{h.amount}</td>
                                            <td className="py-3 px-4 text-white font-bold text-right">{h.valueFormatted}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
                {activeTab === 3 && (
                    <div className="p-6">
                        {loading ? (
                            <div className="text-center text-gray-400">Loading...</div>
                        ) : (
                            <>
                                <h2 className="text-xl font-bold mb-4 text-white">About {tokenData?.symbol || 'Token'}</h2>
                                <div className="mb-6">
                                    <div className="font-semibold text-white mb-1">Overview</div>
                                    <div className="text-gray-300 text-sm">{tokenData?.name || 'Token'} is a decentralized finance (DeFi) token designed to provide stable yield through low-risk, debt-based instruments. Built on a secure and scalable blockchain, it offers transparent, automated investments for users seeking consistent returns.</div>
                                </div>
                                <div className="mb-6">
                                    <div className="font-semibold text-white mb-1">Purpose</div>
                                    <div className="text-gray-300 text-sm">The goal is to democratize access to fixed-income opportunities by enabling investors to participate in structured debt offerings with ease and transparency. With automated smart contracts, users benefit from trustless execution and minimal counterparty risk.</div>
                                </div>
                                <div className="mb-6">
                                    <div className="font-semibold text-white mb-2">Investment Mechanics</div>
                                    <table className="min-w-full text-left text-sm mb-2">
                                        <tbody>
                                            <tr>
                                                <td className="py-1 px-2 text-gray-400">Type</td>
                                                <td className="py-1 px-2 text-white">{tokenData?.investmentType || '---'}</td>
                                                <td className="py-1 px-2 text-gray-400">Payout Frequency</td>
                                                <td className="py-1 px-2 text-white">{tokenData?.payoutFrequency || '---'}</td>
                                                <td className="py-1 px-2 text-gray-400">Annual Yield</td>
                                                <td className="py-1 px-2 text-white">{tokenData?.annualYield ? `${tokenData.annualYield}%` : '---'}</td>
                                            </tr>
                                            <tr>
                                                <td className="py-1 px-2 text-gray-400">Minimum Investment</td>
                                                <td className="py-1 px-2 text-white">{tokenData?.minimumInvestment ? `₦${tokenData.minimumInvestment.toLocaleString()}` : '---'}</td>
                                                <td className="py-1 px-2 text-gray-400">Risk Level</td>
                                                <td className="py-1 px-2 text-white">{tokenData?.riskLevel || '---'}</td>
                                                <td className="py-1 px-2 text-gray-400">Employee Count</td>
                                                <td className="py-1 px-2 text-white">{tokenData?.employeeCount || '---'}</td>
                                            </tr>
                                            {tokenData?.contractAddress && (
                                                <tr>
                                                    <td className="py-1 px-2 text-gray-400">Contract ID</td>
                                                    <td colSpan={5} className="py-1 px-2 text-white font-mono text-xs break-all">{tokenData.contractAddress}</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <div>
                                    <div className="font-semibold text-white mb-1">Security & Compliance</div>
                                    <div className="text-gray-300 text-sm">Each transaction is recorded on-chain with verifiable smart contract logic. Regular audits and community governance ensure accountability and long-term sustainability.</div>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TransactionsTabs;
