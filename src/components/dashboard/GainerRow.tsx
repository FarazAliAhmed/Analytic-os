'use client'

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import WatchlistButton from "@/components/watchlist/WatchlistButton";
import { useCurrency } from '@/contexts/CurrencyContext';

interface GainerRowProps {
    logo: string;
    name: string;
    company: string;
    price: number;
    change: number;
    industry: string;
    annualYield: string;
    yieldPayout?: string;
    marketCap: string;
    chart: string;
    tokenId?: string;
    initialIsInWatchlist?: boolean;
    onWatchlistToggle?: (tokenId: string, isInWatchlist: boolean) => void;
}

export default function GainerRow({ 
    logo, 
    name, 
    company, 
    price, 
    change, 
    industry, 
    annualYield,
    yieldPayout,
    marketCap, 
    chart,
    tokenId,
    initialIsInWatchlist = false,
    onWatchlistToggle
}: GainerRowProps) {
    const router = useRouter();
    const [isInWatchlist, setIsInWatchlist] = useState(initialIsInWatchlist);
    const { formatAmount } = useCurrency();

    // Update local state when prop changes
    useEffect(() => {
        setIsInWatchlist(initialIsInWatchlist);
    }, [initialIsInWatchlist]);

    const handleClick = (e: React.MouseEvent) => {
        // Don't navigate if clicking on the star button
        const target = e.target as HTMLElement;
        if (target.closest('button') || target.closest('[role="button"]')) {
            e.stopPropagation();
            return;
        }
        // Navigate with symbol parameter
        router.push(`/dashboard/token?symbol=${name}`);
    }

    const handleWatchlistClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent row click
    }

    const handleWatchlistToggle = (newState: boolean) => {
        setIsInWatchlist(newState);
        onWatchlistToggle?.(tokenId || name, newState);
    };

    return (
        <tr className="border-t text-white cursor-pointer border-gray-800 hover:bg-gray-800 transition" onClick={handleClick}>
            <td className="py-3 px-4" onClick={handleWatchlistClick}>
                <WatchlistButton
                    tokenId={tokenId || name}
                    initialIsInWatchlist={isInWatchlist}
                    size="md"
                    onToggle={handleWatchlistToggle}
                />
            </td>
            <td className="py-3 px-4 flex items-center gap-3">
                {logo ? (
                    <Image src={logo} alt={name} width={28} height={28} className="rounded-full" />
                ) : (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                        {name.substring(0, 2)}
                    </div>
                )}
                <div>
                    <div className="font-semibold">{name}</div>
                    <div className="text-xs text-gray-400">{company}</div>
                </div>
            </td>
            <td className="py-3 px-4">
                <div className="font-semibold">{formatAmount(price)}</div>
                <div className="text-xs text-green-400">{change > 0 ? '+' : ''}{change}%</div>
            </td>
            <td className="py-3 px-4">{industry}</td>
            <td className="py-3 px-4">{annualYield}</td>
            <td className="py-3 px-4 text-green-400 font-semibold">{yieldPayout || '---'}</td>
            <td className="py-3 px-4">{marketCap}</td>
            <td className="py-3 px-4">
                <Image src={chart} alt="chart" className="h-8" />
            </td>
        </tr>
    );
} 
