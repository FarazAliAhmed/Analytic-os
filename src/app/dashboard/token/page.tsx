'use client'

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
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

function TokenPageContent() {
    const searchParams = useSearchParams();
    const tokenSymbol = searchParams.get('symbol'); // Get symbol from URL
    
    const [token, setToken] = useState<TokenData | null>(null);
    const [isInWatchlist, setIsInWatchlist] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTokenData = async () => {
            try {
                // Fetch token data
                const tokensRes = await fetch('/api/tokens');
                const tokensData = await tokensRes.json();
                if (tokensData.success && tokensData.tokens && tokensData.tokens.length > 0) {
                    // Find token by symbol from URL, or use first token as fallback
                    const foundToken = tokenSymbol
                        ? tokensData.tokens.find((t: any) => t.symbol === tokenSymbol)
                        : tokensData.tokens[0];
                    
                    const selectedToken = foundToken || tokensData.tokens[0];
                    
                    setToken({
                        symbol: selectedToken.symbol,
                        name: selectedToken.name,
                        price: selectedToken.price / 100, // Convert from kobo to Naira
                        annualYield: selectedToken.annualYield,
                        volume: selectedToken.volume / 100, // Convert from kobo to Naira
                        transactionCount: selectedToken.transactionCount
                    });

                    // Check if in watchlist
                    const watchlistRes = await fetch('/api/watchlist/ids');
                    const watchlistData = await watchlistRes.json();
                    if (watchlistData.success && watchlistData.tokenIds) {
                        setIsInWatchlist(watchlistData.tokenIds.includes(selectedToken.symbol));
                    }
                }
            } catch (err) {
                console.error('Failed to fetch token data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchTokenData();
    }, [tokenSymbol]);

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
                <div className="mb-6 flex items-center gap-6">
                    {/* Token Icon */}
                    <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <span className="text-3xl">⭐</span>
                    </div>
                    
                    {/* Token Symbol */}
                    <div className="flex-shrink-0">
                        <h1 className="text-5xl font-bold text-white tracking-tight">{token.symbol}</h1>
                    </div>

                    {/* Price & Stats */}
                    <div className="ml-auto text-right">
                        <div className="text-5xl font-bold text-[#C8FF00]">
                            {token.price.toLocaleString('en-NG', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                        </div>
                        <div className="text-lg text-[#C8FF00] flex items-center justify-end gap-2 mt-1">
                            <span>{token.annualYield.toFixed(2)}</span>
                            <span>+{(token.annualYield * 0.01).toFixed(2)}%</span>
                        </div>
                    </div>

                    {/* Watchlist Button */}
                    <button
                        onClick={toggleWatchlist}
                        className="text-yellow-500 hover:text-yellow-400 transition-colors flex-shrink-0"
                    >
                        {isInWatchlist ? <FaStar size={24} /> : <FaRegStar size={24} />}
                    </button>
                </div>
            )}

            {/* Stats Row - Hidden on mobile, shown on desktop */}
            {token && (
                <div className="hidden md:flex gap-8 mb-6">
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
            )}

            <div className="w-full mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-3 space-y-6">
                    <ChartCard />
                    <TransactionsTabs />
                </div>
                {/* Sidebar */}
                <Sidebar tokenSymbol={token?.symbol} />
            </div>
        </div>
    );
}

export default function Page() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#181A20] p-4 md:p-6">
                <div className="animate-pulse">
                    <div className="h-16 bg-gray-800 rounded mb-6"></div>
                    <div className="h-96 bg-gray-800 rounded"></div>
                </div>
            </div>
        }>
            <TokenPageContent />
        </Suspense>
    );
}