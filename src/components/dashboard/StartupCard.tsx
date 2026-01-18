'use client'

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FaRegStar, FaStar } from 'react-icons/fa';

interface StartupCardProps {
    name: string;
    symbol: string;
    price: number;
    change: number;
    logo: string;
    tokenId: string;
    initialIsInWatchlist?: boolean;
    onWatchlistToggle?: (tokenId: string, isInWatchlist: boolean) => void;
}

export default function StartupCard({ name, symbol, price, change, logo, tokenId, initialIsInWatchlist = false, onWatchlistToggle }: StartupCardProps) {
    const router = useRouter();
    const [isInWatchlist, setIsInWatchlist] = useState(initialIsInWatchlist);
    const [isLoading, setIsLoading] = useState(false);

    // Update local state when prop changes
    useEffect(() => {
        setIsInWatchlist(initialIsInWatchlist);
    }, [initialIsInWatchlist]);

    const handleStarClick = async (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card click
        
        if (isLoading) return;
        setIsLoading(true);

        try {
            if (isInWatchlist) {
                // Remove from watchlist
                const res = await fetch(`/api/watchlist/${tokenId}`, {
                    method: 'DELETE',
                });
                const data = await res.json();
                if (data.success) {
                    setIsInWatchlist(false);
                    onWatchlistToggle?.(tokenId, false);
                }
            } else {
                // Add to watchlist
                const res = await fetch('/api/watchlist', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ tokenId }),
                });
                const data = await res.json();
                if (data.success) {
                    setIsInWatchlist(true);
                    onWatchlistToggle?.(tokenId, true);
                }
            }
        } catch (error) {
            console.error('Failed to toggle watchlist:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClick = () => {
        router.push(`/dashboard/token?symbol=${symbol}`);
    };

    return (
        <div 
            onClick={handleClick}
            className="bg-[#18191B] border border-[#232325] rounded-xl p-4 min-w-[220px] flex flex-col gap-3 shadow-sm cursor-pointer hover:border-[#3a3a3c] transition-colors"
        >
            <div className="flex items-center justify-between w-full mb-1">
                <div className="flex items-center gap-2">
                    <Image src={logo} alt={symbol} width={28} height={28} className="rounded-full" />
                    <div>
                        <div className="font-bold text-white text-base leading-tight">{symbol}</div>
                        <div className="text-xs text-gray-400 leading-tight">{name}</div>
                    </div>
                </div>
                <button
                    onClick={handleStarClick}
                    disabled={isLoading}
                    className="p-1 hover:scale-110 transition-transform disabled:opacity-50"
                    aria-label={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
                >
                    {isInWatchlist ? (
                        <FaStar className="text-yellow-500 text-lg" />
                    ) : (
                        <FaRegStar className="text-gray-400 text-lg" />
                    )}
                </button>
            </div>
            <div className="flex items-end justify-between w-full mt-2">
                <div className="font-bold text-xl text-white">₦{price.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <div className={`font-bold text-lg ml-4 ${change < 0 ? 'text-[#FF4D4F]' : 'text-green-400'}`}>{change > 0 ? '+' : ''}{change}%</div>
            </div>
        </div>
    );
} 