import React, { useState, useEffect } from 'react';
import OverviewCard from './OverviewCard';
import TokenInfoCard from './TokenInfoCard';

interface TokenData {
  tokenId: string | null
  name: string
  symbol: string
  price: number
  annualYield: number
  industry: string
  payoutFrequency: string
  investmentType: string
  riskLevel: string
  listingDate: string
  closeDate: string | null
  logoUrl: string | null
  minimumInvestment: number
  volume: number
  transactionCount: number
}

const Sidebar: React.FC<{ tokenSymbol?: string; onDataRefresh?: () => void }> = ({ tokenSymbol, onDataRefresh }) => {
  const [walletBalance, setWalletBalance] = useState(0);
  const [token, setToken] = useState<TokenData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchData = async () => {
    try {
      // Fetch wallet balance
      const walletRes = await fetch('/api/wallet/balance');
      const walletData = await walletRes.json();
      if (walletData.success) {
        setWalletBalance(walletData.data.balance);
      }

      // Fetch token data
      const tokenRes = await fetch('/api/tokens');
      const tokenData = await tokenRes.json();
      if (tokenData.success && tokenData.tokens && tokenData.tokens.length > 0) {
        // Find the specific token by symbol, or use first token as fallback
        const foundToken = tokenSymbol 
          ? tokenData.tokens.find((t: any) => t.symbol === tokenSymbol)
          : tokenData.tokens[0];
        
        setToken(foundToken || tokenData.tokens[0]);
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tokenSymbol, refreshKey]);

  const handleTradeComplete = () => {
    // Refresh sidebar data
    setRefreshKey(prev => prev + 1);
    
    // Trigger parent refresh (for chart, transactions, etc.)
    if (onDataRefresh) {
      onDataRefresh();
    }
  };

  return (
    <div className="space-y-6">
      <OverviewCard 
        walletBalance={walletBalance} 
        tokenSymbol={token?.symbol || 'INV'}
        onTradeComplete={handleTradeComplete}
      />
      {loading ? (
        <div className="bg-[#151517] rounded-lg p-4 animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-700 rounded"></div>
          </div>
        </div>
      ) : (
        <TokenInfoCard token={token || undefined} />
      )}
    </div>
  );
};

export default Sidebar; 