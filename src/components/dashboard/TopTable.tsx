import { useEffect, useState } from 'react';
import GainerRow from './GainerRow';

interface Token {
  id: string;
  symbol: string;
  name: string;
  price: number;
  annualYield: number;
  industry: string;
  logoUrl: string | null;
  volume: number;
  listingDate: string;
}

interface TopTableProps {
  activeTab?: string;
}

export default function TopTable({ activeTab = 'all' }: TopTableProps) {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const res = await fetch('/api/tokens');
        const data = await res.json();
        if (data.success) {
          let filtered = [...data.tokens];
          
          // Filter based on active tab
          if (activeTab === 'volume') {
            // Sort by volume (highest first)
            filtered = filtered.sort((a: Token, b: Token) => b.volume - a.volume);
          } else if (activeTab === 'upcoming') {
            // Show tokens with future listing dates
            const now = new Date();
            filtered = filtered.filter((t: Token) => new Date(t.listingDate) > now);
            filtered = filtered.sort((a: Token, b: Token) => 
              new Date(a.listingDate).getTime() - new Date(b.listingDate).getTime()
            );
          } else {
            // All listings - sort by newest first
            filtered = filtered.sort((a: Token, b: Token) => 
              new Date(b.listingDate).getTime() - new Date(a.listingDate).getTime()
            );
          }
          
          setTokens(filtered.slice(0, 20));
        }
      } catch (error) {
        console.error('Failed to fetch tokens:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, [activeTab]);

  if (loading) {
    return (
      <div className="bg-secondary rounded-lg pt-4 px-4 overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="text-left text-gray-400 text-sm">
              <th className="py-3 px-4"></th>
              <th className="py-3 px-4">Company</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Industry</th>
              <th className="py-3 px-4">Annual Yield</th>
              <th className="py-3 px-4">Volume</th>
              <th className="py-3 px-4">Last 7d</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4].map((i) => (
              <tr key={i} className="animate-pulse">
                <td className="py-3 px-4"><div className="w-8 h-8 bg-gray-700 rounded-full" /></td>
                <td className="py-3 px-4"><div className="h-4 w-24 bg-gray-700 rounded" /></td>
                <td className="py-3 px-4"><div className="h-4 w-16 bg-gray-700 rounded" /></td>
                <td className="py-3 px-4"><div className="h-4 w-20 bg-gray-700 rounded" /></td>
                <td className="py-3 px-4"><div className="h-4 w-12 bg-gray-700 rounded" /></td>
                <td className="py-3 px-4"><div className="h-4 w-20 bg-gray-700 rounded" /></td>
                <td className="py-3 px-4"><div className="h-4 w-16 bg-gray-700 rounded" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (tokens.length === 0) {
    return (
      <div className="bg-secondary rounded-lg pt-4 px-4 py-8 text-center text-gray-400">
        No tokens available
      </div>
    );
  }

  return (
    <div className="bg-secondary rounded-lg pt-4 px-4 overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="text-left text-gray-400 text-sm">
            <th className="py-3 px-4"></th>
            <th className="py-3 px-4">Company</th>
            <th className="py-3 px-4">Price</th>
            <th className="py-3 px-4">Industry</th>
            <th className="py-3 px-4">Annual Yield</th>
            <th className="py-3 px-4">Volume</th>
            <th className="py-3 px-4">Last 7d</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((token) => (
            <GainerRow
              key={token.id}
              logo={token.logoUrl || '/icons/weth.svg'}
              name={token.symbol}
              company={token.name}
              price={token.price / 100}
              change={0}
              industry={token.industry}
              annualYield={`${token.annualYield}%`}
              marketCap={`₦${token.volume.toLocaleString()}`}
              chart="/icons/chart.svg"
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
