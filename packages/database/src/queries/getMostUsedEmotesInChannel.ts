import pg from 'pg'
import { EmoteCounter } from 'chat-stats-common'

export async function getMostUsedEmotesInChannel(
  pool: pg.Pool,
  channelName: string,
  startTimestamp: number,
  endTimestamp: number
): Promise<EmoteCounter[]> {
  if (!channelName.startsWith('#')) {
    channelName = '#' + channelName
  }

  return await pool
    .query(
      `
      SELECT emote_id AS id, emotes.name, emotes.urls, emotes.animated, SUM(count) AS count from emote_usage
      INNER JOIN emotes ON emote_id=emotes.id
      WHERE channel_id=(SELECT id FROM channel_names WHERE name=$1)
        AND timestamp BETWEEN $2 AND $3
      GROUP BY emote_id, emotes.name, emotes.urls, emotes.animated
      ORDER BY SUM(count) DESC
      LIMIT 50
    `,
      [channelName, startTimestamp, endTimestamp]
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
