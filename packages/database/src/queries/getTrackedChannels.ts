import pg from 'pg'
import { Channel } from 'chat-stats-common'

export async function getTrackedChannels(pool: pg.Pool): Promise<Channel[]> {
  return await pool
    .query(
      `
      SELECT id, name FROM channel_names
      ORDER BY name;
    `
    )
    .then((result) =>
      result.rows.map((row): Channel => {
        return {
          id: `${row.id}`,
          name: row.name,
        }
      })
    )
}
