import pg from 'pg'
import { EmoteCounter } from 'chat-stats-common'

export async function getEmotesMostOftenUsedAlongInChannel(
  pool: pg.Pool,
  channelName: string,
  emoteId: string,
  startTimestamp: number,
  endTimestamp: number
): Promise<EmoteCounter[]> {
  if (!channelName.startsWith('#')) {
    channelName = '#' + channelName
  }

  return await pool
    .query(
      `
      SELECT emotes.id, emotes.name, emotes.urls, emotes.animated, SUM(count) as count
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
      GROUP BY emotes.id, emotes.name, emotes.urls, emotes.animated
      ORDER BY SUM(count) DESC
      LIMIT 10
    `,
      [channelName, emoteId, startTimestamp, endTimestamp]
    )
    .then((result) =>
      result.rows.map((row): EmoteCounter => {
        return {
          id: row.id,
          name: row.name,
          urls: row.urls,
          animated: row.animated,
          count: Number(row.count),
        }
      })
    )
}
