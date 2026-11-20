CREATE TABLE IF NOT EXISTS packs (id uuid PRIMARY KEY, token_hash text NOT NULL, analysis jsonb NOT NULL, content jsonb, paid boolean NOT NULL DEFAULT false, stripe_session text UNIQUE, created_at timestamptz NOT NULL DEFAULT now(), expires_at timestamptz NOT NULL DEFAULT now() + interval '7 days');
CREATE TABLE IF NOT EXISTS rate_windows (key text PRIMARY KEY, hits integer NOT NULL, expires_at timestamptz NOT NULL);
CREATE INDEX IF NOT EXISTS packs_expiry ON packs(expires_at);
ALTER TABLE packs ADD COLUMN IF NOT EXISTS generation_started_at timestamptz;
