import pg from 'pg'

export async function getTotalEmoteCountInChannel(
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
      SELECT SUM(count) AS count from emote_usage
      WHERE channel_id=(SELECT id FROM channel_names WHERE name=$1)
        AND timestamp BETWEEN $2 AND $3
    `,
    [channelName, startTimestamp, endTimestamp]
  )
}
