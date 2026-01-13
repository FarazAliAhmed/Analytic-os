interface AdminTableProps {
  columns: { key: string; label: string; align?: 'left' | 'center' | 'right' }[]
  children: React.ReactNode
  className?: string
  emptyMessage?: string
}

export default function AdminTable({ columns, children, className, emptyMessage }: AdminTableProps) {
  return (
    <div className={`bg-[#0A0A0A] rounded-xl border border-[#262626] ${className || ''}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#262626]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3 ${
                    col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : ''
                  }`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#262626]">
            {children}
          </tbody>
        </table>
      </div>
      {emptyMessage && (
        <div className="px-5 py-8 text-center text-gray-500">
          {emptyMessage}
        </div>
      )}
    </div>
  )
}
