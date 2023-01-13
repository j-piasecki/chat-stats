import { QueryObject } from './query/QueryObject.js'
import { StatsCache } from './StatsCache.js'

// Wzorzec: Repository
export abstract class StatsRepository {
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

  public static async resolveAll(...queries: QueryObject<unknown>[]): Promise<unknown[]> {
    return await Promise.all(queries.map((query) => StatsRepository.resolve(query)))
  }
}
