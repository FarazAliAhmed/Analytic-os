"use client"

import { ReactNode } from 'react'

interface StatsCardProps {
  title: string
  value: string | number
  subtitle: string
  change: number // Percentage change
  icon?: ReactNode
}

export default function StatsCard({ title, value, subtitle, change, icon }: StatsCardProps) {
  const isPositive = change >= 0
  const changeColor = isPositive ? 'text-green-500' : 'text-red-500'
  const changePrefix = isPositive ? '↑ ' : '↓ '

  return (
    <div className="bg-[#0A0A0A] rounded-xl p-6 border border-[#262626]">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-400">{title}</h3>
        {icon && (
          <div className="w-10 h-10 bg-[#1F1F1F] rounded-lg flex items-center justify-center text-gray-400">
            {icon}
          </div>
        )}
      </div>
      
      <div className="mb-3">
        <p className="text-3xl font-bold text-white">{value}</p>
      </div>
      
      <p className="text-sm text-gray-500 mb-2">{subtitle}</p>
      
      <span className={`text-sm font-medium ${changeColor}`}>
        {changePrefix}{Math.abs(change).toFixed(1)}% vs. last month
      </span>
    </div>
  )
}
