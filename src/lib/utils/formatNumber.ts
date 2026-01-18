/**
 * Format currency values without decimals (whole numbers only)
 * @param value - The value to format
 * @param currency - Currency symbol (default: ₦)
 * @returns Formatted string with no decimals
 */
export function formatCurrency(value: number, currency: string = '₦'): string {
  return `${currency}${Math.round(value).toLocaleString('en-NG')}`;
}

/**
 * Format large numbers with abbreviations (k, m) with one decimal place
 * @param value - The value to format
 * @param currency - Currency symbol (default: ₦)
 * @returns Abbreviated string (e.g., ₦20m, ₦1.5k)
 */
export function formatLargeNumber(value: number, currency: string = '₦'): string {
  const rounded = Math.round(value);
  
  if (rounded >= 1000000) {
    const millions = rounded / 1000000;
    return `${currency}${millions.toFixed(1)}m`;
  } else if (rounded >= 1000) {
    const thousands = rounded / 1000;
    return `${currency}${thousands.toFixed(1)}k`;
  }
  return `${currency}${rounded.toLocaleString('en-NG')}`;
}

/**
 * Get full formatted value for tooltips (no decimals)
 * @param value - The value to format
 * @param currency - Currency symbol (default: ₦)
 * @returns Full formatted string
 */
export function getFullValue(value: number, currency: string = '₦'): string {
  return `${currency}${Math.round(value).toLocaleString('en-NG')}`;
}

/**
 * Format percentage values without decimals
 * @param value - The percentage value
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}
