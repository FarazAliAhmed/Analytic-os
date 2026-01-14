'use client'

import React, { useState, useEffect } from 'react';
import { FiInfo } from 'react-icons/fi';

interface OverviewCardProps {
  walletBalance?: number;
}

const OverviewCard: React.FC<OverviewCardProps> = ({ walletBalance = 0 }) => {
  const [amount, setAmount] = useState('');
  const [tokenBalance, setTokenBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const TOKEN_PRICE = 1500;
  const tokensReceived = amount ? Math.floor(parseFloat(amount) / TOKEN_PRICE) : 0;

  // Fetch token balance
  useEffect(() => {
    const fetchTokenBalance = async () => {
      try {
        const res = await fetch('/api/token/balance');
        const data = await res.json();
        if (data.success && data.holdings) {
          setTokenBalance(data.holdings.quantity);
        }
      } catch (err) {
        console.error('Failed to fetch token balance:', err);
      }
    };
    fetchTokenBalance();
  }, []);

  const handleBuy = async () => {
    const nairaAmount = parseFloat(amount);
    if (!nairaAmount || nairaAmount < TOKEN_PRICE) {
      setError(`Minimum purchase is ₦${TOKEN_PRICE.toLocaleString()}`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/token/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nairaAmount }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccessMessage(`Purchase successful! ${data.purchase.tokensReceived} INV added to your holdings.`);
        setTokenBalance(data.purchase.newTokenBalance);
        setAmount('');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(data.error || 'Purchase failed');
      }
    } catch (err) {
      setError('Purchase failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#151517] rounded-lg p-4 text-gray-200">
      <div className="flex items-center mb-4">
        <span className="text-base font-semibold mr-2">Overview</span>
        <FiInfo className="text-gray-400" size={16} />
      </div>

      {/* Token Holdings */}
      <div className="mb-4 p-3 bg-[#181A20] rounded-lg">
        <div className="text-gray-400 text-sm">Your Holdings</div>
        <div className="text-white font-bold text-xl">{tokenBalance} INV</div>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4 text-sm">
        <div>
          <div className="text-gray-400">Price</div>
          <div className="font-semibold text-white">₦1,500</div>
        </div>
        <div>
          <div className="text-gray-400">Market Cap</div>
          <div className="font-semibold text-white">₦83.2m</div>
        </div>
        <div>
          <div className="text-gray-400">Volume</div>
          <div className="font-semibold text-white">₦302,400</div>
        </div>
        <div>
          <div className="text-gray-400">TSPv</div>
          <div className="font-semibold text-white">₦3.2m</div>
        </div>
        <div>
          <div className="text-gray-400">Transactions</div>
          <div className="font-semibold text-white">289</div>
        </div>
        <div>
          <div className="text-gray-400">Liquidity</div>
          <div className="font-semibold text-white">289</div>
        </div>
        <div className="col-span-1">
          <div className="text-gray-400">Date of Listing</div>
          <div className="font-semibold text-white">May 23, 2025</div>
        </div>
        <div className="col-span-1">
          <div className="text-gray-400">Contract Address</div>
          <div className="font-semibold text-white text-xs break-all">0xe54d08a...bfd4b</div>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-3 p-2 bg-green-500/20 text-green-400 text-sm rounded text-center">
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-3 p-2 bg-red-500/20 text-red-400 text-sm rounded text-center">
          {error}
        </div>
      )}

      {/* Amount Input */}
      <div className="mb-2">
        <label className="block text-xs mb-1">Amount</label>
        <div className="relative">
          <input
            type="number"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setError('');
              setSuccessMessage('');
            }}
            className="w-full bg-[#181A20] border border-[#353945] rounded px-2 py-2 pr-20 text-white text-sm focus:outline-none focus:border-[#4459FF]"
            placeholder="0"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-[#353945] px-2 py-1 rounded text-xs">
            <span className="text-green-400 font-bold">₦</span>
            <span className="text-white">Naira</span>
          </div>
        </div>
        <div className="flex justify-between text-xs mt-1">
          <span className="text-red-500">Min: ₦{TOKEN_PRICE.toLocaleString()}</span>
          <span className="text-green-400">Available: ₦{(walletBalance / 100).toLocaleString()}</span>
        </div>
      </div>

      {/* Quick Amount Buttons */}
      <div className="flex space-x-2 mb-2">
        {[1500, 3000, 5000, 10000].map((amt) => (
          <button
            key={amt}
            onClick={() => {
              setAmount(amt.toString());
              setError('');
              setSuccessMessage('');
            }}
            disabled={amt * 100 > walletBalance}
            className="flex-1 bg-[#181A20] text-gray-300 rounded py-1 hover:bg-[#353945] disabled:opacity-30 disabled:cursor-not-allowed text-xs font-medium"
          >
            ₦{amt.toLocaleString()}
          </button>
        ))}
      </div>

      {/* Buy Button */}
      <button
        onClick={handleBuy}
        disabled={loading || !amount || parseFloat(amount) < TOKEN_PRICE}
        className="w-full bg-[#4459FF] hover:bg-[#3448EE] disabled:bg-[#353A45] disabled:cursor-not-allowed text-white rounded py-2 font-semibold text-base mt-2 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Processing...
          </>
        ) : (
          'Buy'
        )}
      </button>
    </div>
  );
};

export default OverviewCard;
