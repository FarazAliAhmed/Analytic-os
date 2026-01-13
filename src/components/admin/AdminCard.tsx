interface AdminCardProps {
  title?: string
  subtitle?: string
  children: React.ReactNode
  className?: string
  action?: React.ReactNode
}

export default function AdminCard({ title, subtitle, children, className, action }: AdminCardProps) {
  return (
    <div className={`bg-[#0A0A0A] rounded-xl border border-[#262626] p-5 ${className || ''}`}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-4">
          {title && (
            <div>
              {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
              {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
            </div>
          )}
          {action}
        </div>
      )}
      {children}
    </div>
  )
}
