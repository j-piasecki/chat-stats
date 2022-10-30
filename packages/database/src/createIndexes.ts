import pg from 'pg'

export async function createIndexes(pool: pg.Pool) {
  await pool.query(`
    CREATE INDEX IF NOT EXISTS channel_timestamp_index ON messages(
      channel_id,
      timestamp DESC
    );
  `)

  await pool.query(`
    CREATE INDEX IF NOT EXISTS channel_user_timestamp_index ON messages(
      channel_id,
      user_id,
      timestamp DESC
    );
  `)

  await pool.query(`
    CREATE INDEX IF NOT EXISTS user_timestamp_index ON messages(
      user_id,
      timestamp DESC
    );
  `)

  await pool.query(`
    CREATE INDEX IF NOT EXISTS channel_timestamp_index ON emote_usage(
      channel_id,
      timestamp DESC
    );
  `)

  await pool.query(`
    CREATE INDEX IF NOT EXISTS channel_user_timestamp_index ON emote_usage(
      channel_id,
      user_id,
      timestamp DESC
    );
  `)

  await pool.query(`
    CREATE INDEX IF NOT EXISTS user_timestamp_index ON emote_usage(
      user_id,
      timestamp DESC
    );
  `)

  await pool.query(`
    CREATE INDEX IF NOT EXISTS user_timestamp_index ON user_channels(
      user_id,
      timestamp DESC
    );
  `)

  await pool.query(`
    CREATE INDEX IF NOT EXISTS channel_names_index ON channel_names USING hash(
      name
    );
  `)

  await pool.query(`
    CREATE INDEX IF NOT EXISTS user_names_index ON user_names USING hash(
      name
    );
  `)

  await pool.query(`
    CREATE INDEX IF NOT EXISTS emote_names_index ON emotes USING hash(
      name
    );
  `)
}
