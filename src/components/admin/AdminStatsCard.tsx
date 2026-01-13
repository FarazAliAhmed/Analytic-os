interface AdminStatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  change?: number
  icon: React.ReactNode
  className?: string
}

export default function AdminStatsCard({ title, value, subtitle, change, icon, className }: AdminStatsCardProps) {
  return (
    <div className={`bg-[#23262F] rounded-xl p-5 ${className || ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className="w-10 h-10 bg-[#4459FF]/10 rounded-lg flex items-center justify-center text-[#4459FF]">
          {icon}
        </div>
      </div>
      {change !== undefined && (
        <div className="mt-3 flex items-center gap-1">
          <span className={`text-xs font-medium ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {change >= 0 ? '+' : ''}{change}%
          </span>
          <span className="text-xs text-gray-500">vs last month</span>
        </div>
      )}
    </div>
  )
}
