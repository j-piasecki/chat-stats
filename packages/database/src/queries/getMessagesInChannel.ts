import pg from 'pg'
import { Message } from 'chat-stats-common'

export async function getMessagesInChannel(
  pool: pg.Pool,
  channelName: string,
  amount: number,
  before: number
): Promise<Message[]> {
  if (!channelName.startsWith('#')) {
    channelName = '#' + channelName
  }

  return await pool
    .query(
      `
      SELECT * FROM messages
      WHERE channel_id=(SELECT id FROM channel_names WHERE name=$1)
        AND id < $2
      ORDER BY id DESC
      LIMIT $3;
    `,
      [channelName, before, amount]
    )
    .then((result) =>
      result.rows.map((row): Message => {
        return {
          id: row.id,
          message: row.message,
          timestamp: Number(row.timestamp),
          channel_id: `${row.channel_id}`,
          user: {
            id: `${row.user_id}`,
            name: `${row.user_name}`,
          },
          game_id: row.game_id,
          subscriber: row.subscriber,
          moderator: row.moderator,
          turbo: row.turbo,
          first_message: row.first_message,
        }
      })
    )
}
