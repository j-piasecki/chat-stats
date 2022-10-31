import pg from 'pg'

export async function getEmotesMostOftenUsedAlongInChannel(
  pool: pg.Pool,
  channelName: string,
  emoteId: string,
  startTimestamp: number,
  endTimestamp: number
) {
  if (!channelName.startsWith('#')) {
    channelName = '#' + channelName
  }

  return await pool.query(
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
