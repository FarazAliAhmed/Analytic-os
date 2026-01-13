'use client'

import React, { useMemo } from 'react'

interface AnimatedSVGProps {
  variant?: 'circle' | 'grid' | 'waves' | 'particles' | 'ring'
  className?: string
  size?: number
  color?: string
}

// Deterministic random function based on seed to avoid hydration mismatch
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

// Round to consistent decimal places for SSR/client consistency
function round(num: number, decimals = 2): number {
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals)
}

export function AnimatedCircle({ className = '', size = 400 }: AnimatedSVGProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 400 400"
      className={`absolute opacity-20 animate-float ${className}`}
      style={{ animationDelay: '0s' }}
    >
      <defs>
        <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4459FF" className="gradient-animate" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
      </defs>
      <circle
        cx="200"
        cy="200"
        r="150"
        fill="none"
        stroke="url(#circleGradient)"
        strokeWidth="1"
        opacity="0.5"
      />
      <circle
        cx="200"
        cy="200"
        r="100"
        fill="none"
        stroke="url(#circleGradient)"
        strokeWidth="1"
        opacity="0.3"
        className="animate-pulse-slow"
      />
      <circle
        cx="200"
        cy="200"
        r="50"
        fill="none"
        stroke="url(#circleGradient)"
        strokeWidth="1"
        opacity="0.2"
      />
    </svg>
  )
}

export function AnimatedGrid({ className = '', size = 600 }: AnimatedSVGProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 600 600"
      className={`absolute opacity-10 ${className}`}
      style={{ animationDelay: '2s' }}
    >
      <defs>
        <pattern id="gridPattern" width="60" height="60" patternUnits="userSpaceOnUse">
          <path
            d="M 60 0 L 0 0 0 60"
            fill="none"
            stroke="#4459FF"
            strokeWidth="0.5"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#gridPattern)" className="animate-shimmer" />
    </svg>
  )
}

export function AnimatedWaves({ className = '', size = 800 }: AnimatedSVGProps) {
  return (
    <svg
      width={size}
      height="200"
      viewBox="0 0 800 200"
      className={`absolute bottom-0 left-0 w-full opacity-30 ${className}`}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4459FF" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#7C3AED" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#4459FF" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <path
        d="M0,100 C200,50 400,150 600,100 C800,50 800,100 800,100 L800,200 L0,200 Z"
        fill="url(#waveGradient)"
        className="animate-float"
        style={{ animationDuration: '8s' }}
      />
      <path
        d="M0,130 C200,80 400,180 600,130 C800,80 800,130 800,130 L800,200 L0,200 Z"
        fill="url(#waveGradient)"
        opacity="0.5"
        className="animate-float"
        style={{ animationDuration: '10s', animationDelay: '1s' }}
      />
    </svg>
  )
}

interface AnimatedParticlesProps {
  className?: string
  count?: number
}

export function AnimatedParticles({ className = '', count = 20 }: AnimatedParticlesProps) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      x: round(seededRandom(i * 1 + 1) * 100, 1),
      y: round(seededRandom(i * 2 + 2) * 100, 1),
      size: round(seededRandom(i * 3 + 3) * 4 + 2, 2),
      delay: round(seededRandom(i * 4 + 4) * 5, 2),
      duration: round(seededRandom(i * 5 + 5) * 3 + 4, 2),
      opacity: round(seededRandom(i * 6 + 6) * 0.5 + 0.2, 3),
    }))
  }, [count])

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((particle, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-[#4459FF]"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            opacity: particle.opacity,
            animation: `float ${particle.duration}s ease-in-out infinite`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

export function AnimatedRing({ className = '', size = 300 }: AnimatedSVGProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 300 300"
      className={`absolute ${className}`}
      style={{ animationDelay: '0.5s' }}
    >
      <defs>
        <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4459FF" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
      </defs>
      <circle
        cx="150"
        cy="150"
        r="120"
        fill="none"
        stroke="url(#ringGradient)"
        strokeWidth="1"
        strokeDasharray="10 20"
        className="animate-spin-slow"
        style={{ animationDuration: '20s' }}
      />
      <circle
        cx="150"
        cy="150"
        r="80"
        fill="none"
        stroke="url(#ringGradient)"
        strokeWidth="1"
        strokeDasharray="5 15"
        opacity="0.5"
        className="animate-spin-slow"
        style={{ animationDuration: '15s', animationDirection: 'reverse' }}
      />
    </svg>
  )
}

// Combined background for hero section
export function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <AnimatedCircle size={600} className="-top-20 -right-20" />
      <AnimatedRing size={400} className="-bottom-20 -left-20" />
      <AnimatedGrid size={800} className="opacity-5" />
      <AnimatedParticles count={30} className="h-full w-full" />
    </div>
  )
}

// Minimal background for fintech - cleaner, less distraction
export function HeroBackgroundMinimal() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Subtle gradient orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#4459FF]/10 rounded-full blur-3xl animate-float" style={{ animationDuration: '10s' }} />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#7C3AED]/10 rounded-full blur-3xl animate-float" style={{ animationDuration: '12s', animationDelay: '2s' }} />

      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[0.03]">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid-minimal" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#4459FF" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-minimal)" />
        </svg>
      </div>

      {/* Subtle particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-[#4459FF] animate-pulse-slow"
            style={{
              left: `${15 + (i * 6) % 70}%`,
              top: `${10 + (i * 7) % 80}%`,
              width: Math.random() * 3 + 2,
              height: Math.random() * 3 + 2,
              opacity: Math.random() * 0.3 + 0.1,
              animationDuration: `${Math.random() * 3 + 3}s`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

// Export default with all variants
export default function AnimatedSVG({
  variant = 'circle',
  className = '',
  size = 400,
}: AnimatedSVGProps) {
  const variants = {
    circle: <AnimatedCircle size={size} className={className} />,
    grid: <AnimatedGrid size={size} className={className} />,
    waves: <AnimatedWaves size={size} className={className} />,
    particles: <AnimatedParticles count={20} className={className} />,
    ring: <AnimatedRing size={size} className={className} />,
  }

  return variants[variant] || variants.circle
}
