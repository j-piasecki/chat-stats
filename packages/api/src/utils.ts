import { Request, Response, NextFunction } from 'express'

export const MAX_INT = 2147483647
export const MIN_REQUESTED_MESSAGES = 50
export const MAX_REQUESTED_MESSAGES = 250
export const DEFAULT_REQUESTED_MESSAGES = 50

export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max))
}

export const extractTimestamps = (req: Request, res: Response, next: NextFunction) => {
  let period = 0

  switch (req.query.period) {
    case '1d':
      period = 1
      break
    case '3d':
      period = 3
      break
    case '7d':
      period = 7
      break
    case '30d':
      period = 30
      break
    default:
      period = 1
      break
  }

  req.query.period = String(period)
  req.query.before = String(Date.now())
  req.query.after = String(Date.now() - period * 24 * 60 * 60 * 1000)

  next()
}
