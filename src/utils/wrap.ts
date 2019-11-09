export const wrap = (min: number, max: number, val: number): number => {
  if (val < min) return max
  if (val > max) return min
  return val
}
