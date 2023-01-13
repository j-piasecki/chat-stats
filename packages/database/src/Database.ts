import pg from 'pg'
import { EmoteCounter } from 'chat-stats-common'
import { createTables } from './createTables.js'
import { createIndexes } from './createIndexes.js'
import { createFunctions } from './createFunctions.js'

import * as Query from './queries/index.js'

const MAX_INTEGER = 2147483647

const CONFIG = {
  user: 'chatter',
  host: 'localhost',
  database: 'chat_stats',
  password: 'password',
  port: 5432,
}

// Wzorzec: Gateway
export class Database {
  private static pool = new pg.Pool(CONFIG)

  static async tryInit() {
    await createTables(this.pool)
    await createIndexes(this.pool)
    await createFunctions(this.pool)
  }

  private static flattenEmoteCounter(emotes: EmoteCounter[]) {
    return emotes.map((counter) => {
      return { ...counter.emote, count: counter.count }
    })
  }

  static async saveMessage(
    message: string,
    timestamp: number,
    channelId: string,
    channelName: string,
    userId: string,
    userName: string,
    gameId: string,
    gameName: string,
    subscriber: boolean,
    moderator: boolean,
    turbo: boolean,
    firstMessage: boolean,
    emotes: EmoteCounter[]
  ) {
    this.pool.query(
      `
        SELECT save_message($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13::jsonb);
    `,
      [
        message,
        timestamp,
        channelId,
        channelName,
        userId,
        userName,
        gameId,
        gameName,
        subscriber,
        moderator,
        turbo,
        firstMessage,
        JSON.stringify(this.flattenEmoteCounter(emotes)),
      ]
    )
  }

  static async getMessageCountInChannel(
    channelName: string,
    startTimestamp: number,
    endTimestamp = Date.now()
  ) {
    return Query.getMessageCountInChannel(this.pool, channelName, startTimestamp, endTimestamp)
  }

  static async getUserCountInChannel(
    channelName: string,
    startTimestamp: number,
    endTimestamp = Date.now()
  ) {
    return Query.getUserCountInChannel(this.pool, channelName, startTimestamp, endTimestamp)
  }

  static async getSubscriberCountInChannel(
    channelName: string,
    startTimestamp: number,
    endTimestamp = Date.now()
  ) {
    return Query.getSubscriberCountInChannel(this.pool, channelName, startTimestamp, endTimestamp)
  }

  static async getFirstTimerCountInChannel(
    channelName: string,
    startTimestamp: number,
    endTimestamp = Date.now()
  ) {
    return Query.getFirstTimerCountInChannel(this.pool, channelName, startTimestamp, endTimestamp)
  }

  static async getTotalEmoteCountInChannel(
    channelName: string,
    startTimestamp: number,
    endTimestamp = Date.now()
  ) {
    return Query.getTotalEmoteCountInChannel(this.pool, channelName, startTimestamp, endTimestamp)
  }

  static async getMostUsedEmotesInChannel(
    channelName: string,
    startTimestamp: number,
    endTimestamp = Date.now()
  ) {
    return Query.getMostUsedEmotesInChannel(this.pool, channelName, startTimestamp, endTimestamp)
  }

  static async getEmotesMostOftenUsedAlongInChannel(
    channelName: string,
    emoteId: string,
    startTimestamp: number,
    endTimestamp = Date.now()
  ) {
    return Query.getEmotesMostOftenUsedAlongInChannel(
      this.pool,
      channelName,
      emoteId,
      startTimestamp,
      endTimestamp
    )
  }

  static async getUserMessagesCountPerChannel(
    userName: string,
    startTimestamp: number,
    endTimestamp = Date.now()
  ) {
    return Query.getUserMessagesCountPerChannel(this.pool, userName, startTimestamp, endTimestamp)
  }

  static async getMessagesInChannel(channelName: string, amount: number, before = MAX_INTEGER) {
    return Query.getMessagesInChannel(this.pool, channelName, amount, before)
  }

  static async getMessagesInChannelForUsers(
    channelName: string,
    userNames: string[],
    amount: number,
    before = MAX_INTEGER
  ) {
    return Query.getMessagesInChannelForUsers(this.pool, channelName, userNames, amount, before)
  }

  static async getTrackedChannels() {
    return Query.getTrackedChannels(this.pool)
  }
}
