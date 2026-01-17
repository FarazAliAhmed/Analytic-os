'use client'

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import WatchlistButton from "@/components/watchlist/WatchlistButton";

interface GainerRowProps {
    logo: string;
    name: string;
    company: string;
    price: number;
    change: number;
    industry: string;
    annualYield: string;
    marketCap: string;
    chart: string;
    tokenId?: string;
}

export default function GainerRow({ 
    logo, 
    name, 
    company, 
    price, 
    change, 
    industry, 
    annualYield, 
    marketCap, 
    chart,
    tokenId 
}: GainerRowProps) {
    const router = useRouter();
    const [isInWatchlist, setIsInWatchlist] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkWatchlist = async () => {
            try {
                const res = await fetch('/api/watchlist/ids');
                const data = await res.json();
                if (data.success && data.tokenIds) {
                    setIsInWatchlist(data.tokenIds.includes(tokenId || name));
                }
            } catch (error) {
                console.error('Failed to check watchlist:', error);
            } finally {
                setLoading(false);
            }
        };

        if (tokenId || name) {
            checkWatchlist();
        }
    }, [tokenId, name]);

    const handleClick = (e: React.MouseEvent) => {
        // Don't navigate if clicking on the star button
        const target = e.target as HTMLElement;
        if (target.closest('button') || target.closest('[role="button"]')) {
            e.stopPropagation();
            return;
        }
        router.push(`/dashboard/token`);
    }

    const handleWatchlistClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent row click
    }

    return (
        <tr className="border-t text-white cursor-pointer border-gray-800 hover:bg-gray-800 transition" onClick={handleClick}>
            <td className="py-3 px-4" onClick={handleWatchlistClick}>
                {!loading && (
                    <WatchlistButton
                        tokenId={tokenId || name}
                        initialIsInWatchlist={isInWatchlist}
                        size="md"
                        onToggle={(newState) => setIsInWatchlist(newState)}
                    />
                )}
                {loading && (
                    <div className="w-5 h-5 border-2 border-gray-600 border-t-yellow-500 rounded-full animate-spin"></div>
                )}
            </td>
            <td className="py-3 px-4 flex items-center gap-3">
                <Image src={logo} alt={name} width={28} height={28} className="rounded-full" />
                <div>
                    <div className="font-semibold">{name}</div>
                    <div className="text-xs text-gray-400">{company}</div>
                </div>
            </td>
            <td className="py-3 px-4">
                <div className="font-semibold">₦{price.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <div className="text-xs text-green-400">{change > 0 ? '+' : ''}{change}%</div>
            </td>
            <td className="py-3 px-4">{industry}</td>
            <td className="py-3 px-4">{annualYield}</td>
            <td className="py-3 px-4">{marketCap}</td>
            <td className="py-3 px-4">
                <Image src={chart} alt="chart" className="h-8" />
            </td>
        </tr>
    );
} 
