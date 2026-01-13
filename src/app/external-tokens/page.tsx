'use client'

import { useState, useEffect } from 'react'
import { ExternalToken } from '@/lib/getequity/client'
import ExternalTokenCard from '@/components/external/ExternalTokenCard'
import { Loader2, RefreshCw, Globe, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function ExternalTokensPage() {
  const [tokens, setTokens] = useState<ExternalToken[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sandbox, setSandbox] = useState(false)
  const [source, setSource] = useState<string>('')

  useEffect(() => {
    fetchTokens()
  }, [sandbox])

  const fetchTokens = async () => {
    try {
      setLoading(true)
      setError(null)

      const url = `/api/external-tokens/getequity${sandbox ? '?sandbox=true' : ''}`
      const res = await fetch(url)

      if (!res.ok) {
        throw new Error('Failed to fetch tokens')
      }

      const data = await res.json()
      setTokens(data.tokens || [])
      setSource(data.source || '')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    fetchTokens()
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Header */}
      <header className="bg-[#181A20] border-b border-[#262626]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="p-2 hover:bg-[#23262F] rounded-lg transition-colors"
              >
                <ArrowUpRight className="w-5 h-5 text-gray-400" />
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-white">External Investments</h1>
                <p className="text-sm text-gray-400">Explore investment opportunities from GetEquitiy</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Sandbox Toggle */}
              <button
                onClick={() => setSandbox(!sandbox)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  sandbox
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    : 'bg-gray-800 text-gray-400'
                }`}
              >
                {sandbox ? 'Sandbox Mode' : 'Production'}
              </button>

              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 text-gray-400 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Banner */}
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 mb-6 flex items-start gap-3">
          <Globe className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-purple-400">Powered by GetEquitiy</h3>
            <p className="text-sm text-gray-400 mt-1">
              These investment opportunities are sourced from GetEquitiy. Click &quot;Invest&quot; to be redirected to their platform for purchase and payment.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
            <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />
            <p className="text-red-400">{error}</p>
            <button
              onClick={handleRefresh}
              className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : tokens.length === 0 ? (
          <div className="text-center py-16">
            <Globe className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No tokens available</h3>
            <p className="text-gray-400">
              {sandbox
                ? 'Sandbox mode is enabled but no test tokens are available.'
                : 'No tokens available from GetEquitiy at this time.'}
            </p>
          </div>
        ) : (
          <>
            <p className="text-gray-400 mb-6">
              Found {tokens.length} investment opportunity{tokens.length !== 1 ? 's' : ''}
              {source && <span className="text-purple-400"> from {source}</span>}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tokens.map((token) => (
                <ExternalTokenCard key={token.id} token={token} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}

function ArrowUpRight({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
    </svg>
  )
}
