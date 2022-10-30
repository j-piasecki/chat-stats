import pg from 'pg'

export async function createFunctions(pool: pg.Pool) {
  await pool.query(`
    CREATE OR REPLACE FUNCTION save_message(
      v_msg VARCHAR(500),
      v_timestamp BIGINT,
      v_channel_id INT,
      v_channel_name VARCHAR(50),
      v_user_id INT,
      v_user_name VARCHAR(50),
      v_subscriber BOOLEAN,
      v_moderator BOOLEAN,
      v_turbo BOOLEAN,
      v_first_message BOOLEAN
    )
    RETURNS void
    LANGUAGE plpgsql
    AS $$
    DECLARE
      rounded_timestamp BIGINT := (v_timestamp / 86400000) * 86400000;
    BEGIN
      INSERT INTO channel_names (id, name)
        VALUES (v_channel_id, v_channel_name)
        ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;
      INSERT INTO user_names (id, name)
        VALUES (v_user_id, v_user_name)
        ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;
      INSERT INTO user_channels (timestamp, user_id, channel_id, count)
        VALUES (rounded_timestamp, v_user_id, v_channel_id, 1)
        ON CONFLICT (timestamp, user_id, channel_id) DO UPDATE SET count=user_channels.count + 1;
      INSERT INTO messages (message, timestamp, channel_id, user_id, user_name, subscriber, moderator, turbo, first_message)
        VALUES (v_msg, v_timestamp, v_channel_id, v_user_id, v_user_name, v_subscriber, v_moderator, v_turbo, v_first_message);
    END; $$;
  `)

  await pool.query(`
    CREATE OR REPLACE FUNCTION update_emotes(
      v_data JSONB,
      v_timestamp BIGINT,
      v_channel_id INT,
      v_channel_name VARCHAR(50),
      v_user_id INT,
      v_user_name VARCHAR(50)
    )
    RETURNS void
    LANGUAGE plpgsql
    AS $$
    DECLARE
      rounded_timestamp BIGINT := (v_timestamp / 86400000) * 86400000;
      emote JSONB;
      v_emote_id VARCHAR(64);
      v_emote_name VARCHAR(64);
      v_emote_count VARCHAR(64);
      v_emote_urls JSONB;
      v_emote_animated BOOLEAN;
    BEGIN
      INSERT INTO channel_names (id, name)
        VALUES (v_channel_id, v_channel_name)
        ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;
      INSERT INTO user_names (id, name)
        VALUES (v_user_id, v_user_name)
        ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;
      
      FOR emote IN SELECT * FROM jsonb_array_elements(v_data)
      LOOP
        FOR v_emote_id, v_emote_name, v_emote_animated, v_emote_count, v_emote_urls IN SELECT * FROM jsonb_to_record(emote) as x(
          id VARCHAR(64),
          name VARCHAR(64),
          animated BOOLEAN,
          count INT,
          urls JSONB
        )
        LOOP
          INSERT INTO emotes(id, name, animated, urls)
          VALUES(v_emote_id, v_emote_name, v_emote_animated, v_emote_urls)
          ON CONFLICT(id) DO NOTHING;
          
          INSERT INTO emote_usage (timestamp, channel_id, user_id, emote_id, count)
          VALUES (rounded_timestamp, v_channel_id, v_user_id, v_emote_id, 1)
          ON CONFLICT (timestamp, user_id, channel_id, emote_id) DO UPDATE SET count=emote_usage.count + 1;
        END LOOP;
      END LOOP;
    END; $$;
  `)
}
