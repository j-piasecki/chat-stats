import pg from 'pg'

export async function getFirstTimerCountInChannel(
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
        SELECT DISTINCT user_id FROM messages
        WHERE channel_id=(SELECT id FROM channel_names WHERE name=$1)
          AND first_message=true
          AND timestamp BETWEEN $2 AND $3
      ) AS temp
    `,
    [channelName, startTimestamp, endTimestamp]
  )
}
