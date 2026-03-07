-- Run this once in Vercel Postgres / Neon SQL editor to create the reservations table.

CREATE TABLE IF NOT EXISTS reservations (
  id SERIAL PRIMARY KEY,
  gift_id TEXT NOT NULL UNIQUE,
  user_uid TEXT NOT NULL,
  user_email TEXT,
  reserved_by TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reservations_gift_id ON reservations (gift_id);
CREATE INDEX IF NOT EXISTS idx_reservations_user_uid ON reservations (user_uid);

-- Migration from old schema (if table already exists without user_uid):
-- ALTER TABLE reservations ADD COLUMN IF NOT EXISTS user_uid TEXT NOT NULL DEFAULT '';
-- ALTER TABLE reservations ADD COLUMN IF NOT EXISTS user_email TEXT;
