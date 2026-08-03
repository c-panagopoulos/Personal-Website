CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS chunks (
  id SERIAL PRIMARY KEY,
  source TEXT NOT NULL,
  chunk_index INTEGER NOT NULL,
  content TEXT NOT NULL,
  embedding vector({{DIM}}),
  UNIQUE (source, chunk_index)
);

-- No ANN index (ivfflat/hnsw): at portfolio scale (tens to low hundreds of
-- chunks) an exact sequential scan over embedding <=> is both correct and
-- fast. An ivfflat index built before data exists trains on empty clusters
-- and silently returns zero results — not worth the tradeoff at this size.
