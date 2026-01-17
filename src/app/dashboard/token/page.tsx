'use client'

import React, { useState, useEffect } from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';
import ChartCard from '@/components/dashboard/token/ChartCard';
import TransactionsTabs from '@/components/dashboard/token/TransactionsTabs';
import Sidebar from '@/components/dashboard/token/Sidebar';

interface TokenData {
  symbol: string;
  name: string;
  price: number;
  annualYield: number;
  volume: number;
  transactionCount: number;
}

export default function Page() {
    const [token, setToken] = useState<TokenData | null>(null);
    const [isInWatchlist, setIsInWatchlist] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTokenData = async () => {
            try {
                // Fetch token data (using first active token for now)
                const tokensRes = await fetch('/api/tokens');
                const tokensData = await tokensRes.json();
                if (tokensData.success && tokensData.tokens && tokensData.tokens.length > 0) {
                    const firstToken = tokensData.tokens[0];
                    setToken({
                        symbol: firstToken.symbol,
                        name: firstToken.name,
                        price: firstToken.price / 100, // Convert from kobo to Naira
                        annualYield: firstToken.annualYield,
                        volume: firstToken.volume / 100, // Convert from kobo to Naira
                        transactionCount: firstToken.transactionCount
                    });

                    // Check if in watchlist
                    const watchlistRes = await fetch('/api/watchlist/ids');
                    const watchlistData = await watchlistRes.json();
                    if (watchlistData.success && watchlistData.tokenIds) {
                        setIsInWatchlist(watchlistData.tokenIds.includes(firstToken.symbol));
                    }
                }
            } catch (err) {
                console.error('Failed to fetch token data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchTokenData();
    }, []);

    const toggleWatchlist = async () => {
        if (!token) return;
        
        try {
            if (isInWatchlist) {
                await fetch(`/api/watchlist/${token.symbol}`, { method: 'DELETE' });
            } else {
                await fetch('/api/watchlist', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ tokenId: token.symbol })
                });
            }
            setIsInWatchlist(!isInWatchlist);
        } catch (err) {
            console.error('Failed to toggle watchlist:', err);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#181A20] p-4 md:p-6">
                <div className="animate-pulse">
                    <div className="h-16 bg-gray-800 rounded mb-6"></div>
                    <div className="h-96 bg-gray-800 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#181A20] p-4 md:p-6">
            {/* Token Header */}
            {token && (
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {/* Token Icon */}
                        <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                            <span className="text-2xl">⭐</span>
                        </div>
                        
                        {/* Token Info */}
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-bold text-white">{token.symbol}</h1>
                                <button
                                    onClick={toggleWatchlist}
                                    className="text-yellow-500 hover:text-yellow-400 transition-colors"
                                >
                                    {isInWatchlist ? <FaStar size={24} /> : <FaRegStar size={24} />}
                                </button>
                            </div>
                            <p className="text-gray-400 text-sm">{token.name}</p>
                        </div>

                        {/* Price */}
                        <div className="ml-8">
                            <div className="text-4xl font-bold text-green-400">
                                ₦{token.price.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                            <div className="text-sm text-green-400">
                                +{token.annualYield}% APY
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="hidden md:flex gap-8">
                        <div>
                            <div className="text-gray-400 text-xs">Volume</div>
                            <div className="text-white font-semibold">
                                ₦{token.volume.toLocaleString('en-NG')}
                            </div>
                        </div>
                        <div>
                            <div className="text-gray-400 text-xs">Transactions</div>
                            <div className="text-white font-semibold">{token.transactionCount}</div>
                        </div>
                    </div>
                </div>
            )}

            <div className="w-full mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-3 space-y-6">
                    <ChartCard />
                    <TransactionsTabs />
                </div>
                {/* Sidebar */}
                <Sidebar />
            </div>
        </div>
    );
}