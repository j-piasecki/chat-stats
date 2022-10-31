import pg from 'pg'

export async function getUserMessagesCountPerChannel(
  pool: pg.Pool,
  userName: string,
  startTimestamp: number,
  endTimestamp: number
) {
  return await pool.query(
    `
      SELECT channel_id AS id, channel_names.name, SUM(count) AS count FROM user_channels
      INNER JOIN channel_names ON channel_id=channel_names.id
      WHERE user_id=(SELECT id FROM user_names WHERE name=$1)
        AND timestamp BETWEEN $2 AND $3
      GROUP BY channel_id, channel_names.name;
    `,
    [userName, startTimestamp, endTimestamp]
  )
}
