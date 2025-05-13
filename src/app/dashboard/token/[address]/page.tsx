import React from 'react';
import ChartCard from '@/components/dashboard/token/ChartCard';
import TransactionsTabs from '@/components/dashboard/token/TransactionsTabs';
import Sidebar from '@/components/dashboard/token/Sidebar';
// import TokenChart from '@/components/dashboard/token/TokenChart';
// import TokenStats from '@/components/dashboard/token/TokenStats';

// Mock data - replace with actual API calls
const mockTokenData = {
    name: 'Example Token',
    symbol: 'EXT',
    price: 1.23,
    change24h: 5.67,
    marketCap: 123456789,
    volume24h: 9876543,
    logoUrl: '/placeholder-token.png',
    totalSupply: 1000000000,
    circulatingSupply: 750000000,
    holders: 12345,
    transactions24h: 5678,
    contractAddress: '0x1234567890abcdef1234567890abcdef12345678',
    website: 'https://example.com',
    socialLinks: {
        twitter: 'https://twitter.com/example',
        telegram: 'https://t.me/example',
        discord: 'https://discord.gg/example',
    },
};

// Mock chart data - replace with actual API calls
const mockChartData = Array.from({ length: 24 }, (_, i) => ({
    timestamp: Date.now() - (23 - i) * 3600000,
    price: 1.23 + Math.random() * 0.1 - 0.05,
}));

export default function TokenPage({ params }: { params: { address: string } }) {
    return (
        <div className="min-h-screen bg-primary p-4 md:p-6">
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