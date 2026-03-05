-- Run this once in Vercel Postgres / Neon SQL editor to create the reservations table.

CREATE TABLE IF NOT EXISTS reservations (
  id SERIAL PRIMARY KEY,
  gift_id TEXT NOT NULL UNIQUE,
  reserved_by TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reservations_gift_id ON reservations (gift_id);
