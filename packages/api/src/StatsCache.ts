import { QueryObject } from './query/QueryObject.js'
import { isUserMessagesCountPerChannelQuery } from './query/UserMessagesCountPerChannelQuery.js'
import { isUserCountInChannel } from './query/UserCountInChannel.js'
import { isTotalEmoteCountInChannel } from './query/TotalEmoteCountInChannel.js'
import { isSubscriberCountInChannel } from './query/SubscriberCountInChannel.js'
import { isMostUsedEmotesInChannel } from './query/MostUsedEmotesInChannel.js'
import { isMessageCountInChannel } from './query/MessageCountInChannel.js'
import { isFirstTimerCountInChannel } from './query/FirstTimerCountInChannel.js'
import { isEmotesMostOftenUsedAlongInChannel } from './query/EmotesMostOftenUsedAlongInChannel.js'

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
    } else if (
      isUserCountInChannel(query) ||
      isTotalEmoteCountInChannel(query) ||
      isSubscriberCountInChannel(query) ||
      isMostUsedEmotesInChannel(query) ||
      isMessageCountInChannel(query) ||
      isFirstTimerCountInChannel(query)
    ) {
      // basically check if queryCache[channel][period] exists and is up-to-date-ish
      const channelCache = queryCache[query.channel]

      if (channelCache !== undefined) {
        const periodCache = channelCache[query.period]

        if (
          periodCache !== undefined &&
          Date.now() - periodCache.timestamp < periodToCacheLifespan(query.period)
        ) {
          return periodCache.data
        }
      }
    } else if (isEmotesMostOftenUsedAlongInChannel(query)) {
      // basically check if queryCache[channel][emoteId][period] exists and is up-to-date-ish
      const channelCache = queryCache[query.channel]

      if (channelCache !== undefined) {
        const emoteCache = channelCache[query.emoteId]

        if (emoteCache !== undefined) {
          const periodCache = emoteCache[query.period]

          if (
            periodCache !== undefined &&
            Date.now() - periodCache.timestamp < periodToCacheLifespan(query.period)
          ) {
            return periodCache.data
          }
        }
      }
    }

    return null
  }

  public save<T>(query: QueryObject<T>, data: T) {
    if (this.cache[query.type] === undefined) {
      this.cache[query.type] = {}
    }

    if (isUserMessagesCountPerChannelQuery(query)) {
      if (this.cache[query.type][query.user] === undefined) {
        this.cache[query.type][query.user] = {}
      }

      this.cache[query.type][query.user][query.period] = {
        data: data,
        timestamp: Date.now(),
      }
    } else if (
      isUserCountInChannel(query) ||
      isTotalEmoteCountInChannel(query) ||
      isSubscriberCountInChannel(query) ||
      isMostUsedEmotesInChannel(query) ||
      isMessageCountInChannel(query) ||
      isFirstTimerCountInChannel(query)
    ) {
      if (this.cache[query.type][query.channel] === undefined) {
        this.cache[query.type][query.channel] = {}
      }

      this.cache[query.type][query.channel][query.period] = {
        data: data,
        timestamp: Date.now(),
      }
    } else if (isEmotesMostOftenUsedAlongInChannel(query)) {
      if (this.cache[query.type][query.channel] === undefined) {
        this.cache[query.type][query.channel] = {}
      }

      if (this.cache[query.type][query.channel][query.emoteId] === undefined) {
        this.cache[query.type][query.channel][query.emoteId] = {}
      }

      this.cache[query.type][query.channel][query.emoteId][query.period] = {
        data: data,
        timestamp: Date.now(),
      }
    }
  }
}
