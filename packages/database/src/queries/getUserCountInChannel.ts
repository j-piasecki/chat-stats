import pg from 'pg'

export async function getUserCountInChannel(
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
      SELECT COUNT(*) AS count FROM (
        SELECT DISTINCT user_id from user_channels
        WHERE channel_id=(SELECT id FROM channel_names WHERE name=$1)
            AND timestamp BETWEEN $2 AND $3
      ) as temp
    `,
    [channelName, startTimestamp, endTimestamp]
  )
}
