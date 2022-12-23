import { QueryObject } from './query/QueryObject.js'
import { isUserMessagesCountPerChannelQuery } from './query/UserMessagesCountPerChannelQuery.js'

function periodToCacheLifespan(period: number): number {
  switch (period) {
    case 1:
      return 10 * 60 * 1000 // 10 minutes
    case 3:
      return 30 * 60 * 1000 // 30 minutes
    case 7:
      return 60 * 60 * 1000 // 1 hour
    case 30:
      return 4 * 60 * 60 * 1000 // 4 hours
    default:
      return 24 * 60 * 60 * 1000 // 1 day
  }
}

export class StatsCache {
  private cache: Record<string, any> = {}

  public lookup<T>(query: QueryObject<T>): T | null {
    const queryCache = this.cache[query.type]
    if (queryCache === undefined) {
      return null
    }

    if (isUserMessagesCountPerChannelQuery(query)) {
      // basically check if queryCache[user][period] exists and is up-to-date-ish
      const userCache = queryCache[query.user]

      if (userCache !== undefined) {
        const periodCache = userCache[query.period]

        if (
          periodCache !== undefined &&
          Date.now() - periodCache.timestamp < periodToCacheLifespan(query.period)
        ) {
          return periodCache.data
        }
      }
    }

    return null
  }

  public save<T>(query: QueryObject<T>, data: T) {
    if (isUserMessagesCountPerChannelQuery(query)) {
      if (this.cache[query.type] === undefined) {
        this.cache[query.type] = {}
      }

      if (this.cache[query.type][query.user] === undefined) {
        this.cache[query.type][query.user] = {}
      }

      this.cache[query.type][query.user][query.period] = {
        data: data,
        timestamp: Date.now(),
      }
    }
  }
}
