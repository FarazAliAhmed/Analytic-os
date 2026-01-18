/**
 * Calculate daily yield for an investment based on APY
 * Formula: Daily_Yield = (Portfolio_Value × APY%) / 365
 * Note: Uses current portfolio value, not original investment amount
 */
export function calculateDailyYield(
  portfolioValue: number,  // Current market value in Naira
  annualYieldPercent: number // e.g., 18 for 18%
): number {
  return (portfolioValue * (annualYieldPercent / 100)) / 365
}

/**
 * Calculate accumulated yield since last update
 * Formula: Accumulated_Yield = Daily_Yield × days_elapsed
 * Note: Supports partial days (e.g., 0.5 days = 12 hours)
 */
export function calculateAccumulatedYield(
  portfolioValue: number,  // Current market value in Naira
  annualYieldPercent: number, // e.g., 18 for 18%
  lastYieldUpdate: Date
): number {
  const now = new Date()
  const msPerDay = 24 * 60 * 60 * 1000
  // Use actual days elapsed (including partial days)
  const daysSinceLastUpdate = (now.getTime() - lastYieldUpdate.getTime()) / msPerDay
  
  const dailyYield = calculateDailyYield(portfolioValue, annualYieldPercent)
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
