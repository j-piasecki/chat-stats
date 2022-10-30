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
    firstMessage: boolean
  ) {
    this.pool.query(
      `
        SELECT save_message($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13);
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
      ]
    )
  }

  static async updateEmoteUsage(
    data: EmoteCounter[],
    timestamp: number,
    channelId: string,
    channelName: string,
    userId: string,
    userName: string
  ) {
    await this.pool.query(
      `
      SELECT update_emotes($1::jsonb, $2, $3, $4, $5, $6);
    `,
      [JSON.stringify(data), timestamp, channelId, channelName, userId, userName]
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
        SELECT SUM(count) FROM user_channels
        WHERE channel_id=(SELECT id FROM channel_names WHERE name=$1)
          AND timestamp BETWEEN $2 AND $3;
    `,
      [channelName, startTimestamp, endTimestamp]
    )
  }

  static async getUserMessagesCountPerChannel(
    userName: string,
    startTimestamp: number,
    endTimestamp = Date.now()
  ) {
    return await this.pool.query(
      `
        SELECT channel_id, channel_names.name, SUM(count) FROM user_channels
        INNER JOIN channel_names ON channel_id=channel_names.id
        WHERE user_id=(SELECT id FROM user_names WHERE name=$1)
          AND timestamp BETWEEN $2 AND $3
        GROUP BY channel_id, channel_names.name;
    `,
      [userName, startTimestamp, endTimestamp]
    )
  }
}
