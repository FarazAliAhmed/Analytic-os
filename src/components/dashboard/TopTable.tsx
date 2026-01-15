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
}

export default function TopTable() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const res = await fetch('/api/tokens');
        const data = await res.json();
        if (data.success) {
          // Take top 10 tokens by volume
          const sorted = [...data.tokens].sort((a: Token, b: Token) => b.volume - a.volume);
          setTokens(sorted.slice(0, 10));
        }
      } catch (error) {
        console.error('Failed to fetch tokens:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, []);

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
