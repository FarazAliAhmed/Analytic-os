/**
 * Calculate yield for an investment based on APY and weeks elapsed
 * Formula: Weekly_Yield = (Investment_Amount × APY%) / 52
 * Total_Yield = Weekly_Yield × weeksElapsed
 */
export function calculateYield(
  investmentAmount: number,  // in Naira
  annualYieldPercent: number, // e.g., 20 for 20%
  purchaseDate: Date
): number {
  const now = new Date()
  const msPerWeek = 7 * 24 * 60 * 60 * 1000
  const weeksSincePurchase = Math.floor(
    (now.getTime() - purchaseDate.getTime()) / msPerWeek
  )
  
  const weeklyYield = (investmentAmount * (annualYieldPercent / 100)) / 52
  return weeklyYield * weeksSincePurchase
}
