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
    channelId: number,
    channelName: string,
    userId: number,
    userName: string,
    subscriber: boolean,
    moderator: boolean,
    turbo: boolean,
    firstMessage: boolean
  ) {
    this.pool.query(
      `
        SELECT save_message($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);
    `,
      [
        message,
        Date.now(),
        channelId,
        channelName,
        userId,
        userName,
        subscriber,
        moderator,
        turbo,
        firstMessage,
      ]
    )
  }

  static async updateEmoteUsage(
    data: EmoteCounter[],
    channelId: number,
    channelName: string,
    userId: number,
    userName: string
  ) {
    await this.pool.query(
      `
      SELECT update_emotes($1::jsonb, $2, $3, $4, $5, $6);
    `,
      [JSON.stringify(data), Date.now(), channelId, channelName, userId, userName]
    )
  }
}
