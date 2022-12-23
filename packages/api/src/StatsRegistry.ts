import { QueryObject } from './query/QueryObject.js'
import { StatsCache } from './StatsCache.js'

export abstract class StatsRegistry {
  private static cache = new StatsCache()

  public static async resolve<T>(query: QueryObject<T>): Promise<T> {
    const cacheResult = this.cache.lookup(query)

    if (cacheResult !== null) {
      return cacheResult
    } else {
      const result = await query.execute()
      this.cache.save(query, result)

      return result
    }
  }
}
