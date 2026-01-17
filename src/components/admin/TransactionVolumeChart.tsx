"use client"

import { useMemo } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface ChartDataPoint {
  date: string
  volume: number
}

interface TransactionVolumeChartProps {
  data: ChartDataPoint[]
  period: 'daily' | 'weekly' | 'monthly'
  onPeriodChange: (period: 'daily' | 'weekly' | 'monthly') => void
}

export default function TransactionVolumeChart({ 
  data, 
  period, 
  onPeriodChange 
}: TransactionVolumeChartProps) {
  const periods: { value: 'daily' | 'weekly' | 'monthly'; label: string }[] = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
  ]

  // Generate sample data if no data provided
  const chartData = useMemo(() => {
    if (data && data.length > 0) return data
    
    // Generate sample data for display
    const sampleData: ChartDataPoint[] = []
    const now = new Date()
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      sampleData.push({
        date: date.toISOString().split('T')[0],
        volume: Math.floor(Math.random() * 8000) + 2000
      })
    }
    return sampleData
  }, [data])

  const formatYAxis = (value: number) => {
    if (value >= 1000000) {
      return `₦${(value / 1000000).toFixed(1)}M`
    }
    if (value >= 1000) {
      return `₦${(value / 1000).toFixed(0)}00`
    }
    return `₦${value}`
  }

  const formatTooltipValue = (value: number) => {
    return `₦${value.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const formatXAxis = (date: string) => {
    const d = new Date(date)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${months[d.getMonth()]} ${d.getDate()}`
  }

  return (
    <div className="bg-[#0A0A0A] rounded-xl p-6 border border-[#262626] h-full">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Transaction Volume</h3>
          <p className="text-xs text-gray-500">Total transaction volume over time</p>
        </div>
        <div className="flex gap-1 bg-[#1A1A1A] rounded-lg p-1">
          {periods.map((p) => (
            <button
              key={p.value}
              onClick={() => onPeriodChange(p.value)}
              className={`
                px-3 py-1.5 text-sm font-medium rounded-md transition-colors
                ${period === p.value
                  ? 'bg-[#4459FF] text-white'
                  : 'text-gray-400 hover:text-white'
                }
              `}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[280px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#858B9A33" 
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tickFormatter={formatXAxis}
              tick={{ fontSize: 11, fill: '#858B9A' }}
              axisLine={{ stroke: '#858B9A33' }}
              tickLine={false}
              dy={10}
            />
            <YAxis
              tickFormatter={formatYAxis}
              tick={{ fontSize: 11, fill: '#858B9A' }}
              axisLine={false}
              tickLine={false}
              width={55}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1A1D24',
                border: '1px solid #858B9A33',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '12px',
              }}
              labelStyle={{ color: '#858B9A' }}
              formatter={(value: number) => [formatTooltipValue(value), 'Volume']}
              labelFormatter={(label) => formatXAxis(label)}
            />
            <Area
              type="monotone"
              dataKey="volume"
              stroke="#3B82F6"
              strokeWidth={2}
              fill="url(#volumeGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
