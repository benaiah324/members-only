-- App-specific tables to avoid conflicts with other apps on shared Postgres instances
CREATE TABLE IF NOT EXISTS club_users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  membership_status BOOLEAN NOT NULL DEFAULT FALSE,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS club_messages (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id INTEGER NOT NULL REFERENCES club_users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_club_messages_user_id ON club_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_club_messages_created_at ON club_messages(created_at DESC);
