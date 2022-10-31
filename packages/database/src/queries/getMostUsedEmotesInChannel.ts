import pg from 'pg'

export async function getMostUsedEmotesInChannel(
  pool: pg.Pool,
  channelName: string,
  startTimestamp: number,
  endTimestamp: number
) {
  if (!channelName.startsWith('#')) {
    channelName = '#' + channelName
  }

  return await pool.query(
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
