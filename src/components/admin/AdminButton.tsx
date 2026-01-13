interface AdminButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  onClick?: () => void
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

export default function AdminButton({ variant = 'primary', size = 'md', children, onClick, className, disabled, type = 'button' }: AdminButtonProps) {
  const variants = {
    primary: 'bg-[#4459FF] text-white hover:bg-[#3348EE]',
    secondary: 'bg-[#23262F] text-white hover:bg-[#1A1D24] border border-[#858B9A33]',
    danger: 'bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20',
    ghost: 'text-gray-400 hover:text-white hover:bg-[#23262F]'
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-2.5 text-base'
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className || ''}`}
    >
      {children}
    </button>
  )
}
