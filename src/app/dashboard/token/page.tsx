'use client'

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { FaStar, FaRegStar } from 'react-icons/fa';
import ChartCard from '@/components/dashboard/token/ChartCard';
import TransactionsTabs from '@/components/dashboard/token/TransactionsTabs';
import Sidebar from '@/components/dashboard/token/Sidebar';
import { useToken } from '@/contexts/TokenContext';

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

    // Get context functions
    const { setTokenData, clearTokenData } = useToken();

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
                    
                    const tokenData = {
                        symbol: selectedToken.symbol,
                        name: selectedToken.name,
                        price: selectedToken.price / 100, // Convert from kobo to Naira
                        annualYield: selectedToken.annualYield,
                        volume: selectedToken.volume / 100, // Convert from kobo to Naira
                        transactionCount: selectedToken.transactionCount
                    };
                    
                    setToken(tokenData);

                    // Check if in watchlist
                    const watchlistRes = await fetch('/api/watchlist/ids');
                    const watchlistData = await watchlistRes.json();
                    const inWatchlist = watchlistData.success && watchlistData.tokenIds 
                        ? watchlistData.tokenIds.includes(selectedToken.symbol)
                        : false;
                    
                    setIsInWatchlist(inWatchlist);

                    // Update header with token data
                    setTokenData({
                        symbol: tokenData.symbol,
                        price: tokenData.price,
                        change: tokenData.annualYield,
                        percentChange: tokenData.annualYield * 0.01,
                        isInWatchlist: inWatchlist
                    });
                }
            } catch (err) {
                console.error('Failed to fetch token data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchTokenData();

        // Clear token data when leaving the page
        return () => {
            clearTokenData();
        };
    }, [tokenSymbol, setTokenData, clearTokenData]);

    const toggleWatchlist = async () => {
        if (!token) return;
        
        try {
            const newWatchlistState = !isInWatchlist;
            
            if (isInWatchlist) {
                await fetch(`/api/watchlist/${token.symbol}`, { method: 'DELETE' });
            } else {
                await fetch('/api/watchlist', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ tokenId: token.symbol })
                });
            }
            
            setIsInWatchlist(newWatchlistState);
            
            // Update header watchlist state
            setTokenData({
                symbol: token.symbol,
                price: token.price,
                change: token.annualYield,
                percentChange: token.annualYield * 0.01,
                isInWatchlist: newWatchlistState
            });
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