export const MAX_INT = 2147483647
export const MIN_REQUESTED_MESSAGES = 50
export const MAX_REQUESTED_MESSAGES = 250
export const DEFAULT_REQUESTED_MESSAGES = 50

export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max))
}
