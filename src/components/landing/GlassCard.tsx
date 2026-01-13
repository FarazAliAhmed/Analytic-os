'use client'

import React, { ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  glow?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
  onClick?: () => void
}

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

export function GlassCard({
  children,
  className = '',
  hover = false,
  glow = false,
  padding = 'md',
  onClick,
}: GlassCardProps) {
  const baseClasses = `
    glass rounded-2xl
    ${paddingStyles[padding]}
    ${hover ? 'glass-hover cursor-pointer transition-all duration-300' : ''}
    ${glow ? 'shadow-lg shadow-[#4459FF]/10' : ''}
    ${onClick ? 'cursor-pointer' : ''}
    ${className}
  `

  return (
    <div className={baseClasses} onClick={onClick}>
      {children}
    </div>
  )
}

// Feature card with icon
interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
  className?: string
}

export function FeatureCard({ icon, title, description, className = '' }: FeatureCardProps) {
  return (
    <GlassCard hover className={`flex flex-col items-start gap-4 ${className}`} padding="lg">
      <div className="w-12 h-12 rounded-xl bg-[#4459FF]/20 flex items-center justify-center text-[#4459FF]">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </GlassCard>
  )
}

// Stat card for metrics
interface StatCardProps {
  value: string
  label: string
  change?: string
  positive?: boolean
  className?: string
}

export function StatCard({ value, label, change, positive, className = '' }: StatCardProps) {
  return (
    <GlassCard padding="md" className={className}>
      <p className="text-gray-400 text-sm mb-1">{label}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
      {change && (
        <p className={`text-sm mt-2 ${positive ? 'text-green-400' : 'text-red-400'}`}>
          {change}
        </p>
      )}
    </GlassCard>
  )
}

// Glowing accent card
export function GlowingCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <GlassCard
      className={`relative overflow-hidden ${className}`}
      glow
      padding="lg"
    >
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#4459FF]/20 rounded-full blur-3xl" />
      <div className="relative z-10">{children}</div>
    </GlassCard>
  )
}

export default GlassCard
