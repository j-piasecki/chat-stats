import pg from 'pg'
import { EmoteCounter } from './EmoteCounter.js'
import { createTables } from './createTables.js'
import { createIndexes } from './createIndexes.js'
import { createFunctions } from './createFunctions.js'

const CONFIG = {
  user: 'chatter',
  host: 'localhost',
  database: 'chat_stats',
  password: 'password',
  port: 5432,
}

export class Database {
  private static pool = new pg.Pool(CONFIG)

  static async tryInit() {
    await createTables(this.pool)
    await createIndexes(this.pool)
    await createFunctions(this.pool)
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
    gameThumbnailUrl: string,
    subscriber: boolean,
    moderator: boolean,
    turbo: boolean,
    firstMessage: boolean,
    emotes: EmoteCounter[]
  ) {
    this.pool.query(
      `
        SELECT save_message($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14::jsonb);
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
        gameThumbnailUrl,
        subscriber,
        moderator,
        turbo,
        firstMessage,
        JSON.stringify(emotes),
      ]
    )
  }

  static async getMessageCountInChannel(
    channelName: string,
    startTimestamp: number,
    endTimestamp = Date.now()
  ) {
    if (!channelName.startsWith('#')) {
      channelName = '#' + channelName
    }

    return await this.pool.query(
      `
        SELECT SUM(count) AS count FROM user_channels
        WHERE channel_id=(SELECT id FROM channel_names WHERE name=$1)
          AND timestamp BETWEEN $2 AND $3;
    `,
      [channelName, startTimestamp, endTimestamp]
    )
  }

  static async getUserCountInChannel(
    channelName: string,
    startTimestamp: number,
    endTimestamp = Date.now()
  ) {
    if (!channelName.startsWith('#')) {
      channelName = '#' + channelName
    }

    return await this.pool.query(
      `
        SELECT COUNT(*) AS count FROM (
          SELECT DISTINCT user_id from user_channels
          WHERE channel_id=(SELECT id FROM channel_names WHERE name=$1)
              AND timestamp BETWEEN $2 AND $3
        ) as temp
    `,
      [channelName, startTimestamp, endTimestamp]
    )
  }

  static async getSubscriberCountInChannel(
    channelName: string,
    startTimestamp: number,
    endTimestamp = Date.now()
  ) {
    if (!channelName.startsWith('#')) {
      channelName = '#' + channelName
    }

    return await this.pool.query(
      `
        SELECT COUNT(*) AS count FROM (
          SELECT DISTINCT user_id FROM messages
          WHERE channel_id=(SELECT id FROM channel_names WHERE name=$1)
            AND subscriber=true
            AND timestamp BETWEEN $2 AND $3
        ) AS temp
    `,
      [channelName, startTimestamp, endTimestamp]
    )
  }

  static async getFirstTimerCountInChannel(
    channelName: string,
    startTimestamp: number,
    endTimestamp = Date.now()
  ) {
    if (!channelName.startsWith('#')) {
      channelName = '#' + channelName
    }

    return await this.pool.query(
      `
        SELECT COUNT(*) AS count FROM (
          SELECT DISTINCT user_id FROM messages
          WHERE channel_id=(SELECT id FROM channel_names WHERE name=$1)
            AND first_message=true
            AND timestamp BETWEEN $2 AND $3
        ) AS temp
    `,
      [channelName, startTimestamp, endTimestamp]
    )
  }

  static async getTotalEmoteCountInChannel(
    channelName: string,
    startTimestamp: number,
    endTimestamp = Date.now()
  ) {
    if (!channelName.startsWith('#')) {
      channelName = '#' + channelName
    }

    return await this.pool.query(
      `
        SELECT SUM(count) AS count from emote_usage
        WHERE channel_id=(SELECT id FROM channel_names WHERE name=$1)
          AND timestamp BETWEEN $2 AND $3
    `,
      [channelName, startTimestamp, endTimestamp]
    )
  }

  static async getMostUsedEmotesInChannel(
    channelName: string,
    startTimestamp: number,
    endTimestamp = Date.now()
  ) {
    if (!channelName.startsWith('#')) {
      channelName = '#' + channelName
    }

    return await this.pool.query(
      `
        SELECT emote_id AS id, emotes.name, emotes.urls, SUM(count) AS count from emote_usage
        INNER JOIN emotes ON emote_id=emotes.id
        WHERE channel_id=(SELECT id FROM channel_names WHERE name=$1)
          AND timestamp BETWEEN $2 AND $3
        GROUP BY emote_id, emotes.name, emotes.urls
        ORDER BY SUM(count) DESC
        LIMIT 50
    `,
      [channelName, startTimestamp, endTimestamp]
    )
  }

  static async getEmotesMostOftenUsedAlongInChannel(
    channelName: string,
    emoteId: string,
    startTimestamp: number,
    endTimestamp = Date.now()
  ) {
    if (!channelName.startsWith('#')) {
      channelName = '#' + channelName
    }

    return await this.pool.query(
      `
        SELECT emotes.id, emotes.name, emotes.urls, SUM(count) as count
        FROM emotes_in_messages
        INNER JOIN messages ON message_id=messages.id
        INNER JOIN emotes ON emote_id=emotes.id
        WHERE channel_id=(SELECT id FROM channel_names WHERE name=$1)
        AND message_id IN (
          SELECT message_id
          FROM emotes_in_messages
          WHERE emote_id=$2
        )
        AND emote_id != $2
        AND timestamp BETWEEN $3 AND $4
        GROUP BY emotes.id, emotes.name, emotes.urls
        ORDER BY SUM(count) DESC
        LIMIT 10
    `,
      [channelName, emoteId, startTimestamp, endTimestamp]
    )
  }

  static async getUserMessagesCountPerChannel(
    userName: string,
    startTimestamp: number,
    endTimestamp = Date.now()
  ) {
    return await this.pool.query(
      `
        SELECT channel_id AS id, channel_names.name, SUM(count) AS count FROM user_channels
        INNER JOIN channel_names ON channel_id=channel_names.id
        WHERE user_id=(SELECT id FROM user_names WHERE name=$1)
          AND timestamp BETWEEN $2 AND $3
        GROUP BY channel_id, channel_names.name;
    `,
      [userName, startTimestamp, endTimestamp]
    )
  }
}
