export function percentageChange(current: number, previous: number) {
  if (previous === 0) return null; // avoid infinity
  return ((current - previous) / Math.abs(previous)) * 100;
}
