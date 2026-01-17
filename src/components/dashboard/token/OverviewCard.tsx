'use client'

import React, { useState, useEffect } from 'react';
import { FiInfo, FiChevronDown } from 'react-icons/fi';

interface OverviewCardProps {
  walletBalance?: number;
  tokenSymbol?: string;
}

type Currency = 'NGN' | 'USDT';

const OverviewCard: React.FC<OverviewCardProps> = ({ walletBalance = 0, tokenSymbol = 'INV' }) => {
  const [amount, setAmount] = useState('');
  const [tokenBalance, setTokenBalance] = useState(0);
  const [tokenPrice, setTokenPrice] = useState(1500);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [currency, setCurrency] = useState<Currency>('NGN');
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);

  // USDT to NGN exchange rate (you can fetch this from an API)
  const USDT_TO_NGN = 1650; // Example rate

  const tokensReceived = amount ? Math.floor(parseFloat(amount) / (currency === 'NGN' ? tokenPrice : tokenPrice / USDT_TO_NGN)) : 0;

  // Fetch token balance and price
  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        const balanceRes = await fetch(`/api/token/balance?symbol=${tokenSymbol}`);
        const balanceData = await balanceRes.json();
        if (balanceData.success && balanceData.holdings) {
          setTokenBalance(balanceData.holdings.quantity);
        }

        const tokensRes = await fetch('/api/tokens');
        const tokensData = await tokensRes.json();
        if (tokensData.success && tokensData.tokens) {
          const token = tokensData.tokens.find((t: any) => t.symbol === tokenSymbol);
          if (token) {
            setTokenPrice(token.price / 100);
          }
        }
      } catch (err) {
        console.error('Failed to fetch token data:', err);
      }
    };
    fetchTokenData();
  }, [tokenSymbol]);

  const handleBuy = async () => {
    const inputAmount = parseFloat(amount);
    const nairaAmount = currency === 'NGN' ? inputAmount : inputAmount * USDT_TO_NGN;
    
    if (!inputAmount || nairaAmount < tokenPrice) {
      setError(`Minimum purchase is ${formatCurrency(tokenPrice)}`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/token/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          tokenSymbol,
          nairaAmount 
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccessMessage(`Purchase successful! ${data.purchase.tokensReceived} ${tokenSymbol} added to your holdings.`);
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

  const formatCurrency = (value: number) => {
    if (currency === 'NGN') {
      return `₦${value.toLocaleString('en-NG')}`;
    } else {
      return `$${(value / USDT_TO_NGN).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
  };

  const getAvailableBalance = () => {
    if (currency === 'NGN') {
      return (walletBalance / 100).toLocaleString('en-NG');
    } else {
      return ((walletBalance / 100) / USDT_TO_NGN).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
  };

  const getCurrencySymbol = () => currency === 'NGN' ? '₦' : '$';
  const getCurrencyLabel = () => currency === 'NGN' ? 'Naira' : 'USDT';

  return (
    <div className="bg-[#151517] rounded-lg p-4 text-gray-200">
      <div className="flex items-center mb-4">
        <span className="text-base font-semibold mr-2">Overview</span>
        <FiInfo className="text-gray-400" size={16} />
      </div>

      {/* Token Holdings */}
      <div className="mb-4 p-3 bg-[#181A20] rounded-lg">
        <div className="text-gray-400 text-sm">Your Holdings</div>
        <div className="text-white font-bold text-xl">{tokenBalance} {tokenSymbol}</div>
        {tokenBalance > 0 && (
          <div className="text-gray-400 text-sm mt-1">
            Value: {formatCurrency(tokenBalance * tokenPrice)}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4 text-sm">
        <div>
          <div className="text-gray-400">Price per Unit</div>
          <div className="font-semibold text-white">{formatCurrency(tokenPrice)}</div>
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
            className="w-full bg-[#181A20] border border-[#353945] rounded px-2 py-2 pr-24 text-white text-sm focus:outline-none focus:border-[#4459FF]"
            placeholder="0"
          />
          {/* Currency Dropdown */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <button
              onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
              className="flex items-center gap-1 bg-[#353945] px-2 py-1 rounded text-xs hover:bg-[#404550] transition-colors"
            >
              <span className={`font-bold ${currency === 'NGN' ? 'text-green-400' : 'text-blue-400'}`}>
                {getCurrencySymbol()}
              </span>
              <span className="text-white">{getCurrencyLabel()}</span>
              <FiChevronDown className="text-gray-400" size={12} />
            </button>
            
            {/* Dropdown Menu */}
            {showCurrencyDropdown && (
              <div className="absolute right-0 top-full mt-1 bg-[#1A1A1A] border border-[#353945] rounded shadow-lg z-10 min-w-[100px]">
                <button
                  onClick={() => {
                    setCurrency('NGN');
                    setShowCurrencyDropdown(false);
                    setAmount('');
                  }}
                  className={`w-full px-3 py-2 text-left text-sm hover:bg-[#353945] transition-colors ${
                    currency === 'NGN' ? 'bg-[#353945] text-green-400' : 'text-white'
                  }`}
                >
                  <span className="font-bold">₦</span> Naira
                </button>
                <button
                  onClick={() => {
                    setCurrency('USDT');
                    setShowCurrencyDropdown(false);
                    setAmount('');
                  }}
                  className={`w-full px-3 py-2 text-left text-sm hover:bg-[#353945] transition-colors ${
                    currency === 'USDT' ? 'bg-[#353945] text-blue-400' : 'text-white'
                  }`}
                >
                  <span className="font-bold">$</span> USDT
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-between text-xs mt-1">
          <span className="text-red-500">Min: {formatCurrency(tokenPrice)}</span>
          <span className="text-green-400">Available: {getCurrencySymbol()}{getAvailableBalance()}</span>
        </div>
      </div>

      {/* Quick Amount Buttons */}
      <div className="flex space-x-2 mb-2">
        {[tokenPrice, tokenPrice * 2, tokenPrice * 3, tokenPrice * 5].map((amt) => {
          const displayAmount = currency === 'NGN' ? amt : amt / USDT_TO_NGN;
          return (
            <button
              key={amt}
              onClick={() => {
                setAmount(displayAmount.toString());
                setError('');
                setSuccessMessage('');
              }}
              disabled={amt * 100 > walletBalance}
              className="flex-1 bg-[#181A20] text-gray-300 rounded py-1 hover:bg-[#353945] disabled:opacity-30 disabled:cursor-not-allowed text-xs font-medium"
            >
              {currency === 'NGN' 
                ? `₦${amt.toLocaleString('en-NG')}` 
                : `$${displayAmount.toFixed(2)}`
              }
            </button>
          );
        })}
      </div>

      {/* Buy Button */}
      <button
        onClick={handleBuy}
        disabled={loading || !amount || parseFloat(amount) < (currency === 'NGN' ? tokenPrice : tokenPrice / USDT_TO_NGN)}
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
