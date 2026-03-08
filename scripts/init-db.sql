-- Run this once in Vercel Postgres / Neon SQL editor to create all tables.

-- Reservations table
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

-- Users table (is_admin only editable via SQL editor)
CREATE TABLE IF NOT EXISTS users (
  uid TEXT PRIMARY KEY,
  email TEXT,
  display_name TEXT,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Gifts table
CREATE TABLE IF NOT EXISTS gifts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Vaquinhas table
CREATE TABLE IF NOT EXISTS vaquinhas (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed gifts
INSERT INTO gifts (id, title, description, image_url) VALUES
  ('gift-1', 'Batedeira planetária', 'Uma batedeira confiável para assar e cozinhar.', 'https://images.unsplash.com/photo-1585515320314-9d42d3a0d0a8?w=400&h=300&fit=crop'),
  ('gift-2', 'Máquina de café', 'Máquina de espresso e cappuccino para o café da manhã.', 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400&h=300&fit=crop'),
  ('gift-3', 'Cesta de piquenique', 'Cesta de vime com pratos, copos e talheres para dois.', 'https://images.unsplash.com/photo-1504281623087-1a6dd8f827c2?w=400&h=300&fit=crop'),
  ('gift-4', 'Contribuição para lua de mel', 'Contribua para o nosso fundo de lua de mel.', 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop'),
  ('gift-5', 'Coleção de jogos de tabuleiro', 'Um conjunto de jogos de tabuleiro clássicos para noites de jogos.', 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400&h=300&fit=crop'),
  ('gift-6', 'Adega de vinhos', 'Adega de madeira para 12 garrafas.', 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400&h=300&fit=crop')
ON CONFLICT (id) DO NOTHING;

-- Seed vaquinhas
INSERT INTO vaquinhas (id, title, description, image_url) VALUES
  ('vaquinha-1', 'Sofá novo', 'Um sofá confortável para a sala de estar do nosso novo lar.', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop'),
  ('vaquinha-2', 'Geladeira', 'Geladeira frost-free de duas portas para manter tudo fresquinho.', 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&h=300&fit=crop'),
  ('vaquinha-3', 'Televisão 65 polegadas', 'Smart TV 4K para as noites de filme e séries juntos.', 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop'),
  ('vaquinha-4', 'Máquina de lavar roupa', 'Máquina de lavar automática para facilitar o dia a dia.', 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400&h=300&fit=crop')
ON CONFLICT (id) DO NOTHING;

-- To make a user admin, run:
-- UPDATE users SET is_admin = TRUE WHERE email = 'user@example.com';
