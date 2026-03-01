CREATE TABLE IF NOT EXISTS users (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(150) NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contents (
  id         SERIAL PRIMARY KEY,
  title      VARCHAR(255) NOT NULL,
  body       TEXT NOT NULL,
  status     VARCHAR(20) NOT NULL DEFAULT 'draft'
               CHECK (status IN ('draft', 'published')),
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contents_user_id ON contents(user_id);
CREATE INDEX IF NOT EXISTS idx_contents_status ON contents(status);
CREATE INDEX IF NOT EXISTS idx_contents_created_at ON contents(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_contents_title_body
  ON contents USING gin(to_tsvector('english', title || ' ' || body));