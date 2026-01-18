/**
 * Calculate daily yield for an investment based on APY
 * Formula: Daily_Yield = (Investment_Amount × APY%) / 365
 */
export function calculateDailyYield(
  investmentAmount: number,  // in Naira
  annualYieldPercent: number // e.g., 18 for 18%
): number {
  return (investmentAmount * (annualYieldPercent / 100)) / 365
}

/**
 * Calculate accumulated yield since last update
 * Formula: Accumulated_Yield = Daily_Yield × days_elapsed
 */
export function calculateAccumulatedYield(
  investmentAmount: number,  // in Naira
  annualYieldPercent: number, // e.g., 18 for 18%
  lastYieldUpdate: Date
): number {
  const now = new Date()
  const msPerDay = 24 * 60 * 60 * 1000
  const daysSinceLastUpdate = Math.floor(
    (now.getTime() - lastYieldUpdate.getTime()) / msPerDay
  )
  
  const dailyYield = calculateDailyYield(investmentAmount, annualYieldPercent)
  return dailyYield * daysSinceLastUpdate
}

/**
 * Calculate total yield including accumulated yield
 * Formula: Total_Yield = (Current_Value - Total_Invested) + Accumulated_Yield
 */
export function calculateTotalYield(
  currentValue: number,      // Current market value
  totalInvested: number,      // Total amount invested
  accumulatedYield: number    // Accumulated yield from APY
): number {
  const unrealizedGainLoss = currentValue - totalInvested
  return unrealizedGainLoss + accumulatedYield
}
